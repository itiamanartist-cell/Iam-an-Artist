import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { LogOut, Home, Users, Video, BarChart2, Menu, X, Image } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminNav = [
    { name: 'Dashboard',  path: '/admin',           icon: <Home size={18} /> },
    { name: 'Users',      path: '/admin/users',      icon: <Users size={18} /> },
    { name: 'Content',    path: '/admin/content',    icon: <Video size={18} /> },
    { name: 'Categories', path: '/admin/categories', icon: <Menu size={18} /> },
    { name: 'Analytics',  path: '/admin/analytics',  icon: <BarChart2 size={18} /> },
  ];

  const teacherNav = [
    { name: 'Dashboard',  path: '/teacher',          icon: <Home size={18} /> },
  ];

  const studentNav = [
    { name: 'Gallery',    path: '/student',          icon: <Image size={18} /> },
  ];

  const navItems = user?.role === 'Admin' ? adminNav : user?.role === 'Teacher' ? teacherNav : studentNav;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--brand-gray)' }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`} style={{ position: 'fixed', height: '100vh', zIndex: 50 }}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            overflow: 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <img src="/logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>IAmanArtist</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>{user?.role} Portal</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden ml-auto" style={{ color: 'rgba(255,255,255,0.6)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.75rem 0' }}>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              className={({ isActive }) => `sidebar-nav-link${isActive ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', marginBottom: '0.5rem' }}>
            Signed in as <strong style={{ color: '#fff' }}>{user?.username}</strong>
          </div>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(220,38,38,0.15)', color: '#f87171',
            border: '1px solid rgba(220,38,38,0.3)', borderRadius: '0.5rem',
            padding: '0.55rem 1rem', fontSize: '0.85rem', cursor: 'pointer', width: '100%',
            transition: 'all 0.2s'
          }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '260px', minHeight: '100vh' }}
        className="main-content-area">
        {/* Top bar (mobile) */}
        <div style={{
          display: 'none', alignItems: 'center', gap: '1rem',
          background: '#fff', padding: '1rem 1.5rem',
          borderBottom: '1px solid #f3e8ff', position: 'sticky', top: 0, zIndex: 30
        }} className="mobile-topbar">
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brand-purple)' }}>
            <Menu size={22} />
          </button>
          <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: 'var(--brand-purple-dk)' }}>IAmanArtist</span>
        </div>

        {/* Page content */}
        <main style={{ flex: 1, padding: '2rem' }}>
          {children || <Outlet />}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .main-content-area { margin-left: 0 !important; }
          .mobile-topbar { display: flex !important; }
          .sidebar { transform: translateX(-100%); }
          .sidebar.open { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default Layout;
