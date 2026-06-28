import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Download, Receipt } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('payment_id') || 'rzp_test_' + Math.random().toString(36).substr(2, 9);
  const orderId = searchParams.get('order_id') || 'order_' + Math.random().toString(36).substr(2, 9);
  const amount = searchParams.get('amount') || '999';

  return (
    <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '550px' }}>
        <div className="glass-card text-center" style={{ padding: '3rem 2rem', border: '1px solid var(--success)' }}>
          <div style={{ display: 'inline-flex', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <CheckCircle size={48} />
          </div>

          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Payment Successful!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Thank you for your payment. Your consultation session has been successfully booked and confirmed.
          </p>

          {/* Receipt Slip Box */}
          <div className="glass-card" style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--card-border)', padding: '1.25rem', textAlign: 'left', marginBottom: '2rem', fontSize: '0.85rem' }}>
            <h4 style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Receipt size={14} style={{ color: 'var(--success)' }} /> Transaction Details
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment Gateway ID:</span>
                <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{paymentId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
                <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{orderId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--card-border)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                <span style={{ fontWeight: 600 }}>Amount Charged:</span>
                <span style={{ fontWeight: 700, color: 'var(--success)' }}>₹{amount}.00 INR</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/dashboard" className="btn btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
              Go to Dashboard <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
