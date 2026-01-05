# Installation Instructions - Windows

## Step 1: Install Node.js

1. Download from [nodejs.org](https://nodejs.org)
2. Choose LTS version
3. Run installer and follow prompts
4. Verify installation:
   ```cmd
   node --version
   npm --version
   ```

## Step 2: Setup Backend

1. Open Command Prompt or PowerShell
2. Navigate to project folder:

   ```cmd
   cd c:\Users\frank\Desktop\relegatedleader.github.io
   ```

3. Run setup script:

   ```cmd
   setup.bat
   ```

   Or manual steps:

   ```cmd
   cd backend
   npm install
   copy .env.example .env
   ```

## Step 3: Generate Keys

1. Open Node.js interactive shell:

   ```cmd
   node
   ```

2. Generate ENCRYPTION_KEY:

   ```javascript
   require("crypto").randomBytes(16).toString("hex");
   // Copy the output
   ```

3. Generate ADMIN_SECRET_KEY:

   ```javascript
   require("crypto").randomBytes(32).toString("hex");
   // Copy the output
   ```

4. Exit Node.js:
   ```javascript
   .exit
   ```

## Step 4: Configure .env File

1. Open `backend\.env` with Notepad or VS Code
2. Fill in all values:

   ```env
   # Firebase (get from Firebase Console)
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=sender_id
   FIREBASE_APP_ID=app_id

   # Admin Info
   ADMIN_EMAIL=frankalfaro105@proton.me
   ADMIN_PHONE=346-282-1804
   ADMIN_SECRET_KEY=paste_generated_key_here

   # Email Service (using Gmail)
   EMAIL_SERVICE=gmail
   GMAIL_APP_PASSWORD=your_gmail_app_password

   # SMS (Twilio)
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   TWILIO_PHONE_NUMBER=+1234567890

   # Encryption
   ENCRYPTION_KEY=paste_generated_key_here

   # Server
   PORT=5000
   NODE_ENV=development

   # Sessions
   SESSION_DURATION_MINUTES=20
   CODE_EXPIRY_MINUTES=15
   ```

## Step 5: Get Firebase Credentials

1. Go to [firebase.google.com](https://firebase.google.com)
2. Click "Go to console"
3. Create new project (or use existing)
4. Click "Settings" ⚙️ → "Project settings"
5. Under "Your apps", select `</>` (Web)
6. Copy the config values to .env

### Enable Firestore:

1. In Firebase console, click "Firestore Database"
2. Click "Create Database"
3. Start in "Production mode"
4. Choose nearest location
5. Click "Create"

## Step 6: Setup Twilio (for SMS)

1. Go to [twilio.com](https://twilio.com)
2. Sign up for free account (get $15 credits)
3. Go to [Twilio Console](https://www.twilio.com/console)
4. Copy Account SID and Auth Token to .env
5. Get a phone number and add to .env

**Note:** If you don't want SMS, you can skip this. Email alone works fine.

## Step 7: Setup Gmail

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click "Security" in left sidebar
3. Scroll down to "App passwords"
4. Select "Mail" and "Windows Computer"
5. Generate app password
6. Copy to `GMAIL_APP_PASSWORD` in .env

**Note:** You need 2-factor authentication enabled for app passwords

## Step 8: Start the Server

1. Open Command Prompt in `backend` folder
2. Run:

   ```cmd
   npm start
   ```

3. You should see:

   ```
   ✅ Server running on http://localhost:5000
   📊 Admin Dashboard: http://localhost:5000/admin
   ```

4. Open browser: http://localhost:5000/admin

## Step 9: Test the System

1. **Admin Dashboard**: http://localhost:5000/admin

   - You'll be asked for ADMIN_SECRET_KEY (first time only)
   - Enter your generated key
   - Should show "No pending approvals" (if no requests yet)

2. **Test Request**:
   - Open your portfolio: http://localhost:8000
   - Click a protected project
   - Enter your email
   - Check your inbox for verification code
   - Enter code in the form
   - Go to admin dashboard and approve
   - Check your email for approval notification

## Troubleshooting

### "node is not recognized"

- Node.js not installed or not in PATH
- Restart Command Prompt after installing Node.js
- Or use full path: `C:\Program Files\nodejs\node.exe`

### ".env file not found"

- Make sure you're in `backend` folder
- Run: `copy .env.example .env`

### "Cannot find module"

- Dependencies not installed
- Run: `npm install`

### "Port 5000 already in use"

- Change PORT in .env to something else (e.g., 5001)
- Or: `netstat -ano | findstr :5000` to find what's using it

### Email not sending

- Check `GMAIL_APP_PASSWORD` is correct
- Make sure 2FA is enabled on Gmail
- Check app password was generated (not regular password)

### Firebase errors

- Verify all keys copied correctly
- Check project ID matches
- Ensure Firestore is created
- Check internet connection

## Next Steps

1. Follow [SETUP_GUIDE.md](../SETUP_GUIDE.md) for detailed info
2. Integrate frontend auth modal into portfolio pages
3. Test with real users
4. Deploy to production (Heroku, Firebase, etc.)
5. Monitor admin dashboard for access logs

## Keep Server Running

### Option 1: Keep Command Prompt Open

- Just leave the window open while testing

### Option 2: Use PM2 (Process Manager)

```cmd
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

### Option 3: Windows Task Scheduler

1. Create a batch file `run-server.bat`:
   ```batch
   @echo off
   cd C:\Users\frank\Desktop\relegatedleader.github.io\backend
   npm start
   ```
2. Open Task Scheduler
3. Create Basic Task
4. Set to run `run-server.bat` on startup

## Need Help?

- Check browser console (F12) for errors
- Check server logs in Command Prompt
- Check .env file formatting
- Verify all credentials are correct
- Test with simpler email/phone first

Good luck! 🚀
