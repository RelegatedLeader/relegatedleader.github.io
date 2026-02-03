# 🔑 ENCRYPTION_KEY Setup - CRITICAL STEP

## Why This Matters

Your encryption key is the **master key** that encrypts and decrypts all visitor data in Firebase. Without it, encrypted data cannot be decrypted - not even by you!

---

## Generate Your Encryption Key

### Option 1: Using PowerShell (Windows)

```powershell
# Install OpenSSL if needed (or skip to Option 2)
# Using Node.js directly:

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Output Example**:

```
a7f3e2c1b9d4f6e8a2c5d7f9e1b3c5d7a9f1e3c5d7f9b1a3c5d7f9e1b3c5
```

### Option 2: Using OpenSSL (Windows/Mac/Linux)

```bash
openssl rand -hex 32
```

### Option 3: Using online generator (less secure, use only for testing)

https://www.random.org/hex/ (generate 64 characters)

---

## Store the Key Safely

### Step 1: Create `backend/.env` file

```bash
cd backend
type nul > .env  # Windows
touch .env       # Mac/Linux
```

### Step 2: Add Your Key

Open `backend/.env` and add:

```env
ENCRYPTION_KEY=a7f3e2c1b9d4f6e8a2c5d7f9e1b3c5d7a9f1e3c5d7f9b1a3c5d7f9e1b3c5
```

### Step 3: Verify It's in .gitignore

Open `.gitignore` and add:

```
.env
.env.local
.env.*.local
```

This prevents accidental commit to GitHub.

### Step 4: Test the Key

```bash
cd backend
npm test  # If you have tests set up
# Or manually test:
node -e "
  require('dotenv').config();
  console.log('✓ ENCRYPTION_KEY loaded:', process.env.ENCRYPTION_KEY.substring(0, 10) + '...');
"
```

---

## Update `.env` Template

Here's a complete template for `backend/.env`:

```env
# ===== FIREBASE CREDENTIALS =====
FIREBASE_PROJECT_ID=relegatedleader-54c49
FIREBASE_PRIVATE_KEY_ID=<from Firebase Console>
FIREBASE_PRIVATE_KEY=<from Firebase Console - must be wrapped in quotes>
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@relegatedleader-54c49.iam.gserviceaccount.com

# ===== ENCRYPTION KEY (GENERATED ABOVE) =====
ENCRYPTION_KEY=<your-hex-string>

# ===== TWILIO CREDENTIALS =====
TWILIO_ACCOUNT_SID=<your Account SID>
TWILIO_AUTH_TOKEN=<your Auth Token>
TWILIO_PHONE_NUMBER=<your Twilio phone>

# ===== EMAIL CREDENTIALS =====
SMTP_USER=frankalfaro105@gmail.com
SMTP_PASSWORD=<Gmail app-specific password>

# ===== SERVER CONFIGURATION =====
PORT=8000
NODE_ENV=production
```

---

## Key Requirements

- **Length**: Exactly 64 hexadecimal characters (32 bytes)
- **Format**: Lowercase hex only (0-9, a-f)
- **Uniqueness**: Should be randomly generated
- **Secrecy**: Never share or commit to repository
- **Backup**: Store safely (password manager recommended)

---

## Quick Verification

```bash
# Check if key is properly formatted
node -e "
  const key = 'a7f3e2c1b9d4f6e8a2c5d7f9e1b3c5d7a9f1e3c5d7f9b1a3c5d7f9e1b3c5';
  console.log('Length:', key.length);
  console.log('Valid hex?', /^[a-f0-9]{64}$/i.test(key) ? '✓ YES' : '✗ NO');
"
```

---

## If You Lose the Key

⚠️ **IMPORTANT**: If you lose this key:

- All encrypted data in Firebase becomes unreadable
- You cannot decrypt visitor emails, phone numbers, or IPs
- You'll need to reset Firebase and start fresh

**Backup Strategy**:

1. Save key in password manager (1Password, LastPass, etc.)
2. Store in secure document (encrypted)
3. Don't just save to notepad on desktop

---

## What Gets Encrypted

Once you set this key, the following data is automatically encrypted:

✅ **Encrypted at Rest**:

- Visitor email addresses
- Visitor phone numbers
- Visitor IP addresses
- Protected sites list

✅ **Where It's Used**:

- Admin panel decryption
- Access logs viewing
- Data export (CSV)

✅ **Only Accessible By**:

- Admin users (after 2FA verification)
- Your specific credentials:
  - Email: `frankalfaro105@gmail.com`
  - Email: `frankalfaro105@proton.me`
  - Phone: `+13462821804`

---

## Environment Variable Best Practices

### Don't Do This ❌

```javascript
// Bad - hardcoded key
const ENCRYPTION_KEY =
  "a7f3e2c1b9d4f6e8a2c5d7f9e1b3c5d7a9f1e3c5d7f9b1a3c5d7f9e1b3c5";
```

```bash
# Bad - committed to git
echo "ENCRYPTION_KEY=xxx" > .env  # Then git add .env
```

### Do This Instead ✅

```javascript
// Good - load from .env
require("dotenv").config();
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  throw new Error("ENCRYPTION_KEY not set in .env");
}
```

```bash
# Good - use .gitignore
echo ".env" >> .gitignore
echo "ENCRYPTION_KEY=<your-key>" > .env  # NOT committed
```

---

## Testing Encryption/Decryption

```bash
node -e "
  const crypto = require('crypto');
  const key = Buffer.from('a7f3e2c1b9d4f6e8a2c5d7f9e1b3c5d7a9f1e3c5d7f9b1a3c5d7f9e1b3c5', 'hex');

  // Test data
  const testData = 'test@example.com';

  // Encrypt
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(testData, 'utf-8', 'hex');
  encrypted += cipher.final('hex');

  // Decrypt
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');

  console.log('Original:  ', testData);
  console.log('Encrypted: ', encrypted.substring(0, 20) + '...');
  console.log('Decrypted: ', decrypted);
  console.log('Match:', testData === decrypted ? '✓ SUCCESS' : '✗ FAILED');
"
```

---

## Production Deployment

### Before Going Live:

1. ✅ Generate strong encryption key
2. ✅ Set `ENCRYPTION_KEY` in production `.env`
3. ✅ Never log the key
4. ✅ Enable HTTPS on all endpoints
5. ✅ Use environment variables (not config files)
6. ✅ Backup encryption key securely
7. ✅ Test encryption/decryption works

### Recommended: Use Environment Management Service

- **Heroku**: Use Config Vars
- **Google Cloud**: Use Secret Manager
- **AWS**: Use Systems Manager Parameter Store
- **Azure**: Use Key Vault

---

## Summary

1. **Generate**: `openssl rand -hex 32` or Node.js command
2. **Store**: Add to `backend/.env`
3. **Protect**: Add `.env` to `.gitignore`
4. **Verify**: Test encryption/decryption works
5. **Backup**: Save key in password manager
6. **Deploy**: Set in production environment

Once set up, all visitor data will be encrypted automatically! 🔐

---

**Status**: ✅ Required for system functionality
**Security Level**: 🔴 CRITICAL
