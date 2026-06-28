import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangle, ArrowRight, HelpCircle } from 'lucide-react';

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') || 'Transaction was declined by bank or user cancelled.';

  return (
    <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '550px' }}>
        <div className="glass-card text-center" style={{ padding: '3rem 2rem', border: '1px solid var(--danger)' }}>
          <div style={{ display: 'inline-flex', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <AlertTriangle size={48} />
          </div>

          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Payment Failed</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            We could not complete your transaction. No charges were made to your account.
          </p>

          {/* Reason Box */}
          <div className="glass-card" style={{ background: 'rgba(239,68,68,0.02)', border: '1px solid var(--card-border)', padding: '1.25rem', textAlign: 'left', marginBottom: '2rem', fontSize: '0.85rem' }}>
            <h4 style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--danger)' }}>
              <HelpCircle size={14} /> Error Log
            </h4>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
              {reason}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/dashboard" className="btn btn-secondary" style={{ flex: 1 }}>
              Back to Dashboard
            </Link>
            <Link to="/contact" className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
              Contact Support <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
