const API_BASE_URL = 'http://127.0.0.1:8000';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP Error ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const apiService = {
  // System Health
  getHealth: () => request('/health'),

  // Dashboard Statistics
  getStatistics: () => request('/statistics'),

  // Traffic Analysis (Prediction)
  analyzeTraffic: (payload) =>
    request('/predict', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Batch Traffic Analysis
  analyzeBatchTraffic: (payloads) =>
    request('/predict/batch', {
      method: 'POST',
      body: JSON.stringify(payloads),
    }),

  // Inspection Logs History
  getPredictionsHistory: (limit = 50) =>
    request(`/predict/history?limit=${limit}`),

  // Clear Logs
  clearHistory: () =>
    request('/predict/history', {
      method: 'DELETE',
    }),

  // Security Alerts
  getAlerts: (statusFilter = '') => {
    const query = statusFilter ? `?status_filter=${statusFilter}` : '';
    return request(`/alerts${query}`);
  },

  // Resolve Alert
  resolveAlert: (alertId) =>
    request(`/alerts/${alertId}/resolve`, {
      method: 'PATCH',
    }),
};
