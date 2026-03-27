import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import axios from '../../utils/axios';
import { PlayCircle } from 'lucide-react';

const Dashboard = () => {
  const [content, setContent] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [contentRes, catRes] = await Promise.all([axios.get('/content'), axios.get('/categories')]);
        setContent(contentRes.data);
        setCategories(catRes.data);
      } catch (_) {}
    };
    load();
  }, []);

  const filtered = content.filter(c => {
    const matchesCategory = filter === 'All' || c.category?.name === filter;
    const searchLower = search.toLowerCase();
    const matchesSearch = !search || 
      c.title.toLowerCase().includes(searchLower) || 
      c.description?.toLowerCase().includes(searchLower) ||
      c.tags?.some(t => t.toLowerCase().includes(searchLower));
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      {/* Hero banner for Teachers */}
      <div style={{
        background: 'linear-gradient(135deg, #3B0764 0%, #166534 100%)',
        borderRadius: '1.25rem',
        padding: '2rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', bottom: '-30px', left: '30%', width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <h1 style={{ margin: 0, color: '#fff', fontSize: '1.8rem', position: 'relative' }}>Teacher Portal</h1>
        <p style={{ margin: '0.4rem 0 0', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', position: 'relative' }}>
          {content.length} active learning modules · IAmanArtist India
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          className="form-input" 
          placeholder="Search lessons by title, description, or tags..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', maxWidth: '500px' }}
        />
      </div>

      {/* Category filter pills */}
      {categories.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {['All', ...categories.map(c => c.name)].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '999px',
                border: filter === cat ? 'none' : '1.5px solid #c4b5fd',
                background: filter === cat ? 'linear-gradient(135deg,#9333EA,#6B21A8)' : '#fff',
                color: filter === cat ? '#fff' : '#6B21A8',
                fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: filter === cat ? '0 4px 12px rgba(107,33,168,0.3)' : 'none',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {filtered.map(item => (
          <div key={item._id} className="card">
            {/* Thumbnail */}
            <div style={{ background: item.type === 'Video' ? '#0f172a' : item.type === 'Document' ? '#e0f2fe' : '#f3e8ff', position: 'relative', overflow: 'hidden', minHeight: 190, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.type === 'Image' ? (
                <img src={item.url} alt={item.title} style={{ width: '100%', objectFit: 'contain', maxHeight: 240, display: 'block' }} onContextMenu={e => e.preventDefault()} />
              ) : item.type === 'Document' ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#0369a1' }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>PDF Document</span>
                </div>
              ) : (
                <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={item.url.replace(/\.[^/.]+$/, ".jpg")} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, opacity: 0.6 }} />
                  <PlayCircle size={52} style={{ color: 'rgba(255,255,255,0.8)', position: 'relative', zIndex: 1 }} />
                </div>
              )}
              {/* Badges */}
              <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: '0.4rem', flexWrap: 'wrap', zIndex: 10 }}>
                <span className={`badge ${item.type === 'Video' ? 'badge-purple' : item.type === 'Document' ? 'badge-blue' : 'badge-green'}`} style={{ backdropFilter: 'blur(4px)' }}>
                  {item.type}
                </span>
                {item.category && (
                  <span className="badge badge-purple" style={{ backdropFilter: 'blur(4px)' }}>
                    {item.category.name}
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div style={{ padding: '1rem' }}>
              <h3 style={{ margin: '0 0 0.3rem', color: '#1e1b4b', fontSize: '1rem' }}>{item.title}</h3>
              {item.description && <p style={{ margin: '0 0 0.75rem', color: '#6b7280', fontSize: '0.82rem', lineHeight: 1.5 }}>{item.description}</p>}
              {item.tags?.length > 0 && (
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {item.tags.map(tag => <span key={tag} className="badge" style={{ background: '#f3f4f6', color: '#4b5563', fontSize: '0.7rem' }}>#{tag}</span>)}
                </div>
              )}
              <Link
                to={`/teacher/viewer/${item._id}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  background: 'linear-gradient(135deg,#9333EA,#6B21A8)',
                  color: '#fff', textDecoration: 'none', padding: '0.55rem 1.2rem',
                  borderRadius: '0.5rem', fontSize: '0.85rem', fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(107,33,168,0.25)', transition: 'opacity 0.2s'
                }}
              >
                <PlayCircle size={15} /> Review Lesson
              </Link>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
            No content available for this category.
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
