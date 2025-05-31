# Dermatologist Review and Recommendation API

A FastAPI-based backend system that enables customers to rate and review dermatologists, and allows dermatologists to create shareable product recommendations.

<div align="center">

  <a href="https://clinikally-demo.arpy8.com">
    <img src="https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Frontend - Vercel" style="margin: 0 10px;">
  </a>
    &nbsp;&nbsp;
  <a href="https://huggingface.co/spaces/arpy8/clinikally-backend">
    <img src="https://img.shields.io/badge/Backend-HuggingFace-FF6B00?style=for-the-badge&logo=huggingface&logoColor=white" alt="Backend - HuggingFace" style="margin: 0 10px;">
  </a>
    &nbsp;&nbsp;
  <a href="https://youtu.be/EEeR2ArTbu8">
    <img src="https://img.shields.io/badge/Watch-Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="YouTube Demo" style="margin: 0 10px;">
  </a>

</div>

## Diagrams
All the relevant diagrams are mentioned in [diagrams.md](diagrams.md)

## Setup Instructions

### Prerequisites
- Python 3.8+
- pip package managers

### Installation
1. Clone/download the project files
```bash
git clone http://github.com/arpy8/clinikally-assessment
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python main.py
```

The API will be available at `http://localhost:7860`

### Interactive API Documentation
Local Access:
- Swagger UI: `http://localhost:7860/docs`
- ReDoc: `http://localhost:7860/redoc`

Hosted Access:
- Swagger UI: `https://arpy8-clinikally-backend.hf.space/docs`
- ReDoc: `https://arpy8-clinikally-backend.hf.space/redoc`

## API Documentation

### Authentication Endpoints

#### POST /register
Register a new user (patient or doctor).
```json
{
  "username": "john_doe",
  "password": "secure_password",
  "is_doctor": false
}
```
Response:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "message": "User registered successfully"
}
```

#### POST /login
Login and receive JWT token.
```json
{
  "username": "john_doe",
  "password": "secure_password"
}
```
Response:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer"
}
```

### Rating & Review Endpoints

#### POST /ratings
Submit a rating for a doctor (requires authentication).
```json
{
  "doctor_id": 1,
  "rating": 4
}
```

#### POST /reviews
Submit a review for a doctor (requires authentication).
```json
{
  "doctor_id": 1,
  "review_text": "Great doctor, very professional and knowledgeable."
}
```

### Doctor Listing

#### GET /doctors
Get list of doctors with filtering and pagination.

Query Parameters:
- `min_rating`: Minimum average rating (default: 0)
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)

Example: `/doctors?min_rating=4&page=1&limit=5`

Response:
```json
[
  {
    "id": 1,
    "name": "Dr. Smith",
    "specialization": "General Dermatology",
    "average_rating": 4.5,
    "review_count": 10
  }
]
```

### Recommendation Endpoints

#### POST /recommendations
Create a shareable product recommendation (doctors only).
```json
{
  "patient_name": "Jane Doe",
  "product_ids": [1, 2, 3],
  "notes": "Apply twice daily after cleansing."
}
```

Response:
```json
{
  "message": "Recommendation created successfully",
  "recommendation_link": "/recommendation/550e8400-e29b-41d4-a716-446655440000"
}
```

#### GET /recommendation/{uuid}
View a public recommendation (no authentication required).

Response:
```json
{
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "doctor_name": "Dr. Hieter",
  "patient_name": "Jane Doe",
  "products": [
    {
      "id": 1,
      "title": "Clinikally SunProtect Sunscreen SPF 50/PA+++",
      "description": "Clinikally SunProtect Sunscreen SPF 50/PA+++ offers comprehensive and complete skin protection with its broad-spectrum coverage against UVA/UVB rays, Infra Red Radiation, and Blue Light.",
      "price": 809
    }
  ],
  "notes": "Apply twice daily after cleansing.",
  "created_at": "2025-12-01T10:00:00",
  "expires_at": "2025-12-08T10:00:00"
}
```

## Implementation Approach

### Architecture
- **Framework**: FastAPI for high-performance REST API
- **Database**: SQLite in-memory with SQLAlchemy ORM
- **Authentication**: JWT token-based authentication
- **External API**: DummyJSON for product data

### Key Features Implemented
1. **User Management**: Registration and authentication for patients and doctors
2. **Rating System**: 1-5 star ratings with average calculation
3. **Review System**: Text reviews with 100-word limit validation
4. **Doctor Filtering**: Filter by minimum rating with pagination
5. **Product Recommendations**: Shareable links with 7-day expiry
6. **Token Authentication**: JWT-based security for protected endpoints

### Data Validation
- Rating values between 1-5
- Review text limited to 100 words
- Token expiry validation
- User role verification for doctor-only endpoints

## Limitations and Considerations

### Current Limitations
1. **In-Memory Database**: Data is lost when application restarts
2. **Basic Authentication**: Simple JWT implementation without refresh tokens
3. **No Rate Limiting**: API calls are not rate-limited
4. **Error Handling**: Basic error responses, could be more detailed
5. **Product API Dependency**: Relies on external DummyJSON API availability

### Production Considerations
1. **Database**: Would use PostgreSQL or MySQL with proper migrations
2. **Caching**: Redis for frequently accessed data
3. **Security**: Enhanced password hashing (bcrypt), rate limiting
4. **Monitoring**: Logging, metrics, and health checks
5. **Deployment**: Docker containerization and CI/CD pipeline

### Extra Features Implemented
- JWT token authentication
- Recommendation link expiry (7 days)
- Pagination for doctor listings
- Input validation and error handling
- Comprehensive API documentation

## Testing the API

### Sample Workflow
1. Register a doctor: `POST /register` with `is_doctor: true`
2. Register a patient: `POST /register` with `is_doctor: false`
3. Login as patient: `POST /login`
4. Rate a doctor: `POST /ratings` (with Authorization header)
5. Review a doctor: `POST /reviews` (with Authorization header)
6. Get doctors: `GET /doctors?min_rating=4`
7. Login as doctor: `POST /login`
8. Create recommendation: `POST /recommendations` (with Authorization header)
9. View recommendation: `GET /recommendation/{uuid}` (public access)
