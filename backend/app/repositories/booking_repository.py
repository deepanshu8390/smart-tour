from __future__ import annotations

from copy import deepcopy
from datetime import datetime, timezone
from uuid import uuid4
from pymongo.errors import DuplicateKeyError

from app.db.mongo import mongo_database
from app.repositories.base_booking_repository import BaseBookingRepository


class BookingRepository(BaseBookingRepository):
    def __init__(self) -> None:
        self.collection = mongo_database["bookings"]
        self.collection.create_index([("userId", 1), ("createdAt", -1)])
        self.collection.create_index([("projectId", 1), ("bookingDate", 1)])
        self.collection.create_index("status")
        self.collection.create_index([("userId", 1), ("idempotencyKey", 1)], unique=True, sparse=True)

    def create(self, booking: dict) -> dict:
        record = {
            **deepcopy(booking),
            "bookingDate": booking["bookingDate"].isoformat(),
            "id": str(uuid4()),
            "createdAt": datetime.now(timezone.utc),
        }
        self.collection.insert_one(record)
        return record

    def create_idempotent(self, booking: dict, idempotency_key: str, request_hash: str) -> dict:
        record = {
            **deepcopy(booking),
            "bookingDate": booking["bookingDate"].isoformat(),
            "id": str(uuid4()),
            "idempotencyKey": idempotency_key,
            "requestHash": request_hash,
            "createdAt": datetime.now(timezone.utc),
        }
        try:
            self.collection.insert_one(record)
        except DuplicateKeyError:
            existing = self.collection.find_one(
                {"userId": booking["userId"], "idempotencyKey": idempotency_key},
                {"_id": 0},
            )
            if existing and existing.get("requestHash") != request_hash:
                from app.core.exceptions import AppError
                raise AppError("Idempotency key reused with different booking details", 409)
            if existing:
                return existing
            raise
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
