import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { apiService } from '../services/api';

export function AlertCard({ alert, onResolve }) {
  const handleResolve = async () => {
    try {
      await apiService.resolveAlert(alert.id);
      if (onResolve) onResolve(alert.id);
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    }
  };

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      padding: '1.25rem',
      marginBottom: '1rem',
      display: 'flex',
      justifyContain: 'space-between',
      alignItems: 'center',
      boxShadow: 'var(--shadow-card)',
      borderLeft: alert.status === 'Active' 
        ? `4px solid ${alert.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b'}` 
        : '4px solid #10b981'
    }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          background: alert.status === 'Active' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: alert.status === 'Active' ? '#f87171' : '#34d399'
        }}>
          {alert.status === 'Active' ? <AlertCircle size={22} /> : <CheckCircle size={22} />}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>{alert.attack_type}</span>
            <span className={`badge badge-risk-${alert.severity}`}>{alert.severity}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {new Date(alert.timestamp).toLocaleString()}
            </span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{alert.message}</div>
        </div>
      </div>

      <div>
        {alert.status === 'Active' ? (
          <button
            onClick={handleResolve}
            style={{
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              borderRadius: '8px',
              padding: '0.4rem 0.85rem',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            Mark Resolved
          </button>
        ) : (
          <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>Resolved</span>
        )}
      </div>
    </div>
  );
}
