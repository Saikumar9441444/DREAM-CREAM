import React from 'react';
import { Star, Edit2 } from 'lucide-react';
import './Admin.css';

export default function AdminTestimonials() {
  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Star size={28} className="text-primary" /> Testimonials
        </h2>
        <button className="btn-primary">Add New Review</button>
      </div>

      <div className="admin-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <Edit2 size={48} style={{ color: 'var(--color-primary)', opacity: 0.5, margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Manage Homepage Reviews</h3>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto' }}>
          This section will allow you to dynamically update the testimonials shown on the customer-facing Home page.
        </p>
      </div>
    </div>
  );
}
