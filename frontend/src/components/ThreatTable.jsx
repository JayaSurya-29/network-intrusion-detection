import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Trash2, Search, Download, Zap } from 'lucide-react';
import { apiService } from '../services/api';

const IP_MAP = {
  Normal: { src: '192.168.1.104', dst: '10.0.0.1 (Web Core)', port: '80/HTTP' },
  DoS: { src: '185.220.101.5', dst: '10.0.0.15 (SQL Cluster)', port: '443/HTTPS' },
  Probe: { src: '45.142.214.8', dst: '10.0.0.50 (DMZ Router)', port: '22/SSH' },
  R2L: { src: '198.51.100.14', dst: '10.0.0.22 (FTP Server)', port: '21/FTP' },
  U2R: { src: '172.16.4.99', dst: '10.0.0.2 (Root Domain)', port: '3306/MySQL' },
};

export function ThreatTable({ predictions, onClear }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleClearLogs = async () => {
    if (window.confirm("Are you sure you want to clear all inspection history logs from SQLite?")) {
      try {
        await apiService.clearHistory();
        if (onClear) onClear();
      } catch (err) {
        console.error("Failed to clear history:", err);
      }
    }
  };

  const handleExportCSV = () => {
    if (!predictions || predictions.length === 0) return;
    
    const headers = ["ID", "Timestamp", "Prediction", "Confidence", "Anomaly", "ZeroDayFlag", "RiskLevel", "SourceIP", "DestinationIP", "Protocol", "Service", "Explanation"];
    const rows = predictions.map(p => {
      const ip = IP_MAP[p.prediction] || IP_MAP['Normal'];
      const isZeroDay = p.prediction === 'Normal' && p.anomaly;
      return [
        p.id,
        new Date(p.timestamp).toISOString(),
        p.prediction,
        (p.confidence * 100).toFixed(1) + "%",
        p.anomaly ? "True" : "False",
        isZeroDay ? "SUSPECTED_ZERO_DAY" : "STANDARD",
        p.risk_level,
        ip.src,
        ip.dst,
        p.protocol_type,
        p.service,
        `"${p.explanation ? p.explanation.replace(/"/g, '""') : ''}"`
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `threat_incident_telemetry_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const filteredPredictions = (predictions || []).filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const isZeroDay = item.prediction === 'Normal' && item.anomaly;
    return (
      item.prediction.toLowerCase().includes(term) ||
      item.risk_level.toLowerCase().includes(term) ||
      (isZeroDay && "zero-day".includes(term)) ||
      (item.protocol_type && item.protocol_type.toLowerCase().includes(term)) ||
      (item.service && item.service.toLowerCase().includes(term)) ||
      (item.explanation && item.explanation.toLowerCase().includes(term))
    );
  });

  if (!predictions || predictions.length === 0) {
    return (
      <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No threat telemetry recorded in SQLite. Trigger simulated network traffic to populate SOC logs!
      </div>
    );
  }

  return (
    <div>
      {/* Search & Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ position: 'relative', minWidth: '260px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search IP, threat, zero-day, risk level..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '32px', fontSize: '0.82rem', height: '36px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleExportCSV}
            className="status-pill"
            style={{ borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}
          >
            <Download size={13} /> Export Telemetry CSV
          </button>
          <button
            onClick={handleClearLogs}
            style={{
              background: 'transparent',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              borderRadius: '8px',
              padding: '0.35rem 0.75rem',
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <Trash2 size={13} /> Clear Logs
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Incident ID</th>
              <th>Time</th>
              <th>Source IP</th>
              <th>Target Destination</th>
              <th>Prediction</th>
              <th>Confidence</th>
              <th>Anomaly Status</th>
              <th>Risk Level</th>
              <th>Threat Explanation</th>
            </tr>
          </thead>
          <tbody>
            {filteredPredictions.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>
                  No incident logs matching "{searchTerm}"
                </td>
              </tr>
            ) : (
              filteredPredictions.map((item) => {
                const ip = IP_MAP[item.prediction] || IP_MAP['Normal'];
                const isZeroDay = item.prediction === 'Normal' && item.anomaly;

                return (
                  <tr key={item.id} style={{ background: isZeroDay ? 'rgba(245, 158, 11, 0.04)' : 'transparent' }}>
                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>#INC-{item.id}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : 'Just now'}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: item.prediction === 'Normal' ? '#94a3b8' : '#f87171' }}>
                      {ip.src}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#94a3b8' }}>
                      {ip.dst}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: item.prediction === 'Normal' ? (isZeroDay ? '#fbbf24' : '#34d399') : '#f87171' }}>
                        {item.prediction}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      {(item.confidence * 100).toFixed(1)}%
                    </td>
                    <td>
                      {isZeroDay ? (
                        <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                          <Zap size={12} style={{ marginRight: 4 }} /> Zero-Day Flag
                        </span>
                      ) : (
                        <span className={`badge badge-anomaly-${item.anomaly}`}>
                          {item.anomaly ? (
                            <>
                              <AlertTriangle size={12} style={{ marginRight: 4 }} /> Anomaly
                            </>
                          ) : (
                            <>
                              <ShieldCheck size={12} style={{ marginRight: 4 }} /> Baseline
                            </>
                          )}
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-risk-${item.risk_level}`}>
                        {item.risk_level}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '280px' }}>
                      {item.explanation}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
