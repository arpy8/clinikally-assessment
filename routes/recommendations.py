import uuid
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException, Depends

from database import get_db
from utils import fetch_products
from auth import get_current_user
from models import User, Doctor, Recommendation
from schemas import RecommendationCreate, RecommendationResponse


router = APIRouter(prefix="/recommendation", tags=["Recommendations"])

@router.post("s")
def create_recommendation(
    recommendation: RecommendationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    doctor = db.query(Doctor).filter(Doctor.user_id == current_user.id).first()
    if not doctor:
        raise HTTPException(status_code=403, detail="Only doctors can create recommendations")
    
    products = fetch_products(recommendation.product_ids)
    recommendation_uuid = str(uuid.uuid4())
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    
    db_recommendation = Recommendation(
        uuid=recommendation_uuid,
        doctor_id=doctor.id,
        patient_name=recommendation.patient_name,
        products=str(products),
        notes=recommendation.notes,
        expires_at=expires_at
    )
    
    db.add(db_recommendation)
    db.commit()
    
    return {
        "message": "Recommendation created successfully",
        "recommendation_link": f"/recommendation/{recommendation_uuid}"
    }

@router.get("/{recommendation_uuid}", response_model=RecommendationResponse)
def get_recommendation(recommendation_uuid: str, db: Session = Depends(get_db)):
    recommendation = db.query(Recommendation).filter(
        Recommendation.uuid == recommendation_uuid
    ).first()
    if not recommendation:
        raise HTTPException(status_code=404, detail="Recommendation not found")
    
    # checking if expired
    current_time = datetime.now(timezone.utc).replace(tzinfo=None)
    expires_at = recommendation.expires_at
    if hasattr(expires_at, 'tzinfo') and expires_at.tzinfo is not None:
        expires_at = expires_at.replace(tzinfo=None)
    
    if expires_at < current_time:
        raise HTTPException(status_code=410, detail="Recommendation has expired")
    
    doctor = db.query(Doctor).filter(Doctor.id == recommendation.doctor_id).first()
    products = eval(recommendation.products)
    
    return RecommendationResponse(
        uuid=recommendation.uuid,
        doctor_name=doctor.name,
        patient_name=recommendation.patient_name,
        products=products,
        notes=recommendation.notes,
        created_at=recommendation.created_at,
        expires_at=recommendation.expires_at
    )