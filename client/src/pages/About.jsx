import React from 'react';
import { Target, Eye, Sparkles, Award, ShieldCheck, HeartHandshake } from 'lucide-react';

const About = () => {
  const team = [
    {
      name: 'David Chen',
      role: 'Chief Executive Officer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: 'David brings 15+ years of scaling enterprise software systems and SaaS structures globally.'
    },
    {
      name: 'Sarah Jenkins',
      role: 'Chief Security Officer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      bio: 'Sarah leads our cybersecurity auditing and network compliance testing pipelines.'
    },
    {
      name: 'Dr. Marcus Vance',
      role: 'VP of AI Engineering',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      bio: 'Marcus manages our predictive models, LLM fine-tunings, and smart chatbot development.'
    }
  ];

  return (
    <div className="section">
      <div className="container">
        
        {/* Title */}
        <div className="text-center" style={{ marginBottom: '5rem' }}>
          <div className="badge">NovaSphere Story</div>
          <h2 style={{ fontSize: '2.5rem', marginTop: '1rem', marginBottom: '1.25rem' }}>Pioneering Solutions Since 2018</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto' }}>
            We started with a simple belief: that enterprise software should be exceptionally robust, beautifully engineered, and highly secure.
          </p>
        </div>

        {/* Story details */}
        <div className="grid grid-2" style={{ gap: '3rem', alignItems: 'center', marginBottom: '6rem' }}>
          <div>
            <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Our Evolution</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              NovaSphere Technologies was founded in 2018 as a niche backend development agency. As cloud scalability and artificial intelligence redefined commercial architectures, we expanded our services to build robust neural networks, fully integrated mobile apps, and absolute cybersecurity layers.
            </p>
            <p style={{ color: 'var(--text-muted)' }}>
              Today, we serve Fortune 500 companies and growing startups, helping them migrate infrastructure safely, implement smart LLMs, and craft pristine user interfaces that convert visitors into lifelong brand advocates.
            </p>
          </div>
          <div className="glass-card" style={{ padding: '3rem', border: '1px solid rgba(var(--primary-rgb), 0.3)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={20} style={{ color: 'var(--primary)' }} /> Core Pillars
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', gap: '0.75rem' }}>
                <ShieldCheck style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <div>
                  <strong>Ironclad Security</strong>: We bake penetration defense systems directly into the root level of every application.
                </div>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem' }}>
                <HeartHandshake style={{ color: 'var(--secondary)', flexShrink: 0 }} />
                <div>
                  <strong>Collaborative Partnership</strong>: We align on sprint plans and outline design directories directly with your engineering leads.
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Mission & Vision cards */}
        <div className="grid grid-2" style={{ gap: '2rem', marginBottom: '6rem' }}>
          <div className="glass-card">
            <Target size={36} style={{ color: 'var(--primary)', marginBottom: '1.25rem' }} />
            <h3 style={{ marginBottom: '0.75rem' }}>Our Mission</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              To empower global organizations by deploying scalable, resilient, and intuitive technological infrastructures that drive operational excellence and sustainable growth.
            </p>
          </div>
          <div className="glass-card">
            <Eye size={36} style={{ color: 'var(--secondary)', marginBottom: '1.25rem' }} />
            <h3 style={{ marginBottom: '0.75rem' }}>Our Vision</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              To establish a worldwide standard in agentic AI deployments and zero-downtime server migrations, building a more connected and protected digital landscape.
            </p>
          </div>
        </div>

        {/* Timeline Section */}
        <div style={{ marginBottom: '6.5rem' }}>
          <h3 className="text-center" style={{ fontSize: '1.75rem', marginBottom: '3.5rem' }}>Milestone History</h3>
          <div className="timeline">
            <div className="timeline-item left">
              <h4 style={{ color: 'var(--primary)' }}>2018</h4>
              <p style={{ fontWeight: 600, margin: '0.25rem 0' }}>NovaSphere Founded</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Launched as a lightweight database consultancy group with 3 coders.</p>
            </div>
            <div className="timeline-item right">
              <h4 style={{ color: 'var(--primary)' }}>2021</h4>
              <p style={{ fontWeight: 600, margin: '0.25rem 0' }}>Pivot to Cloud & Security</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Expanded into automated cloud migration configurations and cyber testing operations.</p>
            </div>
            <div className="timeline-item left">
              <h4 style={{ color: 'var(--primary)' }}>2024</h4>
              <p style={{ fontWeight: 600, margin: '0.25rem 0' }}>AI Research Launch</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Initiated neural network training packages and conversational chatbot products.</p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h3 className="text-center" style={{ fontSize: '1.75rem', marginBottom: '3rem' }}>Leadership Team</h3>
          <div className="grid grid-3">
            {team.map(member => (
              <div key={member.name} className="glass-card text-center" style={{ padding: '2rem' }}>
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)', marginBottom: '1.25rem' }}
                />
                <h4 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>{member.name}</h4>
                <p style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '1rem' }}>
                  {member.role}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
