const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const crypto = require("crypto");
require("dotenv").config();

// Initialize Firestore
const db = admin.firestore();

// ============ ENCRYPTION SETUP ============
const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString("hex");
const ENCRYPTION_ALGORITHM = "aes-256-cbc";

// Admin credentials (ONLY these can access admin menu)
const ADMIN_EMAILS = ["frankalfaro105@gmail.com", "frankalfaro105@proton.me"];
const ADMIN_PHONES = ["+13462821804"];

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const key = Buffer.from(ENCRYPTION_KEY, "hex");
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(encryptedData) {
  const key = Buffer.from(ENCRYPTION_KEY, "hex");
  const parts = encryptedData.split(":");
  const iv = Buffer.from(parts[0], "hex");
  const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv);

  let decrypted = decipher.update(parts[1], "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

function isAdmin(contact) {
  return ADMIN_EMAILS.includes(contact) || ADMIN_PHONES.includes(contact);
}

// ============ EMAIL TRANSPORTER ============
const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ============ TWILIO SETUP ============
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

// ============ PROTECTED SITES (ENCRYPTED) ============
const GATED_SITES_ENCRYPTED = encrypt(
  JSON.stringify(["plasmic", "cubix", "fallen-futuristics", "atlas", "la-vie"]),
);

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
    .where("contact_encrypted", "==", encrypt(contact))
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
    const encryptedEmail = encrypt(email);
    const encryptedIp = encrypt(ip);

    // Store encrypted data
    await db.collection("access_codes").add({
      code,
      contact_encrypted: encryptedEmail,
      contact_type: "email",
      site,
      ip_encrypted: encryptedIp,
      created_at: admin.firestore.Timestamp.now(),
      used: false,
      accessed_at: null,
      is_admin_access: isAdmin(email),
    });

    // Send email
    await emailTransporter.sendMail({
      to: email,
      subject: `Your access code`,
      html: `
        <h2>Your Access Code</h2>
        <p>Your code is:</p>
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
    const encryptedPhone = encrypt(phone);
    const encryptedIp = encrypt(ip);

    // Store encrypted data
    await db.collection("access_codes").add({
      code,
      contact_encrypted: encryptedPhone,
      contact_type: "sms",
      site,
      ip_encrypted: encryptedIp,
      created_at: admin.firestore.Timestamp.now(),
      used: false,
      accessed_at: null,
      is_admin_access: isAdmin(phone),
    });

    // Send SMS
    await twilioClient.messages.create({
      body: `Your access code: ${code}. Valid for 20 minutes.`,
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
      .where("contact_encrypted", "==", encrypt(contact))
      .get();

    if (snapshot.docs.length > 0) {
      await snapshot.docs[0].ref.update({
        used: true,
        accessed_at: admin.firestore.Timestamp.now(),
        access_ip_encrypted: encrypt(ip),
      });
    }

    // Create session token
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 20 * 60 * 1000);

    const isAdminUser = isAdmin(contact);

    await db.collection("sessions").add({
      token: sessionToken,
      site,
      contact_encrypted: encrypt(contact),
      contact_type: contact.includes("@") ? "email" : "sms",
      ip_encrypted: encrypt(ip),
      created_at: admin.firestore.Timestamp.now(),
      expires_at: admin.firestore.Timestamp.fromDate(expiresAt),
      active: true,
      is_admin: isAdminUser,
    });

    res.json({
      success: true,
      token: sessionToken,
      expires_in: 20 * 60,
      is_admin: isAdminUser,
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

    res.json({
      valid: true,
      remaining_time: expiresAt.getTime() - Date.now(),
      is_admin: data.is_admin || false,
    });
  } catch (error) {
    console.error("Error checking session:", error);
    res.status(500).json({ valid: false, error: "Session check failed" });
  }
});

// Get access logs (ADMIN ONLY - encrypted)
router.post("/admin/access-logs", async (req, res) => {
  try {
    const { token, admin_contact } = req.body;

    // Verify admin credentials
    if (!isAdmin(admin_contact)) {
      return res.status(403).json({ error: "Unauthorized - not an admin" });
    }

    // Verify token is valid and belongs to admin
    const sessionSnapshot = await db
      .collection("sessions")
      .where("token", "==", token)
      .where("contact_encrypted", "==", encrypt(admin_contact))
      .where("is_admin", "==", true)
      .where("active", "==", true)
      .get();

    if (sessionSnapshot.empty) {
      return res.status(403).json({ error: "Invalid admin session" });
    }

    // Check session expiry
    const sessionData = sessionSnapshot.docs[0].data();
    const expiresAt = sessionData.expires_at.toDate();
    if (new Date() > expiresAt) {
      return res.status(403).json({ error: "Session expired" });
    }

    // Fetch encrypted logs
    const snapshot = await db
      .collection("access_codes")
      .orderBy("created_at", "desc")
      .limit(500)
      .get();

    // Decrypt for admin only
    const logs = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        code: data.code,
        contact: decrypt(data.contact_encrypted),
        contact_type: data.contact_type,
        site: data.site,
        ip_address: decrypt(data.ip_encrypted),
        created_at: data.created_at.toDate(),
        used: data.used,
        accessed_at: data.accessed_at ? data.accessed_at.toDate() : null,
        is_admin_access: data.is_admin_access,
      };
    });

    res.json({
      success: true,
      total_records: logs.length,
      logs: logs,
    });
  } catch (error) {
    console.error("Error fetching admin logs:", error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

// Get protected sites list (ADMIN ONLY)
router.post("/admin/get-sites", async (req, res) => {
  try {
    const { token, admin_contact } = req.body;

    if (!isAdmin(admin_contact)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const sessionSnapshot = await db
      .collection("sessions")
      .where("token", "==", token)
      .where("contact_encrypted", "==", encrypt(admin_contact))
      .where("is_admin", "==", true)
      .get();

    if (sessionSnapshot.empty) {
      return res.status(403).json({ error: "Invalid session" });
    }

    const sites = JSON.parse(decrypt(GATED_SITES_ENCRYPTED));
    res.json({ sites });
  } catch (error) {
    res.status(500).json({ error: "Failed to get sites" });
  }
});

// Get admin stats
router.post("/admin/stats", async (req, res) => {
  try {
    const { token, admin_contact } = req.body;

    if (!isAdmin(admin_contact)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const sessionSnapshot = await db
      .collection("sessions")
      .where("token", "==", token)
      .where("contact_encrypted", "==", encrypt(admin_contact))
      .where("is_admin", "==", true)
      .get();

    if (sessionSnapshot.empty) {
      return res.status(403).json({ error: "Invalid session" });
    }

    const snapshot = await db.collection("access_codes").get();
    const verified = snapshot.docs.filter((doc) => doc.data().used).length;
    const unique = new Set(
      snapshot.docs.map((doc) => doc.data().contact_encrypted),
    ).size;

    res.json({
      total_requests: snapshot.size,
      verified_access: verified,
      unique_visitors: unique,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

module.exports = router;
