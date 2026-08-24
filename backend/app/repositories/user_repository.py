from __future__ import annotations

from dataclasses import dataclass, field
from uuid import uuid4


@dataclass
class UserRecord:
    id: str
    name: str
    countryCode: str
    mobile: str
    role: str


@dataclass
class UserRepository:
    users: dict[str, UserRecord] = field(default_factory=dict)

    def get_by_mobile(self, country_code: str, mobile: str) -> UserRecord | None:
        return next((user for user in self.users.values() if user.countryCode == country_code and user.mobile == mobile), None)

    def upsert(self, name: str, country_code: str, mobile: str, role: str = "USER") -> UserRecord:
        existing = self.get_by_mobile(country_code, mobile)
        if existing:
            existing.name = name
            existing.role = role or existing.role
            return existing
        user = UserRecord(id=str(uuid4()), name=name, countryCode=country_code, mobile=mobile, role=role)
        self.users[user.id] = user
        return user


user_repository = UserRepository()
