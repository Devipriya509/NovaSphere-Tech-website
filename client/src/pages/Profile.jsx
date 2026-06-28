import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { User, Lock, Edit3, KeyRound } from 'lucide-react';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const { showToast } = useToast();

  // Profile fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;

    setProfileLoading(true);
    try {
      const data = await api.put('/auth/profile', { name, email, avatar });
      if (data.success) {
        showToast('Profile details updated!', 'success');
        refreshUser(); // sync context state
      }
    } catch (err) {
      showToast(err.message || 'Profile update failed', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return;

    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'warning');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Confirm passwords do not match.', 'error');
      return;
    }

    setPassLoading(true);
    try {
      const data = await api.put('/auth/change-password', { currentPassword, newPassword });
      if (data.success) {
        showToast('Password updated successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      showToast(err.message || 'Password update failed', 'error');
    } finally {
      setPassLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="section" style={{ minHeight: '80vh' }}>
      <div className="container">
        
        {/* Title */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={28} style={{ color: 'var(--primary)' }} /> Edit Profile
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Configure your identity and update password credentials.</p>
        </div>

        {/* Profile layout grid */}
        <div className="grid grid-2" style={{ gap: '3rem', alignItems: 'flex-start' }}>
          
          {/* Edit Profile details card */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Edit3 size={18} style={{ color: 'var(--primary)' }} /> Personal Details
            </h3>
            
            <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Avatar Preview */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--card-border)' }}>
                <img 
                  src={avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`} 
                  alt="avatar preview" 
                  style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                />
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Avatar Image URL</label>
                  <input 
                    type="text" 
                    value={avatar} 
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://example.com/pic.jpg"
                    className="form-input"
                    style={{ fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

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

              <button 
                type="submit" 
                disabled={profileLoading} 
                className="btn btn-primary" 
                style={{ width: 'fit-content', marginTop: '0.5rem' }}
              >
                {profileLoading ? <span className="spinner" style={{ width: '16px', height: '16px' }}></span> : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <KeyRound size={18} style={{ color: 'var(--secondary)' }} /> Change Password
            </h3>

            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="form-input"
                  placeholder="••••••••"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>New Password</label>
                <input 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="form-input"
                  placeholder="Minimum 6 characters"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Confirm New Password</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="form-input"
                  placeholder="••••••••"
                />
              </div>

              <button 
                type="submit" 
                disabled={passLoading} 
                className="btn btn-primary" 
                style={{ width: 'fit-content', marginTop: '0.5rem', background: 'linear-gradient(135deg, var(--secondary) 0%, var(--accent) 100%)' }}
              >
                {passLoading ? <span className="spinner" style={{ width: '16px', height: '16px' }}></span> : 'Update Password'}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
