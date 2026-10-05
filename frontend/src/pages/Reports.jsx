import React, { useState } from 'react';
import TestResult from '../components/TestResult';
import BugReport from '../components/BugReport';
import { BarChart3, CheckCircle2, XCircle, Clock, ChevronDown, ChevronRight, FileText } from 'lucide-react';

export default function Reports({
  reports = [],
  onDiagnoseBug,
  activeBugReport,
  onCloseBugReport
}) {
  const [selectedRunId, setSelectedRunId] = useState(null);

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
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          Test Execution Reports & History
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '4px' }}>
          Archived test execution runs, regression metrics, and failure diagnostics.
        </p>
      </div>

      {reports.length === 0 ? (
        <div style={{
          backgroundColor: '#0f172a',
          border: '1px dashed #334155',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          color: '#64748b'
        }}>
          <FileText size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
          <p>No historical reports found.</p>
          <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Execute a test suite from the dashboard or test cases page to generate a report.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {reports.map((run, idx) => {
            const isExpanded = selectedRunId === run.run_id;
            const isAllPassed = run.failed_tests === 0;

            return (
              <div key={idx} style={{
                backgroundColor: '#0f172a',
                border: `1px solid ${isAllPassed ? '#1e293b' : 'rgba(239, 68, 68, 0.3)'}`,
                borderRadius: '12px',
                padding: '20px 24px'
              }}>
                <div
                  onClick={() => setSelectedRunId(isExpanded ? null : run.run_id)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {isAllPassed ? (
                      <CheckCircle2 size={24} color="#10b981" />
                    ) : (
                      <XCircle size={24} color="#ef4444" />
                    )}
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                        Run ID: {run.run_id}
                      </h3>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                        <span>Executed: {new Date(run.executed_at).toLocaleString()}</span>
                        <span>•</span>
                        <span>Duration: {run.duration_ms}ms</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        color: isAllPassed ? '#34d399' : '#f87171'
                      }}>
                        {run.pass_percentage}% Passed
                      </span>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {run.passed_tests} pass, {run.failed_tests} fail ({run.total_tests} total)
                      </p>
                    </div>

                    <div style={{ color: '#94a3b8' }}>
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #1e293b' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '12px', textTransform: 'uppercase' }}>
                      Individual Test Outcomes:
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {run.results?.map((res, rIdx) => (
                        <TestResult key={rIdx} result={res} onDiagnoseBug={onDiagnoseBug} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeBugReport && (
        <BugReport bugData={activeBugReport} onClose={onCloseBugReport} />
      )}
    </div>
  );
}
