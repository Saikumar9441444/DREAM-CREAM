import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Send, CheckCircle2, ChevronLeft, ChevronRight, 
  Plus, Minus, Trash2, Copy, MessageSquare, Phone 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ENDPOINTS } from '../api/config';
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

  // Fallback: If cart is empty and not just submitted, redirect back to flavors
  if (cartItems.length === 0 && !submitted) {
    return (
      <div className="orders-page flex flex-col items-center justify-center p-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="opacity-70 mb-8">You haven't added any magic to your order yet.</p>
        <Link to="/products" className="btn-primary">Explore Flavors</Link>
      </div>
    );
  }
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Capture order data from form
    const orderData = {
      customerName: e.target.name.value,
      customerEmail: e.target.email.value,
      customerPhone: e.target.phone.value,
      address: e.target.address.value,
      deliveryType: e.target.type.value,
      deliveryTime: e.target.datetime.value,
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: parseFloat(item.price.replace(/[^\d.]/g, ''))
      })),
      total: finalTotal,
      paymentMethod: paymentMethod
    };

    setLastOrder(orderData);
    setLoading(true);

    try {
      // POST to backend
      const response = await fetch(ENDPOINTS.ORDERS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) throw new Error('Failed to save order');
      
      const savedOrder = await response.json();
      setLastOrder(savedOrder);
      
      // Simulation delay for UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      clearCart();
      
      // Auto-open WhatsApp link
      const waLink = generateWhatsAppLink(savedOrder);
      window.open(waLink, '_blank');

    } catch (err) {
      console.error("Order processing failed:", err);
      alert("Order processing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const TAX_RATE = 0.05; // 5% GST
  const GST_AMOUNT = cartTotalPrice * TAX_RATE;
  const DELIVERY_FEE = 35;
  const PLATFORM_FEE = 5;
  const RESTAURANT_CHARGES = 15;
  
  const finalTotal = cartTotalPrice + GST_AMOUNT + DELIVERY_FEE + PLATFORM_FEE + RESTAURANT_CHARGES;

  const generateWhatsAppLink = (order) => {
    if (!order) return '#';
    const BUSINESS_PHONE = "919014002314"; // Target business phone
    const itemsText = order.items.map(i => `• ${i.name} x ${i.quantity}`).join('\n');
    
    const message = `🍦 *NEW CREAM DREAM ORDER* 🍦\n` +
                    `--------------------------------\n` +
                    `*Customer:* ${order.customerName}\n` +
                    `*Phone:* ${order.customerPhone}\n` +
                    `*Type:* ${order.deliveryType?.toUpperCase() || 'PICKUP'}\n` +
                    `*Date/Time:* ${order.deliveryTime ? new Date(order.deliveryTime).toLocaleString() : 'N/A'}\n` +
                    `*Address:* ${order.address || 'N/A'}\n` +
                    `*Payment:* ${order.paymentMethod?.toUpperCase() || 'COD'}\n\n` +
                    `*ITEMS:*\n${itemsText}\n\n` +
                    `*TOTAL PAYABLE:* ₹${order.total.toFixed(2)}\n` +
                    `--------------------------------\n` +
                    `Please confirm this order. Thank you!`;
    
    return `https://wa.me/${BUSINESS_PHONE}?text=${encodeURIComponent(message)}`;
  };

  const generateSMSLink = (order) => {
    if (!order) return '#';
    // Simplified for SMS length limits
    const itemsText = order.items.map(i => `${i.name} x${i.quantity}`).join(', ');
    const message = `Cream Dream Order: Total ₹${order.total.toFixed(2)}. Items: ${itemsText}. Thank you!`;
    return `sms:${order.customerPhone}?body=${encodeURIComponent(message)}`;
  };

  const copySlipToClipboard = (order) => {
    if (!order) return;
    const itemsText = order.items.map(i => `- ${i.name} x ${i.quantity}`).join('\n');
    const text = `🍦 Cream Dream Order Slip 🍦\nCustomer: ${order.customerName}\nTotal: ₹${order.total.toFixed(2)}\nItems:\n${itemsText}`;
    navigator.clipboard.writeText(text);
    alert("Slip copied to clipboard!");
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
                  <p className="text-left text-sm opacity-70">Your scoops are on the way!</p>
                </div>
              </div>

              <div className="live-tracker mt-8">
                <div className="tracker-line"></div>
                <div className="tracker-steps">
                  <div className="tracker-step active">
                    <div className="step-dot"></div>
                    <span className="step-label">Order Received</span>
                  </div>
                  <div className="tracker-step active animate-pulse-soft">
                    <div className="step-dot"></div>
                    <span className="step-label">Preparing Your Order</span>
                  </div>
                  <div className="tracker-step">
                    <div className="step-dot"></div>
                    <span className="step-label">Out for Delivery</span>
                  </div>
                  <div className="tracker-step">
                    <div className="step-dot"></div>
                    <span className="step-label">Arrived</span>
                  </div>
                </div>
              </div>

              <div className="delivery-partner-card mt-8">
                <div className="partner-info">
                  <div className="partner-avatar">🛵</div>
                  <div className="partner-details">
                    <p className="partner-name">Rahul is on his way</p>
                    <p className="partner-sub">Your delivery partner</p>
                  </div>
                </div>
                <div className="partner-actions">
                  <button className="action-icn"><Phone size={18} /></button>
                  <button className="action-icn"><MessageSquare size={18} /></button>
                </div>
              </div>
              
              <div className="whatsapp-slip-section mt-8">
                <p className="text-xs font-bold opacity-50 mb-4 tracking-widest uppercase">Official Slip</p>
                <div className="flex flex-col gap-3">
                  <a href={generateWhatsAppLink(lastOrder)} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                    <Send size={18} /> WhatsApp Order Slip
                  </a>
                  <div className="flex gap-2">
                    <button onClick={() => copySlipToClipboard(lastOrder)} className="btn-action-outline flex-1">
                      <Copy size={16} /> Copy
                    </button>
                    <Link to="/products" onClick={() => setSubmitted(false)} className="btn-action-outline flex-1">
                      Shop More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="orders-page fade-in">
        <div className="container">
          <div className="empty-cart-state text-center glass-panel">
            <h2>Your Cart is Empty</h2>
            <p className="mt-2 mb-4">Looks like you haven't selected any flavors yet!</p>
            <Link to="/products" className="btn-primary">
              <ChevronLeft size={20} className="mr-2" /> Explore Flavors
            </Link>
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
          <p className="page-subtitle">You're just a few steps away from your sweet escape.</p>
        </header>

        <div className="checkout-grid">
          {/* Cart Summary Column */}
          <div className="cart-summary glass-panel">
            <h2 className="summary-title">Order Summary ({cartTotalItems} items)</h2>
            
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" loading="lazy" style={{ filter: `hue-rotate(${item.hue || 0}deg)` }} />
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <span className="cart-item-price">{item.price}</span>
                  </div>
                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button type="button" onClick={() => removeFromCart(item.id)}>
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => addToCart(item)}>
                        <Plus size={14} />
                      </button>
                    </div>
                    <button 
                      type="button" 
                      className="remove-btn" 
                      onClick={() => clearItemFromCart(item.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-totals bill-details">
              <h3 className="bill-title">Bill Details</h3>
              <div className="bill-row">
                <span>Item Total</span>
                <span>₹{cartTotalPrice.toFixed(2)}</span>
              </div>
              <div className="bill-row">
                <span>Delivery Partner Fee</span>
                <span>₹{DELIVERY_FEE.toFixed(2)}</span>
              </div>
              <div className="bill-row">
                <span>Platform Fee</span>
                <span>₹{PLATFORM_FEE.toFixed(2)}</span>
              </div>
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

          {/* Checkout Form Column */}
          <div className="glass-panel order-form-card">
            <h2 className="form-title">Billing & Delivery</h2>
            <form onSubmit={handleSubmit} className="custom-form">
              <div className="form-row">
                <div className="input-group">
                  <input type="text" id="name" required placeholder=" " />
                  <label htmlFor="name">Full Name</label>
                </div>
                <div className="input-group">
                  <input type="email" id="email" required placeholder=" " />
                  <label htmlFor="email">Email Address</label>
                </div>
              </div>

              <div className="input-group">
                <input type="tel" id="phone" required placeholder=" " />
                <label htmlFor="phone">Phone Number</label>
              </div>

              <div className="form-section-divider">Delivery Options</div>

              <div className="form-row">
                <div className="input-group">
                  <select id="type" required defaultValue="pickup">
                    <option value="pickup">Store Pickup (Free)</option>
                    <option value="delivery">Local Delivery (₹50)</option>
                  </select>
                </div>
                <div className="input-group">
                  <input type="datetime-local" id="datetime" required className="filled" />
                  <label htmlFor="datetime" className="always-float">Time</label>
                </div>
              </div>
              
              <div className="input-group">
                <textarea id="address" rows="2" placeholder=" "></textarea>
                <label htmlFor="address">Delivery / Billing Address</label>
              </div>

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
                    <span className="payment-name">Cash on Delivery</span>
                    <span className="payment-desc">Pay with cash or card at the door/counter.</span>
                  </div>
                  <div className="radio-circle"></div>
                </label>
              </div>

              <button type="submit" className="btn-primary submit-btn">
                Confirm Order - ₹{finalTotal.toFixed(2)} <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
