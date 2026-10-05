import json
from typing import Any, Dict, List, Tuple
from app.models.schemas import AssertionRule


class AssertionEvaluator:
    """
    Evaluates HTTP test assertions including status codes, latency thresholds,
    JSON path values, headers, and containment checks.
    """

    @staticmethod
    def evaluate(
        rule: AssertionRule,
        status_code: int,
        response_time_ms: float,
        response_body: Any,
        response_headers: Dict[str, str]
    ) -> AssertionRule:
        rule_copy = rule.model_copy()
        try:
            if rule.type == "status_code":
                expected_code = int(rule.expected)
                rule_copy.actual = status_code
                rule_copy.passed = (status_code == expected_code)
                rule_copy.message = f"Status code was {status_code}, expected {expected_code}"

            elif rule.type == "response_time_ms":
                threshold = float(rule.expected)
                rule_copy.actual = round(response_time_ms, 2)
                rule_copy.passed = (response_time_ms <= threshold)
                rule_copy.message = f"Response time was {response_time_ms:.1f}ms (threshold: {threshold}ms)"

            elif rule.type == "json_equals":
                val = AssertionEvaluator._extract_json_path(response_body, rule.target)
                rule_copy.actual = val
                rule_copy.passed = (str(val) == str(rule.expected))
                rule_copy.message = f"Field '{rule.target}' was '{val}', expected '{rule.expected}'"

            elif rule.type == "json_contains":
                val = AssertionEvaluator._extract_json_path(response_body, rule.target)
                rule_copy.actual = val
                if isinstance(val, (list, dict, str)):
                    rule_copy.passed = str(rule.expected).lower() in str(val).lower()
                else:
                    rule_copy.passed = False
                rule_copy.message = f"Field '{rule.target}' contains check for '{rule.expected}'"

            elif rule.type == "header_equals":
                header_key = rule.target.lower()
                actual_val = response_headers.get(header_key, "")
                rule_copy.actual = actual_val
                rule_copy.passed = (str(actual_val).lower() == str(rule.expected).lower())
                rule_copy.message = f"Header '{header_key}' was '{actual_val}', expected '{rule.expected}'"

            else:
                rule_copy.passed = True
                rule_copy.actual = "Unknown rule type"
                rule_copy.message = "Skipped"

        except Exception as e:
            rule_copy.passed = False
            rule_copy.actual = f"Evaluation error: {str(e)}"
            rule_copy.message = f"Error evaluating assertion: {str(e)}"

        return rule_copy

    @staticmethod
    def _extract_json_path(data: Any, path: str) -> Any:
        if not path or path == "." or path == "body":
            return data
        if not isinstance(data, dict):
            return data

        parts = path.split(".")
        curr = data
        for p in parts:
            if isinstance(curr, dict) and p in curr:
                curr = curr[p]
            elif isinstance(curr, list) and p.isdigit() and int(p) < len(curr):
                curr = curr[int(p)]
            else:
                return None
        return curr
