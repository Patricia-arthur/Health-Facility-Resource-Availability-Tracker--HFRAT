const API_BASE = "http://127.0.0.1:5000/api";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  // 🚨 DO NOT REDIRECT AUTOMATICALLY
  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  return response.json();
}
