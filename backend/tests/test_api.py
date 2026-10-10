from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_root_or_docs():
    response = client.get("/docs")
    assert response.status_code == 200
