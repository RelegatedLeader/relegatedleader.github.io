@echo off
REM Portfolio Authentication System - Quick Setup for Windows

echo.
echo 🚀 Portfolio Authentication System - Windows Setup
echo ============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%
echo.

REM Navigate to backend
cd backend

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    echo ✅ Dependencies installed
) else (
    echo ✅ Dependencies already installed
)

echo.
echo ⚙️  Configuration Steps:
echo 1. Creating .env file...
copy .env.example .env >nul 2>&1
echo    ✅ Created .env file

echo.
echo 2. Update .env with your values:
echo    - Firebase credentials
echo    - Admin email: frankalfaro105@proton.me
echo    - Admin phone: 346-282-1804
echo    - Twilio credentials (for SMS)
echo    - Email service credentials
echo    - Generate ENCRYPTION_KEY and ADMIN_SECRET_KEY

echo.
echo 📝 To generate encryption keys, run in Node.js:
echo    - ENCRYPTION_KEY: require('crypto').randomBytes(16).toString('hex')
echo    - ADMIN_SECRET_KEY: require('crypto').randomBytes(32).toString('hex')

echo.
echo 🚀 Start the server with:
echo    npm start

echo.
echo 📊 Admin Dashboard will be available at:
echo    http://localhost:5000/admin

echo.
echo ✨ Setup complete! Follow the SETUP_GUIDE.md for detailed instructions.
echo.
pause
