$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $projectRoot "backend"
$frontendPath = Join-Path $projectRoot "frontend"
$pidPath = Join-Path $projectRoot ".tmp\\demo-pids.json"

function Get-AvailablePort {
  param (
    [int[]]$Candidates
  )

  foreach ($port in $Candidates) {
    $listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Parse("127.0.0.1"), $port)
    try {
      $listener.Start()
      $listener.Stop()
      return $port
    }
    catch {
      continue
    }
  }

  throw "No available ports found in candidates: $($Candidates -join ', ')"
}

Write-Host "Preparing backend dependencies..."
python -m pip install -r (Join-Path $backendPath "requirements.txt") | Out-Null

Write-Host "Preparing frontend dependencies..."
npm install --prefix $frontendPath | Out-Null

$dataFile = Join-Path $backendPath "data\\tickets_sample.csv"
if (-not (Test-Path $dataFile)) {
  throw "Sample data file not found at $dataFile"
}

$backendPort = Get-AvailablePort -Candidates @(8000, 8001, 8010)
$frontendPort = Get-AvailablePort -Candidates @(3000, 3001, 3010)
$backendUrl = "http://127.0.0.1:$backendPort"
$frontendUrl = "http://127.0.0.1:$frontendPort"

Write-Host "Starting backend API on $backendUrl ..."
$backendProcess = Start-Process `
  -FilePath "python" `
  -ArgumentList @("-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "$backendPort", "--reload") `
  -WorkingDirectory $backendPath `
  -WindowStyle Hidden `
  -PassThru

Start-Sleep -Seconds 2

Write-Host "Starting frontend app on $frontendUrl ..."
$frontendProcess = Start-Process `
  -FilePath "powershell" `
  -ArgumentList @(
    "-NoProfile",
    "-Command",
    "`$env:NEXT_PUBLIC_API_BASE_URL='$backendUrl'; npm run dev -- --hostname 127.0.0.1 --port $frontendPort"
  ) `
  -WorkingDirectory $frontendPath `
  -WindowStyle Hidden `
  -PassThru

$pidPayload = @{
  backend = $backendProcess.Id
  frontend = $frontendProcess.Id
  backend_url = $backendUrl
  frontend_url = $frontendUrl
  started_at = (Get-Date).ToString("o")
}

$pidPayload | ConvertTo-Json | Set-Content -Path $pidPath -Encoding UTF8

Write-Host ""
Write-Host "Demo is running."
Write-Host "Frontend: $frontendUrl"
Write-Host "Backend:  $backendUrl"
Write-Host "Health:   $backendUrl/health"
Write-Host ""
Write-Host "To stop both services, run: .\\stop_demo.ps1"
