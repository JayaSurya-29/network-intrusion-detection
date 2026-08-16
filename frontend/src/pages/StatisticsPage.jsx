import React from 'react';
import { AttackChart } from '../components/AttackChart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BookOpen, Table } from 'lucide-react';

export function StatisticsPage({ stats }) {
  if (!stats) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading Analytics Data...</div>;

  const barData = Object.keys(stats.attack_distribution || {}).map((cat) => ({
    category: cat,
    count: stats.attack_distribution[cat],
  }));

  // Confusion matrix breakdown
  const confusionData = [
    { actual: 'DoS', DoS: 5742, Normal: 1716, Probe: 0, R2L: 0, U2R: 0 },
    { actual: 'Normal', DoS: 291, Normal: 9420, Probe: 0, R2L: 0, U2R: 0 },
    { actual: 'Probe', DoS: 0, Normal: 895, Probe: 1526, R2L: 0, U2R: 0 },
    { actual: 'R2L', DoS: 0, Normal: 2478, Probe: 0, R2L: 276, U2R: 0 },
    { actual: 'U2R', DoS: 0, Normal: 192, Probe: 0, R2L: 0, U2R: 8 }
  ];

  return (
    <div>
      {/* Charts Grid */}
      <div className="charts-grid">
        <AttackChart distribution={stats.attack_distribution} />

        <div className="chart-card">
          <div className="chart-title">Attack Category Frequency Distribution</div>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="category" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '10px', color: '#0f172a', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill="#0284c7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Model Benchmark Table */}
      <div className="table-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a' }}>Empirical Model Evaluation Benchmarks</h2>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Model Name</th>
              <th>Accuracy</th>
              <th>Weighted Precision</th>
              <th>Weighted Recall</th>
              <th>Weighted F1-Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Random Forest Classifier</strong></td>
              <td>75.20%</td>
              <td>81.02%</td>
              <td>75.20%</td>
              <td>71.82%</td>
              <td><span className="badge badge-risk-LOW">ACTIVE</span></td>
            </tr>
            <tr>
              <td>Logistic Regression (SGD)</td>
              <td>74.19%</td>
              <td>78.71%</td>
              <td>74.19%</td>
              <td>70.79%</td>
              <td><span style={{ color: 'var(--text-muted)' }}>Evaluated</span></td>
            </tr>
            <tr>
              <td>Decision Tree</td>
              <td>74.80%</td>
              <td>72.68%</td>
              <td>74.80%</td>
              <td>70.40%</td>
              <td><span style={{ color: 'var(--text-muted)' }}>Evaluated</span></td>
            </tr>
            <tr>
              <td><strong>Isolation Forest Anomaly Detector</strong></td>
              <td>97.03% (Probe Detection)</td>
              <td>81.26% (DoS Detection)</td>
              <td>66.50% (U2R Detection)</td>
              <td>6.62% (Baseline FP)</td>
              <td><span className="badge badge-risk-LOW">ACTIVE</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Confusion Matrix Interactive Table */}
      <div className="table-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Table size={18} color="#0284c7" /> Test Set Confusion Matrix Breakdown ($N=22,544$)
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Shows exact true positive classification counts versus false positive predictions across NSL-KDD test dataset.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Actual \ Predicted</th>
                <th>DoS</th>
                <th>Normal</th>
                <th>Probe</th>
                <th>R2L</th>
                <th>U2R</th>
              </tr>
            </thead>
            <tbody>
              {confusionData.map((row, idx) => (
                <tr key={idx}>
                  <td><strong>Actual {row.actual}</strong></td>
                  <td style={{ background: row.actual === 'DoS' ? '#fee2e2' : 'transparent', fontWeight: row.actual === 'DoS' ? 700 : 400, color: row.actual === 'DoS' ? '#991b1b' : 'inherit' }}>{row.DoS}</td>
                  <td style={{ background: row.actual === 'Normal' ? '#d1fae5' : 'transparent', fontWeight: row.actual === 'Normal' ? 700 : 400, color: row.actual === 'Normal' ? '#065f46' : 'inherit' }}>{row.Normal}</td>
                  <td style={{ background: row.actual === 'Probe' ? '#fef3c7' : 'transparent', fontWeight: row.actual === 'Probe' ? 700 : 400, color: row.actual === 'Probe' ? '#92400e' : 'inherit' }}>{row.Probe}</td>
                  <td style={{ background: row.actual === 'R2L' ? '#f3e8ff' : 'transparent', fontWeight: row.actual === 'R2L' ? 700 : 400, color: row.actual === 'R2L' ? '#6b21a8' : 'inherit' }}>{row.R2L}</td>
                  <td style={{ background: row.actual === 'U2R' ? '#fce7f3' : 'transparent', fontWeight: row.actual === 'U2R' ? 700 : 400, color: row.actual === 'U2R' ? '#9d174d' : 'inherit' }}>{row.U2R}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Embedded Viva Knowledge Base Cards */}
      <div className="table-card">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={18} color="#0284c7" /> Core Technical & Viva Defense Concepts
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid #0284c7', border: '1px solid #e2e8f0', borderLeftWidth: '4px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a', marginBottom: '0.35rem' }}>
              Classification vs Anomaly Detection
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <strong>Supervised Classification</strong> matches traffic against known attack signatures. 
              <strong>Isolation Forest Anomaly Detection</strong> isolates unusual network traffic deviating from normal baseline without needing attack labels.
            </p>
          </div>

          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid #d97706', border: '1px solid #e2e8f0', borderLeftWidth: '4px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a', marginBottom: '0.35rem' }}>
              Zero-Day Attack Interpretation
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              An anomaly flag signifies <em>unusual network activity</em>. It does NOT automatically prove a zero-day attack, as benign network bursts or misconfigurations can also trigger anomaly flags.
            </p>
          </div>

          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid #059669', border: '1px solid #e2e8f0', borderLeftWidth: '4px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a', marginBottom: '0.35rem' }}>
              Zero Data Leakage Pipeline
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Preprocessing components (StandardScaler, OneHotEncoder) are fitted <strong>strictly on training data</strong> and saved as joblib artifacts. Real-time inference applies pre-fitted states.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
