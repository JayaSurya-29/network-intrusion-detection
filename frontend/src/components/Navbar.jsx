import React, { useState, useEffect } from 'react';
import { Cpu, Database, Activity, Clock } from 'lucide-react';

export function Navbar({ activeTab }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const titles = {
    dashboard: 'Cybersecurity Network Threat & Intrusion Profiler',
    analyzer: 'Real-Time Threat Vector Profiler & Simulator',
    alerts: 'Security Threat Alerts & Incident Command',
    statistics: 'Model Benchmarks & Anomaly Metrics',
  };

  return (
    <header className="navbar">
      <h1 className="nav-title">{titles[activeTab] || 'Cybersecurity Threat & Intrusion Profiler'}</h1>

      <div className="system-status-pills">
        <div className="status-pill" style={{ color: 'var(--text-secondary)' }}>
          <Clock size={13} color="#00f2fe" />
          <span style={{ fontFamily: 'var(--font-mono)' }}>{time}</span>
        </div>

        <div className="status-pill">
          <Cpu size={14} color="#00f2fe" />
          <span>Random Forest</span>
        </div>

        <div className="status-pill">
          <Activity size={14} color="#3b82f6" />
          <span>Isolation Forest</span>
        </div>

        <div className="status-pill">
          <Database size={14} color="#10b981" />
          <span>SQLite</span>
        </div>

        <div className="user-profile-badge">
          <div className="user-avatar">L2</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.8rem', lineHeight: '1.2' }}>SOC Analyst L2</div>
            <div style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 500 }}>Active Clearance</div>
          </div>
        </div>
      </div>
    </header>
  );
}
