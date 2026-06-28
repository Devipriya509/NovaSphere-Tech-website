import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import { Menu, X, Sun, Moon, User, LogOut, ChevronDown, LayoutDashboard, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // Mobile & drop states
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Global search states
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ services: [], projects: [], blogs: [] });
  const [searchLoading, setSearchLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length < 2) {
      setSearchResults({ services: [], projects: [], blogs: [] });
      return;
    }
    setSearchLoading(true);
    try {
      const data = await api.get(`/search?q=${encodeURIComponent(val)}`);
      if (data.success) {
        setSearchResults(data.results);
      }
    } catch (err) {
      console.error('Global search error:', err.message);
    } finally {
      setSearchLoading(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="logo" onClick={() => setMobileOpen(false)}>
          <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }}></span>
          NovaSphere
        </Link>

        {/* Desktop Links */}
        <ul className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          <li>
            <Link to="/" className={`nav-link ${isActive('/')}`} onClick={() => setMobileOpen(false)}>Home</Link>
          </li>
          <li>
            <Link to="/about" className={`nav-link ${isActive('/about')}`} onClick={() => setMobileOpen(false)}>About Us</Link>
          </li>
          <li>
            <Link to="/services" className={`nav-link ${isActive('/services')}`} onClick={() => setMobileOpen(false)}>Services</Link>
          </li>
          <li>
            <Link to="/portfolio" className={`nav-link ${isActive('/portfolio')}`} onClick={() => setMobileOpen(false)}>Portfolio</Link>
          </li>
          <li>
            <Link to="/blog" className={`nav-link ${isActive('/blog')}`} onClick={() => setMobileOpen(false)}>Blog</Link>
          </li>
          <li>
            <Link to="/careers" className={`nav-link ${isActive('/careers')}`} onClick={() => setMobileOpen(false)}>Careers</Link>
          </li>
          <li>
            <Link to="/contact" className={`nav-link ${isActive('/contact')}`} onClick={() => setMobileOpen(false)}>Contact</Link>
          </li>
          
          {/* Mobile Auth options */}
          {mobileOpen && (
            <li style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              {user ? (
                <>
                  <Link 
                    to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                    className="btn btn-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-secondary" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link to="/register" className="btn btn-primary" onClick={() => setMobileOpen(false)}>Register</Link>
                </>
              )}
            </li>
          )}
        </ul>

        {/* Desktop & Action Bar */}
        <div className="nav-actions">
          {/* Global Search Toggle */}
          <button 
            onClick={() => {
              setSearchOpen(true);
              setSearchQuery('');
              setSearchResults({ services: [], projects: [], blogs: [] });
            }} 
            className="btn-icon" 
            title="Global Search"
            style={{ marginRight: '0.25rem' }}
          >
            <Search size={18} />
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="btn-icon" 
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{ marginRight: '0.25rem' }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User profile dropdown */}
          {!mobileOpen && (
            <div style={{ position: 'relative' }}>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <img 
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
                    alt="avatar" 
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--primary)' }}
                  />
                  <ChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>Sign In</Link>
                  <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>Sign Up</Link>
                </div>
              )}

              {dropdownOpen && user && (
                <div className="glass-card" style={{
                  position: 'absolute',
                  top: '55px',
                  right: '0',
                  width: '220px',
                  padding: '1rem',
                  zIndex: '1100',
                  boxShadow: 'var(--glass-shadow)',
                  borderRadius: '12px'
                }}>
                  <div style={{ marginBottom: '0.75rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user.role}</p>
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <li>
                      <Link 
                        to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <LayoutDashboard size={14} /> Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/profile" 
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User size={14} /> Edit Profile
                      </Link>
                    </li>
                    <li style={{ borderTop: '1px solid var(--card-border)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                      <button 
                        onClick={handleLogout} 
                        style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', width: '100%', padding: '0', textAlign: 'left' }}
                      >
                        <LogOut size={14} /> Log Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Toggle Menu */}
          <button className="nav-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Global Search Dialog Modal */}
      {searchOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1200, display: 'flex', justifyContent: 'center', padding: '4rem 1rem' }} onClick={() => setSearchOpen(false)}>
          <div className="glass-card" style={{ maxWidth: '650px', width: '100%', maxHeight: '80vh', display: 'flex', flexDirection: 'column', background: '#080d16', border: '1px solid var(--card-border)', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--card-border)', padding: '1rem' }}>
              <Search size={20} style={{ color: 'var(--primary)', marginRight: '0.75rem' }} />
              <input 
                type="text" 
                placeholder="Search services, portfolio case studies, blog articles..." 
                value={searchQuery} 
                onChange={handleSearchChange}
                autoFocus
                style={{ flex: 1, background: 'none', border: 'none', color: 'white', outline: 'none', fontSize: '1rem' }}
              />
              <button onClick={() => setSearchOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}>Close</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {searchLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0' }}><span className="spinner"></span></div>
              ) : searchQuery.trim().length < 2 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>Type at least 2 characters to search NovaSphere Technologies.</p>
              ) : (searchResults.services.length === 0 && searchResults.projects.length === 0 && searchResults.blogs.length === 0) ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>No results match your search query.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  {searchResults.services.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--primary)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>Services ({searchResults.services.length})</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {searchResults.services.map(s => (
                          <Link key={s._id} to="/services" onClick={() => setSearchOpen(false)} style={{ display: 'block', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--card-border)', textDecoration: 'none' }}>
                            <span style={{ fontWeight: 600, display: 'block', fontSize: '0.9rem', color: 'var(--primary)' }}>{s.title}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.description.substring(0, 100)}...</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.projects.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--secondary)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>Portfolio Case Studies ({searchResults.projects.length})</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {searchResults.projects.map(p => (
                          <Link key={p._id} to="/portfolio" onClick={() => setSearchOpen(false)} style={{ display: 'block', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--card-border)', textDecoration: 'none' }}>
                            <span style={{ fontWeight: 600, display: 'block', fontSize: '0.9rem', color: 'var(--secondary)' }}>{p.title}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.category} | Client: {p.client}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {searchResults.blogs.length > 0 && (
                    <div>
                      <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--success)', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.25rem', marginBottom: '0.5rem' }}>Blog Articles ({searchResults.blogs.length})</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {searchResults.blogs.map(b => (
                          <Link key={b._id} to={`/blog/${b.slug}`} onClick={() => setSearchOpen(false)} style={{ display: 'block', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--card-border)', textDecoration: 'none' }}>
                            <span style={{ fontWeight: 600, display: 'block', fontSize: '0.9rem', color: 'var(--success)' }}>{b.title}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.category} | Author: {b.author}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
