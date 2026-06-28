import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Briefcase, MapPin, DollarSign, Clock, FileText, Upload, Sparkles, X, Check } from 'lucide-react';

const Careers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const { showToast } = useToast();

  // Application fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [resumeBase64, setResumeBase64] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    api.get('/careers')
      .then(data => {
        if (data.success) {
          setJobs(data.jobs);
        }
      })
      .catch(err => {
        console.error('Failed to load job listings:', err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setApplyModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Limit to 2MB
        showToast('Resume size must be under 2MB.', 'warning');
        return;
      }
      setResumeName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !resumeBase64) {
      showToast('All contact fields and resume file are required.', 'warning');
      return;
    }

    setSubmitLoading(true);
    try {
      const data = await api.post(`/careers/${selectedJob._id}/apply`, {
        careerId: selectedJob._id,
        jobTitle: selectedJob.title,
        name,
        email,
        phone,
        coverLetter,
        resume: resumeBase64
      });

      if (data.success) {
        showToast('Your job application has been submitted successfully!', 'success');
        setApplyModalOpen(false);
        resetForm();
      }
    } catch (err) {
      showToast(err.message || 'Application submission failed', 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setCoverLetter('');
    setResumeName('');
    setResumeBase64('');
  };

  return (
    <div className="section">
      <div className="container">
        
        {/* Header */}
        <div className="text-center" style={{ marginBottom: '5rem' }}>
          <div className="badge">Careers</div>
          <h2 style={{ fontSize: '2.5rem', marginTop: '1rem', marginBottom: '1.25rem' }}>Shape the Future of Technology With Us</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            We work with cutting-edge tools to build, deploy, and support next-gen software systems.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-3" style={{ gap: '2rem', marginBottom: '6rem' }}>
          <div className="glass-card">
            <Sparkles size={28} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
            <h4>Emerging Technologies</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Build production architectures with custom LLMs, serverless containers, and complex cybersecurity algorithms.
            </p>
          </div>
          <div className="glass-card">
            <Clock size={28} style={{ color: 'var(--secondary)', marginBottom: '1rem' }} />
            <h4>Remote-First Culture</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              We encourage flexible schedules, workspace stipends, and deep asynchronous focus.
            </p>
          </div>
          <div className="glass-card">
            <Briefcase size={28} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
            <h4>Growth & Progression</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Full education reimbursements, annual conference packages, and direct mentoring.
            </p>
          </div>
        </div>

        {/* Job Listings Header */}
        <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem' }}>Current Openings</h3>

        {/* Jobs List */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
            <span className="spinner"></span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {jobs.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '2rem' }}>No open positions at this time. Check back later!</p>
            ) : (
              jobs.map(job => (
                <div key={job._id} className="glass-card" style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.3rem', color: 'var(--primary)' }}>{job.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Department: {job.department}</p>
                    </div>
                    <button onClick={() => handleApplyClick(job)} className="btn btn-primary" style={{ padding: '0.6rem 1.75rem' }}>
                      Apply Now
                    </button>
                  </div>

                  {/* Metadata */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><MapPin size={14} /> {job.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><Clock size={14} /> {job.type}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><DollarSign size={14} /> {job.salary}</span>
                  </div>

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{job.description}</p>

                  <div className="grid grid-2" style={{ gap: '1.5rem' }}>
                    <div>
                      <h5 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Requirements</h5>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {job.requirements.map((req, i) => (
                          <li key={i} style={{ display: 'flex', gap: '0.35rem' }}><Check size={12} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} /> {req}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>Core Responsibilities</h5>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {job.responsibilities.map((resp, i) => (
                          <li key={i} style={{ display: 'flex', gap: '0.35rem' }}><Check size={12} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '2px' }} /> {resp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* Apply Modal */}
      {applyModalOpen && selectedJob && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(5, 8, 16, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1500,
          padding: '1.5rem'
        }}>
          <div className="glass-card" style={{
            width: '100%',
            maxWidth: '550px',
            padding: '2.5rem',
            border: '1px solid rgba(var(--primary-rgb), 0.25)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setApplyModalOpen(false)} 
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Apply for Position</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>{selectedJob.title}</p>
            </div>

            <form onSubmit={handleSubmitApplication} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Your Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required
                  className="form-input"
                />
              </div>

              <div className="grid grid-2" style={{ gap: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Cover Letter / Summary</label>
                <textarea 
                  value={coverLetter} 
                  onChange={(e) => setCoverLetter(e.target.value)} 
                  rows={3}
                  className="form-input"
                  style={{ resize: 'none' }}
                  placeholder="Tell us why you are a great fit for NovaSphere..."
                />
              </div>

              {/* Upload Resume widget */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Upload Resume (PDF / Doc)</label>
                <div style={{
                  border: '1.5px dashed var(--card-border)',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.01)',
                  position: 'relative',
                  cursor: 'pointer'
                }}>
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                    required
                  />
                  <Upload size={24} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                  {resumeName ? (
                    <p style={{ fontSize: '0.85rem', color: 'var(--success)', fontWeight: 600 }}>{resumeName} Loaded</p>
                  ) : (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click to upload file (PDF, Max 2MB)</p>
                  )}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={submitLoading} 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '1rem' }}
              >
                {submitLoading ? <span className="spinner" style={{ width: '16px', height: '16px' }}></span> : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;
