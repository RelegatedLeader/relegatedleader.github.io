const admin = require("firebase-admin");
const { encrypt, decrypt } = require("./encryption");

// Initialize Firebase Admin SDK (REQUIRED - no mock fallback)
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

// Validate required environment variables
if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_PRIVATE_KEY) {
  console.error("❌ FATAL ERROR: Firebase configuration missing!");
  console.error("Required .env variables:");
  console.error("  - FIREBASE_PROJECT_ID");
  console.error("  - FIREBASE_PRIVATE_KEY");
  console.error("  - FIREBASE_CLIENT_EMAIL");
  console.error("  - FIREBASE_CLIENT_ID");
  process.exit(1);
}

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
  const db = admin.firestore();
  console.log("✅ Firebase Firestore initialized successfully");
} catch (err) {
  console.error("❌ FATAL ERROR: Firebase initialization failed!");
  console.error("Error:", err.message);
  process.exit(1);
}

const db = admin.firestore();

/**
 * Store verification request
 */
async function storeVerificationRequest(
  contactInfo,
  type,
  verificationCode,
  ip,
  location
) {
  const requestId = `req_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  const request = {
    id: requestId,
    contactInfo: encrypt(contactInfo),
    type, // 'email' or 'phone'
    verificationCode: encrypt(verificationCode),
    ip,
    location,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    verified: false,
    attempts: 0,
    maxAttempts: 5,
  };

  // Store in Firestore
  const docRef = db.collection("verification_requests").doc(requestId);
  await docRef.set(request);
  console.log(`📧 Verification request stored: ${requestId}`);

  return requestId;
}

/**
 * Verify code and get verification request
 */
async function verifyCode(requestId, providedCode, ip) {
  const doc = await db.collection("verification_requests").doc(requestId).get();

  if (!doc.exists) {
    return { success: false, message: "Verification request not found" };
  }

  const data = doc.data();
  const { decrypt } = require("./encryption");

  // Check if code is expired
  if (new Date() > data.expiresAt) {
    return { success: false, message: "Code has expired" };
  }

  // Check attempt limit
  if (data.attemptCount >= 5) {
    return {
      success: false,
      message: "Too many attempts. Please request a new code.",
    };
  }

  // Verify code
  const decryptedCode = decrypt(data.verificationCode);
  if (providedCode !== decryptedCode) {
    await doc.ref.update({ attemptCount: data.attemptCount + 1 });
    return { success: false, message: "Invalid code" };
  }

  // Mark as verified
  await doc.ref.update({ verified: true, verifiedAt: new Date() });

  return {
    success: true,
    requestId,
    contactInfo: decrypt(data.contactInfo),
    type: data.type,
    ip,
    location: data.location,
    message: "Code verified. Waiting for admin approval...",
  };
}

/**
 * Create access session after admin approval
 */
async function createAccessSession(requestId, approvedBy) {
  const verificationDoc = await db
    .collection("verification_requests")
    .doc(requestId)
    .get();

  if (!verificationDoc.exists) {
    return { success: false, message: "Verification request not found" };
  }

  const { decrypt } = require("./encryption");
  const verData = verificationDoc.data();
  const sessionRef = db.collection("access_sessions").doc();

  await sessionRef.set({
    id: sessionRef.id,
    verificationRequestId: requestId,
    contactInfo: verData.contactInfo, // Already encrypted
    approvedBy,
    approvedAt: new Date(),
    expiresAt: new Date(Date.now() + 20 * 60 * 1000), // 20 minutes
    active: true,
    personalInfo: null,
    usageLog: [],
  });

  return { success: true, sessionId: sessionRef.id };
}

/**
 * Check if session is valid
 */
async function validateSession(sessionId) {
  const doc = await db.collection("access_sessions").doc(sessionId).get();

  if (!doc.exists) {
    return { valid: false, message: "Session not found" };
  }

  const data = doc.data();

  if (new Date() > data.expiresAt) {
    await doc.ref.update({ active: false });
    return { valid: false, message: "Session expired" };
  }

  if (!data.active) {
    return { valid: false, message: "Session is inactive" };
  }

  return { valid: true, sessionId };
}

/**
 * Store personal info on re-authentication
 */
async function updatePersonalInfo(sessionId, personalInfo, ip, location) {
  const doc = await db.collection("access_sessions").doc(sessionId);

  await doc.update({
    personalInfo: {
      firstName: encrypt(personalInfo.firstName),
      lastName: encrypt(personalInfo.lastName),
      email: encrypt(personalInfo.email),
      phone: encrypt(personalInfo.phone),
      age: personalInfo.age,
      updatedAt: new Date(),
    },
    usageLog: admin.firestore.FieldValue.arrayUnion({
      timestamp: new Date(),
      action: "personal_info_updated",
      ip,
      location,
    }),
  });

  return { success: true };
}

/**
 * Log access event
 */
async function logAccessEvent(sessionId, projectName, ip, location) {
  const doc = await db.collection("access_sessions").doc(sessionId);

  await doc.update({
    usageLog: admin.firestore.FieldValue.arrayUnion({
      timestamp: new Date(),
      action: "project_accessed",
      projectName,
      ip,
      location,
    }),
  });
}

/**
 * Get pending approvals for admin
 */
async function getPendingApprovals() {
  const snapshot = await db
    .collection("verification_requests")
    .where("approvalStatus", "==", "pending")
    .where("verified", "==", true)
    .orderBy("createdAt", "desc")
    .get();

  const { decrypt } = require("./encryption");

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: data.id,
      contactInfo: decrypt(data.contactInfo),
      type: data.type,
      ip: data.ip,
      location: data.location,
      verifiedAt: data.verifiedAt,
      createdAt: data.createdAt,
    };
  });
}

/**
 * Approve access request
 */
async function approveAccess(requestId, approvedBy) {
  await db.collection("verification_requests").doc(requestId).update({
    approvalStatus: "approved",
    approvedAt: new Date(),
    approvedBy,
  });

  return createAccessSession(requestId, approvedBy);
}

/**
 * Reject access request
 */
async function rejectAccess(requestId, reason) {
  await db.collection("verification_requests").doc(requestId).update({
    approvalStatus: "rejected",
    rejectedAt: new Date(),
    rejectionReason: reason,
  });

  return { success: true, message: "Request rejected" };
}

/**
 * Get all access logs
 */
async function getAccessLogs(filters = {}) {
  let query = db.collection("access_sessions");

  if (filters.startDate) {
    query = query.where("approvedAt", ">=", filters.startDate);
  }

  if (filters.endDate) {
    query = query.where("approvedAt", "<=", filters.endDate);
  }

  const snapshot = await query.orderBy("approvedAt", "desc").get();

  const { decrypt } = require("./encryption");

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: data.id,
      contactInfo: decrypt(data.contactInfo),
      approvedAt: data.approvedAt,
      expiresAt: data.expiresAt,
      active: data.active,
      personalInfo: data.personalInfo
        ? {
            firstName: data.personalInfo.firstName
              ? decrypt(data.personalInfo.firstName)
              : null,
            lastName: data.personalInfo.lastName
              ? decrypt(data.personalInfo.lastName)
              : null,
            email: data.personalInfo.email
              ? decrypt(data.personalInfo.email)
              : null,
            phone: data.personalInfo.phone
              ? decrypt(data.personalInfo.phone)
              : null,
            age: data.personalInfo.age,
          }
        : null,
      usageLog: data.usageLog || [],
    };
  });
}

module.exports = {
  storeVerificationRequest,
  verifyCode,
  createAccessSession,
  validateSession,
  updatePersonalInfo,
  logAccessEvent,
  getPendingApprovals,
  approveAccess,
  rejectAccess,
  getAccessLogs,
};
