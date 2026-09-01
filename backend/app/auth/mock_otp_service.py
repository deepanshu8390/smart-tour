from app.auth.otp_service import OTPService


class MockOTPService(OTPService):
    def send_otp(self, country_code: str, mobile: str) -> str:
        return super().send_otp(country_code, mobile)

    def verify_otp(self, country_code: str, mobile: str, otp: str) -> bool:
        return super().verify_otp(country_code, mobile, otp)
