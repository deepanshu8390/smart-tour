from fastapi import APIRouter

from app.schemas.auth import AuthResponse, SendOtpRequest, VerifyOtpRequest
from app.services.auth_service import auth_service


router = APIRouter()


@router.post("/send-otp")
def send_otp(payload: SendOtpRequest):
    return auth_service.send_otp(payload.name, payload.countryCode, payload.mobile)


@router.post("/verify-otp", response_model=AuthResponse)
def verify_otp(payload: VerifyOtpRequest):
    return auth_service.verify_otp(payload.name, payload.countryCode, payload.mobile, payload.otp, payload.role)
