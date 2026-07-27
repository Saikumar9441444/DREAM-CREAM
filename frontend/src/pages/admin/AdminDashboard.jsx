import React, { useState, useEffect } from 'react';
import { ShoppingBag, TrendingUp, Users, Package, ArrowUpRight, CheckCircle, Clock, ChefHat, Eye, Plus, Settings, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../../data/orderStore';
import { getProducts } from '../../data/productStore';
import { motion } from 'framer-motion';
import './Admin.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeFlavors: 0,
    lowStock: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersState, setOrdersState] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const orders = await getOrders();
      const products = await getProducts();

      setOrdersState(orders);
      const completedOrders = orders.filter(o => o.status === 'completed' || o.status === 'ready');
      const revenue = completedOrders.reduce((sum, order) => sum + order.totalAmount, 0);

      setMetrics({
        totalOrders: orders.length,
        totalRevenue: revenue,
        activeFlavors: products.filter(p => p.inStock !== false).length,
        lowStock: products.filter(p => p.inStock === false).length
      });

      // Get top 5 recent orders
      setRecentOrders(orders.slice(0, 5));
    };
    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return <span className="status-badge" style={{ background: 'rgba(37, 211, 102, 0.1)', color: '#25D366', fontSize: '0.75rem' }}><CheckCircle size={12} style={{ display: 'inline', marginRight: '4px' }} /> Completed</span>;
      case 'ready': return <span className="status-badge" style={{ background: 'rgba(37, 211, 102, 0.1)', color: '#25D366', fontSize: '0.75rem' }}><CheckCircle size={12} style={{ display: 'inline', marginRight: '4px' }} /> Ready</span>;
      case 'preparing': return <span className="status-badge" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', fontSize: '0.75rem' }}><ChefHat size={12} style={{ display: 'inline', marginRight: '4px' }} /> Preparing</span>;
      default: return <span className="status-badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontSize: '0.75rem' }}><Clock size={12} style={{ display: 'inline', marginRight: '4px' }} /> New</span>;
    }
  };

  const formatTimeAgo = (isoString) => {
    const minutes = Math.floor((new Date() - new Date(isoString)) / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} mins ago`;
    return `${Math.floor(minutes / 60)} hours ago`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '2rem' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Dashboard Overview</h2>

      {/* 1. TOP ROW STAT CARDS (4 Cards) */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <motion.div variants={itemVariants} className="admin-stat-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ background: '#e0f2fe', color: '#0ea5e9', padding: '8px', borderRadius: '8px', alignSelf: 'flex-start' }}><ShoppingBag size={20} /></div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', lineHeight: '1' }}>{metrics.totalOrders}</h2>
          <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Total Orders</h3>
        </motion.div>
        <motion.div variants={itemVariants} className="admin-stat-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ background: '#dcfce7', color: '#16a34a', padding: '8px', borderRadius: '8px', alignSelf: 'flex-start' }}><TrendingUp size={20} /></div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', lineHeight: '1' }}>₹{metrics.totalRevenue.toLocaleString()}</h2>
          <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Total Revenue</h3>
        </motion.div>
        <motion.div variants={itemVariants} className="admin-stat-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ background: '#f3e8ff', color: '#a855f7', padding: '8px', borderRadius: '8px', alignSelf: 'flex-start' }}><Package size={20} /></div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', lineHeight: '1' }}>{metrics.activeFlavors}</h2>
          <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Active Flavors</h3>
        </motion.div>
        <motion.div variants={itemVariants} className="admin-stat-card" style={{ padding: '1.5rem', border: metrics.lowStock > 0 ? '1px solid #fee2e2' : '', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ background: '#fef3c7', color: '#d97706', padding: '8px', borderRadius: '8px', alignSelf: 'flex-start' }}><Users size={20} /></div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', lineHeight: '1', color: metrics.lowStock > 0 ? '#ef4444' : '' }}>{metrics.lowStock}</h2>
          <h3 style={{ margin: 0, fontSize: '0.9rem', color: metrics.lowStock > 0 ? '#ef4444' : 'var(--color-text-muted)', fontWeight: 500 }}>Low Stock Alerts</h3>
        </motion.div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2rem' }}>

        {/* Recent Orders List */}
        <div className="admin-panel" style={{ minWidth: 0 }}>
          <div className="admin-panel-header">
            <h3>Recent Orders</h3>
            <button className="btn-outline-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => navigate('/admin/orders')}>View All</button>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentOrders.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', padding: '2rem' }}>No recent orders.</p>
            ) : (
              recentOrders.map((order, index) => (
                <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#f8fafc', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                      {order.customerName.charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontWeight: 600 }}>{order.customerName}</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{order.items.length} items • {formatTimeAgo(order.timestamp)}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontWeight: 700 }}>₹{order.totalAmount}</p>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar Stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Cash Register (Today) */}
          <div className="admin-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0, height: 'fit-content' }}>
            <div className="admin-panel-header">
              <h3>Daily Cash Register</h3>
              <span style={{ fontSize: '0.8rem', color: '#10b981', background: '#dcfce7', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>OPEN</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b' }}>Cash Payments</span>
              <span style={{ fontWeight: 600 }}>₹{
                ordersState.filter(o => o.paymentMethod === 'Cash' && new Date(o.timestamp).toDateString() === new Date().toDateString())
                  .reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()
              }</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b' }}>Card/UPI Payments</span>
              <span style={{ fontWeight: 600 }}>₹{
                ordersState.filter(o => o.paymentMethod !== 'Cash' && new Date(o.timestamp).toDateString() === new Date().toDateString())
                  .reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()
              }</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 700, paddingTop: '0.5rem' }}>
              <span>Total Today</span>
              <span style={{ color: 'var(--color-primary)' }}>₹{
                ordersState.filter(o => new Date(o.timestamp).toDateString() === new Date().toDateString())
                  .reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()
              }</span>
            </div>

            <button
              onClick={() => alert('Register closed for the day. EOD report generated.')}
              style={{ marginTop: '1rem', padding: '1rem', background: '#f8fafc', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
            >
              Close Register (EOD)
            </button>
          </div>

          {/* Quick Actions */}
          <div className="admin-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0, height: 'fit-content' }}>
            <div className="admin-panel-header">
              <h3>Quick Actions</h3>
            </div>
            <button
              onClick={() => navigate('/admin/products')}
              style={{ padding: '1.2rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Plus size={20} /> Add New Flavor
            </button>
            <button
              onClick={() => navigate('/admin/pos')}
              style={{ padding: '1.2rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <ShoppingCart size={20} /> POS Terminal
            </button>
            <button
              onClick={() => navigate('/admin/settings')}
              style={{ padding: '1.2rem', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Settings size={20} /> Store Settings
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
