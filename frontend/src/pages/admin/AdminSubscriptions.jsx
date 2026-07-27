import React from 'react';
import { Repeat } from 'lucide-react';
import './Admin.css';

export default function AdminSubscriptions() {
  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Repeat size={28} className="text-primary" /> Subscriptions
        </h2>
        <button className="btn-primary">Add Plan</button>
      </div>

      <div className="admin-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <Repeat size={48} style={{ color: 'var(--color-primary)', opacity: 0.5, margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Recurring Orders & Subscriptions</h3>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px', margin: '0 auto' }}>
          This module will manage recurring ice cream deliveries and subscription boxes. The backend integration for billing is pending.
        </p>
      </div>
    </div>
  );
}
