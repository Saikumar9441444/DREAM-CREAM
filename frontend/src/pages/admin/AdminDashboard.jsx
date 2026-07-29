import React, { useState, useEffect } from 'react';
import { Star, ShoppingBag, TrendingUp, Users, Package, ArrowUpRight, CheckCircle, Clock, ChefHat, Play, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../../data/orderStore';
import { motion } from 'framer-motion';
import './Admin.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    todaysSales: 0,
    pendingOrders: 0,
    preparingOrders: 0,
    servedOrders: 0,
    completedOrders: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [ordersState, setOrdersState] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const orders = await getOrders();
      setOrdersState(orders);

      const today = new Date().toDateString();
      const todaysOrders = orders.filter(o => new Date(o.timestamp).toDateString() === today);
      
      const sales = todaysOrders.reduce((sum, order) => sum + order.totalAmount, 0);
      const pending = orders.filter(o => ['Order Placed', 'Waiting Approval', 'New', 'new'].includes(o.status)).length;
      const preparing = orders.filter(o => ['Preparing', 'preparing'].includes(o.status)).length;
      const served = orders.filter(o => ['Served'].includes(o.status)).length;
      const completed = orders.filter(o => ['Paid', 'completed', 'Completed'].includes(o.status)).length;

      setMetrics({
        todaysSales: sales,
        pendingOrders: pending,
        preparingOrders: preparing,
        servedOrders: served,
        completedOrders: completed
      });

      // Get top 5 recent orders
      setRecentOrders(orders.slice(0, 5));
    };
    fetchData();
  }, []);

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
      <h2 style={{ fontSize: '2.2rem', marginBottom: '2rem', fontWeight: 800, color: '#1e293b' }}>Dashboard Overview</h2>

      {/* TOP ROW STAT CARDS */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Today's Sales */}
        <motion.div variants={itemVariants} className="stat-card-green" style={{ padding: '1.5rem', borderRadius: '16px', color: 'white', background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', opacity: 0.9 }}>Today's Sales</h3>
          <h2 style={{ margin: 0, fontSize: '2.5rem' }}>₹{metrics.todaysSales.toLocaleString()}</h2>
        </motion.div>

        {/* Pending Orders */}
        <motion.div variants={itemVariants} className="stat-card-purple" style={{ padding: '1.5rem', borderRadius: '16px', color: 'white', background: 'linear-gradient(135deg, #a855f7, #9333ea)' }}>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', opacity: 0.9 }}>Pending Orders</h3>
          <h2 style={{ margin: 0, fontSize: '2.5rem' }}>{metrics.pendingOrders}</h2>
        </motion.div>

        {/* Preparing Orders */}
        <motion.div variants={itemVariants} className="stat-card-orange" style={{ padding: '1.5rem', borderRadius: '16px', color: 'white', background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', opacity: 0.9 }}>Preparing Orders</h3>
          <h2 style={{ margin: 0, fontSize: '2.5rem' }}>{metrics.preparingOrders}</h2>
        </motion.div>

        {/* Served Orders */}
        <motion.div variants={itemVariants} className="stat-card-blue" style={{ padding: '1.5rem', borderRadius: '16px', color: 'white', background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', opacity: 0.9 }}>Served Orders</h3>
          <h2 style={{ margin: 0, fontSize: '2.5rem' }}>{metrics.servedOrders}</h2>
        </motion.div>

        {/* Completed Orders */}
        <motion.div variants={itemVariants} className="stat-card-teal" style={{ padding: '1.5rem', borderRadius: '16px', color: 'white', background: 'linear-gradient(135deg, #14b8a6, #0d9488)' }}>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', opacity: 0.9 }}>Completed Orders</h3>
          <h2 style={{ margin: 0, fontSize: '2.5rem' }}>{metrics.completedOrders}</h2>
        </motion.div>

      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Left Column Stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: 0 }}>
          {/* Recent Orders List */}
          <div className="admin-panel-pro" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>Recent Orders</h3>
              <button className="btn-pro btn-pro-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }} onClick={() => navigate('/admin/orders')}>View All</button>
            </div>

            <div style={{ flex: 1, overflowX: 'auto' }}>
              <table className="admin-table-pro">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Time</th>
                    <th style={{ textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>No recent orders.</td></tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,123,156,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                              {order.customerName.charAt(0)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: '#1e293b' }}>
                                {order.customerName} {order.tableNumber ? `(Table ${order.tableNumber})` : ''}
                              </div>
                              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{order.items.length} items</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          {['Paid', 'completed', 'Completed'].includes(order.status) ? (
                            <span className="badge-pro success">Paid</span>
                          ) : ['Preparing', 'preparing'].includes(order.status) ? (
                            <span className="badge-pro warning">Preparing</span>
                          ) : ['Served'].includes(order.status) ? (
                            <span className="badge-pro info" style={{ background: '#dcfce7', color: '#16a34a' }}>Served</span>
                          ) : (
                            <span className="badge-pro info">New</span>
                          )}
                        </td>
                        <td style={{ color: '#64748b' }}>{formatTimeAgo(order.timestamp)}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>₹{order.totalAmount}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar Stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Quick Actions Panel */}
          <div className="admin-panel-pro" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button 
                onClick={() => navigate('/admin/orders')}
                className="btn-pro btn-pro-outline" 
                style={{ flexDirection: 'column', padding: '1rem', gap: '0.5rem', height: 'auto', border: '1px solid #e2e8f0', color: '#475569' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'rgba(255,123,156,0.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'transparent'; }}
              >
                <ShoppingBag size={24} />
                <span style={{ fontSize: '0.85rem' }}>View Orders</span>
              </button>
              <button 
                onClick={() => navigate('/admin/menu')}
                className="btn-pro btn-pro-outline" 
                style={{ flexDirection: 'column', padding: '1rem', gap: '0.5rem', height: 'auto', border: '1px solid #e2e8f0', color: '#475569' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'rgba(255,123,156,0.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'transparent'; }}
              >
                <Package size={24} />
                <span style={{ fontSize: '0.85rem' }}>Add Item</span>
              </button>
              <button 
                onClick={() => navigate('/admin/kitchen')}
                className="btn-pro btn-pro-outline" 
                style={{ flexDirection: 'column', padding: '1rem', gap: '0.5rem', height: 'auto', border: '1px solid #e2e8f0', color: '#475569' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'rgba(255,123,156,0.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'transparent'; }}
              >
                <ChefHat size={24} />
                <span style={{ fontSize: '0.85rem' }}>Kitchen</span>
              </button>
              <button 
                onClick={() => window.print()}
                className="btn-pro btn-pro-outline" 
                style={{ flexDirection: 'column', padding: '1rem', gap: '0.5rem', height: 'auto', border: '1px solid #e2e8f0', color: '#475569' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = 'rgba(255,123,156,0.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'transparent'; }}
              >
                <TrendingUp size={24} />
                <span style={{ fontSize: '0.85rem' }}>Report</span>
              </button>
            </div>
          </div>

          {/* Register Today Panel */}
          <div className="admin-panel-pro" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>Register Today</h3>
              <span className="badge-pro success">OPEN</span>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', marginBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ color: '#475569', fontWeight: 500 }}>Cash</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>₹{
                  ordersState.filter(o => o.paymentMethod === 'cod' && new Date(o.timestamp).toDateString() === new Date().toDateString())
                    .reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()
                }</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', marginBottom: '0.75rem', borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ color: '#475569', fontWeight: 500 }}>Online</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>₹{
                  ordersState.filter(o => o.paymentMethod !== 'cod' && new Date(o.timestamp).toDateString() === new Date().toDateString())
                    .reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()
                }</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, paddingTop: '0.25rem' }}>
                <span style={{ color: '#0f172a' }}>Total</span>
                <span style={{ color: 'var(--color-primary)' }}>₹{metrics.todaysSales.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
