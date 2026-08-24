from __future__ import annotations

from dataclasses import dataclass, field
from copy import deepcopy


@dataclass
class LocationRepository:
    locations: dict[int, dict] = field(default_factory=dict)

    def seed(self, items: list[dict]) -> None:
        for item in items:
            self.locations[int(item["projectId"])] = deepcopy(item)

    def count(self) -> int:
        return len(self.locations)

    def list_all(self) -> list[dict]:
        return [deepcopy(item) for item in self.locations.values()]

    def get_by_project_id(self, project_id: int) -> dict | None:
        item = self.locations.get(project_id)
        return deepcopy(item) if item else None

    def upsert(self, project_id: int, payload: dict) -> dict:
        self.locations[project_id] = deepcopy(payload)
        return deepcopy(payload)

    def delete(self, project_id: int) -> bool:
        return self.locations.pop(project_id, None) is not None


location_repository = LocationRepository()
