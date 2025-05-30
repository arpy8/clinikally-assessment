from sqlalchemy.orm import Session
from fastapi import APIRouter, HTTPException, Depends

from database import get_db
from auth import get_current_user
from schemas import RatingCreate, ReviewCreate
from models import User, Doctor, Rating, Review


router = APIRouter(tags=["Ratings & Reviews"])

@router.post("/ratings")
def create_rating(
    rating: RatingCreate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    doctor = db.query(Doctor).filter(Doctor.id == rating.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    existing_rating = db.query(Rating).filter(
        Rating.user_id == current_user.id,
        Rating.doctor_id == rating.doctor_id
    ).first()
    
    if existing_rating:
        existing_rating.rating = rating.rating
    else:
        db_rating = Rating(
            user_id=current_user.id, 
            doctor_id=rating.doctor_id, 
            rating=rating.rating
        )
        db.add(db_rating)
    
    db.commit()
    return {"message": "Rating submitted successfully"}

@router.post("/reviews")
def create_review(
    review: ReviewCreate, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    doctor = db.query(Doctor).filter(Doctor.id == review.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    db_review = Review(
        user_id=current_user.id,
        doctor_id=review.doctor_id,
        review_text=review.review_text
    )
    db.add(db_review)
    db.commit()
    return {"message": "Review submitted successfully"}