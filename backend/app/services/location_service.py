from __future__ import annotations

from math import ceil

from app.core.exceptions import AppError
from app.repositories.location_repository import location_repository


class LocationService:
    def list_locations(
        self,
        page: int = 1,
        limit: int = 10,
        search: str | None = None,
        type_filter: str | None = None,
        sort: str | None = None,
    ) -> dict:
        if page < 1:
            raise AppError("page must be >= 1", 422)
        if limit < 1 or limit > 50:
            raise AppError("limit must be between 1 and 50", 422)

        items = location_repository.list_all()

        if search:
            query = search.lower()
            items = [
                item for item in items
                if query in item["name"].lower()
                or query in item["shortDescription"].lower()
                or query in item["description"].lower()
                or query in item["type"].lower()
            ]

        if type_filter and type_filter.lower() != "all":
            items = [item for item in items if item["type"].lower() == type_filter.lower()]

        if sort == "projectId_desc":
            items.sort(key=lambda item: item["projectId"], reverse=True)
        elif sort == "name_asc":
            items.sort(key=lambda item: item["name"].lower())
        elif sort == "rating_desc":
            items.sort(key=lambda item: item["rating"], reverse=True)
        else:
            items.sort(key=lambda item: item["projectId"])

        total = len(items)
        total_pages = ceil(total / limit) if total else 1
        start = (page - 1) * limit
        end = start + limit
        paged = items[start:end]

        return {
            "total": total,
            "page": page,
            "limit": limit,
            "totalPages": total_pages,
            "data": [
                {
                    "projectId": item["projectId"],
                    "type": item["type"],
                    "name": item["name"],
                    "shortDescription": item["shortDescription"],
                    "imageUrl": item["imageUrl"],
                    "rating": item["rating"],
                    "reviewCount": item["reviewCount"],
                    "location": item["location"],
                }
                for item in paged
            ],
        }

    def get_location(self, project_id: int) -> dict:
        location = location_repository.get_by_project_id(project_id)
        if not location:
            raise AppError("Location not found", 404)
        return location

    def create_location(self, payload: dict) -> dict:
        return location_repository.upsert(int(payload["projectId"]), payload)

    def update_location(self, project_id: int, payload: dict) -> dict:
        existing = location_repository.get_by_project_id(project_id)
        if not existing:
            raise AppError("Location not found", 404)
        updated = {**existing, **{key: value for key, value in payload.items() if value is not None}}
        return location_repository.upsert(project_id, updated)

    def delete_location(self, project_id: int) -> None:
        if not location_repository.delete(project_id):
            raise AppError("Location not found", 404)


location_service = LocationService()
