# 🔐 Firebase & Twilio CLI Setup Guide

This guide explains how to set up the Firebase CLI and Twilio CLI for smooth integration with your gated access system.

## Quick Start

- **Firebase Project**: `relegatedleader-54c49`
- **Project Number**: `293437545008`
- **Gating System**: 5 protected sites with email/SMS 2FA verification
- **Admin Panel**: Secret panel with encrypted data access

---

## Part 1: Firebase CLI Setup

### What is Firebase CLI?

The Firebase CLI allows you to:

- Deploy functions and configuration to Firebase
- Manage Firestore database rules
- Set environment variables securely
- Interact with your Firebase project from the command line

### Installation

#### Windows (Recommended: PowerShell)

```powershell
# Install Node.js first (if not already installed)
# Then install Firebase CLI globally
npm install -g firebase-tools

# Verify installation
firebase --version
```

#### macOS/Linux

```bash
npm install -g firebase-tools
firebase --version
```

### Initial Setup

1. **Login to Firebase**:

   ```bash
   firebase login
   ```

   This opens a browser window to authenticate with your Google account.

2. **Initialize Firebase Project**:

   ```bash
   cd path/to/relegatedleader.github.io/backend
   firebase init
   ```

3. **During initialization, select**:
   - ✓ Firestore
   - ✓ Functions
   - ✓ Hosting (optional)
   - Project: `relegatedleader-54c49`

4. **This creates**:
   - `firebase.json` - Configuration file
   - `.firebaserc` - Project reference
   - `firestore.rules` - Database security rules
   - `functions/` - Cloud functions directory

### Configuration File Example

Create `backend/.env` file:

```env
# Firebase Configuration
FIREBASE_PROJECT_ID=relegatedleader-54c49
FIREBASE_PRIVATE_KEY_ID=<your-key-id>
FIREBASE_PRIVATE_KEY=<your-private-key>
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@relegatedleader-54c49.iam.gserviceaccount.com

# Encryption Key (IMPORTANT: Generate this!)
ENCRYPTION_KEY=<run: openssl rand -hex 32>

# Twilio Configuration
TWILIO_ACCOUNT_SID=<your-account-sid>
TWILIO_AUTH_TOKEN=<your-auth-token>
TWILIO_PHONE_NUMBER=<your-twilio-number>

# Email Configuration
SMTP_USER=frankalfaro105@gmail.com
SMTP_PASSWORD=<your-app-password>

# Server Configuration
PORT=8000
NODE_ENV=production
```

### Getting Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `relegatedleader-54c49`
3. Click ⚙️ Settings → Project Settings
4. Go to "Service Accounts" tab
5. Click "Generate New Private Key"
6. Copy values into your `.env` file

### Firestore Security Rules

Create `firestore.rules`:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Access logs - only admin can read
    match /access_logs/{document=**} {
      allow create: if request.auth != null;
      allow read: if request.auth.token.admin == true;
      allow write: if false;
    }

    // Session tokens
    match /sessions/{document=**} {
      allow write: if request.auth == null;
      allow read: if resource.data.user_contact == request.auth.token.email;
    }

    // Admin credentials
    match /admin/{document=**} {
      allow read: if request.auth.token.admin == true;
      allow write: if false;
    }
  }
}
```

### Deploy Configuration

```bash
# Deploy rules and functions
firebase deploy

# Deploy only rules
firebase deploy --only firestore:rules

# Deploy only functions
firebase deploy --only functions

# View deployment logs
firebase functions:log
```

---

## Part 2: Twilio CLI Setup

### What is Twilio CLI?

The Twilio CLI allows you to:

- Verify your Twilio account
- Test SMS sending
- Manage phone numbers
- Debug API calls

### Installation

#### Windows (PowerShell)

```powershell
# Using npm
npm install -g twilio-cli

# Verify installation
twilio --version
```

#### macOS/Linux

```bash
npm install -g twilio-cli
twilio --version
```

### Initial Setup

1. **Get Twilio Credentials**:
   - Go to [Twilio Console](https://www.twilio.com/console)
   - Account SID: Under "Account Info"
   - Auth Token: Under "Account Info" (click eye icon)
   - Phone Number: Under "Phone Numbers" → "Manage Numbers"

2. **Login with Twilio CLI**:

   ```bash
   twilio login
   ```

   Enter your Account SID and Auth Token when prompted.

3. **Verify Setup**:
   ```bash
   twilio api:core:accounts:fetch
   ```

### Testing SMS

```bash
# Send test SMS
twilio api:messaging:messaging_services:fetch <MESSAGING_SERVICE_SID>

# List phone numbers
twilio phone-numbers:list

# Test message
curl -X POST https://api.twilio.com/2010-04-01/Accounts/{AccountSID}/Messages.json \
  -d "To=+1234567890" \
  -d "From=+YOUR_TWILIO_NUMBER" \
  -d "Body=Test message" \
  -u {AccountSID}:{AuthToken}
