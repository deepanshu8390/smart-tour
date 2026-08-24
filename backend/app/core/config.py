from dataclasses import dataclass, field
import os


@dataclass(frozen=True)
class Settings:
    app_name: str = "Smart Tour API"
    jwt_secret: str = os.getenv("JWT_SECRET", "dev-secret-change-me")
    jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
    jwt_expiry_minutes: int = int(os.getenv("JWT_EXPIRY_MINUTES", "120"))
    cors_origins: list[str] = field(
        default_factory=lambda: [
            os.getenv("FRONTEND_ORIGIN", "http://localhost:3000"),
        ]
    )


settings = Settings()
