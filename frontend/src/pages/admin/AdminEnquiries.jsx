import React from 'react';
import { MessageSquare, Mail } from 'lucide-react';
import './Admin.css';

export default function AdminEnquiries() {
  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={28} className="text-primary" /> Enquiries
        </h2>
      </div>

      <div className="admin-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <Mail size={48} style={{ color: 'var(--color-primary)', opacity: 0.5, margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Customer Messages</h3>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto' }}>
          Form submissions from the Contact Page will appear here. The backend mail service integration is currently pending.
        </p>
      </div>
    </div>
  );
}
