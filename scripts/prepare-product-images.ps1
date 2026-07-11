param(
  [string] $SourceDirectory = ".\public\catalog",
  [string] $OutputDirectory = ".\public\products"
)

Add-Type -AssemblyName System.Drawing
[System.IO.Directory]::CreateDirectory($OutputDirectory) | Out-Null

$pairs = @{
  7=@(7,8); 8=@(7,8); 13=@(13,14); 14=@(13,14); 17=@(17,18); 18=@(17,18);
  19=@(19,20); 20=@(19,20); 27=@(27,28); 28=@(27,28); 29=@(29,30); 30=@(29,30);
  36=@(36,37); 37=@(36,37); 40=@(40,41); 41=@(40,41); 42=@(42,43); 43=@(42,43);
  45=@(45,46); 46=@(45,46); 48=@(48,49); 49=@(48,49);
  52=@(52,53); 53=@(52,53); 54=@(54,55); 55=@(54,55); 56=@(56,57); 57=@(56,57)
}
$maskOnly = @(21,22,23,24,25,26,32,33,34,44,50,51,58)
$blackBackground = @(9,35,38,39)

function Get-Path([int] $index) {
  Join-Path $SourceDirectory ("catalog-{0:D3}.jpg" -f $index)
}

function New-TransparentBitmap([int] $width, [int] $height) {
  New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
}

function Remove-WhiteBackground([System.Drawing.Bitmap] $source) {
  $result = New-TransparentBitmap $source.Width $source.Height
  for ($y = 0; $y -lt $source.Height; $y++) {
    for ($x = 0; $x -lt $source.Width; $x++) {
      $c = $source.GetPixel($x, $y)
      $minimum = [Math]::Min($c.R, [Math]::Min($c.G, $c.B))
      $alpha = if ($minimum -ge 250) { 0 } elseif ($minimum -ge 225) { [int](255 * (250 - $minimum) / 25) } else { 255 }
      $result.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
    }
  }
  $result
}

function Remove-BlackBackground([System.Drawing.Bitmap] $source) {
  $result = New-TransparentBitmap $source.Width $source.Height
  for ($y = 0; $y -lt $source.Height; $y++) {
    for ($x = 0; $x -lt $source.Width; $x++) {
      $c = $source.GetPixel($x, $y)
      $maximum = [Math]::Max($c.R, [Math]::Max($c.G, $c.B))
      $alpha = if ($maximum -le 5) { 0 } elseif ($maximum -le 28) { [int](255 * ($maximum - 5) / 23) } else { 255 }
      $result.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
    }
  }
  $result
}

function Merge-ProductMask([System.Drawing.Bitmap] $mask, [System.Drawing.Bitmap] $base) {
  $result = New-TransparentBitmap $base.Width $base.Height
  $scaledMask = New-Object System.Drawing.Bitmap($mask, $base.Width, $base.Height)
  for ($y = 0; $y -lt $base.Height; $y++) {
    for ($x = 0; $x -lt $base.Width; $x++) {
      $m = $scaledMask.GetPixel($x, $y)
      $alpha = [Math]::Max($m.R, [Math]::Max($m.G, $m.B))
      if ($alpha -lt 8) { continue }
      $c = $base.GetPixel($x, $y)
      $result.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $c.R, $c.G, $c.B))
    }
  }
  $scaledMask.Dispose()
  $result
}

function Colorize-ProductMask([System.Drawing.Bitmap] $mask) {
  $result = New-TransparentBitmap $mask.Width $mask.Height
  for ($y = 0; $y -lt $mask.Height; $y++) {
    for ($x = 0; $x -lt $mask.Width; $x++) {
      $m = $mask.GetPixel($x, $y)
      $alpha = [Math]::Max($m.R, [Math]::Max($m.G, $m.B))
      if ($alpha -lt 8) { continue }
      $shine = [int](35 * (1 - [Math]::Abs(($y / [Math]::Max(1, $mask.Height - 1)) - .42)))
      $result.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 39 + $shine, 34 + $shine, 36 + $shine))
    }
  }
  $result
}

function Normalize-Product([System.Drawing.Bitmap] $source) {
  $left = $source.Width; $top = $source.Height; $right = -1; $bottom = -1
  for ($y = 0; $y -lt $source.Height; $y++) {
    for ($x = 0; $x -lt $source.Width; $x++) {
      if ($source.GetPixel($x, $y).A -gt 18) {
        if ($x -lt $left) { $left = $x }; if ($x -gt $right) { $right = $x }
        if ($y -lt $top) { $top = $y }; if ($y -gt $bottom) { $bottom = $y }
      }
    }
  }
  if ($right -lt $left -or $bottom -lt $top) { return $source.Clone() }
  $cropWidth = $right - $left + 1; $cropHeight = $bottom - $top + 1
  $canvas = New-TransparentBitmap 900 560
  $graphics = [System.Drawing.Graphics]::FromImage($canvas)
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $scale = [Math]::Min(760 / $cropWidth, 380 / $cropHeight)
  $drawWidth = [int]($cropWidth * $scale); $drawHeight = [int]($cropHeight * $scale)
  $destination = New-Object System.Drawing.Rectangle([int]((900-$drawWidth)/2), [int]((560-$drawHeight)/2), $drawWidth, $drawHeight)
  $sourceRect = New-Object System.Drawing.Rectangle($left, $top, $cropWidth, $cropHeight)
  $graphics.DrawImage($source, $destination, $sourceRect, [System.Drawing.GraphicsUnit]::Pixel)
  $graphics.Dispose()
  $canvas
}

for ($index = 3; $index -le 60; $index++) {
  $sourcePath = Get-Path $index
  if (-not (Test-Path $sourcePath)) { continue }
  $working = $null
  if ($pairs.ContainsKey($index)) {
    $mask = New-Object System.Drawing.Bitmap((Get-Path $pairs[$index][0]))
    $base = New-Object System.Drawing.Bitmap((Get-Path $pairs[$index][1]))
    $working = Merge-ProductMask $mask $base
    $mask.Dispose(); $base.Dispose()
  } elseif ($maskOnly -contains $index) {
    $mask = New-Object System.Drawing.Bitmap($sourcePath)
    $working = Colorize-ProductMask $mask
    $mask.Dispose()
  } elseif ($blackBackground -contains $index) {
    $source = New-Object System.Drawing.Bitmap($sourcePath)
    $working = Remove-BlackBackground $source
    $source.Dispose()
  } else {
    $source = New-Object System.Drawing.Bitmap($sourcePath)
    $working = Remove-WhiteBackground $source
    $source.Dispose()
  }

  $normalized = Normalize-Product $working
  $outputPath = Join-Path $OutputDirectory ("product-{0:D3}.png" -f $index)
  $normalized.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $normalized.Dispose(); $working.Dispose()
}

Write-Output "Prepared product images in $OutputDirectory"
