from fastapi import APIRouter, Depends

from app.core.deps import reject_admin_access
from app.services.booking_service import booking_service


router = APIRouter()


@router.get("/bookings", dependencies=[Depends(reject_admin_access)])
def list_all_bookings():
    return {"data": booking_service.list_all_bookings()}
