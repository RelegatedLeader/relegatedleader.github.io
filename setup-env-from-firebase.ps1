#!/usr/bin/env powershell

# Firebase .env Setup Helper
# This script will help you configure your .env file with Firebase credentials

Write-Host "`n=================================" -ForegroundColor Cyan
Write-Host "Firebase Credentials Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

Write-Host "`n📥 Looking for downloaded Firebase credentials..." -ForegroundColor Yellow

# Wait for user to download the JSON file
$maxWait = 30
$waited = 0
$jsonFile = $null

while ($waited -lt $maxWait) {
    $recentFiles = Get-ChildItem -Path $env:USERPROFILE\Downloads -Filter "*.json" -ErrorAction SilentlyContinue | 
                  Where-Object { $_.LastWriteTime -gt (Get-Date).AddMinutes(-2) } |
                  Sort-Object LastWriteTime -Descending |
                  Select-Object -First 1
    
    if ($recentFiles) {
        $jsonFile = $recentFiles.FullName
        break
    }
    
    Write-Host "." -NoNewline
    Start-Sleep -Seconds 1
    $waited++
}

if (-not $jsonFile) {
    Write-Host "`n❌ No Firebase JSON file found!" -ForegroundColor Red
    Write-Host "`nPlease:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://console.firebase.google.com/project/personal-site-auth/settings/serviceaccounts/adminsdk"
    Write-Host "2. Click 'Generate New Private Key' button"
    Write-Host "3. Save the JSON file to your Downloads folder"
    Write-Host "4. Run this script again"
    exit 1
}

Write-Host "`n✅ Found credentials file: $jsonFile" -ForegroundColor Green

# Read the JSON file
try {
    $credentials = Get-Content $jsonFile | ConvertFrom-Json
} catch {
    Write-Host "❌ Error reading JSON file: $_" -ForegroundColor Red
    exit 1
}

# Extract values
$projectId = $credentials.project_id
$privateKeyId = $credentials.private_key_id
$privateKey = $credentials.private_key
$clientEmail = $credentials.client_email
$clientId = $credentials.client_id
$authDomain = "$projectId.firebaseapp.com"
$storageBucket = "$projectId.appspot.com"
$messagingSenderId = $credentials.client_id
$appId = $credentials.client_id
$certUrl = $credentials.client_x509_cert_url

Write-Host "`n✅ Extracted Firebase Credentials:" -ForegroundColor Green
Write-Host "  Project ID: $projectId"
Write-Host "  Client Email: $clientEmail"

# Create .env content
$envContent = @"
# Firebase Configuration
FIREBASE_PROJECT_ID=$projectId
FIREBASE_PRIVATE_KEY_ID=$privateKeyId
FIREBASE_PRIVATE_KEY="$privateKey"
FIREBASE_CLIENT_EMAIL=$clientEmail
FIREBASE_CLIENT_ID=$clientId
FIREBASE_AUTH_DOMAIN=$authDomain
FIREBASE_DATABASE_URL=https://$projectId.firebaseio.com
FIREBASE_STORAGE_BUCKET=$storageBucket
FIREBASE_MESSAGING_SENDER_ID=$messagingSenderId
FIREBASE_APP_ID=$appId
FIREBASE_CERT_URL=$certUrl

# Admin Credentials
ADMIN_EMAIL=frankalfaro105@proton.me
ADMIN_PHONE=346-282-1804

# Twilio SMS Configuration (REQUIRED)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Email Service Configuration
EMAIL_SERVICE=nodemailer
EMAIL_PROVIDER=gmail
EMAIL_FROM=frankalfaro105@gmail.com
EMAIL_PASSWORD=

# Server
PORT=5000
NODE_ENV=production

# Session
SESSION_DURATION_MINUTES=20
CODE_EXPIRY_MINUTES=15

# Encryption Keys (auto-generated below)
ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ADMIN_SECRET_KEY=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
"@

# Save .env file
$envPath = "C:\Users\frank\Desktop\relegatedleader.github.io\backend\.env"
Set-Content -Path $envPath -Value $envContent -Force

Write-Host "`n✅ Created .env file: $envPath" -ForegroundColor Green

Write-Host "`n⚠️  IMPORTANT - Add these credentials:" -ForegroundColor Yellow
Write-Host "`n1. Twilio SMS (Get from https://www.twilio.com):"
Write-Host "   TWILIO_ACCOUNT_SID=your_account_sid"
Write-Host "   TWILIO_AUTH_TOKEN=your_auth_token"
Write-Host "   TWILIO_PHONE_NUMBER=+1234567890"

Write-Host "`n2. Gmail App Password (https://support.google.com/accounts/answer/185833):"
Write-Host "   EMAIL_PASSWORD=your_16_char_app_password"

Write-Host "`n=================================" -ForegroundColor Cyan
Write-Host "Setup Complete! Next Steps:" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "`n1. Edit .env and add Twilio credentials"
Write-Host "2. Edit .env and add Gmail app password"
Write-Host "3. Run: node backend/init-firestore.js"
Write-Host "4. Run: npm start (in backend folder)"
Write-Host "`nYour server will be ready at: http://localhost:5000"
Write-Host "Admin dashboard: http://localhost:5000/admin`n"

# Move the JSON file to a safe location
$safeLocation = "C:\Users\frank\Desktop\relegatedleader.github.io\firebase-key-backup.json"
Copy-Item $jsonFile -Destination $safeLocation -Force
Write-Host "✅ Backup saved: $safeLocation" -ForegroundColor Green
