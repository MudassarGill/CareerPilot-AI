import { useState, useEffect } from "react";

function getDynamicNotifications() {
  const list = [];
  const storedRole = localStorage.getItem("careerpilot_target_role") || "Full Stack Developer";
  const storedResume = localStorage.getItem("careerpilot_last_resume");
  const storedSkills = localStorage.getItem("careerpilot_my_skills");

  if (storedResume) {
    try {
      const parsed = JSON.parse(storedResume);
      list.push({
        id: "notif-resume-active",
        title: "Resume Analyzed Successfully",
        message: `Parsed ${parsed.total_skills_found || 0} skills from ${parsed.file_name || "your resume"}. Ready for ATS matching against ${storedRole}.`,
        time: "Just now",
        unread: true,
        tag: "Resume",
      });
    } catch {
      // ignore
    }
  } else {
    list.push({
      id: "notif-resume-prompt",
      title: "ATS Resume Optimization Ready",
      message: `Upload your resume to benchmark your keywords against standard ${storedRole} job descriptions.`,
      time: "15 mins ago",
      unread: true,
      tag: "Action",
    });
  }

  if (storedSkills) {
    try {
      const parsedSkills = JSON.parse(storedSkills);
      const count = Array.isArray(parsedSkills) ? parsedSkills.length : 0;
      if (count > 0) {
        list.push({
          id: "notif-skills-active",
          title: "Skills Profile Synced",
          message: `${count} verified technical competencies are feeding your Career Readiness Score (CRS).`,
          time: "1 hour ago",
          unread: true,
          tag: "Skills",
        });
      }
    } catch {
      // ignore
    }
  }

  list.push({
    id: "notif-crs-live",
    title: `Target Role: ${storedRole}`,
    message: "Industry benchmark requirements updated. Check your Skill Gap Matrix to review target proficiencies.",
    time: "2 hours ago",
    unread: false,
    tag: "Roadmap",
  });

  list.push({
    id: "notif-welcome",
    title: "Welcome to CareerPilot AI",
    message: "Your AI-powered career roadmap, ATS resume intelligence, and interview acceleration suite are active.",
    time: "Today",
    unread: false,
    tag: "System",
  });

  return list;
}

function NotificationsDrawer({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("careerpilot_user_notifications");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return getDynamicNotifications();
  });

  useEffect(() => {
    if (isOpen) {
      // refresh with current dynamic context if no custom dismissals
      const saved = localStorage.getItem("careerpilot_user_notifications");
      if (!saved) {
        setNotifications(getDynamicNotifications());
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function markAllRead() {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, unread: false }));
      localStorage.setItem("careerpilot_user_notifications", JSON.stringify(updated));
      return updated;
    });
  }

  function dismiss(id) {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      localStorage.setItem("careerpilot_user_notifications", JSON.stringify(updated));
      return updated;
    });
  }

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="notif-overlay" onClick={onClose}>
      <div className="notif-panel" onClick={(e) => e.stopPropagation()}>
        <div className="notif-header">
          <div className="notif-header__title-wrap">
            <h3 className="notif-title">Notifications</h3>
            {unreadCount > 0 && <span className="notif-badge-pill">{unreadCount} unread</span>}
          </div>
          <div className="notif-header__actions">
            {unreadCount > 0 && (
              <button type="button" onClick={markAllRead} className="notif-read-btn">
                Mark all read
              </button>
            )}
            <button type="button" onClick={onClose} className="notif-close-btn">
              ✕
            </button>
          </div>
        </div>

        <div className="notif-list">
          {notifications.length === 0 ? (
            <div className="notif-empty">
              <p>No new notifications right now.</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`notif-item ${item.unread ? "notif-item--unread" : ""}`}
              >
                <div className="notif-item__top">
                  <span className="notif-tag">{item.tag}</span>
                  <span className="notif-time">{item.time}</span>
                  <button
                    type="button"
                    onClick={() => dismiss(item.id)}
                    className="notif-dismiss-btn"
                    title="Dismiss"
                  >
                    ✕
                  </button>
                </div>
                <h4 className="notif-item__title">{item.title}</h4>
                <p className="notif-item__msg">{item.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationsDrawer;
