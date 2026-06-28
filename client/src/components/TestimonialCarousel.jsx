import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const TestimonialCarousel = ({ items = [] }) => {
  const [current, setCurrent] = useState(0);

  // Fallback defaults if database isn't seeded yet
  const defaults = [
    {
      name: 'Elena Rostova',
      role: 'VP of Product',
      company: 'OmniGlobal',
      content: 'NovaSphere built our analytics suite from the ground up. The design is exceptionally premium and the processing speed surpassed our expectations.',
      rating: 5,
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Elena'
    },
    {
      name: 'Marcus Vance',
      role: 'Founder',
      company: 'Zenith Apparel',
      content: 'The e-commerce site they designed doubled our sales within three months. The smooth animations and glassmorphic checkout UI feel incredibly high-end.',
      rating: 5,
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Marcus'
    }
  ];

  const list = items.length > 0 ? items : defaults;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % list.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [list]);

  const handlePrev = () => {
    setCurrent(prev => (prev === 0 ? list.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent(prev => (prev + 1) % list.length);
  };

  const active = list[current];

  if (!active) return null;

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto', position: 'relative', textAlign: 'center' }}>
      <Quote size={48} style={{ color: 'rgba(6, 182, 212, 0.1)', position: 'absolute', top: '-20px', left: '0' }} />
      
      <div className="glass-card" style={{ padding: '3.5rem 3rem' }}>
        <p style={{ fontSize: '1.15rem', fontStyle: 'italic', marginBottom: '2rem', lineHeight: '1.7' }}>
          "{active.content}"
        </p>

        {/* Stars */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', marginBottom: '1.5rem' }}>
          {[...Array(active.rating || 5)].map((_, i) => (
            <Star key={i} size={16} fill="var(--warning)" color="var(--warning)" />
          ))}
        </div>

        {/* Client Author Info */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <img 
            src={active.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${active.name}`} 
            alt={active.name} 
            style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid var(--primary)' }}
          />
          <div style={{ textAlign: 'left' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{active.name}</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{active.role}, {active.company}</p>
          </div>
        </div>
      </div>

      {/* Nav Controls */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
        <button onClick={handlePrev} className="btn-icon" style={{ width: '38px', height: '38px' }}>
          <ChevronLeft size={16} />
        </button>
        <button onClick={handleNext} className="btn-icon" style={{ width: '38px', height: '38px' }}>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
