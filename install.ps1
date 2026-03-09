# PowerShell installation script for Windows

Write-Host "🚀 Installing StellarGuard..." -ForegroundColor Cyan

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
npm install

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
Set-Location ..

# Create .env files if they don't exist
if (-not (Test-Path .env)) {
    Write-Host "📝 Creating frontend .env file..." -ForegroundColor Yellow
    Copy-Item .env.example .env
}

if (-not (Test-Path backend/.env)) {
    Write-Host "📝 Creating backend .env file..." -ForegroundColor Yellow
    Copy-Item backend/.env.example backend/.env
}

Write-Host "✅ Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Start MongoDB: net start MongoDB"
Write-Host "2. Start backend: cd backend; npm run dev"
Write-Host "3. Start frontend: npm run dev"
Write-Host "4. Visit http://localhost:5173"
Write-Host ""
Write-Host "For Soroban contract deployment, see DEPLOYMENT.md"
