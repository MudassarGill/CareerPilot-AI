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
 * @param {string} [params.interview_type="video"]
 * @param {number} [params.question_count=5]
 * @param {string} [params.difficulty="mid"]
 * @param {boolean} [params.consent_granted=true]
 * @param {string} [params.interviewer_persona="sarah"]
 * @returns {Promise<Object>}
 */
export async function startInterview({
  role = "Frontend Developer",
  interview_type = "video",
  question_count = 5,
  difficulty = "mid",
  consent_granted = true,
  interviewer_persona = "sarah",
}) {
  const url = `${API_BASE_URL}/api/interview/start`;
  const response = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify({
      role,
      interview_type,
      question_count,
      difficulty,
      consent_granted,
      interviewer_persona,
    }),
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
 * @param {Object} [params.visual_metrics=null]
 * @param {Object} [params.speech_metrics=null]
 * @param {number} [params.avatar_latency_ms=null]
 * @returns {Promise<Object>}
 */
export async function submitAnswer({
  interview_id,
  question_index,
  answer_text,
  duration_sec = 0,
  visual_metrics = null,
  speech_metrics = null,
  avatar_latency_ms = null,
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
      visual_metrics,
      speech_metrics,
      avatar_latency_ms,
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

/**
 * Real-time conversational dialogue with the AI avatar (warm-up, self-introduction, Q&A)
 * @param {Object} params
 * @param {string} [params.interview_id]
 * @param {string} params.message
 * @param {string} [params.persona="sarah"]
 * @param {string} [params.role="Software Engineer"]
 * @param {string} [params.dialogue_state="intro"]
 * @param {string} [params.candidate_name]
 * @param {string} [params.language="auto"]
 * @returns {Promise<Object>}
 */
export async function converseWithAvatar({
  interview_id,
  message,
  persona = "sarah",
  role = "Software Engineer",
  dialogue_state = "intro",
  candidate_name,
  language = "auto",
}) {
  const url = `${API_BASE_URL}/api/interview/converse`;
  const response = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify({
      interview_id,
      message,
      persona,
      role,
      dialogue_state,
      candidate_name,
      language,
    }),
  });

  if (!response.ok) {
    throw await parseError(response);
  }
  return response.json();
}
