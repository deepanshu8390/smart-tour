from fastapi import APIRouter, Depends

from app.core.deps import require_admin
from app.services.booking_service import booking_service


router = APIRouter()


@router.get("/bookings", dependencies=[Depends(require_admin)])
def list_all_bookings():
    return {"data": booking_service.list_all_bookings()}
