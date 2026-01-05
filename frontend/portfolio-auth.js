/**
 * Authentication Modal System for Portfolio
 * Handles email/phone verification and session management
 */

class PortfolioAuthSystem {
  constructor(backendUrl = "http://localhost:5000") {
    this.backendUrl = backendUrl;
    this.currentRequestId = null;
    this.sessionId = localStorage.getItem("portfolioSessionId");
    this.sessionExpiry = localStorage.getItem("portfolioSessionExpiry");

    // Check if stored session is still valid
    if (this.sessionId && this.sessionExpiry) {
      if (new Date(this.sessionExpiry) < new Date()) {
        this.clearSession();
      }
    }

    this.initModal();
  }

  initModal() {
    // Create modal HTML
    const modalHTML = `
      <div id="authModal" class="auth-modal hidden">
        <div class="auth-modal-content">
          <button class="auth-modal-close" onclick="portfolioAuth.closeModal()">×</button>
          
          <div class="auth-modal-step auth-step-1">
            <h2>Access Portfolio</h2>
            <p>Enter your email or phone number to request access</p>
            
            <div class="auth-form-group">
              <label>
                <input type="radio" name="contactType" value="email" checked>
                Email
              </label>
              <label>
                <input type="radio" name="contactType" value="phone">
                Phone
              </label>
            </div>
            
            <input type="text" id="contactInfo" class="auth-input" placeholder="Enter email or phone number">
            <button class="auth-btn" onclick="portfolioAuth.requestVerification()">Send Code</button>
            
            <div id="step1Error" class="auth-error hidden"></div>
          </div>

          <div class="auth-modal-step auth-step-2 hidden">
            <h2>Verify Code</h2>
            <p>Enter the verification code sent to you</p>
            
            <input type="text" id="verificationCode" class="auth-input" placeholder="6-digit code" maxlength="6">
            <button class="auth-btn" onclick="portfolioAuth.verifyCode()">Verify</button>
            <button class="auth-btn-secondary" onclick="portfolioAuth.backToStep1()">Back</button>
            
            <div id="step2Error" class="auth-error hidden"></div>
            <div id="step2Message" class="auth-message hidden"></div>
          </div>

          <div class="auth-modal-step auth-step-3 hidden">
            <h2>Waiting for Approval</h2>
            <p>Your verification has been received. Francisco is reviewing your request.</p>
            <p>You will receive an email/SMS once approved.</p>
            
            <div class="auth-spinner"></div>
            
            <button class="auth-btn-secondary" onclick="portfolioAuth.closeModal()">Close</button>
          </div>

          <div class="auth-modal-step auth-step-4 hidden">
            <h2>Access Granted!</h2>
            <p>You have access for 20 minutes. Enjoy exploring!</p>
            
            <button class="auth-btn" onclick="portfolioAuth.closeModal()">Continue</button>
          </div>

          <div class="auth-modal-step auth-step-5 hidden">
            <h2>Additional Information</h2>
            <p>Session expired. Please provide additional information to continue.</p>
            
            <input type="text" id="firstName" class="auth-input" placeholder="First Name">
            <input type="text" id="lastName" class="auth-input" placeholder="Last Name">
            <input type="email" id="userEmail" class="auth-input" placeholder="Email">
            <input type="tel" id="userPhone" class="auth-input" placeholder="Phone Number">
            <input type="number" id="userAge" class="auth-input" placeholder="Age">
            
            <button class="auth-btn" onclick="portfolioAuth.submitPersonalInfo()">Submit & Continue</button>
            
            <div id="step5Error" class="auth-error hidden"></div>
          </div>
        </div>
      </div>
    `;

    // Add modal to DOM
    if (!document.getElementById("authModal")) {
      document.body.insertAdjacentHTML("beforeend", modalHTML);
    }

    // Add CSS
    this.injectCSS();
  }

