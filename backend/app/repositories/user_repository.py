from __future__ import annotations

from dataclasses import dataclass
from uuid import uuid4

from app.db.mongo import mongo_database


@dataclass
class UserRecord:
    id: str
    name: str
    countryCode: str
    mobile: str
    role: str


class UserRepository:
    def __init__(self) -> None:
        self.collection = mongo_database["users"]
        self.collection.create_index([("countryCode", 1), ("mobile", 1)], unique=True)

    def _to_record(self, document: dict) -> UserRecord:
        return UserRecord(
            id=document["id"],
            name=document["name"],
            countryCode=document["countryCode"],
            mobile=document["mobile"],
            role=document["role"],
        )

    def get_by_mobile(self, country_code: str, mobile: str) -> UserRecord | None:
        document = self.collection.find_one({"countryCode": country_code, "mobile": mobile})
        return self._to_record(document) if document else None

    def upsert(self, name: str, country_code: str, mobile: str, role: str = "USER") -> UserRecord:
        user_id = str(uuid4())
        self.collection.update_one(
            {"countryCode": country_code, "mobile": mobile},
            {
                "$set": {"name": name, "role": role or "USER"},
                "$setOnInsert": {
                    "id": user_id,
                    "countryCode": country_code,
                    "mobile": mobile,
                },
            },
            upsert=True,
        )
        document = self.collection.find_one({"countryCode": country_code, "mobile": mobile})
        return self._to_record(document)


user_repository = UserRepository()
