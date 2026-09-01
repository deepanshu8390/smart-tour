from __future__ import annotations

from abc import ABC, abstractmethod


class BaseLocationRepository(ABC):
    @abstractmethod
    def seed(self, items: list[dict]) -> None:
        raise NotImplementedError

    @abstractmethod
    def count(self) -> int:
        raise NotImplementedError

    @abstractmethod
    def list_all(self) -> list[dict]:
        raise NotImplementedError

    @abstractmethod
    def get_by_project_id(self, project_id: int) -> dict | None:
        raise NotImplementedError

    @abstractmethod
    def upsert(self, project_id: int, payload: dict) -> dict:
        raise NotImplementedError

    @abstractmethod
    def delete(self, project_id: int) -> bool:
        raise NotImplementedError
