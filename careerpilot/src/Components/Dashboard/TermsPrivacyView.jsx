import { useState } from "react";

function TermsPrivacyView() {
  const [tab, setTab] = useState("privacy");

  return (
    <div className="terms-page">
      <div className="terms-header">
        <span className="section-pill">Phase 3 • Legal & Compliance</span>
        <h1 className="terms-title">
          Security, Terms & <span className="brand-orange">Privacy</span>
        </h1>
        <p className="terms-subtitle">
          Transparent guidelines on how we protect your career data, resume confidentiality, and user rights.
        </p>

        <div className="terms-tab-bar">
          <button
            type="button"
            className={`terms-tab-btn ${tab === "privacy" ? "terms-tab-btn--active" : ""}`}
            onClick={() => setTab("privacy")}
          >
            Privacy Policy
          </button>
          <button
            type="button"
            className={`terms-tab-btn ${tab === "terms" ? "terms-tab-btn--active" : ""}`}
            onClick={() => setTab("terms")}
          >
            Terms of Service
          </button>
        </div>
      </div>

      <div className="terms-card">
        {tab === "privacy" ? (
          <div className="terms-content">
            <h2 className="terms-doc-title">Privacy Policy</h2>
            <p className="terms-doc-meta">Last Updated: October 2026 • CareerPilot AI Governance</p>

            <section className="terms-section">
              <h3>1. Commitment to Candidate Data Privacy</h3>
              <p>
                At CareerPilot AI, we believe your career records, resumes, and interview responses are personal and sensitive. We do not sell your personal data or uploaded resumes to data brokers, marketing networks, or unverified third parties.
              </p>
            </section>

            <section className="terms-section">
              <h3>2. Information We Collect</h3>
              <ul>
                <li><strong>Account Data:</strong> Name, email address, password hash, target job titles.</li>
                <li><strong>Resume Data:</strong> Uploaded resume files (PDF, DOCX) processed solely for ATS parsing and scoring.</li>
                <li><strong>Interview Submissions:</strong> Practice audio, video, or text recordings collected during mock interviews for feedback generation.</li>
                <li><strong>Usage Telemetry:</strong> Logins, feature usage, and browser diagnostics for platform stability.</li>
              </ul>
            </section>

            <section className="terms-section">
              <h3>3. How We Use and Protect Your Data</h3>
              <p>
                All data is encrypted in transit using TLS 1.3 and at rest with AES-256 standards. You maintain complete ownership of your career artifacts and can request full deletion at any time via your Profile Settings.
              </p>
            </section>
          </div>
        ) : (
          <div className="terms-content">
            <h2 className="terms-doc-title">Terms of Service</h2>
            <p className="terms-doc-meta">Last Updated: October 2026 • CareerPilot AI Agreement</p>

            <section className="terms-section">
              <h3>1. Acceptance of Terms</h3>
              <p>
                By creating an account or using CareerPilot AI services, you agree to comply with and be legally bound by these terms. If you do not agree, you must discontinue using the platform.
              </p>
            </section>

            <section className="terms-section">
              <h3>2. Permitted Use</h3>
              <p>
                CareerPilot AI is provided for lawful personal career advancement, resume enhancement, skill benchmarking, and interview preparation. You may not reverse engineer, scrape, or automate extraction of proprietary algorithms.
              </p>
            </section>

            <section className="terms-section">
              <h3>3. AI Outputs Disclaimer</h3>
              <p>
                Career Readiness Scores and ATS scores are algorithmic recommendations meant to assist your preparation. They do not constitute a legal guarantee of hiring or employment offers.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default TermsPrivacyView;
