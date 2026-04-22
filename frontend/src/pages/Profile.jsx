import React, { useState, useEffect } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Package, Clock, ShoppingBag, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ENDPOINTS } from '../api/config';
import './Profile.css';

export default function Profile() {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If not logged in or still loading auth, skip fetch
    if (!user) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${ENDPOINTS.ORDERS}/user/${encodeURIComponent(user.email)}`);
        if (!response.ok) throw new Error('Failed to fetch order history');
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (authLoading) return <div className="profile-page flex-center"><div className="loader-planet"></div></div>;

  // Protect route
  if (!user) {
    return <Navigate to="/login?redirect=/profile" />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="profile-page fade-in">
      <div className="profile-container">
        
        {/* Header Section */}
        <div className="profile-header">
          <div className="user-info">
            <h1>Hi, {user.displayName || 'Sweet Tooth'}!</h1>
            <p><Mail size={16} /> {user.email}</p>
          </div>
          <button onClick={handleLogout} className="logout-btn-large">
            <LogOut size={18} /> Sign Out
          </button>
        </div>

        {/* Order History Section */}
        <div className="orders-section">
          <h2><ShoppingBag size={24} /> Your Order History</h2>
          
          {loading ? (
            <div className="flex-center py-12">
              <div className="loader-planet"></div>
            </div>
          ) : error ? (
            <div className="glass-panel p-6 text-center text-red-400">
              <p>Could not load your orders at this time.</p>
            </div>
          ) : orders.length === 0 ? (
            <motion.div 
              className="empty-orders glass-panel"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Package size={48} className="mx-auto text-[var(--color-text-muted)]" />
              <h3>No orders yet</h3>
              <p>Looks like you haven't tasted our magic yet.</p>
              <Link to="/products" className="btn-primary inline-flex">Explore Flavors</Link>
            </motion.div>
          ) : (
            <motion.div 
              className="orders-grid"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {orders.map((order) => (
                <motion.div key={order._id} className="order-card glass-panel" variants={itemVariants}>
                  <div className="order-card-header">
                    <div className="order-date-total">
                      <span className="order-date">
                        <Clock size={14} className="inline mr-1" /> 
                        {new Date(order.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                        })}
                      </span>
                      <span className="order-total">₹{order.total.toFixed(2)}</span>
                    </div>
                    <span className={`order-status ${order.status.toLowerCase() === 'pending' ? 'status-pending' : 'status-completed'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-items">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item-row">
                        <span><span className="item-qty">{item.quantity}x</span> {item.name}</span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}
