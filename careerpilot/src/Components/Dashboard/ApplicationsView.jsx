// ============================================================
// CareerPilot AI — Application Tracker & Kanban Pipeline (Phase 8)
// ============================================================

import React, { useState, useEffect } from "react";
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
  generateCoverLetter,
} from "../../services/applications";

const STAGES = [
  { id: "wishlist", label: "Wishlist", color: "#64748b" },
  { id: "applied", label: "Applied", color: "#2563eb" },
  { id: "interviewing", label: "Interviewing", color: "#ea580c" },
  { id: "offer", label: "Offer", color: "#16a34a" },
  { id: "rejected", label: "Archived", color: "#94a3b8" },
];

export default function ApplicationsView({ onNavigate }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // New application modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newLocation, setNewLocation] = useState("Remote");
  const [newSalary, setNewSalary] = useState("");
  const [newJobUrl, setNewJobUrl] = useState("");
  const [newStage, setNewStage] = useState("wishlist");

  // Cover Letter Generator modal
  const [showLetterModal, setShowLetterModal] = useState(false);
  const [targetApp, setTargetApp] = useState(null);
  const [letterTone, setLetterTone] = useState("Professional");
  const [generatingLetter, setGeneratingLetter] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    setLoading(true);
    setError(null);
    try {
      const data = await getApplications();
      setApplications(data || []);
    } catch (err) {
      setError(err.message || "Failed to load application tracker pipeline.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!newTitle.trim() || !newCompany.trim()) {
      setError("Job title and company name are required.");
      return;
    }
    try {
      const created = await createApplication({
        job_title: newTitle.trim(),
        company_name: newCompany.trim(),
        location: newLocation.trim() || "Remote",
        salary_range: newSalary.trim() || "Market Competitive",
        status: newStage,
        job_url: newJobUrl.trim() || null,
      });
      setApplications((prev) => [created, ...prev]);
      setShowAddModal(false);
      setNewTitle("");
      setNewCompany("");
      setNewSalary("");
      setNewJobUrl("");
      setSuccess(`Application for ${created.job_title} logged successfully.`);
      setTimeout(() => setSuccess(null), 3500);
    } catch (err) {
      setError(err.message || "Failed to add application.");
    }
  }

  async function handleStageChange(appId, newStatus) {
    try {
      const updated = await updateApplication(appId, { status: newStatus });
      setApplications((prev) =>
        prev.map((item) => (item.id === appId ? updated : item))
      );
      setSuccess(`Moved to ${newStatus.toUpperCase()}`);
      setTimeout(() => setSuccess(null), 2500);
    } catch (err) {
      setError(err.message || "Failed to update status.");
    }
  }

  async function handleDelete(appId) {
    if (!window.confirm("Remove this application from tracker?")) return;
    try {
      await deleteApplication(appId);
      setApplications((prev) => prev.filter((item) => item.id !== appId));
      setSuccess("Application removed.");
      setTimeout(() => setSuccess(null), 2500);
    } catch (err) {
      setError(err.message || "Failed to delete application.");
    }
  }

  async function handleGenerateCoverLetter() {
    if (!targetApp) return;
    setGeneratingLetter(true);
    setError(null);
    try {
      const res = await generateCoverLetter({
        job_title: targetApp.job_title,
        company_name: targetApp.company_name,
        tone: letterTone,
      });
      setGeneratedLetter(res.cover_letter);
    } catch (err) {
      setError(err.message || "Failed to generate cover letter.");
    } finally {
      setGeneratingLetter(false);
    }
  }

  function handleCopyLetter() {
    if (!generatedLetter) return;
    navigator.clipboard.writeText(generatedLetter);
    setSuccess("Cover letter copied to clipboard!");
    setTimeout(() => setSuccess(null), 3000);
  }

  return (
    <div className="module-view-root">
      {/* ── Header Card ── */}
      <div className="module-header-card module-header-card--gradient">
        <div className="module-header-text">
          <h1 className="module-main-title">Application Pipeline & Tracker</h1>
          <p className="module-subtitle">
            Manage your end-to-end recruitment pipeline with Kanban status stages, direct posting
            deep-links, and 1-click tailored cover letter generation.
          </p>
        </div>
        <div className="module-header-actions">
          <button
            type="button"
            className="btn-header-upload"
            onClick={() => setShowAddModal(true)}
          >
            Add Tracked Application
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && <div className="feedback-banner feedback-banner--error">{error}</div>}
      {success && <div className="feedback-banner feedback-banner--success">{success}</div>}

      {/* ── KPI Metrics Bar ── */}
      <div className="twin-kpi-grid">
        <div className="twin-kpi-card">
          <span className="kpi-label">Active Opportunities</span>
          <div className="kpi-number">{applications.length}</div>
          <span className="kpi-sub">Total tracked positions</span>
        </div>
        <div className="twin-kpi-card">
          <span className="kpi-label">In Technical Review</span>
          <div className="kpi-number brand-orange">
            {applications.filter((a) => a.status === "interviewing").length}
          </div>
          <span className="kpi-sub">Active interview rounds</span>
        </div>
        <div className="twin-kpi-card">
          <span className="kpi-label">Offers & Milestones</span>
          <div className="kpi-number" style={{ color: "#16a34a" }}>
            {applications.filter((a) => a.status === "offer").length}
          </div>
          <span className="kpi-sub">Accepted / offer stages</span>
        </div>
      </div>

      {/* ── Kanban Board ── */}
      {loading ? (
        <div className="twin-loading-box">
          <div className="loading-spinner" />
          <p>Loading application pipeline...</p>
        </div>
      ) : (
        <div className="kanban-board-container">
          <div className="kanban-columns-grid">
            {STAGES.map((stg) => {
              const stageApps = applications.filter((a) => a.status === stg.id);
              return (
                <div key={stg.id} className="kanban-column">
                  <div className="kanban-column-header">
                    <div className="column-title-wrap">
                      <span
                        className="stage-dot"
                        style={{ background: stg.color }}
                      />
                      <h3 className="column-title">{stg.label}</h3>
                    </div>
                    <span className="column-count-badge">{stageApps.length}</span>
                  </div>

                  <div className="kanban-cards-stack">
                    {stageApps.length === 0 ? (
                      <div className="kanban-empty-dropzone">
                        <span>No positions in {stg.label}</span>
                      </div>
                    ) : (
                      stageApps.map((app) => (
                        <div key={app.id} className="kanban-card">
                          <div className="kanban-card-top">
                            <span className="kanban-company-tag">
                              {app.company_name}
                            </span>
                            <span className="kanban-date-tag">
                              {app.applied_date}
                            </span>
                          </div>

                          <h4 className="kanban-card-title">
                            {app.job_url ? (
                              <a
                                href={app.job_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="job-title-link"
                                title="Open verified live job posting"
                              >
                                {app.job_title} ↗
                              </a>
                            ) : (
                              app.job_title
                            )}
                          </h4>

                          <div className="kanban-meta-row">
                            <span className="kanban-meta-pill">
                              {app.location}
                            </span>
                            <span className="kanban-meta-pill">
                              {app.salary_range}
                            </span>
                          </div>

                          {app.notes && (
                            <p className="kanban-notes-snippet">{app.notes}</p>
                          )}

                          <div className="kanban-card-actions">
                            <select
                              className="kanban-stage-selector"
                              value={app.status}
                              onChange={(e) =>
                                handleStageChange(app.id, e.target.value)
                              }
                            >
                              {STAGES.map((s) => (
                                <option key={s.id} value={s.id}>
                                  Move: {s.label}
                                </option>
                              ))}
                            </select>

                            <button
                              type="button"
                              className="btn-secondary btn-sm"
                              onClick={() => {
                                setTargetApp(app);
                                setGeneratedLetter("");
                                setShowLetterModal(true);
                              }}
                              title="Generate tailored cover letter"
                            >
                              Cover Letter
                            </button>

                            <button
                              type="button"
                              className="btn-danger-sm"
                              onClick={() => handleDelete(app.id)}
                              title="Delete application"
                            >
                              &times;
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Modal: Add Application ── */}
      {showAddModal && (
        <div className="checklist-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="checklist-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Track New Application</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowAddModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="checklist-body">
                <div className="config-group" style={{ marginBottom: "12px" }}>
                  <label className="config-label">Target Role / Title *</label>
                  <input
                    type="text"
                    className="config-select"
                    placeholder="e.g. Senior Backend Engineer"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="config-group" style={{ marginBottom: "12px" }}>
                  <label className="config-label">Company Name *</label>
                  <input
                    type="text"
                    className="config-select"
                    placeholder="e.g. Anthropic Partner Network"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    required
                  />
                </div>

                <div className="config-grid" style={{ marginBottom: "12px" }}>
                  <div className="config-group">
                    <label className="config-label">Workplace Model</label>
                    <select
                      className="config-select"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Onsite">Onsite</option>
                    </select>
                  </div>
                  <div className="config-group">
                    <label className="config-label">Initial Stage</label>
                    <select
                      className="config-select"
                      value={newStage}
                      onChange={(e) => setNewStage(e.target.value)}
                    >
                      {STAGES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="config-group" style={{ marginBottom: "12px" }}>
                  <label className="config-label">Salary Range (Optional)</label>
                  <input
                    type="text"
                    className="config-select"
                    placeholder="e.g. $140,000 - $170,000"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                  />
                </div>

                <div className="config-group">
                  <label className="config-label">Direct Job Posting Link (Optional)</label>
                  <input
                    type="url"
                    className="config-select"
                    placeholder="https://www.linkedin.com/jobs/..."
                    value={newJobUrl}
                    onChange={(e) => setNewJobUrl(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn-primary">
                  Save to Pipeline
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Cover Letter Generator ── */}
      {showLetterModal && targetApp && (
        <div className="checklist-modal-backdrop" onClick={() => setShowLetterModal(false)}>
          <div className="checklist-modal checklist-modal--wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                Cover Letter Generator: {targetApp.job_title}
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowLetterModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="checklist-body">
              <div className="config-grid" style={{ marginBottom: "16px" }}>
                <div className="config-group">
                  <label className="config-label">Tone & Voice</label>
                  <select
                    className="config-select"
                    value={letterTone}
                    onChange={(e) => setLetterTone(e.target.value)}
                  >
                    <option value="Professional">Professional & Structured</option>
                    <option value="Enthusiastic">Enthusiastic & High-Energy</option>
                    <option value="Executive">Executive & Strategic</option>
                  </select>
                </div>
                <div className="config-group config-group--action">
                  <button
                    type="button"
                    className="btn-primary btn-run-sim"
                    onClick={handleGenerateCoverLetter}
                    disabled={generatingLetter}
                  >
                    {generatingLetter ? "Generating Cover Letter..." : "Generate Tailored Letter"}
                  </button>
                </div>
              </div>

              {generatedLetter ? (
                <div className="cover-letter-preview-box">
                  <textarea
                    className="cover-letter-textarea"
                    rows={14}
                    value={generatedLetter}
                    onChange={(e) => setGeneratedLetter(e.target.value)}
                  />
                </div>
              ) : (
                <div className="cover-letter-placeholder">
                  <p>
                    Click &ldquo;Generate Tailored Letter&rdquo; to craft an impactful cover letter
                    tailored to {targetApp.company_name} utilizing your verified competencies.
                  </p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              {generatedLetter && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCopyLetter}
                >
                  Copy Cover Letter
                </button>
              )}
              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowLetterModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
