# Portfolio Authentication System - Setup Guide

## Overview

This is a complete authentication and access control system for your portfolio website. It allows you to:

- Control who can view your projects
- Track all visitors and their information
- Approve/reject access requests manually
- Manage 20-minute access sessions
- Collect and encrypt sensitive data

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- Firebase account (free tier works)
- Twilio account for SMS (optional)
- Gmail or ProtonMail for email notifications

### Step 1: Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (e.g., "portfolio-auth")
3. Go to **Project Settings** → **Service Accounts**
4. Click "Generate New Private Key" and save the JSON file
5. Copy these values for your `.env` file:

   - `FIREBASE_API_KEY` (from API keys section)
   - `FIREBASE_AUTH_DOMAIN` (format: `project-id.firebaseapp.com`)
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_MESSAGING_SENDER_ID`
   - `FIREBASE_APP_ID`

6. Enable Firestore Database:
   - Go to **Firestore Database**
   - Click "Create Database"
   - Choose "Start in production mode" (you'll set security rules later)

### Step 2: Set Up Twilio (for SMS notifications)

1. Go to [Twilio Console](https://www.twilio.com/console)
2. Get your credentials:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER` (your Twilio number)

### Step 3: Configure Backend

1. Navigate to backend folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file from example:

```bash
cp .env.example .env
```

4. Fill in your `.env` file with actual values:

```
FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=your_domain
...
ADMIN_EMAIL=frankalfaro105@proton.me
ADMIN_PHONE=346-282-1804
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
ENCRYPTION_KEY=generate_32_character_string_here
ADMIN_SECRET_KEY=create_strong_random_key_for_admin_panel
```

### Step 4: Generate Encryption Keys

Run this in Node.js console:

```javascript
// For ENCRYPTION_KEY
require("crypto").randomBytes(16).toString("hex");
// Result: use this for ENCRYPTION_KEY

// For ADMIN_SECRET_KEY
require("crypto").randomBytes(32).toString("hex");
// Result: use this for ADMIN_SECRET_KEY
```

### Step 5: Start the Backend

```bash
npm start
# or for development with auto-reload:
npm run dev
```

Server will run on: `http://localhost:5000`
Admin Dashboard: `http://localhost:5000/admin`

---

## 📊 Admin Dashboard

Access the admin dashboard at: `http://localhost:5000/admin`

**Features:**

- View pending approval requests
- Approve or reject access
- See all access logs with user information
- Track statistics (active users, total requests, etc.)
- View IP addresses and locations

**Login:**

- First time: Enter your `ADMIN_SECRET_KEY`
- It will be saved in localStorage for convenience

---

## 🔌 Integration with Portfolio Website

### Add to Your HTML Files

1. Add this script before closing `</body>` tag in `index.html`, `misc.html`, etc:

```html
<script src="frontend/portfolio-auth.js"></script>
```

### Protect Project Links

Wrap project links with authentication check:

```html
<a onclick="checkAccessAndOpenProject(this)">
  <div class="mosaic-block"><!-- your project --></div>
</a>

<script>
  function checkAccessAndOpenProject(element) {
    portfolioAuth.checkAccess().then((hasAccess) => {
      if (hasAccess) {
        // Log the access event
        fetch("http://localhost:5000/api/auth/log-access", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: portfolioAuth.sessionId,
            projectName: "Your Project Name",
          }),
        });

        // Open the actual link
        window.location.href = element.querySelector("a").href;
      } else {
        portfolioAuth.openModal();
      }
    });
  }
</script>
```

---

## 🔐 Database Schema

### Collections in Firestore:

#### `verification_requests`

```
{
  id: string
  contactInfo: encrypted_string (email/phone)
  type: string ('email' or 'phone')
  verificationCode: encrypted_string
  ip: string
  location: {
    city: string
    country: string
    latitude: number
    longitude: number
    timezone: string
  }
  createdAt: timestamp
  expiresAt: timestamp
  verified: boolean
  approvalStatus: string ('pending', 'approved', 'rejected')
  attemptCount: number
  approvedAt: timestamp
  approvedBy: string
}
```

