import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import DashboardHome from "./DashboardHome";

function Dashboard({ onSignOut }) {
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");

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

  /* Placeholder views for Phase 3+ */
  function renderContent() {
    switch (activeView) {
      case "dashboard":
        return <DashboardHome user={user} />;
      default:
        return (
          <div className="placeholder-view">
            <div className="placeholder-view__icon"></div>
            <h2 className="placeholder-view__title">
              {activeView.charAt(0).toUpperCase() + activeView.slice(1).replace(/([A-Z])/g, ' $1')}
            </h2>
            <p className="placeholder-view__desc">
              This module will be unlocked in upcoming phases. Stay tuned!
            </p>
            <span className="placeholder-view__badge">Coming Soon</span>
          </div>
        );
    }
  }

  return (
    <div className="dashboard-layout">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        user={user}
        onSignOut={onSignOut}
      />
      <main className="dashboard-main">
        {renderContent()}
      </main>
    </div>
  );
}

export default Dashboard;
