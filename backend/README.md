# Backend README

## Purpose
The backend is the main technical focus of Smart Tour. It owns authentication, location data, bookings, authorization, and the API contracts consumed by the frontend.

## Current Structure
```text
backend/
  app/
    api/
    auth/
    core/
    db/
    repositories/
    schemas/
    services/
    main.py
  requirements.txt
```

## Design
- Modular monolith
- Layered flow: `api -> services -> repositories`
- Pydantic validation at the request boundary
- JWT-based authentication
- RBAC for admin-only actions

## Key Behaviors
- `send-otp` and `verify-otp` issue a JWT-backed session
- `GET /locations` supports pagination, search, type filtering, and sort
- `GET /locations/{projectId}` returns full destination detail
- `POST /bookings` always derives user identity from JWT
- `GET /admin/bookings` is protected by admin authorization

## Image Strategy
- Location images are represented as Cloudinary URLs
- The backend returns render-ready image values so frontend components stay presentation-only

## Current Notes
- The current scaffold uses in-memory repositories for demo behavior
- The next backend step would be replacing repositories with MongoDB persistence while preserving the same API contracts

## Run
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
