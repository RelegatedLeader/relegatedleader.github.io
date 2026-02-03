# Gated Access System - Documentation

## Overview

This system provides time-limited access (20 minutes) to specific websites via email/SMS code verification. IP addresses and contact information are collected and stored in Firebase for analytics.

## Features

- ✅ Email and SMS code verification
- ✅ 20-minute access windows
- ✅ IP address collection (legal with privacy notice)
- ✅ Session token system
- ✅ Access logs/analytics
- ✅ Automatic expiry handling

## Gated Sites

- `plasmic`
- `cubix`
- `fallen-futuristics`
- `atlas`
- `la-vie`

## Setup Instructions

### 1. Environment Variables (`.env`)

Add these to your backend `.env` file:

```env
# Gmail for email codes
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# Twilio for SMS codes
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Firebase (already configured)
FIREBASE_API_KEY=...
FIREBASE_PROJECT_ID=...
```

### 2. Get Credentials

**Gmail Setup:**

1. Enable 2FA on your Gmail account
2. Create App Password: https://myaccount.google.com/apppasswords
3. Copy the 16-character password to `GMAIL_APP_PASSWORD`

**Twilio Setup:**

1. Sign up: https://www.twilio.com
2. Get phone number (Trial or paid)
3. Find credentials in Account Info

### 3. Firestore Collections

The system automatically creates these collections:

**`access_codes`**

```json
{
  "code": "123456",
  "contact": "user@example.com",
  "contact_type": "email",
  "site": "plasmic",
  "ip_address": "192.168.1.1",
  "created_at": "timestamp",
  "used": false,
  "accessed_at": null
}
```

**`sessions`**

```json
{
  "token": "hex-token",
  "site": "plasmic",
  "contact": "user@example.com",
  "contact_type": "email",
  "ip_address": "192.168.1.1",
  "created_at": "timestamp",
  "expires_at": "timestamp",
  "active": true
}
```

## Implementation on Your Sites

### Simple Implementation (Recommended)

Add this to the top of any gated site HTML:

```html
<script src="/frontend/gated-access.js"></script>
<script>
  // Call this on page load - replace 'plasmic' with your site ID
  document.addEventListener("DOMContentLoaded", () => {
    initGatedAccess("plasmic");
  });
</script>
```

### What Happens:

1. User visits the gated page
2. `checkAccess()` verifies their token
3. If no valid token → shows modal
4. User enters email/phone
5. Code sent via email/SMS
6. User enters code
7. Token created, stored locally, access granted
8. Token valid for 20 minutes
9. After 20 mins, must request new code

## API Endpoints

### 1. Send Email Code

```
POST /api/gated/send-code-email
Body: { email: "user@example.com", site: "plasmic" }
Response: { success: true, masked_email: "u***@example.com" }
```

### 2. Send SMS Code

```
POST /api/gated/send-code-sms
Body: { phone: "+1234567890", site: "plasmic" }
Response: { success: true, masked_phone: "+1234***890" }
```

### 3. Verify Code

```
POST /api/gated/verify-code
Body: { code: "123456", contact: "user@example.com", site: "plasmic" }
Response: { success: true, token: "token", expires_in: 1200 }
```

### 4. Check Session

```
GET /api/gated/check-session/{token}/{site}
Response: { valid: true, remaining_time: 1000000 }
```

### 5. View Access Logs

```
GET /api/gated/access-logs
Response: [{ code, contact, site, ip_address, created_at, used, accessed_at }, ...]
```

## Legal Compliance

✅ **IP Collection**: Legal to collect with privacy notice (included in modal)
✅ **Email/Phone**: Voluntary - users choose to share
✅ **Transparency**: Privacy notice displayed in modal

### Add to Your Privacy Policy:

```
We collect your email or phone number and IP address to track
website access. This information is used for analytics and
security purposes and is not shared with third parties.
```

## Testing the System

### Test Endpoint 1: Send Email

```bash
curl -X POST http://localhost:5000/api/gated/send-code-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","site":"plasmic"}'
```

### Test Endpoint 2: Verify Code

Replace `CODE` and `TOKEN` from responses:

```bash
curl -X POST http://localhost:5000/api/gated/verify-code \
  -H "Content-Type: application/json" \
  -d '{"code":"123456","contact":"test@example.com","site":"plasmic"}'
```

### View Logs

```bash
curl http://localhost:5000/api/gated/access-logs
```

## Adding More Sites

To add a new site:

1. Add site ID to `GATED_SITES` array in `backend/routes/gated-access.js`
2. Add script to your HTML page (see Implementation section)
3. That's it!

## Troubleshooting

**Codes not sending?**

- Check `.env` has correct credentials
- Gmail: Verify App Password is correct
- Twilio: Ensure trial has balance or account is active

**Access modal keeps appearing?**

- Token likely expired (20 min window)
- Check browser console for errors
- Verify Firebase connection

**IP appears as "unknown"?**

- Check if request headers are correct
- X-Forwarded-For header may need proxy setup

## Access Control Options

### Option 1: Whitelist (Simple)

```javascript
// Add to gated-access.js
const WHITELIST = ["allowed@example.com", "+1234567890"];
if (!WHITELIST.includes(contact)) {
  return res.status(403).json({ error: "Not whitelisted" });
}
```

### Option 2: Admin Dashboard

- Create admin panel viewing all access
- Mark users as "approved" or "blocked"
- Add admin check in verification

## 20-Minute Window Details

- Code valid for: 20 minutes from creation
- Session token valid for: 20 minutes from verification
- After expiry: Must request new code
- Warning shown: At 2 minutes remaining

---

**Need help?** Check the API endpoints or review the backend code in `backend/routes/gated-access.js`
