from __future__ import annotations

from copy import deepcopy

from app.db.mongo import mongo_database
from app.repositories.base_location_repository import BaseLocationRepository


class MongoLocationRepository(BaseLocationRepository):
    def __init__(self) -> None:
        self.collection = mongo_database["locations"]

    def seed(self, items: list[dict]) -> None:
        for item in items:
            self.collection.replace_one(
                {"projectId": int(item["projectId"])},
                deepcopy(item),
                upsert=True,
            )

    def count(self) -> int:
        return self.collection.count_documents({})

    def list_all(self) -> list[dict]:
        return list(self.collection.find({}, {"_id": 0}))

    def get_by_project_id(self, project_id: int) -> dict | None:
        return self.collection.find_one({"projectId": project_id}, {"_id": 0})

    def upsert(self, project_id: int, payload: dict) -> dict:
        document = {**deepcopy(payload), "projectId": project_id}
        self.collection.replace_one({"projectId": project_id}, document, upsert=True)
        return document

    def delete(self, project_id: int) -> bool:
        return self.collection.delete_one({"projectId": project_id}).deleted_count > 0
