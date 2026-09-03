from datetime import datetime, timedelta, timezone
import hashlib
import secrets

from app.auth.mock_otp_service import MockOTPService
from app.auth.otp_service import OTPService
from app.core.config import settings
from app.core.exceptions import AppError
from app.core.security import create_access_token
from app.repositories.refresh_session_repository import refresh_session_repository
from app.repositories.user_repository import user_repository


class AuthService:
    def __init__(self, otp_service: OTPService | None = None) -> None:
        self.otp_service = otp_service or MockOTPService()

    def send_otp(self, name: str, country_code: str, mobile: str) -> dict:
        otp = self.otp_service.send_otp(country_code, mobile)
        return {"message": "OTP sent", "devOtp": otp}

    def verify_otp(self, name: str, country_code: str, mobile: str, otp: str, role: str = "USER") -> dict:
        if not self.otp_service.verify_otp(country_code, mobile, otp):
            raise AppError("Invalid OTP", 401)

        user = user_repository.upsert(name=name, country_code=country_code, mobile=mobile, role="USER")
        return self._issue_session(user)

    def _issue_session(self, user) -> dict:
        token = create_access_token({
            "userId": user.id,
            "name": user.name,
            "role": "USER",
            "countryCode": user.countryCode,
            "mobile": user.mobile,
        })
        refresh_token = secrets.token_urlsafe(48)
        refresh_session_repository.create(
            user.id,
            hashlib.sha256(refresh_token.encode()).hexdigest(),
            datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expiry_days),
        )
        return {"token": token, "refreshToken": refresh_token, "userId": user.id, "name": user.name, "role": "USER"}

    def refresh(self, refresh_token: str) -> dict:
        token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
        session = refresh_session_repository.get_active(token_hash)
        if not session:
            raise AppError("Unauthorized", 401)
        user = user_repository.get_by_id(session["userId"])
        if not user:
            raise AppError("Unauthorized", 401)
        refresh_session_repository.revoke(token_hash)
        return self._issue_session(user)

    def logout(self, refresh_token: str | None) -> None:
        if refresh_token:
            refresh_session_repository.revoke(hashlib.sha256(refresh_token.encode()).hexdigest())


auth_service = AuthService()
