@echo off
REM Firebase CLI Setup for Portfolio Authentication System
REM This script walks you through setting up Firebase completely

cls
echo.
echo ============================================
echo  Firebase Setup for Portfolio Auth System
echo ============================================
echo.
echo Prerequisites: Node.js, npm, and Firebase CLI
echo.
echo Step 1: Login to Firebase
echo Run this command:
echo   firebase login
echo.
pause

call firebase login
if errorlevel 1 (
    echo Failed to login to Firebase
    pause
    exit /b 1
)

echo.
echo ============================================
echo Step 2: Create Firebase Project
echo ============================================
echo.
echo You need to create a project in the Firebase Console
echo Visit: https://console.firebase.google.com
echo.
echo After creating the project, you'll need:
echo - Project ID
echo - Service Account Key (JSON)
echo.
pause

echo.
echo ============================================
echo Step 3: Download Service Account Credentials
echo ============================================
echo.
echo 1. Go to https://console.firebase.google.com
echo 2. Select your project
echo 3. Click Settings (gear icon) > Project Settings
echo 4. Go to "Service Accounts" tab
echo 5. Click "Generate New Private Key"
echo 6. Save the JSON file
echo.
echo You'll need this JSON file in the next step.
pause

echo.
echo ============================================
echo Step 4: Configure .env File
echo ============================================
echo.
echo We'll create your .env file with Firebase credentials
echo.
echo Copy the values from your service account JSON:
echo.

setlocal enabledelayedexpansion
set "env_file=backend\.env"

if exist "%env_file%" (
    echo Backing up existing .env file...
    copy "%env_file%" "%env_file%.backup"
)

(
    echo # Firebase Configuration
    echo FIREBASE_PROJECT_ID=your_project_id
    echo FIREBASE_PRIVATE_KEY_ID=your_private_key_id
    echo FIREBASE_PRIVATE_KEY="your_private_key_with_escaped_newlines"
    echo FIREBASE_CLIENT_EMAIL=your_service_account_email
    echo FIREBASE_CLIENT_ID=your_client_id
    echo FIREBASE_AUTH_DOMAIN=your_auth_domain
    echo FIREBASE_STORAGE_BUCKET=your_storage_bucket
    echo FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    echo FIREBASE_APP_ID=your_app_id
    echo FIREBASE_CERT_URL=your_cert_url
    echo.
    echo # Admin Credentials
    echo ADMIN_EMAIL=frankalfaro105@proton.me
    echo ADMIN_PHONE=346-282-1804
    echo.
    echo # Twilio SMS Configuration (Required)
    echo TWILIO_ACCOUNT_SID=your_twilio_account_sid
    echo TWILIO_AUTH_TOKEN=your_twilio_auth_token
    echo TWILIO_PHONE_NUMBER=+1234567890
    echo.
    echo # Email Service Configuration
    echo EMAIL_SERVICE=nodemailer
    echo EMAIL_PROVIDER=gmail
    echo EMAIL_FROM=your_email@gmail.com
    echo EMAIL_PASSWORD=your_app_password
    echo.
    echo # Server
    echo PORT=5000
    echo NODE_ENV=production
    echo.
    echo # Session
    echo SESSION_DURATION_MINUTES=20
    echo CODE_EXPIRY_MINUTES=15
    echo.
    echo # Encryption Keys (Generate using Node.js)
    echo ENCRYPTION_KEY=your_encryption_key
    echo ADMIN_SECRET_KEY=your_admin_secret_key
) > "%env_file%"

echo.
echo .env file created at: %env_file%
echo.
echo IMPORTANT: Edit the .env file and replace all values with your credentials!
echo.
echo To generate encryption keys, run this in Node.js:
echo   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
echo.
pause

echo.
echo ============================================
echo Step 5: Test Firebase Connection
echo ============================================
echo.
cd backend
call node -e "require('dotenv').config(); const admin = require('firebase-admin'); console.log('Testing Firebase connection...');"
if errorlevel 1 (
    echo Firebase connection test failed!
    echo Check your .env file and try again.
    pause
    cd ..
    exit /b 1
)

cd ..
echo.
echo ============================================
echo Step 6: Initialize Firestore Database
echo ============================================
echo.
echo Run this command to create Firestore collections:
echo   node backend/init-firestore.js
echo.
pause

call node backend/init-firestore.js
if errorlevel 1 (
    echo Firestore initialization failed!
    echo Check your .env file and try again.
    pause
    exit /b 1
)

echo.
echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo Your Firebase authentication system is ready!
echo.
echo To start the server:
echo   cd backend
echo   npm start
echo.
echo Server will run on: http://localhost:5000
echo Admin Dashboard: http://localhost:5000/admin
echo.
pause
