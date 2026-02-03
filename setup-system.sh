#!/bin/bash

##############################################################################
# Gated Access System - Complete Setup Script (macOS/Linux)
##############################################################################
# This script sets up:
#  - Firebase CLI
#  - Twilio CLI
#  - Environment variables (.env)
#  - Encryption key
#  - Dependencies
##############################################################################

set -e  # Exit on error

cd "$(dirname "$0")"

echo ""
echo "========================================"
echo "   GATED ACCESS SYSTEM - SETUP WIZARD"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please download from: https://nodejs.org/"
    echo ""
    exit 1
fi

echo "✓ Node.js found: $(node --version)"

echo ""
echo "Step 1: Installing Firebase CLI..."
npm install -g firebase-tools
echo "✓ Firebase CLI installed"

echo ""
echo "Step 2: Installing Twilio CLI..."
npm install -g twilio-cli
echo "✓ Twilio CLI installed"

echo ""
echo "Step 3: Checking backend dependencies..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing npm packages..."
    npm install
fi
echo "✓ Backend dependencies ready"

echo ""
echo "Step 4: Generating Encryption Key..."
ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "Generated: ${ENCRYPTION_KEY:0:10}..."

echo ""
echo "Step 5: Creating .env file..."
if [ ! -f ".env" ]; then
    cat > .env << EOF
# ===== FIREBASE CREDENTIALS =====
FIREBASE_PROJECT_ID=relegatedleader-54c49
FIREBASE_PRIVATE_KEY_ID=your_key_id_here
FIREBASE_PRIVATE_KEY=your_private_key_here
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@relegatedleader-54c49.iam.gserviceaccount.com

# ===== ENCRYPTION KEY (GENERATED) =====
ENCRYPTION_KEY=$ENCRYPTION_KEY

# ===== TWILIO CREDENTIALS =====
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone

# ===== EMAIL CREDENTIALS =====
SMTP_USER=frankalfaro105@gmail.com
SMTP_PASSWORD=your_app_password

# ===== SERVER =====
PORT=8000
NODE_ENV=production
EOF
    echo "✓ Created backend/.env template"
    echo "⚠ NOTE: You must edit .env with your Firebase and Twilio credentials!"
else
    echo "✓ .env already exists (not overwriting)"
fi

echo ""
echo "Step 6: Checking .gitignore..."
if [ -f ".gitignore" ]; then
    if ! grep -q ".env" .gitignore; then
        echo ".env" >> .gitignore
        echo "✓ Added .env to .gitignore"
    else
        echo "✓ .env already in .gitignore"
    fi
else
    echo ".env" > .gitignore
    echo "✓ Created .gitignore"
fi

cd ..

echo ""
echo "Step 7: Firebase CLI Login..."
echo ""
echo "Please log in with your Google account (browser will open):"
firebase login

echo ""
echo "Step 8: Initializing Firebase..."
echo ""
echo "Choose your Firebase project: relegatedleader-54c49"
cd backend
firebase init --project relegatedleader-54c49
cd ..

echo ""
echo "========================================"
echo "  ✅ SETUP COMPLETE!"
echo "========================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Edit backend/.env with your credentials:"
echo "   - Firebase private key (from Firebase Console)"
echo "   - Twilio Account SID and Auth Token"
echo "   - Gmail app-specific password"
echo ""
echo "2. Test Twilio CLI:"
echo "   twilio phone-numbers:list"
echo ""
echo "3. Deploy to Firebase:"
echo "   firebase deploy"
echo ""
echo "4. Start the backend server:"
echo "   npm run start (from backend folder)"
echo ""
echo "5. Access admin panel:"
echo "   http://localhost:8000/admin-secret-panel.html"
echo ""
echo "For more information, see:"
echo "   - CLI_SETUP_GUIDE.md"
echo "   - ENCRYPTION_KEY_SETUP.md"
echo ""
