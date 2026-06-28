import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import BookingWizard from '../components/BookingWizard';
import { Calendar, User, Clock, Bell, CheckCircle, AlertCircle, Bookmark, HelpCircle, Heart, FolderHeart, Trash, Edit, Star, Key, Camera, Eye, Moon, Sun, Download, RefreshCw, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { user, clearNotification, toggleSaveProject, toggleSaveService, logout, theme, toggleTheme } = useAuth();
  const { showToast } = useToast();
  
  // Tab control
  const [activeTab, setActiveTab] = useState('overview'); // overview, profile, saved, settings

  // Dashboard Bookings
  const [bookings, setBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(true);
  
  // Saved Lists
  const [savedPortfolios, setSavedPortfolios] = useState([]);
  const [savedServicesList, setSavedServicesList] = useState([]);
  
  // Booking Wizards & Reschedule
  const [wizardOpen, setWizardOpen] = useState(false);
  const [reschedulingBooking, setReschedulingBooking] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('10:00');
  const [rescheduleSubmitting, setRescheduleSubmitting] = useState(false);

  // Profile forms
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileAvatar, setProfileAvatar] = useState('');
  const [profileSubmitting, setProfileSubmitting] = useState(false);

  // Password forms
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  const fetchBookings = async () => {
    setBookingLoading(true);
    try {
      const data = await api.get('/bookings/my-bookings');
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error('Failed to fetch user bookings:', err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePaymentInit = async (booking) => {
    try {
      // 1. Dynamically load Razorpay checkout script
      const scriptLoaded = await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      if (!scriptLoaded) {
        showToast('Razorpay SDK failed to load. Please check your network connection.', 'error');
        return;
      }

      // 2. Create order on the backend (standard fee 999 INR)
      const amount = 999;
      const orderRes = await api.post('/payments/order', {
        bookingId: booking._id,
        amount
      });

      if (!orderRes.success) {
        showToast(orderRes.message || 'Failed to initialize order', 'error');
        return;
      }

      // 3. Configure Razorpay Standard Checkout options
      const options = {
        key: orderRes.key_id,
        amount: orderRes.amount,
        currency: orderRes.currency,
        name: "NovaSphere Technologies",
        description: `Consultation: ${booking.service}`,
        order_id: orderRes.orderId,
        handler: async function (response) {
          try {
            // Verify HMAC signature
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id
            });

            if (verifyRes.success) {
              showToast('Payment successful!', 'success');
              window.location.href = `/payment-success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}&amount=${amount}`;
            } else {
              window.location.href = `/payment-failure?reason=${encodeURIComponent(verifyRes.message || 'Signature mismatch')}`;
            }
          } catch (err) {
            window.location.href = `/payment-failure?reason=${encodeURIComponent(err.message || 'Verification call failed')}`;
          }
        },
        prefill: {
          name: booking.name,
          email: booking.email,
          contact: booking.phone
        },
        theme: {
          color: "#06b6d4"
        },
        modal: {
          ondismiss: function () {
            showToast('Transaction cancelled by user.', 'info');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      showToast(err.message || 'Payment flow crashed.', 'error');
    }
  };

  const fetchSavedItems = async () => {
    try {
      // Fetch portfolios
      const portfolioData = await api.get('/portfolio');
      if (portfolioData.success && user && user.savedProjects) {
        const matched = portfolioData.projects.filter(p => user.savedProjects.includes(p._id));
        setSavedPortfolios(matched);
      }
      
      // Fetch services
      const servicesData = await api.get('/services');
      if (servicesData.success && user && user.savedServices) {
        const matched = servicesData.services.filter(s => user.savedServices.includes(s._id));
        setSavedServicesList(matched);
      }
    } catch (err) {
      console.error('Failed to load saved items:', err.message);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchSavedItems();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileEmail(user.email || '');
      setProfileAvatar(user.avatar || '');
    }
    fetchSavedItems();
  }, [user]);

  const handleNotificationRead = (notifId) => {
    clearNotification(notifId);
    showToast('Notification marked as read', 'success');
  };

  const handleUnsaveProject = async (projectId, title) => {
    try {
      await toggleSaveProject(projectId);
      showToast(`Removed "${title}" from saved projects`, 'info');
    } catch (err) {
      showToast('Failed to unsave project', 'error');
    }
  };

  const handleUnsaveService = async (serviceId, title) => {
    try {
      await toggleSaveService(serviceId);
      showToast(`Removed "${title}" from saved services`, 'info');
    } catch (err) {
      showToast('Failed to unsave service', 'error');
    }
  };

  // Cancel Booking
  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment booking?')) return;
    try {
      const res = await api.put(`/bookings/my-bookings/${id}/cancel`);
      if (res.success) {
        showToast('Appointment successfully cancelled', 'success');
        fetchBookings();
      }
    } catch (err) {
      showToast(err.message || 'Cancellation failed', 'error');
    }
  };

  // Submit Reschedule Request
  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleDate || !rescheduleTime) return;
    setRescheduleSubmitting(true);
    try {
      const res = await api.put(`/bookings/my-bookings/${reschedulingBooking._id}/reschedule`, {
        date: rescheduleDate,
        time: rescheduleTime
      });
      if (res.success) {
        showToast('Appointment rescheduled successfully. Pending admin confirmation.', 'success');
        setReschedulingBooking(null);
        fetchBookings();
      }
    } catch (err) {
      showToast(err.message || 'Reschedule failed', 'error');
    } finally {
      setRescheduleSubmitting(false);
    }
  };

  // Convert uploaded image to Base64 for user avatar
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Image size should be less than 2MB', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Edit Profile Details Submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSubmitting(true);
    try {
      const res = await api.put('/auth/profile', {
        name: profileName,
        email: profileEmail,
        avatar: profileAvatar
      });
      if (res.success) {
        showToast('Profile details updated successfully! Please reload to apply changes.', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Profile update failed', 'error');
    } finally {
      setProfileSubmitting(false);
    }
  };

  // Change Password Submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      showToast('Passwords do not match', 'warning');
      return;
    }
    setPasswordSubmitting(true);
    try {
      const res = await api.put('/auth/change-password', {
        currentPassword: oldPassword,
        newPassword
      });
      if (res.success) {
        showToast(res.message, 'success');
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err) {
      showToast(err.message || 'Password update failed', 'error');
    } finally {
      setPasswordSubmitting(false);
    }
  };

  // Account Deletion
  const handleDeleteAccount = async () => {
    if (!window.confirm('WARNING: Are you sure you want to permanently delete your account? This action cannot be undone.')) return;
    try {
      const res = await api.delete('/auth/me');
      if (res.success) {
        showToast(res.message, 'success');
        logout();
      }
    } catch (err) {
      showToast(err.message || 'Account deletion failed', 'error');
    }
  };

  // Download booking receipt slip
  const downloadReceipt = (booking) => {
    const textReceipt = `
===================================================
      NOVASPHERE TECHNOLOGIES APPOINTMENT SLIP      
===================================================
Client Details:
  Name:       ${booking.name}
  Email:      ${booking.email}
  Phone:      ${booking.phone}
---------------------------------------------------
Appointment Details:
  Service:    ${booking.service}
  Date:       ${booking.date}
  Time Slot:  ${booking.time}
  Status:     ${booking.status}
---------------------------------------------------
Notes & Brief Details:
  ${booking.details || booking.message || 'No additional details provided.'}
===================================================
  Thank you for scheduling a meeting with NovaSphere.
  For inquiries, contact support@novasphere.com.
===================================================
`;
    const blob = new Blob([textReceipt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `novasphere_receipt_${booking._id.substring(0, 6)}.txt`;
    link.click();
    showToast('Receipt slip downloaded successfully!', 'success');
  };

  if (!user) return null;

  // Granular counts
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed').length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  const cancelledBookings = bookings.filter(b => b.status === 'Cancelled').length;
  const unreadNotifs = (user.notifications || []).filter(n => !n.read).length;

  // Loading Skeletons
  const BookingSkeleton = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {[1, 2, 3].map(i => (
        <div key={i} className="glass-card" style={{
          height: '75px',
          padding: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.01)',
          animation: 'pulse 1.5s infinite ease-in-out'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '50%' }}>
            <div style={{ width: '80%', height: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
            <div style={{ width: '40%', height: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}></div>
          </div>
          <div style={{ width: '80px', height: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}></div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>Welcome Back, {user.name}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Manage bookings, edit profile settings, and view saved items.</p>
        </div>
        
        {/* Tab Selection Switcher */}
        <div className="glass-card" style={{ display: 'flex', gap: '0.5rem', padding: '0.35rem', margin: 0, borderRadius: '8px' }}>
          <button onClick={() => setActiveTab('overview')} className={`btn ${activeTab === 'overview' ? 'btn-primary' : ''}`} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', background: activeTab === 'overview' ? '' : 'transparent', border: 'none' }}>Overview</button>
          <button onClick={() => setActiveTab('profile')} className={`btn ${activeTab === 'profile' ? 'btn-primary' : ''}`} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', background: activeTab === 'profile' ? '' : 'transparent', border: 'none' }}>Profile</button>
          <button onClick={() => setActiveTab('saved')} className={`btn ${activeTab === 'saved' ? 'btn-primary' : ''}`} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', background: activeTab === 'saved' ? '' : 'transparent', border: 'none' }}>Saved</button>
          <button onClick={() => setActiveTab('settings')} className={`btn ${activeTab === 'settings' ? 'btn-primary' : ''}`} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', background: activeTab === 'settings' ? '' : 'transparent', border: 'none' }}>Settings</button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* Stats Cards Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--primary)', padding: '0.6rem', borderRadius: '8px' }}><Calendar size={18} /></div>
              <div><h4 style={{ fontSize: '1.2rem', margin: 0 }}>{totalBookings}</h4><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Total Appointments</p></div>
            </div>
            <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.6rem', borderRadius: '8px' }}><CheckCircle size={18} /></div>
              <div><h4 style={{ fontSize: '1.2rem', margin: 0 }}>{confirmedBookings}</h4><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Confirmed Slots</p></div>
            </div>
            <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', padding: '0.6rem', borderRadius: '8px' }}><Clock size={18} /></div>
              <div><h4 style={{ fontSize: '1.2,rem', margin: 0 }}>{pendingBookings}</h4><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Pending Approval</p></div>
            </div>
            <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '0.6rem', borderRadius: '8px' }}><AlertCircle size={18} /></div>
              <div><h4 style={{ fontSize: '1.2rem', margin: 0 }}>{cancelledBookings}</h4><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Cancelled Bookings</p></div>
            </div>
          </div>

          {/* Core overview layout */}
          <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            
            {/* Bookings table */}
            <div className="glass-card" style={{ minHeight: '350px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Your Requested Consultations</h3>
                <button onClick={() => setWizardOpen(true)} className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.75rem' }}>
                  Book Consultation
                </button>
              </div>

              {bookingLoading ? (
                <BookingSkeleton />
              ) : bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3.5rem 0', color: 'var(--text-muted)' }}>
                  <Calendar size={36} style={{ marginBottom: '0.75rem', color: 'var(--primary)' }} />
                  <p style={{ fontSize: '0.9rem' }}>You have no active appointments booked yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {bookings.map(b => (
                    <div key={b._id} style={{
                      background: 'rgba(255, 255, 255, 0.01)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '10px',
                      padding: '1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', color: 'var(--primary)', margin: 0 }}>{b.service}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem', margin: 0 }}>
                          <Calendar size={12} /> {b.date} &nbsp;&bull;&nbsp; <Clock size={12} /> {b.time}
                        </p>
                        {b.details && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontStyle: 'italic', margin: 0 }}>{b.details}</p>}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className={`badge ${b.status.toLowerCase()}`}>{b.status}</span>
                        {b.paymentStatus === 'Paid' ? (
                          <span className="badge success" style={{ fontSize: '0.65rem' }}>Paid</span>
                        ) : (
                          b.status === 'Confirmed' && (
                            <button 
                              onClick={() => handlePaymentInit(b)} 
                              className="btn" 
                              style={{ 
                                padding: '0.3rem 0.65rem', 
                                fontSize: '0.7rem', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.25rem', 
                                background: 'rgba(6, 182, 212, 0.1)', 
                                border: '1px solid var(--primary)', 
                                color: 'var(--primary)' 
                              }}
                            >
                              <CreditCard size={12} /> Pay ₹999
                            </button>
                          )
                        )}
                        
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          {b.status === 'Confirmed' && (
                            <button 
                              onClick={() => downloadReceipt(b)} 
                              className="btn-icon" 
                              title="Download Receipt slip" 
                              style={{ width: '28px', height: '28px', color: 'var(--primary)' }}
                            >
                              <Download size={14} />
                            </button>
                          )}
                          
                          {b.status !== 'Cancelled' && (
                            <>
                              <button 
                                onClick={() => {
                                  setReschedulingBooking(b);
                                  setRescheduleDate(b.date);
                                  setRescheduleTime(b.time);
                                }} 
                                className="btn-icon" 
                                title="Reschedule" 
                                style={{ width: '28px', height: '28px', color: 'var(--secondary)' }}
                              >
                                <RefreshCw size={14} />
                              </button>
                              <button 
                                onClick={() => handleCancelBooking(b._id)} 
                                className="btn-icon" 
                                title="Cancel booking" 
                                style={{ width: '28px', height: '28px', color: 'var(--danger)' }}
                              >
                                <Trash size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Splits */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              {/* Notification Center */}
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem', margin: 0 }}>
                  <Bell size={14} /> Notification Log {unreadNotifs > 0 && <span className="badge pending" style={{ padding: '0.1rem 0.35rem', fontSize: '0.65rem' }}>{unreadNotifs} Unread</span>}
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '180px', overflowY: 'auto' }}>
                  {(user.notifications || []).length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontStyle: 'italic' }}>No alerts in feed.</p>
                  ) : (
                    user.notifications.map(notif => (
                      <div 
                        key={notif.id}
                        onClick={() => !notif.read && handleNotificationRead(notif.id)}
                        style={{
                          padding: '0.65rem',
                          borderRadius: '8px',
                          background: notif.read ? 'rgba(255,255,255,0.01)' : 'rgba(6, 182, 212, 0.05)',
                          border: `1px solid ${notif.read ? 'var(--card-border)' : 'rgba(6, 182, 212, 0.25)'}`,
                          cursor: notif.read ? 'default' : 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <h5 style={{ fontSize: '0.8rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between', margin: 0 }}>
                          {notif.title}
                          {!notif.read && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }}></span>}
                        </h5>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem', margin: 0 }}>{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Saved Portfolio Projects */}
              <div className="glass-card" style={{ padding: '1.25rem' }}>
                <h4 style={{ fontSize: '0.95rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem', margin: 0 }}>
                  <FolderHeart size={14} /> Saved Case Studies
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {savedPortfolios.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontStyle: 'italic', margin: 0 }}>Explore our <Link to="/portfolio" style={{ color: 'var(--primary)' }}>portfolio</Link> to save.</p>
                  ) : (
                    savedPortfolios.map(p => (
                      <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
                        <div>
                          <span style={{ fontWeight: 600, display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '130px' }}>{p.title}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.category}</span>
                        </div>
                        <button onClick={() => handleUnsaveProject(p._id, p.title)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }} title="Remove"><Trash size={14} /></button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Profile Editing Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-2" style={{ gap: '2rem' }}>
          
          {/* Edit Profile Details */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={16} /> Edit Profile Details</h3>
            
            <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '0.5rem' }}>
                <div style={{ position: 'relative' }}>
                  <img 
                    src={profileAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
                    alt="profile avatar" 
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
                  />
                  <label htmlFor="avatar-file" style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--primary)', color: 'white', padding: '0.25rem', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Upload Avatar">
                    <Camera size={14} />
                  </label>
                  <input type="file" id="avatar-file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>{user.name}</h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Upload an image file under 2MB.</p>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Full Name</label>
                <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} required className="form-input" />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Email Address</label>
                <input type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} required className="form-input" />
              </div>

              <button type="submit" disabled={profileSubmitting} className="btn btn-primary" style={{ width: '100%' }}>
                {profileSubmitting ? <span className="spinner" style={{ width: '16px', height: '16px' }}></span> : 'Save Profile Details'}
              </button>
            </form>
          </div>

          {/* Change Password Panel */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Key size={16} /> Security Credentials</h3>
            
            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Current Password</label>
                <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required className="form-input" />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="form-input" />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Confirm New Password</label>
                <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required className="form-input" />
              </div>

              <button type="submit" disabled={passwordSubmitting} className="btn btn-primary" style={{ width: '100%' }}>
                {passwordSubmitting ? <span className="spinner" style={{ width: '16px', height: '16px' }}></span> : 'Update Password'}
              </button>
            </form>
          </div>

        </div>
      )}

      {/* Saved Items List Tab */}
      {activeTab === 'saved' && (
        <div className="grid grid-2" style={{ gap: '2rem' }}>
          
          {/* Saved Services */}
          <div className="glass-card" style={{ padding: '1.5rem', minHeight: '300px' }}>
            <h3 style={{ fontSize: '1.15rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Heart size={16} style={{ color: 'var(--primary)' }} /> Favorited Service Offerings</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {savedServicesList.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>No services favorited. Explore our <Link to="/services" style={{ color: 'var(--primary)' }}>services</Link> to toggle.</p>
              ) : (
                savedServicesList.map(s => (
                  <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid var(--card-border)', borderRadius: '8px', background: 'rgba(255,255,255,0.01)' }}>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--primary)', margin: 0 }}>{s.title}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Base Price: {s.pricing}</span>
                    </div>
                    <button onClick={() => handleUnsaveService(s._id, s.title)} className="btn-icon" style={{ color: 'var(--danger)' }} title="Unfavorite"><Trash size={14} /></button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Saved Portfolio Projects */}
          <div className="glass-card" style={{ padding: '1.5rem', minHeight: '300px' }}>
            <h3 style={{ fontSize: '1.15rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Bookmark size={16} style={{ color: 'var(--secondary)' }} /> Saved Case Studies</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {savedPortfolios.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>No portfolio projects saved. Explore our <Link to="/portfolio" style={{ color: 'var(--primary)' }}>portfolio</Link> to save.</p>
              ) : (
                savedPortfolios.map(p => (
                  <div key={p._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid var(--card-border)', borderRadius: '8px', background: 'rgba(255,255,255,0.01)' }}>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', color: 'var(--primary)', margin: 0 }}>{p.title}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category: {p.category} | Client: {p.client}</span>
                    </div>
                    <button onClick={() => handleUnsaveProject(p._id, p.title)} className="btn-icon" style={{ color: 'var(--danger)' }} title="Remove"><Trash size={14} /></button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* Account Settings Tab */}
      {activeTab === 'settings' && (
        <div className="grid grid-2" style={{ gap: '2rem' }}>
          
          {/* General Preferences */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>Preferences</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0' }}>
              <div>
                <h4 style={{ fontSize: '0.9rem', margin: 0 }}>Visual Palette Theme</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Toggle between dark mode and light mode templates.</p>
              </div>
              <button 
                onClick={toggleTheme} 
                className="btn btn-secondary" 
                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                {theme === 'dark' ? <><Sun size={14} /> Light Theme</> : <><Moon size={14} /> Dark Theme</>}
              </button>
            </div>
          </div>

          {/* Account Suspension Panel */}
          <div className="glass-card" style={{ padding: '1.5rem', borderColor: 'var(--danger)', background: 'rgba(239, 68, 68, 0.02)' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--danger)', borderBottom: '1px solid rgba(239, 68, 68, 0.1)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>Danger Zone</h3>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Permanently deleting your account deletes all booked consultation receipts, favorites, and profile access. This is permanent.
            </p>

            <button 
              onClick={handleDeleteAccount} 
              className="btn" 
              style={{ background: 'var(--danger)', color: 'white', border: 'none', padding: '0.55rem 1.25rem', fontSize: '0.8rem', fontWeight: 600 }}
            >
              Delete My Account
            </button>
          </div>

        </div>
      )}

      {/* Reschedule appointment wizard modal */}
      {reschedulingBooking && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '400px', width: '100%', border: '1px solid var(--card-border)', background: '#090d16' }}>
            <h3 style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>Reschedule Appointment</h3>
            
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rescheduling booking for "{reschedulingBooking.service}". New request will be reviewed by admin.</p>
            
            <form onSubmit={handleRescheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div className="form-group">
                <label>Preferred Date</label>
                <input 
                  type="date" 
                  value={rescheduleDate} 
                  onChange={(e) => setRescheduleDate(e.target.value)} 
                  min={new Date().toISOString().split('T')[0]}
                  required 
                  className="form-input" 
                />
              </div>

              <div className="form-group">
                <label>Preferred Time Slot</label>
                <select 
                  value={rescheduleTime} 
                  onChange={(e) => setRescheduleTime(e.target.value)} 
                  className="form-input"
                >
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="submit" disabled={rescheduleSubmitting} className="btn btn-primary" style={{ flex: 1 }}>
                  {rescheduleSubmitting ? <span className="spinner" style={{ width: '14px', height: '14px' }}></span> : 'Submit Request'}
                </button>
                <button type="button" onClick={() => setReschedulingBooking(null)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Wizard modal */}
      <BookingWizard 
        isOpen={wizardOpen} 
        onClose={() => setWizardOpen(false)} 
        onBookingSuccess={fetchBookings} 
      />
    </div>
  );
};

export default UserDashboard;
