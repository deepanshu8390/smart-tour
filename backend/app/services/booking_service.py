from app.core.exceptions import AppError
from app.repositories.base_booking_repository import BaseBookingRepository
from app.repositories.base_location_repository import BaseLocationRepository
from app.repositories.booking_repository import booking_repository
from app.repositories.location_repository import location_repository
from app.state.booking_state import BookingState, BookingStatus


class BookingService:
    def __init__(self, bookings: BaseBookingRepository, locations: BaseLocationRepository) -> None:
        self.bookings = bookings
        self.locations = locations

    def create_booking(self, user_id: str, project_id: int, booking_date, number_of_people: int) -> dict:
        location = self.locations.get_by_project_id(project_id)
        if not location:
            raise AppError("Location not found", 404)

        initial_state = BookingState(BookingStatus.PENDING)
        confirmed_state = initial_state.transition_to(BookingStatus.CONFIRMED)
        booking = self.bookings.create(
            {
                "userId": user_id,
                "projectId": project_id,
                "locationName": location["name"],
                "bookingDate": booking_date,
                "numberOfPeople": number_of_people,
                "status": confirmed_state.status,
            }
        )
        return booking

    def update_booking_status(self, booking_id: str, next_status: BookingStatus) -> dict:
        existing = self.bookings.get_by_id(booking_id)
        if not existing:
            raise AppError("Booking not found", 404)

        current_state = BookingState(BookingStatus(existing["status"]))
        updated_state = current_state.transition_to(next_status)
        updated = self.bookings.update(booking_id, {"status": updated_state.status})
        if not updated:
            raise AppError("Booking not found", 404)
        return updated

    def list_my_bookings(self, user_id: str) -> list[dict]:
        return self.bookings.list_by_user(user_id)

    def list_all_bookings(self) -> list[dict]:
        return self.bookings.list_all()


booking_service = BookingService(booking_repository, location_repository)
