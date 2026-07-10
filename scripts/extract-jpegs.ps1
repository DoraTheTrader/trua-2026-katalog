param(
  [Parameter(Mandatory = $true)] [string] $PdfPath,
  [Parameter(Mandatory = $true)] [string] $OutputDirectory
)

$bytes = [System.IO.File]::ReadAllBytes($PdfPath)
[System.IO.Directory]::CreateDirectory($OutputDirectory) | Out-Null
$start = -1
$count = 0

for ($i = 0; $i -lt ($bytes.Length - 2); $i++) {
  if ($start -lt 0 -and $bytes[$i] -eq 0xFF -and $bytes[$i + 1] -eq 0xD8 -and $bytes[$i + 2] -eq 0xFF) {
    $start = $i
    $i += 2
    continue
  }

  if ($start -ge 0 -and $bytes[$i] -eq 0xFF -and $bytes[$i + 1] -eq 0xD9) {
    $length = $i + 2 - $start
    if ($length -gt 2048) {
      $count++
      $fileName = Join-Path $OutputDirectory ('catalog-{0:D3}.jpg' -f $count)
      $imageBytes = New-Object byte[] $length
      [Array]::Copy($bytes, $start, $imageBytes, 0, $length)
      [System.IO.File]::WriteAllBytes($fileName, $imageBytes)
    }
    $start = -1
    $i++
  }
}

Write-Output "Extracted $count JPEG streams."
