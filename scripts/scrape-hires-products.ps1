param(
  [string] $PagesDirectory = ".\.catalog-extract\pages-hires",
  [string] $OutputDirectory = ".\public\products-hires"
)

Add-Type -AssemblyName System.Drawing
[System.IO.Directory]::CreateDirectory($OutputDirectory) | Out-Null

$source = @"
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;

public static class HiresProductExtractor
{
    public static void Extract(string sourcePath, string outputPath, int x, int y, int width, int height, int eraseX, int eraseY)
    {
        using (var page = new Bitmap(sourcePath))
        {
            x = Math.Max(0, x); y = Math.Max(0, y);
            width = Math.Min(width, page.Width - x); height = Math.Min(height, page.Height - y);
            using (var crop = new Bitmap(width, height, PixelFormat.Format32bppArgb))
            using (var cropGraphics = Graphics.FromImage(crop))
            {
                cropGraphics.DrawImage(page, new Rectangle(0, 0, width, height), new Rectangle(x, y, width, height), GraphicsUnit.Pixel);
                var rect = new Rectangle(0, 0, width, height);
                var data = crop.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
                int stride = data.Stride;
                byte[] pixels = new byte[stride * height];
                Marshal.Copy(data.Scan0, pixels, 0, pixels.Length);
                crop.UnlockBits(data);

                int total = width * height;
                byte[] foreground = new byte[total];
                for (int py = 0; py < height; py++)
                {
                    int row = py * stride;
                    for (int px = 0; px < width; px++)
                    {
                        int offset = row + px * 4;
                        int b = pixels[offset], g = pixels[offset + 1], r = pixels[offset + 2];
                        int minimum = Math.Min(r, Math.Min(g, b));
                        int maximum = Math.Max(r, Math.Max(g, b));
                        if (minimum < 248 || maximum - minimum > 7) foreground[py * width + px] = 1;
                    }
                }

                int[] labels = new int[total];
                int[] queue = new int[total];
                int nextLabel = 0, bestLabel = 0, bestCount = 0;
                double bestScore = -1;
                int bestLeft = 0, bestTop = 0, bestRight = width - 1, bestBottom = height - 1;
                int[] dx = {-1, 0, 1, -1, 1, -1, 0, 1};
                int[] dy = {-1,-1,-1,  0, 0,  1, 1, 1};

                for (int start = 0; start < total; start++)
                {
                    if (foreground[start] == 0 || labels[start] != 0) continue;
                    nextLabel++;
                    int head = 0, tail = 0, count = 0;
                    int left = width, top = height, right = 0, bottom = 0;
                    long sumX = 0;
                    labels[start] = nextLabel; queue[tail++] = start;
                    while (head < tail)
                    {
                        int index = queue[head++]; count++;
                        int cy = index / width, cx = index - cy * width;
                        sumX += cx;
                        if (cx < left) left = cx; if (cx > right) right = cx;
                        if (cy < top) top = cy; if (cy > bottom) bottom = cy;
                        for (int n = 0; n < 8; n++)
                        {
                            int nx = cx + dx[n], ny = cy + dy[n];
                            if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
                            int ni = ny * width + nx;
                            if (foreground[ni] != 0 && labels[ni] == 0) { labels[ni] = nextLabel; queue[tail++] = ni; }
                        }
                    }

                    int componentWidth = right - left + 1, componentHeight = bottom - top + 1;
                    if (count < 180 || componentWidth < 55 || componentHeight < 35) continue;
                    double centerX = sumX / (double)count;
                    double centerBias = 1.15 - Math.Min(.65, Math.Abs(centerX - width * .48) / width);
                    double shapeBoost = 1 + Math.Min(.45, componentWidth / (double)width);
                    double score = count * centerBias * shapeBoost;
                    if (score > bestScore)
                    {
                        bestScore = score; bestLabel = nextLabel; bestCount = count;
                        bestLeft = left; bestTop = top; bestRight = right; bestBottom = bottom;
                    }
                }

                if (bestLabel == 0 || bestCount == 0) throw new InvalidOperationException("No product component found: " + sourcePath);
                int padding = 18;
                bestLeft = Math.Max(0, bestLeft - padding); bestTop = Math.Max(0, bestTop - padding);
                bestRight = Math.Min(width - 1, bestRight + padding); bestBottom = Math.Min(height - 1, bestBottom + padding);
                int objectWidth = bestRight - bestLeft + 1, objectHeight = bestBottom - bestTop + 1;

                using (var isolated = new Bitmap(objectWidth, objectHeight, PixelFormat.Format32bppArgb))
                {
                    using (var graphics = Graphics.FromImage(isolated)) graphics.Clear(Color.White);
                    var isolatedRect = new Rectangle(0, 0, objectWidth, objectHeight);
                    var isolatedData = isolated.LockBits(isolatedRect, ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
                    byte[] isolatedPixels = new byte[isolatedData.Stride * objectHeight];
                    for (int py = 0; py < objectHeight; py++)
                    {
                        for (int px = 0; px < objectWidth; px++)
                        {
                            int sourceX = bestLeft + px, sourceY = bestTop + py;
                            int sourceIndex = sourceY * width + sourceX;
                            int destinationOffset = py * isolatedData.Stride + px * 4;
                            bool erased = eraseX > 0 && eraseY > 0 && sourceX >= eraseX && sourceY >= eraseY;
                            if (labels[sourceIndex] == bestLabel && !erased)
                            {
                                int sourceOffset = sourceY * stride + sourceX * 4;
                                isolatedPixels[destinationOffset] = pixels[sourceOffset];
                                isolatedPixels[destinationOffset + 1] = pixels[sourceOffset + 1];
                                isolatedPixels[destinationOffset + 2] = pixels[sourceOffset + 2];
                            }
                            else
                            {
                                isolatedPixels[destinationOffset] = 255;
                                isolatedPixels[destinationOffset + 1] = 255;
                                isolatedPixels[destinationOffset + 2] = 255;
                            }
                            isolatedPixels[destinationOffset + 3] = 255;
                        }
                    }
                    Marshal.Copy(isolatedPixels, 0, isolatedData.Scan0, isolatedPixels.Length);
                    isolated.UnlockBits(isolatedData);

                    using (var canvas = new Bitmap(1600, 1000, PixelFormat.Format24bppRgb))
                    using (var graphics = Graphics.FromImage(canvas))
                    {
                        graphics.Clear(Color.White);
                        graphics.CompositingQuality = CompositingQuality.HighQuality;
                        graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
                        graphics.SmoothingMode = SmoothingMode.HighQuality;
                        double scale = Math.Min(1320.0 / objectWidth, 720.0 / objectHeight);
                        int drawWidth = Math.Max(1, (int)(objectWidth * scale));
                        int drawHeight = Math.Max(1, (int)(objectHeight * scale));
                        var destination = new Rectangle((1600 - drawWidth) / 2, (1000 - drawHeight) / 2, drawWidth, drawHeight);
                        graphics.DrawImage(isolated, destination);
                        var codec = Array.Find(ImageCodecInfo.GetImageEncoders(), item => item.MimeType == "image/jpeg");
                        using (var parameters = new EncoderParameters(1))
                        {
                            parameters.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, 95L);
                            canvas.Save(outputPath, codec, parameters);
                        }
                    }
                }
            }
        }
    }
}
"@

