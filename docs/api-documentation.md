# TestForge REST API Documentation

The TestForge backend exposes RESTful endpoints for automated API execution, AI test generation, defect diagnosis, and metrics collection.

## Base URL
`http://localhost:8000/api/v1`

---

## 1. Test Execution & Management (`/tests`)

### Execute Single Test
- **Method**: `POST /tests/execute`
- **Body**: `TestCase` schema
- **Returns**: `TestResult` including evaluated assertion breakdown and execution duration.

### Execute Batch Test Suite
- **Method**: `POST /tests/run-suite`
- **Body**: `TestSuiteRunRequest` (optional list of tests or defaults to saved suite)
- **Returns**: `TestSuiteRunResponse` with pass/fail counts, duration, and archived report.

### List Saved Test Cases
- **Method**: `GET /tests/cases`
- **Returns**: Array of `TestCase` definitions.

### Save New Test Case
- **Method**: `POST /tests/cases`
- **Body**: `TestCase`

### Retrieve Execution Reports
- **Method**: `GET /tests/reports`
- **Returns**: History of test execution runs.

### Get Dashboard Metrics
- **Method**: `GET /tests/dashboard/stats`
- **Returns**: Overall pass rate, total runs, active defects, and average latency.

---

## 2. AI Testing & Generation (`/ai`)

### Generate Test Cases with AI
- **Method**: `POST /ai/generate`
- **Body**:
  ```json
  {
    "prompt": "User registration endpoint with email, password, and age",
    "endpoint_url": "https://api.example.com/register",
    "method": "POST",
    "test_types": ["positive", "negative", "boundary"]
  }
  ```
- **Returns**: Array of structured `TestCase` objects with auto-generated assertions.

---

## 3. AI Defect & Bug Diagnosis (`/bugs`)

### Analyze Test Failure
- **Method**: `POST /bugs/analyze`
- **Body**:
  ```json
  {
    "test_result": { ... },
    "code_context": "def register(user): ..."
  }
  ```
- **Returns**: Root cause, severity, reproduction steps, code fix, and Jira ticket.
