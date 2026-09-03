from fastapi import APIRouter, Depends, Query

from app.core.deps import reject_admin_access
from app.schemas.location import LocationCreateRequest, LocationDetail, LocationListResponse, LocationUpdateRequest
from app.services.location_service import location_service


router = APIRouter()


@router.get("", response_model=LocationListResponse)
def list_locations(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=50),
    search: str | None = None,
    type: str | None = None,
    sort: str | None = None,
):
    return location_service.list_locations(page=page, limit=limit, search=search, type_filter=type, sort=sort)


@router.get("/{project_id}", response_model=LocationDetail)
def get_location(project_id: int):
    return location_service.get_location(project_id)


@router.post("", response_model=LocationDetail, dependencies=[Depends(reject_admin_access)])
def create_location(payload: LocationCreateRequest):
    return location_service.create_location(payload.model_dump())


@router.put("/{project_id}", response_model=LocationDetail, dependencies=[Depends(reject_admin_access)])
def update_location(project_id: int, payload: LocationUpdateRequest):
    return location_service.update_location(project_id, payload.model_dump(exclude_none=True))


@router.delete("/{project_id}", dependencies=[Depends(reject_admin_access)])
def delete_location(project_id: int):
    location_service.delete_location(project_id)
    return {"message": "Location deleted"}
