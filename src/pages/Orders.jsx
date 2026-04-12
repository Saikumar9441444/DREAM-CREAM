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
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: finalTotal
    };

    setLastOrder(orderData); // Store for WhatsApp slip

    try {
      const resp = await fetch(ENDPOINTS.ORDERS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      if (resp.ok) {
        setSubmitted(true);
        clearCart(); 
      }
    } catch (err) {
      console.error("Order submission failed:", err);
      alert("Failed to connect to the cloud. Please ensure the server is running.");
    }
  };

  const TAX_RATE = 0.08; // 8% tax
  const taxAmount = cartTotalPrice * TAX_RATE;
  const deliveryFee = 3.99;
  
  // Calculate final total based on some dummy delivery rule (if they selected delivery vs pickup)
  // For simplicity, we just add tax to subtotal here. We'll leave delivery fee out unless they explicitly select it in a real app, 
  // but let's add a fixed "₹0 Pickup" or show the fee.
  const finalTotal = cartTotalPrice + taxAmount + (cartItems.length > 0 ? 0 : 0);

  const generateWhatsAppLink = (order) => {
    if (!order) return '#';
    const itemsText = order.items.map(i => `- ${i.name} x ${i.quantity}`).join('\n');
    const message = `🍦 *Cream Dream Order Slip* 🍦\n------------------------------\n*Customer:* ${order.customerName}\n*Total:* ₹${order.total.toFixed(2)}\n\n*Items:*\n${itemsText}\n\nThank you for choosing Cream Dream!`;
    
    // Clean phone number (removing non-digits)
    const cleanPhone = order.customerPhone.replace(/\D/g, '');
    const phoneWithCode = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    
    return `https://wa.me/${phoneWithCode}?text=${encodeURIComponent(message)}`;
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
            <div className="success-message glass-panel text-center fade-in">
              <div className="success-icon animate-float">
                <CheckCircle2 size={64} color="var(--color-primary)" />
              </div>
              <h2 className="mb-2">Order Confirmed!</h2>
              <p>Thank you for choosing Cream Dream. Your order is being prepared with love.</p>
              
              <div className="whatsapp-slip-section mt-6 p-4 glass-panel" style={{ background: 'rgba(72, 209, 204, 0.1)', borderRadius: '20px', border: '1px solid rgba(72, 209, 204, 0.2)' }}>
                <p className="text-sm font-bold opacity-70 mb-3">GET YOUR ORDER SLIP ON WHATSAPP</p>
                <a 
                  href={generateWhatsAppLink(lastOrder)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-primary"
                  style={{ background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}
                >
                  <Send size={18} className="mr-2" /> WhatsApp Slip
                </a>
                
                <div className="flex gap-2 mt-3">
                  <a 
                    href={generateSMSLink(lastOrder)} 
                    className="btn-secondary flex-1 py-3 text-sm flex items-center justify-center gap-2"
                    style={{ background: 'rgba(255,255,255,0.8)', color: 'var(--color-text-main)' }}
                  >
                    <MessageSquare size={16} /> SMS Slip
                  </a>
                  <button 
                    onClick={() => copySlipToClipboard(lastOrder)} 
                    className="btn-secondary flex-1 py-3 text-sm flex items-center justify-center gap-2"
                  >
                    <Copy size={16} /> Copy Text
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-8">
                <Link to="/products" onClick={() => setSubmitted(false)} className="btn-secondary">
                  Continue Shopping
                </Link>
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

            <div className="cart-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>₹{cartTotalPrice.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Tax (8%)</span>
                <span>₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
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
