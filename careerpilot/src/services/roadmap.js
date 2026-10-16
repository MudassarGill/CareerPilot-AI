// ============================================================
// CareerPilot AI — Learning Roadmap & Milestones API Service (Phase 5)
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
 * Fetch current user's active learning roadmap with steps
 */
export async function getCurrentRoadmap() {
  const response = await fetch(`${API_BASE_URL}/api/roadmap/current`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw await parseError(response);
  return await response.json();
}

/**
 * Generate or re-generate a learning roadmap tailored to a target role
 */
export async function generateRoadmap(targetRole, targetTimelineMonths = 3) {
  const response = await fetch(`${API_BASE_URL}/api/roadmap/generate`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      target_role: targetRole,
      target_timeline_months: targetTimelineMonths,
    }),
  });

  if (!response.ok) throw await parseError(response);
  return await response.json();
}

/**
 * Update step status ('pending' | 'in_progress' | 'done')
 */
export async function updateStepStatus(stepId, status) {
  const response = await fetch(`${API_BASE_URL}/api/roadmap/steps/${stepId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!response.ok) throw await parseError(response);
  return await response.json();
}

/**
 * Delete roadmap
 */
export async function deleteRoadmap(roadmapId) {
  const response = await fetch(`${API_BASE_URL}/api/roadmap/${roadmapId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw await parseError(response);
  return await response.json();
}
