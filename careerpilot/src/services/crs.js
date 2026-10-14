// ============================================================
// CareerPilot AI — Career Readiness Score (CRS) API Service
// ============================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

function getAuthHeaders() {
  const token = sessionStorage.getItem("careerpilot_access_token");
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
 * Get real-time composite Career Readiness Score and sub-metrics
 */
export async function getCRSScore() {
  const url = `${API_BASE_URL}/api/crs/score`;
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw await parseError(response);
  return await response.json();
}

/**
 * Get CRS history records for trend tracking
 */
export async function getCRSHistory() {
  const url = `${API_BASE_URL}/api/crs/history`;
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw await parseError(response);
  return await response.json();
}
