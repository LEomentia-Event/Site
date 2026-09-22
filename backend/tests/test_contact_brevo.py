"""Backend tests: POST /api/contact behavior with Brevo IP restriction (external).
Verifies:
  - endpoint returns 200 with email_sent/client_email_sent flags
  - lead is persisted (GET /api/contacts contains it)
  - no 500 regression even if Brevo fails
  - if email failed, backend logs mention Brevo 401 unauthorised IP (external cause)
"""
import os
import uuid
import time
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://leomentia-preview.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def unique_email():
    return f"TEST_{uuid.uuid4().hex[:10]}@example.com"


@pytest.fixture(scope="module")
def payload(unique_email):
    return {
        "name": "TEST Jane Doe",
        "email": unique_email,
        "message": "Bonjour, ceci est un test automatisé.",
        "wedding_date": "2026-06-15",
        "wedding_location": "Lille, France",
        "guest_count": "80",
    }


class TestContactEndpoint:
    def test_post_contact_returns_200_with_flags(self, payload):
        r = requests.post(f"{API}/contact", json=payload, timeout=30)
        assert r.status_code == 200, f"Expected 200 (never 500), got {r.status_code}: {r.text}"
        data = r.json()
        # Required fields present
        for f in ("id", "name", "email", "message", "wedding_date",
                  "wedding_location", "guest_count", "created_at",
                  "email_sent", "client_email_sent"):
            assert f in data, f"Missing field '{f}' in response: {data}"
        assert data["email"] == payload["email"]
        assert data["name"] == payload["name"]
        assert isinstance(data["email_sent"], bool)
        assert isinstance(data["client_email_sent"], bool)
        # Save for other tests
        pytest.contact_response = data

    def test_lead_persisted_in_db(self, payload):
        # Give Mongo a moment
        time.sleep(0.5)
        r = requests.get(f"{API}/contacts", timeout=30)
        assert r.status_code == 200
        contacts = r.json()
        assert isinstance(contacts, list)
        matches = [c for c in contacts if c.get("email") == payload["email"]]
        assert len(matches) >= 1, f"Lead with email {payload['email']} not persisted"
        c = matches[0]
        assert c["name"] == payload["name"]
        assert c["message"] == payload["message"]
        assert c["wedding_location"] == payload["wedding_location"]

    def test_no_500_regression_even_if_brevo_fails(self, payload):
        # Send again - should still be 200 no matter what Brevo returns
        p2 = dict(payload)
        p2["email"] = f"TEST_{uuid.uuid4().hex[:8]}@example.com"
        r = requests.post(f"{API}/contact", json=p2, timeout=30)
        assert r.status_code == 200, f"Regression: got {r.status_code}"
        data = r.json()
        assert "email_sent" in data and "client_email_sent" in data

    def test_invalid_email_returns_422(self):
        bad = {"name": "x", "email": "not-an-email", "message": "hi"}
        r = requests.post(f"{API}/contact", json=bad, timeout=30)
        assert r.status_code == 422

    def test_brevo_failure_is_external_401_not_code_error(self):
        """If email_sent is False, backend logs must show a Brevo 401 line,
        proving the failure is external (IP restriction), not a code exception."""
        # Only inspect logs if we can read them
        log_path = "/var/log/supervisor/backend.err.log"
        if not os.path.exists(log_path):
            pytest.skip("backend.err.log not available")
        # Trigger a fresh contact submit
        p = {
            "name": "TEST Log Check",
            "email": f"TEST_{uuid.uuid4().hex[:8]}@example.com",
            "message": "log check",
        }
        r = requests.post(f"{API}/contact", json=p, timeout=30)
        assert r.status_code == 200
        data = r.json()
        time.sleep(1.0)
        with open(log_path, "r", errors="ignore") as f:
            tail = f.read()[-15000:]
        if not data["email_sent"]:
            # Must be a Brevo failure line, not a Python traceback
            assert "Brevo email failed" in tail, (
                "Expected 'Brevo email failed' in logs when email_sent=False. "
                "This indicates the failure was NOT a Brevo API rejection."
            )
            # Ideally 401 unauthorised IP
            has_401 = ("401" in tail) or ("unrecognised" in tail.lower()) or ("unauthorised" in tail.lower()) or ("ip address" in tail.lower())
            assert has_401, "Brevo failure present but no 401/IP reason found in logs (still external, but confirm cause)."
            # No unexpected traceback right after
            assert "Traceback (most recent call last)" not in tail[-3000:], "Unexpected Python traceback in recent logs"
        else:
            # email_sent True means Brevo accepted (great!)
            pass
