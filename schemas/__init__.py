from pydantic import BaseModel, field_validator
from typing import List
from datetime import datetime, timezone

class UserCreate(BaseModel):
    username: str
    password: str
    is_doctor: bool = False

class UserLogin(BaseModel):
    username: str
    password: str

class RatingCreate(BaseModel):
    doctor_id: int
    rating: int
    
    @field_validator('rating')
    @classmethod
    def rating_must_be_valid(cls, v):
        if v < 1 or v > 5:
            raise ValueError('Rating must be between 1 and 5')
        return v

class ReviewCreate(BaseModel):
    doctor_id: int
    review_text: str
    
    @field_validator('review_text')
    @classmethod
    def review_length(cls, v):
        words = len(v.split())
        if words > 100:
            raise ValueError('Review must be 100 words or less')
        return v

class RecommendationCreate(BaseModel):
    patient_name: str
    product_ids: List[int]
    notes: str

class DoctorResponse(BaseModel):
    id: int
    name: str
    specialization: str
    average_rating: float
    review_count: int

class RecommendationResponse(BaseModel):
    uuid: str
    doctor_name: str
    patient_name: str
    products: List[dict]
    notes: str
    created_at: datetime
    expires_at: datetime
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
