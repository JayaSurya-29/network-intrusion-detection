import React from 'react';
import { BookOpen, Shield, Code, Server, Cpu } from 'lucide-react';

export function AboutPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="table-card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>
          AI-Powered Network Intrusion Detection & Threat Monitoring System
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          UG Level-2 B.Tech CSE AIML Project based on the NSL-KDD Network Intrusion Dataset.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <Cpu size={20} color="#00f2fe" />
            <h3 style={{ fontSize: '0.95rem', margin: '0.5rem 0 0.25rem 0' }}>Machine Learning</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Random Forest Supervised Classifier & Isolation Forest Anomaly Detector.</p>
          </div>

          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <Server size={20} color="#3b82f6" />
            <h3 style={{ fontSize: '0.95rem', margin: '0.5rem 0 0.25rem 0' }}>FastAPI Backend</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>High-speed REST API with Pydantic validation & error handling.</p>
          </div>

          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <Code size={20} color="#10b981" />
            <h3 style={{ fontSize: '0.95rem', margin: '0.5rem 0 0.25rem 0' }}>React + Vite Dashboard</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Modern cybersecurity dark dashboard with Recharts visualization.</p>
          </div>
        </div>
      </div>

      <div className="table-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen size={18} color="#00f2fe" /> Quick Viva Reference Cheat-Sheet
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '8px', borderLeft: '4px solid var(--accent-cyan)' }}>
            <strong style={{ color: '#fff' }}>1. What is the difference between Classification and Anomaly Detection?</strong>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              <strong>Classification</strong> (supervised) matches traffic against known historical attack signatures (e.g. DoS, Probe). 
              <strong>Anomaly Detection</strong> (unsupervised) measures statistical deviation from normal traffic baseline (flags unusual behavior).
            </p>
          </div>

          <div style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '8px', borderLeft: '4px solid var(--accent-blue)' }}>
            <strong style={{ color: '#fff' }}>2. Does an Anomaly Flag automatically mean a Zero-Day Attack?</strong>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              No. An anomaly flag signifies <em>unusual network traffic patterns</em>. While zero-day exploits appear as anomalies, benign network bursts or misconfigurations can also trigger anomaly flags.
            </p>
          </div>

          <div style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '8px', borderLeft: '4px solid var(--accent-green)' }}>
            <strong style={{ color: '#fff' }}>3. How is Data Leakage prevented during Preprocessing?</strong>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Preprocessing components (StandardScaler, OneHotEncoder) are fitted <strong>strictly on the training dataset</strong> and saved as joblib artifacts. Test/inference samples are transformed using the fitted state without retraining.
            </p>
          </div>

          <div style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.8)', borderRadius: '8px', borderLeft: '4px solid var(--accent-amber)' }}>
            <strong style={{ color: '#fff' }}>4. Why choose Random Forest over simple Logistic Regression?</strong>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Network packet attributes exhibit non-linear interactions across high dimensions (122 features). Random Forest handles non-linear boundaries and feature interactions significantly better, achieving 81.02% weighted precision.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
