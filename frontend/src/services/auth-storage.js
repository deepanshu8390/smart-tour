const KEY = "smartTourAuth";

export function getAuthState() {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setAuthState(state) {
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function clearAuthState() {
  window.localStorage.removeItem(KEY);
}
