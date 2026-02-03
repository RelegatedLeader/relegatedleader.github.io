// Netlify Function - Send Email Code
const nodemailer = require("nodemailer");

// Initialize email transporter with proper Gmail configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_FROM || "",
    pass: process.env.EMAIL_PASSWORD || "",
  },
});

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
    if (!process.env.EMAIL_FROM || !process.env.EMAIL_PASSWORD) {
      console.error("Missing email credentials in environment");
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        body: JSON.stringify({ success: false, error: "Email service not configured" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const { email, site } = body;

    if (!email) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
        body: JSON.stringify({ success: false, error: "Email required" }),
      };
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const siteId = site || "unknown";

    // Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "🔐 Your Relegated Leader Access Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #00d4ff;">🔐 Access Code</h2>
          <p>Your code to access <strong>${siteId}</strong>:</p>
          <div style="background: #1a1f3a; border: 2px solid #00d4ff; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #00d4ff; font-size: 48px; margin: 0; letter-spacing: 10px; font-family: monospace;">${code}</h1>
          </div>
          <p>This code expires in <strong>15 minutes</strong>.</p>
          <p style="color: #999; font-size: 12px;">From Relegated Leader</p>
        </div>
      `,
    });

    console.log(`📧 Email code sent to ${email}: ${code} (messageId: ${info.messageId})`);

    // Mask email for response
    const masked = email.replace(/(.{2})(.*)(@.*)/, "$1***$3");

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        message: "Code sent to email",
        masked_email: masked,
        codeId: Math.random().toString(36).substring(7),
      }),
    };
  } catch (error) {
    console.error("❌ Email error:", error.message, error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" },
      body: JSON.stringify({ success: false, error: error.message || "Failed to send email" }),
    };
  }
};
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
