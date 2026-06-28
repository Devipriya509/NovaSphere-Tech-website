import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Search, Calendar, User, Eye, MessageSquare, Clock, ArrowRight } from 'lucide-react';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState('');
  
  // Sidebars
  const [recent, setRecent] = useState([]);
  const [popular, setPopular] = useState([]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      let query = '';
      if (searchText) query += `?search=${encodeURIComponent(searchText)}`;
      if (category) query += query ? `&category=${encodeURIComponent(category)}` : `?category=${encodeURIComponent(category)}`;

      const data = await api.get(`/blogs${query}`);
      if (data.success) {
        setBlogs(data.blogs);
        
        // Populate sidebars from all blogs on first fetch
        if (!searchText && !category) {
          const sortedByDate = [...data.blogs].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
          const sortedByViews = [...data.blogs].sort((a,b) => (b.views || 0) - (a.views || 0));
          setRecent(sortedByDate.slice(0, 3));
          setPopular(sortedByViews.slice(0, 3));
        }
      }
    } catch (err) {
      console.error('Failed to fetch blogs:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBlogs();
  };

  const categories = ['AI Solutions', 'Cybersecurity', 'UI UX Design', 'Cloud Computing', 'Web Dev'];

  return (
    <div className="section">
      <div className="container">
        
        {/* Title */}
        <div className="text-center" style={{ marginBottom: '4rem' }}>
          <div className="badge">NovaSphere Insights</div>
          <h2 style={{ fontSize: '2.5rem', marginTop: '1rem', marginBottom: '1.25rem' }}>Tech Updates & Innovation Case Studies</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto' }}>
            Stay updated with structural system tutorials, AI pipeline benchmarks, and security analysis.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid" style={{ gridTemplateColumns: '3fr 1fr', gap: '3rem' }}>
          
          {/* Main Blogs List */}
          <div>
            {/* Search and Category Quick select */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem' }}>
              <input 
                type="text" 
                placeholder="Search articles by keywords..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="form-input"
                style={{ borderRadius: '9999px', paddingLeft: '1.5rem' }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                <Search size={16} /> Search
              </button>
            </form>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
                <span className="spinner"></span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {blogs.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
                    <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No articles match your search criteria.</p>
                    <button onClick={() => { setSearchText(''); setCategory(''); }} className="btn btn-secondary">Clear Filters</button>
                  </div>
                ) : (
                  blogs.map(b => (
                    <article key={b._id} className="glass-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ width: '100%', height: '280px' }}>
                        <img 
                          src={b.image || '/assets/portfolio-placeholder.svg'} 
                          alt={b.title} 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/assets/portfolio-placeholder.svg';
                          }}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      
                      <div style={{ padding: '2.25rem' }}>
                        <span className="badge" style={{ marginBottom: '1rem' }}>{b.category}</span>
                        <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem' }}>
                          <Link to={`/blog/${b.slug}`} style={{ hoverColor: 'var(--primary)' }}>{b.title}</Link>
                        </h3>

                        {/* Metadata */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <User size={14} /> {b.author || 'NovaSphere'}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Calendar size={14} /> {new Date(b.createdAt).toLocaleDateString()}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Clock size={14} /> {b.readTime || '5 mins'}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Eye size={14} /> {b.views || 0} Views
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <MessageSquare size={14} /> {(b.comments || []).length} Comments
                          </span>
                        </div>

                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem', lineClamp: 3, WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {b.content}
                        </p>

                        <Link to={`/blog/${b.slug}`} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>
                          Read Full Article <ArrowRight size={14} />
                        </Link>
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sidebar Panel */}
          <div>
            {/* Category Select list */}
            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1.05rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Categories</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <li>
                  <button 
                    onClick={() => setCategory('')} 
                    style={{ background: 'none', border: 'none', color: !category ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: !category ? 600 : 500 }}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat}>
                    <button 
                      onClick={() => setCategory(cat)} 
                      style={{ background: 'none', border: 'none', color: category === cat ? 'var(--primary)' : 'var(--text-muted)', cursor: 'pointer', fontWeight: category === cat ? 600 : 500 }}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Posts */}
            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1.05rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Popular Articles</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {popular.map(p => (
                  <div key={p._id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <img src={p.image} alt="thumb" style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div>
                      <h5 style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '130px' }}>
                        <Link to={`/blog/${p.slug}`}>{p.title}</Link>
                      </h5>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Eye size={10} /> {p.views || 0} Views
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Posts */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h4 style={{ fontSize: '1.05rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Recent Posts</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recent.map(r => (
                  <div key={r._id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <img src={r.image} alt="thumb" style={{ width: '50px', height: '50px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div>
                      <h5 style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', width: '130px' }}>
                        <Link to={`/blog/${r.slug}`}>{r.title}</Link>
                      </h5>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Blog;
