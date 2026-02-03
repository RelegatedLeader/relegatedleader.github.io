const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
require("dotenv").config();

// Initialize Firestore
const db = admin.firestore();

// Email transporter setup
const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Twilio setup
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

// List of gated sites
const GATED_SITES = [
  "plasmic",
  "cubix",
  "fallen-futuristics",
  "atlas",
  "la-vie",
];

// Helper function to get client IP
function getClientIP(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    req.socket.remoteAddress ||
    req.connection.remoteAddress ||
    "unknown"
  );
}

// Helper function to generate random code
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper function to check if code is valid and not expired
async function isCodeValid(code, contact, timeLimit = 20) {
  const snapshot = await db
    .collection("access_codes")
    .where("code", "==", code)
    .where("contact", "==", contact)
    .where("used", "==", false)
    .get();

  if (snapshot.empty) return false;

  const doc = snapshot.docs[0];
  const data = doc.data();
  const createdAt = data.created_at.toDate();
  const now = new Date();
  const minutesDiff = (now - createdAt) / (1000 * 60);

  return minutesDiff <= timeLimit;
}

// Generate and send code via email
router.post("/send-code-email", async (req, res) => {
  try {
    const { email, site } = req.body;
    const ip = getClientIP(req);

    if (!email || !site || !GATED_SITES.includes(site)) {
      return res.status(400).json({ error: "Invalid email or site" });
    }

    const code = generateCode();

    // Store in Firestore
    await db.collection("access_codes").add({
      code,
      contact: email,
      contact_type: "email",
      site,
      ip_address: ip,
      created_at: admin.firestore.Timestamp.now(),
      used: false,
      accessed_at: null,
    });

    // Send email
    await emailTransporter.sendMail({
      to: email,
      subject: `Your access code for ${site}`,
      html: `
        <h2>Your Access Code</h2>
        <p>Your code to access <strong>${site}</strong> is:</p>
        <h1 style="color: #007bff; letter-spacing: 5px;">${code}</h1>
        <p>This code will expire in 20 minutes.</p>
        <p><small>If you didn't request this, please ignore this email.</small></p>
      `,
    });

    res.json({
      success: true,
      message: "Code sent to email",
      masked_email: email.replace(/(.{2})(.*)(@.*)/, "$1***$3"),
    });
  } catch (error) {
    console.error("Error sending email code:", error);
    res.status(500).json({ error: "Failed to send code" });
  }
});

// Generate and send code via SMS
router.post("/send-code-sms", async (req, res) => {
  try {
    const { phone, site } = req.body;
    const ip = getClientIP(req);

    if (!phone || !site || !GATED_SITES.includes(site)) {
      return res.status(400).json({ error: "Invalid phone or site" });
    }

    const code = generateCode();

    // Store in Firestore
    await db.collection("access_codes").add({
      code,
      contact: phone,
      contact_type: "sms",
      site,
      ip_address: ip,
      created_at: admin.firestore.Timestamp.now(),
      used: false,
      accessed_at: null,
    });

    // Send SMS
    await twilioClient.messages.create({
      body: `Your access code for ${site} is: ${code}. Valid for 20 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    res.json({
      success: true,
      message: "Code sent via SMS",
      masked_phone: phone.slice(0, -4).padEnd(phone.length, "*"),
    });
  } catch (error) {
    console.error("Error sending SMS code:", error);
    res.status(500).json({ error: "Failed to send code" });
  }
});

// Verify code and create session
router.post("/verify-code", async (req, res) => {
  try {
    const { code, contact, site } = req.body;
    const ip = getClientIP(req);

    if (!code || !contact || !site || !GATED_SITES.includes(site)) {
      return res.status(400).json({ error: "Invalid code, contact, or site" });
    }

    // Check if code is valid
    const isValid = await isCodeValid(code, contact);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid or expired code" });
    }

    // Mark code as used
    const snapshot = await db
      .collection("access_codes")
      .where("code", "==", code)
      .where("contact", "==", contact)
      .get();

    if (snapshot.docs.length > 0) {
      await snapshot.docs[0].ref.update({
        used: true,
        accessed_at: admin.firestore.Timestamp.now(),
        access_ip: ip,
      });
    }

    // Create session token (valid for 20 minutes)
    const sessionToken = require("crypto").randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 20 * 60 * 1000);

    await db.collection("sessions").add({
      token: sessionToken,
      site,
      contact,
      contact_type: contact.includes("@") ? "email" : "sms",
      ip_address: ip,
      created_at: admin.firestore.Timestamp.now(),
      expires_at: admin.firestore.Timestamp.fromDate(expiresAt),
      active: true,
    });

    res.json({
      success: true,
      token: sessionToken,
      expires_in: 20 * 60, // seconds
    });
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({ error: "Verification failed" });
  }
});

// Check if session token is valid
router.get("/check-session/:token/:site", async (req, res) => {
  try {
    const { token, site } = req.params;

    const snapshot = await db
      .collection("sessions")
      .where("token", "==", token)
      .where("site", "==", site)
      .where("active", "==", true)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ valid: false, error: "Invalid session" });
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    const expiresAt = data.expires_at.toDate();

    if (new Date() > expiresAt) {
      // Mark as expired
      await doc.ref.update({ active: false });
      return res.status(401).json({ valid: false, error: "Session expired" });
    }

    res.json({ valid: true, remaining_time: expiresAt.getTime() - Date.now() });
  } catch (error) {
    console.error("Error checking session:", error);
    res.status(500).json({ valid: false, error: "Session check failed" });
  }
});

// Get access logs (admin only)
router.get("/access-logs", async (req, res) => {
  try {
    // In production, add auth check here
    const snapshot = await db
      .collection("access_codes")
      .orderBy("created_at", "desc")
      .limit(100)
      .get();

    const logs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at.toDate(),
    }));

    res.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

module.exports = router;
