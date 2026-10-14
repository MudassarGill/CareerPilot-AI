import { useState } from "react";
import logo from "../../assets/logo.jpg";

function Footer({ onNavigate }) {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e) {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setNewsletterEmail("");
    setTimeout(() => setSubscribed(false), 5000);
  }

  function handleLinkClick(id) {
    if (onNavigate) {
      onNavigate(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        {/* Top Grid */}
        <div className="site-footer__grid">
          {/* Brand Info */}
          <div className="footer-col footer-col--brand">
            <div className="footer-brand" onClick={() => handleLinkClick("dashboard")}>
              <img src={logo} alt="CareerPilot AI" className="footer-brand__logo" />
              <span className="footer-brand__name">
                Career<span className="brand-orange">Pilot AI</span>
              </span>
            </div>
            <p className="footer-brand__desc">
              Your AI-powered career navigation, ATS resume optimization, roadmap planning, and mock interview acceleration platform.
            </p>
            <div className="footer-tags">
              <span className="footer-tag">AI Career Suite</span>
              <span className="footer-tag">Real-Time Analytics</span>
              <span className="footer-tag">Next-Gen Prep</span>
            </div>
          </div>

          {/* Platform Features */}
          <div className="footer-col">
            <h4 className="footer-col__title">Platform Features</h4>
            <ul className="footer-links">
              <li><button type="button" onClick={() => handleLinkClick("dashboard")}>Career Dashboard</button></li>
              <li><button type="button" onClick={() => handleLinkClick("resume")}>Resume & ATS Analyzer</button></li>
              <li><button type="button" onClick={() => handleLinkClick("roadmap")}>Skills & Career Roadmap</button></li>
              <li><button type="button" onClick={() => handleLinkClick("interview")}>AI Mock Interview</button></li>
              <li><button type="button" onClick={() => handleLinkClick("career")}>Career Twin Simulator</button></li>
              <li><button type="button" onClick={() => handleLinkClick("jobs")}>Job Intelligence Matcher</button></li>
            </ul>
          </div>

          {/* Shared Features & Company (Phase 3) */}
          <div className="footer-col">
            <h4 className="footer-col__title">Platform & Support</h4>
            <ul className="footer-links">
              <li><button type="button" onClick={() => handleLinkClick("about")}>About CareerPilot</button></li>
              <li><button type="button" onClick={() => handleLinkClick("faq")}>Frequently Asked Questions</button></li>
              <li><button type="button" onClick={() => handleLinkClick("contact")}>Contact Career Support</button></li>
              <li><button type="button" onClick={() => handleLinkClick("profile")}>User Profile & Settings</button></li>
              <li><button type="button" onClick={() => handleLinkClick("terms")}>Privacy & Security Policy</button></li>
              <li><button type="button" onClick={() => handleLinkClick("terms")}>Terms of Service</button></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="footer-col footer-col--newsletter">
            <h4 className="footer-col__title">Stay Ahead</h4>
            <p className="footer-newsletter__text">
              Subscribe to weekly career insights, hiring trends, and newly released AI tools.
            </p>
            <form onSubmit={handleSubscribe} className="footer-newsletter__form">
              <input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="footer-newsletter__input"
              />
              <button type="submit" className="footer-newsletter__btn">
                Subscribe
              </button>
            </form>
            {subscribed && (
              <p className="footer-newsletter__success">
                ✓ Thank you! You are now subscribed to CareerPilot updates.
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="site-footer__bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} <span className="brand-orange">CareerPilot AI</span>. Built for ambitious professionals. All rights reserved.
          </p>
          <div className="footer-legal-links">
            <button type="button" onClick={() => handleLinkClick("terms")}>Privacy Policy</button>
            <span className="dot-sep">•</span>
            <button type="button" onClick={() => handleLinkClick("terms")}>Terms of Service</button>
            <span className="dot-sep">•</span>
            <button type="button" onClick={() => handleLinkClick("faq")}>Support</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
