import React, { useState } from 'react';
import { Plus, Trash2, Send, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function TestCaseForm({ onSave, onExecuteNow, isExecuting = false }) {
  const [name, setName] = useState('');
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [body, setBody] = useState('');
  const [assertions, setAssertions] = useState([
    { type: 'status_code', target: 'status', expected: '200' },
    { type: 'response_time_ms', target: 'latency', expected: '1500' }
  ]);
  const [tags, setTags] = useState('smoke, api');

  const addAssertion = () => {
    setAssertions([...assertions, { type: 'status_code', target: 'status', expected: '200' }]);
  };

  const removeAssertion = (index) => {
    setAssertions(assertions.filter((_, idx) => idx !== index));
  };

  const updateAssertion = (index, field, value) => {
    const updated = [...assertions];
    updated[index][field] = value;
    setAssertions(updated);
  };

  const handleSubmit = (e, executeDirectly = false) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    let parsedBody = null;
    if (body.trim()) {
      try {
        parsedBody = JSON.parse(body);
      } catch (err) {
        alert('Invalid JSON body: ' + err.message);
        return;
      }
    }

    const testCase = {
      name,
      method,
      url,
      headers: { 'Content-Type': 'application/json' },
      body: parsedBody,
      assertions: assertions.map(a => ({
        ...a,
        expected: a.type === 'status_code' ? parseInt(a.expected) || 200 : (a.type === 'response_time_ms' ? parseFloat(a.expected) || 1500 : a.expected)
      })),
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    if (executeDirectly) {
      onExecuteNow(testCase);
    } else {
      onSave(testCase);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} style={{
      backgroundColor: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '12px',
      padding: '24px'
    }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>
        Create & Configure API Test Case
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px', marginBottom: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Test Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. GET /posts/1 - Retrieve Specific Post"
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              color: '#fff',
              fontSize: '0.9rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ width: '120px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                color: '#fff',
                fontSize: '0.9rem'
              }}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Endpoint URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://api.example.com/endpoint"
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                color: '#fff',
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>

        {['POST', 'PUT', 'PATCH'].includes(method) && (
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>Request JSON Body</label>
            <textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder='{"title": "Test Title", "userId": 1}'
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                color: '#fff',
                fontFamily: 'monospace',
                fontSize: '0.85rem'
              }}
            />
          </div>
        )}

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Assertion Criteria</label>
            <button
              type="button"
              onClick={addAssertion}
              style={{
                background: 'none',
                border: 'none',
                color: '#34d399',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Plus size={14} /> Add Assertion
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {assertions.map((a, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <select
                  value={a.type}
                  onChange={(e) => updateAssertion(idx, 'type', e.target.value)}
                  style={{
                    width: '160px',
                    padding: '8px',
                    borderRadius: '6px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    color: '#fff',
                    fontSize: '0.8rem'
                  }}
                >
                  <option value="status_code">Status Code</option>
                  <option value="response_time_ms">Latency SLA (ms)</option>
                  <option value="json_equals">JSON Field Equals</option>
                  <option value="json_contains">JSON Contains</option>
                  <option value="header_equals">Header Equals</option>
                </select>

                <input
                  type="text"
                  value={a.target}
                  onChange={(e) => updateAssertion(idx, 'target', e.target.value)}
                  placeholder="Target (e.g. status, id)"
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '6px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    color: '#fff',
                    fontSize: '0.8rem'
                  }}
                />

                <input
                  type="text"
                  value={a.expected}
                  onChange={(e) => updateAssertion(idx, 'expected', e.target.value)}
                  placeholder="Expected value"
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '6px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    color: '#fff',
                    fontSize: '0.8rem'
                  }}
                />

                <button
                  type="button"
                  onClick={() => removeAssertion(idx)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    padding: '6px'
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={(e) => handleSubmit(e, true)}
          disabled={isExecuting}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            backgroundColor: '#1e293b',
            border: '1px solid #10b981',
            color: '#34d399',
            fontWeight: 600,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Send size={15} /> Run Single Test
        </button>

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#10b981',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.85rem'
          }}
        >
          Save Test Case
        </button>
      </div>
    </form>
  );
}
