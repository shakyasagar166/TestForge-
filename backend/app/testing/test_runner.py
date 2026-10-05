import uuid
import time
from typing import List
from app.models.schemas import TestCase, TestResult, TestSuiteRunResponse
from app.testing.api_tester import api_tester
from app.services.report_service import report_service


class TestRunner:
    """
    Orchestrates batch test execution, aggregates metrics, and archives run reports.
    """

    @staticmethod
    async def run_suite(tests: List[TestCase]) -> TestSuiteRunResponse:
        start_time = time.time()
        run_id = f"run_{uuid.uuid4().hex[:8]}"
        results: List[TestResult] = []

        passed_count = 0
        failed_count = 0

        for test in tests:
            result = await api_tester.execute_test(test)
            results.append(result)
            if result.status == "PASSED":
                passed_count += 1
            else:
                failed_count += 1

        total_tests = len(tests)
        pass_percentage = round((passed_count / total_tests) * 100, 2) if total_tests > 0 else 0.0
        duration_ms = round((time.time() - start_time) * 1000, 2)

        response = TestSuiteRunResponse(
            run_id=run_id,
            total_tests=total_tests,
            passed_tests=passed_count,
            failed_tests=failed_count,
            pass_percentage=pass_percentage,
            duration_ms=duration_ms,
            results=results
        )

        # Persist report to reports service
        report_service.save_run_report(response)

        return response


test_runner = TestRunner()
