import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import axios from '../../utils/axios';
import SecurePlayer from '../../components/SecurePlayer';
import { ArrowLeft, Tag, Calendar } from 'lucide-react';

const Viewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(`/content/${id}`);
        setContent(data);
      } catch (_) {}
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center', color: 'var(--brand-purple)' }}>
          <div style={{ width: 48, height: 48, border: '4px solid #e9d5ff', borderTopColor: 'var(--brand-purple)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          Loading content…
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Layout>
  );

  if (!content) return (
    <Layout>
      <div style={{ textAlign: 'center', padding: '3rem', color: '#dc2626' }}>Content not found or access denied.</div>
    </Layout>
  );

  return (
    <Layout>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Back button */}
        <button onClick={() => navigate('/teacher')} style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          background: 'none', border: '1.5px solid #c4b5fd', borderRadius: '0.5rem',
          color: 'var(--brand-purple)', cursor: 'pointer', padding: '0.4rem 1rem',
          fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem',
          transition: 'all 0.2s'
        }}>
          <ArrowLeft size={15} /> Back to Teacher Portal
        </button>

        {/* Title area */}
        <div style={{ marginBottom: '1.25rem' }}>
          <h1 style={{ margin: 0, color: '#1e1b4b', fontSize: '1.8rem' }}>{content.title}</h1>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {content.category && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }} className="badge badge-purple">
                <Tag size={11} /> {content.category.name}
              </span>
            )}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#6b7280', fontSize: '0.8rem' }}>
              <Calendar size={12} /> {new Date(content.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Player */}
        <div style={{
          background: '#fff', borderRadius: '1.25rem',
          overflow: 'hidden', boxShadow: '0 8px 30px rgba(107,33,168,0.12)'
        }}>
          <SecurePlayer url={content.url} type={content.type} />
        </div>

        {/* Description */}
        {content.description && (
          <div style={{
            marginTop: '1.25rem', background: '#fff', borderRadius: '1rem', padding: '1.25rem',
            boxShadow: '0 2px 12px rgba(107,33,168,0.07)'
          }}>
            <h3 style={{ margin: '0 0 0.5rem', color: 'var(--brand-purple-dk)', fontSize: '0.95rem' }}>About this lesson</h3>
            <p style={{ margin: 0, color: '#4b5563', lineHeight: 1.7, fontSize: '0.9rem' }}>{content.description}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Viewer;
