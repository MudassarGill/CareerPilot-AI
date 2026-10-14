import { useState, useEffect } from "react";
import {
  getAllSkills,
  getAvailableRoles,
  getMySkills,
  addSkill,
  updateSkill,
  deleteSkill,
  getSkillGap,
} from "../../services/skills";

export default function SkillsView({ onNavigate }) {
  const [activeTab, setActiveTab] = useState("gaps"); // "gaps" | "mine" | "catalog"
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("Frontend Developer");
  const [gapData, setGapData] = useState(null);
  const [mySkills, setMySkills] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [loadingGaps, setLoadingGaps] = useState(false);
  const [loadingMine, setLoadingMine] = useState(false);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = ["All", "Frontend", "Backend", "AI/ML", "DevOps", "Database", "Cloud", "Data", "Soft Skills"];

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      loadGaps(selectedRole);
    }
  }, [selectedRole]);

  async function loadInitialData() {
    try {
      const [rolesRes, myRes] = await Promise.all([
        getAvailableRoles().catch(() => ({ roles: [] })),
        getMySkills().catch(() => []),
      ]);

      const availableRoles = rolesRes.roles || [
        "Frontend Developer",
        "Backend Developer",
        "Full Stack Developer",
        "AI/ML Engineer",
        "DevOps Engineer",
        "Data Analyst",
      ];
      setRoles(availableRoles);
      setMySkills(myRes || []);

      if (availableRoles.length > 0) {
        setSelectedRole(availableRoles[0]);
        loadGaps(availableRoles[0]);
      }
    } catch (err) {
      setError("Failed to load skills data.");
    }
  }

  async function loadGaps(role) {
    setLoadingGaps(true);
    setError("");
    try {
      const data = await getSkillGap(role);
      setGapData(data);
    } catch (err) {
      setError(err.message || "Could not analyze skill gap.");
    } finally {
      setLoadingGaps(false);
    }
  }

  async function loadMySkillsList() {
    setLoadingMine(true);
    try {
      const data = await getMySkills();
      setMySkills(data || []);
    } catch (err) {
      setError("Could not refresh your skills.");
    } finally {
      setLoadingMine(false);
    }
  }

  async function loadCatalogList() {
    setLoadingCatalog(true);
    try {
      const cat = selectedCategory === "All" ? "" : selectedCategory;
      const data = await getAllSkills(cat, searchQuery);
      setCatalog(data || []);
    } catch (err) {
      setError("Failed to load skills catalog.");
    } finally {
      setLoadingCatalog(false);
    }
  }

  useEffect(() => {
    if (activeTab === "catalog") {
      loadCatalogList();
    }
  }, [activeTab, selectedCategory, searchQuery]);

  async function handleAddSkill(skillId) {
    setError("");
    setSuccess("");
    try {
      await addSkill(skillId, 65, 85);
      setSuccess("Skill added to your profile!");
      await loadMySkillsList();
      if (selectedRole) loadGaps(selectedRole);
    } catch (err) {
      setError(err.message || "Failed to add skill.");
    }
  }

  async function handleUpdateLevel(userSkillId, newLevel) {
    try {
      await updateSkill(userSkillId, newLevel, 80);
      setMySkills((prev) =>
        prev.map((s) => (s.id === userSkillId ? { ...s, level: newLevel } : s))
      );
      if (selectedRole) loadGaps(selectedRole);
    } catch (err) {
      setError("Failed to update proficiency level.");
    }
  }

  async function handleDeleteSkill(userSkillId) {
    if (!window.confirm("Remove this skill from your profile?")) return;
    try {
      await deleteSkill(userSkillId);
      setMySkills((prev) => prev.filter((s) => s.id !== userSkillId));
      setSuccess("Skill removed.");
      if (selectedRole) loadGaps(selectedRole);
    } catch (err) {
      setError("Failed to delete skill.");
    }
  }

  // Set of user skill IDs for quick lookup in catalog
  const userSkillIds = new Set(mySkills.map((s) => s.skill_id));

  return (
    <div className="module-view-root">
      {/* Top Banner */}
      <div className="module-header-card">
        <div className="module-header-text">
          <span className="module-eyebrow">Phase 4 — Core Assessment</span>
          <h1 className="module-main-title">Skill Assessment & Gap Analysis</h1>
          <p className="module-subtitle">
            Benchmark your proficiency against industry standard roles, target high-demand competencies, and accelerate your Career Readiness Score.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="skills-nav-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === "gaps" ? "tab-btn--active" : ""}`}
            onClick={() => setActiveTab("gaps")}
          >
            🎯 Role Gap Analysis
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "mine" ? "tab-btn--active" : ""}`}
            onClick={() => {
              setActiveTab("mine");
              loadMySkillsList();
            }}
          >
            ⭐ My Skills ({mySkills.length})
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "catalog" ? "tab-btn--active" : ""}`}
            onClick={() => setActiveTab("catalog")}
          >
            🔍 Explore Catalog
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && <div className="feedback-banner feedback-banner--error">{error}</div>}
      {success && <div className="feedback-banner feedback-banner--success">{success}</div>}

      {/* TAB 1: ROLE GAP ANALYSIS */}
      {activeTab === "gaps" && (
        <div className="skills-tab-content">
          {/* Role Selector & Overview Card */}
          <div className="gap-overview-card">
            <div className="gap-overview-top">
              <div>
                <label className="field-label">Target Career Role:</label>
                <select
                  className="role-select-box"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {gapData && (
                <div className="gap-stat-pills">
                  <div className="gap-stat-pill">
                    <span className="gap-stat-lbl">Role Match</span>
                    <span className="gap-stat-val brand-orange">
                      {Math.round(gapData.overall_match_pct)}%
                    </span>
                  </div>
                  <div className="gap-stat-pill">
                    <span className="gap-stat-lbl">Matched</span>
                    <span className="gap-stat-val">
                      {gapData.total_matched} / {gapData.total_required}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Match Progress Bar */}
            {gapData && (
              <div className="gap-progress-wrap">
                <div className="gap-progress-labels">
                  <span>Match Progress for {selectedRole}</span>
                  <span>{Math.round(gapData.overall_match_pct)}% Complete</span>
                </div>
                <div className="gap-progress-bar">
                  <div
                    className="gap-progress-fill"
                    style={{ width: `${Math.min(gapData.overall_match_pct, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Detailed Skill Gaps Table / Cards */}
          <div className="skills-gap-list-card">
            <div className="card-section-header">
              <h3 className="section-title">Required Competencies Breakdown</h3>
              <span className="section-hint">
                Skills identified in standard industry job requirements for {selectedRole}
              </span>
            </div>

            {loadingGaps ? (
              <div className="empty-state-text">Analyzing skill gaps...</div>
            ) : !gapData || gapData.gaps.length === 0 ? (
              <div className="empty-state-text">No skill gaps found for this role.</div>
            ) : (
              <div className="gap-items-grid">
                {gapData.gaps.map((item, idx) => {
                  let statusClass = "status--missing";
                  let statusLabel = "Missing";
                  if (item.status === "exceeded") {
                    statusClass = "status--exceeded";
                    statusLabel = "Exceeded";
                  } else if (item.status === "on_track") {
                    statusClass = "status--ontrack";
                    statusLabel = "On Track";
                  } else if (item.status === "below_target") {
                    statusClass = "status--below";
                    statusLabel = "Below Target";
                  }

                  return (
                    <div key={idx} className="gap-skill-card">
                      <div className="gap-skill-header">
                        <h4 className="gap-skill-name">{item.skill_name}</h4>
                        <span className={`status-badge ${statusClass}`}>
                          {statusLabel}
                        </span>
                      </div>

                      <div className="gap-meter-row">
                        <span className="gap-meter-label">
                          Current: <strong>{item.current_level}%</strong>
                        </span>
                        <span className="gap-meter-label">
                          Required: <strong>{item.required_level}%</strong>
                        </span>
                      </div>

                      <div className="gap-dual-bar">
                        <div
                          className="gap-current-fill"
                          style={{ width: `${Math.min(item.current_level, 100)}%` }}
                        />
                        <div
                          className="gap-marker"
                          style={{ left: `${Math.min(item.required_level, 100)}%` }}
                          title={`Required: ${item.required_level}%`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MY SKILLS */}
      {activeTab === "mine" && (
        <div className="skills-tab-content">
          <div className="my-skills-card">
            <div className="card-section-header">
              <div>
                <h3 className="section-title">My Verified Skills Profile</h3>
                <p className="section-hint">
                  Drag the sliders to adjust your current proficiency level. These scores directly update your CRS readiness.
                </p>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setActiveTab("catalog")}
              >
                + Add More Skills
              </button>
            </div>

            {loadingMine ? (
              <div className="empty-state-text">Loading your skills...</div>
            ) : mySkills.length === 0 ? (
              <div className="empty-state-text">
                You haven't added any skills to your profile yet. Click "Explore Catalog" above to add your core competencies!
              </div>
            ) : (
              <div className="my-skills-stack">
                {mySkills.map((us) => (
                  <div key={us.id} className="my-skill-row">
                    <div className="my-skill-info">
                      <h4 className="my-skill-name">{us.skill_name}</h4>
                      {us.skill_category && (
                        <span className="my-skill-category">{us.skill_category}</span>
                      )}
                    </div>

                    <div className="my-skill-slider-wrap">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={us.level}
                        onChange={(e) =>
                          handleUpdateLevel(us.id, parseInt(e.target.value, 10))
                        }
                        className="proficiency-slider"
                      />
                      <span className="slider-val-badge">{us.level}%</span>
                    </div>

                    <div className="my-skill-actions">
                      <button
                        type="button"
                        className="delete-item-btn"
                        title="Remove Skill"
                        onClick={() => handleDeleteSkill(us.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: EXPLORE CATALOG */}
      {activeTab === "catalog" && (
        <div className="skills-tab-content">
          <div className="catalog-search-card">
            <div className="catalog-search-bar">
              <input
                type="text"
                placeholder="Search skills by name (e.g. React, Python, Docker...)"
                className="catalog-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Pills */}
            <div className="category-pills-row">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`cat-pill ${selectedCategory === c ? "cat-pill--active" : ""}`}
                  onClick={() => setSelectedCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>

            {loadingCatalog ? (
              <div className="empty-state-text">Loading catalog...</div>
            ) : catalog.length === 0 ? (
              <div className="empty-state-text">No skills found matching your filters.</div>
            ) : (
              <div className="catalog-grid">
                {catalog.map((s) => {
                  const alreadyAdded = userSkillIds.has(s.id);
                  return (
                    <div key={s.id} className="catalog-item-card">
                      <div>
                        <h4 className="catalog-item-name">{s.name}</h4>
                        {s.category && (
                          <span className="catalog-item-cat">{s.category}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        className={`catalog-add-btn ${alreadyAdded ? "catalog-add-btn--added" : ""}`}
                        disabled={alreadyAdded}
                        onClick={() => handleAddSkill(s.id)}
                      >
                        {alreadyAdded ? "✓ Added" : "+ Add"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
