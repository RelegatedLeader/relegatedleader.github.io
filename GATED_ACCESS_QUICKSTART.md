# Quick Setup Checklist

## ✅ System Components Ready

### Backend Routes

- [x] Gated access API routes created
- [x] Email code sending
- [x] SMS code sending
- [x] Code verification
- [x] Session management
- [x] Access logging

### Frontend

- [x] Gated access modal system
- [x] Email/SMS tab switching
- [x] Code verification UI
- [x] Session token storage (localStorage)
- [x] 20-min countdown & expiry handling

### Protected Sites (5 total)

- [x] plasmic.html
- [x] cubix.html
- [x] fallen-futuristics.html
- [x] atlas.html
- [x] la-vie.html

---

## 🔧 To Complete Setup

### Step 1: Install Dependencies

```bash
cd backend
npm install
# (if npm fails due to cache issues, try: npm cache clean --force && npm install)
```

### Step 2: Configure `.env` File

Add to your `.env`:

```env
# Gmail Setup (required for email codes)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxx-xxxx-xxxx-xxxx

# Twilio Setup (required for SMS codes)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Firebase (should already exist)
FIREBASE_API_KEY=...
FIREBASE_PROJECT_ID=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...
```

### Step 3: Set Up Firebase Collections

Your backend will auto-create these collections when codes are generated:

- `access_codes` - stores generated codes and their status
- `sessions` - stores active session tokens

### Step 4: Start Backend Server

```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

### Step 5: Test the Flow

Visit any gated site:

- http://localhost:8000/plasmic.html
- http://localhost:8000/cubix.html
- http://localhost:8000/fallen-futuristics.html
- http://localhost:8000/atlas.html
- http://localhost:8000/la-vie.html

---

## 📱 Testing Flow

1. **Visit gated site** → Sees access modal
2. **Enter email or phone** → Receives code via email/SMS
3. **Enters code** → Gets 20-min session token
4. **Site becomes accessible** → User can browse for 20 mins
5. **After 20 mins** → Must request new code

---

## 📊 Monitoring Access

### View All Access Logs

```bash
curl http://localhost:5000/api/gated/access-logs
```

### Database Structure

**`access_codes` collection:**

```
{
  code: "123456",
  contact: "user@email.com",
  contact_type: "email",
  site: "plasmic",
  ip_address: "192.168.1.1",
  created_at: "timestamp",
  used: false,
  accessed_at: null
}
```

**`sessions` collection:**

```
{
  token: "hex-token-here",
  site: "plasmic",
  contact: "user@email.com",
  contact_type: "email",
  ip_address: "192.168.1.1",
  created_at: "timestamp",
  expires_at: "timestamp",
  active: true
}
```

---

## 🚀 Next Steps

### To Add More Sites

1. Add site ID to `GATED_SITES` array in `backend/routes/gated-access.js`
2. Create new HTML file with gating script
3. Done!

### To Customize Access Duration

Edit line 8 in `backend/routes/gated-access.js`:

```javascript
const timeLimit = 20; // Change this number (in minutes)
```

### To Require Whitelist

Add this check in `verify-code` endpoint:

```javascript
const WHITELIST = ["user@example.com", "+1234567890"];
if (!WHITELIST.includes(contact)) {
  return res.status(403).json({ error: "Not authorized" });
}
```

---

## 🔒 Legal & Privacy

✅ Included in system:

- Privacy notice in modal
- Transparent IP collection notice
- Voluntary email/phone sharing
- Data stored securely in Firebase

⚠️ Add to your Privacy Policy:

```
"We collect email/phone and IP addresses for access tracking
and analytics. This data is not shared with third parties."
```

---

## 🐛 Troubleshooting

**Problem: Codes not sending**

- Check `.env` has correct Gmail/Twilio credentials
- Gmail: Verify App Password (16 chars) not regular password
- Twilio: Check account has balance/active trial

**Problem: Access modal appears even with valid token**

- Check browser console for errors
- Clear localStorage: `localStorage.clear()`
- Verify backend is running and accessible

**Problem: "Invalid session" after verification**

- Token may be expired (20 min window)
- Check timestamp in localStorage
- Request new code

---

## 📞 Support

All source code:

- Backend: `backend/routes/gated-access.js`
- Frontend: `frontend/gated-access.js`
- Docs: `GATED_ACCESS_SETUP.md`

Files are well-commented for customization.
