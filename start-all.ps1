Write-Host "Starting Nexora Project..." -ForegroundColor Green

# 1. Start Docker services
Write-Host "Starting Docker containers (Postgres, Redis, ClickHouse, MinIO)..." -ForegroundColor Cyan
docker-compose up -d

# 2. Start Next.js Frontend
Write-Host "Starting Next.js Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd d:\Nexora; npm run dev"

# 3. Start Node.js API & Worker
Write-Host "Starting Node.js API..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd d:\Nexora\apps\api; npm run dev"

Write-Host "Starting Node.js Worker..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd d:\Nexora\apps\api; npm run worker"

# 4. Start Go Microservices (User, Feed, Video)
Write-Host "Starting Go User Service (Port 8081)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd d:\Nexora\services\user; `$env:PORT=`"8081`"; go run main.go"

Write-Host "Starting Go Feed Service (Port 8082)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd d:\Nexora\services\feed; `$env:PORT=`"8082`"; go run main.go"

Write-Host "Starting Go Video Service..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd d:\Nexora\services\video; go run main.go worker.go"

# 5. Start Python AI Service
Write-Host "Starting Python AI Service..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd d:\Nexora\services\ai; python main.py"

Write-Host "All services have been launched in separate windows!" -ForegroundColor Green
