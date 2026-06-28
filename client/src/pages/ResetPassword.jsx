import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { KeyRound, ShieldAlert, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const cachedEmail = sessionStorage.getItem('reset_email');
    if (cachedEmail) {
      setEmail(cachedEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !resetCode || !newPassword) {
      showToast('All fields are required.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const data = await api.post('/auth/reset-password', {
        email,
        resetCode,
        newPassword
      });

      if (data.success) {
        showToast('Password reset successful! Sign in with your new password.', 'success');
        sessionStorage.removeItem('reset_email');
        navigate('/login');
      }
    } catch (err) {
      showToast(err.message || 'Failed to reset password. Check details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '75vh' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Reset Password</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Fill in reset credentials below</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Reset PIN (6-Digits)</label>
            <input 
              type="text" 
              placeholder="e.g. 123456" 
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>New Password</label>
            <input 
              type="password" 
              placeholder="Minimum 6 characters" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
            {loading ? <span className="spinner" style={{ width: '16px', height: '16px' }}></span> : <><KeyRound size={16} /> Reset Password</>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.8rem' }}>
          <Link to="/login" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
            <ArrowLeft size={12} /> Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
