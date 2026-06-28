import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { LayoutDashboard, Users, Cpu, Image, Newspaper, CalendarRange, Mail, UsersRound, Briefcase, ArrowLeft } from 'lucide-react';

const AdminLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="spinner"></span>
      </div>
    );
  }

  // Redirect if not signed in or not an admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path;
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.7rem 1rem',
      borderRadius: '8px',
      background: isActive ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
      color: isActive ? 'var(--primary)' : 'var(--text-color)',
      fontSize: '0.85rem',
      fontWeight: isActive ? 600 : 500
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="dashboard-container">
        {/* Admin Sidebar */}
        <aside className="sidebar" style={{ borderRight: '1px solid rgba(6, 182, 212, 0.25)' }}>
          <Link to="/admin" style={getLinkStyle('/admin')}>
            <LayoutDashboard size={16} />
            <span className="link-text">Overview</span>
          </Link>

          <Link to="/admin/users" style={getLinkStyle('/admin/users')}>
            <Users size={16} />
            <span className="link-text">Manage Users</span>
          </Link>

          <Link to="/admin/services" style={getLinkStyle('/admin/services')}>
            <Cpu size={16} />
            <span className="link-text">Services CRUD</span>
          </Link>

          <Link to="/admin/projects" style={getLinkStyle('/admin/projects')}>
            <Image size={16} />
            <span className="link-text">Portfolio CRUD</span>
          </Link>

          <Link to="/admin/blogs" style={getLinkStyle('/admin/blogs')}>
            <Newspaper size={16} />
            <span className="link-text">Blogs CRUD</span>
          </Link>

          <Link to="/admin/bookings" style={getLinkStyle('/admin/bookings')}>
            <CalendarRange size={16} />
            <span className="link-text">Appointments</span>
          </Link>

          <Link to="/admin/contacts" style={getLinkStyle('/admin/contacts')}>
            <Mail size={16} />
            <span className="link-text">Contact Messages</span>
          </Link>

          <Link to="/admin/careers" style={getLinkStyle('/admin/careers')}>
            <Briefcase size={16} />
            <span className="link-text">Job Careers</span>
          </Link>

          <Link to="/admin/testimonials" style={getLinkStyle('/admin/testimonials')}>
            <UsersRound size={16} />
            <span className="link-text">Testimonials</span>
          </Link>

          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            fontWeight: 500,
            marginTop: 'auto'
          }}>
            <ArrowLeft size={16} />
            <span className="link-text">Main Website</span>
          </Link>
        </aside>

        {/* Admin Content Pane */}
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
