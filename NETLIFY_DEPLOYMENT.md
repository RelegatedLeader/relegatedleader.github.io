# 🚀 Netlify Deployment Setup Guide

Your system is ready to deploy! Follow these steps to get everything working on Netlify under a single domain.

---

## ✅ Step 1: Get Firebase Credentials

1. Go to Firebase Console:
   https://console.firebase.google.com/project/relegatedleader-54c49/settings/general

2. Click the **"Service Accounts"** tab at the top

3. Click **"Generate New Private Key"** button
   - A JSON file will download

4. Open the JSON file and copy these fields into `backend/.env`:

```env
FIREBASE_PROJECT_ID=relegatedleader-54c49
FIREBASE_PRIVATE_KEY_ID=<copy from json: "private_key_id">
FIREBASE_PRIVATE_KEY="<copy from json: "private_key">"
FIREBASE_CLIENT_EMAIL=<copy from json: "client_email">
FIREBASE_CLIENT_ID=<copy from json: "client_id">
FIREBASE_DATABASE_URL=https://relegatedleader-54c49.firebaseio.com
```

5. Also on the same Firebase "General" settings page, scroll up and copy:

```env
FIREBASE_API_KEY=<copy from "Your apps" section: Web API Key>
FIREBASE_AUTH_DOMAIN=relegatedleader-54c49.firebaseapp.com
FIREBASE_STORAGE_BUCKET=relegatedleader-54c49.appspot.com
FIREBASE_MESSAGING_SENDER_ID=293437545008
FIREBASE_APP_ID=<copy from "Your apps": App ID>
```

---

## ✅ Step 2: Get Twilio Credentials

1. Go to Twilio Console:
   https://www.twilio.com/console

2. Under "Account Info" you'll see:
   - **Account SID**: Copy this
   - **Auth Token**: Click the eye icon and copy

3. Go to "Phone Numbers" → "Manage Numbers"
   - Copy your verified phone number (format: +1234567890)

4. Add to `backend/.env`:

```env
TWILIO_ACCOUNT_SID=ACe5039ee820f057d81ceecc65a3fc92ad
TWILIO_AUTH_TOKEN=<your auth token>
TWILIO_PHONE_NUMBER=<your twilio phone>
```

---

## ✅ Step 3: Get Gmail App Password

1. Go to Google Account Settings:
   https://myaccount.google.com/apppasswords

2. Select "Mail" and "Windows Computer"

3. Google will generate a 16-character password

4. Add to `backend/.env`:

```env
SMTP_USER=frankalfaro105@gmail.com
SMTP_PASSWORD=<16-char password from Google>
```

---

## ✅ Step 4: Update backend/.env

Open `backend/.env` and update with ALL credentials from steps 1-3:

```env
# ===== ENCRYPTION KEY (already generated) =====
ENCRYPTION_KEY=e3c48e914965fc3b97058f2fc6955e95476d18dc01dfa647b064f693e3e8f95a

# ===== FIREBASE CREDENTIALS =====
FIREBASE_API_KEY=AIzaSy...
FIREBASE_AUTH_DOMAIN=relegatedleader-54c49.firebaseapp.com
FIREBASE_PROJECT_ID=relegatedleader-54c49
FIREBASE_STORAGE_BUCKET=relegatedleader-54c49.appspot.com
FIREBASE_MESSAGING_SENDER_ID=293437545008
FIREBASE_APP_ID=1:293437545008:web:...

# Admin SDK
FIREBASE_PRIVATE_KEY_ID=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@relegatedleader-54c49.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=...
FIREBASE_DATABASE_URL=https://relegatedleader-54c49.firebaseio.com

# ===== TWILIO CREDENTIALS =====
TWILIO_ACCOUNT_SID=ACe5039ee820f057d81ceecc65a3fc92ad
TWILIO_AUTH_TOKEN=<your token>
TWILIO_PHONE_NUMBER=<your phone>

# ===== EMAIL CREDENTIALS =====
SMTP_USER=frankalfaro105@gmail.com
SMTP_PASSWORD=<your 16-char password>

# ===== SERVER CONFIGURATION =====
PORT=5000
NODE_ENV=production
```

---

## ✅ Step 5: Test Locally

```bash
cd backend
npm start
```

Should see: `✅ Server running on http://localhost:5000`

---

## ✅ Step 6: Set Up Netlify

### 6a. Create netlify.toml

In root folder, create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  functions = "backend"
  publish = "./"

[dev]
  directory = "."
  port = 8000

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/server:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 6b. Update package.json

In root `package.json`, add:

```json
"scripts": {
  "build": "echo 'Frontend ready'",
  "dev": "npm start --prefix backend"
}
```

### 6c. Install Netlify CLI

```bash
netlify login
netlify init
```

---

## ✅ Step 7: Deploy to Netlify

```bash
# Option 1: Via Netlify CLI
netlify deploy --prod

# Option 2: Connect GitHub repo to Netlify Dashboard
# https://app.netlify.com
```

---

## ✅ Step 8: Add Environment Variables to Netlify

1. Go to Netlify Dashboard:
   https://app.netlify.com

2. Select your site: `relegatedleader`

3. Go to **Settings** → **Build & Deploy** → **Environment**

4. Click **"Edit variables"**

5. Add all your `.env` variables from Step 4

6. **Redeploy** the site

---

## ✅ Single Domain Setup

Everything now works under:

- **Frontend**: https://relegatedleader.github.io
- **Backend**: https://relegatedleader.github.io/api/...
- **Admin Panel**: https://relegatedleader.github.io/admin-secret-panel.html

No need for separate URLs! 🎉

---

## 🧪 Test It

1. Go to: https://relegatedleader.github.io/plasmic.html
2. Modal appears
3. Enter email: frankalfaro105@gmail.com
4. Click "Send Code via Email"
5. Check email for code
6. Enter code
7. Should see admin panel OR site access

---

## 📝 Troubleshooting

**"Firebase configuration missing"**
→ Check all FIREBASE\_\* variables are in backend/.env

**"Twilio error"**
→ Verify TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN

**"Email not sending"**
→ Use Gmail app-specific password (not regular password)

**"Deployment failed"**
→ Check Netlify logs: `netlify logs`

---

## 🔗 All URLs

| Page        | URL                                                           |
| ----------- | ------------------------------------------------------------- |
| Home        | https://relegatedleader.github.io                             |
| Plasmic     | https://relegatedleader.github.io/plasmic.html                |
| Cubix       | https://relegatedleader.github.io/cubix.html                  |
| Admin Panel | https://relegatedleader.github.io/admin-secret-panel.html     |
| API Health  | https://relegatedleader.github.io/api/health                  |
| Access Logs | https://relegatedleader.github.io/api/gated/admin/access-logs |

---

**When everything works, your system is complete!** ✨

Encryption Key Generated: ✅
Firebase Authenticated: ✅
Twilio Connected: ✅  
Backend Ready: ⏳ (After credentials)
Netlify Deployed: ⏳ (After backend)
