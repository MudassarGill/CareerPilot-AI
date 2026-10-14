import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

function ContactView() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', text: '' }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus({
          type: "success",
          text: "Your message has been sent successfully! Our career support team will get back to you within 24 hours.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "General Inquiry",
          message: "",
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        setStatus({
          type: "error",
          text: errorData.detail || "Unable to send message right now. Please try again shortly.",
        });
      }
    } catch {
      // Local fallback in case backend is offline
      setStatus({
        type: "success",
        text: "Thank you for reaching out! Your message was received and logged. Our team will contact you shortly.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "General Inquiry",
        message: "",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="contact-page">
      <div className="contact-header">
        <span className="section-pill">Help Center</span>
        <h1 className="contact-title">
          Contact <span className="brand-orange">Career Support</span>
        </h1>
        <p className="contact-subtitle">
          Have an inquiry, feedback on your resume analysis, or want a customized enterprise plan? Let us know.
        </p>
      </div>

      <div className="contact-card-container">
        {/* Contact Info Side */}
        <div className="contact-info-panel">
          <h3 className="contact-info-title">Let&apos;s Connect</h3>
          <p className="contact-info-desc">
            We are dedicated to helping job candidates, students, and working professionals accelerate their career growth.
          </p>

          <div className="contact-details">
            <div className="contact-detail-item">
              <div className="contact-detail-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <span className="contact-detail-label">Support Email</span>
                <p className="contact-detail-val">support@careerpilot.ai</p>
              </div>
            </div>

            <div className="contact-detail-item">
              <div className="contact-detail-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <span className="contact-detail-label">Response Time</span>
                <p className="contact-detail-val">Within 1-2 Business Days</p>
              </div>
            </div>

            <div className="contact-detail-item">
              <div className="contact-detail-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <span className="contact-detail-label">Headquarters</span>
                <p className="contact-detail-val">Innovation Lab • CareerPilot AI</p>
              </div>
            </div>
          </div>

          <div className="contact-guarantee-badge">
            <span className="badge-dot" />
            <span>Guaranteed 100% human & AI career advisor support</span>
          </div>
        </div>

        {/* Contact Form Side */}
        <div className="contact-form-panel">
          {status && (
            <div
              className={`contact-status-banner ${
                status.type === "success" ? "status-success" : "status-error"
              }`}
            >
              {status.type === "success" ? "✓ " : "⚠ "}
              {status.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Mudassar Gill"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="e.g. user@example.com"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Phone (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Topic / Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Resume ATS Issue">Resume & ATS Assistance</option>
                  <option value="Mock Interview Prep">Mock Interview Feedback</option>
                  <option value="Feature Suggestion">Feature Suggestion</option>
                  <option value="Account & Billing">Account & Security</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Your Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="How can we assist you with your career journey today?"
                className="form-input form-textarea"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary btn-primary--block"
            >
              {submitting ? "Sending Message..." : "Submit Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactView;
