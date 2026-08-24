# Frontend README

## Purpose
The frontend is intentionally lightweight. It presents backend data cleanly without becoming the main engineering story of the project.

## Current Structure
```text
frontend/
  src/
    app/
    components/
    services/
  package.json
  jsconfig.json
  next.config.mjs
```

## Design Rules
- Keep the UI simple and clean
- Use reusable components
- Avoid hardcoded destination content inside components
- Treat backend responses as the source of truth
- Show loading, empty, and error states for API-driven views

## Main Pages
- `/` landing page
- `/locations/[projectId]` location detail page
- `/login` auth page
- `/my-bookings` bookings page

## Data Flow
- `src/services/api.js` is the API access layer
- Components render data returned by the backend
- Mock fallback is only used for network-unavailable development scenarios

## Image Strategy
- The frontend does not manage uploads or local destination assets
- Cloudinary image URLs come from backend responses and are rendered directly

## Run
```bash
cd frontend
npm install
npm run dev
```

## Aliases
`jsconfig.json` maps `@/*` to `src/*`, so imports like `@/components/Navbar` work across the app.
