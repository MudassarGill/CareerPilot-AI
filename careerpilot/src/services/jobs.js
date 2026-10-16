// ============================================================
// CareerPilot AI — Job Intelligence Matcher Service (Phase 5+)
// ============================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

function getAuthHeaders(isJson = true) {
  const token = sessionStorage.getItem("careerpilot_access_token");
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
 * Fetch live tech jobs with personalized match %
 * @param {Object} [params]
 * @param {string} [params.search]
 * @param {string} [params.category]
 * @param {string} [params.location_type]
 * @param {number} [params.min_match]
 * @returns {Promise<Array>}
 */
export async function getJobs(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.category && params.category !== "All") query.set("category", params.category);
  if (params.location_type && params.location_type !== "All") query.set("location_type", params.location_type);
  if (params.min_match) query.set("min_match", params.min_match);

  const qs = query.toString();
  const url = `${API_BASE_URL}/api/jobs${qs ? `?${qs}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(true),
  });

  if (!response.ok) {
    throw await parseError(response);
  }
  return response.json();
}

/**
 * Fetch market readiness summary stats
 * @returns {Promise<Object>}
 */
export async function getJobMarketSummary() {
  const url = `${API_BASE_URL}/api/jobs/summary`;
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(true),
  });

  if (!response.ok) {
    throw await parseError(response);
  }
  return response.json();
}

/**
 * Toggle bookmark/save state for a job
 * @param {string} jobId
 * @returns {Promise<Object>}
 */
export async function toggleSaveJob(jobId) {
  const url = `${API_BASE_URL}/api/jobs/save`;
  const response = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify({ job_id: jobId }),
  });

  if (!response.ok) {
    throw await parseError(response);
  }
  return response.json();
}

/**
 * Mark job application submitted
 * @param {string} jobId
 * @param {string} [notes]
 * @returns {Promise<Object>}
 */
export async function applyToJob(jobId, notes = "") {
  const url = `${API_BASE_URL}/api/jobs/apply`;
  const response = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify({ job_id: jobId, notes }),
  });

  if (!response.ok) {
    throw await parseError(response);
  }
  return response.json();
}
