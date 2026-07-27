import React from 'react';
import { Users, Search } from 'lucide-react';
import './Admin.css';

export default function AdminCustomers() {
  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={28} className="text-primary" /> Customers
        </h2>
        <button className="btn-primary">Export CSV</button>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header" style={{ borderBottom: '1px solid #eee', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input 
              type="text" 
              placeholder="Search customers..." 
              style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>
        </div>
        
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <h3 style={{ margin: '0 0 1rem' }}>Customer Database</h3>
          <p style={{ color: 'var(--color-text-muted)' }}>Customer profiles and lifetime value metrics will appear here once authentication and user accounts are fully integrated.</p>
        </div>
      </div>
    </div>
  );
}
