// Central API base URL. Production deployments set VITE_API_URL
// (e.g. the hosted backend); local development falls back to localhost.
export const API_BASE =
  (import.meta.env.VITE_API_URL || "").trim().replace(/\/+$/, "") ||
  "http://localhost:5000";
