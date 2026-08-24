# Smart Tour

Smart Tour is a backend-driven tour booking demo built with FastAPI and Next.js. The goal of the project is to keep the UI simple while showcasing backend architecture, authentication, pagination, search/filtering, bookings, and clean module boundaries.

## Stack
- Frontend: Next.js with JavaScript
- Backend: FastAPI with Pydantic
- Data model: `users`, `locations`, `bookings`
- Images: Cloudinary URLs returned by backend APIs

## Project Structure
```text
smart-tour/
  backend/
  frontend/
  README.md
  backend-architecture.md
  frontend-architecture.md
```

## Backend Highlights
- JWT auth with OTP-style login flow
- RBAC support for `USER` and `ADMIN`
- Location listing with pagination, search, filter, and sort
- Booking creation tied to authenticated user identity
- Centralized error handling and layered architecture

## Frontend Highlights
- Simple landing page with hero, filters, popular destinations, and hot locations
- Location details page fed by backend data
- Login page for OTP-based auth flow
- My bookings page for authenticated users
- Mock fallback only when the backend is unavailable on the network

## Main API Endpoints
- `POST /auth/send-otp`
- `POST /auth/verify-otp`
- `GET /locations`
- `GET /locations/{projectId}`
- `POST /locations` for admin
- `PUT /locations/{projectId}` for admin
- `DELETE /locations/{projectId}` for admin
- `POST /bookings`
- `GET /bookings/my`
- `GET /admin/bookings`

## Local Run

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend expects the backend at `http://localhost:8000` by default through `NEXT_PUBLIC_API_BASE_URL`.

## Docs
- [backend-architecture.md](./backend-architecture.md)
- [frontend-architecture.md](./frontend-architecture.md)
- [backend/README.md](./backend/README.md)
- [frontend/README.md](./frontend/README.md)
