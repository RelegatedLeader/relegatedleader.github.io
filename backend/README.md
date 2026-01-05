# Portfolio Access Control System - Backend

A secure, Firebase-based authentication and access control system for portfolio websites. Users must request access via email or phone, you approve them, and they get 20 minutes of access to view projects.

## Features

✅ **User Authentication**

- Email or phone verification
- 6-digit code verification
- 15-minute code expiry
- Rate limiting (5 failed attempts)

✅ **Admin Approval System**

- Email + SMS notifications
- Admin dashboard for approvals
- Approve/reject requests
- Set approval comments

✅ **Access Management**

- 20-minute access sessions
- Automatic session expiry
- Re-authentication with personal info
- Session validation endpoints

✅ **Data Collection & Security**

- Encrypted storage (AES-256)
- IP address logging
- Location tracking
- Personal information collection
- Complete audit logs

✅ **Analytics**

- Real-time dashboard stats
- Access logs with details
- User tracking by IP
- Usage patterns

## Quick Start

### 1. Prerequisites

- Node.js v14+
- Firebase account
- Twilio account (for SMS)
- Email service (Gmail, ProtonMail, Outlook)

### 2. Install

```bash
cd backend
npm install
```

### 3. Configure

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 4. Run

```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

Server runs on `http://localhost:5000`
Admin Dashboard: `http://localhost:5000/admin`

## API Endpoints

### User Authentication

#### `POST /api/auth/request-verification`

Request a verification code

```json
{
  "contactInfo": "user@email.com",
  "type": "email"
}
```

#### `POST /api/auth/verify-code`

Verify the code and request access

```json
{
  "requestId": "abc123",
  "code": "123456"
}
```

#### `POST /api/auth/validate-session`

Check if current session is valid

```json
{
  "sessionId": "session123"
}
```

#### `POST /api/auth/submit-personal-info`

Submit additional info for session extension

```json
{
  "sessionId": "session123",
  "personalInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "age": 25
  }
}
```

#### `POST /api/auth/log-access`

Log when user accesses a project

```json
{
  "sessionId": "session123",
  "projectName": "Project Name"
}
```

### Admin Operations

#### `GET /api/admin/pending-approvals`

Get all pending approval requests
**Headers:** `x-admin-key: your_secret_key`

#### `POST /api/admin/approve`

Approve an access request

```json
{
  "requestId": "abc123"
}
```

#### `POST /api/admin/reject`

Reject an access request

```json
{
  "requestId": "abc123",
  "reason": "Optional rejection reason"
}
```

#### `GET /api/admin/access-logs`

Get all access logs with filters
**Query params:** `?startDate=2024-01-01&endDate=2024-01-31`

#### `GET /api/admin/stats`

Get dashboard statistics

### Access Control

#### `POST /api/access/check`

Check if user has valid session

```json
{
  "sessionId": "session123"
}
```

## Database Schema

### Firestore Collections

#### `verification_requests`

Stores verification code requests with encryption

- `contactInfo` - Encrypted email/phone
- `verificationCode` - Encrypted 6-digit code
- `approvalStatus` - pending/approved/rejected
- `ip` - Client IP address
- `location` - City, country, coordinates
- `createdAt` - Request timestamp
- `expiresAt` - Code expiry (15 minutes)

#### `access_sessions`

Active access sessions for users

- `contactInfo` - Encrypted contact info
- `approvedAt` - When admin approved
- `expiresAt` - Session expiry (20 minutes)
- `active` - Session status
- `personalInfo` - Encrypted user details
- `usageLog` - Array of access events

## Security Features

### Encryption

- AES-256-CBC encryption for sensitive data
- Automatic key generation from .env
- Cannot be decrypted without the encryption key

### Rate Limiting

- Max 5 failed verification attempts
- 15-minute code expiry
- 20-minute session expiry

### Authentication

- Admin panel protected with secret key
- CORS configured for your domains
- API key validation on sensitive endpoints

### Logging

- Complete audit trail of all access
- IP address tracking
- Location approximation
- Personal info collection on re-auth

## Environment Variables

