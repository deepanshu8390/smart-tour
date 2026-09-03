from __future__ import annotations

from abc import ABC, abstractmethod


class BaseBookingRepository(ABC):
    @abstractmethod
    def create(self, booking: dict) -> dict:
        raise NotImplementedError

    def create_idempotent(self, booking: dict, idempotency_key: str, request_hash: str) -> dict:
        raise NotImplementedError

    @abstractmethod
    def update(self, booking_id: str, updates: dict) -> dict | None:
        raise NotImplementedError

    @abstractmethod
    def get_by_id(self, booking_id: str) -> dict | None:
        raise NotImplementedError

    @abstractmethod
    def list_by_user(self, user_id: str) -> list[dict]:
        raise NotImplementedError

    @abstractmethod
    def list_all(self) -> list[dict]:
        raise NotImplementedError
