# 🔥 Complete Firebase Setup Guide

**Status**: NO MOCK DATA - Real Firebase Required ✅

This guide will help you set up a complete Firebase project for the portfolio authentication system.

---

## 📋 Prerequisites

- [x] Node.js v14+ installed
- [x] npm installed  
- [x] Firebase CLI installed (`firebase-tools`)
- [x] Google Account for Firebase

**To verify Firebase CLI is installed:**
```powershell
firebase --version
```

---

## 🚀 Step 1: Login to Firebase CLI

Open PowerShell and run:

```powershell
firebase login
```

This will:
1. Open your browser automatically
2. Ask you to sign in with your Google account
3. Grant Firebase CLI permission to manage your projects

**After login**, you'll see:
```
✔ Logged in as: your-email@gmail.com
```

---

## 🆕 Step 2: Create a Firebase Project

### Option A: Using Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a new project"
3. Enter project name: `portfolio-auth-system`
4. Choose a location (closest to your users)
5. Click "Create project"
6. Wait for project to initialize

**After creation, you'll see:**
- Project ID (e.g., `portfolio-auth-system-abc123`)
- Project dashboard

### Option B: Using Firebase CLI

```powershell
firebase projects:create portfolio-auth-system
```

---

## 🗄️ Step 3: Enable Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your `portfolio-auth-system` project
3. Click **"Firestore Database"** (left sidebar)
4. Click **"Create database"**
5. Choose your location (same as project location)
6. Select **"Start in production mode"**
7. Click **"Create"**

**Firestore is now ready** - you should see an empty database.

---

## 🔑 Step 4: Generate Service Account Credentials

This is the KEY to connecting your backend to Firebase.

### Get Service Account Key:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your `portfolio-auth-system` project
3. Click **⚙️ Settings** (gear icon) → **Project Settings**
4. Go to the **"Service Accounts"** tab
5. Click **"Generate New Private Key"** button
6. **Important**: Save this JSON file safely (you'll need it immediately)

**The JSON file will look like:**
```json
{
  "type": "service_account",
  "project_id": "portfolio-auth-system-abc123",
  "private_key_id": "abc123def456...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADA...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-abc123@portfolio-auth-system-abc123.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-..."
}
```

---

## 📝 Step 5: Create Your .env File

### Edit `backend/.env`:

Open the file at: `backend/.env`

**Copy all these values from your service account JSON** (replace the placeholders):

```dotenv
# Firebase Configuration (REQUIRED - Get from Service Account JSON)
FIREBASE_PROJECT_ID=portfolio-auth-system-abc123
FIREBASE_PRIVATE_KEY_ID=abc123def456...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADA...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xyz@portfolio-auth-system-abc123.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789
FIREBASE_AUTH_DOMAIN=portfolio-auth-system-abc123.firebaseapp.com
FIREBASE_DATABASE_URL=https://portfolio-auth-system-abc123.firebaseio.com
FIREBASE_STORAGE_BUCKET=portfolio-auth-system-abc123.appspot.com
FIREBASE_MESSAGING_SENDER_ID=987654321
FIREBASE_APP_ID=1:987654321:web:abcdef1234567890
FIREBASE_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xyz@portfolio-auth-system-abc123.iam.gserviceaccount.com

# Admin Credentials
ADMIN_EMAIL=frankalfaro105@proton.me
ADMIN_PHONE=346-282-1804

# Twilio SMS (REQUIRED)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

# Email Service (REQUIRED)
EMAIL_SERVICE=nodemailer
EMAIL_PROVIDER=gmail
EMAIL_FROM=frankalfaro105@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# Server
PORT=5000
NODE_ENV=production

# Session
SESSION_DURATION_MINUTES=20
CODE_EXPIRY_MINUTES=15

# Encryption Keys (Generate in Node.js)
ENCRYPTION_KEY=your_32_byte_hex_key
ADMIN_SECRET_KEY=your_64_byte_hex_key
```

### Important Notes:

**For FIREBASE_PRIVATE_KEY:**
- Copy the entire private key from JSON (including newlines)
- Wrap it in quotes: `"-----BEGIN...-----END-----\n"`
- The `\n` characters are literal (not actual newlines)

**For EMAIL_PASSWORD (Gmail):**
1. Enable 2-Step Verification in Google Account
2. Generate "App Password" for Gmail
3. Use that 16-character password

**For Encryption Keys:**
Generate in Node.js:
```powershell
node -e "console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('ADMIN_SECRET_KEY=' + require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📱 Step 6: Get Twilio Credentials (SMS Service)

### Create Twilio Account:

1. Go to [Twilio.com](https://www.twilio.com)
2. Sign up for a free account
3. Get your **Account SID** and **Auth Token** from dashboard
4. Buy a phone number (required for sending SMS)
5. Add to `.env`:

```dotenv
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## ✅ Step 7: Initialize Firestore Collections

Run this command to create the database structure:

```powershell
cd backend
node init-firestore.js
```

**Expected output:**
```
✅ Connected to Firebase Firestore
📝 Creating collections...
  ✅ verification_requests collection created
  ✅ access_sessions collection created
  ✅ audit_logs collection created
✅ Firestore Database Initialized Successfully!
```

---

## 🧪 Step 8: Test the Connection

Start the backend server:

```powershell
cd backend
npm start
```

**Expected output:**
```
✅ Firebase Firestore initialized successfully
✅ Server running on http://localhost:5000
📊 Admin Dashboard: http://localhost:5000/admin
```

If you see `✅ Firebase Firestore initialized successfully`, **your setup is complete!**

---

## 🔧 Troubleshooting

### Error: "Service account object must contain a string private_key property"
- **Fix**: Make sure `FIREBASE_PRIVATE_KEY` is wrapped in quotes with literal `\n` characters

### Error: "PERMISSION_DENIED: Missing or insufficient permissions"
- **Fix**: Make sure Firestore is enabled in Firebase Console
- Make sure you're using the correct service account

### Error: "Cannot find module 'firebase-admin'"
- **Fix**: Run `npm install` in the backend directory

### Error: "TWILIO_ACCOUNT_SID is missing"
- **Fix**: Add Twilio credentials to `.env` file

### Error: "Email service not configured"
- **Fix**: Add email credentials to `.env` file

---

## 📊 Verify Your Setup

After starting the server, test each endpoint:

### Health Check:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET
```

### Request Verification (Email):
```powershell
$body = @{
  contactInfo = "test@example.com"
  type = "email"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/request-verification" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

---

## 🎯 What's Included

Your Firebase setup now includes:

✅ **Firestore Database** - Store verification requests, sessions, logs  
✅ **Real Data** - No mock data, everything persistent  
✅ **Service Account** - Secure backend authentication  
✅ **Email Notifications** - Via Gmail  
✅ **SMS Notifications** - Via Twilio  
✅ **Encryption** - AES-256-CBC for sensitive data  
✅ **Admin Dashboard** - Real-time monitoring  

---

## 🚀 Next Steps

1. ✅ Frontend integration - Add auth modal to your portfolio pages
2. ✅ Deploy to production - Use your real Firebase project
3. ✅ Monitor usage - Check admin dashboard for activity
4. ✅ Scale up - Firebase handles growth automatically

---

## 📞 Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Twilio SMS Docs](https://www.twilio.com/docs/sms)
- [Node.js Firebase Admin SDK](https://firebase.google.com/docs/database/admin/start)

---

**Last Updated**: January 3, 2026  
**Status**: ✅ Production Ready - Real Firebase Required
