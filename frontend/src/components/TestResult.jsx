import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Clock, ChevronDown, ChevronRight, Bug, Sparkles } from 'lucide-react';

export default function TestResult({ result, onDiagnoseBug }) {
  const [showPayload, setShowPayload] = useState(false);
  const isPassed = result.status === 'PASSED';

  return (
    <div style={{
      backgroundColor: '#1e293b',
      border: `1px solid ${isPassed ? '#059669' : '#dc2626'}`,
      borderRadius: '10px',
      padding: '16px 20px',
      marginBottom: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isPassed ? (
            <CheckCircle2 size={20} color="#34d399" />
          ) : (
            <XCircle size={20} color="#f87171" />
          )}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>{result.test_name}</h4>
            <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#94a3b8', marginTop: '3px' }}>
              <span>HTTP Status: <strong style={{ color: '#fff' }}>{result.status_code || 'N/A'}</strong></span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Clock size={12} /> {result.response_time_ms}ms
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!isPassed && onDiagnoseBug && (
            <button
              onClick={() => onDiagnoseBug(result)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #ef4444',
                color: '#f87171',
                fontSize: '0.8rem',
                fontWeight: 600
              }}
            >
              <Bug size={14} /> AI Diagnose Defect
            </button>
          )}

          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: '6px',
            backgroundColor: isPassed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            color: isPassed ? '#34d399' : '#f87171'
          }}>
            {result.status}
          </span>
        </div>
      </div>

      {/* Evaluated Assertions List */}
      {result.assertions_evaluated && result.assertions_evaluated.length > 0 && (
        <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #334155' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
            Assertion Breakdown:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
            {result.assertions_evaluated.map((rule, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8rem',
                color: rule.passed ? '#cbd5e1' : '#fca5a5'
              }}>
                {rule.passed ? <CheckCircle2 size={14} color="#34d399" /> : <XCircle size={14} color="#f87171" />}
                <span>{rule.message || `${rule.type}: expected ${rule.expected}, got ${rule.actual}`}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toggle Response Payload */}
      <div style={{ marginTop: '10px' }}>
        <button
          onClick={() => setShowPayload(!showPayload)}
          style={{
            background: 'none',
            border: 'none',
            color: '#38bdf8',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 0'
          }}
        >
          {showPayload ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          <span>{showPayload ? 'Hide Response Body' : 'View Response Payload'}</span>
        </button>

        {showPayload && (
          <pre style={{
            marginTop: '8px',
            backgroundColor: '#090e16',
            border: '1px solid #334155',
            borderRadius: '6px',
            padding: '12px',
            fontSize: '0.75rem',
            color: '#38bdf8',
            overflowX: 'auto',
            maxHeight: '200px'
          }}>
            {JSON.stringify(result.response_body, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
