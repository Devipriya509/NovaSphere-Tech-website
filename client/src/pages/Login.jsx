import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, Lock, LogIn, ArrowRight, ShieldAlert } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, user } = useAuth();
  const { showToast } = useToast();
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');

  // If already logged in, redirect away
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(redirect === 'services' ? '/services' : '/dashboard');
      }
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.success) {
        showToast(`Welcome back, ${data.user.name}!`, 'success');
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(redirect === 'services' ? '/services' : '/dashboard');
        }
      }
    } catch (err) {
      showToast(err.message || 'Login failed, check your credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="sphere" style={{ top: '20%', left: '30%', width: '300px', height: '300px' }}></div>

      <div className="glass-card" style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Sign In</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Log in to access your bookings and dashboards</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label><Mail size={12} style={{ marginRight: '0.25rem' }} /> Email Address</label>
            <input 
              type="email" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ margin: 0 }}><Lock size={12} style={{ marginRight: '0.25rem' }} /> Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Forgot?</Link>
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? <span className="spinner" style={{ width: '16px', height: '16px' }}></span> : <><LogIn size={16} /> Sign In</>}
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div style={{
          marginTop: '1.5rem',
          background: 'rgba(6, 182, 212, 0.05)',
          border: '1px dashed rgba(6, 182, 212, 0.2)',
          borderRadius: '10px',
          padding: '1rem',
          fontSize: '0.75rem'
        }}>
          <p style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>
            <ShieldAlert size={12} /> Fictional Presentation Credentials:
          </p>
          <p><strong>Admin</strong>: admin@novasphere.com | admin123</p>
          <p><strong>User</strong>: user@novasphere.com | user123</p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign Up <ArrowRight size={12} style={{ verticalAlign: 'middle' }} /></Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
