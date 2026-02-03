# 🚀 Quick Netlify Setup Commands

## Step 1: Verify Encryption Key ✅

```bash
# Already generated:
echo e3c48e914965fc3b97058f2fc6955e95476d18dc01dfa647b064f693e3e8f95a
```

## Step 2: Get Firebase Credentials

Go to: https://console.firebase.google.com/project/relegatedleader-54c49/settings/general

**Service Accounts Tab:**

- Click "Generate New Private Key"
- Copy from JSON file to backend/.env:
  - FIREBASE_PRIVATE_KEY_ID
  - FIREBASE_PRIVATE_KEY
  - FIREBASE_CLIENT_EMAIL
  - FIREBASE_CLIENT_ID

**General Tab (scroll up):**

- Copy Web API Key → FIREBASE_API_KEY
- Copy App ID → FIREBASE_APP_ID

## Step 3: Get Twilio Credentials

Go to: https://www.twilio.com/console

Already done:

- TWILIO_ACCOUNT_SID=ACe5039ee820f057d81ceecc65a3fc92ad

Still need:

- TWILIO_AUTH_TOKEN (from console)
- TWILIO_PHONE_NUMBER (from Phone Numbers section)

## Step 4: Get Gmail App Password

Go to: https://myaccount.google.com/apppasswords

- Select "Mail" → "Windows"
- Copy 16-char password → SMTP_PASSWORD

## Step 5: Update backend/.env

```bash
cd backend
# Edit .env with all credentials from above
# Then test:
npm start
```

## Step 6: Deploy to Netlify

```bash
# Install Netlify CLI (already done)
netlify login

# Deploy
netlify deploy --prod
```

## Step 7: Add Environment Variables to Netlify

Go to: https://app.netlify.com → Your Site → Settings → Build & Deploy → Environment

Add each variable from your backend/.env file, then redeploy.

---

## 🧪 Testing Commands

```bash
# Test backend locally
cd backend
npm start
# Visit: http://localhost:5000/api/health

# Test Twilio
twilio phone-numbers:list

# Test Firebase
firebase projects:list

# Deploy to Netlify
netlify deploy --prod

# Check deployment logs
netlify logs
```

---

## 📋 Checklist

- [ ] Generated encryption key ✅
- [ ] Firebase credentials in backend/.env
- [ ] Twilio credentials in backend/.env
- [ ] Gmail app password in backend/.env
- [ ] Backend tested locally (npm start)
- [ ] Netlify login done
- [ ] netlify.toml created ✅
- [ ] Environment variables added to Netlify
- [ ] Deployed to Netlify
- [ ] Testing all endpoints

---

## 🔗 Important URLs

| Action            | URL                                                               |
| ----------------- | ----------------------------------------------------------------- |
| Firebase Console  | https://console.firebase.google.com/project/relegatedleader-54c49 |
| Twilio Console    | https://www.twilio.com/console                                    |
| Gmail Settings    | https://myaccount.google.com/apppasswords                         |
| Netlify Dashboard | https://app.netlify.com                                           |
| Your Site         | https://relegatedleader.github.io                                 |

---

## 💡 Common Issues

**"Firebase configuration missing"**
→ All FIREBASE\_\* variables must be in backend/.env

**"ENCRYPTION_KEY not found"**
→ Key is already in backend/.env (we set it)

**"Twilio not working"**
→ Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN

**"Gmail not sending"**
→ Use app-specific password, not regular password

**"Netlify deployment fails"**
→ Check: netlify logs

---

**Current Status:**
✅ CLIs installed (Firebase, Twilio, Netlify)
✅ Encryption key generated
✅ Firebase authenticated
✅ Twilio authenticated  
⏳ Need to add remaining credentials to backend/.env
⏳ Deploy to Netlify

**Next:** Follow NETLIFY_DEPLOYMENT.md to get all credentials, then run deploy script!
