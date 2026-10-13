import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

function ForgotPasswordForm({ onBackToLogin }) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Something went wrong. Please try again.");
      }

      setSent(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ── Success State ── */
  if (sent) {
    return (
      <div className="w-full max-w-[450px] rounded-2xl border border-white/30 bg-white/75 p-5 shadow-2xl sm:rounded-3xl sm:p-8">
        <div className="flex flex-col items-center text-center">
          {/* Email sent icon */}
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-slate-800">Check Your Email</h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            If an account with <span className="font-semibold text-slate-700">{email}</span> exists, we&apos;ve sent a password reset link. Check your inbox (and spam folder).
          </p>

          <div className="mt-5 w-full rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700 leading-relaxed">
            <strong>🔧 Dev Mode:</strong> Since emails are mocked, check your <span className="font-semibold">backend terminal</span> for the reset link.
          </div>

          <button
            type="button"
            onClick={onBackToLogin}
            className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] cursor-pointer"
          >
            Back to Login
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
          Forgot Password
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      {/* Form */}
      <form className="mt-8" onSubmit={handleSubmit}>
        {/* Email */}
        <div>
          <label className="text-sm font-medium text-slate-700">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="Enter your registered email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-xl bg-orange-500 py-3 font-semibold text-white shadow-lg transition hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      {error && (
        <p className="mt-4 text-sm text-red-600 font-medium" role="alert" aria-live="polite">
          {error}
        </p>
      )}

      {/* Back to Login */}
      <p className="mt-6 text-center text-sm text-slate-500">
        Remember your password?{" "}
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

export default ForgotPasswordForm;
