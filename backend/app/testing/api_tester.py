import time
import json
import httpx
from typing import Dict, Any
from app.models.schemas import TestCase, TestResult, AssertionRule
from app.testing.assertions import AssertionEvaluator
from app.core.config import settings


class APITester:
    """
    Executes live HTTP API requests and evaluates assertion rules.
    """

    @staticmethod
    async def execute_test(test: TestCase, timeout: int = settings.DEFAULT_TIMEOUT_SECONDS) -> TestResult:
        start_time = time.time()
        url = test.url
        method = test.method.upper()

        headers = {
            "User-Agent": "TestForge-QA-Engine/1.0",
            "Content-Type": "application/json",
            **test.headers
        }

        try:
            async with httpx.AsyncClient(timeout=timeout, follow_redirects=True) as client:
                req_kwargs: Dict[str, Any] = {
                    "headers": headers,
                    "params": test.params or None
                }

                if method in ["POST", "PUT", "PATCH"]:
                    if test.body is not None:
                        if isinstance(test.body, (dict, list)):
                            req_kwargs["json"] = test.body
                        else:
                            req_kwargs["content"] = str(test.body)

                response = await client.request(method, url, **req_kwargs)

            duration_ms = round((time.time() - start_time) * 1000, 2)

            # Parse response payload
            try:
                resp_body = response.json()
            except Exception:
                resp_body = response.text[:2000]

            resp_headers = {k.lower(): v for k, v in response.headers.items()}

            # Evaluate assertions
            evaluated_rules = []
            all_passed = True

            # If user provided no custom rules, default to status 200/201/204
            rules = test.assertions or [
                AssertionRule(type="status_code", target="status", expected=response.status_code)
            ]

            for rule in rules:
                eval_rule = AssertionEvaluator.evaluate(
                    rule=rule,
                    status_code=response.status_code,
                    response_time_ms=duration_ms,
                    response_body=resp_body,
                    response_headers=resp_headers
                )
                evaluated_rules.append(eval_rule)
                if eval_rule.passed is False:
                    all_passed = False

            status = "PASSED" if all_passed else "FAILED"

            return TestResult(
                test_case_id=test.id or "dynamic_test",
                test_name=test.name,
                status=status,
                status_code=response.status_code,
                response_time_ms=duration_ms,
                response_body=resp_body,
                response_headers=dict(resp_headers),
                assertions_evaluated=evaluated_rules,
                error_message=None if all_passed else "One or more assertion checks failed."
            )

        except httpx.TimeoutException:
            duration_ms = round((time.time() - start_time) * 1000, 2)
            return TestResult(
                test_case_id=test.id or "timeout_test",
                test_name=test.name,
                status="ERROR",
                status_code=None,
                response_time_ms=duration_ms,
                response_body=None,
                assertions_evaluated=[],
                error_message=f"Request timed out after {timeout} seconds."
            )
        except Exception as e:
            duration_ms = round((time.time() - start_time) * 1000, 2)
            return TestResult(
                test_case_id=test.id or "error_test",
                test_name=test.name,
                status="ERROR",
                status_code=None,
                response_time_ms=duration_ms,
                response_body=None,
                assertions_evaluated=[],
                error_message=f"Execution error: {str(e)}"
            )


api_tester = APITester()
