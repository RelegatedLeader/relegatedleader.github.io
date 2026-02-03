#!/usr/bin/env node

/**
 * Firebase Credentials Helper
 * This script helps you get Firebase credentials using the Firebase CLI
 */

const https = require("https");
const fs = require("fs");

const projectId = "relegatedleader-54c49";

console.log(`
====================================
🔥 Firebase Credentials Helper
====================================

To get your Firebase credentials:

1. Go to Firebase Console:
   https://console.firebase.google.com/project/${projectId}/settings/general

2. Click on "Service Accounts" tab

3. Click "Generate New Private Key"

4. A JSON file will download - open it and copy these values:

   FIREBASE_PROJECT_ID=<project_id>
   FIREBASE_PRIVATE_KEY_ID=<private_key_id>
   FIREBASE_PRIVATE_KEY="<private_key>"  (keep the ----BEGIN/END PRIVATE KEY---- lines)
   FIREBASE_CLIENT_EMAIL=<client_email>
   FIREBASE_CLIENT_ID=<client_id>
   FIREBASE_DATABASE_URL=https://<project-id>.firebaseio.com

5. Also get your web app config from General settings:
   FIREBASE_API_KEY=<apiKey>
   FIREBASE_AUTH_DOMAIN=<authDomain>
   FIREBASE_STORAGE_BUCKET=<storageBucket>
   FIREBASE_MESSAGING_SENDER_ID=<messagingSenderId>
   FIREBASE_APP_ID=<appId>

6. For Twilio:
   - Go to https://www.twilio.com/console
   - Copy Account SID, Auth Token, and your phone number
   - TWILIO_ACCOUNT_SID=ACxxxxx
   - TWILIO_AUTH_TOKEN=xxxxx
   - TWILIO_PHONE_NUMBER=+1234567890

7. Add to backend/.env and save

For help, see: docs/FIREBASE_SETUP_GUIDE.md
`);