  injectCSS() {
    const css = `
      .auth-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }

      .auth-modal.hidden {
        display: none;
      }

      .auth-modal-content {
        background: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        width: 90%;
        max-width: 400px;
        position: relative;
      }

      .auth-modal-close {
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        font-size: 28px;
        cursor: pointer;
        color: #999;
      }

      .auth-modal-close:hover {
        color: #333;
      }

      .auth-modal-step {
        display: none;
      }

      .auth-modal-step:not(.hidden) {
        display: block;
      }

      .auth-modal-step h2 {
        margin: 0 0 10px 0;
        color: #333;
        font-size: 24px;
      }

      .auth-modal-step p {
        color: #666;
        margin: 0 0 20px 0;
        line-height: 1.5;
      }

      .auth-form-group {
        display: flex;
        gap: 20px;
        margin: 15px 0;
      }

      .auth-form-group label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        color: #666;
      }

      .auth-input {
        width: 100%;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 14px;
        margin-bottom: 15px;
        transition: border-color 0.3s;
      }

      .auth-input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 5px rgba(102, 126, 234, 0.1);
      }

      .auth-btn, .auth-btn-secondary {
        width: 100%;
        padding: 12px;
        border: none;
        border-radius: 5px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
        margin-bottom: 10px;
      }

      .auth-btn {
        background: #667eea;
        color: white;
      }

      .auth-btn:hover {
        background: #5568d3;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
      }

      .auth-btn-secondary {
        background: #e5e7eb;
        color: #333;
      }

      .auth-btn-secondary:hover {
        background: #d1d5db;
      }

      .auth-error {
        background: #fee2e2;
        color: #991b1b;
        padding: 10px;
        border-radius: 5px;
        margin-top: 10px;
        border-left: 4px solid #ef4444;
      }

      .auth-error.hidden {
        display: none;
      }

      .auth-message {
        background: #d1fae5;
        color: #065f46;
        padding: 10px;
        border-radius: 5px;
        margin-top: 10px;
        border-left: 4px solid #10b981;
      }

      .auth-message.hidden {
        display: none;
      }

      .auth-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 20px auto;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @media (max-width: 500px) {
        .auth-modal-content {
          width: 95%;
          padding: 20px;
        }

        .auth-modal-step h2 {
          font-size: 20px;
        }
      }
    `;

    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  async requestVerification() {
    const contactType = document.querySelector(
      'input[name="contactType"]:checked'
    ).value;
    const contactInfo = document.getElementById("contactInfo").value;
    const errorDiv = document.getElementById("step1Error");

    errorDiv.classList.add("hidden");

    if (!contactInfo) {
      errorDiv.textContent = "Please enter your email or phone number";
      errorDiv.classList.remove("hidden");
      return;
    }

    try {
      const response = await fetch(
        `${this.backendUrl}/api/auth/request-verification`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contactInfo, type: contactType }),
        }
      );

      const data = await response.json();

