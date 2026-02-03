// Gated access modal system
class GatedAccessManager {
  constructor(siteId) {
    this.siteId = siteId;
    this.token = localStorage.getItem(`gated_token_${siteId}`);
    this.expiresAt = localStorage.getItem(`gated_expires_${siteId}`);
  }

  async checkAccess() {
    // If no token, show gating modal
    if (!this.token || !this.expiresAt) {
      this.showGatingModal();
      return false;
    }

    // Check if token is expired (client-side check)
    const expiresAtTime = parseInt(this.expiresAt);
    const now = Date.now();

    if (now > expiresAtTime) {
      // Token expired
      localStorage.removeItem(`gated_token_${this.siteId}`);
      localStorage.removeItem(`gated_expires_${this.siteId}`);
      this.showGatingModal();
      return false;
    }

    // Token still valid - check time remaining
    const timeLeft = expiresAtTime - now;
    if (timeLeft < 2 * 60 * 1000) {
      this.showExpiringWarning(timeLeft);
    }

    return true;
  }

  showGatingModal() {
    const modal = `
      <div id="gated-access-modal" class="gated-modal-overlay">
        <div class="gated-modal-content">
          <button class="gated-modal-close" onclick="gatedAccessManager.closeModal()">×</button>
          
          <h2>Access Required</h2>
          <p>Enter your email or phone number to receive an access code.</p>
          
          <div id="access-tabs" class="gated-tabs">
            <button class="gated-tab-btn active" onclick="gatedAccessManager.switchTab('email')">📧 Email</button>
            <button class="gated-tab-btn" onclick="gatedAccessManager.switchTab('phone')">📱 Phone</button>
          </div>

          <!-- Email Tab -->
          <div id="email-tab" class="gated-tab-content active">
            <input 
              type="email" 
              id="email-input" 
              placeholder="your@email.com"
              class="gated-input"
            />
            <button 
              class="gated-btn" 
              onclick="gatedAccessManager.sendEmailCode()"
            >Send Code via Email</button>
            <p id="email-status" class="gated-status"></p>
          </div>

          <!-- Phone Tab -->
          <div id="phone-tab" class="gated-tab-content">
            <input 
              type="tel" 
              id="phone-input" 
              placeholder="+1 (555) 000-0000"
              class="gated-input"
            />
            <button 
              class="gated-btn" 
              onclick="gatedAccessManager.sendPhoneCode()"
            >Send Code via SMS</button>
            <p id="phone-status" class="gated-status"></p>
          </div>

          <!-- Code Verification -->
          <div id="verify-section" class="gated-verify-section" style="display: none;">
            <h3>Enter Your Code</h3>
            <p id="verify-contact"></p>
            <input 
              type="text" 
              id="code-input" 
              placeholder="000000"
              class="gated-input gated-code-input"
              maxlength="6"
            />
            <button 
              class="gated-btn" 
              onclick="gatedAccessManager.verifyCode()"
            >Verify & Access</button>
            <button 
              class="gated-btn gated-btn-secondary" 
              onclick="gatedAccessManager.backToRequest()"
            >Back</button>
            <p id="verify-status" class="gated-status"></p>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("afterbegin", modal);
    this.injectStyles();
  }

  injectStyles() {
    if (document.getElementById("gated-access-styles")) return;

    const styles = `
      <style id="gated-access-styles">
        .gated-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
        }

        .gated-modal-content {
          background: white;
          padding: 40px;
          border-radius: 12px;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          position: relative;
        }

        .gated-modal-close {
          position: absolute;
          top: 10px;
          right: 15px;
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #999;
        }

        .gated-modal-close:hover {
          color: #333;
        }

        h2 {
          margin: 0 0 10px 0;
          color: #333;
        }

        p {
          color: #666;
          font-size: 14px;
          margin: 0 0 20px 0;
        }

