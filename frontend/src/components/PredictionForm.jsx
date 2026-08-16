import React, { useState } from 'react';
import { Play, RotateCcw, Zap, Layers, ShieldAlert, Cpu, AlertTriangle, ShieldCheck, Terminal } from 'lucide-react';
import { apiService } from '../services/api';

const PRESETS = {
  normal: {
    duration: 0, protocol_type: 'tcp', service: 'http', flag: 'SF',
    src_bytes: 215, dst_bytes: 4500, count: 1, srv_count: 1,
    serror_rate: 0.0, same_srv_rate: 1.0, dst_host_count: 5, dst_host_srv_count: 255
  },
  dos: {
    duration: 0, protocol_type: 'tcp', service: 'private', flag: 'S0',
    src_bytes: 0, dst_bytes: 0, count: 250, srv_count: 250,
    serror_rate: 1.0, srv_serror_rate: 1.0, same_srv_rate: 1.0, dst_host_count: 255
  },
  probe: {
    duration: 0, protocol_type: 'tcp', service: 'private', flag: 'REJ',
    src_bytes: 0, dst_bytes: 0, count: 150, srv_count: 1,
    rerror_rate: 1.0, diff_srv_rate: 0.95, dst_host_count: 255, dst_host_srv_count: 1
  },
  anomaly: {
    duration: 500, protocol_type: 'udp', service: 'other', flag: 'SF',
    src_bytes: 9999999, dst_bytes: 9999999, count: 490, srv_count: 2,
    serror_rate: 0.5, same_srv_rate: 0.05, dst_host_count: 255, dst_host_srv_count: 2
  }
};

