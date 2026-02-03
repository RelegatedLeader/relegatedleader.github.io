# 🎬 Complete System Walkthrough

This document walks through the entire system from setup to production, with real examples.

---

## Part 1: Initial Setup (15 Minutes)

### Step 1.1: Run Setup Script

```bash
# Windows
setup-system.bat

# macOS/Linux
chmod +x setup-system.sh
./setup-system.sh
```

**What happens**:

- ✅ Node.js verified
- ✅ Firebase CLI installed
- ✅ Twilio CLI installed
- ✅ Encryption key generated: `a7f3e2c1b9d4f6e8a2c5d7f9e1b3c5d7a9f1e3c5d7f9b1a3c5d7f9e1b3c5`
- ✅ `backend/.env` template created
- ✅ `.gitignore` configured
- ✅ Firebase login initiated

### Step 1.2: Get Firebase Credentials

1. Go to https://console.firebase.google.com/?projectId=relegatedleader-54c49
2. Click ⚙️ Settings → Project Settings
3. Go to "Service Accounts" tab
4. Click "Generate New Private Key"
5. Copy into `backend/.env`:

```env
FIREBASE_PRIVATE_KEY_ID=abc123def456
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQE...\n-----END PRIVATE KEY-----\n"
```

### Step 1.3: Get Twilio Credentials

1. Go to https://www.twilio.com/console
2. Copy "Account SID": `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
3. Copy "Auth Token": `your_auth_token_here`
4. Get "Phone Number": `+1234567890`
5. Add to `backend/.env`:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

### Step 1.4: Get Gmail Credentials

1. Go to https://myaccount.google.com/security
2. Enable "App Passwords" (requires 2FA)
3. Generate password for "Mail" on "Windows"
4. Copy password to `backend/.env`:

```env
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
```

---

## Part 2: Testing Locally (10 Minutes)

### Step 2.1: Start Backend

```bash
cd backend
npm start
```

**Expected output**:

```
✓ Firebase initialized
✓ Server running on http://localhost:8000
✓ Encryption key loaded
```

### Step 2.2: Test Sending Code (Email)

**Frontend**:

1. Go to http://localhost:8000/plasmic.html
2. Modal appears: "Access Required"
3. Keep "Email" selected
4. Enter: `frankalfaro105@gmail.com`
5. Select site: "Plasmic"
6. Click "Send Code via Email"

**Backend logs**:

```
POST /api/gated/send-code-email
Contact: frankalfaro105@gmail.com
Site: plasmic
Admin access: YES
Access code created: 123456
Email sent successfully
```

**What happens**:

- ✅ Code generated (6 digits)
- ✅ Data encrypted in Firebase
- ✅ Email sent (check inbox)
- ✅ Code valid for 20 minutes

### Step 2.3: Test Verifying Code

1. Check email for code: `123456`
2. Back in modal, enter code
3. Click "Verify & Access"

**Backend logs**:

```
POST /verify-code
Contact: frankalfaro105@gmail.com
Code: 123456
Status: VERIFIED
Admin detected: YES
Session created with is_admin flag
```

**Frontend result**:

- ✅ Redirects to `/admin-secret-panel.html`
- ✅ You're automatically authenticated

### Step 2.4: View Admin Panel

**You see**:

- 📊 Statistics dashboard
- 📋 Access logs table
- 🔍 Search functionality
- 📥 CSV export button
- 🗺️ Protected sites list

**Data displayed** (all decrypted):

```
Contact          Type    Site      IP Address      Status    Requested
fra***@gmail.com EMAIL   plasmic   192.168.1.100   Verified  2024-01-15
```

---

## Part 3: Deployment (20 Minutes)

### Step 3.1: Firebase Deployment

```bash
firebase deploy
```

**Deploys**:

- ✅ Firestore security rules
- ✅ Cloud Functions
- ✅ Firestore indexes

### Step 3.2: Static Site Deployment

**Option A: Firebase Hosting**

```bash
firebase hosting:disable  # If not using
```

**Option B: GitHub Pages**

```bash
git add .
git commit -m "Gated access system deployed"
git push origin main
```

**Option C: Vercel**

```bash
vercel deploy
```

### Step 3.3: Verify Deployment

```bash
# Check Firebase deployment
firebase deploy --only firestore

# View logs
firebase functions:log

# Test endpoints
curl -X POST http://your-domain.com/api/gated/send-code-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","site":"plasmic"}'
```

---

## Part 4: Real-World Scenario

### Scenario: Someone Tries to Visit Plasmic Site

**Timeline**:

**T+0:00 - Visitor Arrives**

```
Visitor goes to plasmic.html
→ Frontend checks localStorage for valid token
→ No token found
→ Gating modal appears
```

**T+0:30 - Visitor Requests Code**

```
Visitor: Enters "alice@example.com" (NOT admin)
Visitor: Clicks "Send Code via Email"
→ Backend creates access_code: 654321
→ Data stored encrypted:
   - contact_encrypted: [AES-256 encrypted]
   - ip_encrypted: [encrypted IP]
   - is_admin_access: false
