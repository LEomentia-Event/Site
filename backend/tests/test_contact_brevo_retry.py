"""Backend tests: POST /api/contact reliability with Brevo retry + authenticated domain.
Verifies:
  - 5 consecutive submits all return 200 with email_sent=true AND client_email_sent=true
  - lead persisted via GET /api/contacts
  - invalid email -> 422
  - retry evidence in backend logs (attempt N failed followed by 'sent ... on attempt >1' when applicable)
"""
import os
import uuid
import time
import pytest
import requests

BASE_URL = os.environ['REACT_APP_BACKEND_URL'].rstrip('/')
API = f"{BASE_URL}/api"

N_ITER = 5


def _payload():
    return {
        "name": "TEST Retry Suite",
        "email": f"TEST_{uuid.uuid4().hex[:10]}@example.com",
        "message": "Test retry reliability",
        "wedding_date": "2026-07-01",
        "wedding_location": "Paris",
        "guest_count": "50",
    }


class TestContactRetry:
    submitted = []

    def test_five_consecutive_submits_both_flags_true(self):
        results = []
        for i in range(N_ITER):
            p = _payload()
            r = requests.post(f"{API}/contact", json=p, timeout=45)
            assert r.status_code == 200, f"Iter {i+1}: expected 200, got {r.status_code}: {r.text[:300]}"
            d = r.json()
            results.append({
                "email": p["email"],
                "email_sent": d.get("email_sent"),
                "client_email_sent": d.get("client_email_sent"),
            })
            TestContactRetry.submitted.append(p["email"])
        # All must be True
        failing = [r for r in results if not (r["email_sent"] and r["client_email_sent"])]
        assert not failing, (
            f"Some submissions did NOT have both flags true: {failing}. "
            f"All results: {results}"
        )

    def test_all_leads_persisted(self):
        time.sleep(0.5)
        r = requests.get(f"{API}/contacts", timeout=30)
        assert r.status_code == 200
        contacts = r.json()
        emails_in_db = {c.get("email") for c in contacts}
        missing = [e for e in TestContactRetry.submitted if e not in emails_in_db]
        assert not missing, f"Missing persisted leads: {missing}"

    def test_invalid_email_422(self):
        r = requests.post(f"{API}/contact",
                          json={"name": "x", "email": "bad-email", "message": "hi"},
                          timeout=15)
        assert r.status_code == 422

    def test_retry_log_evidence(self):
        """If any 'attempt 1 failed (401)' appears, a follow-up 'on attempt 2/3' should exist."""
        log_path = "/var/log/supervisor/backend.err.log"
        if not os.path.exists(log_path):
            pytest.skip("no backend.err.log available")
        with open(log_path, "r", errors="ignore") as f:
            tail = f.read()[-30000:]
        failed_lines = [ln for ln in tail.splitlines() if "Brevo attempt" in ln and "failed" in ln]
        recovered_lines = [ln for ln in tail.splitlines() if "on attempt" in ln]
        # Informational only: never fail if no transient 401 happened
        print(f"[log] transient failures: {len(failed_lines)} | recovered: {len(recovered_lines)}")
        if failed_lines:
            # Retry mechanism should have produced recoveries OR final failure logs
            final_fail = "Brevo email failed after retries" in tail
            assert recovered_lines or final_fail, (
                "Transient Brevo failures detected but no retry recovery/final-failure log."
            )
