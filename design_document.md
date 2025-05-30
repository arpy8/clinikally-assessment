# Design Document: Dermatologist Review & Recommendation API

## Architecture Overview

The system follows a layered architecture pattern with clear separation of concerns:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   FastAPI       │    │   SQLAlchemy     │    │   SQLite        │
│   (REST API)    │◄──►│   (ORM Layer)    │◄──►│   (Database)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        ▲                        ▲
        │                        │
┌─────────────────┐    ┌──────────────────┐
│   JWT Auth      │    │   Pydantic       │
│   (Security)    │    │   (Validation)   │
└─────────────────┘    └──────────────────┘
```

**Core Components:**
- **API Layer**: FastAPI handles HTTP requests, routing, and response formatting
- **Authentication**: JWT-based token system for secure access control
- **Data Layer**: SQLAlchemy ORM with SQLite for data persistence
- **Validation**: Pydantic models ensure data integrity and API contract compliance
- **External Integration**: HTTP client for fetching product data from DummyJSON API

## Data Models and Relationships

```
Users (1) ──────── (0..1) Doctors
  │                         │
  │                         │
  ▼                         ▼
Ratings (N)             Recommendations (N)
Reviews (N)
  │
  ▼
Doctors (1)
```

**Entity Definitions:**
- **User**: Base entity for authentication (patients and doctors)
- **Doctor**: Extended profile for medical practitioners with specialization
- **Rating**: Numerical rating (1-5) linking users to doctors
- **Review**: Text feedback with word limit validation
- **Recommendation**: Product suggestions with UUID-based sharing and expiry

**Key Relationships:**
- One-to-many: Doctor → Ratings, Reviews, Recommendations
- Many-to-one: Ratings, Reviews → User
- One-to-one: User → Doctor (for medical practitioners)

## Key Design Decisions

### 1. Authentication Strategy
**Decision**: JWT token-based authentication with role differentiation
**Rationale**: 
- Stateless authentication suitable for REST APIs
- Built-in expiry mechanism
- Role-based access control for doctor-specific operations

### 2. Database Choice
**Decision**: SQLite in-memory with SQLAlchemy ORM
**Rationale**:
- Meets assessment requirement for in-memory storage
- SQLAlchemy provides database abstraction for future migration
- Relational model suits the structured data relationships

### 3. Rating System
**Decision**: Allow rating updates, calculate averages dynamically
**Rationale**:
- Users can modify their ratings as opinions change
- Real-time average calculation ensures data accuracy
- Simple aggregation suitable for small-scale operations

### 4. Recommendation Sharing
**Decision**: UUID-based public links with 7-day expiry
**Rationale**:
- UUIDs provide unpredictable, secure identifiers
- Public access eliminates authentication barriers for patients
- Expiry mechanism prevents indefinite access to potentially outdated recommendations

### 5. Product Integration
**Decision**: Fetch products synchronously from external API
**Rationale**:
- Real-time data ensures product information accuracy
- Graceful fallback for missing products
- Caching consideration for production environments

## Input Validation and Business Rules

**Validation Rules:**
- Ratings: Integer range 1-5 with comprehensive error handling
- Reviews: 100-word limit with automatic word counting
- Authentication: Password hashing with SHA-256 (production would use bcrypt)
- Recommendation expiry: Automatic 7-day TTL with server-side validation

**Business Logic:**
- Doctors can only create recommendations (role-based authorization)
- Users can update existing ratings for the same doctor
- Public recommendation access without authentication requirements
- Expired recommendations return HTTP 410 Gone status

## Assumptions and Limitations

### Assumptions
1. **User Trust**: Users provide honest ratings and reviews
2. **Product API Reliability**: DummyJSON API maintains consistent availability
3. **Single-Doctor Rating**: Users rate each doctor only once (with updates allowed)
4. **English Content**: All text content is in English for word counting

### Technical Limitations
1. **Scalability**: In-memory database unsuitable for production loads
2. **Concurrency**: No optimistic locking for concurrent rating updates
3. **Caching**: No caching layer for frequently accessed doctor lists
4. **Search**: Limited filtering capabilities (only by minimum rating)

### Production Considerations
- **Database Migration**: PostgreSQL with connection pooling
- **Caching Strategy**: Redis for doctor rankings and product data
- **Security Enhancement**: bcrypt password hashing, rate limiting, CORS configuration
- **Monitoring**: Structured logging, metrics collection, health endpoints
- **Error Handling**: Detailed error codes and user-friendly messages

This design prioritizes simplicity and clarity while maintaining extensibility for future enhancements. The modular architecture supports easy testing and deployment in various environments.