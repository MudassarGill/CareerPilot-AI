import { useState, useEffect, useRef } from "react";
import logo from "../../assets/logo.jpg";

function Navbar({ activeView, onNavigate, user, onSignOut, unreadCount = 3, onToggleNotifications, onOpenProfile }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMoreDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { id: "dashboard", label: "Dashboard" },
    { id: "resume", label: "Resume & ATS" },
    { id: "roadmap", label: "Roadmap" },
    { id: "interview", label: "Mock Interview" },
    { id: "career", label: "Career Twin" },
    { id: "jobs", label: "Jobs" },
  ];

  const moreLinks = [
    { id: "about", label: "About Us" },
    { id: "faq", label: "FAQs" },
    { id: "contact", label: "Contact Support" },
    { id: "terms", label: "Terms & Privacy" },
  ];

  function handleNav(id) {
    onNavigate(id);
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
    setUserDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="top-navbar">
      <div className="top-navbar__container">
        {/* Brand Logo only — clean, no redundant name text and no phase badge */}
        <div className="top-navbar__brand" onClick={() => handleNav("dashboard")} title="CareerPilot AI">
          <div className="top-navbar__logo-wrapper">
            <img src={logo} alt="CareerPilot AI" className="top-navbar__logo" />
          </div>
        </div>

        {/* Desktop Navigation Links — Straight Horizontal across Top, Text Only, No Wrapping */}
        <nav className="top-navbar__nav">
          {navLinks.map((link) => {
            const isActive = activeView === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNav(link.id)}
                className={`top-navbar__link ${isActive ? "top-navbar__link--active" : ""}`}
              >
                {link.label}
                {isActive && <span className="top-navbar__underline" />}
              </button>
            );
          })}

          {/* "More" Dropdown for Shared Features */}
          <div className="top-navbar__dropdown-wrapper" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setMoreDropdownOpen((prev) => !prev)}
              className={`top-navbar__link top-navbar__dropdown-btn ${
                moreLinks.some((l) => l.id === activeView) ? "top-navbar__link--active" : ""
              }`}
            >
              More
              <svg
                className={`dropdown-chevron ${moreDropdownOpen ? "dropdown-chevron--open" : ""}`}
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {moreDropdownOpen && (
              <div className="top-navbar__dropdown-menu">
                {moreLinks.map((link) => (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => handleNav(link.id)}
                    className={`dropdown-menu__item ${activeView === link.id ? "dropdown-menu__item--active" : ""}`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right Section: Notifications + User Profile */}
        <div className="top-navbar__actions">
          {/* Notifications Button */}
          <button
            type="button"
            className="navbar-icon-btn"
            title="Notifications"
            onClick={onToggleNotifications}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {/* User Profile Avatar Circle — Click opens profile dropdown */}
          <div className="top-navbar__user-wrapper" ref={userMenuRef}>
            <button
              type="button"
              className="navbar-user-btn navbar-user-btn--avatar-only"
              onClick={() => setUserDropdownOpen((prev) => !prev)}
              title={user?.name || "Account Profile"}
              aria-label="User Profile Menu"
            >
              <div className="navbar-user-avatar">{userInitial}</div>
            </button>

            {userDropdownOpen && (
              <div className="navbar-user-menu">
                <div className="user-menu-header">
                  <p className="user-menu-name">{user?.name || "Career Pilot User"}</p>
                  <p className="user-menu-email">{user?.email || "user@example.com"}</p>
                </div>
                <div className="user-menu-divider" />
                <button
                  type="button"
                  className="user-menu-item"
                  onClick={() => {
                    handleNav("profile");
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Profile & Settings
                </button>
                <button
                  type="button"
                  className="user-menu-item"
                  onClick={() => handleNav("terms")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Terms & Privacy
                </button>
                <button
                  type="button"
                  className="user-menu-item"
                  onClick={() => handleNav("faq")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Help & FAQs
                </button>
                <div className="user-menu-divider" />
                <button
                  type="button"
                  className="user-menu-item user-menu-item--danger"
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onSignOut();
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="navbar-mobile-toggle"
            aria-label="Toggle Menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <div className="navbar-mobile-links">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNav(link.id)}
                className={`navbar-mobile-link ${activeView === link.id ? "navbar-mobile-link--active" : ""}`}
              >
                {link.label}
              </button>
            ))}

            <div className="mobile-divider" />
            <p className="mobile-section-label">Shared Features</p>
            {moreLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNav(link.id)}
                className={`navbar-mobile-link ${activeView === link.id ? "navbar-mobile-link--active" : ""}`}
              >
                {link.label}
              </button>
            ))}

            <div className="mobile-divider" />
            <button
              type="button"
              onClick={() => handleNav("profile")}
              className="navbar-mobile-link"
            >
              Profile & Settings
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onSignOut();
              }}
              className="navbar-mobile-link navbar-mobile-link--danger"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
