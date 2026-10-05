from typing import List, Dict, Any, Optional, Union
from datetime import datetime
from pydantic import BaseModel, Field


class AssertionRule(BaseModel):
    type: str = Field(..., description="status_code, response_time_ms, json_equals, json_contains, header_equals")
    target: str = Field(..., description="Target property or JSONPath, e.g. 'status', 'id', 'headers.content-type'")
    expected: Any = Field(..., description="Expected value")
    actual: Optional[Any] = None
    passed: Optional[bool] = None
    message: Optional[str] = None


class TestCase(BaseModel):
    id: str = Field(default="", description="Unique identifier for test case")
    name: str = Field(..., description="Readable name of the test case")
    description: Optional[str] = None
    method: str = Field(default="GET", description="HTTP Method: GET, POST, PUT, DELETE, PATCH")
    url: str = Field(..., description="Target endpoint URL")
    headers: Dict[str, str] = Field(default_factory=dict)
    params: Optional[Dict[str, Any]] = Field(default_factory=dict)
    body: Optional[Any] = None
    assertions: List[AssertionRule] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class TestResult(BaseModel):
    test_case_id: str
    test_name: str
    status: str = Field(description="PASSED, FAILED, or ERROR")
    status_code: Optional[int] = None
    response_time_ms: float = 0.0
    response_body: Optional[Any] = None
    response_headers: Optional[Dict[str, str]] = None
    assertions_evaluated: List[AssertionRule] = Field(default_factory=list)
    error_message: Optional[str] = None
    executed_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class TestSuiteRunRequest(BaseModel):
    test_cases: Optional[List[TestCase]] = None
    environment_url: Optional[str] = None


class TestSuiteRunResponse(BaseModel):
    run_id: str
    total_tests: int
    passed_tests: int
    failed_tests: int
    pass_percentage: float
    duration_ms: float
    results: List[TestResult]
    executed_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())


class AITestGenerationRequest(BaseModel):
    prompt: str = Field(..., description="User story, endpoint spec, or OpenAPI schema description")
    endpoint_url: Optional[str] = "https://jsonplaceholder.typicode.com/posts"
    method: Optional[str] = "POST"
    test_types: List[str] = Field(default=["positive", "negative", "boundary"], description="positive, negative, boundary, edge_case")


class AITestGenerationResponse(BaseModel):
    generated_test_cases: List[TestCase]
    summary: str
    model_used: str


class AIBugAnalysisRequest(BaseModel):
    test_result: TestResult
    code_context: Optional[str] = None


class AIBugAnalysisResponse(BaseModel):
    bug_title: str
    severity: str = Field(description="CRITICAL, HIGH, MEDIUM, LOW")
    root_cause: str
    steps_to_reproduce: List[str]
    suggested_fix: str
    jira_markdown_ticket: str
    model_used: str


class DashboardStats(BaseModel):
    total_test_cases: int
    total_runs: int
    overall_pass_rate: float
    avg_latency_ms: float
    total_bugs_detected: int
