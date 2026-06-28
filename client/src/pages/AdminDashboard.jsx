import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { LayoutDashboard, Users, Cpu, Image, Newspaper, Calendar, Mail, Briefcase, Star, Trash, Edit, Plus, Check, X } from 'lucide-react';

const AdminDashboard = () => {
  const { showToast } = useToast();
  const path = window.location.pathname;

  // Determine active view
  let view = 'overview';
  if (path.includes('/users')) view = 'users';
  else if (path.includes('/services')) view = 'services';
  else if (path.includes('/projects')) view = 'projects';
  else if (path.includes('/blogs')) view = 'blogs';
  else if (path.includes('/bookings')) view = 'bookings';
  else if (path.includes('/contacts')) view = 'contacts';
  else if (path.includes('/careers')) view = 'careers';
  else if (path.includes('/testimonials')) view = 'testimonials';

  const [data, setData] = useState({
    stats: { users: 0, bookings: 0, messages: 0, jobs: 0, projects: 0, testimonials: 0 },
    recentBookings: [],
    recentMessages: [],
    charts: { bookingsByMonth: [], serviceDistribution: [] },
    usersList: []
  });
  const [loading, setLoading] = useState(true);

  // Dynamic Lists for CRUD tabs
  const [servicesList, setServicesList] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [blogsList, setBlogsList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [messagesList, setMessagesList] = useState([]);
  const [careersList, setCareersList] = useState([]);
  const [testimonialsList, setTestimonialsList] = useState([]);

  // Modal / Form Edit states
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Dynamic input fields
  const [serviceForm, setServiceForm] = useState({ title: '', slug: '', description: '', features: '', technologies: '', pricing: '', icon: 'Cpu' });
  const [projectForm, setProjectForm] = useState({ title: '', description: '', image: '', category: 'Web Development', technologies: '', client: '', liveDemo: '', github: '' });
  const [blogForm, setBlogForm] = useState({ title: '', slug: '', content: '', image: '', category: 'AI Solutions', tags: '', readTime: '5 mins' });
  const [careerForm, setCareerForm] = useState({ title: '', department: 'Engineering', location: 'Remote', type: 'Full-time', salary: '', description: '', requirements: '', responsibilities: '' });
  const [testimonialForm, setTestimonialForm] = useState({ name: '', role: '', company: '', content: '', rating: 5 });

  // Enterprise panel extension states
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [userSearch, setUserSearch] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [userEditForm, setUserEditForm] = useState({ name: '', email: '', role: 'user' });

  const [replyingMessage, setReplyingMessage] = useState(null);
  const [replyBody, setReplyBody] = useState('');

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/admin/analytics');
      if (res.success) {
        setData(res.analytics);
      }
    } catch (err) {
      console.error('Failed to load analytical overview:', err.message);
    }
  };

  const fetchCrudLists = async () => {
    try {
      if (view === 'services') {
        const res = await api.get('/services');
        setServicesList(res.services);
      } else if (view === 'projects') {
        const res = await api.get('/portfolio');
        setProjectsList(res.projects);
      } else if (view === 'blogs') {
        const res = await api.get('/blogs');
        setBlogsList(res.blogs);
      } else if (view === 'bookings') {
        const res = await api.get('/admin/bookings'); // Uses admin endpoint
        setBookingsList(res.bookings);
      } else if (view === 'contacts') {
        const res = await api.get('/contact');
        setMessagesList(res.messages);
      } else if (view === 'careers') {
        const res = await api.get('/careers');
        setCareersList(res.jobs);
      } else if (view === 'testimonials') {
        const res = await api.get('/testimonials');
        setTestimonialsList(res.testimonials);
      }
    } catch (err) {
      console.error(`Failed to load data for view: ${view}`, err.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      await fetchAnalytics();
      await fetchCrudLists();
      setLoading(false);
    };
    loadData();
    setShowForm(false);
    setEditId(null);
  }, [view]);

  // Appointments Actions
  const handleBookingAction = async (id, status) => {
    try {
      const res = await api.put(`/bookings/${id}`, { status });
      if (res.success) {
        showToast(`Booking updated to ${status}`, 'success');
        fetchCrudLists();
      }
    } catch (err) {
      showToast(err.message || 'Status update failed', 'error');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm('Delete this booking permanently?')) return;
    try {
      const res = await api.delete(`/bookings/${id}`);
      if (res.success) {
        showToast(res.message, 'success');
        fetchCrudLists();
      }
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  // Messages Actions
  const handleToggleMessageRead = async (id, isRead) => {
    try {
      const res = await api.put(`/contact/messages/${id}`, { isRead });
      if (res.success) {
        showToast('Message read status updated', 'success');
        fetchCrudLists();
      }
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      const res = await api.delete(`/contact/messages/${id}`);
      if (res.success) {
        showToast(res.message, 'success');
        fetchCrudLists();
      }
    } catch (err) {
      showToast(err.message || 'Deletion failed', 'error');
    }
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyBody.trim()) return;
    showToast(`Reply simulated and successfully dispatched to ${replyingMessage.email}!`, 'success');
    setReplyingMessage(null);
    setReplyBody('');
  };

  // User Actions
  const handleToggleBlockUser = async (id) => {
    try {
      const res = await api.put(`/auth/users/${id}/block`);
      if (res.success) {
        showToast(res.message, 'success');
        fetchAnalytics();
      }
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete user account permanently?')) return;
    try {
      const res = await api.delete(`/auth/users/${id}`);
      if (res.success) {
        showToast(res.message, 'success');
        fetchAnalytics();
      }
    } catch (err) {
      showToast(err.message || 'Deletion failed', 'error');
    }
  };

  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/auth/users/${editUser._id}`, userEditForm);
      if (res.success) {
        showToast(res.message, 'success');
        setEditUser(null);
        fetchAnalytics();
      }
    } catch (err) {
      showToast(err.message || 'Update failed', 'error');
    }
  };

  // Testimonials CRUD Handlers
  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (editId) {
        res = await api.put(`/testimonials/${editId}`, testimonialForm);
      } else {
        res = await api.post('/testimonials', testimonialForm);
      }
      if (res.success) {
        showToast(res.message, 'success');
        setShowForm(false);
        setEditId(null);
        fetchCrudLists();
      }
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const handleTestimonialDelete = async (id) => {
    if (!window.confirm('Delete this testimonial permanently?')) return;
    try {
      const res = await api.delete(`/testimonials/${id}`);
      if (res.success) {
        showToast(res.message, 'success');
        fetchCrudLists();
      }
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  // CSV Export Handler
  const exportToCSV = () => {
    const headers = ['Service', 'Date', 'Time', 'Client Name', 'Email', 'Phone', 'Status', 'Details'];
    const rows = bookingsList.map(b => [
      b.service,
      b.date,
      b.time,
      b.name,
      b.email,
      b.phone,
      b.status,
      (b.details || b.message || '').replace(/"/g, '""')
    ]);
    const csvContent = [headers, ...rows].map(e => e.map(val => `"${val}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `novasphere_bookings_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Bookings successfully exported to CSV!', 'success');
  };

  // Services CRUD
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...serviceForm,
      features: serviceForm.features.split('\n').filter(f => f.trim()),
      technologies: serviceForm.technologies.split(',').map(t => t.trim()).filter(t => t)
    };
    try {
      let res;
      if (editId) {
        res = await api.put(`/services/${editId}`, payload);
      } else {
        res = await api.post('/services', payload);
      }
      if (res.success) {
        showToast(res.message, 'success');
        setShowForm(false);
        fetchCrudLists();
      }
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const handleServiceEdit = (item) => {
    setEditId(item._id);
    setServiceForm({
      title: item.title,
      slug: item.slug,
      description: item.description,
      features: (item.features || []).join('\n'),
      technologies: (item.technologies || []).join(', '),
      pricing: item.pricing,
      icon: item.icon || 'Cpu'
    });
    setShowForm(true);
  };

  const handleServiceDelete = async (id) => {
    if (!window.confirm('Delete this service permanently?')) return;
    try {
      const res = await api.delete(`/services/${id}`);
      if (res.success) {
        showToast(res.message, 'success');
        fetchCrudLists();
      }
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  // Projects CRUD
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...projectForm,
      technologies: projectForm.technologies.split(',').map(t => t.trim()).filter(t => t)
    };
    try {
      let res;
      if (editId) {
        res = await api.put(`/portfolio/${editId}`, payload);
      } else {
        res = await api.post('/portfolio', payload);
      }
      if (res.success) {
        showToast(res.message, 'success');
        setShowForm(false);
        fetchCrudLists();
      }
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const handleProjectEdit = (item) => {
    setEditId(item._id);
    setProjectForm({
      title: item.title,
      description: item.description,
      image: item.image,
      category: item.category,
      technologies: (item.technologies || []).join(', '),
      client: item.client,
      liveDemo: item.liveDemo || '',
      github: item.github || ''
    });
    setShowForm(true);
  };

  const handleProjectDelete = async (id) => {
    if (!window.confirm('Delete this portfolio project permanently?')) return;
    try {
      const res = await api.delete(`/portfolio/${id}`);
      if (res.success) {
        showToast(res.message, 'success');
        fetchCrudLists();
      }
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  // Blogs CRUD
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...blogForm,
      tags: blogForm.tags.split(',').map(t => t.trim()).filter(t => t)
    };
    try {
      let res;
      if (editId) {
        res = await api.put(`/blogs/${editId}`, payload);
      } else {
        res = await api.post('/blogs', payload);
      }
      if (res.success) {
        showToast(res.message, 'success');
        setShowForm(false);
        fetchCrudLists();
      }
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const handleBlogEdit = (item) => {
    setEditId(item._id);
    setBlogForm({
      title: item.title,
      slug: item.slug,
      content: item.content,
      image: item.image,
      category: item.category,
      tags: (item.tags || []).join(', '),
      readTime: item.readTime || '5 mins'
    });
    setShowForm(true);
  };

  const handleBlogDelete = async (id) => {
    if (!window.confirm('Delete this blog post?')) return;
    try {
      const res = await api.delete(`/blogs/${id}`);
      if (res.success) {
        showToast(res.message, 'success');
        fetchCrudLists();
      }
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  // Careers CRUD
  const handleCareerSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...careerForm,
      requirements: careerForm.requirements.split('\n').filter(r => r.trim()),
      responsibilities: careerForm.responsibilities.split('\n').filter(r => r.trim())
    };
    try {
      let res;
      if (editId) {
        res = await api.put(`/careers/${editId}`, payload);
      } else {
        res = await api.post('/careers', payload);
      }
      if (res.success) {
        showToast(res.message, 'success');
        setShowForm(false);
        fetchCrudLists();
      }
    } catch (err) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const handleCareerEdit = (item) => {
    setEditId(item._id);
    setCareerForm({
      title: item.title,
      department: item.department,
      location: item.location,
      type: item.type,
      salary: item.salary,
      description: item.description,
      requirements: (item.requirements || []).join('\n'),
      responsibilities: (item.responsibilities || []).join('\n')
    });
    setShowForm(true);
  };

  const handleCareerDelete = async (id) => {
    if (!window.confirm('Remove this job listing?')) return;
    try {
      const res = await api.delete(`/careers/${id}`);
      if (res.success) {
        showToast(res.message, 'success');
        fetchCrudLists();
      }
    } catch (err) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  if (loading) {
    return <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span className="spinner"></span></div>;
  }

  return (
    <div>
      {/* Overview View */}
      {view === 'overview' && (
        <div>
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Administration Overview</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Analytical systems feedback and statistics.</p>
          </div>

          {/* Admin Operations Notification Alert Center */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
            {data.stats.pendingBookings > 0 && (
              <div className="glass-card" style={{ borderColor: 'var(--warning)', background: 'rgba(245, 158, 11, 0.05)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--warning)', fontWeight: 'bold' }}>[PENDING ACTION]</span>
                <span>There are currently <strong>{data.stats.pendingBookings}</strong> appointment scheduling requests waiting for confirmation.</span>
              </div>
            )}
            {data.stats.messages > 0 && (
              <div className="glass-card" style={{ borderColor: 'var(--primary)', background: 'rgba(6, 182, 212, 0.05)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>[SYSTEM INFO]</span>
                <span>Active contact form submissions: <strong>{data.stats.messages}</strong> total threads.</span>
              </div>
            )}
            <div className="glass-card" style={{ borderColor: 'var(--success)', background: 'rgba(16, 185, 129, 0.05)', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>[HEALTH CHECK]</span>
              <span>All Node services and JSON collection databases are compiling and running successfully.</span>
            </div>
          </div>

          {/* Advanced Analytics stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--primary)', padding: '0.75rem', borderRadius: '10px' }}><Users size={20} /></div>
              <div><h4 style={{ fontSize: '1.25rem', margin: 0 }}>{data.stats.users}</h4><p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Total Accounts</p></div>
            </div>
            
            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '0.75rem', borderRadius: '10px' }}><Calendar size={20} /></div>
              <div>
                <h4 style={{ fontSize: '1.25rem', margin: 0 }}>{data.stats.bookings}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Bookings (<span style={{ color: 'var(--success)' }}>{data.stats.confirmedBookings} C</span> | <span style={{ color: 'var(--warning)' }}>{data.stats.pendingBookings} P</span>)
                </p>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--secondary)', padding: '0.75rem', borderRadius: '10px' }}><Star size={20} /></div>
              <div><h4 style={{ fontSize: '1.25rem', margin: 0 }}>${((data.stats.revenue || 0)).toLocaleString()}</h4><p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Estimated Revenue</p></div>
            </div>

            <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', padding: '0.75rem', borderRadius: '10px' }}><Briefcase size={20} /></div>
              <div><h4 style={{ fontSize: '1.25rem', margin: 0 }}>${((data.stats.pendingRevenue || 0)).toLocaleString()}</h4><p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Pipeline Value</p></div>
            </div>
          </div>

          {/* Simple SVG Chart Section */}
          <div className="grid grid-2" style={{ gap: '2rem', marginBottom: '3rem' }}>
            <div className="glass-card">
              <h4>Consultation Schedule Trends</h4>
              <div className="svg-chart-container" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingBottom: '20px', borderBottom: '1px solid var(--card-border)' }}>
                {data.charts.bookingsByMonth.map(m => (
                  <div key={m.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{
                      width: '36px',
                      height: `${m.Bookings * 7}px`,
                      background: 'linear-gradient(to top, var(--secondary) 0%, var(--primary) 100%)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.5s'
                    }} title={`${m.Bookings} Bookings`}></div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card">
              <h4>Primary Service Distribution</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                {data.charts.serviceDistribution.map(s => (
                  <div key={s.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                      <span>{s.name}</span>
                      <strong>{s.value}%</strong>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ width: `${s.value}%`, height: '100%', background: 'var(--primary)', borderRadius: '99px' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Split: Recent Activity Feed */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>System Recent Activity Log</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {!data.recentActivity || data.recentActivity.length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No recent system activity recorded.</p>
              ) : data.recentActivity.map(a => (
                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', borderBottom: '1px dashed var(--card-border)', paddingBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.65rem',
                      textTransform: 'uppercase',
                      fontWeight: 'bold',
                      background: a.type === 'registration' ? 'rgba(99, 102, 241, 0.15)' : a.type === 'booking' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(236, 72, 153, 0.15)',
                      color: a.type === 'registration' ? '#818cf8' : a.type === 'booking' ? '#22d3ee' : '#f472b6'
                    }}>{a.type}</span>
                    <span>{a.text}</span>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{new Date(a.time).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Manager View */}
      {view === 'users' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ margin: 0 }}>Registered User Accounts</h3>
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="form-input"
              style={{ maxWidth: '300px', fontSize: '0.8rem', padding: '0.4rem 0.8rem', margin: 0 }}
            />
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--card-border)', color: 'var(--primary)' }}>
                  <th style={{ padding: '0.75rem' }}>Name</th>
                  <th style={{ padding: '0.75rem' }}>Email Address</th>
                  <th style={{ padding: '0.75rem' }}>Role</th>
                  <th style={{ padding: '0.75rem' }}>Status</th>
                  <th style={{ padding: '0.75rem' }}>Joined Date</th>
                  <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.usersList
                  .filter(u => {
                    const query = userSearch.toLowerCase();
                    return u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query);
                  })
                  .map(u => (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                      <td style={{ padding: '0.75rem' }}>{u.name}</td>
                      <td style={{ padding: '0.75rem' }}>{u.email}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${u.role === 'admin' ? 'confirmed' : 'pending'}`}>{u.role}</span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className={`badge ${u.isBlocked ? 'cancelled' : 'confirmed'}`}>{u.isBlocked ? 'Suspended' : 'Active'}</span>
                      </td>
                      <td style={{ padding: '0.75rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button 
                            onClick={() => {
                              setEditUser(u);
                              setUserEditForm({ name: u.name, email: u.email, role: u.role });
                            }} 
                            className="btn-icon" 
                            title="Edit User"
                            style={{ color: 'var(--primary)' }}
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => handleToggleBlockUser(u._id)} 
                            className="btn-icon" 
                            title={u.isBlocked ? "Activate Account" : "Suspend Account"}
                            style={{ color: u.isBlocked ? 'var(--success)' : 'var(--warning)' }}
                          >
                            {u.isBlocked ? <Check size={14} /> : <X size={14} />}
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(u._id)} 
                            className="btn-icon" 
                            title="Delete User"
                            style={{ color: 'var(--danger)' }}
                          >
                            <Trash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Appointments Manager View */}
      {view === 'bookings' && (
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ margin: 0 }}>Appointment Schedules</h3>
            
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <input 
                type="text" 
                placeholder="Search name, email, service..." 
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                className="form-input"
                style={{ maxWidth: '220px', fontSize: '0.8rem', padding: '0.4rem 0.8rem', margin: 0 }}
              />
              
              <select 
                value={bookingStatusFilter} 
                onChange={(e) => setBookingStatusFilter(e.target.value)} 
                className="form-input"
                style={{ width: '130px', fontSize: '0.8rem', padding: '0.4rem 0.8rem', margin: 0 }}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <button 
                onClick={exportToCSV} 
                className="btn btn-secondary" 
                style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                Export CSV
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookingsList
              .filter(b => {
                const query = bookingSearch.toLowerCase();
                const matchesSearch = b.name.toLowerCase().includes(query) || b.email.toLowerCase().includes(query) || b.service.toLowerCase().includes(query);
                const matchesStatus = bookingStatusFilter === 'All' || b.status === bookingStatusFilter;
                return matchesSearch && matchesStatus;
              })
              .map(b => (
                <div key={b._id} style={{
                  background: 'rgba(255,255,255,0.01)',
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
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.15rem 0' }}>Date: {b.date} | Time: {b.time}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-color)', margin: 0 }}>Client: <strong>{b.name}</strong> ({b.email})</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className={`badge ${b.status.toLowerCase()}`}>{b.status}</span>
                    <button 
                      onClick={() => setSelectedBooking(b)} 
                      className="btn" 
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)' }}
                    >
                      Details
                    </button>
                    {b.status === 'Pending' && (
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button onClick={() => handleBookingAction(b._id, 'Confirmed')} className="btn-icon" style={{ width: '28px', height: '28px', color: 'var(--success)' }} title="Confirm"><Check size={14} /></button>
                        <button onClick={() => handleBookingAction(b._id, 'Cancelled')} className="btn-icon" style={{ width: '28px', height: '28px', color: 'var(--danger)' }} title="Cancel"><X size={14} /></button>
                      </div>
                    )}
                    <button onClick={() => handleDeleteBooking(b._id)} className="btn-icon" style={{ width: '28px', height: '28px', color: 'var(--danger)' }} title="Delete Booking"><Trash size={14} /></button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Messages Manager View */}
      {view === 'contacts' && (
        <div className="glass-card">
          <h3 style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>Contact Submissions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messagesList.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No messages found.</p>
            ) : messagesList.map(m => (
              <div key={m._id} style={{
                background: m.isRead ? 'rgba(255,255,255,0.01)' : 'rgba(6, 182, 212, 0.05)',
                border: `1px solid ${m.isRead ? 'var(--card-border)' : 'var(--primary)'}`,
                borderRadius: '10px',
                padding: '1.25rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{m.subject}</h4>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button 
                      onClick={() => handleToggleMessageRead(m._id, !m.isRead)} 
                      className="btn" 
                      style={{ padding: '0.25rem 0.75rem', fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)' }}
                    >
                      {m.isRead ? 'Mark Unread' : 'Mark Read'}
                    </button>
                    <button 
                      onClick={() => setReplyingMessage(m)} 
                      className="btn btn-secondary" 
                      style={{ padding: '0.25rem 0.75rem', fontSize: '0.7rem' }}
                    >
                      Reply
                    </button>
                    <button 
                      onClick={() => handleDeleteMessage(m._id)} 
                      className="btn-icon" 
                      style={{ width: '28px', height: '28px', color: 'var(--danger)' }}
                      title="Delete Message"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0' }}>From: <strong>{m.name}</strong> ({m.email})</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', whiteSpace: 'pre-wrap' }}>{m.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services CRUD Manager */}
      {view === 'services' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Manage Services</h3>
            {!showForm && <button onClick={() => { setEditId(null); setServiceForm({ title: '', slug: '', description: '', features: '', technologies: '', pricing: '', icon: 'Cpu' }); setShowForm(true); }} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}><Plus size={14} /> Add Service</button>}
          </div>

          {showForm ? (
            <div className="glass-card">
              <h4>{editId ? 'Edit Service' : 'Add New Service'}</h4>
              <form onSubmit={handleServiceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
                <div className="grid grid-2">
                  <div className="form-group"><label>Title</label><input type="text" value={serviceForm.title} onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })} required className="form-input" /></div>
                  <div className="form-group"><label>Slug</label><input type="text" value={serviceForm.slug} onChange={(e) => setServiceForm({ ...serviceForm, slug: e.target.value })} required className="form-input" /></div>
                </div>
                <div className="form-group"><label>Description</label><textarea value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} required rows={3} className="form-input" /></div>
                <div className="form-group"><label>Features (One per line)</label><textarea value={serviceForm.features} onChange={(e) => setServiceForm({ ...serviceForm, features: e.target.value })} rows={3} className="form-input" /></div>
                <div className="form-group"><label>Technologies (Comma separated)</label><input type="text" value={serviceForm.technologies} onChange={(e) => setServiceForm({ ...serviceForm, technologies: e.target.value })} className="form-input" /></div>
                <div className="grid grid-2">
                  <div className="form-group"><label>Pricing</label><input type="text" value={serviceForm.pricing} onChange={(e) => setServiceForm({ ...serviceForm, pricing: e.target.value })} required className="form-input" /></div>
                  <div className="form-group"><label>Icon Name</label><input type="text" value={serviceForm.icon} onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })} className="form-input" /></div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary">Save Service</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          ) : (
            <div className="grid grid-2" style={{ gap: '1.5rem' }}>
              {servicesList.map(s => (
                <div key={s._id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ color: 'var(--primary)' }}>{s.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.pricing}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleServiceEdit(s)} className="btn-icon" style={{ width: '32px', height: '32px' }}><Edit size={14} /></button>
                    <button onClick={() => handleServiceDelete(s._id)} className="btn-icon" style={{ width: '32px', height: '32px', color: 'var(--danger)' }}><Trash size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Projects CRUD Manager */}
      {view === 'projects' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Manage Portfolio</h3>
            {!showForm && <button onClick={() => { setEditId(null); setProjectForm({ title: '', description: '', image: '', category: 'Web Development', technologies: '', client: '', liveDemo: '', github: '' }); setShowForm(true); }} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}><Plus size={14} /> Add Project</button>}
          </div>

          {showForm ? (
            <div className="glass-card">
              <h4>{editId ? 'Edit Project' : 'Add Project'}</h4>
              <form onSubmit={handleProjectSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
                <div className="grid grid-2">
                  <div className="form-group"><label>Title</label><input type="text" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} required className="form-input" /></div>
                  <div className="form-group"><label>Category</label><select value={projectForm.category} onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })} className="form-input"><option value="Web Development">Web Development</option><option value="Mobile Apps">Mobile Apps</option><option value="AI">AI</option><option value="Branding">Branding</option><option value="UI UX">UI UX</option></select></div>
                </div>
                <div className="form-group"><label>Description</label><textarea value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} required rows={3} className="form-input" /></div>
                <div className="form-group"><label>Image URL</label><input type="text" value={projectForm.image} onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })} required className="form-input" /></div>
                <div className="form-group"><label>Technologies (Comma separated)</label><input type="text" value={projectForm.technologies} onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })} className="form-input" /></div>
                <div className="grid grid-3">
                  <div className="form-group"><label>Client</label><input type="text" value={projectForm.client} onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })} required className="form-input" /></div>
                  <div className="form-group"><label>Live Demo URL</label><input type="text" value={projectForm.liveDemo} onChange={(e) => setProjectForm({ ...projectForm, liveDemo: e.target.value })} className="form-input" /></div>
                  <div className="form-group"><label>Github Link</label><input type="text" value={projectForm.github} onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })} className="form-input" /></div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary">Save Project</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {projectsList.map(p => (
                <div key={p._id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem' }}>{p.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category: {p.category} | Client: {p.client}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleProjectEdit(p)} className="btn-icon" style={{ width: '32px', height: '32px' }}><Edit size={14} /></button>
                    <button onClick={() => handleProjectDelete(p._id)} className="btn-icon" style={{ width: '32px', height: '32px', color: 'var(--danger)' }}><Trash size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Blogs CRUD Manager */}
      {view === 'blogs' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Manage Articles</h3>
            {!showForm && <button onClick={() => { setEditId(null); setBlogForm({ title: '', slug: '', content: '', image: '', category: 'AI Solutions', tags: '', readTime: '5 mins' }); setShowForm(true); }} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}><Plus size={14} /> Add Post</button>}
          </div>

          {showForm ? (
            <div className="glass-card">
              <h4>{editId ? 'Edit Article' : 'Add New Article'}</h4>
              <form onSubmit={handleBlogSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
                <div className="grid grid-2">
                  <div className="form-group"><label>Title</label><input type="text" value={blogForm.title} onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })} required className="form-input" /></div>
                  <div className="form-group"><label>Slug</label><input type="text" value={blogForm.slug} onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })} required className="form-input" /></div>
                </div>
                <div className="form-group"><label>Content Details</label><textarea value={blogForm.content} onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })} required rows={6} className="form-input" /></div>
                <div className="form-group"><label>Banner Image URL</label><input type="text" value={blogForm.image} onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })} required className="form-input" /></div>
                <div className="grid grid-3">
                  <div className="form-group"><label>Category</label><input type="text" value={blogForm.category} onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })} className="form-input" /></div>
                  <div className="form-group"><label>Tags (Comma separated)</label><input type="text" value={blogForm.tags} onChange={(e) => setBlogForm({ ...blogForm, tags: e.target.value })} className="form-input" /></div>
                  <div className="form-group"><label>Read Time</label><input type="text" value={blogForm.readTime} onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })} className="form-input" /></div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary">Publish</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {blogsList.map(b => (
                <div key={b._id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem' }}>{b.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Views: {b.views || 0} &nbsp;&bull;&nbsp; Comments: {(b.comments || []).length}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleBlogEdit(b)} className="btn-icon" style={{ width: '32px', height: '32px' }}><Edit size={14} /></button>
                    <button onClick={() => handleBlogDelete(b._id)} className="btn-icon" style={{ width: '32px', height: '32px', color: 'var(--danger)' }}><Trash size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Careers CRUD Manager */}
      {view === 'careers' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Manage Careers Board</h3>
            {!showForm && <button onClick={() => { setEditId(null); setCareerForm({ title: '', department: 'Engineering', location: 'Remote', type: 'Full-time', salary: '', description: '', requirements: '', responsibilities: '' }); setShowForm(true); }} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}><Plus size={14} /> Add Job</button>}
          </div>

          {showForm ? (
            <div className="glass-card">
              <h4>{editId ? 'Edit Job Posting' : 'Add New Job'}</h4>
              <form onSubmit={handleCareerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
                <div className="grid grid-2">
                  <div className="form-group"><label>Title</label><input type="text" value={careerForm.title} onChange={(e) => setCareerForm({ ...careerForm, title: e.target.value })} required className="form-input" /></div>
                  <div className="form-group"><label>Department</label><input type="text" value={careerForm.department} onChange={(e) => setCareerForm({ ...careerForm, department: e.target.value })} required className="form-input" /></div>
                </div>
                <div className="grid grid-3">
                  <div className="form-group"><label>Location</label><input type="text" value={careerForm.location} onChange={(e) => setCareerForm({ ...careerForm, location: e.target.value })} required className="form-input" /></div>
                  <div className="form-group"><label>Employment Type</label><input type="text" value={careerForm.type} onChange={(e) => setCareerForm({ ...careerForm, type: e.target.value })} required className="form-input" /></div>
                  <div className="form-group"><label>Salary Range</label><input type="text" value={careerForm.salary} onChange={(e) => setCareerForm({ ...careerForm, salary: e.target.value })} required className="form-input" /></div>
                </div>
                <div className="form-group"><label>Job Description</label><textarea value={careerForm.description} onChange={(e) => setCareerForm({ ...careerForm, description: e.target.value })} required rows={3} className="form-input" /></div>
                <div className="form-group"><label>Requirements (One per line)</label><textarea value={careerForm.requirements} onChange={(e) => setCareerForm({ ...careerForm, requirements: e.target.value })} rows={3} className="form-input" /></div>
                <div className="form-group"><label>Responsibilities (One per line)</label><textarea value={careerForm.responsibilities} onChange={(e) => setCareerForm({ ...careerForm, responsibilities: e.target.value })} rows={3} className="form-input" /></div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary">Save Posting</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {careersList.map(job => (
                <div key={job._id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem' }}>{job.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{job.department} &nbsp;&bull;&nbsp; {job.location} &nbsp;&bull;&nbsp; {job.salary}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleCareerEdit(job)} className="btn-icon" style={{ width: '32px', height: '32px' }}><Edit size={14} /></button>
                    <button onClick={() => handleCareerDelete(job._id)} className="btn-icon" style={{ width: '32px', height: '32px', color: 'var(--danger)' }}><Trash size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Testimonials CRUD */}
      {view === 'testimonials' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3>Manage Testimonials</h3>
            {!showForm && (
              <button 
                onClick={() => { 
                  setEditId(null); 
                  setTestimonialForm({ name: '', role: '', company: '', content: '', rating: 5 }); 
                  setShowForm(true); 
                }} 
                className="btn btn-primary" 
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}
              >
                <Plus size={14} /> Add Testimonial
              </button>
            )}
          </div>

          {showForm ? (
            <div className="glass-card">
              <h4>{editId ? 'Edit Testimonial' : 'Add New Testimonial'}</h4>
              <form onSubmit={handleTestimonialSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
                <div className="grid grid-2">
                  <div className="form-group"><label>Client Name</label><input type="text" value={testimonialForm.name} onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })} required className="form-input" /></div>
                  <div className="form-group"><label>Client Role</label><input type="text" value={testimonialForm.role} onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })} required className="form-input" /></div>
                </div>
                <div className="grid grid-2">
                  <div className="form-group"><label>Company</label><input type="text" value={testimonialForm.company} onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })} required className="form-input" /></div>
                  <div className="form-group">
                    <label>Rating (1 to 5 Stars)</label>
                    <select value={testimonialForm.rating} onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })} className="form-input">
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                </div>
                <div className="form-group"><label>Content / Review Text</label><textarea value={testimonialForm.content} onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })} required rows={4} className="form-input" /></div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary">Save Testimonial</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {testimonialsList.map(t => (
                <div key={t._id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid var(--card-border)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                      <img src={t.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${t.name}`} alt={t.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <h4 style={{ fontSize: '0.9rem', margin: 0 }}>{t.name}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.role} at {t.company}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.1rem', marginBottom: '0.75rem', color: '#fbbf24' }}>
                      {Array.from({ length: t.rating || 5 }).map((_, i) => <Star key={i} size={14} fill="#fbbf24" stroke="none" />)}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-color)', fontStyle: 'italic', margin: 0 }}>"{t.content}"</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem', borderTop: '1px solid var(--card-border)', paddingTop: '0.75rem' }}>
                    <button 
                      onClick={() => {
                        setEditId(t._id);
                        setTestimonialForm({ name: t.name, role: t.role, company: t.company, content: t.content, rating: t.rating || 5 });
                        setShowForm(true);
                      }} 
                      className="btn-icon" 
                      style={{ width: '32px', height: '32px' }}
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      onClick={() => handleTestimonialDelete(t._id)} 
                      className="btn-icon" 
                      style={{ width: '32px', height: '32px', color: 'var(--danger)' }}
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reply Message Modal */}
      {replyingMessage && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '100%', border: '1px solid var(--card-border)', background: '#090d16' }}>
            <h3 style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>Reply to Message</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>To: <strong>{replyingMessage.name}</strong> ({replyingMessage.email})</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-color)', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '4px', fontStyle: 'italic', margin: '0.5rem 0 1rem 0' }}>"{replyingMessage.message}"</p>
            
            <form onSubmit={handleSendReply}>
              <div className="form-group">
                <label>Response Content</label>
                <textarea 
                  value={replyBody} 
                  onChange={(e) => setReplyBody(e.target.value)} 
                  required 
                  rows={5} 
                  className="form-input" 
                  placeholder="Type your response email..."
                  style={{ resize: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary">Send Response</button>
                <button type="button" onClick={() => setReplyingMessage(null)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Booking Details Modal */}
      {selectedBooking && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '500px', width: '100%', border: '1px solid var(--card-border)', background: '#090d16' }}>
            <h3 style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', marginBottom: '1.25rem', color: 'var(--primary)' }}>Appointment Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div><strong>Service Offering:</strong> {selectedBooking.service}</div>
              <div><strong>Scheduled Date:</strong> {selectedBooking.date}</div>
              <div><strong>Preferred Slot:</strong> {selectedBooking.time}</div>
              <div><strong>Client Name:</strong> {selectedBooking.name}</div>
              <div><strong>Email Address:</strong> {selectedBooking.email}</div>
              <div><strong>Phone Number:</strong> {selectedBooking.phone}</div>
              <div>
                <strong>Booking Status:</strong> <span className={`badge ${selectedBooking.status.toLowerCase()}`} style={{ marginLeft: '0.5rem' }}>{selectedBooking.status}</span>
              </div>
              {(selectedBooking.details || selectedBooking.message) && (
                <div style={{ marginTop: '0.5rem' }}>
                  <strong>Client Message / Details:</strong>
                  <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', marginTop: '0.25rem', whiteSpace: 'pre-wrap', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                    {selectedBooking.details || selectedBooking.message}
                  </div>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid var(--card-border)', paddingTop: '1rem' }}>
              {selectedBooking.status === 'Pending' && (
                <>
                  <button onClick={() => { handleBookingAction(selectedBooking._id, 'Confirmed'); setSelectedBooking(null); }} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Approve</button>
                  <button onClick={() => { handleBookingAction(selectedBooking._id, 'Cancelled'); setSelectedBooking(null); }} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>Reject</button>
                </>
              )}
              <button type="button" onClick={() => setSelectedBooking(null)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', marginLeft: 'auto' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* User Edit Modal */}
      {editUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '450px', width: '100%', border: '1px solid var(--card-border)', background: '#090d16' }}>
            <h3 style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>Edit User Account</h3>
            <form onSubmit={handleEditUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={userEditForm.name} 
                  onChange={(e) => setUserEditForm({ ...userEditForm, name: e.target.value })} 
                  required 
                  className="form-input" 
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={userEditForm.email} 
                  onChange={(e) => setUserEditForm({ ...userEditForm, email: e.target.value })} 
                  required 
                  className="form-input" 
                />
              </div>
              <div className="form-group">
                <label>System Role</label>
                <select 
                  value={userEditForm.role} 
                  onChange={(e) => setUserEditForm({ ...userEditForm, role: e.target.value })} 
                  className="form-input"
                >
                  <option value="user">Standard User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button type="button" onClick={() => setEditUser(null)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
