from typing import List, Optional
from fastapi import APIRouter, HTTPException, status
from app.models.schemas import TestCase, TestResult, TestSuiteRunRequest, TestSuiteRunResponse, DashboardStats
from app.testing.api_tester import api_tester
from app.testing.test_runner import test_runner
from app.services.report_service import report_service

router = APIRouter(prefix="/tests", tags=["testing"])


@router.post("/execute", response_model=TestResult)
async def execute_single_test(test: TestCase):
    """
    Execute a single API test case and evaluate assertions.
    """
    try:
        return await api_tester.execute_test(test)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Test execution error: {str(e)}"
        )


@router.post("/run-suite", response_model=TestSuiteRunResponse)
async def run_test_suite(request: TestSuiteRunRequest):
    """
    Execute a full batch test suite and archive execution metrics.
    """
    tests = request.test_cases
    if not tests:
        # Load saved test cases if none provided
        tests = report_service.list_saved_test_cases()

    if not tests:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No test cases provided or saved in the repository."
        )

    try:
        return await test_runner.run_suite(tests)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Suite execution error: {str(e)}"
        )


@router.get("/cases", response_model=List[TestCase])
def get_saved_test_cases():
    """
    List all persisted test cases.
    """
    return report_service.list_saved_test_cases()


@router.post("/cases", response_model=TestCase)
def save_test_case(test: TestCase):
    """
    Save or update a test case in test_data/test_cases.
    """
    import uuid
    if not test.id:
        test.id = f"tc_{uuid.uuid4().hex[:6]}"
    report_service.save_test_cases([test])
    return test


@router.get("/reports")
def get_reports_history():
    """
    Get historical test run summaries.
    """
    return {"reports": report_service.get_run_history()}


@router.get("/reports/{run_id}")
def get_report_detail(run_id: str):
    """
    Get deep execution results for a specific run ID.
    """
    report = report_service.get_run_report(run_id)
    if not report:
        raise HTTPException(status_code=404, detail="Run report not found.")
    return report


@router.get("/dashboard/stats", response_model=DashboardStats)
def get_dashboard_metrics():
    """
    Get high-level QA execution statistics and bug metrics.
    """
    return report_service.get_dashboard_stats()
