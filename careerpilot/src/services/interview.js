// ============================================================
// CareerPilot AI — Mock Interview API Service (Phase 6)
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
 * Start a new AI mock interview session
 * @param {Object} params
 * @param {string} params.role
 * @param {string} [params.interview_type="text"]
 * @param {number} [params.question_count=5]
 * @param {string} [params.difficulty="mid"]
 * @returns {Promise<Object>}
 */
export async function startInterview({
  role = "Frontend Developer",
  interview_type = "text",
  question_count = 5,
  difficulty = "mid",
}) {
  const url = `${API_BASE_URL}/api/interview/start`;
  const response = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify({ role, interview_type, question_count, difficulty }),
  });

  if (!response.ok) {
    throw await parseError(response);
  }
  return response.json();
}

/**
 * Submit answer for real-time evaluation
 * @param {Object} params
 * @param {string} params.interview_id
 * @param {number} params.question_index
 * @param {string} params.answer_text
 * @param {number} [params.duration_sec=0]
 * @returns {Promise<Object>}
 */
export async function submitAnswer({
  interview_id,
  question_index,
  answer_text,
  duration_sec = 0,
}) {
  const url = `${API_BASE_URL}/api/interview/answer`;
  const response = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify({
      interview_id,
      question_index,
      answer_text,
      duration_sec,
    }),
  });

  if (!response.ok) {
    throw await parseError(response);
  }
  return response.json();
}

/**
 * Finalize an interview session and calculate final score & CRS
 * @param {string} interview_id
 * @returns {Promise<Object>}
 */
export async function finishInterview(interview_id) {
  const url = `${API_BASE_URL}/api/interview/${interview_id}/finish`;
  const response = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(true),
  });

  if (!response.ok) {
    throw await parseError(response);
  }
  return response.json();
}

/**
 * Get past mock interview sessions
 * @returns {Promise<Array>}
 */
export async function getInterviewHistory() {
  const url = `${API_BASE_URL}/api/interview/history`;
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
 * Get detailed record of an interview session
 * @param {string} interview_id
 * @returns {Promise<Object>}
 */
export async function getInterviewDetail(interview_id) {
  const url = `${API_BASE_URL}/api/interview/${interview_id}`;
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(true),
  });

  if (!response.ok) {
    throw await parseError(response);
  }
  return response.json();
}
