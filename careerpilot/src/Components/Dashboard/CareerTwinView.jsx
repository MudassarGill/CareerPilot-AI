import { useState, useEffect } from "react";
import {
  simulateCareerTwin,
  getLatestSimulation,
} from "../../services/careerTwin";

export default function CareerTwinView({ onNavigate }) {
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Configuration form state
  const [targetRole, setTargetRole] = useState("Frontend Developer");
  const [region, setRegion] = useState("US Remote");
  const [ambitionLevel, setAmbitionLevel] = useState("accelerated");
  const [yearsExperience, setYearsExperience] = useState(2);

  const rolesList = [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "AI/ML Engineer",
    "DevOps Engineer",
    "Data Analyst",
    "Data Engineer",
    "Mobile Developer",
    "Cloud Architect",
    "Cybersecurity Engineer",
    "QA / Test Engineer",
    "Game Developer",
    "Blockchain Developer",
    "Embedded Systems Engineer",
    "iOS Developer",
    "Android Developer",
    "Site Reliability Engineer",
  ];

  const regionsList = [
    "US Remote",
    "US Tech Hubs (SF / NYC)",
    "Europe / UK",
    "Global Remote",
  ];

  const ambitionPaces = [
    { id: "steady", label: "Steady Progression (Standard Pace)" },
    { id: "accelerated", label: "Accelerated High-Growth (High Velocity)" },
    { id: "executive", label: "Executive Leadership Track (Architect & Mgmt)" },
  ];

  useEffect(() => {
    loadInitialSimulation();
  }, []);

  async function loadInitialSimulation() {
    setLoading(true);
    setError("");
    try {
      const data = await getLatestSimulation();
      setSimulation(data);
      if (data) {
        setTargetRole(data.target_role || "Frontend Developer");
        setRegion(data.region || "US Remote");
        setAmbitionLevel((data.ambition_level || "accelerated").toLowerCase());
      }
    } catch (err) {
      setError(err.message || "Failed to load career simulation.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRunSimulation() {
    setSimulating(true);
    setError("");
    try {
      const data = await simulateCareerTwin({
        target_role: targetRole,
        region,
        ambition_level: ambitionLevel,
        years_experience: Number(yearsExperience),
      });
      setSimulation(data);
      setSuccess(`Career simulation recalculated for ${data.target_role} (${data.region})!`);
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.message || "Simulation failed. Please try again.");
    } finally {
      setSimulating(false);
    }
  }

  function handleExportPDF() {
    if (!simulation) return;

    const horizonsHtml = (simulation.horizons || [])
      .map(
        (h) => `
        <div class="pdf-card">
          <div class="pdf-card-header">
            <span class="pdf-badge">Year ${h.year} Horizon &bull; ${h.promotion_probability}% Promotion Probability</span>
            <span class="pdf-salary">${h.salary_range}</span>
          </div>
          <div class="pdf-role">${h.title}</div>
          <p class="pdf-milestone"><strong>Primary Milestone:</strong> ${h.primary_milestone}</p>
          <div class="pdf-skills">
            <strong>Required Competencies:</strong>
            ${(h.recommended_skills || []).map((s) => `<span class="pdf-skill">${s}</span>`).join(" ")}
          </div>
        </div>
      `
      )
      .join("");

    const scenariosHtml = (simulation.what_if_scenarios || [])
      .map(
        (sc) => `
        <div class="pdf-scenario">
          <div class="pdf-sc-title">${sc.track_name} (${sc.transition_difficulty})</div>
          <div class="pdf-sc-desc">${sc.track_desc}</div>
          <div class="pdf-sc-meta">
            <div><strong>Year 5 Title:</strong> ${sc.year_5_role}</div>
            <div><strong>Year 5 Target Salary:</strong> ${sc.year_5_salary}</div>
            <div><strong>Cumulative 5-Year Earnings:</strong> ${sc.cumulative_5yr_earnings}</div>
          </div>
        </div>
      `
      )
      .join("");

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>CareerPilot AI - Career Twin Strategy Report</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; line-height: 1.5; font-size: 13px; }
          .header { border-bottom: 2px solid #ea580c; padding-bottom: 12px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: flex-end; }
          .title { font-size: 22px; font-weight: 800; margin: 0 0 4px 0; color: #0f172a; }
          .sub { color: #64748b; font-size: 12px; margin: 0; text-transform: uppercase; }
          .summary-grid { display: flex; gap: 14px; margin-bottom: 20px; }
          .summary-box { flex: 1; background: #fffaf5; border: 1px solid #fed7aa; border-radius: 6px; padding: 12px; }
          .summary-val { font-size: 20px; font-weight: 800; color: #ea580c; line-height: 1.1; margin-top: 4px; }
          .summary-lbl { font-size: 10px; text-transform: uppercase; color: #7c2d12; font-weight: 700; }
          .sec-head { font-size: 15px; font-weight: 800; margin: 18px 0 10px 0; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; color: #0f172a; }
          .pdf-card { background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px 16px; margin-bottom: 12px; page-break-inside: avoid; }
          .pdf-card-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
          .pdf-badge { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #ea580c; }
          .pdf-salary { font-weight: 800; color: #166534; font-size: 13px; }
          .pdf-role { font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
          .pdf-milestone { margin: 4px 0 8px 0; font-size: 12px; color: #334155; }
          .pdf-skill { display: inline-block; background: #f1f5f9; border: 1px solid #cbd5e1; padding: 1px 6px; border-radius: 4px; font-size: 10px; margin-right: 4px; }
          .pdf-scenario { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-bottom: 10px; page-break-inside: avoid; }
          .pdf-sc-title { font-weight: 800; font-size: 13px; color: #0f172a; margin-bottom: 2px; }
          .pdf-sc-desc { font-size: 11px; color: #64748b; margin-bottom: 6px; }
          .pdf-sc-meta { display: flex; justify-content: space-between; font-size: 11px; color: #334155; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">CareerPilot AI</h1>
            <p class="sub">Career Twin & Multi-Year Projection Strategy Report</p>
          </div>
          <div>
            <div><strong>Role:</strong> ${simulation.target_role}</div>
            <div><strong>Market:</strong> ${simulation.region}</div>
            <div><strong>Simulated:</strong> ${simulation.simulated_at}</div>
          </div>
        </div>

        <div class="summary-grid">
          <div class="summary-box">
            <div class="summary-lbl">Current Market Baseline</div>
            <div class="summary-val">${simulation.current_market_worth}</div>
          </div>
          <div class="summary-box">
            <div class="summary-lbl">Year 5 Target Earning</div>
            <div class="summary-val">${simulation.projected_5yr_worth}</div>
          </div>
          <div class="summary-box">
            <div class="summary-lbl">Cumulative 5-Year Potential</div>
            <div class="summary-val">${simulation.cumulative_5yr_earnings}</div>
          </div>
        </div>

        <div class="sec-head">1yr / 3yr / 5yr Horizon Progression</div>
        ${horizonsHtml}

        <div class="sec-head">What-If Career Track Comparisons</div>
        ${scenariosHtml}
      </body>
      </html>
    `;

    const printWin = window.open("", "_blank");
    if (printWin) {
      printWin.document.open();
      printWin.document.write(htmlContent);
      printWin.document.close();
      printWin.focus();
      setTimeout(() => printWin.print(), 300);
      setSuccess("Opening printable PDF preview dialog for Career Twin Strategy!");
    }
  }

  // Calculate highest compensation on the curve for chart scaling
  const maxComp = simulation?.salary_curve?.reduce(
    (max, item) => Math.max(max, item.total_comp),
    200000
  ) || 250000;

  return (
    <div className="module-view-root">
      {/* ── Top Header Banner ── */}
      <div className="module-header-card module-header-card--gradient">
        <div className="module-header-text">
          <h1 className="module-main-title">Career Twin & Simulation</h1>
          <p className="module-subtitle">
            Simulate your multi-year technical trajectory, compensation growth curves, and high-ROI
            career pivots powered by market analytics.
          </p>
        </div>
        <div className="module-header-actions">
          <button
            type="button"
            className="btn-header-upload"
            onClick={handleExportPDF}
            disabled={!simulation}
          >
            Export Strategy Report (PDF)
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && <div className="feedback-banner feedback-banner--error">{error}</div>}
      {success && <div className="feedback-banner feedback-banner--success">{success}</div>}

      {/* ── Simulation Control Card ── */}
      <div className="career-config-card">
        <div className="config-grid">
          <div className="config-group">
            <label className="config-label">Target Specialization:</label>
            <select
              className="config-select"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            >
              {rolesList.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="config-group">
            <label className="config-label">Geographic Market & Region:</label>
            <select
              className="config-select"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              {regionsList.map((reg) => (
                <option key={reg} value={reg}>
                  {reg}
                </option>
              ))}
            </select>
          </div>

          <div className="config-group">
            <label className="config-label">Career Progression Pace:</label>
            <select
              className="config-select"
              value={ambitionLevel}
              onChange={(e) => setAmbitionLevel(e.target.value)}
            >
              {ambitionPaces.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className="config-group config-group--action">
            <label className="config-label">Years Experience: {yearsExperience} yrs</label>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              className="config-range-slider"
              value={yearsExperience}
              onChange={(e) => setYearsExperience(Number(e.target.value))}
            />
            <button
              type="button"
              className="btn-primary btn-run-sim"
              onClick={handleRunSimulation}
              disabled={simulating}
            >
              {simulating ? "Simulating Market Paths..." : "Run AI Career Simulation"}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="twin-loading-box">
          <div className="loading-spinner" />
          <p>Generating mathematical career trajectory models...</p>
        </div>
      ) : simulation ? (
        <>
          {/* ── KPI Overview Cards ── */}
          <div className="twin-kpi-grid">
            <div className="twin-kpi-card">
              <span className="kpi-label">Current Market Baseline</span>
              <div className="kpi-number">{simulation.current_market_worth}</div>
              <span className="kpi-sub">Estimated median for {simulation.target_role}</span>
            </div>

            <div className="twin-kpi-card">
              <span className="kpi-label">Projected 5-Year Compensation</span>
              <div className="kpi-number brand-orange">{simulation.projected_5yr_worth}</div>
              <span className="kpi-sub">Base salary + estimated equity bonus</span>
            </div>

            <div className="twin-kpi-card">
              <span className="kpi-label">Cumulative 5-Year Total</span>
              <div className="kpi-number">{simulation.cumulative_5yr_earnings}</div>
              <span className="kpi-sub">Aggregate earnings over 5-year trajectory</span>
            </div>
          </div>

          {/* ── 1yr / 3yr / 5yr Horizon Progression ── */}
          <div className="twin-section">
            <div className="twin-section-header">
              <span className="section-pill">Predictive Modeling</span>
              <h2 className="twin-section-title">Milestone Trajectory Horizons</h2>
              <p className="twin-section-subtitle">
                Role evolutions, compensation milestones, and required technical proficiencies to unlock each stage.
              </p>
            </div>

            <div className="twin-horizons-grid">
              {(simulation.horizons || []).map((h) => (
                <div key={h.year} className="horizon-card">
                  <div className="horizon-card__header">
                    <span className="horizon-year-badge">Year {h.year} Horizon</span>
                    <span className="horizon-salary-range">{h.salary_range}</span>
                  </div>

                  <h3 className="horizon-role-title">{h.title}</h3>

                  <div className="horizon-prob-row">
                    <div className="prob-label-row">
                      <span>Promotion Probability:</span>
                      <strong>{h.promotion_probability}%</strong>
                    </div>
                    <div className="prob-bar-track">
                      <div
                        className="prob-bar-fill"
                        style={{ width: `${h.promotion_probability}%` }}
                      />
                    </div>
                  </div>

                  <div className="horizon-comp-split">
                    <div className="comp-split-item">
                      <span>Base:</span>
                      <strong>${h.base_salary.toLocaleString()}</strong>
                    </div>
                    <div className="comp-split-item">
                      <span>Bonus/Equity:</span>
                      <strong>+${h.equity_bonus.toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="horizon-milestone-box">
                    <span className="milestone-box-lbl">Key Strategic Milestone:</span>
                    <p className="milestone-box-desc">{h.primary_milestone}</p>
                  </div>

                  <div className="horizon-skills-wrap">
                    <span className="skills-wrap-lbl">Target Competencies:</span>
                    <div className="horizon-skills-tags">
                      {(h.recommended_skills || []).map((sk, idx) => (
                        <span key={idx} className="horizon-skill-pill">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Salary Growth Visualization ── */}
          <div className="twin-section">
            <div className="twin-section-header">
              <span className="section-pill">Market Telemetry</span>
              <h2 className="twin-section-title">5-Year Compensation Progression Curve</h2>
              <p className="twin-section-subtitle">
                Visualized base earnings vs high-leverage stock/bonus scaling as technical authority expands.
              </p>
            </div>

            <div className="salary-curve-card">
              <div className="curve-bars-container">
                {(simulation.salary_curve || []).map((pt) => {
                  const barHeightPct = Math.min((pt.total_comp / maxComp) * 100, 100);
                  return (
                    <div key={pt.year} className="curve-bar-col">
                      <div className="bar-total-label">${Math.round(pt.total_comp / 1000)}k</div>
                      <div className="bar-track">
                        <div
                          className="bar-fill-total"
                          style={{ height: `${barHeightPct}%` }}
                        >
                          <div
                            className="bar-fill-bonus"
                            style={{
                              height: `${(pt.bonus_equity / pt.total_comp) * 100}%`,
                            }}
                            title={`Bonus/Stock: $${pt.bonus_equity.toLocaleString()}`}
                          />
                        </div>
                      </div>
                      <span className="bar-year-label">{pt.year_label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="curve-legend">
                <div className="legend-item">
                  <span className="legend-dot legend-dot--base" />
                  <span>Base Compensation</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot legend-dot--bonus" />
                  <span>Stock & Equity Incentives</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── "What-If" Scenario Pivot Comparisons ── */}
          <div className="twin-section">
            <div className="twin-section-header">
              <span className="section-pill">Multi-Track Scenarios</span>
              <h2 className="twin-section-title">"What-If" Career Trajectory Matrix</h2>
              <p className="twin-section-subtitle">
                Compare multi-track trade-offs: pure individual contributor specialization vs engineering leadership vs AI integration.
              </p>
            </div>

            <div className="scenarios-grid">
              {(simulation.what_if_scenarios || []).map((sc, i) => (
                <div key={i} className="scenario-card">
                  <div className="scenario-card__top">
                    <span className="scenario-diff-tag">{sc.transition_difficulty}</span>
                    <h3 className="scenario-title">{sc.track_name}</h3>
                    <p className="scenario-desc">{sc.track_desc}</p>
                  </div>

                  <div className="scenario-metrics-block">
                    <div className="sc-metric-row">
                      <span className="sc-metric-lbl">Year 5 Target Title:</span>
                      <strong className="sc-metric-val">{sc.year_5_role}</strong>
                    </div>
                    <div className="sc-metric-row">
                      <span className="sc-metric-lbl">Year 5 Compensation:</span>
                      <strong className="sc-metric-val sc-metric-val--green">{sc.year_5_salary}</strong>
                    </div>
                    <div className="sc-metric-row">
                      <span className="sc-metric-lbl">Cumulative 5-Year:</span>
                      <strong className="sc-metric-val">{sc.cumulative_5yr_earnings}</strong>
                    </div>
                  </div>

                  <div className="scenario-advantage-box">
                    <span className="adv-lbl">Key Strategic Advantage:</span>
                    <p className="adv-desc">{sc.key_advantage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
