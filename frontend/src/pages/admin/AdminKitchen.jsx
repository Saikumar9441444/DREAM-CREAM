import React, { useState, useEffect } from 'react';
import { ChefHat, CheckCircle2, Clock } from 'lucide-react';
import { io } from 'socket.io-client';
import { getOrders, updateOrderStatus } from '../../data/orderStore';
import { motion, AnimatePresence } from 'framer-motion';
import './Admin.css';

export default function AdminKitchen() {
  const [orders, setOrders] = useState([]);
  const [socket, setSocket] = useState(null);

  const fetchOrders = async () => {
    const data = await getOrders();
    setOrders(data.filter(o => !['Paid', 'Rejected', 'completed', 'Completed'].includes(o.status)));
  };

  useEffect(() => {
    fetchOrders();

    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('new-order', () => {
      fetchOrders();
    });

    newSocket.on('order-updated', () => {
      fetchOrders();
    });

    return () => newSocket.close();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    fetchOrders();
  };

  const activeOrders = orders.filter(o => 
    ['Order Placed', 'Waiting Approval', 'Preparing', 'new', 'preparing', 'New'].includes(o.status)
  );

  return (
    <div className="admin-kitchen fade-in" style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <ChefHat size={32} color="var(--color-primary)" />
        <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 800, color: '#1e293b' }}>Kitchen Display System</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        <AnimatePresence>
          {activeOrders.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: '#64748b' }}>
              <h2 style={{ color: '#475569' }}>No active orders. Kitchen is clear!</h2>
            </div>
          ) : (
            activeOrders.map(order => (
              <motion.div
                key={order.id || order._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="admin-panel-pro"
                style={{
                  borderLeft: order.status === 'Preparing' || order.status === 'preparing' ? '6px solid #f59e0b' : '6px solid #ef4444',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1e293b' }}>
                        {order.tableNumber ? `Table ${order.tableNumber}` : 'Takeaway/Delivery'}
                      </h2>
                      {order.deliveryType === 'Parcel' && (
                        <span style={{ 
                          background: '#fef3c7', 
                          color: '#d97706', 
                          padding: '0.15rem 0.45rem', 
                          borderRadius: '6px', 
                          fontSize: '0.7rem', 
                          fontWeight: '800',
                          border: '1px solid #fde68a',
                          letterSpacing: '0.5px'
                        }}>
                          PARCEL
                        </span>
                      )}
                    </div>
                    <span style={{ color: '#64748b', fontSize: '0.9rem' }}>#{order.id ? order.id.slice(-6) : 'Order'}</span>
                  </div>
                  <div style={{ 
                    background: order.status === 'Preparing' || order.status === 'preparing' ? '#fef3c7' : '#fee2e2', 
                    color: order.status === 'Preparing' || order.status === 'preparing' ? '#d97706' : '#dc2626',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    fontSize: '0.85rem'
                  }}>
                    {order.status === 'Order Placed' ? 'Waiting Approval' : order.status}
                  </div>
                </div>

                <div style={{ flex: 1, marginBottom: '0.5rem' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 600, color: '#334155' }}>
                      <span><span style={{ color: 'var(--color-primary)', marginRight: '0.5rem' }}>{item.quantity}x</span> {item.name}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                  {['Order Placed', 'Waiting Approval', 'New', 'new'].includes(order.status) && (
                    <button 
                      onClick={() => handleStatusChange(order.id || order._id, 'Preparing')}
                      className="btn-pro btn-pro-primary"
                      style={{ flex: 1, background: '#f59e0b', padding: '0.8rem', fontSize: '1rem', boxShadow: '0 4px 10px rgba(245, 158, 11, 0.3)' }}
                    >
                      <ChefHat size={20} /> Mark Preparing
                    </button>
                  )}
                  {['Preparing', 'preparing'].includes(order.status) && (
                    <button 
                      onClick={() => handleStatusChange(order.id || order._id, 'Served')}
                      className="btn-pro btn-pro-primary"
                      style={{ flex: 1, background: '#22c55e', padding: '0.8rem', fontSize: '1rem', boxShadow: '0 4px 10px rgba(34, 197, 94, 0.3)' }}
                    >
                      <CheckCircle2 size={20} /> Mark Served
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
