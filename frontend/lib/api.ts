export const API_URL = "http://localhost:8000/api";

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const isJson = response.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
        throw new Error(data?.detail || "Something went wrong.");
    }

    return data;
}