      if (data.success) {
        this.currentRequestId = data.requestId;
        this.showStep(2);
      } else {
        errorDiv.textContent = data.message;
        errorDiv.classList.remove("hidden");
      }
    } catch (error) {
      errorDiv.textContent = "Error: " + error.message;
      errorDiv.classList.remove("hidden");
    }
  }

  async verifyCode() {
    const code = document.getElementById("verificationCode").value;
    const errorDiv = document.getElementById("step2Error");
    const messageDiv = document.getElementById("step2Message");

    errorDiv.classList.add("hidden");
    messageDiv.classList.add("hidden");

    if (!code || code.length !== 6) {
      errorDiv.textContent = "Please enter a valid 6-digit code";
      errorDiv.classList.remove("hidden");
      return;
    }

    try {
      const response = await fetch(`${this.backendUrl}/api/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: this.currentRequestId, code }),
      });

      const data = await response.json();

      if (data.success) {
        messageDiv.textContent = "Code verified! Waiting for approval...";
        messageDiv.classList.remove("hidden");
        this.showStep(3);

        // Poll for approval every 5 seconds
        this.pollForApproval();
      } else {
        errorDiv.textContent = data.message;
        errorDiv.classList.remove("hidden");
      }
    } catch (error) {
      errorDiv.textContent = "Error: " + error.message;
      errorDiv.classList.remove("hidden");
    }
  }

  pollForApproval() {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(
          `${this.backendUrl}/api/admin/request-status`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ requestId: this.currentRequestId }),
          }
        );

        const data = await response.json();

        if (data.approved) {
          clearInterval(pollInterval);
          this.setSession(data.sessionId);
          this.showStep(4);
        } else if (data.rejected) {
          clearInterval(pollInterval);
          alert("Your access request was rejected.");
          this.closeModal();
        }
      } catch (error) {
        // Continue polling on error
      }
    }, 5000);

    // Stop polling after 30 minutes
    setTimeout(() => clearInterval(pollInterval), 30 * 60 * 1000);
  }

  async submitPersonalInfo() {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("userEmail").value;
    const phone = document.getElementById("userPhone").value;
    const age = document.getElementById("userAge").value;
    const errorDiv = document.getElementById("step5Error");

    errorDiv.classList.add("hidden");

    if (!firstName || !lastName || !email || !phone || !age) {
      errorDiv.textContent = "Please fill in all fields";
      errorDiv.classList.remove("hidden");
      return;
    }

    try {
      const response = await fetch(
        `${this.backendUrl}/api/auth/submit-personal-info`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: this.sessionId,
            personalInfo: { firstName, lastName, email, phone, age },
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        this.extendSession();
        this.showStep(4);
      } else {
        errorDiv.textContent = data.message;
        errorDiv.classList.remove("hidden");
      }
    } catch (error) {
      errorDiv.textContent = "Error: " + error.message;
      errorDiv.classList.remove("hidden");
    }
  }

  showStep(step) {
    document
      .querySelectorAll(".auth-modal-step")
      .forEach((el) => el.classList.add("hidden"));
    document.querySelector(`.auth-step-${step}`).classList.remove("hidden");
  }

  backToStep1() {
    document.getElementById("contactInfo").value = "";
    document.getElementById("verificationCode").value = "";
    document.getElementById("step1Error").classList.add("hidden");
    document.getElementById("step2Error").classList.add("hidden");
    this.showStep(1);
  }

  setSession(sessionId) {
    const expiryTime = new Date(Date.now() + 20 * 60 * 1000);
    localStorage.setItem("portfolioSessionId", sessionId);
    localStorage.setItem("portfolioSessionExpiry", expiryTime.toISOString());
    this.sessionId = sessionId;
    this.sessionExpiry = expiryTime;
  }

  extendSession() {
    const expiryTime = new Date(Date.now() + 20 * 60 * 1000);
    localStorage.setItem("portfolioSessionExpiry", expiryTime.toISOString());
    this.sessionExpiry = expiryTime;
  }

  clearSession() {
    localStorage.removeItem("portfolioSessionId");
    localStorage.removeItem("portfolioSessionExpiry");
    this.sessionId = null;
    this.sessionExpiry = null;
  }

  async checkAccess() {
    if (!this.sessionId) {
      return false;
    }

    try {
      const response = await fetch(`${this.backendUrl}/api/access/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: this.sessionId }),
      });

      const data = await response.json();

      if (!data.authenticated) {
        this.clearSession();

        // Check if session expired (vs other reasons)
        if (data.message.includes("expired")) {
          this.showStep(5);
          this.openModal();
        }
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking access:", error);
      return false;
    }
  }

  openModal() {
    document.getElementById("authModal").classList.remove("hidden");
  }

  closeModal() {
    document.getElementById("authModal").classList.add("hidden");
  }
}

// Initialize on page load
let portfolioAuth;
document.addEventListener("DOMContentLoaded", () => {
  portfolioAuth = new PortfolioAuthSystem();
});
