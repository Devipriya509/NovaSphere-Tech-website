import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ExternalLink, Heart, FolderOpen } from 'lucide-react';

const GithubIcon = ({ size = 14, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Portfolio = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const { user, toggleSaveProject } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    api.get('/portfolio')
      .then(data => {
        if (data.success) {
          setProjects(data.projects);
        }
      })
      .catch(err => {
        console.error('Failed to load portfolio:', err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const categories = ['All', 'Web Development', 'Mobile Apps', 'AI', 'Branding', 'UI UX'];

  const filteredProjects = category === 'All' 
    ? projects 
    : projects.filter(p => p.category === category);

  const isSaved = (projectId) => {
    return user && user.savedProjects && user.savedProjects.includes(projectId);
  };

  const handleSaveToggle = async (projectId, projectTitle) => {
    if (!user) {
      showToast('Please sign in to save projects to your dashboard.', 'warning');
      return;
    }

    try {
      await toggleSaveProject(projectId);
      if (isSaved(projectId)) {
        showToast(`Removed "${projectTitle}" from saved projects`, 'info');
      } else {
        showToast(`Saved "${projectTitle}" to your dashboard!`, 'success');
      }
    } catch (err) {
      showToast('Failed to update saved projects list', 'error');
    }
  };

  return (
    <div className="section">
      <div className="container">
        
        {/* Header */}
        <div className="text-center" style={{ marginBottom: '4rem' }}>
          <div className="badge">Our Portfolio</div>
          <h2 style={{ fontSize: '2.5rem', marginTop: '1rem', marginBottom: '1.25rem' }}>Enterprise Solutions Executed</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Browse through our case studies and live open-source demonstrations.
          </p>
        </div>

        {/* Categories Filters Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
          marginBottom: '3.5rem'
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                background: category === cat ? 'var(--primary)' : 'rgba(255,255,255,0.02)',
                color: category === cat ? 'var(--text-inverse)' : 'var(--text-color)',
                border: `1px solid ${category === cat ? 'var(--primary)' : 'var(--card-border)'}`,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Cards Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '3rem 0' }}>
            <span className="spinner"></span>
          </div>
        ) : (
          <div>
            {filteredProjects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                <FolderOpen size={48} style={{ marginBottom: '1rem' }} />
                <p>No projects found in this category. Check back later!</p>
              </div>
            ) : (
              <div className="grid grid-3" style={{ gap: '2rem' }}>
                {filteredProjects.map(p => (
                  <div key={p._id} className="glass-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* Image overlay with category & save heart */}
                    <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden' }}>
                      <img 
                        src={p.image || '/assets/portfolio-placeholder.svg'} 
                        alt={p.title} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/portfolio-placeholder.svg';
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                      />
                      <span className="badge" style={{ position: 'absolute', top: '15px', left: '15px', backdropFilter: 'blur(10px)', background: 'rgba(5, 8, 16, 0.65)' }}>
                        {p.category}
                      </span>
                      <button 
                        onClick={() => handleSaveToggle(p._id, p.title)}
                        style={{
                          position: 'absolute',
                          top: '15px',
                          right: '15px',
                          background: 'rgba(5, 8, 16, 0.65)',
                          border: 'none',
                          color: isSaved(p._id) ? 'var(--danger)' : '#fff',
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                          transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <Heart size={16} fill={isSaved(p._id) ? 'var(--danger)' : 'none'} />
                      </button>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase' }}>Client: {p.client}</span>
                      <h3 style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>{p.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem', flex: 1 }}>{p.description}</p>

                      {/* Tech stack badges */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.75rem' }}>
                        {p.technologies.map(tech => (
                          <span key={tech} style={{ fontSize: '0.65rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', borderRadius: '4px', color: 'var(--text-muted)' }}>
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Action links */}
                      <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--card-border)', paddingTop: '1rem' }}>
                        {p.liveDemo && (
                          <a 
                            href={p.liveDemo} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)' }}
                          >
                            <ExternalLink size={14} /> Live Demo
                          </a>
                        )}
                        {p.github && (
                          <a 
                            href={p.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}
                          >
                            <GithubIcon size={14} /> Github
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Portfolio;
