# ⚡ Quick Reference Card

## 🚀 5-Minute Setup

```bash
# 1. Run setup script
setup-system.bat                    # Windows
./setup-system.sh                   # Mac/Linux

# 2. Edit backend/.env with credentials
# 3. Start server
cd backend && npm start

# 4. Access admin panel
http://localhost:8000/admin-secret-panel.html
```

---

## 🔑 Critical Commands

### Generate Encryption Key

```bash
openssl rand -hex 32
# or
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Start Backend

```bash
cd backend
npm start
```

### Deploy to Firebase

```bash
firebase deploy
```

### Check Logs

```bash
firebase functions:log
```

### Test Endpoints

```bash
# Request code via email
curl -X POST http://localhost:8000/api/gated/send-code-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","site":"plasmic"}'

# Verify code
curl -X POST http://localhost:8000/api/gated/verify-code \
  -H "Content-Type: application/json" \
  -d '{"code":"123456","contact":"test@example.com","site":"plasmic"}'
```

---

## 📁 Key Files

| File                             | Purpose                             |
| -------------------------------- | ----------------------------------- |
| `backend/.env`                   | Environment variables (create this) |
| `backend/routes/gated-access.js` | Main API (275+ lines)               |
| `frontend/gated-access.js`       | Modal UI & logic                    |
| `admin-secret-panel.html`        | Secret admin dashboard              |
| `backend/config/firebase.js`     | Firebase setup                      |

---

## 🔐 Admin Credentials

**Email**:

- `frankalfaro105@gmail.com`
- `frankalfaro105@proton.me`

**Phone**:

- `+13462821804`

---

## 🌐 Protected Sites

1. plasmic.html
2. cubix.html
3. fallen-futuristics.html
4. atlas.html
5. la-vie.html

---

## 📊 Admin Panel Features

✅ View all access logs (decrypted)
✅ Search/filter visitors
✅ Export data as CSV
✅ View statistics
✅ See protected sites list

---

## 🔒 Security

- **Encryption**: AES-256-CBC
- **Key Storage**: `.env` (not in git)
- **Admin Auth**: Email/Phone + 2FA
- **Data Encrypted**: Contact, IP, Sites list

---

## 🌍 URLs

| URL                        | Purpose            |
| -------------------------- | ------------------ |
| `/`                        | Home page          |
| `/plasmic.html`            | Protected site 1   |
| `/admin-secret-panel.html` | Secret admin panel |
| `/api/gated/*`             | API endpoints      |

---

## 📋 Environment Variables Template

```env
# Firebase
FIREBASE_PROJECT_ID=relegatedleader-54c49
FIREBASE_PRIVATE_KEY_ID=key_id
FIREBASE_PRIVATE_KEY=private_key
FIREBASE_CLIENT_EMAIL=email@iam.gserviceaccount.com

# Encryption (64 hex characters)
ENCRYPTION_KEY=your_key_here

# Twilio
TWILIO_ACCOUNT_SID=ACxxxx
TWILIO_AUTH_TOKEN=token
TWILIO_PHONE_NUMBER=+1234567890

# Email
SMTP_USER=frankalfaro105@gmail.com
SMTP_PASSWORD=app_password

# Server
PORT=8000
NODE_ENV=production
```

---

## 🛠️ API Reference

### Public Endpoints

```
POST /api/gated/send-code-email
  Body: { email: string, site: string }

POST /api/gated/send-code-sms
  Body: { phone: string, site: string }

POST /api/gated/verify-code
  Body: { code: string, contact: string, site: string }

GET /api/gated/check-session/:token/:site
```

### Admin Endpoints

```
POST /api/gated/admin/access-logs
  Body: { token: string, admin_contact: string }
  Returns: { logs: [...decrypted] }

POST /api/gated/admin/get-sites
  Body: { token: string, admin_contact: string }
  Returns: { sites: [...] }

POST /api/gated/admin/stats
  Body: { token: string, admin_contact: string }
  Returns: { total_requests: N, verified_access: N, unique_visitors: N }
```

---

## 🎯 User Flow

```
1. User visits protected site
2. Gating modal appears
3. User enters email or phone
4. 6-digit code sent
5. User enters code
6. Code verified (20-min window)
7. Access granted
8. Data stored (encrypted in Firebase)
```

---

## 👤 Admin Flow

```
1. Admin goes to /admin-secret-panel.html
2. Admin enters email or phone
3. 6-digit code sent
4. Admin enters code
5. System detects admin (hardcoded credentials)
6. Secret dashboard unlocks
7. View all decrypted data
```

---

## ⚠️ Do's and Don'ts

✅ **DO**:

- Store `.env` in `.gitignore`
- Use strong encryption key
- Backup encryption key
- Enable 2FA on Firebase/Twilio
- Monitor access logs

❌ **DON'T**:

- Commit `.env` to GitHub
- Share encryption key
- Use weak passwords
- Hardcode credentials
- Log sensitive data

---

## 🐛 Common Issues

| Issue                     | Solution                                    |
| ------------------------- | ------------------------------------------- |
| Code not verifying        | Check expiry (20 min), check encryption key |
| Email not sending         | Check Gmail app password, SMTP settings     |
| SMS not sending           | Check Twilio credentials, phone verified    |
| Admin panel shows no data | Check encryption key, admin credentials     |
| Firebase connection error | Check service account credentials           |

---

## 📞 Support Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [Twilio Docs](https://www.twilio.com/docs)
- [Node.js Docs](https://nodejs.org/docs)
- [Express.js Docs](https://expressjs.com)

---

## 📊 Monitoring

```bash
# Check Firebase deployment
firebase deploy --only firestore

# View function logs
firebase functions:log

# Query access logs
firebase firestore:query access_codes --limit 10

# Check site usage
firebase firestore:query sessions --limit 10
```

---

## 🚀 Deployment Checklist

- [ ] `.env` created with all credentials
- [ ] Encryption key generated (64 hex chars)
- [ ] Backend starts without errors
- [ ] Email sending works
- [ ] SMS sending works
- [ ] Admin panel accessible
- [ ] Can decrypt and view logs
- [ ] `.env` not in git
- [ ] Firebase deployed
- [ ] Production URL verified

---

**Last Updated**: 2024
**Status**: ✅ Production Ready

🔐 Your gated access system is ready!
