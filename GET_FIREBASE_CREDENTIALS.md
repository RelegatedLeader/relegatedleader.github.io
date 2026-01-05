# 🔥 Get Your Firebase Service Account Credentials

Your Firebase project has been created! Now we need to get the service account credentials.

## Project Details

- **Project ID**: `personal-site-auth`
- **Project Name**: Personal Site Auth
- **Console URL**: https://console.firebase.google.com/project/personal-site-auth/overview

## Get Your Service Account Key (3 steps):

### Step 1: Go to Project Settings

1. Open: https://console.firebase.google.com/project/personal-site-auth/settings/serviceaccounts/adminsdk
2. Or manually:
   - Go to https://console.firebase.google.com
   - Select "Personal Site Auth" project
   - Click ⚙️ (Settings) icon
   - Go to "Service Accounts" tab

### Step 2: Generate Private Key

1. Click the blue "Generate New Private Key" button
2. A JSON file will download automatically
3. Save it somewhere safe (we'll use it next)

### Step 3: Copy the JSON Content

1. Open the downloaded JSON file in a text editor
2. Copy the ENTIRE contents
3. We'll paste it into the .env file next

## Your Service Account JSON will look like this:

```json
{
  "type": "service_account",
  "project_id": "personal-site-auth",
  "private_key_id": "abc123def456...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhki...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-4mg8h@personal-site-auth.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-4mg8h%40personal-site-auth.iam.gserviceaccount.com"
}
```

## Next Steps:

1. Go get your service account JSON from Firebase Console
2. Come back and we'll fill in your .env file
3. Start the server!
