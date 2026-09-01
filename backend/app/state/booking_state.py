from __future__ import annotations

from dataclasses import dataclass
from enum import StrEnum

from app.core.exceptions import AppError


class BookingStatus(StrEnum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    CANCELLED = "CANCELLED"


@dataclass(frozen=True)
class BookingState:
    status: BookingStatus

    def can_transition_to(self, next_status: BookingStatus) -> bool:
        allowed_transitions = {
            BookingStatus.PENDING: {BookingStatus.CONFIRMED, BookingStatus.CANCELLED},
            BookingStatus.CONFIRMED: {BookingStatus.CANCELLED},
            BookingStatus.CANCELLED: set(),
        }
        return next_status == self.status or next_status in allowed_transitions[self.status]

    def transition_to(self, next_status: BookingStatus) -> "BookingState":
        if not self.can_transition_to(next_status):
            raise AppError(
                "Invalid booking status transition",
                422,
                {"from": self.status, "to": next_status},
            )
        return BookingState(next_status)
