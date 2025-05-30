from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from schemas import DoctorResponse
from models import Doctor, Rating, Review
from database import get_db


router = APIRouter(prefix="/doctors", tags=["Doctors"])

@router.get("", response_model=List[DoctorResponse])
def get_doctors(
    min_rating: float = Query(0, ge=0, le=5, description="Minimum average rating"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Results per page"),
    db: Session = Depends(get_db)
):
    offset = (page - 1) * limit

    doctors_query = db.query(
        Doctor.id,
        Doctor.name,
        Doctor.specialization,
        func.coalesce(func.avg(Rating.rating), 0).label('average_rating'),
        func.count(Review.id).label('review_count')
    ).outerjoin(Rating, Doctor.id == Rating.doctor_id)\
     .outerjoin(Review, Doctor.id == Review.doctor_id)\
     .group_by(Doctor.id, Doctor.name, Doctor.specialization)\
     .having(func.coalesce(func.avg(Rating.rating), 0) >= min_rating)\
     .offset(offset)\
     .limit(limit)
    
    doctors = doctors_query.all()
    
    return [
        DoctorResponse(
            id=doctor.id,
            name=doctor.name,
            specialization=doctor.specialization,
            average_rating=round(float(doctor.average_rating), 1),
            review_count=doctor.review_count
        )
        for doctor in doctors
    ]