```env
# Firebase
FIREBASE_API_KEY=xxx
FIREBASE_AUTH_DOMAIN=xxx
FIREBASE_PROJECT_ID=xxx
FIREBASE_STORAGE_BUCKET=xxx
FIREBASE_MESSAGING_SENDER_ID=xxx
FIREBASE_APP_ID=xxx

# Admin Info
ADMIN_EMAIL=frankalfaro105@proton.me
ADMIN_PHONE=346-282-1804
ADMIN_SECRET_KEY=generate_strong_random_key

# Email Service (choose one: gmail, protonmail, outlook, custom)
EMAIL_SERVICE=gmail
GMAIL_APP_PASSWORD=your_app_password
# OR for Proton:
PROTON_PASSWORD=your_password
# OR for custom SMTP:
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password

# SMS (Twilio)
TWILIO_ACCOUNT_SID=xxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+1234567890

# Security
ENCRYPTION_KEY=generate_32_character_key

# Server
PORT=5000
NODE_ENV=development

# Sessions
SESSION_DURATION_MINUTES=20
CODE_EXPIRY_MINUTES=15
```

## File Structure

```
backend/
├── server.js              # Main server file
├── package.json
├── .env                   # Configuration (DO NOT COMMIT)
├── .env.example           # Example config
├── config/
│   └── firebase.js        # Firebase setup
├── routes/
│   ├── auth.js            # Authentication endpoints
│   ├── admin.js           # Admin operations
│   └── access.js          # Access validation
├── utils/
│   ├── database.js        # Firestore operations
│   ├── encryption.js      # Data encryption
│   ├── emailService.js    # Email sending
│   └── helpers.js         # Utility functions
├── functions/             # Firebase Cloud Functions (optional)
└── admin-dashboard/
    └── index.html         # Admin panel UI
```

## Deployment

### Firebase Cloud Functions

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize
firebase init

# Deploy
firebase deploy
```

### Heroku

```bash
# Create app
heroku create your-app-name

# Set environment variables
heroku config:set FIREBASE_API_KEY=xxx

# Deploy
git push heroku main
```

### DigitalOcean / AWS / GCP

Follow standard Node.js deployment guides for your chosen platform.

## Testing

### Test Verification Request

```bash
curl -X POST http://localhost:5000/api/auth/request-verification \
  -H "Content-Type: application/json" \
  -d '{"contactInfo":"test@example.com","type":"email"}'
```

### Test Code Verification

```bash
curl -X POST http://localhost:5000/api/auth/verify-code \
  -H "Content-Type: application/json" \
  -d '{"requestId":"xxx","code":"123456"}'
```

### Test Admin Approval

```bash
curl -X POST http://localhost:5000/api/admin/approve \
  -H "Content-Type: application/json" \
  -H "x-admin-key: your_secret_key" \
  -d '{"requestId":"xxx"}'
```

## Troubleshooting

### Email not sending

- Check email service credentials
- Verify app password (for Gmail)
- Check SMTP settings
- Test manually: `npm run test-email`

### Firebase errors

- Verify API keys
- Check Firestore is enabled
- Ensure security rules are set
- Check database location matches config

### SMS not sending

- Verify Twilio credentials
- Check phone number format (+1 prefix)
- Ensure account has credits

### Session issues

- Clear browser localStorage
- Check encryption key matches
- Verify clock sync on server

## Security Best Practices

1. **Rotate encryption keys** regularly
2. **Monitor access logs** for suspicious patterns
3. **Update dependencies** regularly (`npm audit fix`)
4. **Use HTTPS** in production
5. **Enable CORS** only for your domains
6. **Backup Firestore** regularly
7. **Monitor API rate limits**
8. **Test re-authentication** flow

## Support & Documentation

- See `SETUP_GUIDE.md` for detailed setup
- See `package.json` for dependencies
- Firebase docs: https://firebase.google.com/docs
- Twilio docs: https://www.twilio.com/docs

## License

This system is created for personal portfolio use. Modify as needed for your requirements.

---

**Created by:** AI Assistant  
**Last Updated:** January 2025
