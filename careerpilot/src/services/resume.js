// ============================================================
// CareerPilot AI — Resume & ATS API Service
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
 * Upload and parse resume file (PDF/DOCX)
 * @param {File} file
 * @returns {Promise<object>}
 */
export async function uploadResume(file) {
  const url = `${API_BASE_URL}/api/resume/upload`;
  const formData = new FormData();
  formData.append("file", file);

  const token =
    sessionStorage.getItem("careerpilot_access_token") ||
    localStorage.getItem("careerpilot_access_token");
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw await parseError(response);
  }
  return await response.json();
}

/**
 * List all resumes for current user
 */
export async function getResumes() {
  const url = `${API_BASE_URL}/api/resume/list`;
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(true),
  });

  if (!response.ok) {
    throw await parseError(response);
  }
  return await response.json();
}

/**
 * Get resume detail by ID
 */
export async function getResumeDetail(resumeId) {
  const url = `${API_BASE_URL}/api/resume/${resumeId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(true),
  });

  if (!response.ok) {
    throw await parseError(response);
  }
  return await response.json();
}

/**
 * Delete resume by ID
 */
export async function deleteResume(resumeId) {
  const url = `${API_BASE_URL}/api/resume/${resumeId}`;
  const response = await fetch(url, {
    method: "DELETE",
    headers: getAuthHeaders(true),
  });

  if (!response.ok) {
    throw await parseError(response);
  }
  return await response.json();
}

/**
 * Run ATS scoring on resume vs job description
 * @param {string} resumeId
 * @param {string} jobDescription
 */
export async function scoreResumeATS(resumeId, jobDescription) {
  const url = `${API_BASE_URL}/api/resume/ats-score`;
  const response = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify({
      resume_id: resumeId,
      job_description: jobDescription,
    }),
  });

  if (!response.ok) {
    throw await parseError(response);
  }
  return await response.json();
}