        .gated-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          border-bottom: 2px solid #eee;
        }

        .gated-tab-btn {
          flex: 1;
          padding: 10px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-size: 14px;
          color: #999;
          transition: all 0.3s;
        }

        .gated-tab-btn.active {
          color: #007bff;
          border-bottom-color: #007bff;
        }

        .gated-tab-content {
          display: none;
        }

        .gated-tab-content.active {
          display: block;
        }

        .gated-input {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          box-sizing: border-box;
        }

        .gated-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .gated-code-input {
          font-size: 24px;
          letter-spacing: 8px;
          text-align: center;
          font-weight: bold;
        }

        .gated-btn {
          width: 100%;
          padding: 12px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 10px;
        }

        .gated-btn:hover {
          background: #0056b3;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
        }

        .gated-btn:active {
          transform: translateY(0);
        }

        .gated-btn-secondary {
          background: #6c757d;
        }

        .gated-btn-secondary:hover {
          background: #5a6268;
        }

        .gated-status {
          font-size: 13px;
          padding: 10px;
          border-radius: 4px;
          margin: 10px 0 0 0;
        }

        .gated-status.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .gated-status.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .gated-status.info {
          background: #d1ecf1;
          color: #0c5460;
          border: 1px solid #bee5eb;
        }

        .gated-verify-section {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        .gated-verify-section h3 {
          margin: 0 0 5px 0;
          font-size: 16px;
          color: #333;
        }

        #verify-contact {
          font-size: 12px;
          color: #999;
          margin-bottom: 15px;
        }

        .gated-privacy-notice {
          font-size: 12px !important;
          color: #999 !important;
          text-align: center;
          margin-top: 20px !important;
          padding-top: 15px;
          border-top: 1px solid #eee;
        }
      </style>
    `;

    document.head.insertAdjacentHTML("beforeend", styles);
  }

  switchTab(tab) {
    // Update buttons
    document.querySelectorAll(".gated-tab-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    event.target.classList.add("active");

    // Update content
    document.querySelectorAll(".gated-tab-content").forEach((content) => {
      content.classList.remove("active");
    });
    document.getElementById(`${tab}-tab`).classList.add("active");
  }

  async sendEmailCode() {
    const email = document.getElementById("email-input").value.trim();
    const statusEl = document.getElementById("email-status");

    if (!email) {
      this.setStatus(statusEl, "Please enter an email", "error");
      return;
    }

    try {
      this.setStatus(statusEl, "Sending...", "info");
      const response = await fetch(
        "/.netlify/functions/gated-send-code-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, site: this.siteId }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        this.setStatus(
          statusEl,
          `Code sent to ${data.masked_email}`,
          "success",
        );
        this.currentContact = email;
        this.currentContactType = "email";
        setTimeout(() => this.showVerifySection(), 1000);
      } else {
        this.setStatus(statusEl, data.error || "Failed to send code", "error");
      }
    } catch (error) {
      this.setStatus(statusEl, "Network error: " + error.message, "error");
    }
  }

  async sendPhoneCode() {
    const phone = document.getElementById("phone-input").value.trim();
    const statusEl = document.getElementById("phone-status");

    if (!phone) {
      this.setStatus(statusEl, "Please enter a phone number", "error");
      return;
    }

    try {
      this.setStatus(statusEl, "Sending...", "info");
      const response = await fetch("/.netlify/functions/gated-send-code-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, site: this.siteId }),
      });

      const data = await response.json();

      if (response.ok) {
        this.setStatus(
          statusEl,
          `Code sent to ${data.masked_phone}`,
          "success",
        );
        this.currentContact = phone;
        this.currentContactType = "sms";
        setTimeout(() => this.showVerifySection(), 1000);
      } else {
        this.setStatus(statusEl, data.error || "Failed to send code", "error");
      }
    } catch (error) {
      this.setStatus(statusEl, "Network error: " + error.message, "error");
    }
  }

  showVerifySection() {
    document.getElementById("email-tab").classList.remove("active");
    document.getElementById("phone-tab").classList.remove("active");
    document.getElementById("verify-section").style.display = "block";
    document.getElementById("verify-contact").textContent =
      `Sent to: ${this.currentContact}`;
    document.getElementById("code-input").focus();
  }

  async verifyCode() {
    const code = document.getElementById("code-input").value.trim();
    const statusEl = document.getElementById("verify-status");

    if (!code || code.length !== 6) {
      this.setStatus(statusEl, "Code must be 6 digits", "error");
      return;
    }

    try {
      this.setStatus(statusEl, "Verifying...", "info");
      const response = await fetch("/.netlify/functions/gated-verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          contact: this.currentContact,
          site: this.siteId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store token and expiry for regular user
        localStorage.setItem(`gated_token_${this.siteId}`, data.token);
        localStorage.setItem(
          `gated_expires_${this.siteId}`,
          Date.now() + data.expires_in * 1000,
        );

        // Log visitor data to Firebase
        try {
          await fetch("/.netlify/functions/gated-log-visitor", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data.visitor),
          });
        } catch (logError) {
          console.warn("Failed to log visitor data:", logError);
          // Continue anyway - logging failure shouldn't block access
        }

        this.setStatus(statusEl, "✓ Access granted! Redirecting...", "success");

        // Redirect to the site URL if available
        if (data.redirectUrl) {
          setTimeout(() => (window.location.href = data.redirectUrl), 1500);
        } else {
          // Fallback: reload current page
          setTimeout(() => location.reload(), 1500);
        }
      } else {
        this.setStatus(
          statusEl,
          data.error || "Code verification failed",
          "error",
        );
      }
    } catch (error) {
      this.setStatus(statusEl, "Network error: " + error.message, "error");
    }
  }

  backToRequest() {
    document.getElementById("email-tab").classList.add("active");
    document.getElementById("verify-section").style.display = "none";
    document.getElementById("email-input").value = "";
    document.getElementById("phone-input").value = "";
  }

  showExpiringWarning(timeLeft) {
    const minutes = Math.floor(timeLeft / (1000 * 60));
    console.warn(
      `⚠️ Your access will expire in ${minutes} minutes. Refresh to renew.`,
    );
  }

  setStatus(element, message, type) {
    element.textContent = message;
    element.className = `gated-status ${type}`;
  }

  closeModal() {
    const modal = document.getElementById("gated-access-modal");
    if (modal) modal.remove();
  }
}

// Initialize on page load
let gatedAccessManager;

function initGatedAccess(siteId) {
  gatedAccessManager = new GatedAccessManager(siteId);
  gatedAccessManager.checkAccess();
}
