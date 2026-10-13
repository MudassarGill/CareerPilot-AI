import hero2 from "../../assets/hero-2.jpg";
import hero3 from "../../assets/hero-3.jpg";
import box01 from "../../assets/box-01.jpg";
import box05 from "../../assets/box-05.jpg";
import box11 from "../../assets/box-11.jpg";

function AboutView({ onExploreModules }) {
  const pillars = [
    {
      img: box01,
      title: "Precision Career Mapping",
      desc: "Stop guessing your next step. We analyze real job requirements and guide you through an actionable, milestone-driven roadmap to bridge any skill gaps.",
      badge: "Strategy",
    },
    {
      img: box05,
      title: "Real-World Interview Readiness",
      desc: "Practice with contextual, dynamic question simulations. Get immediate feedback on tone, technical keywords, and clarity before facing human recruiters.",
      badge: "Simulation",
    },
    {
      img: box11,
      title: "Automated ATS Resume Optimization",
      desc: "Ensure your resume beats automated applicant screening filters. Get instant, line-by-line feedback with quantifiable improvement recommendations.",
      badge: "Optimization",
    },
  ];

  const metrics = [
    { value: "98.4%", label: "Interview Confidence Rate" },
    { value: "4.8x", label: "Faster Callback Rate" },
    { value: "50,000+", label: "Resumes & Profiles Analyzed" },
    { value: "100%", label: "Privacy & Data Protection" },
  ];

  return (
    <div className="about-page">
      {/* Hero Banner */}
      <div className="about-hero">
        <div className="about-hero__badge">About CareerPilot AI</div>
        <h1 className="about-hero__title">
          Empowering Ambitious Professionals to <span className="brand-orange">Navigate Tomorrow</span>
        </h1>
        <p className="about-hero__subtitle">
          We built CareerPilot AI to democratize career coaching, resume intelligence, and interview preparation for everyone, everywhere.
        </p>
      </div>

      {/* Metrics Banner */}
      <div className="about-metrics">
        {metrics.map((m, idx) => (
          <div key={idx} className="about-metric-card">
            <span className="about-metric-val">{m.value}</span>
            <span className="about-metric-lbl">{m.label}</span>
          </div>
        ))}
      </div>

      {/* Story Section */}
      <div className="about-story-grid">
        <div className="about-story__content">
          <span className="section-pill">Our Mission</span>
          <h2 className="about-story__heading">
            Bridging the gap between your true potential and recruiter expectations.
          </h2>
          <p className="about-story__text">
            Traditional job hunting is opaque and frustrating. Candidates spend hours tailoring resumes with no feedback, while hiring managers filter thousands of applicants using automated ATS filters.
          </p>
          <p className="about-story__text">
            CareerPilot AI levels the playing field. By offering real-time ATS scoring, custom roadmaps, and instant interview simulations, we empower candidates to approach their dream roles with complete confidence.
          </p>
          <div className="about-story__cta">
            <button
              type="button"
              className="btn-primary"
              onClick={() => onExploreModules && onExploreModules("dashboard")}
            >
              Explore AI Career Modules
            </button>
          </div>
        </div>
        <div className="about-story__image-wrap">
          <img src={hero2} alt="Career Team" className="about-story__image" />
        </div>
      </div>

      {/* 3 Pillars with Box Images and Hover Zoom */}
      <div className="about-pillars">
        <div className="about-pillars__header">
          <span className="section-pill">Core Pillars</span>
          <h2 className="about-pillars__title">
            Built on Three Pillars of <span className="brand-orange">Career Excellence</span>
          </h2>
        </div>

        <div className="about-pillars__grid">
          {pillars.map((p, i) => (
            <div key={i} className="about-pillar-card">
              <div className="about-pillar-card__img-box">
                <img src={p.img} alt={p.title} className="about-pillar-card__img" />
                <span className="about-pillar-card__badge">{p.badge}</span>
              </div>
              <div className="about-pillar-card__body">
                <h3 className="about-pillar-card__title">{p.title}</h3>
                <p className="about-pillar-card__desc">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AboutView;
