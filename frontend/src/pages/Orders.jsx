import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Send, CheckCircle2, ChevronLeft,
  Plus, Minus, Trash2, Copy, Star, Clock, BellRing, Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { BACKEND_URL } from '../utils/apiConfig';
import './Orders.css';

// ─── Sound FX for Customer Popups ───────────────────────────────────────────
const playPopupSound = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const playBeep = (freq, start, duration, vol = 0.5) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    if (type === 'approved') {
      playBeep(523.25, 0, 0.2, 0.4); // C5
      playBeep(659.25, 0.15, 0.25, 0.4); // E5
    } else if (type === 'ready') {
      playBeep(587.33, 0, 0.15, 0.4); // D5
      playBeep(880, 0.12, 0.15, 0.4); // A5
      playBeep(1046.5, 0.24, 0.3, 0.4); // C6
    }
  } catch (e) {
    console.log('Audio not available');
  }
};

export default function Orders() {
  const { 
    cartItems, 
    cartTotalItems, 
    cartTotalPrice, 
    addToCart, 
    removeFromCart, 
    clearItemFromCart, 
    clearCart 
  } = useCart();
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [socket, setSocket] = useState(null);
  const [rating, setRating] = useState(0);
  const [rated, setRated] = useState(false);

  // Popups state
  const [approvalPopup, setApprovalPopup] = useState(null);
  const [readyPopup, setReadyPopup] = useState(null);
  
  const tableNumber = localStorage.getItem('dream_cream_table');
  const isDineIn = !!tableNumber;
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [deliveryOption, setDeliveryOption] = useState(isDineIn ? 'dinein' : 'pickup');

  useEffect(() => {
    const saved = localStorage.getItem('dream_cream_billing_details');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({
          ...prev,
          name: parsed.name || prev.name,
          phone: parsed.phone || prev.phone,
          address: parsed.address || prev.address
        }));
      } catch (e) {
        console.error("Failed to parse billing details", e);
      }
    }
  }, []);

  // Socket.io for live tracking & customer alerts
  useEffect(() => {
    if (submitted && lastOrder) {
      const newSocket = io(import.meta.env.VITE_API_URL || BACKEND_URL);
      setSocket(newSocket);

      newSocket.on('order-updated', (updatedOrder) => {
        const orderId = lastOrder.id || lastOrder._id;
        if (updatedOrder.id === orderId || updatedOrder._id === orderId) {
          setLastOrder(updatedOrder);
        }
      });

      newSocket.on('order-approved', (data) => {
        const orderId = lastOrder.id || lastOrder._id;
        if (data.id === orderId) {
          playPopupSound('approved');
          setApprovalPopup({ estimatedMinutes: data.estimatedMinutes });

          // Browser Push Notification if page in background
          if (Notification.permission === 'granted') {
            new Notification('🍦 Order Approved — Cream Dream', {
              body: `Your order is accepted and will be ready in ~${data.estimatedMinutes} minutes!`,
              icon: '/favicon.ico'
            });
          }
        }
      });

      newSocket.on('order-ready', (data) => {
        const orderId = lastOrder.id || lastOrder._id;
        if (data.id === orderId) {
          playPopupSound('ready');
          setReadyPopup(true);

          // Browser Push Notification if page in background
          if (Notification.permission === 'granted') {
            new Notification('🎉 Scoop Ready! — Cream Dream', {
              body: `Your delicious ice cream order is prepared and ready!`,
              icon: '/favicon.ico'
            });
          }
        }
      });

      return () => newSocket.close();
    }
  }, [submitted, lastOrder?.id, lastOrder?._id]);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const TAX_RATE = 0.05; // 5% GST
  const GST_AMOUNT = cartTotalPrice * TAX_RATE;
  const DELIVERY_FEE = deliveryOption === 'delivery' ? 35 : 0;
  const PLATFORM_FEE = deliveryOption === 'delivery' ? 5 : 0;
  const RESTAURANT_CHARGES = isDineIn ? 0 : 15; // Only apply packaging/restaurant fee for delivery/parcel
  
  const finalTotal = cartTotalPrice + GST_AMOUNT + DELIVERY_FEE + PLATFORM_FEE + RESTAURANT_CHARGES;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ask for push notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    let finalAddress = 'Dine-In';
    let finalDeliveryType = 'Dine-In';

    if (deliveryOption === 'dinein') {
      finalDeliveryType = 'Dine-In';
      finalAddress = `Dine-In (Table ${tableNumber})`;
    } else if (deliveryOption === 'parcel') {
      finalDeliveryType = 'Parcel';
      finalAddress = isDineIn ? `Takeaway/Parcel (Table ${tableNumber})` : 'Store Pickup (Parcel)';
    } else if (deliveryOption === 'pickup') {
      finalDeliveryType = 'Parcel';
      finalAddress = 'Store Pickup (Parcel)';
    } else if (deliveryOption === 'delivery') {
      finalDeliveryType = 'Delivery';
      finalAddress = formData.address;
    }

    if (deliveryOption === 'delivery') {
      const billingDetails = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      };
      localStorage.setItem('dream_cream_billing_details', JSON.stringify(billingDetails));
    }

    const orderData = {
      customerName: formData.name || 'Guest',
      phone: formData.phone || 'N/A',
      address: finalAddress,
      tableNumber: tableNumber || null,
      deliveryType: finalDeliveryType,
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: typeof item.price === 'string' ? parseFloat(item.price.replace(/[^\d.]/g, '')) : item.price
      })),
      totalAmount: finalTotal,
      paymentMethod: paymentMethod,
      status: 'Order Placed'
    };

    setLoading(true);

    try {
      const { addOrder } = await import('../data/orderStore.js');
      const savedOrder = await addOrder(orderData);
      
      setLastOrder(savedOrder);
      setSubmitted(true);
      clearCart();
    } catch (err) {
      console.error("Order processing failed:", err);
      alert("Order processing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0 && !submitted) {
    return (
      <div className="orders-page flex-center p-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="opacity-70 mb-8">You haven't added any magic to your order yet.</p>
        <Link to="/products" className="btn-primary">Explore Flavors</Link>
      </div>
    );
  }

  // Modernized Order Status Class Generator
  const getStepClass = (stepName) => {
    if (!lastOrder) return '';
    const currentStatus = lastOrder.status;

    const sequence = ['Order Placed', 'Approved', 'Preparing', 'Ready', 'Paid'];
    const currentIndex = sequence.indexOf(currentStatus);
    const stepIndex = sequence.indexOf(stepName);

    if (currentIndex >= stepIndex) return 'active';
    return '';
  };

  if (submitted) {
    return (
      <div className="orders-page fade-in" style={{ position: 'relative' }}>
        
        {/* ── Approval Animated Popup ────────────────────────────────────────── */}
        <AnimatePresence>
          {approvalPopup && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="glass-panel"
              style={{
                position: 'fixed',
                bottom: '30px',
                left: '20px',
                right: '20px',
                zIndex: 9999,
                padding: '1.5rem',
                border: '2px dashed #22c55e',
                background: 'rgba(15, 23, 42, 0.95)',
                color: 'white',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                maxWidth: '500px',
                margin: '0 auto'
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ background: 'rgba(34,197,94,0.15)', padding: '0.75rem', borderRadius: '12px' }}>
                  <Sparkles size={24} color="#22c55e" />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#22c55e', fontWeight: 800 }}>Order Accepted!</h3>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: '#cbd5e1' }}>
                    Your order is approved. Estimated prep time: <strong style={{ color: 'white' }}>~{approvalPopup.estimatedMinutes} minutes</strong>.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setApprovalPopup(null)}
                style={{
                  position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Ready Animated Popup ───────────────────────────────────────────── */}
        <AnimatePresence>
          {readyPopup && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="glass-panel"
              style={{
                position: 'fixed',
                bottom: '30px',
                left: '20px',
                right: '20px',
                zIndex: 9999,
                padding: '1.5rem',
                border: '2px solid #22c55e',
                background: 'rgba(21, 128, 61, 0.95)',
                color: 'white',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                maxWidth: '500px',
                margin: '0 auto'
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '12px' }}>
                  <BellRing size={24} color="white" />
                </div>
                <div>
                  <h3 style={{ margin: 0, color: 'white', fontWeight: 800 }}>Your Scoop is Ready! 🎉</h3>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', color: '#f0fdf4' }}>
                    {isDineIn 
                      ? "We're serving it at your table right now! Sit back and enjoy." 
                      : "Your package is ready at the counter. Come grab your treats!"}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setReadyPopup(false)}
                style={{
                  position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#f0fdf4', fontSize: '1.2rem', cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="container">
          <div className="order-container">
            <div className="order-tracking-section glass-panel fade-in">
              <div className="success-header">
                <div className="success-icon-circle">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h2 className="text-left">Order Confirmed</h2>
                  <p className="text-left text-sm opacity-70">
                    {isDineIn ? `Table ${tableNumber} - We're on it!` : 'Your scoops are on the way!'}
                  </p>
                </div>
              </div>

              {lastOrder?.estimatedMinutes && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderRadius: '8px', margin: '1.5rem 0' }}>
                  <Clock size={16} color="var(--color-primary)" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                    Estimated prep time: ~{lastOrder.estimatedMinutes} minutes
                  </span>
                </div>
              )}

              {/* Progress Tracker Tracker */}
              <div className="live-tracker mt-8">
                <div className="tracker-line"></div>
                <div className="tracker-steps" style={{ flexDirection: 'column', gap: '1.25rem' }}>
                  <div className={`tracker-step ${getStepClass('Order Placed')}`}>
                    <div className="step-dot"></div>
                    <span className="step-label">✔ Order Placed</span>
                  </div>
                  <div className={`tracker-step ${getStepClass('Approved')}`}>
                    <div className="step-dot"></div>
                    <span className="step-label">✔ Order Approved</span>
                  </div>
                  <div className={`tracker-step ${getStepClass('Preparing')}`}>
                    <div className="step-dot"></div>
                    <span className="step-label">🟡 Preparing Scoop</span>
                  </div>
                  <div className={`tracker-step ${getStepClass('Ready')}`}>
                    <div className="step-dot"></div>
                    <span className="step-label">✨ Ready for Collection / Serving</span>
                  </div>
                  <div className={`tracker-step ${getStepClass('Paid')}`}>
                    <div className="step-dot"></div>
                    <span className="step-label">✔ Paid & Finished</span>
                  </div>
                </div>
              </div>

              {lastOrder?.status === 'Paid' && (
                <div className="rating-section mt-8 text-center" style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px' }}>
                  <h3 style={{ marginBottom: '1rem' }}>Rate your experience</h3>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={32} 
                        color={star <= rating ? '#f59e0b' : '#475569'}
                        fill={star <= rating ? '#f59e0b' : 'none'}
                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                        onClick={() => { setRating(star); setRated(true); }}
                      />
                    ))}
                  </div>
                  {rated && <p style={{ color: '#22c55e', fontWeight: 'bold' }}>Thank you for your feedback!</p>}
                </div>
              )}
              
              <div className="mt-8 text-center">
                <Link to="/products" onClick={() => {setSubmitted(false); setLastOrder(null);}} className="btn-primary">
                  Order More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page fade-in">
      <div className="container checkout-container">
        <header className="page-header text-center checkout-header">
          <h1 className="page-title">Secure Checkout</h1>
          <p className="page-subtitle">
            {isDineIn ? `Dine-In Order for Table ${tableNumber}` : "You're just a few steps away from your sweet escape."}
          </p>
        </header>

        <div className="checkout-grid">
          {/* Cart Summary */}
          <div className="cart-summary glass-panel">
            <h2 className="summary-title">Order Summary ({cartTotalItems} items)</h2>
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item._id || item.id} className="cart-item">
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <span className="cart-item-price">{item.price}</span>
                  </div>
                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button type="button" onClick={() => removeFromCart(item._id || item.id)}><Minus size={14} /></button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => addToCart(item)}><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-totals bill-details">
              <div className="bill-row">
                <span>Item Total</span>
                <span>₹{cartTotalPrice.toFixed(2)}</span>
              </div>
              {!isDineIn && (
                <>
                  <div className="bill-row"><span>Delivery Partner Fee</span><span>₹{DELIVERY_FEE.toFixed(2)}</span></div>
                  <div className="bill-row"><span>Platform Fee</span><span>₹{PLATFORM_FEE.toFixed(2)}</span></div>
                </>
              )}
              {RESTAURANT_CHARGES > 0 && (
                <div className="bill-row">
                  <span>GST & Packaging Charges</span>
                  <span>₹{(GST_AMOUNT + RESTAURANT_CHARGES).toFixed(2)}</span>
                </div>
              )}
              {RESTAURANT_CHARGES === 0 && (
                <div className="bill-row">
                  <span>GST (5%)</span>
                  <span>₹{GST_AMOUNT.toFixed(2)}</span>
                </div>
              )}
              <div className="divider"></div>
              <div className="bill-row grand-total">
                <span>Total Payable</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="glass-panel order-form-card">
            <h2 className="form-title">Details</h2>
            <form onSubmit={handleSubmit} className="custom-form">
              <div className="form-row">
                <div className="input-group">
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required placeholder=" " />
                  <label htmlFor="name">Full Name</label>
                </div>
                <div className="input-group">
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required={!isDineIn} placeholder=" " />
                  <label htmlFor="phone">Phone Number {isDineIn && '(Optional)'}</label>
                </div>
              </div>

              {isDineIn ? (
                <>
                  <div className="form-section-divider">How will you enjoy your order?</div>
                  <div className="payment-methods" style={{ marginBottom: '1rem' }}>
                    <label className={`payment-option ${deliveryOption === 'dinein' ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="deliveryOption" 
                        value="dinein" 
                        checked={deliveryOption === 'dinein'}
                        onChange={() => setDeliveryOption('dinein')}
                      />
                      <div className="payment-details">
                        <span className="payment-name">Eat Here (Dine-In)</span>
                        <span className="payment-desc">We will serve it fresh at Table {tableNumber}</span>
                      </div>
                    </label>
                    <label className={`payment-option ${deliveryOption === 'parcel' ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="deliveryOption" 
                        value="parcel" 
                        checked={deliveryOption === 'parcel'}
                        onChange={() => setDeliveryOption('parcel')}
                      />
                      <div className="payment-details">
                        <span className="payment-name">Takeaway (Parcel)</span>
                        <span className="payment-desc">We will pack it nicely for you to carry</span>
                      </div>
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <div className="form-section-divider">Delivery Options</div>
                  <div className="input-group">
                    <select 
                      id="type" 
                      name="type" 
                      required 
                      value={deliveryOption === 'delivery' ? 'delivery' : 'pickup'} 
                      onChange={(e) => setDeliveryOption(e.target.value)}
                    >
                      <option value="pickup">Store Pickup (Parcel) (Free)</option>
                      <option value="delivery">Local Delivery (₹35)</option>
                    </select>
                  </div>
                  {deliveryOption === 'delivery' && (
                    <div className="input-group">
                      <textarea id="address" name="address" rows="2" value={formData.address} onChange={handleInputChange} placeholder=" " required></textarea>
                      <label htmlFor="address">Delivery / Billing Address</label>
                    </div>
                  )}
                </>
              )}

              <div className="form-section-divider">Payment Method</div>
              <div className="payment-methods">
                <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="cod" 
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-details">
                    <span className="payment-name">{isDineIn ? 'Pay Later (Cash/Card)' : 'Cash on Delivery'}</span>
                  </div>
                </label>
                {isDineIn && (
                  <label className={`payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="online" 
                      checked={paymentMethod === 'online'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-details">
                      <span className="payment-name">Pay Now (Online)</span>
                    </div>
                  </label>
                )}
              </div>

              <button type="submit" className="btn-primary submit-btn mt-4" disabled={loading}>
                {loading ? 'Processing...' : `Place Order - ₹${finalTotal.toFixed(2)}`} <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
