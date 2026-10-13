import box02 from "../../assets/box-02.jpg";
import box03 from "../../assets/box-03.jpg";
import box05 from "../../assets/box-05.jpg";
import box06 from "../../assets/box-06.jpg";
import box08 from "../../assets/box-08.jpg";

const moduleConfigs = {
  resume: {
    phase: "Phase 4",
    title: "Resume & ATS Analyzer",
    tagline: "Upload PDF or DOCX, get parsed insights and rule-based ATS benchmark score.",
    img: box02,
    features: [
      "Upload resume files (PDF, DOCX up to 5MB)",
      "Automated section parser (Education, Experience, Skills)",
      "ATS Keyword match score against job descriptions",
      "Action-verb & quantified metric suggestions",
      "Downloadable ATS readiness summary report",
    ],
    status: "In Active Development (Phase 4)",
  },
  roadmap: {
    phase: "Phase 5",
    title: "Skills & Career Roadmap",
    tagline: "Interactive skill editor, gap analysis, and tailored step-by-step career milestones.",
    img: box06,
    features: [
      "Catalog of 200+ industry verified skills",
      "Target role gap analysis (Front-End, Back-End, AI, DevOps)",
      "Career Readiness Score (Resume 20, ATS 25, Skill Gap 25, Interview 20, Learning 10)",
      "Weekly milestone completion tracker",
      "Interactive learning resource recommendations",
    ],
    status: "Scheduled for Phase 5",
  },
  interview: {
    phase: "Phase 6",
    title: "AI Mock Interview Simulator",
    tagline: "Practice text, audio, and video interviews with dynamic situational questions.",
    img: box03,
    features: [
      "Comprehensive question bank across 30+ tech specializations",
      "Real-time audio & video recording (with full consent)",
      "Answer evaluation for clarity, keywords, and pacing",
      "Confidence metrics & body language telemetry",
      "30-day recording retention with privacy cleanup",
    ],
    status: "Scheduled for Phase 6",
  },
  career: {
    phase: "Phase 7",
    title: "Career Twin & Simulation",
    tagline: "Simulate your future trajectory, salary progressions, and career milestones.",
    img: box05,
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
    img: box08,
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
    img: box02,
    features: ["Integration with CareerPilot AI core engine", "Personalized recommendations"],
    status: "Coming Soon",
  };

  return (
    <div className="placeholder-container">
      <div className="placeholder-card">
        <div className="placeholder-image-wrap">
          <img src={config.img} alt={config.title} className="placeholder-img" />
          <span className="placeholder-phase-badge">{config.phase}</span>
        </div>

        <div className="placeholder-content">
          <span className="section-pill">{config.status}</span>
          <h1 className="placeholder-title">{config.title}</h1>
          <p className="placeholder-tagline">{config.tagline}</p>

          <div className="placeholder-features">
            <h4 className="placeholder-features__heading">Planned Capabilities for this Module:</h4>
            <ul className="placeholder-checklist">
              {config.features.map((feat, i) => (
                <li key={i} className="placeholder-check-item">
                  <span className="check-icon">✓</span>
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
              ← Back to Main Dashboard
            </button>
            <span className="placeholder-note">
              Phase 1 (Auth), Phase 2 (Dashboard & Navbar), and Phase 3 (Shared Features) are live!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModulePlaceholder;
