import React, { useState } from 'react';
import { AlertCard } from '../components/AlertCard';
import { Download, Zap } from 'lucide-react';

export function AlertsPage({ alerts, onAlertResolve }) {
  const [filter, setFilter] = useState('All');

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'Active') return alert.status === 'Active';
    if (filter === 'Resolved') return alert.status === 'Resolved';
    if (filter === 'Zero-Day') return alert.attack_type.toLowerCase().includes('zero-day');
    return true;
  });

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(alerts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `security_incident_report_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div>
      <div className="table-card" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Real-Time Security Threat Alerts</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Incidents logged from ML Intrusion Classifier signatures or Isolation Forest zero-day anomaly flags.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {['All', 'Active', 'Zero-Day', 'Resolved'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className="status-pill"
              style={{
                background: filter === tab ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))' : 'rgba(255,255,255,0.04)',
                color: filter === tab ? '#000' : 'var(--text-secondary)',
                fontWeight: filter === tab ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              {tab === 'Zero-Day' ? '⚡ Zero-Day Alerts' : `${tab} Alerts`}
            </button>
          ))}

          <button
            onClick={handleExportJSON}
            className="status-pill"
            style={{ borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      {filteredAlerts.length === 0 ? (
        <div className="table-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No {filter.toLowerCase()} security alerts recorded.
        </div>
      ) : (
        filteredAlerts.map((alert) => (
          <AlertCard key={alert.id} alert={alert} onResolve={onAlertResolve} />
        ))
      )}
    </div>
  );
}
