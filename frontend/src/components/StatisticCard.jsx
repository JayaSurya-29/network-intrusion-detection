import React from 'react';

export function StatisticCard({ label, value, icon: Icon, color = '#00f2fe' }) {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
      <div className="stat-icon-wrapper" style={{ color: color }}>
        <Icon size={24} />
      </div>
    </div>
  );
}
