import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Send, CheckCircle2, ChevronLeft,
  Plus, Minus, Trash2, Copy, Star
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { io } from 'socket.io-client';
import './Orders.css';

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

  // Socket.io for live tracking
  useEffect(() => {
    if (submitted && lastOrder) {
      const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
      setSocket(newSocket);

      newSocket.on('order-updated', (updatedOrder) => {
        if (updatedOrder.id === lastOrder.id || updatedOrder._id === lastOrder._id || updatedOrder.id === lastOrder._id) {
          setLastOrder(updatedOrder);
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
  const RESTAURANT_CHARGES = 15;
  
  const finalTotal = cartTotalPrice + GST_AMOUNT + DELIVERY_FEE + PLATFORM_FEE + RESTAURANT_CHARGES;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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

  const getStepClass = (stepName) => {
    if (!lastOrder) return '';
    const s = lastOrder.status;
    const orderIndex = ['Order Placed', 'Waiting Approval', 'Preparing', 'Served', 'Paid'].indexOf(s);
    const stepIndex = ['Order Placed', 'Waiting Approval', 'Preparing', 'Served', 'Paid'].indexOf(stepName);
    
    if (orderIndex >= stepIndex) return 'active';
    return '';
  };

  if (submitted) {
    return (
      <div className="orders-page fade-in">
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

              <div className="live-tracker mt-8">
                <div className="tracker-line"></div>
                <div className="tracker-steps" style={{ flexDirection: isDineIn ? 'column' : 'row', gap: '1rem' }}>
                  <div className={`tracker-step ${getStepClass('Order Placed')}`}>
                    <div className="step-dot"></div>
                    <span className="step-label">✔ Order Placed</span>
                  </div>
                  <div className={`tracker-step ${getStepClass('Waiting Approval')}`}>
                    <div className="step-dot"></div>
                    <span className="step-label">🟡 Waiting Approval</span>
                  </div>
                  <div className={`tracker-step ${getStepClass('Preparing')}`}>
                    <div className="step-dot"></div>
                    <span className="step-label">🟡 Preparing</span>
                  </div>
                  <div className={`tracker-step ${getStepClass('Served')}`}>
                    <div className="step-dot"></div>
                    <span className="step-label">🟡 Served</span>
                  </div>
                  <div className={`tracker-step ${getStepClass('Paid')}`}>
                    <div className="step-dot"></div>
                    <span className="step-label">✔ Paid</span>
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
              <div className="bill-row">
                <span>GST & Restaurant Charges</span>
                <span>₹{(GST_AMOUNT + RESTAURANT_CHARGES).toFixed(2)}</span>
              </div>
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
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required={!isDineIn} placeholder=" " />
                  <label htmlFor="name">Full Name {isDineIn && '(Optional)'}</label>
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
