const BASE = (import.meta.env.VITE_API_URL || "http://localhost:4000") + "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("vibeify_token");
  const headers: HeadersInit = { "Content-Type": "application/json", ...(options?.headers || {}) };
  if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Request failed");
  return json;
}

// -- Celebrities --
export interface Celebrity {
  _id: string;
  slug: string;
  name: string;
  category: string;
  imageUrl: string;
  bio: string;
  followers: string;
  popularity: number;
  priceRange: number;
  pastEvents: string[];
  tags: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: { total: number; page: number; limit: number; pages: number };
}

export const getCelebrities = (params?: Record<string, string>) => {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return request<PaginatedResponse<Celebrity>>(`/celebrities${qs}`);
};

// -- Events --
export interface VEvent {
  _id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  location: string;
  imageUrl: string;
  description: string;
  headliners: string[];
  status: "upcoming" | "past";
  attendance?: string;
}

export const getEvents = (params?: Record<string, string>) => {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return request<PaginatedResponse<VEvent>>(`/events${qs}`);
};

// -- Gallery --
export interface GalleryItem {
  _id: string;
  imageUrl: string;
  title: string;
  category: string;
}

export const getGallery = (params?: Record<string, string>) => {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return request<PaginatedResponse<GalleryItem>>(`/gallery${qs}`);
};

// -- Booking --
export interface BookingPayload {
  eventType: string;
  celebId?: string;
  budget: string;
  date: string;
  location: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

export const submitBooking = (payload: BookingPayload) =>
  request<{ success: boolean; message: string }>("/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// -- Contact --
export interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export const submitContact = (payload: ContactPayload) =>
  request<{ success: boolean; message: string }>("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// ─── Admin Auth ───────────────────────────────────────────────────────────────
export const adminLogin = (email: string, password: string) =>
  request<{ success: boolean; data: { token: string; admin: { id: string; email: string; name: string } } }>("/admin/login", {
    method: "POST", body: JSON.stringify({ email, password }),
  });

export const adminMe = () =>
  request<{ success: boolean; data: { _id: string; email: string; name: string } }>("/admin/me");

// ─── Admin: Celebrities ───────────────────────────────────────────────────────
export const adminGetCelebrities = () =>
  request<{ success: boolean; data: Celebrity[] }>("/celebrities/admin/all");

export const adminCreateCelebrity = (form: FormData) => {
  const token = localStorage.getItem("vibeify_token");
  return fetch(`${BASE}/celebrities`, {
    method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  }).then(r => r.json()).then(j => { if (!j.success) throw new Error(j.message); return j; });
};

export const adminUpdateCelebrity = (id: string, form: FormData) => {
  const token = localStorage.getItem("vibeify_token");
  return fetch(`${BASE}/celebrities/${id}`, {
    method: "PUT", headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  }).then(r => r.json()).then(j => { if (!j.success) throw new Error(j.message); return j; });
};

export const adminDeleteCelebrity = (id: string) =>
  request<{ success: boolean }>(`/celebrities/${id}`, { method: "DELETE" });

// ─── Admin: Events ────────────────────────────────────────────────────────────
export const adminGetEvents = () =>
  request<{ success: boolean; data: VEvent[] }>("/events/admin/all");

export const adminCreateEvent = (form: FormData) => {
  const token = localStorage.getItem("vibeify_token");
  return fetch(`${BASE}/events`, {
    method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  }).then(r => r.json()).then(j => { if (!j.success) throw new Error(j.message); return j; });
};

export const adminUpdateEvent = (id: string, form: FormData) => {
  const token = localStorage.getItem("vibeify_token");
  return fetch(`${BASE}/events/${id}`, {
    method: "PUT", headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  }).then(r => r.json()).then(j => { if (!j.success) throw new Error(j.message); return j; });
};

export const adminDeleteEvent = (id: string) =>
  request<{ success: boolean }>(`/events/${id}`, { method: "DELETE" });

// ─── Admin: Gallery ───────────────────────────────────────────────────────────
export const adminGetGallery = () =>
  request<{ success: boolean; data: GalleryItem[] }>("/gallery/admin/all");

export const adminUploadGallery = (form: FormData) => {
  const token = localStorage.getItem("vibeify_token");
  return fetch(`${BASE}/gallery`, {
    method: "POST", headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  }).then(r => r.json()).then(j => { if (!j.success) throw new Error(j.message); return j; });
};

export const adminDeleteGallery = (id: string) =>
  request<{ success: boolean }>(`/gallery/${id}`, { method: "DELETE" });

// ─── Admin: Bookings ──────────────────────────────────────────────────────────
export interface Booking {
  _id: string; eventType: string; celebId?: string; budget: string;
  date: string; location: string; name: string; email: string; phone: string;
  notes?: string; status: string; createdAt: string;
}

export const adminGetBookings = (params?: Record<string, string>) => {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return request<PaginatedResponse<Booking>>(`/bookings${qs}`);
};

export const adminUpdateBookingStatus = (id: string, status: string) =>
  request<{ success: boolean }>(`/bookings/${id}/status`, {
    method: "PATCH", body: JSON.stringify({ status }),
  });

export const adminDeleteBooking = (id: string) =>
  request<{ success: boolean }>(`/bookings/${id}`, { method: "DELETE" });

// ─── Admin: Contacts ──────────────────────────────────────────────────────────
export interface ContactMsg {
  _id: string; name: string; email: string; message: string;
  status: string; createdAt: string;
}

export const adminGetContacts = (params?: Record<string, string>) => {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  return request<PaginatedResponse<ContactMsg>>(`/contact${qs}`);
};

export const adminDeleteContact = (id: string) =>
  request<{ success: boolean }>(`/contact/${id}`, { method: "DELETE" });
