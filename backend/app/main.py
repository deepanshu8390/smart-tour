from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import admin, auth, bookings, locations
from app.core.exceptions import register_exception_handlers
from app.core.config import settings
from app.db.seed import seed_data


def create_app() -> FastAPI:
    app = FastAPI(title=settings.app_name)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_exception_handlers(app)
    app.include_router(auth.router, prefix="/auth", tags=["auth"])
    app.include_router(locations.router, prefix="/locations", tags=["locations"])
    app.include_router(bookings.router, prefix="/bookings", tags=["bookings"])
    app.include_router(admin.router, prefix="/admin", tags=["admin"])

    @app.on_event("startup")
    def _seed() -> None:
        seed_data()

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    return app


app = create_app()
