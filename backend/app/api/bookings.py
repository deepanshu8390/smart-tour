from fastapi import APIRouter, Depends

from app.core.deps import get_current_user
from app.schemas.booking import BookingCreateRequest, BookingListResponse, BookingResponse
from app.services.booking_service import booking_service


router = APIRouter()


@router.post("", response_model=BookingResponse)
def create_booking(payload: BookingCreateRequest, current_user=Depends(get_current_user)):
    return booking_service.create_booking(
        user_id=current_user.userId,
        project_id=payload.projectId,
        booking_date=payload.bookingDate,
        number_of_people=payload.numberOfPeople,
    )


@router.get("/my", response_model=BookingListResponse)
def list_my_bookings(current_user=Depends(get_current_user)):
    return {"data": booking_service.list_my_bookings(current_user.userId)}
