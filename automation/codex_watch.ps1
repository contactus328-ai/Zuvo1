$ErrorActionPreference = "Stop"
# Absolute paths (PS5-safe)
$in = Resolve-Path "automation\codex_input.txt" -ErrorAction SilentlyContinue
if (-not $in) { New-Item -ItemType File -Path "automation\codex_input.txt" | Out-Null; $in = Resolve-Path "automation\codex_input.txt" }
$applyPath = (Resolve-Path "automation\codex_apply.ps1").Path
$inputPath = $in.Path
# Windows PowerShell exe
$pwsh = Join-Path $PSHOME 'powershell.exe'
if (-not (Test-Path $pwsh)) { $pwsh = 'powershell.exe' }
$folder = Split-Path $inputPath -Parent
$file   = Split-Path $inputPath -Leaf
$fsw = New-Object System.IO.FileSystemWatcher $folder, $file
$fsw.NotifyFilter = [System.IO.NotifyFilters]'LastWrite, Size'
Write-Host "[Watcher] Monitoring $inputPath (Ctrl+C to stop)."
$action = {
  Start-Sleep -Milliseconds 250
  try {
    $pwsh      = $event.MessageData.pwsh
    $applyPath = $event.MessageData.apply
    $inputPath = $event.MessageData.input
    $args = @(
      '-NoProfile','-ExecutionPolicy','Bypass',
      '-File', $applyPath,
      '-InputPath', $inputPath,
      '-Commit', 'codex: apply watcher input'
    )
    & $pwsh @args
    Write-Host "[Watcher] Applied at $(Get-Date -Format o)"
  } catch {
    Write-Host "[Watcher] Error: $($_.Exception.Message)"
  }
}
$payload = @{ pwsh = $pwsh; apply = $applyPath; input = $inputPath }
Register-ObjectEvent -InputObject $fsw -EventName Changed -Action $action -MessageData $payload | Out-Null
Register-ObjectEvent -InputObject $fsw -EventName Created -Action $action -MessageData $payload | Out-Null
Register-ObjectEvent -InputObject $fsw -EventName Renamed -Action $action -MessageData $payload | Out-Null
while ($true) { Start-Sleep -Seconds 5 }
