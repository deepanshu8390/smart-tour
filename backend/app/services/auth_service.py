from app.auth.mock_otp_service import MockOTPService
from app.auth.otp_service import OTPService
from app.core.exceptions import AppError
from app.core.security import create_access_token
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

        user = user_repository.upsert(name=name, country_code=country_code, mobile=mobile, role=role)
        token = create_access_token(
            {
                "userId": user.id,
                "name": user.name,
                "role": user.role,
                "countryCode": user.countryCode,
                "mobile": user.mobile,
            }
        )
        return {"token": token, "userId": user.id, "name": user.name, "role": user.role}


auth_service = AuthService()
