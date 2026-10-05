import json
from app.models.schemas import AIBugAnalysisRequest, AIBugAnalysisResponse
from app.ai.prompt_templates import BUG_ANALYSIS_PROMPT
from app.services.llm_service import llm_service


class AIBugAnalyzer:
    """
    Diagnoses root causes of test failures, extracts reproduction steps,
    and formats developer bug tickets.
    """

    @staticmethod
    async def analyze_failure(request: AIBugAnalysisRequest) -> AIBugAnalysisResponse:
        res = request.test_result

        failed_assertions_text = "\n".join(
            f"- {a.type}: {a.message} (expected: {a.expected}, actual: {a.actual})"
            for a in res.assertions_evaluated if a.passed is False
        ) or "No individual assertion failures recorded."

        prompt = BUG_ANALYSIS_PROMPT.format(
            test_name=res.test_name,
            url=res.test_case_id,
            status_code=res.status_code or "None (Connection/Timeout Error)",
            response_time_ms=res.response_time_ms,
            response_body=str(res.response_body)[:1000],
            failed_assertions=failed_assertions_text,
            error_message=res.error_message or "N/A",
            code_context=request.code_context or "Not provided"
        )

        llm_result = await llm_service.generate_completion(prompt, temperature=0.2)

        # If LLM response exists
        if not llm_result["is_fallback"] and llm_result["text"]:
            raw = llm_result["text"]
            return AIBugAnalyzer._parse_llm_bug_response(raw, res, llm_result["model"])

        # Fallback Diagnostic Engine
        return AIBugAnalyzer._generate_heuristic_bug_report(res)

    @staticmethod
    def _parse_llm_bug_response(text: str, res, model: str) -> AIBugAnalysisResponse:
        title = f"Bug: Failure in '{res.test_name}'"
        severity = "HIGH" if res.status_code in [500, 502, 503] else "MEDIUM"
        root_cause = "Assertion mismatch between expected contract and live server response."
        steps = [
            f"1. Send HTTP request to target endpoint in test '{res.test_name}'.",
            f"2. Inspect returned status code: received {res.status_code}.",
            "3. Observe assertion failure."
        ]
        suggested_fix = "Verify endpoint validation schema and ensure contract alignment."

        jira_ticket = (
            f"h2. [BUG] {res.test_name}\n\n"
            f"*Severity*: {severity}\n"
            f"*Status Code*: {res.status_code}\n"
            f"*Response Time*: {res.response_time_ms}ms\n\n"
            f"h3. AI Diagnosis Summary\n"
            f"{text[:1200]}\n"
        )

        return AIBugAnalysisResponse(
            bug_title=title,
            severity=severity,
            root_cause=root_cause,
            steps_to_reproduce=steps,
            suggested_fix=suggested_fix,
            jira_markdown_ticket=jira_ticket,
            model_used=model
        )

    @staticmethod
    def _generate_heuristic_bug_report(res) -> AIBugAnalysisResponse:
        failed_msgs = [a.message for a in res.assertions_evaluated if a.passed is False]
        failure_summary = "; ".join(failed_msgs) if failed_msgs else (res.error_message or "Unknown assertion failure")

        severity = "CRITICAL" if res.status_code == 500 else ("HIGH" if res.status == "ERROR" else "MEDIUM")
        title = f"Regression: '{res.test_name}' failed assertion"
        root_cause = f"Server response did not satisfy validation contract. Failed assertions: {failure_summary}"

        steps = [
            f"1. Invoke endpoint configured for '{res.test_name}'.",
            f"2. Server responded with HTTP status {res.status_code} in {res.response_time_ms}ms.",
            f"3. Validated response payload against assertions.",
            f"4. Failure triggered: {failure_summary}."
        ]

        suggested_fix = (
            "1. Inspect the backend route controller handling this endpoint.\n"
            "2. Confirm that response JSON serialization matches the expected schema keys.\n"
            "3. Add boundary input sanitization to prevent unhandled exceptions."
        )

        jira_ticket = (
            f"# [BUG] {title}\n\n"
            f"- **Severity**: {severity}\n"
            f"- **Test Case**: `{res.test_name}` (`{res.test_case_id}`)\n"
            f"- **Response Code**: `{res.status_code}`\n"
            f"- **Latency**: `{res.response_time_ms}ms`\n\n"
            f"### Root Cause Analysis\n"
            f"{root_cause}\n\n"
            f"### Steps to Reproduce\n"
            + "\n".join(f"- {s}" for s in steps) + "\n\n"
            f"### Recommended Code Fix\n"
            f"{suggested_fix}\n"
        )

        return AIBugAnalysisResponse(
            bug_title=title,
            severity=severity,
            root_cause=root_cause,
            steps_to_reproduce=steps,
            suggested_fix=suggested_fix,
            jira_markdown_ticket=jira_ticket,
            model_used="TestForge-Diagnostic-Engine (Offline)"
        )


bug_analyzer = AIBugAnalyzer()
