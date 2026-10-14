import { useEffect, useState } from "react";
import FAQSection from "./FAQSection";

/* ── Asset box & hero images ── */
import box01 from "../../assets/box-01.jpg";
import box02 from "../../assets/box-02.jpg";
import box03 from "../../assets/box-03.jpg";
import box04 from "../../assets/box-04.jpg";
import box05 from "../../assets/box-05.jpg";
import box06 from "../../assets/box-06.jpg";
import box07 from "../../assets/box-07.jpg";
import box08 from "../../assets/box-08.jpg";
import box09 from "../../assets/box-09.jpg";
import box10 from "../../assets/box-10.jpg";
import box11 from "../../assets/box-11.jpg";
import box12 from "../../assets/box-12.jpg";
import box13 from "../../assets/box-13.jpg";
import box14 from "../../assets/box-14.jpg";
import box15 from "../../assets/box-15.jpg";
import box16 from "../../assets/box-16.jpg";
import box17 from "../../assets/box-17.jpg";
import box18 from "../../assets/box-18.jpg";

/* ── 3 Highlight Stat Boxes (Hover Shadow & Styled Numbers) ── */
const highlightBoxes = [
  {
    id: 1,
    number: "87%",
    label: "ATS & Career Readiness",
    desc: "Evaluated across resume parsing, keyword density, and mock interview performance.",
    badge: "Top 10% Benchmark",
    trend: "+14% This Month",
  },
  {
    id: 2,
    number: "24",
    label: "Active Job Applications",
    desc: "Tracked across top tech roles with real-time recruiter response analytics.",
    badge: "2x Callback Rate",
    trend: "+25% Interview Prep",
  },
  {
    id: 3,
    number: "15+",
    label: "Verified Industry Skills",
    desc: "Validated competencies across target roadmaps with 4 upcoming milestones.",
    badge: "High Tech Demand",
    trend: "4 Active Badges",
  },
];

/* ── 6 Core Feature Module Cards ── */
const featureCards = [
  {
    id: "resume",
    image: box02,
    title: "Resume & ATS Analyzer",
    desc: "AI-powered parsing, keyword match against job descriptions & ATS score benchmark.",
    tag: "Core Tool",
  },
  {
    id: "roadmap",
    image: box06,
    title: "Skills & Career Roadmap",
    desc: "Dynamic skill gap analysis, personalized milestones & weekly career acceleration.",
    tag: "Strategy",
  },
  {
    id: "interview",
    image: box03,
    title: "AI Mock Interview",
    desc: "Simulate real behavioral & technical interviews with live pacing feedback.",
    tag: "AI Agent",
  },
  {
    id: "career",
    image: box05,
    title: "Career Twin Simulator",
    desc: "Simulate multi-year career paths, salary progression & promotion projections.",
    tag: "Simulation",
  },
  {
    id: "jobs",
    image: box08,
    title: "Job Intelligence Matcher",
    desc: "Automated job matching filtered by your ATS compatibility and skill readiness.",
    tag: "Smart Match",
  },
  {
    id: "roadmap",
    image: box01,
    title: "Career Readiness Score (CRS)",
    desc: "Aggregated readiness metrics across resume, skills, interview practice & learning.",
    tag: "Benchmark",
  },
];

/* ── Inspiration & Resource Cards (Box Images) ── */
const galleryBoxes = [
  { src: box04, title: "Modern Tech Stacks", category: "Skills" },
  { src: box07, title: "Career Workshops", category: "Community" },
  { src: box09, title: "System Architecture", category: "Engineering" },
  { src: box10, title: "Live Coding Practice", category: "Interviews" },
  { src: box11, title: "Product Strategy", category: "Roadmap" },
  { src: box12, title: "Design Sprint Lab", category: "Innovation" },
  { src: box13, title: "High-Growth Networking", category: "Career" },
  { src: box14, title: "Portfolio Evaluation", category: "Review" },
  { src: box15, title: "Executive Mentorship", category: "Guidance" },
  { src: box16, title: "Hackathon Prep", category: "Competency" },
  { src: box17, title: "Startup Pitch Deck", category: "Leadership" },
  { src: box18, title: "Cloud & AI Pipelines", category: "Technology" },
];

