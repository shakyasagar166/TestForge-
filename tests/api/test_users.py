import pytest
from app.testing.assertions import AssertionEvaluator
from app.models.schemas import AssertionRule


def test_user_retrieval_assertions():
    status_code = 200
    latency_ms = 240.0
    response_body = {"id": 10, "username": "qa_tester", "email": "qa@testforge.io", "active": True}
    response_headers = {"content-type": "application/json"}

    rule_email = AssertionRule(type="json_equals", target="email", expected="qa@testforge.io")
    evaluated = AssertionEvaluator.evaluate(rule_email, status_code, latency_ms, response_body, response_headers)
    assert evaluated.passed is True

    rule_latency = AssertionRule(type="response_time_ms", target="latency", expected=500.0)
    eval_latency = AssertionEvaluator.evaluate(rule_latency, status_code, latency_ms, response_body, response_headers)
    assert eval_latency.passed is True
