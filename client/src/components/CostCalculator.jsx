import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const CostCalculator = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [service, setService] = useState('web-dev');
  const [scale, setScale] = useState('medium');
  const [urgency, setUrgency] = useState('standard');
  
  // Extra options checkboxes
  const [addons, setAddons] = useState({
    seo: false,
    adminPanel: false,
    darkMode: false,
    maintenance: false
  });

  const [price, setPrice] = useState({ min: 0, max: 0 });
  const [weeks, setWeeks] = useState(0);

  // Bases
  const servicesBase = {
    'web-dev': { base: 2500, weeks: 6 },
    'mobile-app': { base: 6000, weeks: 10 },
    'ai-sol': { base: 10000, weeks: 14 },
    'cybersec': { base: 4000, weeks: 8 },
    'cloud': { base: 4500, weeks: 8 }
  };

  const scaleMultiplier = {
    small: 1.0,
    medium: 1.4,
    enterprise: 2.0
  };

  const urgencyMultiplier = {
    relaxed: 0.9,
    standard: 1.0,
    rush: 1.3
  };

  useEffect(() => {
    const activeService = servicesBase[service];
    let minBase = activeService.base;
    let baseWeeks = activeService.weeks;

    // Scale
    minBase *= scaleMultiplier[scale];

    // Urgency
    minBase *= urgencyMultiplier[urgency];
    
    // Weeks adjustment
    if (urgency === 'relaxed') baseWeeks = Math.ceil(baseWeeks * 1.3);
    if (urgency === 'rush') baseWeeks = Math.ceil(baseWeeks * 0.7);

    // Addons
    let addonCost = 0;
    if (addons.seo) addonCost += 800;
    if (addons.adminPanel) addonCost += 1500;
    if (addons.darkMode) addonCost += 500;
    if (addons.maintenance) addonCost += 2000;

    const finalMin = Math.round(minBase + addonCost);
    const finalMax = Math.round(finalMin * 1.2);

    setPrice({ min: finalMin, max: finalMax });
    setWeeks(baseWeeks);
  }, [service, scale, urgency, addons]);

  const handleAddonChange = (key) => {
    setAddons(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleBook = () => {
    if (!user) {
      showToast('Please register or sign in to book your estimated project.', 'warning');
      navigate('/login?redirect=services');
      return;
    }
    // Store estimation in sessionStorage so we can prepopulate booking form
    const serviceNameMap = {
      'web-dev': 'Website Development',
      'mobile-app': 'Mobile App Development',
      'ai-sol': 'AI Solutions',
      'cybersec': 'Cybersecurity Services',
      'cloud': 'Cloud Computing'
    };
    sessionStorage.setItem('estimated_service', serviceNameMap[service]);
    sessionStorage.setItem('estimated_cost', `$${price.min} - $${price.max}`);
    sessionStorage.setItem('estimated_details', `Scale: ${scale}, Urgency: ${urgency}, Addons: ${Object.keys(addons).filter(k => addons[k]).join(', ') || 'None'}`);
    
    showToast('Cost estimation saved! Directing you to dashboard booking.', 'success');
    navigate('/dashboard');
  };

  return (
    <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', border: '1px solid rgba(var(--primary-rgb), 0.25)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
        <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '0.5rem', borderRadius: '8px', color: 'var(--primary)' }}>
          <Calculator size={22} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Project Cost Calculator</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Get an instant, reliable range estimate for your custom IT requirements.</p>
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: '1.5rem' }}>
        {/* Left Form Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>Select Service Category</label>
            <select 
              value={service} 
              onChange={(e) => setService(e.target.value)}
              className="form-input"
            >
              <option value="web-dev">Website Development</option>
              <option value="mobile-app">Mobile App Development</option>
              <option value="ai-sol">AI Solutions & LLMs</option>
              <option value="cybersec">Cybersecurity Services</option>
              <option value="cloud">Cloud Computing & Scaling</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>Project Scale / Business Size</label>
            <select 
              value={scale} 
              onChange={(e) => setScale(e.target.value)}
              className="form-input"
            >
              <option value="small">Small Business / Startup</option>
              <option value="medium">Medium Size Organization</option>
              <option value="enterprise">Large Enterprise Tier</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>Timeline Speed</label>
            <select 
              value={urgency} 
              onChange={(e) => setUrgency(e.target.value)}
              className="form-input"
            >
              <option value="relaxed">Relaxed Timeline (+30% duration, cheaper)</option>
              <option value="standard">Standard Business Schedule</option>
              <option value="rush">Express / Rush Delivery (Surcharge applies)</option>
            </select>
          </div>
        </div>

        {/* Right Addons Checkboxes */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem' }}>Include Extra Features</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={addons.seo} onChange={() => handleAddonChange('seo')} />
              Advanced SEO Optimization (+$800)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={addons.adminPanel} onChange={() => handleAddonChange('adminPanel')} />
              CMS Admin Control Dashboard (+$1,500)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={addons.darkMode} onChange={() => handleAddonChange('darkMode')} />
              Premium Dark/Light Toggling (+$500)
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={addons.maintenance} onChange={() => handleAddonChange('maintenance')} />
              1 Year SLA & Support (+$2,000)
            </label>
          </div>
        </div>
      </div>

      {/* Result Display Box */}
      <div className="calculator-box" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Estimated Project Valuation</p>
        <h2 style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 800, marginBottom: '0.25rem' }}>
          ${price.min.toLocaleString()} - ${price.max.toLocaleString()}
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Delivery Timeline: Approximately <strong>{weeks} Weeks</strong>
        </p>
        
        <button onClick={handleBook} className="btn btn-primary" style={{ width: '100%' }}>
          Book Appointment with this Estimate <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default CostCalculator;
