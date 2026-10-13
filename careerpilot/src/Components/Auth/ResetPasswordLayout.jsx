import backgroundImage from "../../assets/background.jpg";
import BrandingPanel from "./BrandingPanel";
import ResetPasswordForm from "./ResetPasswordForm";

function ResetPasswordLayout({ token, onBackToLogin }) {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-start gap-4 px-4 py-6 sm:px-6 xl:flex-row xl:justify-start xl:gap-8 xl:px-16 xl:py-8">
        <BrandingPanel />

        <ResetPasswordForm token={token} onBackToLogin={onBackToLogin} />
      </div>
    </div>
  );
}

export default ResetPasswordLayout;
