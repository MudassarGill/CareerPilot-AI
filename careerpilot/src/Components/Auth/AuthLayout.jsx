import backgroundImage from "../../assets/background.jpg";
import BrandingPanel from "./BrandingPanel";
import AuthForm from "./AuthForm";

function AuthLayout({ onSignUp, notice, onLoginSuccess, onForgotPassword }) {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Light transparent overlay so the background image colors are clearly visible */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Main content flex layout matching original styling */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-start gap-4 px-4 py-6 sm:px-6 xl:flex-row xl:justify-start xl:gap-8 xl:px-16 xl:py-8">
        <BrandingPanel />

        <AuthForm
          onSignUp={onSignUp}
          notice={notice}
          onLoginSuccess={onLoginSuccess}
          onForgotPassword={onForgotPassword}
        />
      </div>
    </div>
  );
}

export default AuthLayout;