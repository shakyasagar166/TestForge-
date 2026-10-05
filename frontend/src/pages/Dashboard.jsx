import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Play, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  Bug, 
  ExternalLink,
  BookOpen,
  Activity
} from 'lucide-react';

export default function Dashboard({ stats, onNavigate, onGenerateAI, isGeneratingAI }) {
  const [prompt, setPrompt] = useState('Create API tests for an e-commerce checkout payment endpoint');
  const [method, setMethod] = useState('POST');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts');

  const handleQuickGenerate = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onGenerateAI({
      prompt,
      endpoint_url: url,
      method,
      test_types: ['positive', 'negative', 'boundary']
    });
  };

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      backgroundColor: '#090d16',
      padding: '36px 40px',
      display: 'flex',
      flexDirection: 'column',
      gap: '32px'
    }}>
      {/* Top Welcome Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
            QA Automation Dashboard
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '4px' }}>
            Continuous API validation, autonomous test generation, and AI-powered defect triage.
          </p>
        </div>

        <button
          onClick={() => onNavigate('testcases')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#10b981',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
          }}
        >
          <Play size={16} /> Run Test Suite
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <div style={{
          backgroundColor: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>OVERALL PASS RATE</span>
            <CheckCircle2 size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', marginTop: '10px' }}>
            {stats?.overall_pass_rate || 100}%
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Across all automated runs</p>
        </div>

        <div style={{
          backgroundColor: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>TEST CASES REPOSITORY</span>
            <Layers size={18} color="#38bdf8" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginTop: '10px' }}>
            {stats?.total_test_cases || 0}
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Saved and verified test cases</p>
        </div>

        <div style={{
          backgroundColor: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>AVERAGE LATENCY</span>
            <Clock size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24', marginTop: '10px' }}>
            {stats?.avg_latency_ms || 0}ms
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>End-to-end response time</p>
        </div>

        <div style={{
          backgroundColor: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>
            <span>DEFECTS DETECTED</span>
            <Bug size={18} color="#f87171" />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f87171', marginTop: '10px' }}>
            {stats?.total_bugs_detected || 0}
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Failed assertion events</p>
        </div>
      </div>

      {/* AI Test Generation Box */}
      <div style={{
        backgroundColor: '#0f172a',
        border: '1px solid #1e293b',
        borderRadius: '16px',
        padding: '28px',
        background: 'linear-gradient(135deg, #0f172a 0%, #11221b 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={20} color="#10b981" />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
            AI Test Suite Generator
          </h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '20px' }}>
          Describe your API requirement, user story, or endpoint specification. TestForge uses Google Gemini to generate positive, negative, and boundary test cases instantly.
        </p>

        <form onSubmit={handleQuickGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              style={{
                width: '110px',
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>

            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Target URL"
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                color: '#fff',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Verify user creation with valid schema, duplicate email rejection, and missing password validation"
              style={{
                flex: 1,
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                color: '#fff',
                fontSize: '0.9rem'
              }}
            />

            <button
              type="submit"
              disabled={isGeneratingAI}
              style={{
                padding: '0 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#10b981',
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Sparkles size={16} />
              <span>{isGeneratingAI ? 'Generating Tests...' : 'Generate Test Cases'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* RAG Engineering & Advanced AI Upskilling Banner */}
      <div style={{
        backgroundColor: '#0f172a',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: '14px',
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(6, 78, 59, 0.3) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <BookOpen size={20} color="#34d399" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
            Upskill in AI Engineering, Testing Agents & RAG Architectures
          </h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '16px' }}>
          Accelerate your QA automation and AI systems engineering skills with comprehensive classroom and practical industry courses:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <a
            href="https://uncodemy.com/course/rag-engineering-course-training-course-in-delhi"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              color: '#6ee7b7',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#10b981';
              e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#334155';
              e.currentTarget.style.backgroundColor = '#1e293b';
            }}
          >
            <span>🏛️ RAG Engineering Training Course in Delhi</span>
            <ExternalLink size={14} />
          </a>
          <a
            href="https://uncodemy.com/course/rag-engineering-course-training-course-in-noida"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              color: '#6ee7b7',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#10b981';
              e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#334155';
              e.currentTarget.style.backgroundColor = '#1e293b';
            }}
          >
            <span>🏢 RAG Engineering Training Course in Noida</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
