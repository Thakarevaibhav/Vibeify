# Vibeify Backend API

Node.js + Express + TypeScript + MongoDB

## Setup

```bash
npm install
cp .env.example .env    # edit MONGO_URI, JWT_SECRET, ADMIN_PASSWORD
npm run seed            # seed DB with initial celebrities, events, gallery
npm run dev             # dev server on http://localhost:4000
```

## .env keys

| Key | Default | Notes |
|-----|---------|-------|
| PORT | 4000 | |
| MONGO_URI | mongodb://localhost:27017/vibeify | |
| FRONTEND_ORIGIN | http://localhost:5173 | comma-separated for multiple |
| JWT_SECRET | — | **Required**, 64+ random chars |
| JWT_EXPIRES_IN | 7d | |
| ADMIN_EMAIL | admin@vibeify.in | first-run seed only |
| ADMIN_PASSWORD | ChangeMe@123 | **Change this!** |
| MAX_FILE_SIZE_MB | 10 | |

## API Endpoints

### Public
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | Health check |
| GET | /api/celebrities | List celebrities (filter: category, sort, q, maxPrice, page, limit) |
| GET | /api/celebrities/:slug | Single celebrity |
| GET | /api/events | List events (filter: status, category, page, limit) |
| GET | /api/events/:slug | Single event |
| GET | /api/gallery | List gallery (filter: category, page, limit) |
| GET | /api/gallery/:id | Single gallery item |
| POST | /api/bookings | Submit booking inquiry |
| POST | /api/contact | Submit contact message |

### Admin (Bearer token required)
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/admin/login | Login → get JWT |
| GET | /api/admin/me | My profile |
| POST | /api/admin/change-password | Change password |
| POST | /api/celebrities | Create celebrity (multipart, field: image) |
| PUT | /api/celebrities/:id | Update celebrity |
| DELETE | /api/celebrities/:id | Soft-delete |
| GET | /api/celebrities/admin/all | All incl. inactive |
| POST | /api/events | Create event (multipart, field: image) |
| PUT | /api/events/:id | Update event |
| DELETE | /api/events/:id | Soft-delete |
| GET | /api/events/admin/all | All incl. inactive |
| POST | /api/gallery | Upload single image |
| POST | /api/gallery/bulk | Upload multiple (field: images[]) |
| PUT | /api/gallery/:id | Update metadata |
| PATCH | /api/gallery/reorder | Bulk reorder `{ items: [{id, sortOrder}] }` |
| DELETE | /api/gallery/:id | Soft-delete |
| GET | /api/gallery/admin/all | All incl. inactive |
| GET | /api/bookings | List bookings (filter: status) |
| GET | /api/bookings/:id | Single booking |
| PATCH | /api/bookings/:id/status | Update status |
| DELETE | /api/bookings/:id | Delete booking |
| GET | /api/contact | List messages (filter: status) |
| GET | /api/contact/:id | Single message (auto marks read) |
| PATCH | /api/contact/:id/status | Update status |
| DELETE | /api/contact/:id | Delete message |
| POST | /api/upload | Upload single image → get URL |
| POST | /api/upload/multiple | Upload up to 20 images |
| GET | /api/upload | List all uploads |

## Connect Frontend

In your React `.env`:
```
VITE_API_URL=http://localhost:4000
```

Example usage:
```ts
// Submit booking
await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ eventType, celebId, budget, date, location, name, email, phone, notes }),
});

// Admin login
const { data } = await fetch(`${VITE_API_URL}/api/admin/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
}).then(r => r.json());
localStorage.setItem("token", data.token);

// Upload image (admin)
const form = new FormData();
form.append("image", file);
await fetch(`${VITE_API_URL}/api/upload`, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}` },
  body: form,
});
```

## Production

```bash
npm run build
npm start
```
