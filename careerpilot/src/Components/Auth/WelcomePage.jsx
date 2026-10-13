const welcomeMessages = {
  student: "Welcome student",
  supervisor: "Welcome supervisor",
  coordinator: "Welcome coordinator",
};

export function isWelcomeRole(role) {
  return Object.hasOwn(welcomeMessages, role);
}

function WelcomePage({ role }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-center">
      <section>
        <p className="text-sm font-semibold uppercase text-orange-600">FYPTrack</p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900">
          {welcomeMessages[role]}
        </h1>
        <a
          href="/"
          className="mt-8 inline-block font-medium text-blue-700 hover:text-blue-900"
        >
          Back to login
        </a>
      </section>
    </main>
  );
}

export default WelcomePage;
