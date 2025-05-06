# Start-dev.ps1 - Script to start both API and client servers
Write-Host "Starting Buena Property Management System..." -ForegroundColor Cyan

# Get the root directory
$rootDir = Get-Location

# Function to check if node_modules exists
function Test-NodeModules {
    param(
        [string]$path
    )
    return (Test-Path -Path (Join-Path -Path $path -ChildPath "node_modules"))
}

# Function to install dependencies
function Install-Dependencies {
    param(
        [string]$path,
        [string]$name
    )
    $fullPath = Join-Path -Path $rootDir -ChildPath $path
    Set-Location -Path $fullPath
    
    if (-not (Test-NodeModules -path $fullPath)) {
        Write-Host "Installing $name dependencies..." -ForegroundColor Yellow
        npm install --legacy-peer-deps
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Failed to install $name dependencies!" -ForegroundColor Red
            exit 1
        }
        Write-Host "$name dependencies installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "$name dependencies already installed." -ForegroundColor Green
    }
    Set-Location -Path $rootDir
}

# Install dependencies if needed
Install-Dependencies -path "api" -name "API"
Install-Dependencies -path "client" -name "Client"

# Function to check if a port is in use
function Test-PortInUse {
    param(
        [int]$port
    )
    
    $connections = Get-NetTCPConnection -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -eq $port -and $_.State -eq "Listen" }
    return $null -ne $connections
}

# Kill any processes using our ports
if (Test-PortInUse -port 5001) {
    Write-Host "Port 5001 is in use. Killing processes..." -ForegroundColor Yellow
    $processes = Get-Process | Where-Object { 
        $_.Name -eq "node" -or $_.Name -eq "npm"
    }
    
    foreach ($process in $processes) {
        try {
            $process | Stop-Process -Force -ErrorAction SilentlyContinue
            Write-Host "Killed process $($process.Id)" -ForegroundColor Yellow
        } catch {
            Write-Host "Failed to kill process $($process.Id)" -ForegroundColor Red
        }
    }
}

if (Test-PortInUse -port 3001) {
    Write-Host "Port 3001 is in use. Killing processes..." -ForegroundColor Yellow
    $processes = Get-Process | Where-Object { 
        $_.Name -eq "node" -or $_.Name -eq "npm"
    }
    
    foreach ($process in $processes) {
        try {
            $process | Stop-Process -Force -ErrorAction SilentlyContinue
            Write-Host "Killed process $($process.Id)" -ForegroundColor Yellow
        } catch {
            Write-Host "Failed to kill process $($process.Id)" -ForegroundColor Red
        }
    }
}

# Make sure we have the .env file for the API
$envFilePath = Join-Path -Path $rootDir -ChildPath "api\.env"
if (-not (Test-Path -Path $envFilePath)) {
    Write-Host "Creating .env file for API..." -ForegroundColor Yellow
    Set-Content -Path $envFilePath -Value "DATABASE_URL=`"file:./dev.db`"`nPORT=5001"
}

# Run Prisma generate, migrate, and seed
Write-Host "Setting up Prisma database..." -ForegroundColor Green
$apiPath = Join-Path -Path $rootDir -ChildPath "api"
Set-Location -Path $apiPath

Write-Host "Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to generate Prisma client!" -ForegroundColor Red
    exit 1
}

Write-Host "Running Prisma migrations..." -ForegroundColor Yellow
npx prisma migrate dev --name start_dev_sync --skip-seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to run Prisma migrations!" -ForegroundColor Red
    exit 1
}

$seedPath = Join-Path -Path $apiPath -ChildPath "prisma/seed.ts"
if (Test-Path -Path $seedPath) {
    Write-Host "Seeding the database with test data..." -ForegroundColor Yellow
    npm run prisma:seed
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to seed the database!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "No seed script found, skipping seeding." -ForegroundColor Yellow
}

Set-Location -Path $rootDir

# Starting the API server
Write-Host "Starting API server..." -ForegroundColor Green
Start-Process -FilePath "powershell.exe" -ArgumentList "-Command cd '$apiPath'; npm run start:dev" -WindowStyle Normal

# Wait a moment for the API to initialize
Write-Host "Waiting for API to initialize..." -ForegroundColor Green
Start-Sleep -Seconds 5

# Starting the client
Write-Host "Starting client..." -ForegroundColor Green
$clientPath = Join-Path -Path $rootDir -ChildPath "client"
Set-Location -Path $clientPath
# Use powershell to run npm command without port argument
$clientProcess = Start-Process -FilePath "powershell.exe" -ArgumentList "-Command npm run dev" -NoNewWindow -PassThru -Wait
if ($clientProcess.ExitCode -ne 0) {
    Write-Host "Failed to start client server!" -ForegroundColor Red
    Write-Host "Please check the error messages above." -ForegroundColor Red
    exit 1
}
Set-Location -Path $rootDir

Write-Host "All services started!" -ForegroundColor Cyan
Write-Host "API server running at: http://localhost:5001" -ForegroundColor Cyan
Write-Host "Client running at: http://localhost:3001" -ForegroundColor Cyan
Write-Host "GraphQL playground: http://localhost:5001/graphql" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: If using Apollo client, you may need to update your connection settings to point to port 5001 instead of 3000." -ForegroundColor Yellow 