import React, { useState } from 'react';
import { Search, CheckCircle, Clock, ChefHat } from 'lucide-react';
import './Admin.css';

const mockOrders = [
  { id: 'ORD-001', customer: 'John Doe', items: '2x Strawberry Dream, 1x Classic Vanilla', total: '₹1,245', status: 'Pending', date: 'Just now' },
  { id: 'ORD-002', customer: 'Sarah Smith', items: '1x Chocolate Fudge Brownie', total: '₹450', status: 'Preparing', date: '5 mins ago' },
  { id: 'ORD-003', customer: 'Mike Johnson', items: '3x Mango Sorbet', total: '₹890', status: 'Completed', date: '1 hour ago' },
  { id: 'ORD-004', customer: 'Emma Wilson', items: '1x Pistachio Delight, 2x Chocolate Thick Shake', total: '₹1,560', status: 'Completed', date: '2 hours ago' },
];

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Completed': return <span className="status-badge" style={{ background: 'rgba(37, 211, 102, 0.1)', color: '#25D366' }}><CheckCircle size={14} style={{ display: 'inline', marginRight: '4px' }}/> Completed</span>;
      case 'Preparing': return <span className="status-badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><ChefHat size={14} style={{ display: 'inline', marginRight: '4px' }}/> Preparing</span>;
      default: return <span className="status-badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}><Clock size={14} style={{ display: 'inline', marginRight: '4px' }}/> Pending</span>;
    }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', margin: 0 }}>Recent Orders</h2>
      </div>
      
      <div className="admin-panel">
        <div className="admin-panel-header" style={{ borderBottom: '1px solid #eee', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>
        </div>
        
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{order.id}</td>
                  <td style={{ fontWeight: 600 }}>{order.customer}</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{order.items}</td>
                  <td style={{ fontWeight: 700 }}>{order.total}</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{order.date}</td>
                  <td>{getStatusBadge(order.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
