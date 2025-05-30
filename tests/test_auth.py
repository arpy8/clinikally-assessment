from fastapi.testclient import TestClient

class TestAuth:
    def test_register_user(self, client: TestClient, test_user_data):
        response = client.post("/register", json=test_user_data)
        assert response.status_code == 200
        assert response.json()["message"] == "User registered successfully"
    
    def test_register_doctor(self, client: TestClient, test_doctor_data):
        response = client.post("/register", json=test_doctor_data)
        assert response.status_code == 200
        assert response.json()["message"] == "User registered successfully"
    
    def test_register_duplicate_user(self, client: TestClient, test_user_data):
        # registering user first time
        client.post("/register", json=test_user_data)
        # trying to register again
        response = client.post("/register", json=test_user_data)
        assert response.status_code == 400
        assert "Username already exists" in response.json()["detail"]
    
    def test_login_valid_user(self, client: TestClient, test_user_data):
        # registering
        client.post("/register", json=test_user_data)
        # logging in
        login_data = {"username": test_user_data["username"], "password": test_user_data["password"]}
        response = client.post("/login", json=login_data)
        assert response.status_code == 200
        assert "access_token" in response.json()
        assert response.json()["token_type"] == "bearer"
    
    def test_login_invalid_credentials(self, client: TestClient):
        login_data = {"username": "nonexistent", "password": "wrongpass"}
        response = client.post("/login", json=login_data)
        assert response.status_code == 401
        assert "Invalid credentials" in response.json()["detail"]