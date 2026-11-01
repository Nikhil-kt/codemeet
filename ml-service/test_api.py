"""
API endpoint tests for FastAPI ML service
"""
import unittest
import os
from fastapi.testclient import TestClient
from app.main import app


class TestMLAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_root_endpoint(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "operational")

    def test_health_endpoint(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "online")
        self.assertIn("VolunteerMatcher", data["engines"])

    def test_ready_endpoint(self):
        response = self.client.get("/ready")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["models_loaded"])

    def test_match_endpoint_with_auth(self):
        os.environ["ML_SERVICE_SECRET"] = "test-secret-123"
        try:
            # Without key -> 401
            unauth_resp = self.client.post("/ml/v1/match/event", json={
                "event": {"id": "e1", "title": "Test Event", "latitude": 13.0, "longitude": 80.0},
                "volunteers": []
            })
            self.assertEqual(unauth_resp.status_code, 401)

            # With correct key -> 200
            auth_resp = self.client.post(
                "/ml/v1/match/event",
                headers={"X-Service-Key": "test-secret-123"},
                json={
                    "event": {"id": "e1", "title": "Test Event", "latitude": 13.0, "longitude": 80.0},
                    "volunteers": []
                }
            )
            self.assertEqual(auth_resp.status_code, 200)
            self.assertTrue(auth_resp.json()["success"])
        finally:
            if "ML_SERVICE_SECRET" in os.environ:
                del os.environ["ML_SERVICE_SECRET"]

