# 🔐 Gated Access System

## Overview

A complete, production-ready system to gate website access behind time-limited codes sent via email or SMS. Ideal for portfolios, demos, or exclusive content.

**Key Features:**

- ✅ Email & SMS code verification
- ✅ 20-minute access windows
- ✅ IP address + contact tracking
- ✅ Real-time admin dashboard
- ✅ Firebase Firestore integration
- ✅ Fully responsive UI
- ✅ Zero external tracking

---

## 📦 What's Included

### Backend

- **Gated Access API** (`backend/routes/gated-access.js`)
  - Send codes via email/SMS
  - Verify codes and create tokens
  - Check session validity
  - View access logs

### Frontend

- **Access Modal** (`frontend/gated-access.js`)
  - Beautiful UI for code requests
  - Email/SMS tab switching
  - Code input validation
  - Token management

### Gated Websites (5 Total)

- `plasmic.html` - Plasmic design platform
- `cubix.html` - 3D gaming platform
- `fallen-futuristics.html` - Tech showcase
- `atlas.html` - Mapping platform
- `la-vie.html` - Lifestyle ecosystem

### Admin Dashboard

- `gated-access-admin.html` - Real-time stats & logs

### Documentation

- `GATED_ACCESS_INDEX.md` - Navigation & reference
- `GATED_ACCESS_SETUP.md` - Detailed setup guide
- `GATED_ACCESS_QUICKSTART.md` - Quick checklist
- `GATED_ACCESS_SYSTEM_SUMMARY.md` - Architecture

---

## 🚀 Quick Start

### 1. Configure Environment

```env
# Create backend/.env

GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
TWILIO_ACCOUNT_SID=ACxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890

# Firebase (already configured)
FIREBASE_API_KEY=...
FIREBASE_PROJECT_ID=...
```

**Get Credentials:**

- **Gmail**: https://myaccount.google.com/apppasswords
- **Twilio**: https://www.twilio.com/console

### 2. Install & Start

```bash
cd backend
npm install
npm start
```

### 3. Test

Visit: http://localhost:8000/plasmic.html

---

## 💡 How It Works

```
User visits gated site
    ↓
Show access modal
    ↓
User enters email/phone
    ↓
Generate 6-digit code
    ↓
Send via email/SMS
    ↓
User enters code
    ↓
Create session token
    ↓
✅ Access granted for 20 minutes
    ↓
After 20 mins → Prompt for new code
```

---

## 🎨 Customization

### Change Access Duration

Edit `backend/routes/gated-access.js` line 8:

```javascript
const timeLimit = 20; // minutes
```

### Add New Site

1. Update `GATED_SITES` array in backend
2. Create new HTML file (copy from plasmic.html)
3. Change site ID in script

### Whitelist Users

```javascript
// In verify-code endpoint
const WHITELIST = ["user@example.com"];
if (!WHITELIST.includes(contact)) {
  return res.status(403).json({ error: "Not authorized" });
}
```

---

## 📊 Admin Dashboard

Visit: **http://localhost:8000/gated-access-admin.html**

Shows:

- 📈 Total requests & verified access
- 👥 Unique users
- 🌐 Access breakdown by site
- 📱 Email vs SMS distribution
- 📋 Live access logs (searchable)
- 📥 Export to CSV

---

## 🔐 Data & Privacy

### What's Collected

- Contact (email or phone)
- IP address
- Site accessed
- Timestamp
- Verification status

### Where It's Stored

- Firebase Firestore
- Collections: `access_codes`, `sessions`
- View in: Firebase Console

### Privacy Notice

✅ Included in modal: "We collect your contact information and IP address..."

---

## 🧪 Testing

### Manual Test

1. Visit any gated site
2. Enter email/phone
3. Copy code from email/SMS
4. Verify code
5. Access granted!

### API Test (curl)

```bash
# Send code
curl -X POST http://localhost:5000/api/gated/send-code-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","site":"plasmic"}'

# Verify code
curl -X POST http://localhost:5000/api/gated/verify-code \
  -H "Content-Type: application/json" \
  -d '{"code":"123456","contact":"test@example.com","site":"plasmic"}'

# Check session
curl http://localhost:5000/api/gated/check-session/TOKEN/plasmic

# View logs
curl http://localhost:5000/api/gated/access-logs
```

---

## 🔗 API Endpoints

