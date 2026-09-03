from dataclasses import dataclass, field
import os


@dataclass(frozen=True)
class Settings:
    app_name: str = "Smart Tour API"
    app_env: str = os.getenv("APP_ENV", "development").lower()
    mongo_uri: str = os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017")
    mongo_database: str = os.getenv("MONGO_DATABASE", "smart_tour")
    jwt_secret: str = os.getenv("JWT_SECRET", "dev-secret-change-me")
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    jwt_expiry_minutes: int = int(os.getenv("JWT_EXPIRY_MINUTES", "10080"))
    refresh_token_expiry_days: int = int(os.getenv("REFRESH_TOKEN_EXPIRY_DAYS", "30"))
    cors_origins: list[str] = field(
        default_factory=lambda: [
            os.getenv("FRONTEND_ORIGIN", "http://localhost:3000"),
            "http://localhost:3002",
        ]
    )


settings = Settings()

if settings.app_env not in {"development", "test"} and settings.jwt_secret == "dev-secret-change-me":
    raise RuntimeError("JWT_SECRET must be configured outside development and test environments")
