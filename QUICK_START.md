# 🔥 Complete Firebase Setup - Step by Step

## ✅ What's Done:
- Firebase project created: `personal-site-auth`
- Firebase console opened in browser

## 📋 Now Do This:

### Step 1: Generate Private Key (3 clicks)
1. **Look at the browser** - Firebase console should be open
2. Click the blue **"Generate New Private Key"** button
3. A JSON file will download to your Downloads folder

### Step 2: Save Your Credentials
Run this PowerShell command:
```powershell
.\setup-env-from-firebase.ps1
```

This will:
- ✅ Find your downloaded JSON file
- ✅ Extract all Firebase credentials
- ✅ Auto-generate encryption keys
- ✅ Create your `backend/.env` file

### Step 3: Add Missing Credentials
The script will tell you what's missing:

**Get Twilio Credentials:**
1. Go to https://www.twilio.com
2. Sign up (free account)
3. Go to Dashboard
4. Copy: Account SID, Auth Token, Phone Number
5. Edit `backend/.env` and add them

**Get Gmail App Password:**
1. Go to https://myaccount.google.com
2. Go to Security
3. Enable 2-Step Verification
4. Go back to Security → App passwords
5. Select "Mail" and "Windows Computer"
6. Copy the 16-character password
7. Edit `backend/.env` and add it as `EMAIL_PASSWORD`

### Step 4: Initialize Firestore
```powershell
cd backend
node init-firestore.js
```

### Step 5: Start the Server!
```powershell
npm start
```

## 🎉 Done!
Your server will be running at: http://localhost:5000

---

## 📁 Files Created:
- `backend/.env` - Your configuration (KEEP PRIVATE!)
- `firebase-key-backup.json` - Backup of your credentials
- `personal-site-auth-key.json` - Downloaded key file

---

## ⚠️ Security:
- Never commit `.env` to git
- Never share your private key
- Keep backups safe

Ready? 👉 **Click "Generate New Private Key" in Firebase Console now!**
