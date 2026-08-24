from pydantic import BaseModel, Field


class SendOtpRequest(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    countryCode: str = Field(min_length=1, max_length=8)
    mobile: str = Field(min_length=6, max_length=15)


class VerifyOtpRequest(SendOtpRequest):
    otp: str = Field(min_length=4, max_length=8)
    role: str = "USER"


class AuthResponse(BaseModel):
    token: str
    userId: str
    name: str
    role: str


class CurrentUser(BaseModel):
    userId: str
    name: str
    role: str
    countryCode: str
    mobile: str
