import React, { useState } from 'react';
import { Star, Plus, Edit2, Trash2, CheckCircle, XCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Admin.css';

export default function AdminTestimonials() {
  const [activeTab, setActiveTab] = useState('published');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    role: 'Customer',
    rating: 5,
    text: ''
  });

  const [testimonials, setTestimonials] = useState(() => {
    const saved = localStorage.getItem('dream_cream_testimonials');
    if (saved) return JSON.parse(saved);
    return []; // Completely empty of mock data initially
  });

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} size={16} fill={i < rating ? '#facc15' : 'transparent'} color={i < rating ? '#facc15' : '#cbd5e1'} />
    ));
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.text.trim()) return;

    const review = {
      id: Date.now(),
      name: newReview.name,
      role: newReview.role,
      rating: Number(newReview.rating),
      text: newReview.text,
      status: 'published',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const list = [review, ...testimonials];
    setTestimonials(list);
    localStorage.setItem('dream_cream_testimonials', JSON.stringify(list));
    setIsAddModalOpen(false);
    setNewReview({ name: '', role: 'Customer', rating: 5, text: '' });
  };

  const handleApprove = (id) => {
    const list = testimonials.map(t => t.id === id ? { ...t, status: 'published' } : t);
    setTestimonials(list);
    localStorage.setItem('dream_cream_testimonials', JSON.stringify(list));
  };

  const handleDelete = (id) => {
    const list = testimonials.filter(t => t.id !== id);
    setTestimonials(list);
    localStorage.setItem('dream_cream_testimonials', JSON.stringify(list));
  };

  const filteredTestimonials = testimonials.filter(t => t.status === activeTab);

  return (
    <div className="fade-in" style={{ position: 'relative', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.2rem', margin: 0, fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Star size={28} style={{ color: 'var(--color-primary)' }} /> Testimonials
        </h2>
        <button className="btn-pro btn-pro-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} /> Add Review Manually
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          className="btn-pro"
          onClick={() => setActiveTab('published')}
          style={{ 
            background: activeTab === 'published' ? '#1e293b' : '#ffffff', 
            color: activeTab === 'published' ? '#ffffff' : '#64748b',
            border: 'none',
            boxShadow: activeTab === 'published' ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          Published Reviews
        </button>
        <button 
          className="btn-pro"
          onClick={() => setActiveTab('pending')}
          style={{ 
            background: activeTab === 'pending' ? '#1e293b' : '#ffffff', 
            color: activeTab === 'pending' ? '#ffffff' : '#64748b',
            border: 'none',
            boxShadow: activeTab === 'pending' ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          Pending Approval
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
        <AnimatePresence>
          {filteredTestimonials.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', background: '#f8fafc', borderRadius: '16px', color: '#94a3b8' }}>
              <Star size={48} style={{ opacity: 0.5, margin: '0 auto 1rem' }} />
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', color: '#64748b' }}>No {activeTab} reviews found.</h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Use the manual add button or submit reviews from the website feedback forms.</p>
            </div>
          ) : (
            filteredTestimonials.map((testimonial, i) => (
              <motion.div 
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="admin-panel-pro"
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,123,156,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--color-primary)', fontSize: '1.2rem' }}>
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', color: '#1e293b' }}>{testimonial.name}</h4>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{testimonial.role}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>{testimonial.date}</div>
                </div>

                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {renderStars(testimonial.rating)}
                </div>

                <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '0.95rem', fontStyle: 'italic', margin: '0 0 1.5rem 0', flex: 1 }}>
                  "{testimonial.text}"
                </p>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                  {activeTab === 'pending' && (
                    <button className="btn-pro" style={{ flex: 1, background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0', justifyContent: 'center' }} onClick={() => handleApprove(testimonial.id)}>
                      <CheckCircle size={16} /> Approve
                    </button>
                  )}
                  <button className="btn-pro" style={{ flex: 1, background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', justifyContent: 'center' }} onClick={() => handleDelete(testimonial.id)}>
                    <Trash2 size={16} /> {activeTab === 'pending' ? 'Reject' : 'Delete'}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Manual Review Addition Dialog Overlay */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="instant-modal-overlay flex-center" onClick={() => setIsAddModalOpen(false)} style={{ zIndex: 99999 }}>
            <motion.div 
              className="instant-modal-card glass-panel"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: '#ffffff', maxWidth: '480px', padding: '2.5rem' }}
            >
              <form onSubmit={handleAddReview} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#1e293b' }}>Add Review Manually</h3>
                
                <div className="input-group">
                  <input 
                    type="text" 
                    id="reviewerName" 
                    value={newReview.name} 
                    onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))} 
                    required 
                    placeholder=" " 
                  />
                  <label htmlFor="reviewerName">Customer Name</label>
                </div>

                <div className="input-group">
                  <input 
                    type="text" 
                    id="reviewerRole" 
                    value={newReview.role} 
                    onChange={(e) => setNewReview(prev => ({ ...prev, role: e.target.value }))} 
                    placeholder=" " 
                  />
                  <label htmlFor="reviewerRole">Customer Role (e.g. Regular, Blogger)</label>
                </div>

                <div className="input-group">
                  <select 
                    id="reviewRating"
                    value={newReview.rating} 
                    onChange={(e) => setNewReview(prev => ({ ...prev, rating: e.target.value }))} 
                    style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none' }}
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>

                <div className="input-group">
                  <textarea 
                    id="reviewText" 
                    rows="4"
                    value={newReview.text} 
                    onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))} 
                    required 
                    placeholder=" " 
                    style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none', resize: 'vertical' }}
                  />
                  <label htmlFor="reviewText">Review Comments</label>
                </div>

                <div className="modal-actions" style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    style={{ flex: 1, padding: '0.85rem' }}
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    style={{ flex: 1, padding: '0.85rem' }}
                  >
                    Add Review
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
