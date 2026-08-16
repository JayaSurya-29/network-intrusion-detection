import React, { useState, useEffect } from 'react';
import './App.css';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Analyzer } from './pages/Analyzer';
import { AlertsPage } from './pages/AlertsPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { apiService } from './services/api';
import { ShieldCheck, Radio, Server, Activity } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      const [statsRes, historyRes, alertsRes] = await Promise.all([
        apiService.getStatistics().catch(() => null),
        apiService.getPredictionsHistory(50).catch(() => []),
        apiService.getAlerts().catch(() => [])
      ]);
      if (statsRes) setStats(statsRes);
      setPredictions(historyRes);
      setAlerts(alertsRes);
    } catch (err) {
      console.error("Error refreshing dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const activeAlertCount = alerts.filter(a => a.status === 'Active').length;

  return (
    <div className="main-app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Top Enterprise Security Ticker */}
      <div className="top-ticker">
        <div className="ticker-item">
          <Radio size={14} color="#00f2fe" />
          <span><strong>GLOBAL SOC MONITORING:</strong> ACTIVE</span>
        </div>
        <div className="ticker-item">
          <Server size={14} color="#10b981" />
          <span><strong>API REGION:</strong> US-EAST (FASTAPI :8000)</span>
        </div>
        <div className="ticker-item">
          <Activity size={14} color="#f59e0b" />
          <span><strong>SECURITY THREAT LEVEL:</strong> ALPHA-2</span>
        </div>
      </div>

      <div className="app-container" style={{ flex: 1 }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} alertCount={activeAlertCount} />

        <div className="main-wrapper">
          <Navbar activeTab={activeTab} />

          <main className="content-area">
            {activeTab === 'dashboard' && (
              <Dashboard
                stats={stats}
                predictions={predictions}
                onAnalyzeClick={() => setActiveTab('analyzer')}
                onAnalysisComplete={refreshData}
              />
            )}

            {activeTab === 'analyzer' && (
              <Analyzer
                predictions={predictions}
                onAnalysisComplete={refreshData}
              />
            )}

            {activeTab === 'alerts' && (
              <AlertsPage
                alerts={alerts}
                onAlertResolve={refreshData}
              />
            )}

            {activeTab === 'statistics' && (
              <StatisticsPage stats={stats} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
