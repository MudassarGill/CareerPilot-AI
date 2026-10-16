import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import DashboardHome from "./DashboardHome";
import AboutView from "./AboutView";
import ContactView from "./ContactView";
import ProfileSettingsView from "./ProfileSettingsView";
import TermsPrivacyView from "./TermsPrivacyView";
import FAQSection from "./FAQSection";
import ModulePlaceholder from "./ModulePlaceholder";
import NotificationsDrawer, { getDynamicNotifications } from "./NotificationsDrawer";
import ResumeView from "./ResumeView";
import SkillsView from "./SkillsView";
import InterviewView from "./InterviewView";

function Dashboard({ onSignOut }) {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
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

  const unreadCount = notifications.filter((n) => n.unread).length;

  function handleMarkAllNotificationsRead() {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, unread: false }));
      localStorage.setItem("careerpilot_user_notifications", JSON.stringify(updated));
      return updated;
    });
  }

  function handleDismissNotification(id) {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      localStorage.setItem("careerpilot_user_notifications", JSON.stringify(updated));
      return updated;
    });
  }

  function handleMarkNotificationRead(id) {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, unread: false } : n));
      localStorage.setItem("careerpilot_user_notifications", JSON.stringify(updated));
      return updated;
    });
  }

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("careerpilot_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  function handleNavigate(viewId) {
    setActiveView(viewId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleUpdateUser(updated) {
    setUser(updated);
  }

  /* Render center content according to activeView */
  function renderView() {
    switch (activeView) {
      case "dashboard":
        return <DashboardHome user={user} onNavigate={handleNavigate} />;
      case "about":
        return <AboutView onExploreModules={handleNavigate} />;
      case "contact":
        return <ContactView />;
      case "profile":
        return (
          <ProfileSettingsView
            user={user}
            onUpdateUser={handleUpdateUser}
            onSignOut={onSignOut}
          />
        );
      case "terms":
        return <TermsPrivacyView />;
      case "faq":
        return (
          <div className="faq-page-wrapper">
            <FAQSection />
          </div>
        );
      case "resume":
        return <ResumeView onNavigate={handleNavigate} />;
      case "skills":
        return <SkillsView onNavigate={handleNavigate} defaultTab="gaps" />;
      case "roadmap":
        return <SkillsView onNavigate={handleNavigate} defaultTab="roadmap" />;
      case "interview":
        return <InterviewView onNavigate={handleNavigate} />;
      case "career":
      case "jobs":
        return (
          <ModulePlaceholder
            moduleId={activeView}
            onBackToDashboard={() => handleNavigate("dashboard")}
          />
        );
      default:
        return <DashboardHome user={user} onNavigate={handleNavigate} />;
    }
  }

  return (
    <div className="dashboard-app-root">
      {/* ── Fixed Top Horizontal Navbar (Phase 2 & 3) ── */}
      <Navbar
        activeView={activeView}
        onNavigate={handleNavigate}
        user={user}
        onSignOut={onSignOut}
        unreadCount={unreadCount}
        onToggleNotifications={() => setNotificationsOpen((prev) => !prev)}
        onOpenProfile={() => handleNavigate("profile")}
      />

      {/* ── Notifications Drawer (Phase 3) ── */}
      <NotificationsDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onDismiss={handleDismissNotification}
        onMarkRead={handleMarkNotificationRead}
      />

      {/* ── Main View Area (with top padding for fixed navbar) ── */}
      <main className="dashboard-main-content">
        {renderView()}
      </main>

      {/* ── Rich Modern Footer (Phase 3) ── */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default Dashboard;
