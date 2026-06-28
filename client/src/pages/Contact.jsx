import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Mail, Phone, MapPin, Clock, Send, Globe, ShieldAlert } from 'lucide-react';

const Contact = () => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Map Canvas Ref
  const canvasRef = useRef(null);

  useEffect(() => {
    // Draw a high-tech custom interactive SVG/Canvas style map of Tech City HQ
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let pulseRadius = 5;
    let pulseDirection = 1;

    const drawMap = () => {
      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Grid Lines (Tech Theme)
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Mock Roads / Sectors
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      // Main street
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      // Cross street
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();

      // Pinging HQ Dot
      const hqX = canvas.width / 2;
      const hqY = canvas.height / 2;

      // Pulse circle
      ctx.beginPath();
      ctx.arc(hqX, hqY, pulseRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Core HQ Dot
      ctx.beginPath();
      ctx.arc(hqX, hqY, 6, 0, Math.PI * 2);
      ctx.fillStyle = 'var(--primary)';
      ctx.shadowColor = 'var(--primary)';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0; // Reset

      // HQ label
      ctx.fillStyle = 'var(--text-color)';
      ctx.font = 'bold 12px var(--font-title)';
      ctx.textAlign = 'center';
      ctx.fillText('NovaSphere HQ', hqX, hqY - 14);

      // Animate pulse
      pulseRadius += 0.3 * pulseDirection;
      if (pulseRadius > 22) pulseRadius = 5;

      animationId = requestAnimationFrame(drawMap);
    };

    drawMap();
    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      showToast('Please fill out all contact fields.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const data = await api.post('/contact', {
        name,
        email,
        subject,
        message
      });

      if (data.success) {
        showToast(data.message, 'success');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      }
    } catch (err) {
      showToast(err.message || 'Message delivery failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="container">
        
        {/* Header */}
        <div className="text-center" style={{ marginBottom: '5rem' }}>
          <div className="badge">Contact Us</div>
          <h2 style={{ fontSize: '2.5rem', marginTop: '1rem', marginBottom: '1.25rem' }}>Start Your Scaling Sprint Today</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Get in touch to align on timelines, requirements, and tech stacks.
          </p>
        </div>

        {/* Contact Layout Grid */}
        <div className="grid grid-2" style={{ gap: '3rem', marginBottom: '5rem' }}>
          
          {/* Left Form */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.35rem', marginBottom: '1.75rem' }}>Send Message</h3>
            <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Your Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required
                  placeholder="Enter name"
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
                  placeholder="name@company.com"
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Subject</label>
                <input 
                  type="text" 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)} 
                  required
                  placeholder="How can we help?"
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Message Details</label>
                <textarea 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  required
                  placeholder="Outline your project scope, technologies required, and desired deadlines..."
                  rows={5}
                  className="form-input"
                  style={{ resize: 'none' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="btn btn-primary" 
                style={{ width: 'fit-content', padding: '0.75rem 2.25rem' }}
              >
                {loading ? <span className="spinner" style={{ width: '16px', height: '16px' }}></span> : <><Send size={14} /> Send Message</>}
              </button>
            </form>
          </div>

          {/* Right Info & Interactive Map */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="glass-card">
              <h3 style={{ fontSize: '1.35rem', marginBottom: '1.5rem' }}>Information Directory</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <MapPin size={18} style={{ color: 'var(--primary)' }} />
                  <div>
                    <p style={{ fontWeight: 600 }}>Physical Address</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>100 Innovation Way, Suite 400, Tech City</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Phone size={18} style={{ color: 'var(--primary)' }} />
                  <div>
                    <p style={{ fontWeight: 600 }}>Telephone Contact</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>+1 (800) 555-0199 (Mon - Fri)</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Mail size={18} style={{ color: 'var(--primary)' }} />
                  <div>
                    <p style={{ fontWeight: 600 }}>Support Email</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>hello@novasphere.com</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Clock size={18} style={{ color: 'var(--primary)' }} />
                  <div>
                    <p style={{ fontWeight: 600 }}>Business Hours</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Canvas Interactive Mock Map */}
            <div className="glass-card" style={{ padding: 0, height: '220px', overflow: 'hidden', border: '1px dashed var(--primary)' }}>
              <canvas 
                ref={canvasRef} 
                width={500} 
                height={220} 
                style={{ width: '100%', height: '100%', display: 'block', background: 'rgba(5, 8, 16, 0.4)' }}
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
