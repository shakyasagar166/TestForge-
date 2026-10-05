import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

export const api = {
  async getDashboardStats() {
    const res = await apiClient.get('/tests/dashboard/stats');
    return res.data;
  },

  async getTestCases() {
    const res = await apiClient.get('/tests/cases');
    return res.data;
  },

  async saveTestCase(testCase) {
    const res = await apiClient.post('/tests/cases', testCase);
    return res.data;
  },

  async executeSingleTest(testCase) {
    const res = await apiClient.post('/tests/execute', testCase);
    return res.data;
  },

  async runTestSuite(testCases = null) {
    const payload = testCases ? { test_cases: testCases } : {};
    const res = await apiClient.post('/tests/run-suite', payload);
    return res.data;
  },

  async getReportsHistory() {
    const res = await apiClient.get('/tests/reports');
    return res.data.reports || [];
  },

  async getReportDetail(runId) {
    const res = await apiClient.get(`/tests/reports/${runId}`);
    return res.data;
  },

  async generateAITestCases({ prompt, endpoint_url, method, test_types }) {
    const res = await apiClient.post('/ai/generate', {
      prompt,
      endpoint_url,
      method,
      test_types,
    });
    return res.data;
  },

  async analyzeBugFailure(testResult, codeContext = null) {
    const res = await apiClient.post('/bugs/analyze', {
      test_result: testResult,
      code_context: codeContext,
    });
    return res.data;
  },
};
