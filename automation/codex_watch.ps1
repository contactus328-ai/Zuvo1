$ErrorActionPreference = "Stop"
$inputPath = Join-Path (Get-Location) "automation\codex_input.txt"
$script    = Join-Path (Get-Location) "automation\codex_apply.ps1"
if (-not (Test-Path $inputPath)) { New-Item -ItemType File -Path $inputPath | Out-Null }
if (-not (Test-Path $script)) { throw "Missing: automation\codex_apply.ps1" }
$folder = Split-Path $inputPath -Parent
$file   = Split-Path $inputPath -Leaf
$fsw = New-Object System.IO.FileSystemWatcher $folder, $file
$fsw.NotifyFilter = [System.IO.NotifyFilters]'FileName, LastWrite, Size'
Write-Host "[Watcher] Monitoring $inputPath (Ctrl+C to stop)."
$action = {
  Start-Sleep -Milliseconds 150
  try {
    powershell -ExecutionPolicy Bypass -File $using:script -InputPath $using:inputPath -Commit "codex: apply watcher input"
    Write-Host "[Watcher] Applied at $(Get-Date -Format o)"
  } catch {
    Write-Host "[Watcher] Error: $($_.Exception.Message)"
  }
}
Register-ObjectEvent $fsw Changed -Action $action | Out-Null
Register-ObjectEvent $fsw Renamed -Action $action | Out-Null
while ($true) { Start-Sleep -Seconds 5 }
