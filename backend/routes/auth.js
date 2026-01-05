const express = require("express");
const router = express.Router();

// Optional Twilio - graceful fallback if not configured
let twilioClient = null;
try {
  const twilio = require("twilio");
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }
} catch (err) {
  console.warn("Twilio not available - SMS features disabled");
}

const {
  storeVerificationRequest,
  verifyCode,
  validateSession,
  updatePersonalInfo,
  logAccessEvent,
  createAccessSession,
} = require("../utils/database");
const {
  getClientIP,
  getLocationFromIP,
  generateVerificationCode,
} = require("../utils/helpers");

// Optional email service - graceful fallback
let emailService = null;
try {
  emailService = require("../utils/emailService");
} catch (err) {
  console.warn("Email service not available");
}

/**
 * POST /api/auth/request-verification
 * Step 1: User submits email or phone
 */
router.post("/request-verification", async (req, res) => {
  try {
    const { contactInfo, type } = req.body; // type: 'email' or 'phone'

    if (!contactInfo || !type) {
      return res.status(400).json({
        success: false,
        message: "Contact info and type are required",
      });
    }

    const ip = getClientIP(req);
    const location = getLocationFromIP(ip);
    const verificationCode = generateVerificationCode();

    // Store in database
    const requestId = await storeVerificationRequest(
      contactInfo,
      type,
      verificationCode,
      ip,
      location
    );

    // Send verification code
    if (type === "email") {
      if (!emailService) {
        throw new Error("Email service not configured!");
      }
      await emailService.sendVerificationEmail(contactInfo, verificationCode);
    } else if (type === "phone") {
      if (!twilioClient) {
        throw new Error("SMS service not configured (Twilio)!");
      }
      await twilioClient.messages.create({
        body: `Your portfolio access code: ${verificationCode}. Valid for 15 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: contactInfo,
      });
    }

    res.json({
      success: true,
      requestId,
      message: `Verification code sent to ${type}`,
      ip: ip,
      location: location,
    });
  } catch (error) {
    console.error("Error requesting verification:", error);
    res.status(500).json({
      success: false,
      message: "Error sending verification code",
      error: error.message,
    });
  }
});

/**
 * POST /api/auth/verify-code
 * Step 2: User submits verification code
 */
router.post("/verify-code", async (req, res) => {
  try {
    const { requestId, code } = req.body;

    if (!requestId || !code) {
      return res.status(400).json({
        success: false,
        message: "Request ID and code are required",
      });
    }

    const ip = getClientIP(req);
    const location = getLocationFromIP(ip);

    const result = await verifyCode(requestId, code, ip);

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Send notification to admin
    if (!emailService) {
      throw new Error("Email service not configured!");
    }
    await emailService.sendAdminNotification({
      contactInfo: result.contactInfo,
      type: result.type,
      ip: result.ip,
      location: result.location,
      verifiedAt: new Date(),
    });

    // Also send SMS to admin
    if (!twilioClient || !process.env.ADMIN_PHONE) {
      throw new Error("SMS service not configured for admin notifications!");
    }
    await twilioClient.messages.create({
      body: `New portfolio access request from ${result.contactInfo}. Check your email or admin dashboard.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.ADMIN_PHONE,
    });

    res.json({
      success: true,
      requestId,
      message: "Code verified. Waiting for admin approval...",
    });
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying code",
      error: error.message,
    });
  }
});

/**
 * POST /api/auth/validate-session
 * Check if session is still valid
 */
router.post("/validate-session", async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required",
      });
    }

    const result = await validateSession(sessionId);

    if (!result.valid) {
      return res.status(401).json(result);
    }

    res.json({ valid: true, sessionId });
  } catch (error) {
    console.error("Error validating session:", error);
    res.status(500).json({
      success: false,
      message: "Error validating session",
      error: error.message,
    });
  }
});

/**
 * POST /api/auth/submit-personal-info
 * User submits personal info on re-authentication after 20 mins
 */
router.post("/submit-personal-info", async (req, res) => {
  try {
    const { sessionId, personalInfo } = req.body;

    if (!sessionId || !personalInfo) {
      return res.status(400).json({
        success: false,
        message: "Session ID and personal info are required",
      });
    }

    const ip = getClientIP(req);
    const location = getLocationFromIP(ip);

    const result = await updatePersonalInfo(
      sessionId,
      personalInfo,
      ip,
      location
    );

    res.json(result);
  } catch (error) {
    console.error("Error submitting personal info:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting personal info",
      error: error.message,
    });
  }
});

/**
 * POST /api/auth/log-access
 * Log when user accesses a project
 */
router.post("/log-access", async (req, res) => {
  try {
    const { sessionId, projectName } = req.body;

    if (!sessionId || !projectName) {
      return res.status(400).json({
        success: false,
        message: "Session ID and project name are required",
      });
    }

    const ip = getClientIP(req);
    const location = getLocationFromIP(ip);

    await logAccessEvent(sessionId, projectName, ip, location);

    res.json({ success: true });
  } catch (error) {
    console.error("Error logging access:", error);
    res.status(500).json({
      success: false,
      message: "Error logging access",
      error: error.message,
    });
  }
});

module.exports = router;
