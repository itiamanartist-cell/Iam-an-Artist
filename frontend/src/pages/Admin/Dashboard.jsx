import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import axios from '../../utils/axios';
import { Users, Video, Eye, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, content: 0, views: 0 });

  useEffect(() => {
    const load = async () => {
      try {
        const [users, content, logs] = await Promise.all([
          axios.get('/users'),
          axios.get('/content'),
          axios.get('/analytics'),
        ]);
        const todayViews = logs.data.filter(l => {
          const d = new Date(l.createdAt);
          const now = new Date();
          return l.action === 'ViewContent' && d.toDateString() === now.toDateString();
        }).length;
        setStats({ users: users.data.length, content: content.data.length, views: todayViews });
      } catch (_) {}
    };
    load();
  }, []);

  const cards = [
    { label: 'Total Students', value: stats.users, icon: <Users size={28} />, bg: 'linear-gradient(135deg,#7c3aed,#4c1d95)', accent: '#c4b5fd' },
    { label: 'Total Content', value: stats.content, icon: <Video size={28} />, bg: 'linear-gradient(135deg,#166534,#052e16)', accent: '#86efac' },
    { label: 'Views Today', value: stats.views, icon: <Eye size={28} />, bg: 'linear-gradient(135deg,#1e3a5f,#0f172a)', accent: '#93c5fd' },
  ];

  return (
    <Layout>
      {/* Page header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, color: 'var(--brand-purple-dk)', fontSize: '1.9rem' }}>Admin Dashboard</h1>
        <p style={{ margin: '0.3rem 0 0', color: '#7c3aed', fontSize: '0.9rem' }}>Welcome back — IAmanArtist Art Platform</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {cards.map(c => (
          <div key={c.label} className="stat-card" style={{ background: c.bg, color: '#fff' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '0.75rem', padding: '0.75rem', display: 'flex', alignItems: 'center' }}>
              {c.icon}
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{c.value}</div>
              <div style={{ fontSize: '0.82rem', opacity: 0.8 }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 2px 16px rgba(107,33,168,0.07)' }}>
        <h2 style={{ margin: '0 0 1rem', color: 'var(--brand-purple-dk)', fontSize: '1.1rem' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { label: '+ Add User', href: '/admin/users', color: 'var(--brand-purple)' },
            { label: '+ Upload Content', href: '/admin/content', color: 'var(--brand-green)' },
            { label: 'View Analytics', href: '/admin/analytics', color: '#1d4ed8' },
          ].map(q => (
            <a key={q.label} href={q.href} style={{
              padding: '0.6rem 1.2rem', borderRadius: '0.5rem', border: `1.5px solid ${q.color}`,
              color: q.color, textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem',
              transition: 'all 0.2s'
            }}>{q.label}</a>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
