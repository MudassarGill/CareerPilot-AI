import { useState } from "react";

const initialNotifications = [
  {
    id: "notif-1",
    title: "ATS Resume Engine v1.2 Ready",
    message: "Upload your resume in Resume & ATS to get real-time keyword analysis and recruiter benchmark score.",
    time: "10 mins ago",
    unread: true,
    tag: "Resume",
  },
  {
    id: "notif-2",
    title: "Welcome to CareerPilot AI",
    message: "Your profile is verified. Complete your roadmap steps to unlock your Career Readiness Score.",
    time: "1 hour ago",
    unread: true,
    tag: "Welcome",
  },
  {
    id: "notif-3",
    title: "New Interview Question Bank",
    message: "50+ updated Full-Stack and AI Engineer behavioral questions added to Mock Interview module.",
    time: "Yesterday",
    unread: true,
    tag: "Interview",
  },
  {
    id: "notif-4",
    title: "Weekly Career Digest",
    message: "Tech hiring demand in Full Stack and Python roles increased by 14% this week.",
    time: "3 days ago",
    unread: false,
    tag: "Digest",
  },
];

function NotificationsDrawer({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  if (!isOpen) return null;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  function dismiss(id) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
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
