from fastapi.testclient import TestClient

class TestRatingsReviews:
    def get_auth_headers(self, client: TestClient, user_data):
        client.post("/register", json=user_data)
        login_data = {"username": user_data["username"], "password": user_data["password"]}
        response = client.post("/login", json=login_data)
        token = response.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}
    
    def test_create_rating_success(self, client: TestClient, test_user_data, test_doctor_data):
        # registering doctor and user
        client.post("/register", json=test_doctor_data)
        headers = self.get_auth_headers(client, test_user_data)
        
        rating_data = {"doctor_id": 1, "rating": 5}
        response = client.post("/ratings", json=rating_data, headers=headers)
        assert response.status_code == 200
        assert response.json()["message"] == "Rating submitted successfully"
    
    def test_create_rating_nonexistent_doctor(self, client: TestClient, test_user_data):
        headers = self.get_auth_headers(client, test_user_data)
        
        rating_data = {"doctor_id": 999, "rating": 5}
        response = client.post("/ratings", json=rating_data, headers=headers)
        assert response.status_code == 404
        assert "Doctor not found" in response.json()["detail"]
    
    def test_create_review_success(self, client: TestClient, test_user_data, test_doctor_data):
        # registering doctor and user
        client.post("/register", json=test_doctor_data)
        headers = self.get_auth_headers(client, test_user_data)
        
        review_data = {"doctor_id": 1, "review_text": "Great doctor!"}
        response = client.post("/reviews", json=review_data, headers=headers)
        assert response.status_code == 200
        assert response.json()["message"] == "Review submitted successfully"
    
    def test_unauthorized_rating(self, client: TestClient):
        rating_data = {"doctor_id": 1, "rating": 5}
        response = client.post("/ratings", json=rating_data)
        assert response.status_code == 403