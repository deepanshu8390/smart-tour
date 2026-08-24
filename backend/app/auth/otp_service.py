class OTPService:
    def send_otp(self, country_code: str, mobile: str) -> str:
        raise NotImplementedError

    def verify_otp(self, country_code: str, mobile: str, otp: str) -> bool:
        raise NotImplementedError
