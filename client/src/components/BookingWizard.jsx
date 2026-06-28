import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Calendar, Clock, Clipboard, ArrowRight, ArrowLeft, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const BookingWizard = ({ isOpen, onClose, onBookingSuccess }) => {
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [service, setService] = useState('Website Development');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');

  // Check if there's a cached estimate in session storage
  useEffect(() => {
    if (isOpen) {
      const cachedService = sessionStorage.getItem('estimated_service');
      const cachedCost = sessionStorage.getItem('estimated_cost');
      const cachedDetails = sessionStorage.getItem('estimated_details');

      if (cachedService) {
        setService(cachedService);
        setDetails(`Cost Estimate: ${cachedCost}\nEstimation details: ${cachedDetails}`);
        
        // Clear them so we don't repeat next time unless they run calculator again
        sessionStorage.removeItem('estimated_service');
        sessionStorage.removeItem('estimated_cost');
        sessionStorage.removeItem('estimated_details');
      }

      // Prepopulate profile details if token user exists
      const storedUser = localStorage.getItem('novasphere_token');
      if (storedUser) {
        api.get('/auth/me')
          .then(data => {
            if (data.success) {
              setName(data.user.name);
              setEmail(data.user.email);
            }
          })
          .catch(() => {});
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

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

  const handleSubmit = async () => {
    if (!name || !email || !phone || !date || !time) {
      showToast('Please complete all contact and scheduling details.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const data = await api.post('/bookings', {
        service,
        date,
        time,
        name,
        email,
        phone,
        details
      });

      if (data.success) {
        showToast('Appointment booked successfully!', 'success');
        
        // Trigger celebratory confetti!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#6366f1', '#ec4899']
        });

        onBookingSuccess();
        onClose();
        resetForm();
      }
    } catch (err) {
      showToast(err.message || 'Booking submission failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setDate('');
    setTime('10:00');
    setPhone('');
    setDetails('');
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(5, 8, 16, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1500,
      padding: '1.5rem'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '550px',
        padding: '2.5rem',
        border: '1px solid rgba(var(--primary-rgb), 0.25)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Book Consultation <Sparkles size={16} className="toast-info-icon" style={{ color: 'var(--primary)' }} />
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Step {step} of 3 - {step === 1 ? 'Configure Service' : step === 2 ? 'Select Schedule' : 'Contact Details'}</p>
        </div>

        {/* Step 1: Configure Service */}
        {step === 1 && (
          <div>
            <div className="form-group">
              <label><Clipboard size={14} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} /> Select Service Option</label>
              <select 
                value={service} 
                onChange={(e) => setService(e.target.value)} 
                className="form-input"
              >
                {servicesList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            
            <div className="form-group">
              <label>Special Instructions / Project Notes</label>
              <textarea 
                value={details} 
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Mention any custom specifications, integrations, or calculator pricing totals here..."
                rows={4}
                className="form-input"
                style={{ resize: 'none' }}
              />
            </div>

            <button onClick={nextStep} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Continue Setup <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Select Schedule */}
        {step === 2 && (
          <div>
            <div className="form-group">
              <label><Calendar size={14} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} /> Pick Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]} // Block past dates
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label><Clock size={14} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} /> Available Time Slot</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {timeSlots.map(t => (
                  <button 
                    key={t}
                    onClick={() => setTime(t)}
                    type="button"
                    style={{
                      padding: '0.5rem',
                      borderRadius: '8px',
                      background: time === t ? 'var(--primary)' : 'rgba(255,255,255,0.02)',
                      color: time === t ? 'var(--text-inverse)' : 'var(--text-color)',
                      border: `1px solid ${time === t ? 'var(--primary)' : 'var(--card-border)'}`,
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2.25rem' }}>
              <button onClick={prevStep} className="btn btn-secondary" style={{ flex: 1 }}>
                <ArrowLeft size={16} /> Back
              </button>
              <button onClick={nextStep} disabled={!date} className="btn btn-primary" style={{ flex: 1 }}>
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Contact details & submit */}
        {step === 3 && (
          <div>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name" 
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com" 
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000" 
                className="form-input"
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button onClick={prevStep} className="btn btn-secondary" style={{ flex: 1 }}>
                <ArrowLeft size={16} /> Back
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={loading} 
                className="btn btn-primary" 
                style={{ flex: 2 }}
              >
                {loading ? <span className="spinner" style={{ width: '16px', height: '16px' }}></span> : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingWizard;
