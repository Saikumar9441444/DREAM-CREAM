import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, Clock, ChefHat, Play, Check, X, Bell } from 'lucide-react';
import { getOrders, updateOrderStatus, simulateNewOrder } from '../../data/orderStore';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import './Admin.css';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [socket, setSocket] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();

    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('new-order', (order) => {
      fetchOrders();
      setNotification(order);
      // Auto-hide notification after 10 seconds if ignored
      setTimeout(() => setNotification(null), 10000);
    });

    newSocket.on('order-updated', () => {
      fetchOrders();
    });

    return () => newSocket.close();
  }, []);

  const handleSimulateOrder = async () => {
    await simulateNewOrder();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    if (notification && (notification.id === orderId || notification._id === orderId)) {
      setNotification(null);
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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'Pending') {
      return matchesSearch && !['Paid', 'Rejected', 'completed', 'Completed'].includes(order.status);
    } else if (activeTab === 'Completed') {
      return matchesSearch && ['Paid', 'completed', 'Completed'].includes(order.status);
    }
    return matchesSearch;
  });

  return (
    <div className="fade-in" style={{ position: 'relative' }}>
      
      {/* Notification Popup */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              zIndex: 1000,
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(10px)',
              padding: '1.5rem',
              borderRadius: '16px',
              color: 'white',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              width: '90%',
              maxWidth: '400px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Bell color="#f59e0b" />
              <h3 style={{ margin: 0 }}>New Order Received</h3>
            </div>
            
            <div style={{ marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
              {notification.tableNumber ? `Table ${notification.tableNumber}` : 'Takeaway/Delivery'}
            </div>
            <div style={{ marginBottom: '1.5rem', color: '#cbd5e1' }}>
              {notification.items?.map(i => `${i.quantity}x ${i.name}`).join(', ')}
              <br/>
              <span style={{ fontWeight: 'bold', color: 'white', display: 'block', marginTop: '0.5rem' }}>
                Total: ₹{notification.totalAmount}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                onClick={() => handleStatusChange(notification.id || notification._id, 'Waiting Approval')}
                style={{ flex: 1, padding: '0.8rem', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Accept
              </button>
              <button 
                onClick={() => handleStatusChange(notification.id || notification._id, 'Rejected')}
                style={{ flex: 1, padding: '0.8rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Reject
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.2rem', margin: 0, fontWeight: 800, color: '#1e293b' }}>Order Management</h2>
        <button 
          className="btn-pro btn-pro-primary"
          onClick={handleSimulateOrder}
        >
          <Play size={18} /> Simulate New Order
        </button>
      </div>
      
      <div className="admin-panel-pro">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.25rem', borderRadius: '10px' }}>
            {['All', 'Pending', 'Completed'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ 
                  padding: '0.5rem 1.25rem', 
                  borderRadius: '8px', 
                  border: 'none',
                  background: activeTab === tab ? '#ffffff' : 'transparent',
                  color: activeTab === tab ? '#0f172a' : '#64748b',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: activeTab === tab ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search by ID or Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none' }}
            />
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table-pro">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Source</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredOrders.length === 0 ? (
                   <tr><td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No orders found.</td></tr>
                ) : filteredOrders.map((order, index) => (
                  <motion.tr 
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{order.id}</td>
                    <td>
                      {order.tableNumber ? (
                         <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Table {order.tableNumber}</span>
                      ) : (
                         <span style={{ background: '#f1f5f9', color: '#64748b', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>{order.deliveryType}</span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{order.customerName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{order.phone}</div>
                    </td>
                    <td style={{ color: '#475569', fontSize: '0.9rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {formatItems(order.items)}
                    </td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>₹{order.totalAmount}</td>
                    <td>
                      {['Paid', 'completed', 'Completed'].includes(order.status) ? (
                        <span className="badge-pro success">Paid</span>
                      ) : ['Rejected'].includes(order.status) ? (
                        <span className="badge-pro error" style={{ background: '#fee2e2', color: '#ef4444' }}>Rejected</span>
                      ) : ['Served'].includes(order.status) ? (
                        <span className="badge-pro info" style={{ background: '#dcfce7', color: '#16a34a' }}>Served</span>
                      ) : ['Preparing', 'preparing'].includes(order.status) ? (
                        <span className="badge-pro warning">Preparing</span>
                      ) : ['Waiting Approval'].includes(order.status) ? (
                        <span className="badge-pro warning" style={{ background: '#fef3c7', color: '#b45309' }}>Waiting Approval</span>
                      ) : (
                        <span className="badge-pro info" style={{ background: '#e0f2fe', color: '#0369a1' }}>New</span>
                      )}
                    </td>
                    <td>
                      {['Order Placed', 'new', 'New'].includes(order.status) && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn-pro" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: '#dcfce7', color: '#16a34a' }} onClick={() => handleStatusChange(order.id || order._id, 'Waiting Approval')}>
                            Accept
                          </button>
                          <button className="btn-pro" style={{ padding: '0.4rem', fontSize: '0.85rem', background: '#fee2e2', color: '#ef4444' }} onClick={() => handleStatusChange(order.id || order._id, 'Rejected')}>
                            <X size={16} />
                          </button>
                        </div>
                      )}
                      {['Waiting Approval'].includes(order.status) && (
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Kitchen...</span>
                      )}
                      {['Preparing', 'preparing'].includes(order.status) && (
                        <button className="btn-pro" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: '#fef3c7', color: '#d97706' }} onClick={() => handleStatusChange(order.id || order._id, 'Served')}>
                          Mark Served
                        </button>
                      )}
                      {['Served'].includes(order.status) && (
                        <button className="btn-pro" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: '#dcfce7', color: '#16a34a' }} onClick={() => handleStatusChange(order.id || order._id, 'Paid')}>
                          <Check size={16} /> Mark Paid
                        </button>
                      )}
                      {['Paid', 'completed', 'Completed', 'Rejected'].includes(order.status) && (
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Closed</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
