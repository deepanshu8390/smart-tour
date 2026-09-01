import { mockBookings, mockLocations } from "./mock-data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

function normalizePage(value, fallback = 1) {
  return Number.isFinite(value ?? NaN) ? Number(value) : fallback;
}

function isNetworkError(error) {
  return error instanceof TypeError;
}

async function requestJson(path, options) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...(options || {}),
    headers: {
      "Content-Type": "application/json",
      ...((options && options.headers) || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const payload = await response.json();
      if (payload?.message) {
        message = payload.message;
      }
    } catch {}
    throw new Error(message);
  }

  return response.json();
}

function filterMockLocations(params) {
  const page = normalizePage(params.page, 1);
  const limit = Math.min(Math.max(normalizePage(params.limit, 6), 1), 50);
  const search = params.search?.toLowerCase().trim();
  const type = params.type?.toLowerCase().trim();
  const sorted = [...mockLocations]
    .filter((item) => {
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search) ||
        item.shortDescription.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.type.toLowerCase().includes(search);
      const matchesType = !type || type === "all" || item.type.toLowerCase() === type;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (params.sort === "rating_desc") return b.rating - a.rating;
      if (params.sort === "projectId_desc") return b.projectId - a.projectId;
      if (params.sort === "name_asc") return a.name.localeCompare(b.name);
      return a.projectId - b.projectId;
    });

  const total = sorted.length;
  const totalPages = total === 0 ? 1 : Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = sorted.slice(start, start + limit).map((item) => ({
    projectId: item.projectId,
    type: item.type,
    name: item.name,
    shortDescription: item.shortDescription,
    imageUrl: item.imageUrl,
    rating: item.rating,
    reviewCount: item.reviewCount,
    location: item.location,
  }));

  return { total, page, limit, totalPages, data };
}

export async function fetchLocations(params) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.type) query.set("type", params.type);
  if (params.sort) query.set("sort", params.sort);

  try {
    return await requestJson(`/locations?${query.toString()}`);
  } catch (error) {
    if (!isNetworkError(error)) {
      throw error;
    }
    return filterMockLocations(params);
  }
}

export async function fetchLocation(projectId) {
  try {
    return await requestJson(`/locations/${projectId}`);
  } catch (error) {
    if (!isNetworkError(error)) {
      throw error;
    }
    const fallback = mockLocations.find((location) => location.projectId === projectId);
    if (!fallback) {
      throw new Error("Location not found");
    }
    return {
      ...fallback,
      similarLocations: mockLocations
        .filter((item) => item.projectId !== projectId && item.type === fallback.type)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3)
        .map(({ projectId: id, type, name, shortDescription, imageUrl, rating, reviewCount, location }) => ({
          projectId: id,
          type,
          name,
          shortDescription,
          imageUrl,
          rating,
          reviewCount,
          location,
        })),
    };
  }
}

export async function sendOtp(payload) {
  try {
    return await requestJson("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (!isNetworkError(error)) {
      throw error;
    }
    return { message: "OTP sent", devOtp: "123456" };
  }
}

export async function verifyOtp(payload) {
  try {
    return await requestJson("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (!isNetworkError(error)) {
      throw error;
    }
    return {
      token: "dev-token",
      userId: "dev-user",
      name: payload.name,
      role: payload.role || "USER",
    };
  }
}

export async function fetchMyBookings(token) {
  if (!token) {
    return mockBookings;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/bookings/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to load bookings");
    const payload = await response.json();
    return payload.data;
  } catch (error) {
    if (!isNetworkError(error)) {
      throw error;
    }
    return mockBookings;
  }
}

export async function createBooking(token, payload) {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Booking creation failed";
    try {
      const payload = await response.json();
      if (payload?.message) {
        message = payload.message;
      }
    } catch {}
    throw new Error(message);
  }

  return response.json();
}
