import React from 'react';
import { 
  CheckCircle2, 
  LayoutDashboard, 
  FileCode2, 
  BarChart3, 
  Sparkles, 
  Play, 
  ShieldCheck,
  Bug,
  ExternalLink,
  Flame
} from 'lucide-react';

export default function Sidebar({ currentPage, onNavigate, stats }) {
  return (
    <aside style={{
      width: '280px',
      backgroundColor: '#0f172a',
      borderRight: '1px solid #1e293b',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      flexShrink: 0
    }}>
      {/* Brand Header */}
      <div style={{ padding: '20px', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
          }}>
            <Flame size={24} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>TestForge</h1>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>AI Software QA & Automation</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <button
          onClick={() => onNavigate('dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            backgroundColor: currentPage === 'dashboard' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            color: currentPage === 'dashboard' ? '#34d399' : '#94a3b8',
            textAlign: 'left'
          }}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => onNavigate('testcases')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            backgroundColor: currentPage === 'testcases' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            color: currentPage === 'testcases' ? '#34d399' : '#94a3b8',
            textAlign: 'left'
          }}
        >
          <FileCode2 size={18} />
          <span>Test Cases & Runner</span>
        </button>

        <button
          onClick={() => onNavigate('reports')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            backgroundColor: currentPage === 'reports' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
            color: currentPage === 'reports' ? '#34d399' : '#94a3b8',
            textAlign: 'left'
          }}
        >
          <BarChart3 size={18} />
          <span>Execution Reports</span>
        </button>
      </nav>

      {/* Quick Stats Pill */}
      <div style={{ flex: 1, padding: '16px' }}>
        <div style={{
          backgroundColor: '#1e293b',
          borderRadius: '10px',
          padding: '14px',
          border: '1px solid #334155'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            QA Quick Metrics
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.85rem' }}>
            <span style={{ color: '#cbd5e1' }}>Overall Pass Rate:</span>
            <span style={{ color: '#34d399', fontWeight: 700 }}>{stats?.overall_pass_rate || 100}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.85rem' }}>
            <span style={{ color: '#cbd5e1' }}>Total Runs:</span>
            <span style={{ color: '#38bdf8', fontWeight: 700 }}>{stats?.total_runs || 0}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.85rem' }}>
            <span style={{ color: '#cbd5e1' }}>Avg Latency:</span>
            <span style={{ color: '#f59e0b', fontWeight: 700 }}>{stats?.avg_latency_ms || 0}ms</span>
          </div>
        </div>
      </div>

      {/* Advanced Engineering & AI Training Resources */}
      <div style={{ padding: '14px 16px', borderTop: '1px solid #1e293b', backgroundColor: 'rgba(16, 185, 129, 0.05)' }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6ee7b7', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          🎓 Advanced AI Engineering
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.75rem' }}>
          <a
            href="https://uncodemy.com/course/software-testing-training-course-in-delhi"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#34d399'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
          >
            <span>RAG Training in Delhi</span>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>↗</span>
          </a>
          <a
            href="https://uncodemy.com/course/software-testing-training-course-in-noida"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#34d399'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
          >
            <span>RAG Training in Noida</span>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>↗</span>
          </a>
        </div>
      </div>

      {/* Footer System Status */}
      <div style={{ padding: '16px', borderTop: '1px solid #1e293b', backgroundColor: '#090d16' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span>Engine Active</span>
          </div>
          <span style={{ color: '#34d399', fontWeight: 600 }}>v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
