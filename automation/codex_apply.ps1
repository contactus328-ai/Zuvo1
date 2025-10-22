param(
  [string]$InputPath = ".\automation\codex_input.txt",
  [string]$Commit = "codex: apply prompt"
)
if (-not (Test-Path $InputPath)) { Write-Error "Input file not found: $InputPath"; exit 1 }
$raw = Get-Content -Raw -Path $InputPath
$blocks = [System.Text.RegularExpressions.Regex]::Split($raw, "(?ms)^(?=Save as |Append to |Replace in )")
$changed = @()
foreach ($b in $blocks) {
  if (-not $b.Trim()) { continue }
  if ($b -match "^(Save as|Append to|Replace in)\s+([^\r\n]+)\r?\n---\r?\n([\s\S]*?)\r?\n---\s*$") {
    $op=$Matches[1]; $path=$Matches[2].Trim(); $body=$Matches[3]
    $full=Join-Path (Get-Location) $path.TrimStart('/','\')
    $dir = Split-Path $full -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    if ($op -eq "Save as") {
      $body | Out-File -Encoding UTF8 -NoNewline $full
      $changed += $path; Write-Host "Saved: $path"
    } elseif ($op -eq "Append to") {
      Add-Content -Encoding UTF8 -Path $full -Value $body
      $changed += $path; Write-Host "Appended: $path"
    } elseif ($op -eq "Replace in") {
      if ($body -match "^(.*?)[\r\n]+---[\r\n]+([\s\S]*)$") {
        $pattern=$Matches[1]; $repl=$Matches[2]
        if (-not (Test-Path $full)) { Write-Error "Replace target missing: $path"; continue }
        $text = Get-Content -Raw -Path $full
        $updated = [System.Text.RegularExpressions.Regex]::Replace($text, $pattern, $repl, 'Singleline')
        $updated | Out-File -Encoding UTF8 -NoNewline $full
        $changed += $path; Write-Host "Replaced in: $path"
      } else { Write-Error "Malformed Replace in block for $path" }
    }
  }
}
if ($changed.Count -gt 0) {
  git add -A
  git commit -m $Commit | Out-Null
  git push
  Write-Host "Committed & pushed: $($changed -join ', ')"
} else {
  Write-Host "No changes detected from blocks."
}
