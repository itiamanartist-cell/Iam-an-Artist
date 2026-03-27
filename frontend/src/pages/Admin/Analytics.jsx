import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import axios from '../../utils/axios';

const Analytics = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get('/analytics').then(r => setLogs(r.data)).catch(() => {});
  }, []);

  const logins = logs.filter(l => l.action === 'Login').length;
  const views  = logs.filter(l => l.action === 'ViewContent').length;

  return (
    <Layout>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, color: 'var(--brand-purple-dk)' }}>Visitor Analytics</h1>
        <p style={{ margin: '0.2rem 0 0', color: '#7c3aed', fontSize: '0.85rem' }}>{logs.length} total events tracked</p>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Logins', value: logins, bg: 'linear-gradient(135deg,#7c3aed,#4c1d95)' },
          { label: 'Content Views', value: views, bg: 'linear-gradient(135deg,#166534,#052e16)' },
          { label: 'Total Events', value: logs.length, bg: 'linear-gradient(135deg,#1e3a5f,#0f172a)' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ background: s.bg, color: '#fff', padding: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.15rem' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Logs table */}
      <div className="card">
        <table className="art-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>User</th>
              <th>Action</th>
              <th>Content</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log._id}>
                <td style={{ color: '#6b7280', whiteSpace: 'nowrap' }}>
                  {new Date(log.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td style={{ fontWeight: 600 }}>{log.user?.username || '—'}</td>
                <td>
                  <span className={`badge ${log.action === 'Login' ? 'badge-purple' : 'badge-blue'}`}>{log.action}</span>
                </td>
                <td style={{ color: '#6b7280' }}>{log.contentId?.title || '—'}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>No events logged yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Analytics;
