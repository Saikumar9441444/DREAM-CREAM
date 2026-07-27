import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, Clock, ChefHat, Play, Check } from 'lucide-react';
import { getOrders, updateOrderStatus, simulateNewOrder } from '../../data/orderStore';
import './Admin.css';

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSimulateOrder = async () => {
    await simulateNewOrder();
    await fetchOrders();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    await fetchOrders();
  };

  const getStatusBadge = (status) => {
    switch(status.toLowerCase()) {
      case 'completed': return <span className="status-badge" style={{ background: 'rgba(37, 211, 102, 0.1)', color: '#25D366' }}><CheckCircle size={14} style={{ display: 'inline', marginRight: '4px' }}/> Completed</span>;
      case 'ready': return <span className="status-badge" style={{ background: 'rgba(37, 211, 102, 0.1)', color: '#25D366' }}><CheckCircle size={14} style={{ display: 'inline', marginRight: '4px' }}/> Ready</span>;
      case 'preparing': return <span className="status-badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><ChefHat size={14} style={{ display: 'inline', marginRight: '4px' }}/> Preparing</span>;
      default: return <span className="status-badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}><Clock size={14} style={{ display: 'inline', marginRight: '4px' }}/> New</span>;
    }
  };

  const formatTimeAgo = (isoString) => {
    const minutes = Math.floor((new Date() - new Date(isoString)) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} mins ago`;
    return `${Math.floor(minutes / 60)} hours ago`;
  };

  const formatItems = (items) => {
    return items.map(item => `${item.quantity}x ${item.name}`).join(', ');
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', margin: 0 }}>Recent Orders</h2>
        <button 
          className="btn-outline-primary"
          style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={handleSimulateOrder}
        >
          <Play size={20} /> Simulate New Order
        </button>
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
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{order.id}</td>
                  <td style={{ fontWeight: 600 }}>{order.customerName}<br/><small style={{ color: '#999' }}>{order.phone}</small></td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{formatItems(order.items)}</td>
                  <td style={{ fontWeight: 700 }}>₹{order.totalAmount}</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>{formatTimeAgo(order.timestamp)}</td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {order.status === 'new' && (
                        <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleStatusChange(order.id, 'preparing')}>Start Prep</button>
                      )}
                      {order.status === 'preparing' && (
                        <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#f59e0b', color: 'white' }} onClick={() => handleStatusChange(order.id, 'ready')}>Mark Ready</button>
                      )}
                      {order.status === 'ready' && (
                        <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#16a34a', color: 'white' }} onClick={() => handleStatusChange(order.id, 'completed')}>Complete</button>
                      )}
                      {order.status === 'completed' && (
                         <span style={{ color: '#16a34a', fontSize: '0.9rem' }}><Check size={18} /></span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
