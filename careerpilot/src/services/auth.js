// ============================================================
// CareerPilot AI — Authentication API Service
// ============================================================

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

/**
 * Helper to process API error response from FastAPI
 */
async function parseError(response) {
  try {
    const data = await response.json();
    if (typeof data.detail === "string") {
      return new Error(data.detail);
    }
    if (Array.isArray(data.detail)) {
      return new Error(data.detail.map((err) => err.msg || err.message).join(", "));
    }
    if (data.message) {
      return new Error(data.message);
    }
  } catch {
    // response not JSON
  }
  return new Error(`Request failed with status ${response.status}`);
}

/**
 * Log in with email and password
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ access_token: string, token_type: string, user: object }>}
 */
export async function logIn({ email, password }) {
  const url = `${API_BASE_URL}/api/auth/login`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  const data = await response.json();
  if (data.access_token) {
    sessionStorage.setItem("careerpilot_access_token", data.access_token);
    sessionStorage.setItem("careerpilot_user", JSON.stringify(data.user));
  }
  return data;
}

/**
 * Register a new user account
 * @param {{ full_name?: string, name?: string, email: string, password: string }} userData
 * @returns {Promise<{ message: string }>}
 */
export async function signUp({ full_name, name, email, password }) {
  const url = `${API_BASE_URL}/api/auth/register`;
  const userName = full_name || name || email.split("@")[0];

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: userName,
      full_name: userName,
      email,
      password,
      confirm_password: password,
    }),
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return await response.json();
}

/**
 * Get current authenticated user profile
 * @param {string} token
 * @returns {Promise<object>}
 */
export async function getMe(token) {
  const authToken = token || sessionStorage.getItem("careerpilot_access_token");
  if (!authToken) {
    throw new Error("No token provided");
  }

  const url = `${API_BASE_URL}/api/auth/me`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw await parseError(response);
  }

  return await response.json();
}

/**
 * Log out
 */
export function logOut() {
  sessionStorage.removeItem("careerpilot_access_token");
  sessionStorage.removeItem("careerpilot_user");
}
