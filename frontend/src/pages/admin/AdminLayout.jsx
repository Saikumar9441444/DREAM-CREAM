import React, { useState, Suspense } from 'react';
import { Outlet, Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, ShoppingCart, Settings, LogOut, Menu, Users, BarChart2, MessageSquare, Star, Archive, Repeat, ClipboardList, Zap, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { BACKEND_URL } from '../../utils/apiConfig';
import './Admin.css';

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

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingApprovalOrder, setPendingApprovalOrder] = useState(null);

  React.useEffect(() => {
    const isAuth = localStorage.getItem('dream_cream_admin_auth');
    if (isAuth !== 'true') {
      navigate('/admin/login', { replace: true });
    } else {
      setIsAuthenticated(true);
    }

    // Collapse sidebar by default on smaller screens
    if (window.innerWidth < 992) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, navigate]);

  React.useEffect(() => {
    if (isAuthenticated) {
      const socketUrl = import.meta.env.VITE_API_URL || BACKEND_URL;
      const socketConn = io(socketUrl);

      socketConn.on('new-order', (order) => {
        if (order.status === 'Waiting Approval') {
          setPendingApprovalOrder(order);
        }
      });

      return () => {
        socketConn.disconnect();
      };
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('dream_cream_admin_auth');
    setIsAuthenticated(false);
    navigate('/admin/login', { replace: true });
  };

  const handleApprove = async () => {
    if (!pendingApprovalOrder) return;
    try {
      const socketUrl = import.meta.env.VITE_API_URL || BACKEND_URL;
      const res = await fetch(`${socketUrl}/api/orders/${pendingApprovalOrder.id || pendingApprovalOrder._id}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estimatedMinutes: 15 })
      });
      if (res.ok) {
        setPendingApprovalOrder(null);
      }
    } catch (err) {
      console.error("Failed to approve order", err);
    }
  };

  const handleReject = async () => {
    if (!pendingApprovalOrder) return;
    try {
      const socketUrl = import.meta.env.VITE_API_URL || BACKEND_URL;
      const res = await fetch(`${socketUrl}/api/orders/${pendingApprovalOrder.id || pendingApprovalOrder._id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Rejected' })
      });
      if (res.ok) {
        setPendingApprovalOrder(null);
      }
    } catch (err) {
      console.error("Failed to reject order", err);
    }
  };

  const navItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { path: '/admin/orders', icon: <ClipboardList size={18} />, label: 'Orders' },
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
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                title={!isSidebarOpen ? item.label : ""}
                style={{ fontSize: '0.85rem' }}
              >
                <div className="nav-icon">{item.icon}</div>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </motion.div>
          ))}
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

      {/* Real-time Order Approval Popup */}
      <AnimatePresence>
        {pendingApprovalOrder && (
          <div className="admin-popup-overlay">
            <motion.div 
              className="admin-popup-card"
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <div className="popup-header" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ background: '#fef3c7', color: '#d97706', padding: '0.6rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bell size={24} className="bell-glow" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>Dine-In Approval Request</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Order #{pendingApprovalOrder.id ? pendingApprovalOrder.id.slice(-6) : 'Instant'}</span>
                </div>
              </div>
              
              <div className="popup-body" style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>Location</span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#d97706' }}>Table {pendingApprovalOrder.tableNumber}</span>
                </div>
                
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {pendingApprovalOrder.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>
                      <span>{item.quantity}x {item.name}</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800, color: '#1e293b' }}>
                  <span>Total Amount</span>
                  <span>₹{pendingApprovalOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="popup-actions" style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn-pro" style={{ flex: 1, background: '#f1f5f9', color: '#64748b', border: '1px solid #cbd5e1', padding: '0.8rem', fontSize: '0.95rem' }} onClick={handleReject}>
                  Reject
                </button>
                <button className="btn-pro btn-pro-primary" style={{ flex: 2, background: '#22c55e', color: '#ffffff', border: 'none', padding: '0.8rem', fontSize: '0.95rem', boxShadow: '0 4px 12px rgba(34,197,94,0.3)' }} onClick={handleApprove}>
                  Approve (Send to Kitchen)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
