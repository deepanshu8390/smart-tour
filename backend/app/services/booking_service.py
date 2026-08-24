from app.core.exceptions import AppError
from app.repositories.booking_repository import booking_repository
from app.repositories.location_repository import location_repository


class BookingService:
    def create_booking(self, user_id: str, project_id: int, booking_date, number_of_people: int) -> dict:
        location = location_repository.get_by_project_id(project_id)
        if not location:
            raise AppError("Location not found", 404)

        booking = booking_repository.create(
            {
                "userId": user_id,
                "projectId": project_id,
                "locationName": location["name"],
                "bookingDate": booking_date,
                "numberOfPeople": number_of_people,
                "status": "CONFIRMED",
            }
        )
        return booking

    def list_my_bookings(self, user_id: str) -> list[dict]:
        return booking_repository.list_by_user(user_id)

    def list_all_bookings(self) -> list[dict]:
        return booking_repository.list_all()


booking_service = BookingService()
