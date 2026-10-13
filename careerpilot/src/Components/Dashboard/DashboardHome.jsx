import { useEffect, useState } from "react";

/* ── All box images ── */
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
import box19 from "../../assets/box-19.jpg";
import box20 from "../../assets/box-20.jpg";
import box21 from "../../assets/box-21.jpg";
import box22 from "../../assets/box-22.jpg";
import box23 from "../../assets/box-23.jpg";
import box24 from "../../assets/box-24.jpg";
import box25 from "../../assets/box-25.jpg";
import box26 from "../../assets/box-26.jpg";
import box27 from "../../assets/box-27.jpg";
import box28 from "../../assets/box-28.jpg";
import box29 from "../../assets/box-29.jpg";
import box30 from "../../assets/box-30.jpg";

import hero1 from "../../assets/hero-1.jpg";
import hero2 from "../../assets/hero-2.jpg";

/* ── Feature cards data ── */
const featureCards = [
  { image: box02, title: "Resume Builder", desc: "AI-powered resume optimization & ATS scoring", tag: "Core Tool" },
  { image: box03, title: "Mock Interviews", desc: "Practice with AI-driven interview simulations", tag: "AI Agent" },
  { image: box05, title: "Team Collaboration", desc: "Work together on career goals & projects", tag: "Social" },
  { image: box04, title: "Study Workspace", desc: "Focus-driven learning environment tools", tag: "Productivity" },
  { image: box01, title: "Success Mindset", desc: "Motivational tools & goal tracking system", tag: "Growth" },
  { image: box06, title: "Career Pathways", desc: "Explore and map your career progression", tag: "Navigation" },
];

/* ── Stats data ── */
const stats = [
  { label: "Applications", value: "24", change: "+12%", icon: "" },
  { label: "Interviews", value: "8", change: "+25%", icon: "" },
  { label: "Skills Gained", value: "15", change: "+18%", icon: "" },
  { label: "Resume Score", value: "87%", change: "+5%", icon: "" },
];

/* ── Gallery grid images ── */
const galleryImages = [
  { src: box07, label: "Career Workshop" },
  { src: box08, label: "Team Meeting" },
  { src: box09, label: "Networking Event" },
  { src: box10, label: "Coding Session" },
  { src: box11, label: "Tech Talk" },
  { src: box12, label: "Design Sprint" },
  { src: box13, label: "Brainstorming" },
  { src: box14, label: "Portfolio Review" },
  { src: box15, label: "Mentorship" },
  { src: box16, label: "Hackathon" },
  { src: box17, label: "Startup Pitch" },
  { src: box18, label: "Strategy Session" },
  { src: box19, label: "Remote Work" },
  { src: box20, label: "Leadership Talk" },
  { src: box21, label: "Innovation Lab" },
  { src: box22, label: "Skill Workshop" },
  { src: box23, label: "AI Training" },
  { src: box24, label: "Project Demo" },
  { src: box25, label: "Career Fair" },
  { src: box26, label: "Tech Conference" },
  { src: box27, label: "Creative Studio" },
  { src: box28, label: "Focus Time" },
  { src: box29, label: "Team Building" },
  { src: box30, label: "Success Story" },
];

function DashboardHome({ user }) {
  const [greeting, setGreeting] = useState("Good day");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <div className="dashboard-home">
      {/* ── Hero Banner ── */}
      <section className="dashboard-hero">
        <div className="dashboard-hero__bg">
          <img src={hero1} alt="" className="dashboard-hero__bg-img" />
          <div className="dashboard-hero__overlay" />
        </div>
        <div className="dashboard-hero__content">
          <p className="dashboard-hero__greeting">{greeting}</p>
          <h1 className="dashboard-hero__title">
            Welcome back, <span className="text-orange">{user?.name || "Career Navigator"}</span>!
          </h1>
          <p className="dashboard-hero__subtitle">
            Your AI-powered career acceleration platform is ready. Let&apos;s build your future today.
          </p>
          <div className="dashboard-hero__actions">
            <button className="btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              Upload Resume
            </button>
            <button className="btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Start Mock Interview
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats Row ── */}
      <section className="dashboard-stats">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-card__icon">{stat.icon}</div>
            <div className="stat-card__info">
              <span className="stat-card__value">{stat.value}</span>
              <span className="stat-card__label">{stat.label}</span>
            </div>
            <span className="stat-card__change">{stat.change}</span>
          </div>
        ))}
      </section>

      {/* ── Feature Cards Grid ── */}
      <section className="dashboard-section">
        <div className="dashboard-section__header">
          <h2 className="dashboard-section__title">
            <span className="text-orange">AI</span> Career Tools
          </h2>
          <p className="dashboard-section__desc">
            Explore powerful tools designed to accelerate your career journey
          </p>
        </div>

        <div className="feature-grid">
          {featureCards.map((card) => (
            <div key={card.title} className="feature-card">
              <div className="feature-card__img-wrapper">
                <img src={card.image} alt={card.title} className="feature-card__img" />
                <div className="feature-card__img-overlay" />
                <span className="feature-card__tag">{card.tag}</span>
              </div>
              <div className="feature-card__body">
                <h3 className="feature-card__title">{card.title}</h3>
                <p className="feature-card__desc">{card.desc}</p>
                <button className="feature-card__btn">
                  Explore
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Inspiration Gallery ── */}
      <section className="dashboard-section">
        <div className="dashboard-section__header">
          <h2 className="dashboard-section__title">
            Career <span className="text-orange">Inspiration</span> Gallery
          </h2>
          <p className="dashboard-section__desc">
            Curated visuals for career motivation — hover to explore
          </p>
        </div>

        <div className="gallery-grid">
          {galleryImages.map((img, i) => (
            <div key={i} className="gallery-card">
              <img src={img.src} alt={img.label} className="gallery-card__img" />
              <div className="gallery-card__overlay">
                <span className="gallery-card__label">{img.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Secondary Hero ── */}
      <section className="dashboard-cta">
        <div className="dashboard-cta__bg">
          <img src={hero2} alt="" className="dashboard-cta__bg-img" />
          <div className="dashboard-cta__overlay" />
        </div>
        <div className="dashboard-cta__content">
          <h2 className="dashboard-cta__title">
            Ready to take your career to the <span className="text-orange">next level</span>?
          </h2>
          <p className="dashboard-cta__desc">
            Start building your professional profile with AI-powered tools
          </p>
          <button className="btn-primary btn-primary--large">
            Get Started Now
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}

export default DashboardHome;