function DashboardHome({ user, onNavigate }) {
  const [greeting, setGreeting] = useState("Good day");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  function handleCardClick(id) {
    if (onNavigate) {
      onNavigate(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="dashboard-content">
      {/* ── Hero Banner ── */}
      <section className="dashboard-hero-banner">
        <div className="hero-banner__inner">
          <div className="hero-banner__text">
            <p className="hero-banner__greeting">{greeting},</p>
            <h1 className="hero-banner__title">
              Welcome back, <span className="brand-orange">{user?.name || "Career Navigator"}</span>!
            </h1>
            <p className="hero-banner__subtitle">
              Your AI-powered career roadmap, ATS resume intelligence, and interview acceleration suite are active.
            </p>

            <div className="hero-banner__actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => handleCardClick("resume")}
              >
                Upload Resume for ATS Scan
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => handleCardClick("interview")}
              >
                Start Mock Interview
              </button>
              <button
                type="button"
                className="btn-outline-orange"
                onClick={() => handleCardClick("roadmap")}
              >
                View Career Roadmap
              </button>
            </div>
          </div>

          {/* Right Hero Readiness Card — Upgraded SVG Circular Ring & Metrics Breakdown */}
          <div className="hero-banner__score-card">
            <div className="score-card__top">
              <div className="score-svg-wrap">
                <svg className="score-svg-ring" width="108" height="108" viewBox="0 0 108 108">
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ea580c" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                  {/* Background Track */}
                  <circle
                    cx="54"
                    cy="54"
                    r="44"
                    fill="none"
                    stroke="#ffedd5"
                    strokeWidth="8"
                  />
                  {/* Progress Arc: 2 * PI * 44 ≈ 276.46. For 87%, offset = 276.46 * (1 - 0.87) ≈ 35.9 */}
                  <circle
                    cx="54"
                    cy="54"
                    r="44"
                    fill="none"
                    stroke="url(#scoreGrad)"
                    strokeWidth="8"
                    strokeDasharray="276.46"
                    strokeDashoffset="35.9"
                    strokeLinecap="round"
                    transform="rotate(-90 54 54)"
                  />
                </svg>
                <div className="score-svg-inner">
                  <span className="score-svg-val">87<small>%</small></span>
                  <span className="score-svg-lbl">CRS</span>
                </div>
              </div>

              <div className="score-card__header-info">
                <div className="score-title-row">
                  <h4 className="score-card__title">Career Readiness Score</h4>
                  <span className="score-percentile-pill">Top 10%</span>
                </div>
                <p className="score-card__desc">Calculated across Resume, ATS, Skills & Mock Interviews</p>
                <div className="score-status-indicator">
                  <span className="status-dot-pulse" />
                  <span className="status-text">Strong Candidate Profile</span>
                </div>
              </div>
            </div>

            {/* Sub-metrics pill row */}
            <div className="score-breakdown-grid">
              <div className="score-sub-pill">
                <span className="score-sub-lbl">Resume</span>
                <span className="score-sub-val">92%</span>
              </div>
              <div className="score-sub-pill">
                <span className="score-sub-lbl">ATS Match</span>
                <span className="score-sub-val">88%</span>
              </div>
              <div className="score-sub-pill">
                <span className="score-sub-lbl">Skills</span>
                <span className="score-sub-val">84%</span>
              </div>
              <div className="score-sub-pill">
                <span className="score-sub-lbl">Interview</span>
                <span className="score-sub-val">85%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3 Highlight Boxes (Styled Numbers + Deep Glowing Hover Shadow) ── */}
      <section className="three-boxes-section">
        <div className="three-boxes-grid">
          {highlightBoxes.map((box) => (
            <div key={box.id} className="highlight-box-card">
              <div className="highlight-box__top">
                <span className="highlight-box__badge">{box.badge}</span>
                <span className="highlight-box__trend">{box.trend}</span>
              </div>
              <div className="highlight-box__number-wrap">
                <span className="highlight-box__number">{box.number}</span>
              </div>
              <h3 className="highlight-box__label">{box.label}</h3>
              <p className="highlight-box__desc">{box.desc}</p>
              <div className="highlight-box__glow-accent" />
            </div>
          ))}
        </div>
      </section>

      {/* ── 6 Core Feature Module Cards with Smooth Hover Zoom ── */}
      <section className="modules-section">
        <div className="section-heading">
          <div>
            <span className="section-pill">Core Modules</span>
            <h2 className="section-title">
              AI Career <span className="brand-orange">Acceleration Modules</span>
            </h2>
            <p className="section-subtitle">
              Hover over cards to explore our core tools. Click any card to open that module.
            </p>
          </div>
        </div>

        <div className="modules-grid">
          {featureCards.map((card, i) => (
            <div
              key={i}
              className="module-card"
              onClick={() => handleCardClick(card.id)}
            >
              <div className="module-card__img-wrap">
                <img src={card.image} alt={card.title} className="module-card__img" />
                <span className="module-card__tag">{card.tag}</span>
              </div>
              <div className="module-card__body">
                <h3 className="module-card__title">{card.title}</h3>
                <p className="module-card__desc">{card.desc}</p>
                <div className="module-card__footer">
                  <span className="module-card__link">
                    Explore Module →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Career Inspiration & Boxes Gallery with Hover Zoom ── */}
      <section className="gallery-section">
        <div className="section-heading">
          <div>
            <span className="section-pill">Career Inspiration</span>
            <h2 className="section-title">
              Interactive <span className="brand-orange">Career Resource Gallery</span>
            </h2>
            <p className="section-subtitle">
              Visual learning modules and industry insights — hover to zoom and explore.
            </p>
          </div>
        </div>

        <div className="gallery-grid">
          {galleryBoxes.map((box, index) => (
            <div key={index} className="gallery-box-card">
              <div className="gallery-box-card__img-wrap">
                <img src={box.src} alt={box.title} className="gallery-box-card__img" />
                <span className="gallery-box-card__cat">{box.category}</span>
              </div>
              <div className="gallery-box-card__overlay">
                <h4 className="gallery-box-card__title">{box.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ Section (Shared Feature) ── */}
      <FAQSection />

      {/* ── Secondary CTA Banner ── */}
      <section className="cta-banner">
        <div className="cta-banner__content">
          <span className="section-pill">Accelerate Your Trajectory</span>
          <h2 className="cta-banner__title">
            Take Your Tech Career to the <span className="brand-orange">Next Level</span>
          </h2>
          <p className="cta-banner__desc">
            Equip yourself with ATS optimization, roadmap guidance, and high-impact interview preparation.
          </p>
          <div className="cta-banner__actions">
            <button
              type="button"
              className="btn-primary"
              onClick={() => handleCardClick("resume")}
            >
              Get Started with Resume ATS
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => handleCardClick("about")}
            >
              Learn More About CareerPilot
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardHome;