→ Email sent to alice@example.com
→ Firebase log created
```

**Backend Database**:

```
access_codes/
├── 654321: {
     contact_encrypted: "a8f2e1c...",
     ip_encrypted: "b9g3f2d...",
     site: "plasmic",
     is_admin_access: false,
     created_at: 2024-01-15T10:30:00Z,
     expires_at: 2024-01-15T10:50:00Z,
     used: false
   }
```

**T+5:00 - Visitor Enters Code**

```
Visitor: Receives email with code: 654321
Visitor: Enters code in modal
→ Backend verifies code
→ System checks: is_admin_access = false
→ Creates session token: abc123xyz789
→ Token stored in Firebase
→ Access granted for 20 minutes
→ localStorage.setItem('gated_token_plasmic', 'abc123xyz789')
→ Page reloads, user can now see plasmic.html
```

**T+25:00 - Token Expires**

```
User refreshes page
→ Frontend checks token expiry
→ Token expired (20 min window)
→ localStorage cleared
→ Gating modal appears again
```

---

## Part 5: Admin Access Scenario

### Scenario: You (Admin) Access the Secret Panel

**Timeline**:

**T+0:00 - Navigate to Admin Panel**

```
You: Go to /admin-secret-panel.html
→ Page loads, shows authentication form
→ Method: "Email" selected
→ Focus on email input
```

**T+0:15 - Request Code**

```
You: Enter "frankalfaro105@gmail.com"
You: Select "Plasmic" (any site works)
You: Click "Request Code"
→ Backend recognizes your email
→ Sets is_admin_access: true
→ Generates code: 111111
→ Email sent (or SMS if using phone)
```

**Backend Processing**:

```javascript
// gated-access.js
const isAdmin = (contact) =>
  ["frankalfaro105@gmail.com", "frankalfaro105@proton.me"].includes(contact) ||
  ["+13462821804"].includes(contact);

if (isAdmin(email)) {
  accessCode.is_admin_access = true; // Marked as admin
}
```

**T+0:30 - Receive Code**

```
You: Check email, find code: 111111
You: Enter code in "Enter Your Code" field
You: Click "Verify & Enter Admin Panel"
```

**T+0:45 - Admin Panel Unlocks**

```
→ Backend verifies code
→ Backend detects you're admin (is_admin_access=true)
→ Backend creates session with is_admin: true
→ Frontend receives response: { is_admin: true, token: "admin_xyz" }
→ Frontend routes to decryption dashboard
→ Admin panel appears with full access
```

**T+1:00 - View All Data (Decrypted)**

```
You: See admin dashboard
You: Click "Access Logs" tab
You: See all visitor data:

Contact              Type    Site      IP Address      Status
alice@example.com    EMAIL   plasmic   192.168.1.100   Verified
bob@test.com         EMAIL   cubix     203.0.113.45    Pending
+14155552671         SMS     atlas     192.0.2.123     Verified
```

**What's Happening Backend**:

```javascript
// When you request /admin/access-logs:
POST /api/gated/admin/access-logs
{
  token: "admin_xyz",
  admin_contact: "frankalfaro105@gmail.com"
}

// Backend:
// 1. Verifies token is valid
// 2. Checks admin_contact matches hardcoded admin
// 3. Queries all access_codes from Firebase
// 4. DECRYPTS contact_encrypted field
// 5. DECRYPTS ip_encrypted field
// 6. Returns plain data
```

**T+2:00 - Export Data**

```
You: Click "Export CSV" button
You: File downloads: admin-access-logs-2024-01-15.csv

