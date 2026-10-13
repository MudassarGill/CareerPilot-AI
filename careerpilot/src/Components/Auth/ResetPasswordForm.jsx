import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

function ResetPasswordForm({ token, onBackToLogin }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    const hasLetter = /[a-zA-Z]/.test(newPassword);
    const hasDigit = /[0-9]/.test(newPassword);
    if (!hasLetter || !hasDigit) {
      setError("Password must contain both letters and numbers.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          token,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Failed to reset password. The link may have expired.");
      }

      setSuccess(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ── Success State ── */
  if (success) {
    return (
      <div className="w-full max-w-[450px] rounded-2xl border border-white/30 bg-white/75 p-5 shadow-2xl sm:rounded-3xl sm:p-8">
        <div className="flex flex-col items-center text-center">
          {/* Success icon */}
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-slate-800">Password Reset!</h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Your password has been successfully updated. You can now log in with your new password.
          </p>

          <button
            type="button"
            onClick={onBackToLogin}
            className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] cursor-pointer"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  /* ── Form State ── */
  return (
    <div className="w-full max-w-[450px] rounded-2xl border border-white/30 bg-white/75 p-5 shadow-2xl sm:rounded-3xl sm:p-8">
      {/* Heading */}
      <div>
        <h2 className="welcome-text text-3xl font-bold">
          Reset Password
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Enter your new password below
        </p>
      </div>

      {/* Form */}
      <form className="mt-8" onSubmit={handleSubmit}>
        {/* New Password */}
        <div>
          <label className="text-sm font-medium text-slate-700">
            New Password
          </label>

          <div className="relative mt-2">
            <input
              type={showPassword ? "text" : "password"}
              name="new_password"
              autoComplete="new-password"
              minLength={8}
              required
              placeholder="Enter new password (min 8 chars, letters & digits)"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-20 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 hover:text-blue-600 cursor-pointer transition"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mt-5">
          <label className="text-sm font-medium text-slate-700">
            Confirm Password
          </label>

          <div className="relative mt-2">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirm_password"
              autoComplete="new-password"
              minLength={8}
              required
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-20 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 hover:text-blue-600 cursor-pointer transition"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-xl bg-orange-500 py-3 font-semibold text-white shadow-lg transition hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-sm text-red-600 font-medium" role="alert" aria-live="polite">
          {error}
        </p>
      )}

      {/* Back to Login */}
      <p className="mt-6 text-center text-sm text-slate-500">
        <button
          type="button"
          onClick={onBackToLogin}
          className="font-semibold text-blue-600 transition hover:text-blue-700 cursor-pointer"
        >
          Back to Login
        </button>
      </p>
    </div>
  );
}

export default ResetPasswordForm;
