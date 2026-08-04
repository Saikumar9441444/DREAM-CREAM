import React, { useState, useEffect, useRef } from 'react';
import { Search, Check, X, Bell, Clock, ChefHat, Play, Banknote } from 'lucide-react';
import { getOrders, updateOrderStatus, approveOrder, simulateNewOrder } from '../../data/orderStore';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { BACKEND_URL } from '../../utils/apiConfig';
import './Admin.css';

// ─── Alarm sound (Web Audio API — no file needed) ─────────────────────────────
const playAlarm = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const playBeep = (freq, start, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.6, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };
    playBeep(880, 0, 0.15);
    playBeep(1100, 0.2, 0.15);
    playBeep(880, 0.4, 0.15);
    playBeep(1100, 0.6, 0.25);
  } catch (e) {
    console.log('Audio not available');
  }
};

const ETA_OPTIONS = [5, 10, 15, 20, 30];

const STATUS_COLORS = {
  'Order Placed':    { bg: '#e0f2fe', color: '#0369a1', label: 'New Order' },
  'Approved':        { bg: '#dcfce7', color: '#16a34a', label: 'Approved' },
  'Preparing':       { bg: '#fef3c7', color: '#d97706', label: 'Preparing' },
  'Ready':           { bg: '#d1fae5', color: '#059669', label: 'Ready 🍦' },
  'Served':          { bg: '#dcfce7', color: '#16a34a', label: 'Served' },
  'Paid':            { bg: '#f0fdf4', color: '#166534', label: 'Paid ✓' },
  'Rejected':        { bg: '#fee2e2', color: '#ef4444', label: 'Rejected' },
  'Waiting Approval':{ bg: '#fef3c7', color: '#b45309', label: 'Waiting' },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [notification, setNotification] = useState(null);
  const [selectedEta, setSelectedEta] = useState(15);
  const [approving, setApproving] = useState(false);
  const notifRef = useRef(null);

  const fetchOrders = async () => {
    const data = await getOrders();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();

    // Request browser notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const newSocket = io(import.meta.env.VITE_API_URL || BACKEND_URL);

    newSocket.on('new-order', (order) => {
      fetchOrders();
      setNotification(order);
      setSelectedEta(15);
      playAlarm();

      // Browser notification when tab is in background
      if ('Notification' in window && Notification.permission === 'granted') {
        const source = order.tableNumber ? `Table ${order.tableNumber}` : order.deliveryType;
        new Notification('🍦 New Order — Cream Dream', {
          body: `${source} | ₹${order.totalAmount} | ${(order.items || []).map(i => `${i.quantity}x ${i.name}`).join(', ')}`,
          icon: '/favicon.ico'
        });
      }

      // Auto-hide notification after 60 seconds if ignored
      if (notifRef.current) clearTimeout(notifRef.current);
      notifRef.current = setTimeout(() => setNotification(null), 60000);
    });

    newSocket.on('order-updated', () => fetchOrders());

    return () => {
      newSocket.close();
      if (notifRef.current) clearTimeout(notifRef.current);
    };
  }, []);

  const handleApprove = async () => {
    if (!notification) return;
    setApproving(true);
    const id = notification.id || notification._id;
    await approveOrder(id, selectedEta);
    setApproving(false);
    setNotification(null);
    fetchOrders();
  };

  const handleReject = async () => {
    if (!notification) return;
    const id = notification.id || notification._id;
    await updateOrderStatus(id, 'Rejected');
    setNotification(null);
    fetchOrders();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    fetchOrders();
  };

  const formatTimeAgo = (isoString) => {
    const minutes = Math.floor((new Date() - new Date(isoString)) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  const formatItems = (items) =>
    items.map(i => `${i.quantity}x ${i.name}`).join(', ');

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      (order.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerName || '').toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'Pending')   return matchesSearch && !['Paid', 'Rejected', 'completed', 'Completed'].includes(order.status);
    if (activeTab === 'Completed') return matchesSearch &&  ['Paid', 'completed', 'Completed'].includes(order.status);
    return matchesSearch;
  });

  const getStatusStyle = (status) => STATUS_COLORS[status] || { bg: '#f1f5f9', color: '#64748b', label: status };

  return (
    <div className="fade-in" style={{ position: 'relative' }}>

      {/* ── New Order Notification Popup ─────────────────────────────────────── */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -40 }}
            animate={{ opacity: 1, scale: 1,   y: 0 }}
            exit={{   opacity: 0, scale: 0.85, y: -40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'fixed',
              top: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9999,
              width: '95%',
              maxWidth: '460px',
            }}
          >
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
              borderRadius: '20px',
              padding: '1.75rem',
              color: 'white',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: 'rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Bell size={22} color="#f59e0b" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                    🍦 New Order Received!
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                    {notification.tableNumber ? `Table ${notification.tableNumber}` : notification.deliveryType || 'Takeaway'}
                    {' · '}
                    <span style={{ color: '#f59e0b', fontWeight: 700 }}>₹{notification.totalAmount}</span>
                  </p>
                </div>
              </div>

              {/* Items */}
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.25rem', fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                {(notification.items || []).map((i, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{i.quantity}× {i.name}</span>
                    <span style={{ color: '#94a3b8' }}>₹{(i.price * i.quantity).toFixed(0)}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '0.5rem', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'white' }}>
                  <span>Total</span><span>₹{notification.totalAmount}</span>
                </div>
              </div>

              {/* ETA Selector */}
              <div style={{ marginBottom: '1.25rem' }}>
                <p style={{ margin: '0 0 0.6rem', fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  <Clock size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  Estimated Ready Time
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {ETA_OPTIONS.map(min => (
                    <button
                      key={min}
                      onClick={() => setSelectedEta(min)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '8px',
                        border: selectedEta === min ? '2px solid #22c55e' : '2px solid rgba(255,255,255,0.1)',
                        background: selectedEta === min ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)',
                        color: selectedEta === min ? '#22c55e' : '#94a3b8',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      {min} min
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={handleApprove}
                  disabled={approving}
                  style={{
                    flex: 1, padding: '0.85rem', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white', border: 'none', fontWeight: 800, fontSize: '1rem',
                    cursor: approving ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 15px rgba(34,197,94,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    opacity: approving ? 0.7 : 1, transition: 'all 0.2s'
                  }}
                >
                  <Check size={20} />
                  {approving ? 'Approving...' : `Approve (~${selectedEta} min)`}
                </button>
                <button
                  onClick={handleReject}
                  style={{
                    padding: '0.85rem 1.1rem', borderRadius: '12px',
                    background: 'rgba(239,68,68,0.15)', color: '#f87171',
                    border: '1.5px solid rgba(239,68,68,0.3)', cursor: 'pointer',
                    fontWeight: 700, transition: 'all 0.2s'
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page Header ───────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '2.2rem', margin: 0, fontWeight: 800, color: '#1e293b' }}>Order Management</h2>
        <button className="btn-pro btn-pro-primary" onClick={simulateNewOrder}>
          <Play size={18} /> Simulate New Order
        </button>
      </div>

      <div className="admin-panel-pro">
        {/* Tabs + Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.25rem', borderRadius: '10px' }}>
            {['All', 'Pending', 'Completed'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none',
                  background: activeTab === tab ? '#ffffff' : 'transparent',
                  color: activeTab === tab ? '#0f172a' : '#64748b',
                  fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
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
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none' }}
            />
          </div>
        </div>

        {/* Orders Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table-pro">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Source</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>ETA</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredOrders.length === 0 ? (
                  <tr><td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No orders found.</td></tr>
                ) : filteredOrders.map((order, index) => {
                  const st = getStatusStyle(order.status);
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.04 }}
                    >
                      <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{order.id}</td>
                      <td>
                        {order.tableNumber ? (
                          <span style={{ background: '#e0e7ff', color: '#4f46e5', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            Table {order.tableNumber}
                          </span>
                        ) : (
                          <span style={{ background: '#f1f5f9', color: '#64748b', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            {order.deliveryType}
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{order.customerName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{order.phone}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{formatTimeAgo(order.timestamp)}</div>
                      </td>
                      <td style={{ color: '#475569', fontSize: '0.9rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {formatItems(order.items)}
                      </td>
                      <td style={{ fontWeight: 700, color: '#0f172a' }}>₹{order.totalAmount}</td>
                      <td style={{ fontSize: '0.85rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                        {order.estimatedMinutes ? `~${order.estimatedMinutes} min` : '—'}
                      </td>
                      <td>
                        <span style={{ background: st.bg, color: st.color, padding: '0.25rem 0.7rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {st.label}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {/* New order awaiting approval from table */}
                          {['Order Placed', 'new', 'New'].includes(order.status) && (
                            <>
                              <button className="btn-pro" style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem', background: '#dcfce7', color: '#16a34a', whiteSpace: 'nowrap' }}
                                onClick={() => handleStatusChange(order.id || order._id, 'Approved')}>
                                <Check size={14} /> Approve
                              </button>
                              <button className="btn-pro" style={{ padding: '0.4rem', fontSize: '0.82rem', background: '#fee2e2', color: '#ef4444' }}
                                onClick={() => handleStatusChange(order.id || order._id, 'Rejected')}>
                                <X size={14} />
                              </button>
                            </>
                          )}
                          {['Approved', 'Waiting Approval'].includes(order.status) && (
                            <button className="btn-pro" style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem', background: '#fef3c7', color: '#d97706', whiteSpace: 'nowrap' }}
                              onClick={() => handleStatusChange(order.id || order._id, 'Preparing')}>
                              <ChefHat size={14} /> Preparing
                            </button>
                          )}
                          {['Preparing', 'preparing'].includes(order.status) && (
                            <span style={{ fontSize: '0.82rem', color: '#d97706' }}>Kitchen...</span>
                          )}
                          {order.status === 'Ready' && (
                            <button className="btn-pro" style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem', background: '#dcfce7', color: '#16a34a', whiteSpace: 'nowrap' }}
                              onClick={() => handleStatusChange(order.id || order._id, 'Paid')}>
                              <Banknote size={14} /> Mark Paid
                            </button>
                          )}
                          {['Served'].includes(order.status) && (
                            <button className="btn-pro" style={{ padding: '0.4rem 0.75rem', fontSize: '0.82rem', background: '#dcfce7', color: '#16a34a', whiteSpace: 'nowrap' }}
                              onClick={() => handleStatusChange(order.id || order._id, 'Paid')}>
                              <Banknote size={14} /> Mark Paid
                            </button>
                          )}
                          {['Paid', 'completed', 'Completed', 'Rejected'].includes(order.status) && (
                            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Closed</span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
