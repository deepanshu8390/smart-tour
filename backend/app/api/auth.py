from fastapi import APIRouter, Cookie, Response
from fastapi.responses import JSONResponse

from app.core.exceptions import AppError
from app.core.config import settings
from app.schemas.auth import AuthResponse, SendOtpRequest, VerifyOtpRequest
from app.services.auth_service import auth_service


router = APIRouter()
REFRESH_COOKIE = "smart_tour_refresh"


def _set_refresh_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        REFRESH_COOKIE,
        token,
        httponly=True,
        secure=settings.app_env not in {"development", "test"},
        samesite="lax",
        max_age=settings.refresh_token_expiry_days * 24 * 60 * 60,
    )


@router.post("/send-otp")
def send_otp(payload: SendOtpRequest):
    return auth_service.send_otp(payload.name, payload.countryCode, payload.mobile)


@router.post("/verify-otp", response_model=AuthResponse)
def verify_otp(payload: VerifyOtpRequest):
    auth = auth_service.verify_otp(payload.name, payload.countryCode, payload.mobile, payload.otp)
    refresh_token = auth.pop("refreshToken")
    response = JSONResponse(content=auth)
    _set_refresh_cookie(response, refresh_token)
    return response


@router.post("/refresh", response_model=AuthResponse)
def refresh(smart_tour_refresh: str | None = Cookie(default=None)):
    if not smart_tour_refresh:
        raise AppError("Unauthorized", 401)
    auth = auth_service.refresh(smart_tour_refresh)
    refresh_token = auth.pop("refreshToken")
    response = JSONResponse(content=auth)
    _set_refresh_cookie(response, refresh_token)
    return response


@router.post("/logout")
def logout(response: Response, smart_tour_refresh: str | None = Cookie(default=None)):
    auth_service.logout(smart_tour_refresh)
    response.delete_cookie(REFRESH_COOKIE)
    return {"message": "Logged out"}
