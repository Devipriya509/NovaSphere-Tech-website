import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Clipboard, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const Book = () => {
  const { user, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [service, setService] = useState('Website Development');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Check if redirect estimation cache is present in sessionStorage
    const cachedService = sessionStorage.getItem('estimated_service');
    const cachedCost = sessionStorage.getItem('estimated_cost');
    const cachedDetails = sessionStorage.getItem('estimated_details');

    if (cachedService) {
      setService(cachedService);
      setMessage(`Cost Estimate: ${cachedCost}\nEstimation details: ${cachedDetails}`);
      
      // Clear cache
      sessionStorage.removeItem('estimated_service');
      sessionStorage.removeItem('estimated_cost');
      sessionStorage.removeItem('estimated_details');
    }

    if (!loading && !user) {
      showToast('Please sign in to schedule an appointment.', 'warning');
      navigate('/login?redirect=book');
    }

    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user, loading, navigate]);

  const servicesList = [
    'Website Development',
    'Mobile App Development',
    'AI Solutions',
    'Cloud Computing',
    'Cybersecurity Services',
    'Digital Marketing',
    'SEO Optimization',
    'UI UX Design',
    'Software Development',
    'E-Commerce Solutions'
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !date || !time) {
      showToast('Please complete all contact and scheduling details.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const data = await api.post('/bookings', {
        service,
        date,
        time,
        name,
        email,
        phone,
        message
      });

      if (data.success) {
        showToast('Appointment booked successfully!', 'success');
        
        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#6366f1', '#ec4899']
        });

        navigate('/dashboard');
      }
    } catch (err) {
      showToast(err.message || 'Booking submission failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="spinner"></span>
      </div>
    );
  }

  return (
    <div className="section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="sphere" style={{ top: '15%', left: '15%' }}></div>
      <div className="container" style={{ maxWidth: '600px', position: 'relative', zIndex: 1 }}>
        <div className="glass-card" style={{ border: '1px solid rgba(var(--primary-rgb), 0.25)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1.25rem' }}>
            <div className="badge" style={{ marginBottom: '0.5rem' }}>Scheduler</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              Book an Appointment <Sparkles size={18} style={{ color: 'var(--primary)' }} />
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Schedule a discovery sprint with our engineering solutions team.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Step 1: Service */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label><Clipboard size={12} style={{ marginRight: '0.25rem' }} /> Service Offering</label>
              <select 
                value={service} 
                onChange={(e) => setService(e.target.value)} 
                className="form-input"
              >
                {servicesList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Step 2: Date & Time */}
            <div className="grid grid-2" style={{ gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label><Calendar size={12} style={{ marginRight: '0.25rem' }} /> Preferred Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label><Clock size={12} style={{ marginRight: '0.25rem' }} /> Preferred Time Slot</label>
                <select 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)}
                  className="form-input"
                >
                  {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Step 3: Contact */}
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

            <div className="grid grid-2" style={{ gap: '1rem' }}>
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
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+1 (555) 000-0000"
                  className="form-input"
                />
              </div>
            </div>

            {/* Step 4: Message */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Details / Message</label>
              <textarea 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Briefly describe your project requirements..."
                rows={4}
                className="form-input"
                style={{ resize: 'none' }}
              />
            </div>

            <button 
              type="submit" 
              disabled={submitting} 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {submitting ? <span className="spinner" style={{ width: '16px', height: '16px' }}></span> : <><Send size={16} /> Submit Booking Request</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Book;
