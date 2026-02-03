// Netlify Function - Send SMS Code
const twilio = require("twilio");

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
    // Check environment variables
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      console.error("Missing Twilio credentials in environment");
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        body: JSON.stringify({ success: false, error: "SMS service not configured" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const { phone, site } = body;

    if (!phone) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        body: JSON.stringify({ success: false, error: "Phone required" }),
      };
    }

    // Initialize Twilio client
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const siteId = site || "unknown";

    // Format phone number for Twilio (add + if not present)
    let formattedPhone = phone.startsWith("+") ? phone : "+1" + phone.replace(/\D/g, "");

    // Send SMS
    const message = await client.messages.create({
      body: `🔐 Your Relegated Leader access code: ${code}\n\nExpires in 15 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log(`📱 SMS code sent to ${formattedPhone}: ${code} (SID: ${message.sid})`);

    // Mask phone for response
    const masked = phone.replace(/(.{2})(.*)(.{2})$/, "$1***$3");

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        message: "Code sent to phone",
        masked_phone: masked,
        codeId: Math.random().toString(36).substring(7),
      }),
    };
  } catch (error) {
    console.error("❌ SMS error:", error.message, error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, error: error.message || "Failed to send SMS" }),
    };
  }
};
