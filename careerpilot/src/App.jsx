import { useCallback, useState } from "react";
import "./App.css";

import AuthLayout from "./Components/Auth/AuthLayout";
import SignUpLayout from "./Components/Auth/SignUpLayout";
import DashboardPreview from "./Components/Auth/DashboardPreview";
import WelcomePage, { isWelcomeRole } from "./Components/Auth/WelcomePage";

function App() {
  const welcomeRole = new URLSearchParams(window.location.search).get("welcome");
  const [showSignUp, setShowSignUp] = useState(false);
  const [notice, setNotice] = useState("");
  const [hasSession, setHasSession] = useState(() =>
    Boolean(sessionStorage.getItem("careerpilot_access_token"))
  );

  const handleSignOut = useCallback(() => {
    sessionStorage.removeItem("careerpilot_access_token");
    sessionStorage.removeItem("careerpilot_user");
    setHasSession(false);
    setNotice("You have been signed out successfully.");
  }, []);

  if (isWelcomeRole(welcomeRole)) {
    return <WelcomePage role={welcomeRole} />;
  }

  if (hasSession) {
    return <DashboardPreview onSignOut={handleSignOut} />;
  }

  return (
    <>
      {showSignUp ? (
        <SignUpLayout
          onBackToLogin={() => setShowSignUp(false)}
          onRegistered={(message) => {
            setNotice(message);
            setShowSignUp(false);
          }}
        />
      ) : (
        <AuthLayout
          onSignUp={() => {
            setNotice("");
            setShowSignUp(true);
          }}
          notice={notice}
          onLoginSuccess={(response) => {
            if (response.access_token) {
              sessionStorage.setItem("careerpilot_access_token", response.access_token);
              if (response.user) {
                sessionStorage.setItem("careerpilot_user", JSON.stringify(response.user));
              }
              setNotice("");
              setHasSession(true);
            }
          }}
        />
      )}
    </>
  );
}

export default App;