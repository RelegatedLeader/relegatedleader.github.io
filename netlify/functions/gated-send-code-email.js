// Netlify Function - Send Email Code
const nodemailer = require("nodemailer");

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
    // Validate environment variables
    if (!process.env.EMAIL_FROM || !process.env.EMAIL_PASSWORD) {
      console.error("Missing email credentials");
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          success: false,
          error: "Email service not configured",
        }),
      };
    }

    // Parse request body
    const body = JSON.parse(event.body || "{}");
    const { email, site } = body;

    if (!email) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          success: false,
          error: "Email required",
        }),
      };
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Generate code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const siteId = site || "unknown";

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "🔐 Your Relegated Leader Access Code",
      html: `<div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;"><h2 style="color: #00d4ff;">🔐 Access Code</h2><p>Your code to access <strong>${siteId}</strong>:</p><div style="background: #1a1f3a; border: 2px solid #00d4ff; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;"><h1 style="color: #00d4ff; font-size: 48px; margin: 0; letter-spacing: 10px; font-family: monospace;">${code}</h1></div><p>This code expires in 15 minutes.</p></div>`,
    });

    console.log(`Email sent to ${email} with code ${code}`);

    // Mask email
    const masked = email.replace(/(.{2})(.*)(@.*)/, "$1***$3");

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        message: "Code sent to email",
        masked_email: masked,
        codeId: Math.random().toString(36).substring(7),
      }),
    };
  } catch (error) {
    console.error("Email function error:", error.message);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: false,
        error: error.message || "Failed to send email",
      }),
    };
  }
};
