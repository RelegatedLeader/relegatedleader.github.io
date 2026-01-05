const express = require("express");
const router = express.Router();
const { validateSession } = require("../utils/database");

/**
 * POST /api/access/check
 * Check if user has valid session before viewing project
 */
router.post("/check", async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(401).json({
        success: false,
        authenticated: false,
        message: "No session found",
      });
    }

    const result = await validateSession(sessionId);

    res.json({
      success: result.valid,
      authenticated: result.valid,
      message: result.message,
    });
  } catch (error) {
    console.error("Error checking access:", error);
    res.status(500).json({
      success: false,
      authenticated: false,
      message: "Error checking access",
      error: error.message,
    });
  }
});

module.exports = router;
