const nodemailer = require("nodemailer");

/**
 * Email service configuration
 * Supports Gmail, Outlook, ProtonMail, or custom SMTP
 */

function createEmailTransporter() {
  const service = process.env.EMAIL_SERVICE || "gmail";

  const config = {
    gmail: {
      service: "gmail",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
      },
    },
    protonmail: {
      host: "smtp.protonmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.PROTON_PASSWORD,
      },
    },
    outlook: {
      service: "outlook",
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.OUTLOOK_PASSWORD,
      },
    },
    custom: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  };

  return nodemailer.createTransport(config[service] || config.gmail);
}

/**
 * Send verification code email
 */
async function sendVerificationEmail(recipientEmail, code) {
  const transporter = createEmailTransporter();

  const mailOptions = {
    from: `"Portfolio Access" <${process.env.ADMIN_EMAIL}>`,
    to: recipientEmail,
    subject: "🔐 Your Portfolio Access Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">Portfolio Access Request</h2>
        
        <p>You requested access to Francisco's portfolio. Here's your verification code:</p>
        
        <div style="background: #f0f0f0; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
          <h1 style="color: #667eea; letter-spacing: 5px; margin: 0;">${code}</h1>
        </div>
        
        <p><strong>This code expires in 15 minutes.</strong></p>
        
        <p style="color: #999; font-size: 12px;">
          If you didn't request this code, please ignore this email.
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Send admin notification of new request
 */
async function sendAdminNotification(requestData) {
  const transporter = createEmailTransporter();

  const { contactInfo, type, ip, location, verifiedAt } = requestData;

  const mailOptions = {
    from: `"Portfolio Access" <${process.env.ADMIN_EMAIL}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "🔔 New Portfolio Access Request Requires Approval",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">New Access Request</h2>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p><strong>Contact Info:</strong> ${contactInfo}</p>
          <p><strong>Type:</strong> ${
            type === "email" ? "📧 Email" : "📱 Phone"
          }</p>
          <p><strong>IP Address:</strong> ${ip}</p>
          <p><strong>Location:</strong> ${location.city}, ${
      location.country
    }</p>
          <p><strong>Requested:</strong> ${new Date(
            verifiedAt
          ).toLocaleString()}</p>
        </div>
        
        <p>
          <a href="http://localhost:${process.env.PORT || 5000}/admin" 
             style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Review in Admin Dashboard
          </a>
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Send approval notification to user
 */
async function sendApprovalNotification(userEmail, sessionExpiry) {
  const transporter = createEmailTransporter();

  const mailOptions = {
    from: `"Portfolio Access" <${process.env.ADMIN_EMAIL}>`,
    to: userEmail,
    subject: "✅ Your Portfolio Access Has Been Approved!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Access Approved!</h2>
        
        <p>Your access request has been approved by Francisco. You now have access to the portfolio!</p>
        
        <div style="background: #d1fae5; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; margin: 15px 0;">
          <p><strong>Access Duration:</strong> 20 minutes</p>
          <p><strong>Expires:</strong> ${new Date(
            sessionExpiry
          ).toLocaleString()}</p>
        </div>
        
        <p>After 20 minutes, you'll need to provide additional information to continue accessing the portfolio.</p>
        
        <p style="color: #999; font-size: 12px;">
          Enjoy exploring the portfolio!
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Send rejection notification
 */
async function sendRejectionNotification(userEmail, reason) {
  const transporter = createEmailTransporter();

  const mailOptions = {
    from: `"Portfolio Access" <${process.env.ADMIN_EMAIL}>`,
    to: userEmail,
    subject: "Portfolio Access Request - Status Update",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">Access Request Reviewed</h2>
        
        <p>Your portfolio access request has been reviewed and unfortunately not approved at this time.</p>
        
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
        
        <p>You can try requesting access again later.</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = {
  createEmailTransporter,
  sendVerificationEmail,
  sendAdminNotification,
  sendApprovalNotification,
  sendRejectionNotification,
};
