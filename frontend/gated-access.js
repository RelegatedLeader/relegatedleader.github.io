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
          
          <!-- Email Tab Only -->
          <div id="email-tab" class="gated-tab-content active">
            <div class="gated-modal-icon">🔐</div>
            <input 
              type="email" 
              id="email-input" 
              placeholder="Enter your email"
              class="gated-input"
              autocomplete="email"
            />
            <button 
              class="gated-btn" 
              onclick="gatedAccessManager.sendEmailCode()"
            >Get Access</button>
            <p id="email-status" class="gated-status"></p>
          </div>

          <!-- Code Verification -->
          <div id="verify-section" class="gated-verify-section" style="display: none;">
            <div class="gated-modal-icon">✓</div>
            <p id="verify-contact"></p>
            <input 
              type="text" 
              id="code-input" 
              placeholder="000000"
              class="gated-input gated-code-input"
              maxlength="6"
              inputmode="numeric"
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
          background: #000000;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(0, 200, 255, 0.5),
                        0 0 40px rgba(0, 150, 255, 0.3),
                        inset 0 0 20px rgba(0, 200, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(0, 200, 255, 0.8),
                        0 0 60px rgba(0, 150, 255, 0.5),
                        inset 0 0 30px rgba(0, 200, 255, 0.2);
          }
        }

        .gated-modal-content {
          background: #0a0a0a;
          padding: 50px;
          border-radius: 20px;
          max-width: 420px;
          width: 90%;
          position: relative;
          border: 2px solid rgba(0, 200, 255, 0.3);
          animation: glow 3s ease-in-out infinite, slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .gated-modal-close {
          position: absolute;
          top: 15px;
          right: 20px;
          background: none;
          border: none;
          font-size: 32px;
          cursor: pointer;
          color: rgba(0, 200, 255, 0.6);
          transition: all 0.3s;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gated-modal-close:hover {
          color: rgba(0, 200, 255, 1);
          transform: rotate(90deg) scale(1.1);
        }

        .gated-modal-icon {
          font-size: 48px;
          text-align: center;
          margin-bottom: 30px;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        .gated-tab-content {
          display: none;
        }

        .gated-tab-content.active {
          display: block;
        }

        .gated-input {
          width: 100%;
          padding: 14px;
          margin-bottom: 20px;
          background: rgba(0, 200, 255, 0.05);
          border: 2px solid rgba(0, 200, 255, 0.3);
          border-radius: 10px;
          font-size: 16px;
          box-sizing: border-box;
          color: #ffffff;
          transition: all 0.3s;
          font-family: inherit;
        }

        .gated-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .gated-input:focus {
          outline: none;
          background: rgba(0, 200, 255, 0.1);
          border-color: rgba(0, 200, 255, 0.8);
          box-shadow: 0 0 20px rgba(0, 200, 255, 0.4),
                      inset 0 0 10px rgba(0, 200, 255, 0.1);
        }

        .gated-code-input {
          font-size: 32px;
          letter-spacing: 12px;
          text-align: center;
          font-weight: bold;
          font-family: 'Courier New', monospace;
        }

        .gated-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, rgba(0, 200, 255, 0.8), rgba(0, 150, 255, 0.8));
          color: white;
          border: 2px solid rgba(0, 200, 255, 0.6);
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .gated-btn:hover {
          background: linear-gradient(135deg, rgba(0, 200, 255, 1), rgba(0, 150, 255, 1));
          transform: translateY(-3px);
          box-shadow: 0 0 25px rgba(0, 200, 255, 0.6),
                      0 8px 20px rgba(0, 200, 255, 0.3);
        }

        .gated-btn:active {
          transform: translateY(-1px);
        }

        .gated-btn-secondary {
          background: rgba(100, 100, 100, 0.6);
          border-color: rgba(100, 100, 100, 0.8);
        }

        .gated-btn-secondary:hover {
          background: rgba(100, 100, 100, 0.8);
          box-shadow: 0 0 20px rgba(100, 100, 100, 0.4);
        }

        .gated-status {
          font-size: 13px;
          padding: 12px;
          border-radius: 8px;
          margin: 12px 0 0 0;
          text-align: center;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .gated-status.success {
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
          border: 1px solid rgba(76, 175, 80, 0.5);
        }

        .gated-status.error {
          background: rgba(244, 67, 54, 0.2);
          color: #f44336;
          border: 1px solid rgba(244, 67, 54, 0.5);
        }

        .gated-status.info {
          background: rgba(0, 200, 255, 0.2);
          color: #00c8ff;
          border: 1px solid rgba(0, 200, 255, 0.5);
        }

        .gated-verify-section {
          margin-top: 0;
          padding-top: 0;
          border-top: none;
        }

        #verify-contact {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 20px;
          text-align: center;
        }
      </style>
    `;

    document.head.insertAdjacentHTML("beforeend", styles);
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
    // Phone option removed - email only
  }

  showVerifySection() {
    document.getElementById("email-tab").classList.remove("active");
    document.getElementById("verify-section").style.display = "block";
    document.getElementById("verify-contact").textContent =
      `Code sent to ${this.currentContact}`;
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
    document.getElementById("code-input").value = "";
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
