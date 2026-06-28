import React from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { User, Calendar, FolderHeart, HelpCircle, Settings, ShieldAlert } from 'lucide-react';

const DashboardLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="spinner"></span>
      </div>
    );
  }

  // Redirect if not signed in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isActive = (path) => {
    return location.pathname === path ? 'badge' : '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <Link to="/dashboard" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            background: location.pathname === '/dashboard' ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
            color: location.pathname === '/dashboard' ? 'var(--primary)' : 'var(--text-color)',
            fontSize: '0.9rem',
            fontWeight: 500
          }}>
            <User size={18} />
            <span className="link-text">My Profile</span>
          </Link>

          <Link to="/dashboard/bookings" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            background: location.pathname === '/dashboard/bookings' ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
            color: location.pathname === '/dashboard/bookings' ? 'var(--primary)' : 'var(--text-color)',
            fontSize: '0.9rem',
            fontWeight: 500
          }}>
            <Calendar size={18} />
            <span className="link-text">Booking History</span>
          </Link>

          <Link to="/dashboard/saved" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            background: location.pathname === '/dashboard/saved' ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
            color: location.pathname === '/dashboard/saved' ? 'var(--primary)' : 'var(--text-color)',
            fontSize: '0.9rem',
            fontWeight: 500
          }}>
            <FolderHeart size={18} />
            <span className="link-text">Saved Projects</span>
          </Link>

          <Link to="/dashboard/help" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            background: location.pathname === '/dashboard/help' ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
            color: location.pathname === '/dashboard/help' ? 'var(--primary)' : 'var(--text-color)',
            fontSize: '0.9rem',
            fontWeight: 500
          }}>
            <HelpCircle size={18} />
            <span className="link-text">Support & Messages</span>
          </Link>

          <Link to="/dashboard/settings" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            background: location.pathname === '/dashboard/settings' ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
            color: location.pathname === '/dashboard/settings' ? 'var(--primary)' : 'var(--text-color)',
            fontSize: '0.9rem',
            fontWeight: 500
          }}>
            <Settings size={18} />
            <span className="link-text">Account Settings</span>
          </Link>

          {/* Quick link to admin if user is admin */}
          {user.role === 'admin' && (
            <Link to="/admin" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: 'var(--danger)',
              fontSize: '0.9rem',
              fontWeight: 600,
              marginTop: 'auto'
            }}>
              <ShieldAlert size={18} />
              <span className="link-text">Admin Panel</span>
            </Link>
          )}
        </aside>

        {/* Dynamic Inner Dashboard Page */}
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
