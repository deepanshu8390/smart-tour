import { mockBookings, mockLocations } from "./mock-data";
import { clearAuthState, getAuthState, setAuthState } from "./auth-storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const pendingLocationRequests = new Map();
const pendingLocationDetailRequests = new Map();

export class ApiError extends Error {
  constructor(message, status, details = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const isNetworkError = (error) => error instanceof TypeError;

async function parseError(response, fallback) {
  try {
    const payload = await response.json();
    return new ApiError(payload?.message || fallback, response.status, payload?.details || {});
  } catch {
    return new ApiError(fallback, response.status);
  }
}

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: options.credentials || "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    cache: "no-store",
  });
  if (!response.ok) throw await parseError(response, `Request failed: ${response.status}`);
  return response.json();
}

async function refreshAccessToken() {
  const auth = getAuthState();
  if (!auth?.token) throw new ApiError("Unauthorized", 401);
  const refreshed = await requestJson("/auth/refresh", { method: "POST" });
  setAuthState({ ...auth, ...refreshed });
  return refreshed.token;
}

async function authenticatedJson(path, token, options = {}, canRefresh = true) {
  try {
    return await requestJson(path, { ...options, headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` } });
  } catch (error) {
    if (!canRefresh || error.status !== 401 || error.details?.code !== "TOKEN_EXPIRED") throw error;
    try {
      return authenticatedJson(path, await refreshAccessToken(), options, false);
    } catch (refreshError) {
      clearAuthState();
      throw new ApiError("Session expired. Please login again.", 401, { code: "SESSION_EXPIRED", cause: refreshError.message });
    }
  }
}

function filterMockLocations(params = {}) {
  const page = Number.isFinite(params.page) ? params.page : 1;
  const limit = Math.min(Math.max(Number.isFinite(params.limit) ? params.limit : 6, 1), 50);
  const search = params.search?.toLowerCase().trim();
  const type = params.type?.toLowerCase().trim();
  const sorted = [...mockLocations].filter((item) => {
    const matchesSearch = !search || [item.name, item.shortDescription, item.description, item.type].some((value) => value.toLowerCase().includes(search));
    const matchesType = !type || type === "all" || item.type.toLowerCase() === type;
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    if (params.sort === "rating_desc") return b.rating - a.rating;
    if (params.sort === "projectId_desc") return b.projectId - a.projectId;
    if (params.sort === "name_asc") return a.name.localeCompare(b.name);
    return a.projectId - b.projectId;
  });
  const total = sorted.length;
  const totalPages = total === 0 ? 1 : Math.ceil(total / limit);
  const data = sorted.slice((page - 1) * limit, page * limit).map(({ projectId, type, name, shortDescription, imageUrl, rating, reviewCount, location }) => ({ projectId, type, name, shortDescription, imageUrl, rating, reviewCount, location }));
  return { total, page, limit, totalPages, data };
}

function locationsQuery(params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.type) query.set("type", params.type);
  if (params.sort) query.set("sort", params.sort);
  return query.toString();
}

export async function fetchLocations(params = {}, signal) {
  const key = locationsQuery(params);
  if (!signal && pendingLocationRequests.has(key)) return pendingLocationRequests.get(key);
  const request = requestJson(`/locations?${key}`, { signal }).catch((error) => {
    if (!isNetworkError(error)) throw error;
    return filterMockLocations(params);
  }).finally(() => pendingLocationRequests.delete(key));
  if (!signal) pendingLocationRequests.set(key, request);
  return request;
}

export async function fetchLocation(projectId, signal) {
  const key = String(projectId);
  if (!signal && pendingLocationDetailRequests.has(key)) return pendingLocationDetailRequests.get(key);
  const request = requestJson(`/locations/${projectId}`, { signal }).catch((error) => {
    if (!isNetworkError(error)) throw error;
    const fallback = mockLocations.find((location) => location.projectId === projectId);
    if (!fallback) throw new Error("Location not found");
    return { ...fallback, similarLocations: mockLocations.filter((item) => item.projectId !== projectId && item.type === fallback.type).sort((a, b) => b.rating - a.rating).slice(0, 3).map(({ projectId: id, type, name, shortDescription, imageUrl, rating, reviewCount, location }) => ({ projectId: id, type, name, shortDescription, imageUrl, rating, reviewCount, location })) };
  }).finally(() => pendingLocationDetailRequests.delete(key));
  if (!signal) pendingLocationDetailRequests.set(key, request);
  return request;
}

export async function sendOtp(payload) {
  try { return await requestJson("/auth/send-otp", { method: "POST", body: JSON.stringify(payload) }); }
  catch (error) { if (!isNetworkError(error)) throw error; return { message: "OTP sent", devOtp: "123456" }; }
}

export async function verifyOtp(payload) {
  try { return await requestJson("/auth/verify-otp", { method: "POST", body: JSON.stringify(payload) }); }
  catch (error) { if (!isNetworkError(error)) throw error; return { token: "dev-token", userId: "dev-user", name: payload.name, role: "USER" }; }
}

export async function logoutSession() {
  try { await requestJson("/auth/logout", { method: "POST" }); }
  catch (error) { if (!isNetworkError(error)) throw error; }
}

export async function fetchMyBookings(token) {
  if (!token) return mockBookings;
  const payload = await authenticatedJson("/bookings/my", token);
  return payload.data;
}

export async function createBooking(token, payload, idempotencyKey) {
  return authenticatedJson("/bookings", token, { method: "POST", headers: { "Idempotency-Key": idempotencyKey }, body: JSON.stringify(payload) });
}
