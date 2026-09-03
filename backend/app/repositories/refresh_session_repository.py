from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from app.db.mongo import mongo_database


class RefreshSessionRepository:
    def __init__(self) -> None:
        self.collection = mongo_database["refresh_sessions"]
        self.collection.create_index("tokenHash", unique=True)
        self.collection.create_index("expiresAt", expireAfterSeconds=0)

    def create(self, user_id: str, token_hash: str, expires_at: datetime) -> None:
        self.collection.insert_one({
            "id": str(uuid4()),
            "userId": user_id,
            "tokenHash": token_hash,
            "createdAt": datetime.now(timezone.utc),
            "expiresAt": expires_at,
            "revokedAt": None,
        })

    def get_active(self, token_hash: str) -> dict | None:
        return self.collection.find_one({
            "tokenHash": token_hash,
            "revokedAt": None,
            "expiresAt": {"$gt": datetime.now(timezone.utc)},
        }, {"_id": 0})

    def revoke(self, token_hash: str) -> None:
        self.collection.update_one(
            {"tokenHash": token_hash, "revokedAt": None},
            {"$set": {"revokedAt": datetime.now(timezone.utc)}},
        )


refresh_session_repository = RefreshSessionRepository()
