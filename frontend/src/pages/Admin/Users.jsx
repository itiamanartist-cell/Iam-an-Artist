import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import axios from '../../utils/axios';
import { UserPlus, Trash2 } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', role: 'Student' });

  const fetchUsers = async () => {
    try { const { data } = await axios.get('/users'); setUsers(data); } catch (_) {}
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try { await axios.delete(`/users/${id}`); fetchUsers(); } catch (_) {}
  };

  const handleResetPassword = async (id, currentUsername) => {
    const newPassword = window.prompt(`Enter new password for user ${currentUsername}:`);
    if (!newPassword) return;

    try {
      await axios.put(`/users/${id}`, { password: newPassword });
      alert('Password reset successful!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error resetting password');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/users', formData);
      setShowModal(false);
      setFormData({ username: '', password: '', role: 'Student' });
      fetchUsers();
    } catch (err) { alert(err.response?.data?.message || 'Error creating user'); }
  };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, color: 'var(--brand-purple-dk)' }}>User Management</h1>
          <p style={{ margin: '0.2rem 0 0', color: '#7c3aed', fontSize: '0.85rem' }}>{users.length} registered student{users.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserPlus size={16} /> Add User
        </button>
      </div>

      <div className="card">
        <div style={{ overflowX: 'auto' }}>
          <table className="art-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 600, color: '#1e1b4b' }}>{u.username}</td>
                  <td>
                    <span className={`badge ${u.role === 'Admin' ? 'badge-purple' : u.role === 'Teacher' ? 'badge-blue' : 'badge-green'}`}>{u.role}</span>
                  </td>
                  <td style={{ color: '#6b7280' }}>{new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button className="btn-primary" onClick={() => handleResetPassword(u._id, u.username)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.6rem', fontSize: '0.75rem', background: 'var(--brand-pink)' }}>
                        Reset Password
                      </button>
                      <button className="btn-danger" onClick={() => handleDelete(u._id)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>No users yet. Add one above!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2 style={{ margin: '0 0 1.5rem', color: 'var(--brand-purple-dk)', fontFamily: "'Playfair Display', serif" }}>Create New User</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#3B0764', marginBottom: '0.35rem' }}>Username</label>
                <input required type="text" className="form-input" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} placeholder="student_name" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#3B0764', marginBottom: '0.35rem' }}>Password</label>
                <input required type="password" className="form-input" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#3B0764', marginBottom: '0.35rem' }}>Role</label>
                <select className="form-input" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '0.6rem 1.2rem', border: '1.5px solid #e9d5ff', borderRadius: '0.5rem', background: 'none', cursor: 'pointer', color: '#6b7280' }}>Cancel</button>
                <button type="submit" className="btn-primary">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Users;
