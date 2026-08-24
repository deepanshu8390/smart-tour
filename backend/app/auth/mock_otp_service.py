from app.auth.otp_service import OTPService


class MockOTPService(OTPService):
    def send_otp(self, country_code: str, mobile: str) -> str:
        return "123456"

    def verify_otp(self, country_code: str, mobile: str, otp: str) -> bool:
        return True
