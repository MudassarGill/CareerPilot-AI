// ============================================================
// CareerPilot AI — Career Twin & Simulation API Service (Phase 7)
// ============================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

function getAuthHeaders(isJson = true) {
  const token =
    sessionStorage.getItem("careerpilot_access_token") ||
    localStorage.getItem("careerpilot_access_token");
  const headers = {};
  if (isJson) {
    headers["Content-Type"] = "application/json";
    headers["Accept"] = "application/json";
  }
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
 * Run a multi-year career simulation
 * @param {Object} params
 * @param {string} params.target_role
 * @param {string} params.region
 * @param {string} params.ambition_level
 * @param {number} params.years_experience
 * @returns {Promise<Object>}
 */
export async function simulateCareerTwin({
  target_role = "Frontend Developer",
  region = "US Remote",
  ambition_level = "accelerated",
  years_experience = 2,
}) {
  const url = `${API_BASE_URL}/api/career-twin/simulate`;
  const response = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify({
      target_role,
      region,
      ambition_level,
      years_experience,
    }),
  });

  if (!response.ok) {
    throw await parseError(response);
  }
  return response.json();
}

/**
 * Fetch latest saved career twin simulation
 * @returns {Promise<Object>}
 */
export async function getLatestSimulation() {
  const url = `${API_BASE_URL}/api/career-twin/latest`;
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(true),
  });

  if (!response.ok) {
    throw await parseError(response);
  }
  return response.json();
}
