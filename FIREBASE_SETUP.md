# Firebase Project Setup for Portfolio Authentication

This script will guide you through setting up Firebase with the CLI.

## Steps:

1. **Login to Firebase**
   ```
   firebase login
   ```
   This will open your browser to authenticate with Google.

2. **Create New Firebase Project**
   ```
   firebase projects:create portfolio-auth-system
   ```

3. **Add Firestore Database**
   After creating the project, enable Firestore in the Firebase Console:
   - Go to https://console.firebase.google.com
   - Select your project
   - Go to Firestore Database
   - Click "Create database"
   - Choose location (closest to your users)
   - Start in "Production mode"

4. **Get Service Account Credentials**
   - Go to Project Settings
   - Service Accounts tab
   - Click "Generate New Private Key"
   - Save the JSON file securely

5. **Update .env File**
   Copy the JSON contents into your .env:
   ```
   FIREBASE_PROJECT_ID=<project_id>
   FIREBASE_PRIVATE_KEY_ID=<private_key_id>
   FIREBASE_PRIVATE_KEY="<private_key>"
   FIREBASE_CLIENT_EMAIL=<client_email>
   FIREBASE_CLIENT_ID=<client_id>
   FIREBASE_AUTH_DOMAIN=<project_id>.firebaseapp.com
   FIREBASE_DATABASE_URL=https://<project_id>.firebaseio.com
   FIREBASE_STORAGE_BUCKET=<project_id>.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=<sender_id>
   FIREBASE_APP_ID=<app_id>
   FIREBASE_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/<client_email>
   ```

6. **Initialize Firebase in Backend**
   ```
   cd backend
   firebase init
   ```
