import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import CostCalculator from '../components/CostCalculator';
import BookingWizard from '../components/BookingWizard';
import { Cpu, Globe, Smartphone, Shield, Cloud, BarChart, Search, Layers, Code, ShoppingBag, ArrowRight, HelpCircle, Check, BookOpen, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const { user, toggleSaveService } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/services')
      .then(d => {
        if (d.success) {
          setServices(d.services);
        }
      })
      .catch(err => {
        console.error('Failed to load services:', err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'Globe': return <Globe size={24} />;
      case 'Smartphone': return <Smartphone size={24} />;
      case 'Cpu': return <Cpu size={24} />;
      case 'Cloud': return <Cloud size={24} />;
      case 'Shield': return <Shield size={24} />;
      case 'BarChart': return <BarChart size={24} />;
      case 'Search': return <Search size={24} />;
      case 'Layers': return <Layers size={24} />;
      case 'Code': return <Code size={24} />;
      case 'ShoppingBag': return <ShoppingBag size={24} />;
      default: return <Cpu size={24} />;
    }
  };

  const handleBookService = (serviceTitle) => {
    if (!user) {
      showToast('Please sign in to schedule a service consultation.', 'warning');
      navigate('/login?redirect=services');
      return;
    }
    setSelectedService(serviceTitle);
    setBookingOpen(true);
  };

  const handleToggleSaveService = async (serviceId, title) => {
    try {
      await toggleSaveService(serviceId);
      const isSaved = (user.savedServices || []).includes(serviceId);
      showToast(
        !isSaved ? `Saved "${title}" to your favorites!` : `Removed "${title}" from favorites`,
        'success'
      );
    } catch (err) {
      showToast('Action failed', 'error');
    }
  };

  // FAQ Accordion local state
  const [faqOpen, setFaqOpen] = useState({
    q1: false, q2: false, q3: false, q4: false
  });

  const toggleFaq = (key) => {
    setFaqOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="section">
      <div className="container">
        
        {/* Title Section */}
        <div className="text-center" style={{ marginBottom: '5rem' }}>
          <div className="badge">Services & Solutions</div>
          <h2 style={{ fontSize: '2.5rem', marginTop: '1rem', marginBottom: '1.25rem' }}>Innovative Tech stack Solutions</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto' }}>
            We design, compile, and execute enterprise-grade systems utilizing state-of-the-art architectures.
          </p>
        </div>

        {/* Services List Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '3rem 0' }}>
            <span className="spinner"></span>
          </div>
        ) : (
          <div className="grid grid-2" style={{ gap: '2.5rem', marginBottom: '6rem' }}>
            {services.map(s => (
              <div key={s._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', justifyContent: 'space-between', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      background: 'rgba(6, 182, 212, 0.12)',
                      color: 'var(--primary)',
                      width: '48px',
                      height: '48px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {getIconComponent(s.icon)}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{s.title}</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>{s.pricing}</span>
                    </div>
                  </div>

                  {user && (
                    <button 
                      onClick={() => handleToggleSaveService(s._id, s.title)} 
                      className="btn-icon" 
                      title="Favorite Service"
                      style={{ color: (user.savedServices || []).includes(s._id) ? 'var(--danger)' : 'var(--text-muted)' }}
                    >
                      <Heart size={16} fill={(user.savedServices || []).includes(s._id) ? 'currentColor' : 'none'} />
                    </button>
                  )}
                </div>

                {/* Description */}
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem', flex: 1 }}>{s.description}</p>

                {/* Features Checklist */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key Deliverables</h4>
                  <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {s.features.map((feat, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Check size={12} style={{ color: 'var(--success)' }} /> {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack */}
                <div style={{ marginBottom: '2rem', borderTop: '1px solid var(--card-border)', paddingTop: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-color)', display: 'block', marginBottom: '0.5rem' }}>Technologies Used:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {s.technologies.map(tech => (
                      <span key={tech} className="badge" style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', color: 'var(--text-color)' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button 
                  onClick={() => handleBookService(s.title)}
                  className="btn btn-primary" 
                  style={{ width: '100%', marginTop: 'auto' }}
                >
                  Book Consult <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pricing Cost Calculator wrapper */}
        <div style={{ marginBottom: '6rem' }}>
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Pricing Estimator</h2>
            <p style={{ color: 'var(--text-muted)' }}>Calculate mock timelines and budgets for custom software requirements.</p>
          </div>
          <CostCalculator />
        </div>

        {/* Comparison Table */}
        <div style={{ marginBottom: '6rem' }}>
          <div className="text-center" style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Service Tier Comparison</h2>
            <p style={{ color: 'var(--text-muted)' }}>Compare standard deliverables, support SLAs, and development terms across tiers.</p>
          </div>

          <div className="glass-card" style={{ overflowX: 'auto', padding: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <th style={{ padding: '1rem', fontWeight: 600 }}>Feature Offering</th>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--primary)' }}>Standard Startup</th>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--secondary)' }}>Professional Scale</th>
                  <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--success)' }}>Enterprise Elite</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>Initial Cost Estimations</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>Base Price</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>1.5x Scaling Value</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>2.2x Scale Multiplier</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>Development Timelines</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>6 - 8 Weeks</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>4 - 6 Weeks (Priority)</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>Custom Sprint Plan</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>Support & SLA Agreements</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>Email Only (48h)</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>24/7 Slack Portal (12h)</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>Dedicated Lead Support (2h SLA)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>Docker & DevOps Support</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>Optional Add-on</td>
                  <td style={{ padding: '1rem', color: 'var(--success)' }}>Included</td>
                  <td style={{ padding: '1rem', color: 'var(--success)' }}>Included (Failovers)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>AI Integrations</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>Basic REST Prompts</td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>Fine-tuning Pipeline</td>
                  <td style={{ padding: '1rem', color: 'var(--success)' }}>Retrieval-Augmented Agents</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs */}
        <div>
          <div className="text-center" style={{ marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Frequently Asked Questions</h2>
            <p style={{ color: 'var(--text-muted)' }}>Everything you need to know about our collaboration model.</p>
          </div>

          <div style={{ maxWidth: '750px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="glass-card" style={{ padding: '1.25rem 1.75rem', cursor: 'pointer' }} onClick={() => toggleFaq('q1')}>
              <h4 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem' }}>
                How does the project pricing calculator calculate estimates?
                <HelpCircle size={16} style={{ color: 'var(--primary)' }} />
              </h4>
              {faqOpen.q1 && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.75rem', borderTop: '1px solid var(--card-border)', paddingTop: '0.75rem' }}>
                  Our calculator aggregates values based on a service base price, scales it using your company multiplier (startup vs enterprise), adjusts for delivery rush, and adds individual feature costs (SEO, admin CMS dashboards).
                </p>
              )}
            </div>

            <div className="glass-card" style={{ padding: '1.25rem 1.75rem', cursor: 'pointer' }} onClick={() => toggleFaq('q2')}>
              <h4 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem' }}>
                Can you integrate custom AI models into legacy platforms?
                <HelpCircle size={16} style={{ color: 'var(--primary)' }} />
              </h4>
              {faqOpen.q2 && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.75rem', borderTop: '1px solid var(--card-border)', paddingTop: '0.75rem' }}>
                  Yes! We build RESTful API bridges and microservice middleware layers that hook models (like fine-tuned LLaMA or OpenAI systems) directly to older databases, ERP systems, or portals without data loss.
                </p>
              )}
            </div>

            <div className="glass-card" style={{ padding: '1.25rem 1.75rem', cursor: 'pointer' }} onClick={() => toggleFaq('q3')}>
              <h4 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem' }}>
                What are your security auditing policies?
                <HelpCircle size={16} style={{ color: 'var(--primary)' }} />
              </h4>
              {faqOpen.q3 && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.75rem', borderTop: '1px solid var(--card-border)', paddingTop: '0.75rem' }}>
                  We apply OWASP security benchmarks, Wireshark packet audits, and simulated penetrative network attacks to map firewall breaches and secure data endpoints prior to system deployments.
                </p>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Appointment Booking Wizard Modal */}
      <BookingWizard 
        isOpen={bookingOpen} 
        onClose={() => setBookingOpen(false)} 
        onBookingSuccess={() => {}} 
      />
    </div>
  );
};

export default Services;
