$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$pidPath = Join-Path $projectRoot ".tmp\\demo-pids.json"

if (-not (Test-Path $pidPath)) {
  Write-Host "No demo pid file found."
  exit 0
}

$payload = Get-Content $pidPath -Raw | ConvertFrom-Json
$ids = @($payload.backend, $payload.frontend) | Where-Object { $_ -ne $null }

foreach ($id in $ids) {
  try {
    Stop-Process -Id $id -Force
    Write-Host "Stopped process $id"
  }
  catch {
    Write-Host "Process $id is already stopped."
  }
}

Remove-Item $pidPath -Force
Write-Host "Demo services stopped."
