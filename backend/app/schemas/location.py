from pydantic import BaseModel, Field


class LocationImage(BaseModel):
    url: str
    alt: str


class LocationHero(BaseModel):
    title: str
    description: str
    image: str


class LocationFAQ(BaseModel):
    question: str
    answer: str


class LocationBase(BaseModel):
    projectId: int = Field(ge=1)
    type: str
    name: str
    shortDescription: str
    description: str
    rating: float = Field(ge=0, le=5)
    reviewCount: int = Field(ge=0)
    location: str
    hero: LocationHero
    whyChooseTitle: str
    whyChooseDescription: str
    images: list[LocationImage]
    faqs: list[LocationFAQ]
    imageUrl: str


class LocationSummary(BaseModel):
    projectId: int
    type: str
    name: str
    shortDescription: str
    imageUrl: str
    rating: float
    reviewCount: int
    location: str


class LocationDetail(LocationBase):
    pass


class LocationListResponse(BaseModel):
    total: int
    page: int
    limit: int
    totalPages: int
    data: list[LocationSummary]


class LocationCreateRequest(LocationBase):
    pass


class LocationUpdateRequest(BaseModel):
    type: str | None = None
    name: str | None = None
    shortDescription: str | None = None
    description: str | None = None
    rating: float | None = Field(default=None, ge=0, le=5)
    reviewCount: int | None = Field(default=None, ge=0)
    location: str | None = None
    hero: LocationHero | None = None
    whyChooseTitle: str | None = None
    whyChooseDescription: str | None = None
    images: list[LocationImage] | None = None
    faqs: list[LocationFAQ] | None = None
    imageUrl: str | None = None
