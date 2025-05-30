from fastapi.testclient import TestClient
from unittest.mock import patch

class TestRecommendations:
    def get_auth_headers(self, client: TestClient, user_data):
        client.post("/register", json=user_data)
        login_data = {"username": user_data["username"], "password": user_data["password"]}
        response = client.post("/login", json=login_data)
        token = response.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}
    
    @patch('routes.recommendations.fetch_products')
    def test_create_recommendation_success(self, mock_fetch, client: TestClient, test_doctor_data):
        mock_fetch.return_value = [{"id": 1, "name": "Product 1"}]
        
        headers = self.get_auth_headers(client, test_doctor_data)
        
        recommendation_data = {
            "patient_name": "John Doe",
            "product_ids": [1, 2],
            "notes": "Use twice daily"
        }
        response = client.post("/recommendations", json=recommendation_data, headers=headers)
        assert response.status_code == 200
        assert "recommendation_link" in response.json()
    
    def test_create_recommendation_non_doctor(self, client: TestClient, test_user_data):
        headers = self.get_auth_headers(client, test_user_data)
        
        recommendation_data = {
            "patient_name": "John Doe",
            "product_ids": [1, 2],
            "notes": "Use twice daily"
        }
        response = client.post("/recommendations", json=recommendation_data, headers=headers)
        assert response.status_code == 403
        assert "Only doctors can create recommendations" in response.json()["detail"]
    
    @patch('routes.recommendations.fetch_products')
    def test_get_recommendation_success(self, mock_fetch, client: TestClient, test_doctor_data):
        mock_fetch.return_value = [{"id": 1, "name": "Product 1"}]
        
        # creating recommendation first
        headers = self.get_auth_headers(client, test_doctor_data)
        recommendation_data = {
            "patient_name": "John Doe",
            "product_ids": [1, 2],
            "notes": "Use twice daily"
        }
        create_response = client.post("/recommendations", json=recommendation_data, headers=headers)
        recommendation_link = create_response.json()["recommendation_link"]
        
        # getting recommendation
        response = client.get(recommendation_link)
        assert response.status_code == 200
        data = response.json()
        assert data["patient_name"] == "John Doe"
        assert data["doctor_name"] == test_doctor_data["username"]
    
    def test_get_nonexistent_recommendation(self, client: TestClient):
        response = client.get("/recommendation/nonexistent-uuid")
        assert response.status_code == 404
        assert "Recommendation not found" in response.json()["detail"]