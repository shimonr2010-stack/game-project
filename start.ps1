# Serves the arcade over http:// — required for games (not file://)
$ErrorActionPreference = "Stop"
$Port = 3000
Set-Location $PSScriptRoot
$Url = "http://localhost:$Port/"

Write-Host "Game Arcade — $Url" -ForegroundColor Cyan
Write-Host "Open that URL in Chrome or Edge (not the IDE preview)." -ForegroundColor DarkGray
Write-Host "Press Ctrl+C to stop.`n" -ForegroundColor DarkGray

Start-Sleep -Milliseconds 500
Start-Process $Url

if (Get-Command python -ErrorAction SilentlyContinue) {
  python -m http.server $Port
  exit $LASTEXITCODE
}
if (Get-Command py -ErrorAction SilentlyContinue) {
  py -3 -m http.server $Port
  exit $LASTEXITCODE
}
if (Get-Command npm -ErrorAction SilentlyContinue) {
  npm run start
  exit $LASTEXITCODE
}

Write-Host "ERROR: Install Python (python.org) or Node.js, then run this script again." -ForegroundColor Red
Write-Host "Or run manually:  python -m http.server $Port" -ForegroundColor Yellow
pause
exit 1
