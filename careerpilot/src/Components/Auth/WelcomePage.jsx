const welcomeMessages = {
  candidate: "Welcome, Candidate",
  student: "Welcome, Student",
  recruiter: "Welcome, Recruiter",
  admin: "Welcome, Administrator",
};

export function isWelcomeRole(role) {
  return role && Object.hasOwn(welcomeMessages, role);
}

function WelcomePage({ role }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 px-6 text-center text-white">
      <section className="rounded-2xl border border-white/20 bg-slate-800/80 p-8 shadow-2xl backdrop-blur-md max-w-md w-full">
        <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
          CareerPilot AI
        </p>
        <h1 className="mt-4 text-3xl font-bold text-white">
          {welcomeMessages[role] || "Welcome to CareerPilot AI"}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Your AI-powered career co-pilot is ready to navigate your journey.
        </p>
        <a
          href="/"
          className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Back to login
        </a>
      </section>
    </main>
  );
}

export default WelcomePage;
