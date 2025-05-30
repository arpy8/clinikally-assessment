# Tests Directory

This directory contains all the test files for the FastAPI assessment application. The tests are built using pytest and include comprehensive coverage for authentication and other API endpoints.

## Structure

```
tests/
├── conftest.py          # Test configuration and fixtures
├── test_auth.py         # Authentication endpoint tests
├── run_tests.py         # Test runner script
└── README.md
```

## Files Overview

### `conftest.py`
Contains pytest fixtures and test configuration:
- **Database Setup**: Creates a separate SQLite test database (`test.db`)
- **Test Client**: Provides a FastAPI TestClient with database dependency override
- **Test Data Fixtures**: Predefined user and doctor data for testing

### `test_auth.py`
Contains authentication-related test cases:
- User registration (regular users and doctors)
- Duplicate user registration handling
- User login with valid credentials
- Invalid login attempts

### `run_tests.py`
Test runner utility with the following features:
- Run all tests with detailed reporting
- Run specific test modules
- Colored output and progress indicators

## Running Tests

### Run All Tests
```bash
# From the tests directory
python run_tests.py

# Or using pytest directly
pytest -v
```

### Run Specific Test Module
```bash
# Run only authentication tests
python run_tests.py auth

# Or using pytest directly
pytest test_auth.py -v
```

### Run Individual Test Methods
```bash
# Run a specific test method
pytest test_auth.py::TestAuth::test_login_valid_user -v
```

## Test Fixtures

### Database Fixtures
- `db_session`: Creates a fresh database session for each test
- `client`: Provides a TestClient with overridden database dependency

### Data Fixtures
- `test_user_data`: Sample user data for testing
  ```python
  {
      "username": "testuser",
      "password": "testpass123",
      "is_doctor": False
  }
  ```
- `test_doctor_data`: Sample doctor data for testing
  ```python
  {
      "username": "testdoctor", 
      "password": "doctorpass123",
      "is_doctor": True
  }
  ```

## Test Database

Tests use a separate SQLite database (`test.db`) that is:
- Created fresh for each test function
- Automatically cleaned up after each test
- Isolated from the main application database

## Adding New Tests

1. Create a new test file following the naming convention `test_<module>.py`
2. Import necessary fixtures from `conftest.py`
3. Use the `client` fixture for API testing
4. Follow the existing test patterns for consistency

### Example Test Structure
```python
class TestNewFeature:
    def test_feature_success(self, client: TestClient, test_user_data):
        # Test implementation
        response = client.post("/endpoint", json=test_user_data)
        assert response.status_code == 200
        
    def test_feature_failure(self, client: TestClient):
        # Test failure case
        response = client.post("/endpoint", json={})
        assert response.status_code == 400
```

## Test Coverage

- ✅ User registration (both regular users and doctors)
- ✅ Duplicate registration prevention
- ✅ User authentication and login
- ✅ Invalid credentials handling

## Dependencies

- `pytest`: Testing framework
- `fastapi.testclient`: FastAPI testing utilities
- `sqlalchemy`: Database testing setup

## Notes

- Tests run in isolation with fresh database state
- All test data is automatically cleaned up
- Use descriptive test names that explain the scenario being tested
- Follow AAA pattern: Arrange, Act, Assert