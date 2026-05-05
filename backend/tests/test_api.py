from fastapi.testclient import TestClient

from app.server import app

client = TestClient(app)


def test_health_check() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_recurring_endpoint_shape() -> None:
    response = client.get("/api/v1/incidents/recurring?window_days=30&limit=3")
    payload = response.json()

    assert response.status_code == 200
    assert isinstance(payload, list)
    assert len(payload) <= 3
    if payload:
        assert "signature" in payload[0]
        assert "trend_delta" in payload[0]


def test_priority_endpoint_not_found() -> None:
    response = client.get("/api/v1/incidents/priority?ticket_id=UNKNOWN")
    assert response.status_code == 404


def test_priority_batch_endpoint() -> None:
    response = client.post("/api/v1/incidents/priority/batch", json={"limit": 10})
    payload = response.json()

    assert response.status_code == 200
    assert "items" in payload
    assert len(payload["items"]) <= 10
    if payload["items"]:
        assert "recommended_priority" in payload["items"][0]


def test_summary_endpoint_shape() -> None:
    response = client.get("/api/v1/incidents/summary")
    payload = response.json()

    assert response.status_code == 200
    assert payload["open_tickets"] >= 0
    assert isinstance(payload["trends"], list)
