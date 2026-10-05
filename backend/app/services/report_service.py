import os
import json
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime
from app.models.schemas import TestSuiteRunResponse, DashboardStats, TestCase
from app.core.config import settings


class ReportService:
    """
    Manages test execution reports, historical metrics, and test case persistence.
    """

    def __init__(self):
        self.reports_dir = Path(settings.REPORTS_DIR)
        self.test_cases_dir = Path(settings.TEST_DATA_DIR) / "test_cases"
        self.history: List[Dict] = []
        self._load_existing_reports()

    def _load_existing_reports(self):
        try:
            for p in sorted(self.reports_dir.glob("run_*.json"), key=os.path.getmtime, reverse=True):
                with open(p, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.history.append(data)
        except Exception as e:
            print(f"[ReportService] Error loading historical reports: {e}")

    def save_run_report(self, run_response: TestSuiteRunResponse):
        data = run_response.model_dump()
        self.history.insert(0, data)

        report_file = self.reports_dir / f"{run_response.run_id}.json"
        try:
            with open(report_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            print(f"[ReportService] Error saving run report {run_response.run_id}: {e}")

    def get_run_history(self, limit: int = 20) -> List[Dict]:
        return self.history[:limit]

    def get_run_report(self, run_id: str) -> Optional[Dict]:
        for r in self.history:
            if r.get("run_id") == run_id:
                return r
        file_path = self.reports_dir / f"{run_id}.json"
        if file_path.exists():
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
        return None

    def get_dashboard_stats(self) -> DashboardStats:
        total_runs = len(self.history)
        if total_runs == 0:
            return DashboardStats(
                total_test_cases=len(self.list_saved_test_cases()),
                total_runs=0,
                overall_pass_rate=100.0,
                avg_latency_ms=0.0,
                total_bugs_detected=0
            )

        total_tests = sum(r.get("total_tests", 0) for r in self.history)
        total_passed = sum(r.get("passed_tests", 0) for r in self.history)
        total_failed = sum(r.get("failed_tests", 0) for r in self.history)

        pass_rate = round((total_passed / total_tests) * 100, 2) if total_tests > 0 else 100.0

        all_latencies = []
        for r in self.history:
            for item in r.get("results", []):
                if "response_time_ms" in item:
                    all_latencies.append(item["response_time_ms"])

        avg_latency = round(sum(all_latencies) / len(all_latencies), 1) if all_latencies else 0.0

        return DashboardStats(
            total_test_cases=len(self.list_saved_test_cases()),
            total_runs=total_runs,
            overall_pass_rate=pass_rate,
            avg_latency_ms=avg_latency,
            total_bugs_detected=total_failed
        )

    def save_test_cases(self, tests: List[TestCase]):
        for t in tests:
            file_name = f"{t.id or t.name.replace(' ', '_').lower()}.json"
            target = self.test_cases_dir / file_name
            try:
                with open(target, "w", encoding="utf-8") as f:
                    json.dump(t.model_dump(), f, indent=2)
            except Exception as e:
                print(f"[ReportService] Error saving test case {t.name}: {e}")

    def list_saved_test_cases(self) -> List[TestCase]:
        cases = []
        try:
            for p in self.test_cases_dir.glob("*.json"):
                with open(p, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    cases.append(TestCase(**data))
        except Exception as e:
            print(f"[ReportService] Error reading test cases: {e}")
        return cases


report_service = ReportService()
