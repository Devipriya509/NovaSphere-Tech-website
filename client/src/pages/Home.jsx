import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowRight, Cpu, Shield, Globe, Star, Users, Briefcase, Award } from 'lucide-react';
import TestimonialCarousel from '../components/TestimonialCarousel';

const Home = () => {
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    // Fetch top items for previews
    api.get('/services').then(d => setServices(d.services.slice(0, 3))).catch(() => {});
    api.get('/portfolio').then(d => setProjects(d.projects.slice(0, 3))).catch(() => {});
    api.get('/testimonials').then(d => setTestimonials(d.testimonials)).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="section" style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8rem 0'
      }}>
        {/* Glow Spheres */}
        <div className="sphere" style={{ top: '15%', left: '10%' }}></div>
        <div className="sphere" style={{ bottom: '15%', right: '10%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0) 70%)' }}></div>

        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <div className="badge" style={{ marginBottom: '1.5rem' }}>Enterprise IT & AI Solutions</div>
          <h1 style={{
            fontSize: '4rem',
            lineHeight: '1.1',
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-title)',
            background: 'linear-gradient(135deg, #ffffff 0%, var(--text-muted) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            NovaSphere Technologies
          </h1>
          <p style={{
            fontSize: '1.8rem',
            fontWeight: 600,
            color: 'var(--primary)',
            marginBottom: '1.5rem'
          }}>
            "Building the Future with Technology"
          </p>
          <p style={{
            maxWidth: '700px',
            margin: '0 auto 2.5rem auto',
            fontSize: '1.1rem',
            color: 'var(--text-muted)'
          }}>
            We design, scale, and secure state-of-the-art software systems. From custom artificial intelligence pipelines to cloud automation and corporate cyber audits, we are your engineering partners.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/services" className="btn btn-primary">
              Our Services <ArrowRight size={16} />
            </Link>
            <Link to="/book" className="btn btn-secondary">
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)' }}>
        <div className="container">
          <div className="grid grid-4 text-center">
            <div className="glass-card" style={{ padding: '2rem' }}>
              <Users size={32} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '2.5rem', fontWeight: 800 }}>500+</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Projects Completed Worldwide</p>
            </div>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <Award size={32} style={{ color: 'var(--secondary)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '2.5rem', fontWeight: 800 }}>15+</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Industry Innovation Awards</p>
            </div>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <Cpu size={32} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '2.5rem', fontWeight: 800 }}>99.9%</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Critical System Uptime SLA</p>
            </div>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <Briefcase size={32} style={{ color: 'var(--secondary)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '2.5rem', fontWeight: 800 }}>120+</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Expert Engineers & Scientists</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>Key Technological Sectors</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              We orchestrate end-to-end digital transformations with high-performance architectures.
            </p>
          </div>

          <div className="grid grid-3">
            {services.map(s => (
              <div key={s._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{
                  background: 'rgba(6, 182, 212, 0.1)',
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  marginBottom: '1.5rem'
                }}>
                  {s.icon === 'Shield' ? <Shield size={24} /> : s.icon === 'Globe' ? <Globe size={24} /> : <Cpu size={24} />}
                </div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem' }}>{s.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>{s.description}</p>
                <Link to="/services" style={{ color: 'var(--primary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                  Learn More <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center" style={{ marginTop: '3.5rem' }}>
            <Link to="/services" className="btn btn-secondary">View All Services</Link>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section className="section" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--card-border)' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>Client Endorsements</h2>
            <p style={{ color: 'var(--text-muted)' }}>Hear from the technology directors and product VPs we partner with.</p>
          </div>
          <TestimonialCarousel items={testimonials} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="section" style={{ padding: '8rem 0' }}>
        <div className="container text-center">
          <div className="glass-card" style={{ padding: '4rem 2.5rem', border: '1px solid rgba(var(--primary-rgb), 0.3)' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>Ready to Scale Your Systems?</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
              Schedule a 30-minute discovery call with our solutions architects to mapping your requirements.
            </p>
            <Link to="/contact" className="btn btn-primary">Get In Touch Now</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
