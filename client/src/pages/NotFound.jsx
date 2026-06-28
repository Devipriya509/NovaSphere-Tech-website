import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '75vh', textAlign: 'center' }}>
      <div className="sphere" style={{ top: '25%', left: '35%', width: '250px', height: '250px' }}></div>
      <div className="glass-card" style={{ maxWidth: '450px', padding: '3.5rem 2.5rem', position: 'relative', zIndex: 1 }}>
        <Compass size={64} style={{ color: 'var(--primary)', marginBottom: '1.5rem', animation: 'spin 10s linear infinite' }} />
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>404</h2>
        <p style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '1rem' }}>Coordinates Out of Bound</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '2rem' }}>
          The requested system node does not exist in this sector of the NovaSphere network. It may have migrated or been archived.
        </p>
        <Link to="/" className="btn btn-primary" style={{ width: '100%' }}>
          <Home size={16} /> Return to Base
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
