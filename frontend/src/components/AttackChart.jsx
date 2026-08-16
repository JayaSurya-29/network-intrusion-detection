import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';

const COLORS = ['#059669', '#dc2626', '#d97706', '#7c3aed', '#db2777'];

export function AttackChart({ distribution }) {
  const [chartType, setChartType] = useState('pie'); // 'pie', 'bar', 'area'

  if (!distribution) return null;

  const data = Object.keys(distribution).map((key) => ({
    name: key,
    value: distribution[key],
  }));

  const totalCount = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="chart-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div className="chart-title" style={{ marginBottom: 0 }}>
          Network Threat & Category Distribution
        </div>

        {/* View Switcher Buttons */}
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            onClick={() => setChartType('pie')}
            className="status-pill"
            style={{
              background: chartType === 'pie' ? '#0284c7' : '#f1f5f9',
              color: chartType === 'pie' ? '#ffffff' : '#475569',
              fontWeight: chartType === 'pie' ? 700 : 500,
              cursor: 'pointer',
              fontSize: '0.75rem',
              padding: '0.25rem 0.65rem'
            }}
          >
            Donut
          </button>
          <button
            onClick={() => setChartType('bar')}
            className="status-pill"
            style={{
              background: chartType === 'bar' ? '#0284c7' : '#f1f5f9',
              color: chartType === 'bar' ? '#ffffff' : '#475569',
              fontWeight: chartType === 'bar' ? 700 : 500,
              cursor: 'pointer',
              fontSize: '0.75rem',
              padding: '0.25rem 0.65rem'
            }}
          >
            Bar
          </button>
          <button
            onClick={() => setChartType('area')}
            className="status-pill"
            style={{
              background: chartType === 'area' ? '#0284c7' : '#f1f5f9',
              color: chartType === 'area' ? '#ffffff' : '#475569',
              fontWeight: chartType === 'area' ? 700 : 500,
              cursor: 'pointer',
              fontSize: '0.75rem',
              padding: '0.25rem 0.65rem'
            }}
          >
            Area
          </button>
        </div>
      </div>

      <div style={{ width: '100%', height: 260, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={6}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#ffffff" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '10px', color: '#0f172a', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                formatter={(value) => [`${value} flows (${((value / (totalCount || 1)) * 100).toFixed(1)}%)`, 'Count']}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          ) : chartType === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '10px', color: '#0f172a', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '10px', color: '#0f172a', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="value" stroke="#0284c7" strokeWidth={3} fillOpacity={1} fill="url(#areaColor)" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
