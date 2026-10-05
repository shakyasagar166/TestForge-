import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import TestCases from './pages/TestCases';
import Reports from './pages/Reports';
import { api } from './services/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [reports, setReports] = useState([]);
  const [isRunningSuite, setIsRunningSuite] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [suiteResults, setSuiteResults] = useState(null);
  const [activeBugReport, setActiveBugReport] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [statsData, casesData, reportsData] = await Promise.all([
        api.getDashboardStats().catch(() => null),
        api.getTestCases().catch(() => []),
        api.getReportsHistory().catch(() => [])
      ]);
      setStats(statsData);
      setTestCases(casesData || []);
      setReports(reportsData || []);
    } catch (err) {
      console.error('Initialization error:', err);
    }
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleSaveTestCase = async (testCase) => {
    try {
      await api.saveTestCase(testCase);
      await fetchInitialData();
    } catch (err) {
      alert('Error saving test case: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleExecuteSingle = async (testCase) => {
    try {
      return await api.executeSingleTest(testCase);
    } catch (err) {
      alert('Execution failed: ' + (err.response?.data?.detail || err.message));
      return null;
    }
  };

  const handleRunSuite = async (testsToRun = null) => {
    setIsRunningSuite(true);
    try {
      const res = await api.runTestSuite(testsToRun);
      setSuiteResults(res);
      await fetchInitialData();
      setCurrentPage('testcases');
    } catch (err) {
      alert('Suite run failed: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsRunningSuite(false);
    }
  };

  const handleGenerateAI = async (generationConfig) => {
    setIsGeneratingAI(true);
    try {
      const res = await api.generateAITestCases(generationConfig);
      await fetchInitialData();
      setCurrentPage('testcases');
    } catch (err) {
      alert('AI Generation error: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleDiagnoseBug = async (testResult) => {
    try {
      const bugData = await api.analyzeBugFailure(testResult);
      setActiveBugReport(bugData);
    } catch (err) {
      alert('Defect diagnosis error: ' + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        stats={stats}
      />

      <main style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {currentPage === 'dashboard' && (
          <Dashboard
            stats={stats}
            onNavigate={handleNavigate}
            onGenerateAI={handleGenerateAI}
            isGeneratingAI={isGeneratingAI}
          />
        )}

        {currentPage === 'testcases' && (
          <TestCases
            testCases={testCases}
            onSaveTestCase={handleSaveTestCase}
            onExecuteSingle={handleExecuteSingle}
            onRunSuite={handleRunSuite}
            isRunningSuite={isRunningSuite}
            suiteResults={suiteResults}
            onDiagnoseBug={handleDiagnoseBug}
            activeBugReport={activeBugReport}
            onCloseBugReport={() => setActiveBugReport(null)}
          />
        )}

        {currentPage === 'reports' && (
          <Reports
            reports={reports}
            onDiagnoseBug={handleDiagnoseBug}
            activeBugReport={activeBugReport}
            onCloseBugReport={() => setActiveBugReport(null)}
          />
        )}
      </main>
    </div>
  );
}
