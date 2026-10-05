import pytest
import httpx
from app.testing.assertions import AssertionEvaluator
from app.models.schemas import AssertionRule


def test_successful_auth_simulation():
    # Simulate a successful auth endpoint evaluation
    status_code = 200
    latency_ms = 120.5
    response_body = {"token": "jwt_token_example_12345", "user": {"id": 1, "role": "admin"}}
    response_headers = {"content-type": "application/json"}

    rule_status = AssertionRule(type="status_code", target="status", expected=200)
    eval_status = AssertionEvaluator.evaluate(rule_status, status_code, latency_ms, response_body, response_headers)
    assert eval_status.passed is True

    rule_token = AssertionRule(type="json_contains", target="token", expected="jwt_token")
    eval_token = AssertionEvaluator.evaluate(rule_token, status_code, latency_ms, response_body, response_headers)
    assert eval_token.passed is True


def test_failed_auth_invalid_credentials():
    status_code = 401
    latency_ms = 85.0
    response_body = {"error": "Invalid credentials", "code": "AUTH_FAILED"}
    response_headers = {"content-type": "application/json"}

    rule_status = AssertionRule(type="status_code", target="status", expected=401)
    eval_status = AssertionEvaluator.evaluate(rule_status, status_code, latency_ms, response_body, response_headers)
    assert eval_status.passed is True
