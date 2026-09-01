from __future__ import annotations

from copy import deepcopy
from dataclasses import dataclass, field
from uuid import uuid4

from app.repositories.base_booking_repository import BaseBookingRepository


@dataclass
class BookingRepository(BaseBookingRepository):
    bookings: list[dict] = field(default_factory=list)

    def create(self, booking: dict) -> dict:
        record = {**deepcopy(booking), "id": str(uuid4())}
        self.bookings.append(record)
        return deepcopy(record)

    def update(self, booking_id: str, updates: dict) -> dict | None:
        for index, booking in enumerate(self.bookings):
            if booking["id"] == booking_id:
                merged = {**booking, **deepcopy(updates)}
                self.bookings[index] = merged
                return deepcopy(merged)
        return None

    def get_by_id(self, booking_id: str) -> dict | None:
        for booking in self.bookings:
            if booking["id"] == booking_id:
                return deepcopy(booking)
        return None

    def list_by_user(self, user_id: str) -> list[dict]:
        return [deepcopy(item) for item in self.bookings if item["userId"] == user_id]

    def list_all(self) -> list[dict]:
        return [deepcopy(item) for item in self.bookings]


booking_repository = BookingRepository()
