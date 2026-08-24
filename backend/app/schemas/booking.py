from datetime import date
from pydantic import BaseModel, Field


class BookingCreateRequest(BaseModel):
    projectId: int = Field(ge=1)
    bookingDate: date
    numberOfPeople: int = Field(ge=1, le=20)


class BookingResponse(BaseModel):
    id: str
    userId: str
    projectId: int
    locationName: str
    bookingDate: date
    numberOfPeople: int
    status: str


class BookingListResponse(BaseModel):
    data: list[BookingResponse]
