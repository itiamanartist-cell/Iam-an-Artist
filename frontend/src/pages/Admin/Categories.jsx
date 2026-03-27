import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import axios from '../../utils/axios';
import { Plus, Trash2, Tag } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/categories');
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    setLoading(true);
    try {
      await axios.post('/categories', { name: newCategory.trim() });
      setNewCategory('');
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Content associated with it might lose sorting ability until re-assigned.')) return;
    try {
      await axios.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert('Failed to delete category');
    }
  };

  return (
    <Layout>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, color: 'var(--brand-purple-dk)' }}>Categories</h1>
        <p style={{ margin: '0.2rem 0 0', color: '#7c3aed', fontSize: '0.85rem' }}>
          Manage content categories (Age groups, topics, etc.)
        </p>
      </div>

      <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '2rem', maxWidth: '500px' }}>
        <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', color: '#1e1b4b' }}>Add New Category</h3>
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            className="form-input"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="e.g. Kids 5 to 9"
            required
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}>
            <Plus size={16} /> Add
          </button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {categories.map((c) => (
          <div key={c._id} style={{
            background: '#fff', borderRadius: '0.75rem', padding: '1rem 1.25rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)', border: '1px solid #f3e8ff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ background: '#f5f3ff', padding: '0.5rem', borderRadius: '0.5rem', color: '#7c3aed' }}>
                <Tag size={16} />
              </div>
              <span style={{ fontWeight: 600, color: '#3B0764' }}>{c.name}</span>
            </div>
            <button
              onClick={() => handleDelete(c._id)}
              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', outline: 'none', padding: '0.2rem' }}
              title="Delete Category"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <div style={{ color: '#9ca3af', gridColumn: '1/-1' }}>No categories created yet.</div>
        )}
      </div>
    </Layout>
  );
};

export default Categories;