#### `access_sessions`

```
{
  id: string
  verificationRequestId: string
  contactInfo: encrypted_string
  approvedBy: string
  approvedAt: timestamp
  expiresAt: timestamp
  active: boolean
  personalInfo: {
    firstName: encrypted_string
    lastName: encrypted_string
    email: encrypted_string
    phone: encrypted_string
    age: number
    updatedAt: timestamp
  }
  usageLog: [
    {
      timestamp: timestamp
      action: string ('project_accessed', 'personal_info_updated')
      projectName: string
      ip: string
      location: object
    }
  ]
}
```

---

## 🔒 Security Features

1. **Encryption**: All sensitive data (email, phone, personal info) is encrypted at rest
2. **Session Management**: 20-minute expiring sessions stored in localStorage
3. **Code Expiry**: Verification codes expire after 15 minutes
4. **Rate Limiting**: Max 5 failed code attempts
5. **IP Tracking**: Logs approximate location from IP address
6. **Admin Authentication**: Admin panel protected with secret key

---

## 📧 Email & SMS Setup

### ProtonMail/Gmail for Emails

Update `.env`:

```
ADMIN_EMAIL=frankalfaro105@proton.me
ADMIN_EMAIL_PASSWORD=your_app_password
```

For Gmail, use [App Passwords](https://myaccount.google.com/apppasswords)

### Twilio for SMS

Already configured. Make sure credentials are in `.env`

---

## 🧪 Testing

1. **Test user request**:
   - Click a project
   - Enter your email/phone
   - You should receive a code
2. **Test admin approval**:

   - Go to admin dashboard: `http://localhost:5000/admin`
   - You should see pending request
   - Click "Approve"
   - You should receive approval notification

3. **Check access**:
   - Use the provided session ID
   - You should have 20 minutes of access

---

## 📝 API Endpoints

### Authentication

- `POST /api/auth/request-verification` - Request verification code
- `POST /api/auth/verify-code` - Verify code and wait for approval
- `POST /api/auth/validate-session` - Check if session is valid
- `POST /api/auth/submit-personal-info` - Submit additional info on re-auth
- `POST /api/auth/log-access` - Log project access

### Admin

- `GET /api/admin/pending-approvals` - Get pending requests
- `POST /api/admin/approve` - Approve request
- `POST /api/admin/reject` - Reject request
- `GET /api/admin/access-logs` - Get all access logs
- `GET /api/admin/stats` - Get dashboard statistics

### Access Control

- `POST /api/access/check` - Validate session

---

## 🚨 Important Notes

1. **Firestore Security Rules**: Update these in Firestore console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only allow reads from your admin panel
    match /{document=**} {
      allow read: if request.auth.uid != null;
      allow write: if false;
    }
  }
}
```

2. **CORS Settings**: Update in `server.js` with your actual domain when deployed

3. **Environment Variables**: Never commit `.env` to git! Use `.env.example` instead

4. **Backup Data**: Regularly export your Firestore data

---

## 🎯 Next Steps

1. Set up Firebase
2. Configure Twilio
3. Update `.env` file
4. Start backend server
5. Test authentication flow
6. Integrate with portfolio website
7. Deploy backend (Heroku, Firebase Cloud Functions, or similar)
8. Update frontend URLs for production

---

## 💡 Customization Ideas

- Add rate limiting to prevent abuse
- Implement email verification before approval
- Add custom approval messages
- Create export logs as CSV/PDF
- Add analytics dashboard
- Implement auto-approval for trusted IPs
- Add captcha to verification form

---

## 📞 Support

For issues or questions:

- Check backend logs: `npm run dev`
- Check browser console for frontend errors
- Verify Firebase/Twilio credentials
- Check `.env` file is properly formatted
