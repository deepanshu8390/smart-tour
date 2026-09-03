from fastapi import APIRouter, Depends, Header

from app.core.deps import get_current_user
from app.schemas.booking import BookingCreateRequest, BookingListResponse, BookingResponse
from app.services.booking_service import booking_service


router = APIRouter()


@router.post("", response_model=BookingResponse)
def create_booking(payload: BookingCreateRequest, current_user=Depends(get_current_user), idempotency_key: str | None = Header(default=None, alias="Idempotency-Key")):
    if not idempotency_key:
        from app.core.exceptions import AppError
        raise AppError("Idempotency-Key header is required", 400)
    return booking_service.create_booking(
        user_id=current_user.userId,
        project_id=payload.projectId,
        booking_date=payload.bookingDate,
        number_of_people=payload.numberOfPeople,
        idempotency_key=idempotency_key,
    )


@router.get("/my", response_model=BookingListResponse)
def list_my_bookings(current_user=Depends(get_current_user)):
    return {"data": booking_service.list_my_bookings(current_user.userId)}
