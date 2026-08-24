from __future__ import annotations

from dataclasses import dataclass, field
from copy import deepcopy
from uuid import uuid4


@dataclass
class BookingRepository:
    bookings: list[dict] = field(default_factory=list)

    def create(self, booking: dict) -> dict:
        record = {**deepcopy(booking), "id": str(uuid4())}
        self.bookings.append(record)
        return deepcopy(record)

    def list_by_user(self, user_id: str) -> list[dict]:
        return [deepcopy(item) for item in self.bookings if item["userId"] == user_id]

    def list_all(self) -> list[dict]:
        return [deepcopy(item) for item in self.bookings]


booking_repository = BookingRepository()
