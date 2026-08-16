import React, { useState } from 'react';
import { Activity, ShieldAlert, AlertTriangle, ShieldCheck, Zap, Shield, ArrowRight } from 'lucide-react';
import { StatisticCard } from '../components/StatisticCard';
import { ThreatTable } from '../components/ThreatTable';
import { AttackChart } from '../components/AttackChart';
import { apiService } from '../services/api';

export function Dashboard({ stats, predictions, onAnalyzeClick, onAnalysisComplete }) {
  const [testLoading, setTestLoading] = useState(false);
  const [quickResult, setQuickResult] = useState(null);

  if (!stats) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading Cyber Sentinel Analytics...</div>;

  const handleQuickTrigger = async (type) => {
    setTestLoading(true);
    let sample = {};

    if (type === 'dos') {
      sample = {
        duration: 0, protocol_type: 'tcp', service: 'private', flag: 'S0',
        src_bytes: 0, dst_bytes: 0, count: 300, srv_count: 300,
        serror_rate: 1.0, srv_serror_rate: 1.0, same_srv_rate: 1.0, dst_host_count: 255
      };
    } else if (type === 'probe') {
      sample = {
        duration: 0, protocol_type: 'tcp', service: 'private', flag: 'REJ',
        src_bytes: 0, dst_bytes: 0, count: 180, srv_count: 1,
        rerror_rate: 1.0, diff_srv_rate: 0.98, dst_host_count: 255, dst_host_srv_count: 1
      };
    } else {
      sample = {
        duration: 0, protocol_type: 'tcp', service: 'http', flag: 'SF',
        src_bytes: 220, dst_bytes: 5120, count: 1, srv_count: 1, same_srv_rate: 1.0
      };
    }

    try {
      const res = await apiService.analyzeTraffic(sample);
      setQuickResult(res);
      if (onAnalysisComplete) onAnalysisComplete();
    } catch (err) {
      console.error("Quick trigger failed:", err);
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div>
      {/* Risk Banner */}
      <div style={{
        background: '#e0f2fe',
        border: '1px solid #7dd3fc',
        borderRadius: '14px',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#0284c7', display: 'flex', alignItems: 'center', justify: 'center', color: '#ffffff' }}>
            <Shield size={24} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0c4a6e' }}>
              System Protection Status: <span style={{ color: stats.anomalies_detected > 0 ? '#d97706' : '#059669' }}>{stats.anomalies_detected > 0 ? 'Threat Alerts Active' : 'Optimal Safeguard Active'}</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#0369a1' }}>
              Dual Defense Engine Active: Random Forest Classifier (96% DoS Precision) + Isolation Forest Anomaly Detector.
            </div>
          </div>
        </div>

        <button className="btn-primary" onClick={onAnalyzeClick}>
          <span>Traffic Inspector</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid-stats">
        <StatisticCard label="Total Monitored Traffic" value={stats.total_traffic} icon={Activity} color="#0284c7" />
        <StatisticCard label="Normal Traffic Baseline" value={stats.normal_traffic} icon={ShieldCheck} color="#059669" />
        <StatisticCard label="Known Signature Attacks" value={stats.attacks_detected} icon={ShieldAlert} color="#dc2626" />
        <StatisticCard label="Behavioral Anomalies" value={stats.anomalies_detected} icon={AlertTriangle} color="#d97706" />
      </div>

      {/* Quick Test Simulation Bar */}
      <div className="table-card" style={{ marginBottom: '1.75rem', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>
            <Zap size={18} color="#0284c7" /> Quick Attack Simulator:
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleQuickTrigger('normal')}
              disabled={testLoading}
              className="status-pill"
              style={{ cursor: 'pointer', borderColor: '#a7f3d0', background: '#ecfdf5', color: '#047857', fontWeight: 600 }}
            >
              Simulate Normal Traffic
            </button>
            <button
              onClick={() => handleQuickTrigger('dos')}
              disabled={testLoading}
              className="status-pill"
              style={{ cursor: 'pointer', borderColor: '#fca5a5', background: '#fef2f2', color: '#b91c1c', fontWeight: 600 }}
            >
              Simulate DoS Neptune Attack
            </button>
            <button
              onClick={() => handleQuickTrigger('probe')}
              disabled={testLoading}
              className="status-pill"
              style={{ cursor: 'pointer', borderColor: '#fde68a', background: '#fffbeb', color: '#b45309', fontWeight: 600 }}
            >
              Simulate Portscan Probe
            </button>
          </div>
        </div>

        {quickResult && (
          <div style={{ marginTop: '1rem', padding: '0.85rem', background: '#e0f2fe', borderRadius: '8px', borderLeft: '4px solid #0284c7', fontSize: '0.85rem', color: '#0369a1' }}>
            <strong>Simulation Output:</strong> Classified as <strong>{quickResult.prediction}</strong> (Confidence: {(quickResult.confidence * 100).toFixed(1)}%) | Anomaly: <strong>{quickResult.anomaly ? 'YES' : 'NO'}</strong> | Risk: <span className={`badge badge-risk-${quickResult.risk_level}`}>{quickResult.risk_level}</span>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="charts-grid">
        <AttackChart distribution={stats.attack_distribution} />

        <div className="chart-card">
          <div className="chart-title">System & AI Model Diagnostics</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Supervised Model</span>
              <span style={{ fontWeight: 600, color: '#0284c7' }}>Random Forest (100 Trees)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Anomaly Model</span>
              <span style={{ fontWeight: 600, color: '#2563eb' }}>Isolation Forest (Contam 0.05)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Dataset Benchmark</span>
              <span style={{ fontWeight: 600, color: '#059669' }}>NSL-KDD (125,973 samples)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Database Persistence</span>
              <span style={{ fontWeight: 600, color: '#047857' }}>SQLite network_ids.db</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Threat Logs */}
      <div className="table-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Live Threat Monitoring Logs</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Auto-updating via SQLite</span>
        </div>
        <ThreatTable predictions={predictions} onClear={onAnalysisComplete} />
      </div>
    </div>
  );
}
