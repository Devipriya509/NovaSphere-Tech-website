import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, User, Calendar, Clock, Eye, MessageSquare, Send } from 'lucide-react';

const BlogDetails = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Comments form
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const fetchBlogDetails = async () => {
    try {
      const data = await api.get(`/blogs/${slug}`);
      if (data.success) {
        setBlog(data.blog);
      }
    } catch (err) {
      showToast(err.message || 'Failed to load article', 'error');
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogDetails();
  }, [slug]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!authorName || !commentText) return;

    setCommentLoading(true);
    try {
      const data = await api.post(`/blogs/${blog._id}/comments`, {
        authorName,
        content: commentText
      });

      if (data.success) {
        showToast('Comment posted successfully!', 'success');
        setAuthorName('');
        setCommentText('');
        fetchBlogDetails(); // Refresh comments list
      }
    } catch (err) {
      showToast(err.message || 'Comment submission failed', 'error');
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="spinner"></span>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '850px' }}>
        {/* Back Link */}
        <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '2.5rem' }}>
          <ArrowLeft size={16} /> Back to Blog List
        </Link>

        {/* Title and metadata */}
        <div style={{ marginBottom: '2.5rem' }}>
          <span className="badge" style={{ marginBottom: '0.75rem' }}>{blog.category}</span>
          <h1 style={{ fontSize: '2.5rem', lineHeight: '1.2', marginBottom: '1.25rem' }}>{blog.title}</h1>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <User size={14} /> {blog.author || 'NovaSphere'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} /> {new Date(blog.createdAt).toLocaleDateString()}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={14} /> {blog.readTime || '5 mins'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Eye size={14} /> {blog.views || 0} Views
            </span>
          </div>
        </div>

        {/* Hero Image */}
        <div style={{ width: '100%', height: '400px', borderRadius: '16px', overflow: 'hidden', marginBottom: '3rem' }}>
          <img 
            src={blog.image || '/assets/portfolio-placeholder.svg'} 
            alt={blog.title} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/portfolio-placeholder.svg';
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>

        {/* Article content */}
        <div style={{
          fontSize: '1.05rem',
          lineHeight: '1.8',
          color: 'var(--text-color)',
          marginBottom: '4rem',
          borderBottom: '1px solid var(--card-border)',
          paddingBottom: '3rem'
        }}>
          {blog.content.split('\n\n').map((paragraph, index) => (
            <p key={index} style={{ marginBottom: '1.5rem' }}>{paragraph}</p>
          ))}
        </div>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
            {blog.tags.map(tag => (
              <span key={tag} className="badge" style={{ background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)' }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Comments Section */}
        <div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={20} /> Comments ({(blog.comments || []).length})
          </h3>

          {/* Comments List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3.5rem' }}>
            {(blog.comments || []).length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No comments posted yet. Be the first to share your thoughts!</p>
            ) : (
              blog.comments.map((comment, idx) => (
                <div key={idx} className="glass-card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 600 }}>{comment.authorName}</h5>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{comment.content}</p>
                </div>
              ))
            )}
          </div>

          {/* Post Comment Form */}
          <div className="glass-card">
            <h4 style={{ fontSize: '1.15rem', marginBottom: '1.5rem' }}>Post a Comment</h4>
            <form onSubmit={handleCommentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="grid grid-2">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Your Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name" 
                    value={authorName} 
                    onChange={(e) => setAuthorName(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Comment Content</label>
                <textarea 
                  placeholder="Share your thoughts about this article..." 
                  value={commentText} 
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={4}
                  required
                  className="form-input"
                  style={{ resize: 'none' }}
                />
              </div>
              <button 
                type="submit" 
                disabled={commentLoading}
                className="btn btn-primary" 
                style={{ width: 'fit-content', padding: '0.75rem 2.25rem' }}
              >
                {commentLoading ? <span className="spinner" style={{ width: '16px', height: '16px' }}></span> : <><Send size={14} /> Submit Comment</>}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default BlogDetails;
