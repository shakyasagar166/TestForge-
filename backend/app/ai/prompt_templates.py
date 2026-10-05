"""Prompt templates for AI-driven software testing and bug analysis."""

TEST_GENERATION_PROMPT = """
You are a Lead QA Engineer. Generate a comprehensive JSON array of test cases for the specified API endpoint.
Specification / User Story: {prompt}
Target URL: {endpoint_url}
Method: {method}
Requested Test Types: {test_types}

Format your response as a strict JSON array of objects conforming to this schema:
[
  {{
    "name": "Descriptive test name",
    "description": "What this test validates",
    "method": "{method}",
    "url": "{endpoint_url}",
    "headers": {{"Content-Type": "application/json"}},
    "params": {{}},
    "body": {{}},
    "assertions": [
      {{
        "type": "status_code",
        "target": "status",
        "expected": 200
      }},
      {{
        "type": "response_time_ms",
        "target": "latency",
        "expected": 1500
      }}
    ],
    "tags": ["positive", "api"]
  }}
]
Only return the valid JSON array. Do not include markdown code ticks or extraneous commentary.
"""

BUG_ANALYSIS_PROMPT = """
You are a Principal Software QA & Reliability Engineer.
Analyze the following failing test run and diagnose the bug:

Test Name: {test_name}
Target URL: {url}
Status Code Received: {status_code}
Response Time: {response_time_ms}ms
Response Body: {response_body}
Failed Assertions: {failed_assertions}
Error Message: {error_message}
Contextual Code (if any): {code_context}

Provide a structured analysis with:
1. Bug Title
2. Severity (CRITICAL, HIGH, MEDIUM, LOW)
3. Root Cause Analysis
4. Exact Steps to Reproduce
5. Suggested Developer Code Fix
6. Formatted Jira Issue Ticket
"""
