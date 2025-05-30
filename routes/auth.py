from sqlalchemy.orm import Session
from fastapi import APIRouter, HTTPException, Depends

from database import get_db
from models import User, Doctor
from schemas import UserCreate, UserLogin
from auth import hash_password, create_access_token


router = APIRouter(prefix="", tags=["Authentication"])

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    hashed_password = hash_password(user.password)
    db_user = User(
        username=user.username,
        password_hash=hashed_password,
        is_doctor=1 if user.is_doctor else 0
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    if user.is_doctor:
        doctor = Doctor(
            user_id=db_user.id, 
            name=user.username, 
            specialization="General Dermatology"
        )
        db.add(doctor)
        db.commit()
    
    token = create_access_token({"user_id": db_user.id})
    return {"message": "User registered successfully", "access_token": token, "token_type": "bearer"}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or db_user.password_hash != hash_password(user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"user_id": db_user.id})
    return {"access_token": token, "token_type": "bearer"}