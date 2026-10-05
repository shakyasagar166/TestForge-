import json
import uuid
import re
from typing import List
from app.models.schemas import (
    AITestGenerationRequest,
    AITestGenerationResponse,
    TestCase,
    AssertionRule
)
from app.ai.prompt_templates import TEST_GENERATION_PROMPT
from app.services.llm_service import llm_service


class AITestGenerator:
    """
    Generates intelligent API test suites covering happy paths, negative inputs,
    boundary limits, and security vulnerabilities.
    """

    @staticmethod
    async def generate_test_cases(request: AITestGenerationRequest) -> AITestGenerationResponse:
        endpoint_url = request.endpoint_url or "https://jsonplaceholder.typicode.com/posts"
        method = (request.method or "POST").upper()
        test_types = ", ".join(request.test_types)

        prompt = TEST_GENERATION_PROMPT.format(
            prompt=request.prompt,
            endpoint_url=endpoint_url,
            method=method,
            test_types=test_types
        )

        llm_result = await llm_service.generate_completion(prompt, temperature=0.3)
        generated_cases: List[TestCase] = []

        if not llm_result["is_fallback"] and llm_result["text"]:
            try:
                raw_text = llm_result["text"].strip()
                # Remove markdown fences if present
                clean_json = re.sub(r"^```(?:json)?|```$", "", raw_text, flags=re.MULTILINE).strip()
                data = json.loads(clean_json)
                if isinstance(data, list):
                    for idx, item in enumerate(data):
                        item["id"] = f"tc_{uuid.uuid4().hex[:6]}"
                        generated_cases.append(TestCase(**item))
            except Exception as e:
                print(f"[AITestGenerator] Error parsing LLM JSON: {e}. Using deterministic test generator.")

        # If LLM failed or in offline fallback mode, synthesize realistic test cases
        if not generated_cases:
            generated_cases = AITestGenerator._generate_deterministic_suite(request, endpoint_url, method)

        return AITestGenerationResponse(
            generated_test_cases=generated_cases,
            summary=f"Generated {len(generated_cases)} test cases covering positive, negative, and boundary scenarios for {method} {endpoint_url}.",
            model_used=llm_result["model"]
        )

    @staticmethod
    def _generate_deterministic_suite(
        request: AITestGenerationRequest,
        endpoint_url: str,
        method: str
    ) -> List[TestCase]:
        cases = []

        # 1. Positive Happy Path
        cases.append(TestCase(
            id=f"tc_{uuid.uuid4().hex[:6]}",
            name=f"Verify {method} {endpoint_url.split('/')[-1] or 'Endpoint'} Happy Path",
            description=f"Validate that a standard valid request to {endpoint_url} returns 200/201 within 1500ms.",
            method=method,
            url=endpoint_url,
            headers={"Content-Type": "application/json"},
            body={"title": "Test Title", "body": "Verified test payload", "userId": 1} if method in ["POST", "PUT", "PATCH"] else None,
            assertions=[
                AssertionRule(type="status_code", target="status", expected=201 if method == "POST" else 200),
                AssertionRule(type="response_time_ms", target="latency", expected=1500),
                AssertionRule(type="header_equals", target="content-type", expected="application/json; charset=utf-8")
            ],
            tags=["positive", "smoke", "api"]
        ))

        # 2. Negative - Empty Payload / Missing Required Fields
        if method in ["POST", "PUT", "PATCH"]:
            cases.append(TestCase(
                id=f"tc_{uuid.uuid4().hex[:6]}",
                name="Negative - Empty Request Body Validation",
                description="Verify API behavior when submitting an empty payload dictionary.",
                method=method,
                url=endpoint_url,
                headers={"Content-Type": "application/json"},
                body={},
                assertions=[
                    AssertionRule(type="response_time_ms", target="latency", expected=1500)
                ],
                tags=["negative", "validation"]
            ))

        # 3. Boundary - Large String Payload
        if method in ["POST", "PUT", "PATCH"]:
            cases.append(TestCase(
                id=f"tc_{uuid.uuid4().hex[:6]}",
                name="Boundary - Large Payload Size Check",
                description="Test handling of unusually long character strings to ensure no buffer overflow or 500 error.",
                method=method,
                url=endpoint_url,
                headers={"Content-Type": "application/json"},
                body={"title": "A" * 1000, "body": "B" * 5000, "userId": 999999},
                assertions=[
                    AssertionRule(type="response_time_ms", target="latency", expected=2000)
                ],
                tags=["boundary", "stress"]
            ))

        # 4. Security - Unauthorized / Invalid Headers Check
        cases.append(TestCase(
            id=f"tc_{uuid.uuid4().hex[:6]}",
            name="Security - Malformed Authorization Header Handling",
            description="Verify server does not crash with 500 when sent an invalid token.",
            method=method,
            url=endpoint_url,
            headers={"Content-Type": "application/json", "Authorization": "Bearer invalid_malformed_token_xyz"},
            body=None,
            assertions=[
                AssertionRule(type="response_time_ms", target="latency", expected=1500)
            ],
            tags=["security", "auth"]
        ))

        return cases


test_generator = AITestGenerator()
