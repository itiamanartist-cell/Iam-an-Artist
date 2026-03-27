import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import axios from '../../utils/axios';
import { Upload, Trash2, Film, ImageIcon } from 'lucide-react';

const Content = () => {
  const [contentList, setContentList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', type: 'Video', categoryName: '', tags: '' });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewContent, setPreviewContent] = useState(null);

  const getToken = () => { try { return JSON.parse(localStorage.getItem('auth-storage'))?.state?.token || ''; } catch(_) { return ''; } };
  const getStreamUrl = (id) => `https://iam-an-artist-backend.onrender.com/api/content/${id}/stream?token=${getToken()}`;

  const fetchData = async () => {
    try {
      const [contentRes, catRes] = await Promise.all([axios.get('/content'), axios.get('/categories')]);
      setContentList(contentRes.data);
      setCategories(catRes.data);
    } catch (_) {}
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this content?')) return;
    try { await axios.delete(`/content/${id}`); fetchData(); } catch (_) {}
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');
    setUploading(true);
    try {
      let categoryId = null;
      if (formData.categoryName) {
        let cat = categories.find(c => c.name.toLowerCase() === formData.categoryName.toLowerCase());
        if (!cat) { const r = await axios.post('/categories', { name: formData.categoryName }); cat = r.data; }
        categoryId = cat._id;
      }
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('type', formData.type);
      payload.append('file', file);
      if (formData.tags) payload.append('tags', formData.tags);
      if (categoryId) payload.append('category', categoryId);
      await axios.post('/content', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      setShowModal(false);
      setFormData({ title: '', description: '', type: 'Video', categoryName: '', tags: '' });
      setFile(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally { setUploading(false); }
  };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, color: 'var(--brand-purple-dk)' }}>Content Library</h1>
          <p style={{ margin: '0.2rem 0 0', color: '#7c3aed', fontSize: '0.85rem' }}>{contentList.length} item{contentList.length !== 1 ? 's' : ''} uploaded</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Upload size={16} /> Upload Content
        </button>
      </div>

      {/* Content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {contentList.map(c => (
          <div key={c._id} className="card">
            {/* Thumbnail */}
            <div style={{ background: c.type === 'Video' ? '#0f172a' : c.type === 'Document' ? '#e0f2fe' : '#f3e8ff', height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              {c.type === 'Image' ? (
                <img src={c.url} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onContextMenu={e => e.preventDefault()} />
              ) : c.type === 'Document' ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: '#0369a1' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>PDF Document</span>
                </div>
              ) : (
                <img src={c.url.replace(/\.[^/.]+$/, ".jpg")} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onContextMenu={e => e.preventDefault()} />
              )}
              <span style={{ position: 'absolute', top: 8, right: 8 }} className={`badge ${c.type === 'Video' ? 'badge-purple' : c.type === 'Document' ? 'badge-blue' : 'badge-green'}`}>
                {c.type}
              </span>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#1e1b4b', margin: '0 0 0.25rem' }}>{c.title}</div>
              <div style={{ color: '#6b7280', fontSize: '0.8rem', margin: '0 0 0.75rem', minHeight: '1.2rem' }}>{c.description}</div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span className="badge badge-purple">{c.category?.name || 'Uncategorized'}</span>
                {c.tags && c.tags.map(tag => (
                  <span key={tag} className="badge" style={{ background: '#f3f4f6', color: '#4b5563' }}>#{tag}</span>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.5rem' }}>
                <button className="btn-primary" onClick={() => setPreviewContent(c)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.75rem', fontSize: '0.8rem', background: 'var(--brand-blue)' }}>
                  <Film size={13} /> Preview
                </button>
                <button className="btn-danger" onClick={() => handleDelete(c._id)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {contentList.length === 0 && (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
            <Upload size={48} style={{ opacity: 0.3, margin: '0 auto 1rem' }} />
            <p>No content yet. Upload your first video or image!</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ margin: '0 0 1.5rem', color: 'var(--brand-purple-dk)', fontFamily: "'Playfair Display', serif" }}>Upload Content</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#3B0764', marginBottom: '0.35rem' }}>Title *</label>
                <input required type="text" className="form-input" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Lesson title" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#3B0764', marginBottom: '0.35rem' }}>Description</label>
                <textarea className="form-input" style={{ resize: 'vertical', minHeight: 70 }} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Optional description" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#3B0764', marginBottom: '0.35rem' }}>Type</label>
                  <select className="form-input" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                    <option value="Video">Video</option>
                    <option value="Image">Image</option>
                    <option value="Document">PDF Document</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#3B0764', marginBottom: '0.35rem' }}>Category</label>
                  <input type="text" className="form-input" value={formData.categoryName} onChange={e => setFormData({ ...formData, categoryName: e.target.value })} placeholder="e.g. Kids, Teens" />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#3B0764', marginBottom: '0.35rem' }}>Tags (comma-separated)</label>
                <input type="text" className="form-input" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} placeholder="e.g. sketch, portrait, beginner" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#3B0764', marginBottom: '0.35rem' }}>Media File *</label>
                <div style={{ border: '2px dashed #c4b5fd', borderRadius: '0.75rem', padding: '1.25rem', textAlign: 'center', background: '#faf5ff', cursor: 'pointer' }}>
                  <input
                    required type="file"
                    accept={formData.type === 'Video' ? 'video/*' : formData.type === 'Document' ? 'application/pdf' : 'image/*'}
                    onChange={e => setFile(e.target.files[0])}
                    style={{ width: '100%' }}
                  />
                  {file && <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--brand-purple)' }}>✓ {file.name}</div>}
                </div>
              </div>
              {uploading && (
                <div style={{ background: '#f3e8ff', borderRadius: '0.5rem', padding: '0.75rem', color: 'var(--brand-purple)', fontSize: '0.85rem', textAlign: 'center' }}>
                  ⏳ Uploading to Cloudinary, please wait…
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} disabled={uploading} style={{ padding: '0.6rem 1.2rem', border: '1.5px solid #e9d5ff', borderRadius: '0.5rem', background: 'none', cursor: 'pointer', color: '#6b7280' }}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={uploading}>{uploading ? 'Uploading…' : 'Upload'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewContent && (
        <div className="modal-overlay" onClick={() => setPreviewContent(null)}>
          <div className="modal-box" style={{ maxWidth: '800px', padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: 'var(--brand-purple-dk)' }}>{previewContent.title}</h3>
              <button onClick={() => setPreviewContent(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
            </div>
            <div style={{ background: '#000', display: 'flex', justifyContent: 'center', width: '100%' }}>
              {previewContent.type === 'Video' ? (
                <video src={previewContent.url} controls autoPlay style={{ width: '100%', maxHeight: '70vh' }} />
              ) : previewContent.type === 'Document' ? (
                <iframe src={getStreamUrl(previewContent._id)} title={previewContent.title} style={{ width: '100%', height: '70vh', border: 'none', background: '#fff' }} />
              ) : (
                <img src={previewContent.url} alt={previewContent.title} style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Content;
