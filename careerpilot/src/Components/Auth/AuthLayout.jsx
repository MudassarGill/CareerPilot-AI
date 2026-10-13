import mainImage from "../../assets/main.jpg";
import BrandingPanel from "./BrandingPanel";
import AuthForm from "./AuthForm";

function AuthLayout({ onSignUp, notice, onLoginSuccess }) {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${mainImage})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-start gap-4 px-4 py-6 sm:px-6 xl:flex-row xl:justify-start xl:gap-8 xl:px-16 xl:py-4">
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