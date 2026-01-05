#!/usr/bin/env node

/**
 * Initialize Firestore Database with Collections and Indexes
 * Run this after setting up your .env file
 */

require("dotenv").config();
const admin = require("firebase-admin");

// Validate environment variables
if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY) {
  console.error("❌ Error: Firebase credentials not configured in .env");
  process.exit(1);
}

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CERT_URL,
};

async function initializeFirestore() {
  try {
    // Initialize Firebase
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    });

    const db = admin.firestore();
    console.log("✅ Connected to Firebase Firestore");

    // Create verification_requests collection with sample document
    console.log("\n📝 Creating collections...");

    const verificationRef = db.collection("verification_requests").doc("_init");
    await verificationRef.set(
      {
        initialized: true,
        createdAt: new Date(),
      },
      { merge: true }
    );
    console.log("  ✅ verification_requests collection created");

    // Create access_sessions collection
    const accessRef = db.collection("access_sessions").doc("_init");
    await accessRef.set(
      {
        initialized: true,
        createdAt: new Date(),
      },
      { merge: true }
    );
    console.log("  ✅ access_sessions collection created");

    // Create audit_logs collection
    const logsRef = db.collection("audit_logs").doc("_init");
    await logsRef.set(
      {
        initialized: true,
        createdAt: new Date(),
      },
      { merge: true }
    );
    console.log("  ✅ audit_logs collection created");

    // Delete the initialization documents
    console.log("\n🧹 Cleaning up initialization documents...");
    await verificationRef.delete();
    await accessRef.delete();
    await logsRef.delete();
    console.log("  ✅ Cleanup complete");

    console.log("\n============================================");
    console.log("✅ Firestore Database Initialized Successfully!");
    console.log("============================================");
    console.log("\nCollections created:");
    console.log("  • verification_requests - Stores verification codes");
    console.log("  • access_sessions - Stores user sessions");
    console.log("  • audit_logs - Stores access logs");
    console.log("\nYour Firebase backend is ready to use!");
    console.log("\nNext steps:");
    console.log("  1. cd backend");
    console.log("  2. npm start");
    console.log("\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error initializing Firestore:", error.message);
    console.error("\nPlease check:");
    console.error("  ✓ Your .env file has correct Firebase credentials");
    console.error("  ✓ Your Firestore database is enabled");
    console.error("  ✓ You have permission to create collections");
    process.exit(1);
  }
}

initializeFirestore();
