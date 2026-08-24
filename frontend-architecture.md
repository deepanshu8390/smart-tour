# Frontend Architecture

## Goal
Build a simple, clean, and functional Next.js frontend that presents the backend data clearly. The frontend should stay lightweight and avoid becoming the main engineering focus of the project.

## Core Principles
- Backend-driven UI
- Reusable components
- Minimal styling and motion
- No hardcoded location content inside components
- Loading, empty, and error states for all API-driven sections

## High-Level Structure
```text
src/
  components/
    Navbar/
    Hero/
    SearchBar/
    FilterPills/
    LocationGrid/
    LocationCard/
    HotLocations/
    HotLocationCard/
    Footer/
  pages/
    Home/
    LocationDetails/
    Login/
    MyBookings/
  services/
  api/
```

## Page Responsibilities

### Home
- Render navbar, hero, filters, popular destinations grid, hot locations row, and footer
- Fetch all visible content from backend APIs
- Keep the page simple and polished, not visually heavy

### Location Details
- Fetch full location data by `projectId`
- Render backend-provided hero, description, images, and booking content
- Do not duplicate location content in the frontend

### Login
- Handle OTP input flow only
- Keep the auth UI clean and short

### My Bookings
- Show authenticated user bookings from the backend
- Keep state and rendering simple

## Backend-Driven Data Flow
The frontend should not own location content.
- `GET /locations?page=1&limit=...` feeds the popular destinations grid
- `GET /locations?search=...` powers search
- `GET /locations?type=...` powers filter pills
- `GET /locations/{projectId}` powers the detail page
- Hot locations should also come from backend data and support incremental loading

This means components receive data through service hooks or page-level fetchers rather than static mock content embedded in JSX.

## Component Rules

### Navbar
- Show project name/logo
- Include Explore and Login/User area
- Stay responsive and minimal

### Hero
- Headline, short description, search input, and search button
- Search must be ready to connect to the backend query contract

### Filter Pills
- All, Beach, Mountains, Adventure, City
- Wire them to the backend `type` filter contract

### LocationGrid
- Paginated grid fed by API data
- Use reusable cards
- Support loading and empty states

### HotLocations
- Horizontal scrolling row on desktop and mobile
- Lazy-load additional items as the user scrolls
- Keep the interaction subtle and lightweight

### Footer
- Minimal project branding and links
- No extra marketing sections

## Cloudinary Image Handling
The frontend should never manage raw image storage.
- Image URLs come from backend responses
- The backend should already return Cloudinary image URLs
- Cards and detail pages only render the returned URLs

This keeps the frontend simple and avoids image-upload logic in the UI.

## State Management
Use the simplest approach that fits:
- Local state for input and basic UI interactions
- URL state for filters and pagination when useful
- Server state for API data

If data is fetched from the backend, the frontend should treat it as server state rather than copying it into local constants.

## UI Guidance
- Keep spacing consistent
- Use semantic headings
- Use buttons and links that are keyboard accessible
- Prefer subtle borders and whitespace over heavy shadows
- Avoid animation-heavy effects

## Error and Empty States
Each API-driven section should handle:
- Loading skeletons
- Empty results
- Error fallback with retry

## Design Principles Used
- **Separation of Concerns**: UI, data fetching, and presentation stay separate
- **Composition**: pages are built from small reusable components
- **KISS**: simple travel website presentation, not a dashboard
- **DRY**: cards, row items, and states are reused instead of duplicated
- **Backend-first rendering**: all meaningful content comes from APIs

## Why This Works
- The backend remains the technical showcase
- The UI stays clean and fast
- Location content is centralized in one place
- Cloudinary image URLs and API-fed components keep the frontend maintainable
