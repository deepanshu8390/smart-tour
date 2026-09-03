from datetime import date
from pydantic import BaseModel, Field, field_validator

from app.state.booking_state import BookingStatus


class BookingCreateRequest(BaseModel):
    projectId: int = Field(ge=1)
    bookingDate: date
    numberOfPeople: int = Field(ge=1, le=20)

    @field_validator("bookingDate")
    @classmethod
    def booking_date_must_not_be_in_past(cls, value: date) -> date:
        if value < date.today():
            raise ValueError("bookingDate must be today or later")
        return value


class BookingResponse(BaseModel):
    id: str
    userId: str
    projectId: int
    locationName: str
    bookingDate: date
    numberOfPeople: int
    status: BookingStatus


class BookingListResponse(BaseModel):
    data: list[BookingResponse]