CSV contains:
Contact,Type,Site,IP,Status,Requested,Verified
alice@example.com,EMAIL,plasmic,192.168.1.100,Verified,2024-01-15T10:30:00Z,2024-01-15T10:35:00Z
bob@test.com,EMAIL,cubix,203.0.113.45,Pending,2024-01-15T10:40:00Z,-
```

---

## Part 6: Security in Action

### How Data is Protected

**1. In Transit**:

```
User → (HTTPS) → Backend
Backend → (HTTPS) → Firebase
Admin → (HTTPS) → Backend
```

**2. At Rest (Firebase)**:

```
Original data:    "alice@example.com"
Encrypted:        "a7f3e2c1b9d4f6e8a2c5d7f9e1b3c5d7..."
Stored in DB:     ← Only encrypted version stored
```

**3. Decryption (Admin Only)**:

```
Backend receives: /admin/access-logs + admin token
Step 1: Verify token is valid
Step 2: Verify requester is admin email/phone
Step 3: Fetch encrypted data from Firebase
Step 4: Use ENCRYPTION_KEY from .env
Step 5: Decrypt data
Step 6: Return decrypted data (only to authenticated admin)
```

**4. Non-Admin Cannot Access**:

```
Regular user tries: curl /api/gated/admin/access-logs
Response: { error: "Unauthorized: Not an admin user" }
```

---

## Part 7: Common Tasks

### Task 1: Add New Site to Gating System

1. Create HTML file: `newsite.html`
2. Include gating modal:
   ```html
   <script src="/frontend/gated-access.js"></script>
   <script>
     initGatedAccess("newsite");
   </script>
   ```
3. Add to `gated-access.js` GATED_SITES_ENCRYPTED array
4. Deploy: `firebase deploy`

### Task 2: Check Who Visited Today

1. Access admin panel: `/admin-secret-panel.html`
2. View Access Logs tab
3. All today's visits shown with email/phone/IP
4. Filter by date or search

### Task 3: Revoke Access Token

1. Backend only: delete token from `sessions` collection
2. User will need to request new code

### Task 4: Backup Encryption Key

1. Copy from `backend/.env`
2. Store in password manager
3. Store in backup location (secure)

### Task 5: Rotate Encryption Key

1. Generate new key: `openssl rand -hex 32`
2. Cannot re-encrypt existing data automatically
3. New data uses new key
4. Old data remains encrypted with old key

---

## Part 8: Monitoring & Troubleshooting

### Check System Health

```bash
# Test Firebase connection
firebase functions:log

# Check encryption key
node -e "console.log(process.env.ENCRYPTION_KEY)"

# Test encryption works
node -e "require('./backend/routes/gated-access.js').testEncryption()"

# Monitor logs
firebase firestore:query access_codes --limit 10
```

### Debug Common Issues

**Problem: "Code not verifying"**

```bash
# Check code in Firebase:
firebase firestore:query access_codes \
  --filter "code=123456"

# Check expiry:
firebase firestore:query access_codes \
  --filter "expires_at>$(date -u +%s)"
```

**Problem: "Email not sent"**

```bash
# Check Twilio logs
twilio api:messaging:messaging_services:list

# Test SMTP
telnet smtp.gmail.com 587
```

**Problem: "Decryption fails"**

```bash
# Verify encryption key length (must be 64 hex chars)
echo "$ENCRYPTION_KEY" | wc -c  # Should be 65 (64 chars + newline)

# Verify it's valid hex
echo "$ENCRYPTION_KEY" | grep -E '^[a-f0-9]{64}$' && echo "Valid"
```

---

## Part 9: Performance Tips

### Optimize Database Queries

```javascript
// Good: Indexes Firestore queries
db.collection("access_codes")
  .where("site", "==", "plasmic")
  .where("used", "==", false)
  .orderBy("created_at", "desc")
  .limit(100);
```

### Cache Frequently Accessed Data

```javascript
// Admin sites list - cache for 1 hour
const sitesCache = {
  data: null,
  timestamp: null,
  ttl: 3600000, // 1 hour
};
```

### Limit Decryption Operations

```javascript
// Only decrypt when needed (in admin panel)
// Don't decrypt in logs endpoint, decrypt on frontend
```

---

## 🎯 Success Metrics

After deployment, monitor these metrics:

- **Availability**: Should be 99.9%+ (Firebase SLA)
- **Response Time**: < 500ms for code requests
- **Email Delivery**: > 98% (Gmail reliable)
- **SMS Delivery**: > 95% (Twilio reliability)
- **Verification Rate**: Track % who complete 2FA
- **Unique Visitors**: Monitor growth

---

## ✅ Final Verification Checklist

- [ ] Setup script ran successfully
- [ ] All credentials added to `.env`
- [ ] Backend starts without errors
- [ ] Can request code via email
- [ ] Can request code via SMS
- [ ] Code verification works
- [ ] Access granted for 20 minutes
- [ ] Token expires correctly
- [ ] Admin panel accessible
- [ ] Can view decrypted logs
- [ ] CSV export works
- [ ] Encryption key is secure
- [ ] `.env` not committed to git
- [ ] Firebase deployed successfully
- [ ] Production URL working

---

**🎉 Congratulations! Your gated access system is fully operational!**

For questions, refer to:

- `CLI_SETUP_GUIDE.md` - CLI setup details
- `ENCRYPTION_KEY_SETUP.md` - Encryption key management
- `GATED_ACCESS_README.md` - System overview
