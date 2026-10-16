const moduleConfigs = {
  resume: {
    phase: "Phase 4",
    title: "Resume & ATS Analyzer",
    tagline: "Upload PDF or DOCX, get parsed insights and rule-based ATS benchmark score.",
    features: [
      "Upload resume files (PDF, DOCX up to 5MB)",
      "Automated section parser (Education, Experience, Skills)",
      "ATS Keyword match score against job descriptions",
      "Action-verb & quantified metric suggestions",
      "Downloadable ATS readiness summary report",
    ],
    status: "Live & Fully Operational (Phase 4)",
  },
  roadmap: {
    phase: "Phase 5",
    title: "Skills & Career Roadmap",
    tagline: "Interactive skill editor, gap analysis, and tailored step-by-step career milestones.",
    features: [
      "Catalog of 200+ industry verified skills",
      "Target role gap analysis (Front-End, Back-End, AI, DevOps)",
      "Career Readiness Score (Resume 25, ATS 25, Skill Gap 30, Learning 20)",
      "Weekly milestone completion tracker",
      "Interactive learning resource recommendations",
    ],
    status: "Live & Active (Phase 5)",
  },
  interview: {
    phase: "Phase 6",
    title: "AI Mock Interview Simulator",
    tagline: "Practice text, audio, and video interviews with dynamic situational questions.",
    features: [
      "Comprehensive question bank across 30+ tech specializations",
      "Real-time audio & video recording (with full consent)",
      "Answer evaluation for clarity, keywords, and pacing",
      "Confidence metrics & body language telemetry",
      "30-day recording retention with privacy cleanup",
    ],
    status: "Live & Fully Operational (Phase 6)",
  },
  career: {
    phase: "Phase 7",
    title: "Career Twin & Simulation",
    tagline: "Simulate your future trajectory, salary progressions, and career milestones.",
    features: [
      "Rule-based projection engine for 1 to 5 year timelines",
      "Salary benchmark curves by geographic region & skill stack",
      "Promotion probability based on acquired certifications",
      "Save and compare multiple 'what-if' career scenarios",
      "Exportable career strategy PDF reports",
    ],
    status: "Scheduled for Phase 7",
  },
  jobs: {
    phase: "Phase 5+",
    title: "Job Intelligence Matcher",
    tagline: "Match your ATS profile with live high-growth tech positions.",
    features: [
      "Automated match % based on your parsed resume",
      "Missing keyword alerts before submitting application",
      "Remote, hybrid, and onsite filter criteria",
      "One-click application preparation checklist",
      "Company culture and salary transparency ratings",
    ],
    status: "Coming Soon with Phase 5",
  },
};

function ModulePlaceholder({ moduleId, onBackToDashboard }) {
  const config = moduleConfigs[moduleId] || {
    phase: "Next Phase",
    title: "Upcoming Career Module",
    tagline: "This feature module is currently under development.",
    features: ["Integration with CareerPilot AI core engine", "Personalized recommendations"],
    status: "Coming Soon",
  };

  return (
    <div className="placeholder-container">
      <div className="placeholder-card">
        {/* Sleek Gradient Header Badge - No external images */}
        <div className="placeholder-top-banner">
          <span className="placeholder-phase-badge">{config.phase}</span>
          <span className="section-pill">{config.status}</span>
        </div>

        <div className="placeholder-content">
          <h1 className="placeholder-title">{config.title}</h1>
          <p className="placeholder-tagline">{config.tagline}</p>

          <div className="placeholder-features">
            <h4 className="placeholder-features__heading">Planned Capabilities for this Module:</h4>
            <ul className="placeholder-checklist">
              {config.features.map((feat, i) => (
                <li key={i} className="placeholder-check-item">
                  <span className="check-icon-svg">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="placeholder-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={onBackToDashboard}
            >
              Back to Main Dashboard
            </button>
            <span className="placeholder-note">
              Phase 1 (Auth), Phase 2 (Dashboard & Navbar), Phase 3 (Shared Features), Phase 4 (Resume), Phase 5 (Skills & Roadmap), and Phase 6 (Mock Interview) are live!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModulePlaceholder;
