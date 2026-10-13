import backgroundImage from "../../assets/background.jpg";
import BrandingPanel from "./BrandingPanel";
import AuthForm from "./AuthForm";

function AuthLayout({ onSignUp, notice, onLoginSuccess }) {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]"></div>

      {/* Main card container */}
      <div className="relative z-10 flex min-h-[580px] w-full max-w-5xl flex-col items-center justify-center gap-6 xl:flex-row xl:justify-center xl:gap-8">
        <BrandingPanel />

        <AuthForm
          onSignUp={onSignUp}
          notice={notice}
          onLoginSuccess={onLoginSuccess}
        />
      </div>
    </div>
  );
}

export default AuthLayout;