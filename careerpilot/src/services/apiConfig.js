// ============================================================
// CareerPilot AI — Central API Base URL Configuration
// ============================================================
// Points to the live Render production backend by default,
// or uses local proxy during local development.
// ============================================================

const isLocal =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

export const API_BASE_URL =
  import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim() !== ""
    ? import.meta.env.VITE_API_URL.trim().replace(/\/$/, "")
    : isLocal
    ? ""
    : "https://careerpilot-ai-3xth.onrender.com";
