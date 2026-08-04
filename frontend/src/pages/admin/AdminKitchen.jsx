import React, { useState, useEffect } from 'react';
import { ChefHat, CheckCircle2, Clock, Zap } from 'lucide-react';
import { io } from 'socket.io-client';
import { getOrders, updateOrderStatus, markOrderReady } from '../../data/orderStore';
import { motion, AnimatePresence } from 'framer-motion';
import { BACKEND_URL } from '../../utils/apiConfig';
import './Admin.css';

// ─── Alarm sound for new orders ───────────────────────────────────────────────
const playKitchenBell = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const playBeep = (freq, start, dur) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'triangle';
      gain.gain.setValueAtTime(0.5, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur);
    };
    playBeep(1000, 0, 0.2);
    playBeep(1300, 0.25, 0.2);
    playBeep(1000, 0.5, 0.35);
  } catch (e) {}
};

const ACTIVE_STATUSES = ['Order Placed', 'Approved', 'Waiting Approval', 'Preparing', 'new', 'preparing', 'New'];

const STATUS_CARD_COLOR = {
  'Order Placed':    { border: '#ef4444', bg: '#fee2e2', label: '🔴 New', color: '#dc2626' },
  'Approved':        { border: '#22c55e', bg: '#dcfce7', label: '✅ Approved', color: '#16a34a' },
  'Waiting Approval':{ border: '#f59e0b', bg: '#fef3c7', label: '⏳ Waiting', color: '#d97706' },
  'Preparing':       { border: '#f59e0b', bg: '#fef9c3', label: '🍳 Preparing', color: '#d97706' },
};

export default function AdminKitchen() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const data = await getOrders();
    setOrders(data.filter(o => !['Paid', 'Rejected', 'completed', 'Completed', 'Ready'].includes(o.status)));
  };

  useEffect(() => {
    fetchOrders();

    const newSocket = io(import.meta.env.VITE_API_URL || BACKEND_URL);

    newSocket.on('new-order', () => {
      fetchOrders();
      playKitchenBell();
    });

    newSocket.on('order-updated', () => fetchOrders());

    return () => newSocket.close();
  }, []);

  const handleStartPreparing = async (orderId) => {
    await updateOrderStatus(orderId, 'Preparing');
    fetchOrders();
  };

  const handleMarkReady = async (orderId) => {
    await markOrderReady(orderId);
    fetchOrders();
  };

  const activeOrders = orders.filter(o => ACTIVE_STATUSES.includes(o.status));

  const getElapsedTime = (timestamp) => {
    const diff = Math.floor((new Date() - new Date(timestamp)) / 60000);
    if (diff < 1) return 'Just now';
    return `${diff} min ago`;
  };

  return (
    <div className="admin-kitchen fade-in" style={{ paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
        <ChefHat size={36} color="var(--color-primary)" />
        <div>
          <h1 style={{ fontSize: '2.2rem', margin: 0, fontWeight: 800, color: '#1e293b' }}>Kitchen Display</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
            {activeOrders.length === 0
              ? '✅ All clear — kitchen is empty!'
              : `${activeOrders.length} active order${activeOrders.length > 1 ? 's' : ''} in progress`}
          </p>
        </div>
      </div>

      {/* Live indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 0 3px rgba(34,197,94,0.2)', animation: 'pulse 2s infinite' }} />
        <span style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: 600 }}>Live — updates in real-time</span>
      </div>

      {/* Order Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        <AnimatePresence>
          {activeOrders.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 2rem', color: '#64748b' }}>
              <ChefHat size={60} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
              <h2 style={{ color: '#94a3b8', fontWeight: 600 }}>No active orders</h2>
              <p style={{ color: '#cbd5e1' }}>New orders will appear here instantly</p>
            </div>
          ) : activeOrders.map(order => {
            const sc = STATUS_CARD_COLOR[order.status] || { border: '#94a3b8', bg: '#f8fafc', label: order.status, color: '#64748b' };
            const isPreparing = ['Preparing', 'preparing'].includes(order.status);
            const isApproved  = ['Approved', 'Waiting Approval'].includes(order.status);
            const isNew       = ['Order Placed', 'new', 'New'].includes(order.status);

            return (
              <motion.div
                key={order.id || order._id}
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className="admin-panel-pro"
                style={{
                  borderLeft: `5px solid ${sc.border}`,
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  background: '#fff'
                }}
              >
                {/* Card Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#1e293b' }}>
                        {order.tableNumber ? `🪑 Table ${order.tableNumber}` : '🥡 Takeaway/Delivery'}
                      </h2>
                      {order.deliveryType === 'Parcel' && (
                        <span style={{ background: '#fef3c7', color: '#d97706', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, border: '1px solid #fde68a' }}>
                          PARCEL
                        </span>
                      )}
                    </div>
                    <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                      #{(order.id || '').slice(-6)} · {getElapsedTime(order.timestamp)}
                    </span>
                  </div>
                  <span style={{
                    background: sc.bg, color: sc.color,
                    padding: '0.3rem 0.75rem', borderRadius: '20px',
                    fontWeight: 700, fontSize: '0.82rem', whiteSpace: 'nowrap'
                  }}>
                    {sc.label}
                  </span>
                </div>

                {/* ETA if set */}
                {order.estimatedMinutes && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f0fdf4', padding: '0.5rem 0.85rem', borderRadius: '8px' }}>
                    <Clock size={14} color="#16a34a" />
                    <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 600 }}>
                      Estimated: ~{order.estimatedMinutes} minutes
                    </span>
                  </div>
                )}

                {/* Items List */}
                <div style={{ flex: 1 }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '1.05rem', fontWeight: 600, color: '#334155' }}>
                      <span><span style={{ color: 'var(--color-primary)', marginRight: '0.4rem' }}>{item.quantity}×</span>{item.name}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                  {(isNew || isApproved) && (
                    <button
                      onClick={() => handleStartPreparing(order.id || order._id)}
                      className="btn-pro btn-pro-primary"
                      style={{ flex: 1, background: 'linear-gradient(135deg, #f59e0b, #d97706)', padding: '0.85rem', fontSize: '1rem', boxShadow: '0 4px 12px rgba(245,158,11,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      <ChefHat size={20} /> Start Preparing
                    </button>
                  )}
                  {isPreparing && (
                    <button
                      onClick={() => handleMarkReady(order.id || order._id)}
                      className="btn-pro btn-pro-primary"
                      style={{ flex: 1, background: 'linear-gradient(135deg, #22c55e, #16a34a)', padding: '0.85rem', fontSize: '1rem', boxShadow: '0 4px 12px rgba(34,197,94,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      <Zap size={20} /> Mark Ready 🍦
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