```
POST /api/gated/send-code-email
POST /api/gated/send-code-sms
POST /api/gated/verify-code
GET  /api/gated/check-session/:token/:site
GET  /api/gated/access-logs
```

Full docs: [GATED_ACCESS_SETUP.md](GATED_ACCESS_SETUP.md)

---

## 📱 Sites Available

| Site               | ID                   | URL                      |
| ------------------ | -------------------- | ------------------------ |
| Plasmic            | `plasmic`            | /plasmic.html            |
| Cubix              | `cubix`              | /cubix.html              |
| Fallen Futuristics | `fallen-futuristics` | /fallen-futuristics.html |
| Atlas              | `atlas`              | /atlas.html              |
| La Vie             | `la-vie`             | /la-vie.html             |

---

## ⏱️ Key Timings

- **Code valid**: 20 minutes from creation
- **Token valid**: 20 minutes from verification
- **Email delivery**: 1-2 seconds
- **SMS delivery**: 1-3 seconds
- **Warning threshold**: 2 minutes remaining

---

## 🛠️ Tech Stack

- **Backend**: Express.js, Firebase Admin SDK
- **Frontend**: Vanilla JavaScript (no dependencies)
- **Database**: Firebase Firestore
- **Email**: Gmail SMTP
- **SMS**: Twilio API
- **Auth**: Simple code verification

---

## 🐛 Troubleshooting

### Codes not sending

- Check `.env` credentials
- Verify Gmail App Password (not regular password)
- Check Twilio account active

### "Invalid session" error

- Token expired (20 min window)
- Clear localStorage
- Request new code

### Backend won't start

- Run `npm install` in backend folder
- Check Node.js version (v14+)
- Check `.env` exists

### Firebase connection fails

- Verify credentials in `.env`
- Check Firestore database created
- Check network connectivity

---

## 📖 Documentation Files

| File                           | Purpose                             |
| ------------------------------ | ----------------------------------- |
| GATED_ACCESS_INDEX.md          | Start here - navigation & reference |
| GATED_ACCESS_QUICKSTART.md     | Setup checklist                     |
| GATED_ACCESS_SETUP.md          | Detailed guide                      |
| GATED_ACCESS_SYSTEM_SUMMARY.md | Architecture & flow                 |

---

## 🚀 Deployment

### To Heroku

```bash
cd backend
heroku create your-app
git push heroku main
```

### To Other Platforms

1. Deploy backend to: Google Cloud, AWS, Azure, etc.
2. Update frontend API URL (or use relative `/api/gated`)
3. Set environment variables
4. Firebase Firestore auto-syncs

---

## 🔒 Security Considerations

- ✅ 6-digit codes (not user passwords)
- ✅ 20-minute expiry
- ✅ Single-use codes
- ✅ Random session tokens
- ✅ IP logging
- ✅ Firebase security rules (optional)

**Not recommended for:** Financial, health, or highly sensitive data. Use OAuth for those.

---

## 📈 What You Can Measure

- Daily/weekly access trends
- Most popular sites
- Email vs SMS preference
- Verification success rate
- Peak usage times
- Geographic distribution (with GeoIP)

---

## 🎓 Learning Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [Twilio SMS](https://www.twilio.com/docs/sms)
- [Gmail SMTP](https://support.google.com/accounts/answer/185833)
- [Express.js](https://expressjs.com/)

---

## 💬 Support

- Check documentation in root directory
- Review source code (well-commented)
- Test with API endpoints
- Monitor Firebase Firestore
- Check admin dashboard

---

## 📝 License

Free to use and modify for your projects.

---

## ✅ Complete Feature Checklist

- [x] Email code sending
- [x] SMS code sending
- [x] Code verification
- [x] Session management
- [x] Token expiry
- [x] IP logging
- [x] Admin dashboard
- [x] Mobile responsive
- [x] Beautiful UI
- [x] Complete documentation
- [x] Testing endpoints
- [x] Error handling
- [x] Privacy compliance

---

## 🎯 Use Cases

- 🎨 Portfolio portfolio demos
- 🔐 Exclusive content access
- 📱 App beta testing
- 💼 Client presentations
- 🎓 Course access gates
- 🎪 Event registration
- 🔑 Limited previews

---

**Status**: ✅ Production Ready  
**Version**: 1.0  
**Created**: Feb 2026

🚀 **Ready to go!** Follow the Quick Start above to begin.
