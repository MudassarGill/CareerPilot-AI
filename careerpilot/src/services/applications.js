// ============================================================
// CareerPilot AI — Application Tracker & Cover Letter Service (Phase 8)
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

export async function getApplications() {
  const res = await fetch(`${API_BASE_URL}/api/applications`, {
    headers: getAuthHeaders(false),
  });
  if (!res.ok) throw await parseError(res);
  return await res.json();
}

export async function createApplication(payload) {
  const res = await fetch(`${API_BASE_URL}/api/applications`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw await parseError(res);
  return await res.json();
}

export async function updateApplication(id, payload) {
  const res = await fetch(`${API_BASE_URL}/api/applications/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw await parseError(res);
  return await res.json();
}

export async function deleteApplication(id) {
  const res = await fetch(`${API_BASE_URL}/api/applications/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(false),
  });
  if (!res.ok) throw await parseError(res);
  return await res.json();
}

export async function generateCoverLetter(payload) {
  const res = await fetch(`${API_BASE_URL}/api/applications/generate-cover-letter`, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw await parseError(res);
  return await res.json();
}
