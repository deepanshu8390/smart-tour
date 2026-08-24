from fastapi import Depends, Header

from app.core.exceptions import AppError
from app.core.security import decode_access_token
from app.schemas.auth import CurrentUser


def get_current_user(authorization: str | None = Header(default=None)) -> CurrentUser:
    if not authorization or not authorization.startswith("Bearer "):
        raise AppError("Unauthorized", 401)

    token = authorization.removeprefix("Bearer ").strip()
    payload = decode_access_token(token)
    return CurrentUser(
        userId=payload["userId"],
        name=payload["name"],
        role=payload["role"],
        countryCode=payload["countryCode"],
        mobile=payload["mobile"],
    )


def require_admin(current_user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
    if current_user.role != "ADMIN":
        raise AppError("Forbidden", 403)
    return current_user
