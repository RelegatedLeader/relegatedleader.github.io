@echo off
REM ==============================================================================
REM Gated Access System - Complete Setup Script (Windows)
REM ==============================================================================
REM This script sets up:
REM  - Firebase CLI
REM  - Twilio CLI
REM  - Environment variables (.env)
REM  - Encryption key
REM  - Dependencies
REM ==============================================================================

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo ========================================
echo   GATED ACCESS SYSTEM - SETUP WIZARD
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please download from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✓ Node.js found: 
node --version

echo.
echo Step 1: Installing Firebase CLI...
call npm install -g firebase-tools
if errorlevel 1 (
    echo ✗ Firebase CLI installation failed
    pause
    exit /b 1
)
echo ✓ Firebase CLI installed

echo.
echo Step 2: Installing Twilio CLI...
call npm install -g twilio-cli
if errorlevel 1 (
    echo ✗ Twilio CLI installation failed
    pause
    exit /b 1
)
echo ✓ Twilio CLI installed

echo.
echo Step 3: Checking backend dependencies...
cd backend
if not exist "node_modules" (
    echo Installing npm packages...
    call npm install
    if errorlevel 1 (
        echo ✗ npm install failed
        pause
        exit /b 1
    )
)
echo ✓ Backend dependencies ready

echo.
echo Step 4: Generating Encryption Key...
REM Generate encryption key
for /f "delims=" %%A in ('node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"') do set ENCRYPTION_KEY=%%A
echo Generated: %ENCRYPTION_KEY:~0,10%...

echo.
echo Step 5: Creating .env file...
if not exist ".env" (
    echo Creating backend\.env template...
    (
        echo # ===== FIREBASE CREDENTIALS =====
        echo FIREBASE_PROJECT_ID=relegatedleader-54c49
        echo FIREBASE_PRIVATE_KEY_ID=your_key_id_here
        echo FIREBASE_PRIVATE_KEY=your_private_key_here
        echo FIREBASE_CLIENT_EMAIL=firebase-adminsdk@relegatedleader-54c49.iam.gserviceaccount.com
        echo.
        echo # ===== ENCRYPTION KEY (GENERATED ^) =====
        echo ENCRYPTION_KEY=%ENCRYPTION_KEY%
        echo.
        echo # ===== TWILIO CREDENTIALS =====
        echo TWILIO_ACCOUNT_SID=your_account_sid
        echo TWILIO_AUTH_TOKEN=your_auth_token
        echo TWILIO_PHONE_NUMBER=your_twilio_phone
        echo.
        echo # ===== EMAIL CREDENTIALS =====
        echo SMTP_USER=frankalfaro105@gmail.com
        echo SMTP_PASSWORD=your_app_password
        echo.
        echo # ===== SERVER =====
        echo PORT=8000
        echo NODE_ENV=production
    ) > .env
    echo ✓ Created backend\.env template
    echo ⚠ NOTE: You must edit .env with your Firebase and Twilio credentials!
) else (
    echo ✓ .env already exists (not overwriting)
)

echo.
echo Step 6: Checking .gitignore...
if exist ".gitignore" (
    findstr /m ".env" .gitignore >nul
    if errorlevel 1 (
        echo .env >> .gitignore
        echo ✓ Added .env to .gitignore
    ) else (
        echo ✓ .env already in .gitignore
    )
) else (
    echo .env > .gitignore
    echo ✓ Created .gitignore
)

cd ..

echo.
echo Step 7: Firebase CLI Login...
echo.
echo Please log in with your Google account:
firebase login --no-localhost

echo.
echo Step 8: Initializing Firebase...
echo.
echo Choose your Firebase project: relegatedleader-54c49
cd backend
firebase init --project relegatedleader-54c49

cd ..

echo.
echo ========================================
echo  ✅ SETUP COMPLETE!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Edit backend\.env with your credentials:
echo    - Firebase private key (from Firebase Console)
echo    - Twilio Account SID and Auth Token
echo    - Gmail app-specific password
echo.
echo 2. Test Twilio CLI:
echo    twilio phone-numbers:list
echo.
echo 3. Deploy to Firebase:
echo    firebase deploy
echo.
echo 4. Start the backend server:
echo    npm run start (from backend folder)
echo.
echo 5. Access admin panel:
echo    http://localhost:8000/admin-secret-panel.html
echo.
echo For more information, see:
echo   - CLI_SETUP_GUIDE.md
echo   - ENCRYPTION_KEY_SETUP.md
echo.
pause
