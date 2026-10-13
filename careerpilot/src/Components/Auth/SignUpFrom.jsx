import { useState } from "react";
import { signUp } from "../../services/auth";

function SignUpForm({ onBackToLogin, onRegistered }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await signUp({ full_name: fullName, email, password });
      onRegistered(response.message);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-[450px] rounded-2xl border border-white/30 bg-white/75 p-5 shadow-2xl sm:rounded-3xl sm:p-8">

      {/* Heading */}
      <div>
        <h2 className="welcome-text text-3xl font-bold">
          Create Account
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Create your CareerPilot AI account
        </p>
      </div>

      {/* Form */}
      <form className="mt-8" onSubmit={handleSubmit}>

        {/* Full Name */}
        <div>
          <label className="text-sm font-medium text-slate-700">
            Full Name
          </label>

          <input
            type="text"
            name="full_name"
            autoComplete="name"
            required
            placeholder="Enter your full name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Email */}
        <div className="mt-5">
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
            className="mt-2 w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
              autoComplete="new-password"
              minLength={8}
              required
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 pr-20 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-xs font-medium text-slate-500 transition hover:text-blue-600"
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
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white/80 px-4 py-3 pr-20 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-xs font-medium text-slate-500 transition hover:text-blue-600"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Create Account Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>

      </form>

      {error && (
        <p className="mt-4 text-sm text-red-600" role="alert" aria-live="polite">
          {error}
        </p>
      )}

      {/* Login */}
      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onBackToLogin}
          className="font-semibold text-blue-600 transition hover:text-blue-700 cursor-pointer"
        >
          Login
        </button>
      </p>

    </div>
  );
}

export default SignUpForm;