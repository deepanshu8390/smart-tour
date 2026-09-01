from __future__ import annotations

from copy import deepcopy
from dataclasses import dataclass, field

from app.repositories.base_location_repository import BaseLocationRepository


@dataclass
class MongoLocationRepository(BaseLocationRepository):
    """
    Mongo-style adapter for locations.

    The current scaffold uses an in-memory store, but the service depends on the
    repository contract rather than direct storage access. This keeps the API
    layer unchanged when swapped to a real Mongo collection later.
    """

    documents: dict[int, dict] = field(default_factory=dict)

    def seed(self, items: list[dict]) -> None:
        for item in items:
            self.documents[int(item["projectId"])] = deepcopy(item)

    def count(self) -> int:
        return len(self.documents)

    def list_all(self) -> list[dict]:
        return [deepcopy(item) for item in self.documents.values()]

    def get_by_project_id(self, project_id: int) -> dict | None:
        item = self.documents.get(project_id)
        return deepcopy(item) if item else None

    def upsert(self, project_id: int, payload: dict) -> dict:
        self.documents[project_id] = deepcopy(payload)
        return deepcopy(payload)

    def delete(self, project_id: int) -> bool:
        return self.documents.pop(project_id, None) is not None
