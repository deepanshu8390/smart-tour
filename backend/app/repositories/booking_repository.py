from __future__ import annotations

from copy import deepcopy
from datetime import datetime, timezone
from uuid import uuid4

from app.db.mongo import mongo_database
from app.repositories.base_booking_repository import BaseBookingRepository


class BookingRepository(BaseBookingRepository):
    def __init__(self) -> None:
        self.collection = mongo_database["bookings"]
        self.collection.create_index([("userId", 1), ("createdAt", -1)])
        self.collection.create_index([("projectId", 1), ("bookingDate", 1)])
        self.collection.create_index("status")

    def create(self, booking: dict) -> dict:
        record = {
            **deepcopy(booking),
            "bookingDate": booking["bookingDate"].isoformat(),
            "id": str(uuid4()),
            "createdAt": datetime.now(timezone.utc),
        }
        self.collection.insert_one(record)
        return record

    def update(self, booking_id: str, updates: dict) -> dict | None:
        self.collection.update_one({"id": booking_id}, {"$set": deepcopy(updates)})
        return self.get_by_id(booking_id)

    def get_by_id(self, booking_id: str) -> dict | None:
        return self.collection.find_one({"id": booking_id}, {"_id": 0})

    def list_by_user(self, user_id: str) -> list[dict]:
        return list(self.collection.find({"userId": user_id}, {"_id": 0}).sort("createdAt", -1))

    def list_all(self) -> list[dict]:
        return list(self.collection.find({}, {"_id": 0}).sort("createdAt", -1))


booking_repository = BookingRepository()
