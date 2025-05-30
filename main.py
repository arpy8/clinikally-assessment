from fastapi import FastAPI
from database import engine, Base

from models import User, Doctor, Rating, Review, Recommendation
from routes import auth, ratings_reviews, doctors, recommendations


app = FastAPI(title="Dermatologist Review API")

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(ratings_reviews.router)
app.include_router(doctors.router)
app.include_router(recommendations.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/")
def root():
    return {"message": "Demo application backend API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)