Add-Type -TypeDefinition $source -ReferencedAssemblies System.Drawing

$jobs = @()
function Add-Product([int]$page, [string]$code, [int]$x, [int]$y, [int]$w, [int]$h, [int]$eraseX=0, [int]$eraseY=0) {
  $script:jobs += [PSCustomObject]@{ Page=$page; Code=$code; X=$x; Y=$y; W=$w; H=$h; EraseX=$eraseX; EraseY=$eraseY }
}

$rows = @(@(180,930),@(920,950),@(1710,950),@(2490,900))
$pages = @{
  3=@('3020','3021','3018','3019'); 4=@('3008','3016','3011','3005');
  5=@('3023','3022','3017','3015'); 6=@('3034','3035','3036','3037');
  7=@('3032','3033','3007','3006'); 8=@('3038','3039','3040','3041')
}
foreach($page in $pages.Keys) {
  for($row=0; $row -lt 4; $row++) { Add-Product $page $pages[$page][$row] 130 $rows[$row][0] 1440 $rows[$row][1] }
}

Add-Product 9 '2500' 420 430 650 610
Add-Product 9 '2601' 1540 950 650 610
Add-Product 9 '2502' 420 1450 650 610
Add-Product 9 '2602' 1540 1450 650 610

Add-Product 10 '3028' 130 260 1480 920
Add-Product 10 '3024' 130 1010 1480 920
Add-Product 10 '3050' 130 1770 1480 930
Add-Product 10 '5000' 100 2670 1050 760

Add-Product 11 '6007' 120 200 1180 930 780 400
Add-Product 11 '6008' 120 1700 1180 950 780 400
Add-Product 12 '6010' 120 200 1180 930 780 400
Add-Product 12 '6006' 120 1700 1180 950 780 400
Add-Product 13 '6004' 120 200 1180 930 780 400
Add-Product 13 '6005' 120 1700 1180 950 780 400

Add-Product 14 '4500' 500 300 1150 1000
Add-Product 14 '4003-4503' 500 1130 1250 1150
Add-Product 15 '4015-4515' 500 250 1250 1050
Add-Product 15 '4001-4501' 500 1120 1250 1150

foreach($job in $jobs) {
  $pagePath = Join-Path $PagesDirectory ("page-{0:D2}.png" -f $job.Page)
  $outputPath = Join-Path $OutputDirectory ($job.Code + '.jpg')
  [HiresProductExtractor]::Extract($pagePath, $outputPath, $job.X, $job.Y, $job.W, $job.H, $job.EraseX, $job.EraseY)
}

Write-Output "Scraped $($jobs.Count) high-resolution product images."
