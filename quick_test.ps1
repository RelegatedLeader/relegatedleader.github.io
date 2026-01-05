Start-Process -FilePath "C:\Program Files\nodejs\node.exe" -ArgumentList "server.js" -WorkingDirectory "C:\Users\frank\Desktop\relegatedleader.github.io\backend" -NoNewWindow
Start-Sleep -Seconds 3
Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET | Write-Host
