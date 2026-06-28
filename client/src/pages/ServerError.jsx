import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, RefreshCw } from 'lucide-react';

const ServerError = () => {
  return (
    <div className="section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '75vh', textAlign: 'center' }}>
      <div className="glass-card" style={{ maxWidth: '450px', padding: '3.5rem 2.5rem' }}>
        <ShieldAlert size={64} style={{ color: 'var(--danger)', marginBottom: '1.5rem' }} />
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>500</h2>
        <p style={{ fontWeight: 600, color: 'var(--danger)', marginBottom: '1rem' }}>Neural Relay Failure</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '2rem' }}>
          An unhandled error occurred in our API gateway relay. Our engineering dashboard has logged this failure.
        </p>
        <button onClick={() => window.location.reload()} className="btn btn-primary" style={{ width: '100%', marginBottom: '0.75rem' }}>
          <RefreshCw size={16} /> Re-establish Relay
        </button>
        <Link to="/" className="btn btn-secondary" style={{ width: '100%' }}>
          Return to Safety
        </Link>
      </div>
    </div>
  );
};

export default ServerError;
