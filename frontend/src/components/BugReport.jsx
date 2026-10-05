import React, { useState } from 'react';
import { Bug, X, Copy, Check, ShieldAlert, Cpu } from 'lucide-react';

export default function BugReport({ bugData, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(bugData.jira_markdown_ticket || bugData.root_cause);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getSeverityColor = (sev) => {
    switch (sev?.toUpperCase()) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH': return '#f97316';
      case 'MEDIUM': return '#f59e0b';
      default: return '#3b82f6';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#0f172a',
        borderRadius: '16px',
        border: '1px solid #334155',
        maxWidth: '720px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.6)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '4px',
                backgroundColor: `${getSeverityColor(bugData.severity)}25`,
                color: getSeverityColor(bugData.severity),
                border: `1px solid ${getSeverityColor(bugData.severity)}`
              }}>
                {bugData.severity} SEVERITY
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Cpu size={12} /> {bugData.model_used}
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>{bugData.bug_title}</h3>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Root Cause */}
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '8px',
          padding: '16px',
          borderLeft: `4px solid ${getSeverityColor(bugData.severity)}`,
          marginBottom: '16px'
        }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
            Root Cause Diagnosis
          </h4>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            {bugData.root_cause}
          </p>
        </div>

        {/* Steps to Reproduce */}
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
            Steps to Reproduce
          </h4>
          <ul style={{ paddingLeft: '20px', color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.6 }}>
            {bugData.steps_to_reproduce?.map((step, idx) => (
              <li key={idx} style={{ marginBottom: '4px' }}>{step}</li>
            ))}
          </ul>
        </div>

        {/* Suggested Fix */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
            Recommended Developer Fix
          </h4>
          <pre style={{
            backgroundColor: '#090e16',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '14px',
            fontSize: '0.85rem',
            color: '#34d399',
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap'
          }}>
            {bugData.suggested_fix}
          </pre>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #334155', paddingTop: '16px' }}>
          <button
            onClick={handleCopyTicket}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              color: copied ? '#34d399' : '#e2e8f0',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Jira Ticket Copied!' : 'Copy Jira Ticket'}</span>
          </button>

          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#10b981',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
