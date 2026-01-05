const express = require("express");
const router = express.Router();
const {
  getPendingApprovals,
  approveAccess,
  rejectAccess,
  getAccessLogs,
} = require("../utils/database");

// Middleware to verify admin (basic check - you should use JWT tokens in production)
const adminAuth = (req, res, next) => {
  const adminKey = req.headers["x-admin-key"];

  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  next();
};

/**
 * GET /api/admin/pending-approvals
 * Get all pending approval requests
 */
router.get("/pending-approvals", adminAuth, async (req, res) => {
  try {
    const approvals = await getPendingApprovals();
    res.json({ success: true, approvals });
  } catch (error) {
    console.error("Error fetching approvals:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching approvals",
      error: error.message,
    });
  }
});

/**
 * POST /api/admin/approve
 * Approve an access request
 */
router.post("/approve", adminAuth, async (req, res) => {
  try {
    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: "Request ID is required",
      });
    }

    const result = await approveAccess(requestId, process.env.ADMIN_EMAIL);

    res.json({
      success: true,
      message: "Access approved",
      sessionId: result.sessionId,
    });
  } catch (error) {
    console.error("Error approving access:", error);
    res.status(500).json({
      success: false,
      message: "Error approving access",
      error: error.message,
    });
  }
});

/**
 * POST /api/admin/reject
 * Reject an access request
 */
router.post("/reject", adminAuth, async (req, res) => {
  try {
    const { requestId, reason } = req.body;

    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: "Request ID is required",
      });
    }

    const result = await rejectAccess(
      requestId,
      reason || "No reason provided"
    );

    res.json(result);
  } catch (error) {
    console.error("Error rejecting access:", error);
    res.status(500).json({
      success: false,
      message: "Error rejecting access",
      error: error.message,
    });
  }
});

/**
 * GET /api/admin/access-logs
 * Get all access logs
 */
router.get("/access-logs", adminAuth, async (req, res) => {
  try {
    const filters = {};

    if (req.query.startDate) filters.startDate = new Date(req.query.startDate);
    if (req.query.endDate) filters.endDate = new Date(req.query.endDate);

    const logs = await getAccessLogs(filters);

    res.json({ success: true, logs });
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching logs",
      error: error.message,
    });
  }
});

/**
 * GET /api/admin/stats
 * Get dashboard statistics
 */
router.get("/stats", adminAuth, async (req, res) => {
  try {
    const logs = await getAccessLogs();

    const stats = {
      totalRequests: logs.length,
      activeUsers: logs.filter((log) => log.active).length,
      totalAccessEvents: logs.reduce(
        (sum, log) => sum + (log.usageLog?.length || 0),
        0
      ),
      uniqueIPs: new Set(logs.flatMap((log) => log.usageLog?.map((u) => u.ip)))
        .size,
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching stats",
      error: error.message,
    });
  }
});

module.exports = router;
