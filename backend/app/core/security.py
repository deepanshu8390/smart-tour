from datetime import datetime, timedelta, timezone
from typing import Any

import jwt

from app.core.config import settings
from app.core.exceptions import AppError


def create_access_token(payload: dict[str, Any]) -> str:
    token_payload = {
        **payload,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expiry_minutes),
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(token_payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> dict[str, Any]:
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except jwt.ExpiredSignatureError as exc:
        raise AppError("Token expired", 401, {"code": "TOKEN_EXPIRED"}) from exc
    except jwt.InvalidTokenError as exc:
        raise AppError("Invalid or expired token", 401) from exc
