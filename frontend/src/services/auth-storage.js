const KEY = "smartTourAuth";

export function getAuthState() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    window.localStorage.removeItem(KEY);
    return null;
  }
}

export function setAuthState(state) {
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function clearAuthState() {
  window.localStorage.removeItem(KEY);
}
