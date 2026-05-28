const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

let csrfToken: string | undefined;

export function setCsrfToken(token?: string) {
  csrfToken = token;
}

export function apiUrl(path: string) {
  return `${API_BASE}${path}`;
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (csrfToken && !["GET", "HEAD"].includes(init.method ?? "GET")) headers.set("x-csrf-token", csrfToken);

  const response = await fetch(apiUrl(path), {
    ...init,
    headers,
    credentials: "include"
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message ?? "Request failed");
  }

  if (response.status === 204) return undefined as T;
  const data = await response.json();
  if (data.csrfToken) setCsrfToken(data.csrfToken);
  return data as T;
}
