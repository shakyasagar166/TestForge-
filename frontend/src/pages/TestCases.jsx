import React, { useState } from 'react';
import TestCaseForm from '../components/TestCaseForm';
import TestResult from '../components/TestResult';
import BugReport from '../components/BugReport';
import { Play, Plus, CheckCircle2, XCircle, Clock, Trash2, Sparkles, Filter } from 'lucide-react';

export default function TestCases({
  testCases = [],
  onSaveTestCase,
  onExecuteSingle,
  onRunSuite,
  isRunningSuite = false,
  suiteResults = null,
  onDiagnoseBug,
  activeBugReport,
  onCloseBugReport
}) {
  const [showForm, setShowForm] = useState(false);
  const [singleResults, setSingleResults] = useState({});

  const handleExecuteSingleTest = async (test) => {
    const res = await onExecuteSingle(test);
    setSingleResults(prev => ({ ...prev, [test.id || test.name]: res }));
  };

  const getMethodColor = (m) => {
    switch (m?.toUpperCase()) {
      case 'GET': return '#3b82f6';
      case 'POST': return '#10b981';
      case 'PUT': return '#f59e0b';
      case 'DELETE': return '#ef4444';
      default: return '#8b5cf6';
    }
  };

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      backgroundColor: '#090d16',
      padding: '36px 40px',
      display: 'flex',
      flexDirection: 'column',
      gap: '28px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            Test Cases & Automation Runner
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '4px' }}>
            Manage saved API tests, define assertions, and execute automated regression test suites.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              color: '#e2e8f0',
              fontWeight: 600,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Plus size={16} /> {showForm ? 'Close Builder' : 'New Test Case'}
          </button>

          <button
            onClick={() => onRunSuite(testCases)}
            disabled={isRunningSuite || testCases.length === 0}
            style={{
              padding: '10px 22px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: isRunningSuite ? '#334155' : '#10b981',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
            }}
          >
            <Play size={16} />
            <span>{isRunningSuite ? 'Executing Suite...' : `Run Suite (${testCases.length})`}</span>
          </button>
        </div>
      </div>

      {/* Form Drawer */}
      {showForm && (
        <TestCaseForm
          onSave={(tc) => {
            onSaveTestCase(tc);
            setShowForm(false);
          }}
          onExecuteNow={handleExecuteSingleTest}
        />
      )}

      {/* Suite Results Banner if recently executed */}
      {suiteResults && (
        <div style={{
          backgroundColor: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '20px 24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                Latest Test Suite Run: {suiteResults.run_id}
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
                {suiteResults.passed_tests} of {suiteResults.total_tests} Tests Passed ({suiteResults.pass_percentage}%)
              </h3>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Duration: {suiteResults.duration_ms}ms
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {suiteResults.results?.map((res, idx) => (
              <TestResult key={idx} result={res} onDiagnoseBug={onDiagnoseBug} />
            ))}
          </div>
        </div>
      )}

      {/* Test Cases List */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '14px' }}>
          Repository Test Cases ({testCases.length})
        </h3>

        {testCases.length === 0 ? (
          <div style={{
            backgroundColor: '#0f172a',
            border: '1px dashed #334155',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            color: '#64748b'
          }}>
            <p>No test cases saved yet.</p>
            <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Click "New Test Case" or use the AI Generator on the dashboard.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {testCases.map((tc, idx) => {
              const res = singleResults[tc.id || tc.name];
              return (
                <div key={idx} style={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: '10px',
                  padding: '16px 20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: `${getMethodColor(tc.method)}20`,
                        color: getMethodColor(tc.method)
                      }}>
                        {tc.method}
                      </span>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>{tc.name}</h4>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px', fontFamily: 'monospace' }}>
                          {tc.url}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        onClick={() => handleExecuteSingleTest(tc)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          backgroundColor: '#1e293b',
                          border: '1px solid #334155',
                          color: '#34d399',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Play size={14} /> Run
                      </button>
                    </div>
                  </div>

                  {/* Render single test execution outcome if run */}
                  {res && (
                    <div style={{ marginTop: '14px' }}>
                      <TestResult result={res} onDiagnoseBug={onDiagnoseBug} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* AI Bug Diagnosis Modal */}
      {activeBugReport && (
        <BugReport bugData={activeBugReport} onClose={onCloseBugReport} />
      )}
    </div>
  );
}
