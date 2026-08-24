# Backend Architecture

## Goal
Build a FastAPI backend that stays simple, interview-friendly, and clearly backend-first. The backend is the source of truth for location content, authentication, booking state, and all data shown in the frontend.

## Core Principles
- Modular monolith, not microservices
- Clear separation of `routes`, `services`, `repositories`, and `db/adapters`
- Pydantic for validation at the API boundary
- JWT-based auth with RBAC
- MongoDB as the primary database
- Keep the UI contract backend-driven so frontend components only render API data

## High-Level Structure
```text
backend/
  app/
    main.py
    api/
      auth.py
      locations.py
      bookings.py
      admin.py
    services/
      auth_service.py
      location_service.py
      booking_service.py
      notification_service.py
    repositories/
      user_repository.py
      location_repository.py
      booking_repository.py
    schemas/
      auth.py
      location.py
      booking.py
      common.py
    core/
      config.py
      security.py
      exceptions.py
      deps.py
    auth/
      otp_service.py
      mock_otp_service.py
    adapters/
      mongo_adapter.py
    db/
      mongo.py
      indexes.py
```

## Responsibilities By Layer

### Routes
- Expose HTTP endpoints only
- Parse request models and return response models
- Never hold business logic

### Services
- Contain booking, auth, search, and location business rules
- Coordinate repositories, notifications, and validation rules
- Keep controller code thin

### Repositories
- Handle MongoDB reads and writes
- Encapsulate query construction, sorting, pagination, and filtering
- Hide persistence details from services

### Core
- JWT creation and verification
- RBAC dependency helpers
- Centralized exception handling
- App configuration and environment variables

## Collections
Use only the core collections the project needs:
- `users`
- `locations`
- `bookings`

## Data and API Design

### Locations
- `GET /locations`
  - Supports `page`, `limit`, `search`, `type`, and `sort`
  - Returns pagination metadata plus a data array
- `GET /locations/{projectId}`
  - Returns the full detail payload for one location
- Admin-only CRUD endpoints can be added in the same module

### Bookings
- `POST /bookings`
- `GET /bookings/my`
- The authenticated user ID always comes from the JWT, never from request body

### Authentication
- `POST /auth/send-otp`
- `POST /auth/verify-otp`
- OTP service should be abstracted so the mock provider can later be replaced with a real SMS provider

## Cloudinary Image Flow
The known image handling decision is:
- Store location images in Cloudinary
- Save the Cloudinary URL or public ID in the location document
- Return Cloudinary-backed image URLs in the location APIs
- Keep image handling in the backend so frontend components only consume ready-to-render URLs

This keeps the frontend simple and avoids hardcoding image assets in UI components.

## Backend-Driven Frontend Contract
The frontend must be treated as a presentation layer only.
- Location cards get all content from `GET /locations`
- Hot locations also come from backend responses
- Detail pages fetch the full record from `GET /locations/{projectId}`
- No location-specific content should be hardcoded in React components

## Indexes and Validation
- Unique index on `countryCode + mobile`
- Index on `projectId`
- Index on `type`
- Indexes for commonly searched location fields
- Index on `userId` for bookings
- Validate pagination, IDs, booking payloads, and auth input with Pydantic

## Error Handling
Use centralized JSON errors for:
- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `409 Conflict`
- `422 Validation Error`
- `500 Internal Server Error`

## Design Principles Used
- **Single Responsibility**: each module does one thing
- **Repository Pattern**: persistence is isolated
- **Adapter Pattern**: MongoDB access is wrapped so storage can change later
- **Dependency Inversion**: auth and notification logic depend on abstractions
- **KISS / YAGNI**: no unnecessary collections, services, or infrastructure

## Why This Works
- Easy to explain in interviews
- Clean separation of concerns
- Strong backend signal without over-engineering
- Frontend can stay lightweight because all data arrives from the API
