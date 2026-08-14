import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Outlet, Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, ShoppingCart, Settings, LogOut, Menu, Users, BarChart2, MessageSquare, Star, Archive, Repeat, ClipboardList, Zap, Bell, X, Check, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { BACKEND_URL } from '../../utils/apiConfig';
import './Admin.css';

// ─── Sound (Web Audio API) ────────────────────────────────────────────────────
const playNewOrderSound = () => {
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
  } catch (e) {}
};

const AdminSkeleton = () => (
  <div className="admin-skeleton">
    <div className="skeleton-box skeleton-title"></div>
    <div className="skeleton-card-container">
      <div className="skeleton-box skeleton-card"></div>
      <div className="skeleton-box skeleton-card"></div>
      <div className="skeleton-box skeleton-card"></div>
    </div>
    <div className="skeleton-box skeleton-table"></div>
  </div>
);

const DONE_STATUSES = ['Paid', 'Rejected', 'completed', 'Completed'];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ── Unread order tracking ──────────────────────────────────────────────────
  const [unreadCount, setUnreadCount] = useState(0);
  const [newOrderPopup, setNewOrderPopup] = useState(null); // order to show in popup
  const [selectedEta, setSelectedEta] = useState(15);
  const [approving, setApproving] = useState(false);
  const popupTimerRef = useRef(null);
  const ETA_OPTIONS = [5, 10, 15, 20, 30];

  // ── Auth check ────────────────────────────────────────────────────────────
  useEffect(() => {
    const isAuth = localStorage.getItem('dream_cream_admin_auth');
    if (isAuth !== 'true') {
      navigate('/admin/login', { replace: true });
    } else {
      setIsAuthenticated(true);
    }
    if (window.innerWidth < 992) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, navigate]);

  // ── On login: fetch existing unread orders & show popup ───────────────────
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchUnread = async () => {
      try {
        const BASE = import.meta.env.VITE_API_URL || BACKEND_URL;
        const res = await fetch(`${BASE}/api/orders`);
        if (!res.ok) return;
        const orders = await res.json();

        const lastChecked = localStorage.getItem('dream_cream_admin_last_checked');
        const lastCheckedTime = lastChecked ? new Date(lastChecked).getTime() : 0;

        // Pending orders not yet seen by admin
        const pending = orders.filter(o =>
          !DONE_STATUSES.includes(o.status) &&
          new Date(o.timestamp).getTime() > lastCheckedTime
        );

        if (pending.length > 0) {
          setUnreadCount(pending.length);
          // Show the most recent one in popup
          const latest = pending.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
          setNewOrderPopup(latest);
          setSelectedEta(15);
          playNewOrderSound();

          // Auto-dismiss after 60s
          if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
          popupTimerRef.current = setTimeout(() => setNewOrderPopup(null), 60000);
        }
      } catch (e) {
        console.warn('Could not fetch unread orders:', e.message);
      }
    };

    fetchUnread();
  }, [isAuthenticated]);

  // ── Socket: real-time new orders ──────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;

    const socketUrl = import.meta.env.VITE_API_URL || BACKEND_URL;
    const socketConn = io(socketUrl);

    socketConn.on('new-order', (order) => {
      setUnreadCount(prev => prev + 1);
      setNewOrderPopup(order);
      setSelectedEta(15);
      playNewOrderSound();

      // Browser push notification
      if ('Notification' in window && Notification.permission === 'granted') {
        const source = order.tableNumber ? `Table ${order.tableNumber}` : (order.deliveryType || 'Takeaway');
        new Notification('🍦 New Order — Cream Dream', {
          body: `${source} | ₹${order.totalAmount} | ${(order.items || []).map(i => `${i.quantity}x ${i.name}`).join(', ')}`,
          icon: '/favicon.ico'
        });
      }

      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
      popupTimerRef.current = setTimeout(() => setNewOrderPopup(null), 60000);
    });

    socketConn.on('order-updated', () => {});

    return () => {
      socketConn.disconnect();
      if (popupTimerRef.current) clearTimeout(popupTimerRef.current);
    };
  }, [isAuthenticated]);

  // ── Clear red badge when admin visits /admin/orders ───────────────────────
  useEffect(() => {
    if (location.pathname === '/admin/orders') {
      setUnreadCount(0);
      localStorage.setItem('dream_cream_admin_last_checked', new Date().toISOString());
    }
  }, [location.pathname]);

  // ── Popup actions ─────────────────────────────────────────────────────────
  const handleApprove = async () => {
    if (!newOrderPopup) return;
    setApproving(true);
    try {
      const BASE = import.meta.env.VITE_API_URL || BACKEND_URL;
      const res = await fetch(`${BASE}/api/orders/${newOrderPopup.id || newOrderPopup._id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estimatedMinutes: selectedEta })
      });
      if (res.ok) {
        setNewOrderPopup(null);
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to approve order', err);
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!newOrderPopup) return;
    try {
      const BASE = import.meta.env.VITE_API_URL || BACKEND_URL;
      const res = await fetch(`${BASE}/api/orders/${newOrderPopup.id || newOrderPopup._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Rejected' })
      });
      if (res.ok) {
        setNewOrderPopup(null);
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to reject order', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dream_cream_admin_auth');
    setIsAuthenticated(false);
    navigate('/admin/login', { replace: true });
  };

  const navItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { path: '/admin/orders', icon: <ClipboardList size={18} />, label: 'Orders', badge: unreadCount },
    { path: '/admin/menu', icon: <Package size={18} />, label: 'Menu Management' },
    { path: '/admin/inventory', icon: <Archive size={18} />, label: 'Inventory (Stock)' },
    { path: '/admin/subscriptions', icon: <Repeat size={18} />, label: 'Subscriptions' },
    { path: '/admin/customers', icon: <Users size={18} />, label: 'Customers' },
    { path: '/admin/analytics', icon: <BarChart2 size={18} />, label: 'Analytics' },
    { path: '/admin/enquiries', icon: <MessageSquare size={18} />, label: 'Enquiries' },
    { path: '/admin/testimonials', icon: <Star size={18} />, label: 'Testimonials' },
  ];

  if (!isAuthenticated) {
    return <AdminSkeleton />;
  }

  return (
    <div className={`admin-layout ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
        <div className="admin-sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'space-between' : 'center', marginBottom: '2rem' }}>
          <Link to="/" className="admin-brand" style={{ display: isSidebarOpen ? 'flex' : 'none', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'inherit', margin: 0 }}>
            <img src="/logo.png" alt="Cream Dream Logo" />
            <h2 className="brand-text" style={{ fontSize: '1.1rem', lineHeight: '1.2' }}>
              CREAM<br />DREAM
            </h2>
          </Link>
          <button className="sidebar-toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu size={20} />
          </button>
        </div>

        <nav className="admin-nav">
          {navItems.map((item, index) => {
            const hasUnread = item.badge > 0;
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''} ${hasUnread ? 'has-unread' : ''}`}
                  title={!isSidebarOpen ? item.label : ''}
                  style={{ fontSize: '0.85rem', position: 'relative' }}
                >
                  <div className="nav-icon" style={{ position: 'relative' }}>
                    {item.icon}
                    {/* Red dot indicator on icon when sidebar collapsed */}
                    {hasUnread && !isSidebarOpen && (
                      <span style={{
                        position: 'absolute', top: '-4px', right: '-4px',
                        width: '10px', height: '10px', borderRadius: '50%',
                        background: '#ef4444', border: '2px solid white',
                        animation: 'pulse-red 1.5s infinite'
                      }} />
                    )}
                  </div>
                  <span className="nav-label" style={{ flex: 1 }}>{item.label}</span>
                  {/* Red badge with count */}
                  {hasUnread && isSidebarOpen && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        borderRadius: '12px',
                        padding: '2px 8px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        minWidth: '22px',
                        textAlign: 'center',
                        boxShadow: '0 2px 8px rgba(239,68,68,0.5)',
                        animation: 'pulse-red 1.5s infinite'
                      }}
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </NavLink>
              </motion.div>
            );
          })}
        </nav>

        <div className="admin-sidebar-bottom" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          {isSidebarOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="admin-avatar" style={{ width: '32px', height: '32px', fontSize: '0.9rem' }}>A</div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#1e293b' }}>Admin User</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Store Manager</div>
                </div>
              </div>
              <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%' }} title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} style={{ display: 'flex', justifyContent: 'center', width: '100%', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '1rem 0' }} title="Logout">
              <LogOut size={20} />
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-topbar">
          <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <h2 className="admin-topbar-title">Admin Panel</h2>
          <div className="admin-profile">
            {unreadCount > 0 && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => navigate('/admin/orders')}
                style={{
                  position: 'relative', background: '#fef2f2', border: '1.5px solid #fca5a5',
                  borderRadius: '12px', padding: '0.4rem 0.9rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  color: '#ef4444', fontWeight: 700, fontSize: '0.85rem',
                  animation: 'pulse-red 1.5s infinite'
                }}
              >
                <Bell size={16} />
                {unreadCount} New Order{unreadCount > 1 ? 's' : ''}
              </motion.button>
            )}
            <span className="text-sm font-semibold text-gray-500">Hello, Admin</span>
            <div className="admin-avatar">A</div>
          </div>
        </header>

        <div className="admin-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{ height: '100%' }}
            >
              <Suspense fallback={<AdminSkeleton />}>
                <Outlet />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── New Order Popup ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {newOrderPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -40 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'fixed', top: '24px', left: '50%',
              transform: 'translateX(-50%)', zIndex: 9999,
              width: '95%', maxWidth: '480px'
            }}
          >
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
              borderRadius: '20px', padding: '1.75rem', color: 'white',
              boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.1)',
              position: 'relative'
            }}>
              {/* Close button */}
              <button
                onClick={() => setNewOrderPopup(null)}
                style={{ position: 'absolute', top: '12px', right: '14px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}
              >
                <X size={18} />
              </button>

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bell size={22} color="#f87171" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                    🍦 New Order Received!
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
                    {newOrderPopup.tableNumber ? `Table ${newOrderPopup.tableNumber}` : (newOrderPopup.deliveryType || 'Takeaway')}
                    {' · '}
                    <span style={{ color: '#f59e0b', fontWeight: 700 }}>₹{newOrderPopup.totalAmount}</span>
                    {' · '}
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{newOrderPopup.customerName}</span>
                  </p>
                </div>
              </div>

              {/* Items */}
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.25rem', fontSize: '0.9rem', color: '#cbd5e1' }}>
                {(newOrderPopup.items || []).map((i, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{i.quantity}× {i.name}</span>
                    <span style={{ color: '#94a3b8' }}>₹{(i.price * i.quantity).toFixed(0)}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '0.5rem', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'white' }}>
                  <span>Total</span><span>₹{newOrderPopup.totalAmount}</span>
                </div>
              </div>

              {/* ETA Selector */}
              <div style={{ marginBottom: '1.25rem' }}>
                <p style={{ margin: '0 0 0.6rem', fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Estimated Ready Time
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {ETA_OPTIONS.map(min => (
                    <button
                      key={min}
                      onClick={() => setSelectedEta(min)}
                      style={{
                        padding: '0.45rem 0.85rem', borderRadius: '8px',
                        border: selectedEta === min ? '2px solid #22c55e' : '2px solid rgba(255,255,255,0.1)',
                        background: selectedEta === min ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)',
                        color: selectedEta === min ? '#22c55e' : '#94a3b8',
                        cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', transition: 'all 0.2s'
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

              {/* View All Orders link */}
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button
                  onClick={() => { setNewOrderPopup(null); navigate('/admin/orders'); }}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  View All Orders →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
