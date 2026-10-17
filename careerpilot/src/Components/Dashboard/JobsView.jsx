import { useState, useEffect } from "react";
import {
  getJobs,
  getJobMarketSummary,
  toggleSaveJob,
  applyToJob,
} from "../../services/jobs";

export default function JobsView({ onNavigate }) {
  const [jobs, setJobs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [onlySaved, setOnlySaved] = useState(false);

  // Modal / Checklist state
  const [checklistJob, setChecklistJob] = useState(null);

  const categories = ["All", "Frontend", "Backend", "AI/ML", "Full Stack", "DevOps", "Data"];
  const locationTypes = ["All", "Remote", "Hybrid", "Onsite"];

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedLocation]);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [jobsData, summaryData] = await Promise.all([
        getJobs({
          search: searchTerm,
          category: selectedCategory,
          location_type: selectedLocation,
        }),
        getJobMarketSummary().catch(() => null),
      ]);
      setJobs(jobsData || []);
      if (summaryData) setSummary(summaryData);
    } catch (err) {
      setError(err.message || "Failed to load job listings.");
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    loadData();
  }

  async function handleToggleBookmark(jobId) {
    try {
      const res = await toggleSaveJob(jobId);
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId ? { ...j, is_saved: res.is_saved } : j
        )
      );
      setSuccess(res.message);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Could not update bookmark.");
    }
  }

  async function handleApply(jobId) {
    try {
      const res = await applyToJob(jobId);
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId ? { ...j, status: "applied" } : j
        )
      );
      setSuccess(res.message);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.message || "Could not log job application.");
    }
  }

  const displayedJobs = jobs.filter((j) => {
    if (onlySaved && !j.is_saved) return false;
    return true;
  });

  return (
    <div className="module-view-root">
      {/* ── Top Header Banner ── */}
      <div className="module-header-card module-header-card--gradient">
        <div className="module-header-text">
          <h1 className="module-main-title">Job Intelligence Matcher</h1>
          <p className="module-subtitle">
            Automated position matching driven by your parsed ATS resume keywords, verified competencies,
            and real-time market demand benchmarks.
          </p>
        </div>
        <div className="module-header-actions">
          <button
            type="button"
            className="btn-header-upload"
            onClick={() => onNavigate("resume")}
          >
            Update Resume Profile
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && <div className="feedback-banner feedback-banner--error">{error}</div>}
      {success && <div className="feedback-banner feedback-banner--success">{success}</div>}

      {/* ── Market Readiness Summary Cards (Phase 5+) ── */}
      {summary && (
        <div className="jobs-summary-grid">
          <div className="job-summary-card">
            <span className="summary-card-lbl">Active Tech Openings</span>
            <div className="summary-card-num">{summary.total_jobs}</div>
            <span className="summary-card-sub">
              {summary.high_match_count} high match roles (&ge; 75%)
            </span>
          </div>

          <div className="job-summary-card">
            <span className="summary-card-lbl">Your Profile Compatibility</span>
            <div className="summary-card-num brand-orange">{summary.average_match_pct}%</div>
            <span className="summary-card-sub">Average ATS alignment across market</span>
          </div>

          <div className="job-summary-card">
            <span className="summary-card-lbl">High-Leverage Skill Gaps</span>
            <div className="missing-skills-tags">
              {summary.top_missing_skills.slice(0, 3).map((sk, i) => (
                <span key={i} className="skill-gap-alert-tag">
                  +{sk}
                </span>
              ))}
            </div>
            <span className="summary-card-sub">Adding these skills can unlock 90%+ match tiers</span>
          </div>
        </div>
      )}

      {/* ── Filter & Search Toolbar ── */}
      <div className="jobs-filter-card">
        <form className="jobs-search-row" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="jobs-search-input"
            placeholder="Search by job title, company, or technical stack (e.g., React, Python, Docker)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="btn-primary btn-search-jobs">
            Search Opportunities
          </button>
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent((searchTerm || "software developer") + " jobs")}&ibp=htl;jobs`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary btn-search-google"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none", padding: "10px 16px", borderRadius: "8px", fontWeight: "600", whiteSpace: "nowrap" }}
            title="Search directly on Google for Jobs in real-time"
          >
            <span>Google Jobs Live ↗</span>
          </a>
        </form>

        <div className="jobs-pills-row">
          <div className="pills-group">
            <span className="pills-label">Discipline:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-pill ${selectedCategory === cat ? "filter-pill--active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="pills-group">
            <span className="pills-label">Location:</span>
            {locationTypes.map((loc) => (
              <button
                key={loc}
                type="button"
                className={`filter-pill ${selectedLocation === loc ? "filter-pill--active" : ""}`}
                onClick={() => setSelectedLocation(loc)}
              >
                {loc}
              </button>
            ))}
            <button
              type="button"
              className={`filter-pill filter-pill--saved ${onlySaved ? "filter-pill--active" : ""}`}
              onClick={() => setOnlySaved((prev) => !prev)}
            >
              {onlySaved ? "Showing Bookmarks" : "Bookmarked Only"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Jobs Grid ── */}
      {loading ? (
        <div className="jobs-loading-box">
          <div className="loading-spinner" />
          <p>Calculating live ATS match scores against open market roles...</p>
        </div>
      ) : displayedJobs.length === 0 ? (
        <div className="jobs-empty-box">
          <h3>No matching job opportunities found</h3>
          <p>Try resetting filters or expanding search keywords to discover more roles.</p>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
              setSelectedLocation("All");
              setOnlySaved(false);
            }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="jobs-cards-stack">
          {displayedJobs.map((job) => {
            const isHighMatch = job.match_pct >= 75;
            return (
              <div key={job.id} className="job-card">
                <div className="job-card__header">
                  <div className="job-title-block">
                    <div className="job-meta-top">
                      {job.company_url ? (
                        <a
                          href={job.company_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="job-company-name job-company-link"
                          title={`Visit ${job.company} official careers site`}
                        >
                          {job.company} ↗
                        </a>
                      ) : (
                        <span className="job-company-name">{job.company}</span>
                      )}
                      <span className="job-location-tag">{job.location_type} &bull; {job.location}</span>
                      <span className="job-posted-tag">{job.posted_date}</span>
                    </div>
                    <h3 className="job-title-text">
                      {job.job_url ? (
                        <a
                          href={job.job_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="job-title-link"
                          title={`Open official live posting for ${job.title}`}
                        >
                          {job.title} ↗
                        </a>
                      ) : (
                        job.title
                      )}
                    </h3>
                  </div>

                  <div className="job-match-badge-wrap">
                    <div
                      className={`job-match-badge ${
                        isHighMatch ? "job-match-badge--high" : "job-match-badge--mid"
                      }`}
                    >
                      <span className="match-num">{job.match_pct}%</span>
                      <span className="match-lbl">Match Score</span>
                    </div>
                  </div>
                </div>

                <p className="job-desc-snippet">{job.description}</p>

                <div className="job-skills-breakdown">
                  <div className="skills-row">
                    <span className="skills-row-label">Matching Skills:</span>
                    <div className="skills-tags-wrap">
                      {job.matching_skills.length > 0 ? (
                        job.matching_skills.map((sk, i) => (
                          <span key={i} className="job-skill-tag job-skill-tag--matched">
                            {sk}
                          </span>
                        ))
                      ) : (
                        <span className="skill-none-text">No direct skills matched yet</span>
                      )}
                    </div>
                  </div>

                  {job.missing_skills.length > 0 && (
                    <div className="skills-row">
                      <span className="skills-row-label">Missing from Profile:</span>
                      <div className="skills-tags-wrap">
                        {job.missing_skills.map((sk, i) => (
                          <span key={i} className="job-skill-tag job-skill-tag--missing">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="job-card__footer">
                  <div className="job-footer-meta">
                    <span className="job-salary-text">{job.salary_range}</span>
                    <span className="job-exp-pill">{job.experience_level}</span>
                    {job.status === "applied" && (
                      <span className="job-applied-status">Applied</span>
                    )}
                  </div>

                  <div className="job-footer-actions">
                    {(job.job_url || job.company_url) && (
                      <a
                        href={job.job_url || job.company_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary btn-sm job-external-link"
                        title={`View actual live posting for ${job.title}`}
                      >
                        View Live Job Posting ↗
                      </a>
                    )}

                    {(job.google_jobs_url || job.job_url) && (
                      <a
                        href={job.google_jobs_url || `https://www.google.com/search?q=${encodeURIComponent(job.title + " " + job.company + " jobs")}&ibp=htl;jobs`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary btn-sm"
                        style={{ color: "#38bdf8", borderColor: "rgba(56, 189, 248, 0.3)" }}
                        title={`Search Google Jobs directly for ${job.title}`}
                      >
                        Google Jobs ↗
                      </a>
                    )}

                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() => setChecklistJob(job)}
                    >
                      Application Checklist
                    </button>

                    <button
                      type="button"
                      className="btn-secondary btn-sm"
                      onClick={() => handleToggleBookmark(job.id)}
                    >
                      {job.is_saved ? "Bookmarked" : "Save Job"}
                    </button>

                    <button
                      type="button"
                      className="btn-primary btn-sm"
                      onClick={() => handleApply(job.id)}
                      disabled={job.status === "applied"}
                    >
                      {job.status === "applied" ? "Application Logged" : "Quick Apply"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 1-Click Application Preparation Modal ── */}
      {checklistJob && (
        <div className="modal-backdrop" onClick={() => setChecklistJob(null)}>
          <div className="modal-card modal-card--lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="section-pill">Application Readiness</span>
                <h2 className="modal-title">{checklistJob.title}</h2>
                <span className="modal-subtitle">
                  {checklistJob.company} &bull; {checklistJob.match_pct}% ATS Match
                </span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setChecklistJob(null)}
              >
                &times;
              </button>
            </div>

            <div className="checklist-body">
              <div className="checklist-section">
                <h4 className="checklist-subhead">1. Tailor Resume Keywords</h4>
                <p className="checklist-desc">
                  Prioritize these key terms in your resume summary and project bullet points before submitting:
                </p>
                <div className="checklist-tags-row">
                  {checklistJob.required_skills.map((sk, i) => {
                    const isMatched = checklistJob.matching_skills.includes(sk);
                    return (
                      <span
                        key={i}
                        className={`checklist-kw-tag ${
                          isMatched ? "checklist-kw-tag--have" : "checklist-kw-tag--add"
                        }`}
                      >
                        {sk} {isMatched ? "(Found)" : "(Add)"}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="checklist-section">
                <h4 className="checklist-subhead">2. Recommended Interview Prep</h4>
                <p className="checklist-desc">
                  Expected technical topics for this position. Head to the Mock Interview studio to practice:
                </p>
                <ul className="checklist-prep-list">
                  <li>System design and architectural considerations relevant to {checklistJob.category}.</li>
                  <li>In-depth problem solving around: {checklistJob.matching_skills.slice(0, 3).join(", ") || "core technical fundamentals"}.</li>
                  <li>STAR method behavioral answers highlighting measurable metrics.</li>
                </ul>
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => {
                    setChecklistJob(null);
                    onNavigate("interview");
                  }}
                >
                  Launch Mock Interview for this Role &rarr;
                </button>
              </div>
            </div>

            <div className="modal-footer">
              {(checklistJob.job_url || checklistJob.company_url) && (
                <a
                  href={checklistJob.job_url || checklistJob.company_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ textDecoration: "none" }}
                  title="Open verified live posting on the web"
                >
                  Open Live Job Posting ↗
                </a>
              )}
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  handleApply(checklistJob.id);
                  setChecklistJob(null);
                }}
              >
                Confirm & Log Application
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setChecklistJob(null)}
              >
                Close Checklist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
