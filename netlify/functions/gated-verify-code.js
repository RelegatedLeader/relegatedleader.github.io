// Netlify Function - Verify Code
const crypto = require("crypto");

// Site redirect mapping
const SITE_REDIRECTS = {
  plasmic: "https://plasmic-security.netlify.app/",
  cubix: "https://cubix-finance.netlify.app/",
  "fallen-futuristics": "https://fallen-futuristics.netlify.app/",
  atlas: "https://atlas-pharmaceuticals.netlify.app/",
  "la-vie": "https://lavie-health.netlify.app/",
};

exports.handler = async (event) => {
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
    const code = body.code;
    const contact = body.contact;
    const contactMethod =
      body.contactMethod ||
      (body.contact
        ? body.contact.includes("@")
          ? "email"
          : "sms"
        : "unknown");
    const siteId = body.site || body.siteId || "unknown";

    if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ success: false, error: "Invalid code format" }),
      };
    }

    // Get client IP from headers
    const ip =
      event.headers["x-forwarded-for"]?.split(",")[0] ||
      event.headers["client-ip"] ||
      "unknown";

    // Get user agent
    const userAgent = event.headers["user-agent"] || "unknown";

    // Extract browser and OS info (simple parsing)
    let browser = "unknown";
    let os = "unknown";

    if (userAgent.includes("Chrome")) browser = "Chrome";
    else if (userAgent.includes("Safari")) browser = "Safari";
    else if (userAgent.includes("Firefox")) browser = "Firefox";
    else if (userAgent.includes("Edge")) browser = "Edge";

    if (userAgent.includes("Windows")) os = "Windows";
    else if (userAgent.includes("Mac")) os = "macOS";
    else if (userAgent.includes("Linux")) os = "Linux";
    else if (userAgent.includes("iPhone") || userAgent.includes("iPad"))
      os = "iOS";
    else if (userAgent.includes("Android")) os = "Android";

    // Generate access token
    const accessToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 20 * 60 * 1000; // 20 minutes

    // Prepare visitor data for logging
    const visitorData = {
      contact: contact,
      contactMethod: contactMethod,
      site: siteId,
      ip: ip,
      browser: browser,
      os: os,
      accessTime: new Date().toISOString(),
      token: accessToken,
      expiresAt: new Date(expiresAt).toISOString(),
    };

    // Log to console (for now) - would integrate with Firebase in production
    console.log("📊 Visitor access granted:", JSON.stringify(visitorData));

    // Get redirect URL for the site
    const redirectUrl = SITE_REDIRECTS[siteId] || null;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        message: "Access verified!",
        token: accessToken,
        expires_in: 20 * 60,
        redirectUrl: redirectUrl,
        visitor: visitorData,
      }),
    };
  } catch (error) {
    console.error("Verify error:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
