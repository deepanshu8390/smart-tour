from pydantic import BaseModel


class ApiMessage(BaseModel):
    message: str


class PaginationParams(BaseModel):
    page: int = 1
    limit: int = 10


class PaginatedResponse(BaseModel):
    total: int
    page: int
    limit: int
    totalPages: int
