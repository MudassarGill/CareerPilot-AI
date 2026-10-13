import { useState } from "react";
import { logIn } from "../../services/auth";

function AuthForm({ onSignUp, notice, onLoginSuccess, onForgotPassword }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await logIn({ email, password });
      onLoginSuccess(response);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-[450px] rounded-2xl border border-white/30 bg-white/75 p-5 shadow-2xl sm:rounded-3xl sm:p-8">

      {/* Heading with Sweeping Color Animation */}
      <div>
        <h2 className="welcome-text text-3xl font-bold">
          Welcome Back
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Login to your CareerPilot AI account
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
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-orange-50 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Password */}
        <div className="mt-5">
          <label className="text-sm font-medium text-slate-700">
            Password
          </label>

          <div className="relative mt-2">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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

        {/* Forgot Password */}
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm font-medium text-blue-600 transition hover:text-blue-700 cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

      </form>

      {(notice || error) && (
        <p
          className={`mt-4 text-sm ${error ? "text-red-600" : "text-emerald-700"}`}
          role="status"
          aria-live="polite"
        >
          {error || notice}
        </p>
      )}

      {/* Sign Up */}
      <p className="mt-6 text-center text-sm text-slate-500">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSignUp}
          className="font-semibold text-blue-600 transition hover:text-blue-700 cursor-pointer"
        >
          Sign Up
        </button>
      </p>

    </div>
  );
}

export default AuthForm;