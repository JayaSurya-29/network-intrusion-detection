import React from 'react';
import { PredictionForm } from '../components/PredictionForm';
import { ThreatTable } from '../components/ThreatTable';

export function Analyzer({ predictions, onAnalysisComplete }) {
  return (
    <div>
      <PredictionForm onAnalysisComplete={onAnalysisComplete} />

      <div className="table-card">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Inspection Log History</h2>
        <ThreatTable predictions={predictions} />
      </div>
    </div>
  );
}
