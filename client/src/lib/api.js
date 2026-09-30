const API_ROOT = "/api";

async function rawRequest(path, options = {}) {
  const { body, method = "GET", auth = true } = options;
  const headers = {};
  const token = auth ? JSON.parse(localStorage.getItem("snitch-session") || "null")?.accessToken : null;
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body && !(body instanceof FormData)) headers["Content-Type"] = "application/json";

  const response = await fetch(`${API_ROOT}${path}`, {
    method,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(result.message || "Something went wrong. Please try again.");
    error.status = response.status;
    error.details = result.errors || [];
    throw error;
  }
  return result;
}

export async function request(path, options = {}) {
  try {
    return await rawRequest(path, options);
  } catch (error) {
    if (error.status !== 401 || options.auth === false || path === "/auth/refresh") throw error;
    const refreshed = await rawRequest("/auth/refresh", { method: "POST", auth: false });
    localStorage.setItem("snitch-session", JSON.stringify(refreshed.data));
    return rawRequest(path, options);
  }
}

export function persistSession(session) {
  localStorage.setItem("snitch-session", JSON.stringify(session));
}