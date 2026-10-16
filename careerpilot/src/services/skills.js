// ============================================================
// CareerPilot AI — Skills & Gap Analysis API Service
// ============================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

function getAuthHeaders() {
  const token =
    sessionStorage.getItem("careerpilot_access_token") ||
    localStorage.getItem("careerpilot_access_token");
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function parseError(response) {
  if (response.status === 401) {
    sessionStorage.removeItem("careerpilot_access_token");
    localStorage.removeItem("careerpilot_access_token");
    window.dispatchEvent(new CustomEvent("careerpilot:unauthorized"));
    return new Error("Your session has expired. Please sign in again to continue.");
  }
  try {
    const data = await response.json();
    if (typeof data.detail === "string") return new Error(data.detail);
    if (Array.isArray(data.detail)) {
      return new Error(data.detail.map((e) => e.msg || e.message).join(", "));
    }
    if (data.message) return new Error(data.message);
  } catch {
    // ignore
  }
  return new Error(`Request failed with status ${response.status}`);
}

/**
 * Fetch skills catalog with optional search & category filter
 */
export async function getAllSkills(category = "", search = "") {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (search) params.append("search", search);

  const qs = params.toString() ? `?${params.toString()}` : "";
  const url = `${API_BASE_URL}/api/skills${qs}`;

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw await parseError(response);
  return await response.json();
}

/**
 * Fetch available target roles for gap analysis
 */
export async function getAvailableRoles() {
  const url = `${API_BASE_URL}/api/skills/roles`;
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw await parseError(response);
  return await response.json();
}

/**
 * Fetch current user's skills
 */
export async function getMySkills() {
  const url = `${API_BASE_URL}/api/skills/mine`;
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw await parseError(response);
  return await response.json();
}

/**
 * Add skill to user profile
 */
export async function addSkill(skillId, level = 50, targetLevel = 80) {
  const url = `${API_BASE_URL}/api/skills/mine`;
  const response = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      skill_id: skillId,
      level,
      target_level: targetLevel,
    }),
  });

  if (!response.ok) throw await parseError(response);
  return await response.json();
}

/**
 * Update user skill level
 */
export async function updateSkill(userSkillId, level, targetLevel) {
  const url = `${API_BASE_URL}/api/skills/mine/${userSkillId}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      level,
      target_level: targetLevel,
    }),
  });

  if (!response.ok) throw await parseError(response);
  return await response.json();
}

/**
 * Delete skill from user profile
 */
export async function deleteSkill(userSkillId) {
  const url = `${API_BASE_URL}/api/skills/mine/${userSkillId}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw await parseError(response);
  return await response.json();
}

/**
 * Get skill gap analysis vs target role
 */
export async function getSkillGap(targetRole = "") {
  const params = targetRole ? `?target_role=${encodeURIComponent(targetRole)}` : "";
  const url = `${API_BASE_URL}/api/skills/gap${params}`;

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw await parseError(response);
  return await response.json();
}
