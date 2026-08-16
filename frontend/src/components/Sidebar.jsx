import React from 'react';
import { ShieldAlert, LayoutDashboard, Search, Bell, BarChart3 } from 'lucide-react';

export function Sidebar({ activeTab, setActiveTab, alertCount }) {
  const operationsNav = [
    { id: 'dashboard', label: 'SOC Dashboard', icon: LayoutDashboard },
    { id: 'analyzer', label: 'Threat & Intrusion Profiler', icon: Search },
    { id: 'alerts', label: 'Incident Alerts', icon: Bell, badge: alertCount },
  ];

  const analyticsNav = [
    { id: 'statistics', label: 'Model Benchmarks', icon: BarChart3 },
  ];

  return (
    <aside className="sidebar">
      <div className="brand-header">
        <div className="brand-icon">
          <ShieldAlert size={24} />
        </div>
        <div>
          <div className="brand-title" style={{ fontSize: '0.95rem' }}>THREAT PROFILER</div>
          <div className="brand-subtitle">NSL-KDD AI NIDS v2.4</div>
        </div>
      </div>

      <div className="nav-section-title">Operations Center</div>
      <ul className="nav-list">
        {operationsNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <li key={item.id} className={`nav-item ${isActive ? 'active' : ''}`}>
              <button onClick={() => setActiveTab(item.id)}>
                <Icon size={18} />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className="badge badge-risk-CRITICAL" style={{ marginLeft: 'auto', padding: '0.15rem 0.4rem', fontSize: '0.7rem' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div className="nav-section-title">Security Intelligence</div>
      <ul className="nav-list">
        {analyticsNav.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <li key={item.id} className={`nav-item ${isActive ? 'active' : ''}`}>
              <button onClick={() => setActiveTab(item.id)}>
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="sidebar-footer">
        <div><strong>Engine:</strong> Random Forest + IsoForest</div>
        <div><strong>Dataset:</strong> NSL-KDD (125k)</div>
        <div style={{ color: 'var(--accent-cyan)', marginTop: '0.25rem' }}>Status: Optimal Defense</div>
      </div>
    </aside>
  );
}
