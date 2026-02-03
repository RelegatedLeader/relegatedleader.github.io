@echo off
REM ============================================================
REM Complete Netlify + Backend Setup
REM ============================================================

echo.
echo ================================================
echo   NETLIFY + BACKEND DEPLOYMENT SETUP
echo ================================================
echo.

REM Step 1: Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not installed
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)
echo [1/5] ✓ Node.js found: 
node --version

REM Step 2: Install dependencies
echo.
echo [2/5] Installing backend dependencies...
cd backend
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)
echo ✓ Dependencies installed

REM Step 3: Check for .env
echo.
echo [3/5] Checking .env file...
if not exist ".env" (
    echo WARNING: .env file not found in backend/
    echo Please create backend/.env with your credentials
    echo See: NETLIFY_DEPLOYMENT.md for instructions
    pause
    exit /b 1
)
echo ✓ .env file found

REM Step 4: Test backend
echo.
echo [4/5] Testing backend locally...
echo Starting server on http://localhost:5000...
echo Press Ctrl+C to stop after testing
timeout /t 3
call npm start

REM Step 5: Netlify login and deploy
cd ..
echo.
echo [5/5] Netlify Deployment...
echo Logging into Netlify...
call netlify login
call netlify init
call netlify deploy --prod

echo.
echo ================================================
echo   ✅ SETUP COMPLETE!
echo ================================================
echo.
echo Your site is deployed at:
echo https://relegatedleader.github.io
echo.
echo Admin Panel:
echo https://relegatedleader.github.io/admin-secret-panel.html
echo.
echo API Endpoint:
echo https://relegatedleader.github.io/api/
echo.

pause
