import { useCallback, useState } from "react";

import AuthLayout from "./components/auth/AuthLayout";
import SignUpLayout from "./components/auth/SignUpLayout";
import StudentDashboard from "./components/dashboard/StudentDashboard";
import WelcomePage, { isWelcomeRole } from "./components/auth/WelcomePage";

function App() {
  const welcomeRole = new URLSearchParams(window.location.search).get("welcome");
  const [showSignUp, setShowSignUp] = useState(false);
  const [notice, setNotice] = useState("");
  const [hasSession, setHasSession] = useState(() =>
    Boolean(sessionStorage.getItem("fyptrack_access_token")),
  );
  const handleSignOut = useCallback(() => {
    sessionStorage.removeItem("fyptrack_access_token");
    setHasSession(false);
    setNotice("You have been signed out.");
  }, [setHasSession, setNotice]);
  const handleSessionExpired = useCallback(() => {
    sessionStorage.removeItem("fyptrack_access_token");
    setHasSession(false);
    setNotice("Your session has expired. Please log in again.");
  }, [setHasSession, setNotice]);

  if (isWelcomeRole(welcomeRole)) {
    return <WelcomePage role={welcomeRole} />;
  }

  if (hasSession) {
    return (
      <StudentDashboard
        onSignOut={handleSignOut}
        onSessionExpired={handleSessionExpired}
      />
    );
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
            if (response.user.role === "student") {
              sessionStorage.setItem("fyptrack_access_token", response.access_token);
              setNotice("");
              setHasSession(true);
              return;
            }

            setNotice(response.welcome_message);
          }}
        />
      )}
    </>
  );
}

export default App;