import { useEffect, useState } from "react";
import backgroundImage from "../../assets/background.jpg";
import navLogo from "../../assets/navlogo.jpg";

function DashboardPreview({ onSignOut }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("careerpilot_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[3px]"></div>

      <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/20 bg-slate-900/85 p-8 text-white shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <img
              src={navLogo}
              alt="CareerPilot AI"
              className="h-10 w-10 rounded-xl object-contain border border-white/20 p-1 bg-white/10"
            />
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Career<span className="text-orange-500">Pilot AI</span>
              </h1>
              <p className="text-xs text-slate-400">Phase 1: Authentication Complete</p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Authenticated
          </span>
        </div>

        {/* Content Body */}
        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Welcome, {user?.name || "Career Navigator"}! 
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              You have successfully authenticated into <span className="font-semibold text-orange-400">CareerPilot AI</span>.
            </p>
          </div>

          {/* User Details Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Registered Email:</span>
              <span className="font-medium text-white">{user?.email || "Signed In User"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">User ID / Role:</span>
              <span className="font-medium text-white">{user?.user_type || "Candidate"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Current Roadmap Status:</span>
              <span className="font-medium text-orange-400">Phase 1 Ready</span>
            </div>
          </div>

          {/* Phase 1 Notice Box */}
          <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-5 text-xs text-orange-200 leading-relaxed">
            <p className="font-semibold text-orange-300 text-sm mb-1">
               Phase 1 Milestone Achieved!
            </p>
            You are currently on Phase 1 (Authentication Phase). All login, registration, JWT session tokens, and FastAPI backend integration are fully connected and operating. Dashboard tools and AI agents will unlock in the next phase!
          </div>

          {/* Sign Out Button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onSignOut}
              className="cursor-pointer rounded-xl bg-slate-800 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 active:scale-95 border border-white/10"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPreview;
