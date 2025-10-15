$Owner="contactus328-ai"; $Repo="Zuvo1"; $Branch="main"
$Content = "# Watcher test`nThis was auto-committed by codex_watch.ps1."
powershell -ExecutionPolicy Bypass -File "C:\Users\Admin\OneDrive\Desktop\Zuvo1\automation\codex_commit.ps1" `
  -Owner $Owner -Repo $Repo -Branch $Branch `
  -Path "automation/AUTO.md" `
  -Message "chore(automation): add AUTO.md" `
  -Content $Content