export function PredictionForm({ onAnalysisComplete }) {
  const [activeTab, setActiveTab] = useState('single');
  const [formData, setFormData] = useState(PRESETS.normal);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [batchResults, setBatchResults] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['protocol_type', 'service', 'flag'].includes(name) ? value : Number(value)
    }));
  };

  const handlePresetSelect = (presetKey) => {
    setFormData(PRESETS[presetKey]);
    setResult(null);
    setError(null);
  };

  const handleSubmitSingle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.analyzeTraffic(formData);
      setResult(res);
      if (onAnalysisComplete) onAnalysisComplete();
    } catch (err) {
      setError(err.message || 'Failed to analyze traffic.');
    } finally {
      setLoading(false);
    }
  };

  const handleRunBatchSimulation = async () => {
    setLoading(true);
    setError(null);
    try {
      const batchPayload = [
        PRESETS.normal,
        PRESETS.dos,
        PRESETS.probe,
        PRESETS.anomaly
      ];
      const res = await apiService.analyzeBatchTraffic(batchPayload);
      setBatchResults(res);
      if (onAnalysisComplete) onAnalysisComplete();
    } catch (err) {
      setError(err.message || 'Failed to run batch traffic simulation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="table-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Interactive Threat & Intrusion Profiler</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Evaluates network features against Random Forest Classifier (Known Signatures) and Isolation Forest (Behavioral Anomalies).
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="status-pill"
            onClick={() => setActiveTab('single')}
            style={{
              background: activeTab === 'single' ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))' : 'rgba(255,255,255,0.04)',
              color: activeTab === 'single' ? '#000' : 'var(--text-secondary)',
              fontWeight: activeTab === 'single' ? 700 : 500,
              cursor: 'pointer'
            }}
          >
            Single Packet Inspection
          </button>
          <button
            type="button"
            className="status-pill"
            onClick={() => setActiveTab('batch')}
            style={{
              background: activeTab === 'batch' ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))' : 'rgba(255,255,255,0.04)',
              color: activeTab === 'batch' ? '#000' : 'var(--text-secondary)',
              fontWeight: activeTab === 'batch' ? 700 : 500,
              cursor: 'pointer'
            }}
          >
            Batch Flow Stream
          </button>
        </div>
      </div>

      {activeTab === 'single' ? (
        <>
          {/* Preset Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Presets:</span>
            <button type="button" className="status-pill" onClick={() => handlePresetSelect('normal')} style={{ cursor: 'pointer' }}>
              Normal Web Flow
            </button>
            <button type="button" className="status-pill" onClick={() => handlePresetSelect('dos')} style={{ cursor: 'pointer', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}>
              DoS Neptune Attack
            </button>
            <button type="button" className="status-pill" onClick={() => handlePresetSelect('probe')} style={{ cursor: 'pointer', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}>
              Portscan Recon Probe
            </button>
            <button type="button" className="status-pill" onClick={() => handlePresetSelect('anomaly')} style={{ cursor: 'pointer', borderColor: 'rgba(139, 92, 246, 0.4)', color: '#a78bfa' }}>
              Anomalous Burst Traffic
            </button>
          </div>

          <form onSubmit={handleSubmitSingle}>
            <div className="form-grid">
              <div className="form-group">
                <label>Protocol Type</label>
                <select className="form-control" name="protocol_type" value={formData.protocol_type} onChange={handleChange}>
                  <option value="tcp">tcp (Transmission Control)</option>
                  <option value="udp">udp (User Datagram)</option>
                  <option value="icmp">icmp (Control Message)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Service Target</label>
                <select className="form-control" name="service" value={formData.service} onChange={handleChange}>
                  <option value="http">http (Web Server)</option>
                  <option value="private">private (Private Port)</option>
                  <option value="smtp">smtp (Mail Transfer)</option>
                  <option value="ftp_data">ftp_data (File Transfer)</option>
                  <option value="domain_u">domain_u (DNS Resolution)</option>
                  <option value="other">other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Connection Flag</label>
                <select className="form-control" name="flag" value={formData.flag} onChange={handleChange}>
                  <option value="SF">SF (Normal Connection Completed)</option>
                  <option value="S0">S0 (SYN Connection Attempt - No ACK)</option>
                  <option value="REJ">REJ (Connection Rejected)</option>
                  <option value="RSTR">RSTR (Connection Reset by Remote)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Source Bytes (Tx)</label>
                <input type="number" className="form-control" name="src_bytes" value={formData.src_bytes} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Destination Bytes (Rx)</label>
                <input type="number" className="form-control" name="dst_bytes" value={formData.dst_bytes} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Host Connection Count</label>
                <input type="number" className="form-control" name="count" value={formData.count} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Service Connection Count</label>
                <input type="number" className="form-control" name="srv_count" value={formData.srv_count} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>SYN Error Rate (0.0 - 1.0)</label>
                <input type="number" step="0.1" className="form-control" name="serror_rate" value={formData.serror_rate} onChange={handleChange} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <Zap size={18} className="spin" /> : <Play size={18} />}
                <span>{loading ? 'Profile Vector...' : 'Profile Network Vector'}</span>
              </button>
              <button type="button" style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '0.85rem 1.25rem', borderRadius: '10px', cursor: 'pointer' }} onClick={() => handlePresetSelect('normal')}>
                <RotateCcw size={16} /> Reset Form
              </button>
            </div>
          </form>

          {result && (
            <div className="result-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className={`badge badge-risk-${result.risk_level}`} style={{ fontSize: '0.9rem', padding: '0.4rem 0.85rem' }}>
                    RISK LEVEL: {result.risk_level}
                  </span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 700, color: result.prediction === 'Normal' ? '#34d399' : '#f87171' }}>
                    Prediction: {result.prediction}
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Classifier Confidence: {(result.confidence * 100).toFixed(1)}%
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Supervised Classification Signature</div>
                  <div style={{ fontWeight: 600, marginTop: '0.25rem' }}>
                    {result.prediction === 'Normal' ? 'Normal Baseline Signature' : `Attack Category: ${result.prediction}`}
                  </div>
                </div>

                <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Behavioral Anomaly Score</div>
                  <div style={{ fontWeight: 600, marginTop: '0.25rem', color: result.anomaly ? '#f87171' : '#34d399' }}>
                    {result.anomaly ? `Anomalous Deviation (Score: ${result.anomaly_score})` : `Baseline Normal Pattern (Score: ${result.anomaly_score})`}
                  </div>
                </div>

                {result.threat_profile && (
                  <div style={{ padding: '0.85rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Automated Defense Response Action</div>
                    <div style={{ fontWeight: 700, marginTop: '0.25rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                      {result.threat_profile.recommended_action}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', padding: '0.85rem', background: 'rgba(0, 242, 254, 0.05)', borderRadius: '8px', borderLeft: '4px solid var(--accent-cyan)' }}>
                <strong>Cyber Threat Analysis:</strong> "{result.explanation}"
              </div>
            </div>
          )}
        </>
      ) : (
        <div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Simulate a batch stream of 4 distinct traffic flows (Normal, DoS, Probe, and Anomalous Burst) sent through the FastAPI endpoint.
          </p>

          <button className="btn-primary" onClick={handleRunBatchSimulation} disabled={loading} style={{ marginBottom: '1.5rem' }}>
            <Layers size={18} />
            <span>{loading ? 'Simulating Batch Flow...' : 'Run Batch Stream Profiler'}</span>
          </button>

          {batchResults && (
            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Prediction</th>
                    <th>Confidence</th>
                    <th>Anomaly</th>
                    <th>Risk Level</th>
                    <th>Defense Response Action</th>
                  </tr>
                </thead>
                <tbody>
                  {batchResults.map((item, idx) => (
                    <tr key={idx}>
                      <td>Flow #{idx + 1}</td>
                      <td>
                        <strong style={{ color: item.prediction === 'Normal' ? '#34d399' : '#f87171' }}>
                          {item.prediction}
                        </strong>
                      </td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{(item.confidence * 100).toFixed(1)}%</td>
                      <td>
                        <span className={`badge badge-anomaly-${item.anomaly}`}>
                          {item.anomaly ? 'Anomaly' : 'Baseline'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-risk-${item.risk_level}`}>{item.risk_level}</span>
                      </td>
                      <td style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                        {item.threat_profile ? item.threat_profile.recommended_action : 'ALLOW_BASELINE'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          {error}
        </div>
      )}
    </div>
  );
}
