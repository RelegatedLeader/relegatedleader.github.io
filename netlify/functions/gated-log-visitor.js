// Netlify Function - Log Visitor Data to Firebase
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
let firebaseApp;
try {
  if (!admin.apps.length) {
    // Decode base64 private key if provided
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    if (process.env.FIREBASE_PRIVATE_KEY_BASE64) {
      privateKey = Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64, "base64").toString("utf-8");
    }

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: privateKey?.replace(/\\n/g, "\n"),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
  } else {
    firebaseApp = admin.app();
  }
} catch (error) {
  console.error("Firebase initialization error:", error.message);
}

exports.handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const {
      contact,
      contactMethod,
      site,
      ip,
      browser,
      os,
      token,
      expiresAt,
      accessTime,
    } = body;

    if (!contact || !site || !token) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          success: false,
          error: "Missing required fields",
        }),
      };
    }

    try {
      // Log to Firestore
      if (firebaseApp) {
        const db = admin.firestore();
        const visitorRef = db.collection("visitors").doc();

        await visitorRef.set({
          contact: contact,
          contactMethod: contactMethod,
          site: site,
          ip: ip,
          browser: browser,
          os: os,
          token: token,
          expiresAt: expiresAt,
          accessTime: accessTime,
          createdAt: new Date().toISOString(),
          status: "active",
        });

        console.log(`📊 Visitor logged to Firebase: ${contact} for ${site}`);
      } else {
        console.log(
          `📊 Firebase offline - logging to console: ${contact} for ${site}`,
        );
      }
    } catch (firebaseError) {
      console.error(
        "Firebase write error:",
        firebaseError.message,
        "- will continue anyway",
      );
      // Don't fail if Firebase is unavailable
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        message: "Visitor data logged",
      }),
    };
  } catch (error) {
    console.error("Logging error:", error.message);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: false,
        error: error.message || "Failed to log visitor",
      }),
    };
  }
};
