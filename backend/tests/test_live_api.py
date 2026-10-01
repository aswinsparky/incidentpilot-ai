import requests
import pytest

LIVE_API_URL = "https://pir5gqzb66.execute-api.us-east-1.amazonaws.com"

def test_live_health_endpoint():
    response = requests.get(f"{LIVE_API_URL}/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data

def test_live_dashboard_stats():
    response = requests.get(f"{LIVE_API_URL}/api/dashboard/stats")
    assert response.status_code == 200
    data = response.json()
    assert "active_incidents" in data
    assert "resolved_today" in data
    assert "services" in data

def test_live_list_incidents():
    response = requests.get(f"{LIVE_API_URL}/api/incidents")
    assert response.status_code == 200
    incidents = response.json()
    assert isinstance(incidents, list)
    assert len(incidents) >= 1

def test_live_get_incident_detail():
    inc_res = requests.get(f"{LIVE_API_URL}/api/incidents")
    inc_id = inc_res.json()[0]["id"]

    response = requests.get(f"{LIVE_API_URL}/api/incidents/{inc_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == inc_id

def test_live_simulate_demo_incident():
    response = requests.post(f"{LIVE_API_URL}/api/demo/simulate?scenario=deployment_failure")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "production-api"
    assert data["status"] == "ACTIVE"

def test_live_investigate_and_remediate():
    sim_res = requests.post(f"{LIVE_API_URL}/api/demo/simulate?scenario=deployment_failure")
    inc_id = sim_res.json()["id"]

    inv_res = requests.post(f"{LIVE_API_URL}/api/incidents/{inc_id}/investigate")
    assert inv_res.status_code == 200
    inv_data = inv_res.json()
    assert inv_data["root_cause"] is not None
    assert inv_data["recommendation"] is not None

    app_res = requests.post(f"{LIVE_API_URL}/api/incidents/{inc_id}/approve?approved_by=qa-lead@company.com")
    assert app_res.status_code == 200
    app_data = app_res.json()
    assert app_data["status"] == "RESOLVED"
    assert app_data["remediation_approved"] is True
    assert app_data["recovery_verified"] is True
