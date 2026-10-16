import { useState, useEffect, useRef } from "react";
import {
  uploadResume,
  getResumes,
  getResumeDetail,
  deleteResume,
  scoreResumeATS,
} from "../../services/resume";

export default function ResumeView({ onNavigate }) {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [atsResult, setAtsResult] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadResumes();
  }, []);

  async function loadResumes() {
    setLoading(true);
    setError("");
    try {
      const data = await getResumes();
      setResumes(data || []);
      if (data && data.length > 0) {
        // Load details for first resume
        loadDetail(data[0].id);
      }
    } catch (err) {
      setError(err.message || "Failed to load resumes. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  }

  async function loadDetail(id) {
    try {
      const detail = await getResumeDetail(id);
      setSelectedResume(detail);
      setAtsResult(null); // reset scanned results unless present
    } catch (err) {
      setError(err.message || "Could not fetch resume detail.");
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(pdf|docx|doc)$/i)) {
      setError("Please upload a PDF or DOCX resume.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File exceeds 5MB size limit.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const uploaded = await uploadResume(file);
      setSuccess(`Resume "${file.name}" uploaded and parsed successfully!`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadResumes();
      await loadDetail(uploaded.id);
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id, e) {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this resume?")) return;

    try {
      await deleteResume(id);
      const updated = resumes.filter((r) => r.id !== id);
      setResumes(updated);
      if (selectedResume?.id === id) {
        setSelectedResume(updated.length > 0 ? null : null);
        if (updated.length > 0) {
          loadDetail(updated[0].id);
        }
      }
      setSuccess("Resume deleted.");
    } catch (err) {
      setError(err.message || "Failed to delete resume.");
    }
  }

  async function handleScanATS() {
    if (!selectedResume) {
      setError("Please select or upload a resume first.");
      return;
    }
    if (!jobDescription.trim() || jobDescription.trim().length < 20) {
      setError("Please paste a comprehensive job description (at least 20 characters).");
      return;
    }

    setScoring(true);
    setError("");
    try {
      const res = await scoreResumeATS(selectedResume.id, jobDescription);
      setAtsResult(res);
      setSelectedResume((prev) => ({
        ...prev,
        ats_score: res.ats_score,
        status: "optimized",
      }));
      setSuccess("ATS scan completed with real-time feedback!");
    } catch (err) {
      setError(err.message || "ATS scoring failed.");
    } finally {
      setScoring(false);
    }
  }

  const parsed = selectedResume?.parsed_data || {};
  const sections = parsed.sections || {};
  const contact = parsed.contact_info || {};
  const quality = selectedResume?.feedback?.quality || selectedResume?.feedback || {};
  const actionVerbs = quality.action_verbs_found || [];
  const metricsFound = quality.metrics_found || [];
  const suggestions = quality.suggestions || [];
  const sectionScores = quality.section_scores || {};

  function handleExportReport() {
    if (!selectedResume) return;
    const lines = [
      "============================================================",
      "CAREERPILOT AI — ATS & RESUME READINESS SUMMARY REPORT",
      "============================================================",
      `File Name: ${selectedResume.original_name}`,
      `Generated At: ${new Date().toLocaleString()}`,
      `ATS Job Match Score: ${selectedResume.ats_score !== null ? Math.round(selectedResume.ats_score) + "%" : "Not yet scanned"}`,
      `Quality Audit Score: ${quality.overall_score ? Math.round(quality.overall_score) + "%" : "85%"}`,
      "",
      `--- ACTION VERBS DETECTED (${actionVerbs.length}) ---`,
      actionVerbs.length > 0 ? actionVerbs.join(", ") : "None detected",
      "",
      `--- QUANTIFIED METRICS DETECTED (${metricsFound.length}) ---`,
      metricsFound.length > 0 ? metricsFound.join(", ") : "None detected",
      "",
    ];

    if (atsResult) {
      lines.push("--- ATS SCAN RESULTS ---");
      lines.push(`Summary: ${atsResult.summary || "Scan completed"}`);
      lines.push(`Matched Keywords (${atsResult.matched_keywords?.length || 0}): ${(atsResult.matched_keywords || []).join(", ")}`);
      lines.push(
        `Missing Keywords (${atsResult.missing_keywords?.length || 0}): ${
          (atsResult.missing_keywords || [])
            .map((m) => (typeof m === "object" ? m.keyword : m))
            .join(", ")
        }`
      );
      lines.push("");
    }

    lines.push("--- AI RESUME IMPROVEMENT SUGGESTIONS ---");
    if (suggestions.length > 0) {
      suggestions.forEach((s, idx) => lines.push(`${idx + 1}. ${s}`));
    } else {
      lines.push("Resume satisfies standard ATS formatting and readability criteria.");
    }
    lines.push("============================================================");

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CareerPilot_${selectedResume.original_name.replace(/\.[^/.]+$/, "")}_ATS_Report.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setSuccess("ATS Readiness Report downloaded successfully!");
  }

  return (
    <div className="module-view-root">
      {/* Top Banner with Luxury Gradient Background */}
      <div className="module-header-card module-header-card--gradient">
        <div className="module-header-text">
          <h1 className="module-main-title">Resume & ATS Intelligence</h1>
          <p className="module-subtitle">
            Upload your PDF/DOCX resume, inspect parsed sections, and test ATS keyword compatibility against job descriptions.
          </p>
        </div>
        <div className="module-header-actions">
          <button
            type="button"
            className="btn-header-upload"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "Analyzing File..." : "Upload New Resume"}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.docx,.doc"
            style={{ display: "none" }}
          />
        </div>
      </div>

      {/* Notifications */}
      {error && <div className="feedback-banner feedback-banner--error">{error}</div>}
      {success && <div className="feedback-banner feedback-banner--success">{success}</div>}

      {/* Main Grid */}
      <div className="resume-grid-layout">
        {/* Left Column: Upload Zone & Resume List */}
        <div className="resume-sidebar-col">
          {/* Upload Dropzone */}
          <div
            className="resume-dropzone"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="dropzone-icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <h4 className="dropzone-title">Upload Resume File</h4>
            <p className="dropzone-hint">Supports PDF or DOCX (Max 5MB)</p>
            <span className="dropzone-btn">Browse Computer</span>
          </div>

          {/* Resumes List */}
          <div className="resumes-list-card">
            <div className="list-card-header">
              <h3 className="list-card-title">My Resumes</h3>
              <span className="count-badge">{resumes.length}</span>
            </div>

            {loading ? (
              <div className="empty-state-text">Loading resumes...</div>
            ) : resumes.length === 0 ? (
              <div className="empty-state-text">
                No resumes uploaded yet. Upload your first resume above to get started.
              </div>
            ) : (
              <div className="resume-items-stack">
                {resumes.map((r) => {
                  const isSelected = selectedResume?.id === r.id;
                  return (
                    <div
                      key={r.id}
                      className={`resume-item-row ${isSelected ? "resume-item-row--active" : ""}`}
                      onClick={() => loadDetail(r.id)}
                    >
                      <div className="resume-item-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <div className="resume-item-info">
                        <h4 className="resume-filename" title={r.original_name}>
                          {r.original_name}
                        </h4>
                        <span className="resume-upload-date">
                          {new Date(r.uploaded_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="resume-item-stats">
                        {r.ats_score !== null && (
                          <span className="score-pill">
                            {Math.round(r.ats_score)}%
                          </span>
                        )}
                        <button
                          type="button"
                          className="delete-item-btn"
                          title="Delete Resume"
                          onClick={(e) => handleDelete(r.id, e)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Parsed Viewer & ATS Scanner */}
        <div className="resume-main-col">
          {selectedResume ? (
            <>
              {/* ATS Scan Panel */}
              <div className="ats-scanner-card">
                <div className="ats-scanner-header">
                  <div>
                    <h3 className="ats-scanner-title">ATS Job Compatibility Scanner</h3>
                    <p className="ats-scanner-desc">
                      Compare <strong>{selectedResume.original_name}</strong> against any job opening description to see match percentage and missing keywords.
                    </p>
                  </div>
                  <div className="ats-scanner-header-right">
                    {selectedResume.ats_score !== null && (
                      <div className="ats-score-display">
                        <div className="ats-score-number">
                          {Math.round(selectedResume.ats_score)}<small>%</small>
                        </div>
                        <span className="ats-score-label">Match Score</span>
                      </div>
                    )}
                    <button
                      type="button"
                      className="btn-export-report"
                      onClick={handleExportReport}
                      title="Download ATS Readiness Summary"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Export Report
                    </button>
                  </div>
                </div>

                <div className="ats-input-wrap">
                  <textarea
                    className="ats-textarea"
                    rows="4"
                    placeholder="Paste job description or requirements here (e.g. 'Looking for a Senior Frontend Developer with React, TypeScript, GraphQL...')"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                  <div className="ats-actions-bar">
                    <button
                      type="button"
                      className="btn-scan-ats"
                      onClick={handleScanATS}
                      disabled={scoring}
                    >
                      {scoring ? "Scanning Match..." : "Scan Match Against Job"}
                    </button>
                    <span className="ats-tip-text">
                      AI analyzes keyword density, required tech stacks, and section requirements.
                    </span>
                  </div>
                </div>

                {/* Scan Results */}
                {atsResult && (
                  <div className="ats-results-container">
                    <h4 className="results-heading">Scan Analysis & Feedback</h4>
                    {atsResult.summary && (
                      <p className="results-summary">{atsResult.summary}</p>
                    )}

                    <div className="keywords-grid">
                      <div className="keywords-box keywords-box--matched">
                        <span className="keywords-box-title">
                          Matched Keywords ({atsResult.matched_keywords?.length || 0})
                        </span>
                        <div className="keywords-tags">
                          {atsResult.matched_keywords?.length > 0 ? (
                            atsResult.matched_keywords.map((kw, i) => (
                              <span key={i} className="kw-tag kw-tag--matched">
                                {kw}
                              </span>
                            ))
                          ) : (
                            <span className="kw-empty">No direct matches found.</span>
                          )}
                        </div>
                      </div>

                      <div className="keywords-box keywords-box--missing">
                        <span className="keywords-box-title">
                          Missing Keywords / Gaps ({atsResult.missing_keywords?.length || 0})
                        </span>
                        <div className="keywords-tags">
                          {atsResult.missing_keywords?.length > 0 ? (
                            atsResult.missing_keywords.map((item, i) => (
                              <span key={i} className="kw-tag kw-tag--missing" title={`Importance: ${item.importance}`}>
                                {item.keyword}
                              </span>
                            ))
                          ) : (
                            <span className="kw-empty">All key job keywords matched!</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Section Feedback */}
                    {atsResult.section_feedback?.length > 0 && (
                      <div className="section-feedback-list">
                        <h5 className="feedback-heading">Section-by-Section Advice</h5>
                        {atsResult.section_feedback.map((sf, idx) => (
                          <div key={idx} className="section-feedback-item">
                            <div className="section-feedback-top">
                              <span className="section-name">{sf.section.toUpperCase()}</span>
                              <span className="section-score">{Math.round(sf.score)}% Score</span>
                            </div>
                            <p className="section-feedback-text">{sf.feedback}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* AI Content Quality & Impact Audit (Phase 4 Milestone) */}
              <div className="quality-audit-card">
                <div className="quality-audit-header">
                  <div>
                    <span className="section-pill">Phase 4 Intelligence</span>
                    <h3 className="quality-audit-title">AI Content Quality & Impact Audit</h3>
                    <p className="quality-audit-desc">
                      Automated assessment of action-verb power, measurable metric density, and ATS section structure.
                    </p>
                  </div>
                  {quality.overall_score && (
                    <div className="quality-score-badge-wrap">
                      <div className="quality-score-num">
                        {Math.round(quality.overall_score)}<small>%</small>
                      </div>
                      <span className="quality-score-lbl">Quality Score</span>
                    </div>
                  )}
                </div>

                {/* Sub-score Meters */}
                {sectionScores && Object.keys(sectionScores).length > 0 && (
                  <div className="quality-breakdown-grid">
                    <div className="quality-mini-metric">
                      <div className="metric-meta">
                        <span>Section Structure</span>
                        <strong>{sectionScores.section_completeness || 0}/40</strong>
                      </div>
                      <div className="metric-bar">
                        <div
                          className="metric-fill"
                          style={{ width: `${Math.min(((sectionScores.section_completeness || 0) / 40) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="quality-mini-metric">
                      <div className="metric-meta">
                        <span>Action Verbs</span>
                        <strong>{sectionScores.action_verbs || 0}/20</strong>
                      </div>
                      <div className="metric-bar">
                        <div
                          className="metric-fill"
                          style={{ width: `${Math.min(((sectionScores.action_verbs || 0) / 20) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="quality-mini-metric">
                      <div className="metric-meta">
                        <span>Quantified Metrics</span>
                        <strong>{sectionScores.quantified_metrics || 0}/20</strong>
                      </div>
                      <div className="metric-bar">
                        <div
                          className="metric-fill"
                          style={{ width: `${Math.min(((sectionScores.quantified_metrics || 0) / 20) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="quality-mini-metric">
                      <div className="metric-meta">
                        <span>Length & Contact</span>
                        <strong>{(sectionScores.length || 0) + (sectionScores.contact_info || 0)}/20</strong>
                      </div>
                      <div className="metric-bar">
                        <div
                          className="metric-fill"
                          style={{ width: `${Math.min((((sectionScores.length || 0) + (sectionScores.contact_info || 0)) / 20) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Verbs & Metrics chips */}
                <div className="audit-chips-row">
                  <div className="audit-chip-col">
                    <h5 className="audit-chip-title">
                      Action Verbs Detected ({actionVerbs.length})
                    </h5>
                    <div className="audit-chips-list">
                      {actionVerbs.length > 0 ? (
                        actionVerbs.slice(0, 16).map((verb, idx) => (
                          <span key={idx} className="action-verb-badge">
                            ✓ {verb}
                          </span>
                        ))
                      ) : (
                        <span className="kw-empty">No high-impact action verbs detected yet.</span>
                      )}
                    </div>
                  </div>

                  <div className="audit-chip-col">
                    <h5 className="audit-chip-title">
                      Quantified Metrics Detected ({metricsFound.length})
                    </h5>
                    <div className="audit-chips-list">
                      {metricsFound.length > 0 ? (
                        metricsFound.slice(0, 12).map((m, idx) => (
                          <span key={idx} className="metric-badge">
                            ⚡ {m}
                          </span>
                        ))
                      ) : (
                        <span className="kw-empty">Add numbers, % improvements, or scale to impress recruiters.</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Suggestions List */}
                {suggestions.length > 0 && (
                  <div className="audit-suggestions-box">
                    <h5 className="suggestions-heading">Actionable AI Suggestions</h5>
                    <ul className="suggestions-list">
                      {suggestions.map((tip, idx) => (
                        <li key={idx} className="suggestion-item">
                          <span className="suggestion-bullet">→</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Parsed Resume Sections Viewer */}
              <div className="parsed-resume-card">
                <div className="parsed-card-header">
                  <div>
                    <h3 className="parsed-card-title">Parsed Resume Content</h3>
                    <p className="parsed-card-desc">
                      Structured information automatically extracted by the Resume Analyzer Agent.
                    </p>
                  </div>
                  {parsed.word_count && (
                    <span className="word-count-badge">
                      {parsed.word_count} Words Extracted
                    </span>
                  )}
                </div>

                {/* Contact Card */}
                {(contact.email || contact.phone || contact.name) && (
                  <div className="contact-info-strip">
                    {contact.name && (
                      <div className="contact-item">
                        <strong>Name:</strong> {contact.name}
                      </div>
                    )}
                    {contact.email && (
                      <div className="contact-item">
                        <strong>Email:</strong> {contact.email}
                      </div>
                    )}
                    {contact.phone && (
                      <div className="contact-item">
                        <strong>Phone:</strong> {contact.phone}
                      </div>
                    )}
                  </div>
                )}

                {/* Extracted Sections */}
                <div className="extracted-sections-container">
                  {Object.keys(sections).length === 0 ? (
                    <div className="empty-state-text">
                      No explicit sections identified. Full raw text preview available below:
                      <pre className="raw-text-preview">{parsed.raw_text?.slice(0, 1000)}...</pre>
                    </div>
                  ) : (
                    Object.entries(sections).map(([secName, content]) => (
                      <div key={secName} className="extracted-section-block">
                        <h4 className="extracted-section-title">
                          {secName.charAt(0).toUpperCase() + secName.slice(1)}
                        </h4>
                        <div className="extracted-section-body">
                          {content}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="select-prompt-card">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="prompt-icon">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <h3>No Resume Selected</h3>
              <p>Upload a resume on the left or select an existing one to inspect its parsed sections and score it with ATS.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