```

### Store Credentials Securely

In `backend/.env`:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

---

## Part 3: Encryption Key Generation

### Generate Encryption Key (CRITICAL!)

This key encrypts all visitor data at rest in Firebase.

```powershell
# Windows PowerShell
# Option 1: Using OpenSSL (if installed)
openssl rand -hex 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```bash
# macOS/Linux
openssl rand -hex 32
```

### Store Encryption Key

Add to `backend/.env`:

```env
ENCRYPTION_KEY=<your-generated-hex-string>
```

**IMPORTANT**: Keep this key secret! Without it, encrypted data cannot be decrypted.

---

## Part 4: Complete Environment Setup

### Create `backend/.env` Template

```bash
cd backend
cp .env.example .env
```

Then edit with your values:

```env
# ==== FIREBASE ====
FIREBASE_PROJECT_ID=relegatedleader-54c49
FIREBASE_PRIVATE_KEY_ID=your_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@relegatedleader-54c49.iam.gserviceaccount.com

# ==== ENCRYPTION ====
ENCRYPTION_KEY=your_generated_hex_key

# ==== TWILIO ====
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890

# ==== EMAIL ====
SMTP_USER=frankalfaro105@gmail.com
SMTP_PASSWORD=your_gmail_app_password

# ==== SERVER ====
PORT=8000
NODE_ENV=production
```

---

## Part 5: Verify Everything Works

### Test Firebase Connection

```bash
cd backend
node -e "
  const admin = require('firebase-admin');
  require('dotenv').config();

  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
  };

  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  admin.firestore().collection('test').add({ created: new Date() })
    .then(() => console.log('✓ Firebase connection OK'))
    .catch(e => console.error('✗ Firebase error:', e.message));
"
```

### Test Twilio Connection

```bash
twilio phone-numbers:list
# Should show your phone number
```

### Test Encryption

```bash
node -e "
  require('dotenv').config();
  const crypto = require('crypto');

  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  const testData = 'test@example.com';

  // Encrypt
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(testData, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  const fullEncrypted = iv.toString('hex') + ':' + encrypted;

  // Decrypt
  const parts = fullEncrypted.split(':');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(parts[0], 'hex'));
  let decrypted = decipher.update(parts[1], 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');

  console.log('Original:', testData);
  console.log('Decrypted:', decrypted);
  console.log(testData === decrypted ? '✓ Encryption OK' : '✗ Encryption failed');
"
```

---

## Part 6: Deploy to Production

### Using Firebase Hosting

```bash
# Build your application (if needed)
npm run build

# Deploy to Firebase Hosting
firebase deploy

# View deployment status
firebase hosting:sites:list
```

### Using Firebase Functions (for backend)

```bash
# Deploy backend functions
cd backend/functions
firebase deploy --only functions

# View logs
firebase functions:log
```

---

## Part 7: Admin Panel Access

Once everything is set up:

1. **Access Secret Admin Panel**:
   - Go to `/admin-secret-panel.html`
   - Choose authentication method (email or phone)
   - Request verification code
   - You'll receive code via email/SMS
   - Enter code and authenticate
   - View decrypted visitor data

2. **Admin Credentials** (hardcoded in backend):
   - Emails: `frankalfaro105@gmail.com`, `frankalfaro105@proton.me`
   - Phone: `+13462821804`

3. **What You Can See**:
   - Total access requests
   - Verified access count
   - Unique visitors
   - Detailed access logs (decrypted email/phone/IP)
   - Protected sites list
   - Export data as CSV

---

## Troubleshooting

### Firebase CLI Not Found

```bash
npm install -g firebase-tools
firebase --version
```

### Firebase Login Issues

```bash
# Re-authenticate
firebase logout
firebase login

# Or use service account
firebase login:ci --no-localhost
```

### Twilio SMS Not Sending

1. Verify phone number in Twilio Console
2. Check Account SID and Auth Token
3. Test with: `twilio api:core:accounts:fetch`
4. Check SMS logs in Twilio Console

### Encryption Key Issues

1. Ensure `ENCRYPTION_KEY` is set in `.env`
2. Must be 64 hex characters (32 bytes)
3. Generate new one: `openssl rand -hex 32`

### Port Already in Use

```bash
# Windows - Kill process on port 8000
Get-Process | Where-Object {$_.Handles -like "8000"} | Stop-Process

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

---

## Security Best Practices

✅ **DO**:

- Generate strong encryption key
- Store `.env` in `.gitignore`
- Use Firebase service accounts
- Enable 2FA for Twilio account
- Regular backups of encryption key
- Monitor Firebase logs

❌ **DON'T**:

- Commit `.env` to GitHub
- Share encryption key via email
- Use weak passwords
- Log sensitive data
- Hardcode credentials in code

---

## Documentation Links

- [Firebase CLI Documentation](https://firebase.google.com/docs/cli)
- [Firebase Admin SDK](https://firebase.google.com/docs/database/admin/start)
- [Twilio API Documentation](https://www.twilio.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)

---

**Last Updated**: 2024
**Status**: ✅ Ready for Production
