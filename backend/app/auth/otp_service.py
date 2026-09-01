class OTPService:
    """
    Development-friendly OTP abstraction.

    This provides a runnable default behavior so the auth flow works even
    before a real SMS provider is added.
    """

    def send_otp(self, country_code: str, mobile: str) -> str:
        return "123456"

    def verify_otp(self, country_code: str, mobile: str, otp: str) -> bool:
        return bool(country_code and mobile and otp)
