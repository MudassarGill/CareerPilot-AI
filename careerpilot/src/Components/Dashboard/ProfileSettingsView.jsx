import { useState } from "react";

function ProfileSettingsView({ user, onUpdateUser, onSignOut }) {
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [targetRole, setTargetRole] = useState(user?.target_role || "Full Stack AI Engineer");
  const [experienceLevel, setExperienceLevel] = useState(user?.experience_level || "Mid-Level (2-4 yrs)");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [mockInterviewReminders, setMockInterviewReminders] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    const updated = {
      ...user,
      name,
      target_role: targetRole,
      experience_level: experienceLevel,
    };
    try {
      sessionStorage.setItem("careerpilot_user", JSON.stringify(updated));
    } catch {
      // ignore
    }
    if (onUpdateUser) onUpdateUser(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 4000);
  }

  const userInitial = name ? name.charAt(0).toUpperCase() : "U";

  return (
    <div className="profile-page">
      <div className="profile-header">
        <span className="section-pill">Phase 3 • User Settings</span>
        <h1 className="profile-title">
          Profile & <span className="brand-orange">Preferences</span>
        </h1>
        <p className="profile-subtitle">
          Manage your career target goals, profile details, and notifications.
        </p>
      </div>

      <div className="profile-grid">
        {/* Left Column: Avatar & Summary Card */}
        <div className="profile-card profile-card--summary">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-lg">{userInitial}</div>
          </div>
          <h2 className="profile-summary-name">{name || "Career Pilot User"}</h2>
          <p className="profile-summary-email">{email || "user@example.com"}</p>
          <span className="profile-summary-badge">{targetRole}</span>

          <div className="profile-quick-stats">
            <div className="profile-stat-box">
              <span className="profile-stat-val">87%</span>
              <span className="profile-stat-lbl">Readiness</span>
            </div>
            <div className="profile-stat-box">
              <span className="profile-stat-val">15</span>
              <span className="profile-stat-lbl">Skills Active</span>
            </div>
            <div className="profile-stat-box">
              <span className="profile-stat-val">Tier 1</span>
              <span className="profile-stat-lbl">Account</span>
            </div>
          </div>

          <div className="profile-card-footer">
            <button
              type="button"
              className="btn-outline-danger"
              onClick={onSignOut}
            >
              Sign Out of Account
            </button>
          </div>
        </div>

        {/* Right Column: Settings Form */}
        <div className="profile-card profile-card--form">
          {savedNotice && (
            <div className="status-success mb-4">
              ✓ Profile preferences saved successfully!
            </div>
          )}

          <form onSubmit={handleSave} className="profile-form">
            <h3 className="profile-section-heading">Personal Information</h3>
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Read Only)</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="form-input form-input--disabled"
                />
              </div>
            </div>

            <h3 className="profile-section-heading mt-6">Career Objectives</h3>
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Target Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. AI Engineer, Full Stack Lead"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="form-input"
                >
                  <option value="Entry-Level (0-2 yrs)">Entry-Level (0-2 yrs)</option>
                  <option value="Mid-Level (2-4 yrs)">Mid-Level (2-4 yrs)</option>
                  <option value="Senior (5+ yrs)">Senior (5+ yrs)</option>
                  <option value="Staff / Lead (8+ yrs)">Staff / Lead (8+ yrs)</option>
                </select>
              </div>
            </div>

            <h3 className="profile-section-heading mt-6">Notification Preferences</h3>
            <div className="toggle-list">
              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                />
                <span className="toggle-text">
                  <strong>In-App Notifications</strong>
                  <small>Receive updates when your ATS scan or interview analysis completes</small>
                </span>
              </label>

              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={weeklyDigest}
                  onChange={(e) => setWeeklyDigest(e.target.checked)}
                />
                <span className="toggle-text">
                  <strong>Weekly Career Digest</strong>
                  <small>Receive high-match jobs and recommended roadmap milestones</small>
                </span>
              </label>

              <label className="toggle-item">
                <input
                  type="checkbox"
                  checked={mockInterviewReminders}
                  onChange={(e) => setMockInterviewReminders(e.target.checked)}
                />
                <span className="toggle-text">
                  <strong>Interview Reminders</strong>
                  <small>Get notified before scheduled mock interviews</small>
                </span>
              </label>
            </div>

            <div className="form-actions mt-8">
              <button type="submit" className="btn-primary">
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettingsView;
