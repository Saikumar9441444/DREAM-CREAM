import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, CheckCircle2, ChevronLeft, ChevronRight, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
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
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    clearCart(); // Empty the cart upon successful order
  };

  const TAX_RATE = 0.08; // 8% tax
  const taxAmount = cartTotalPrice * TAX_RATE;
  const deliveryFee = 3.99;
  
  // Calculate final total based on some dummy delivery rule (if they selected delivery vs pickup)
  // For simplicity, we just add tax to subtotal here. We'll leave delivery fee out unless they explicitly select it in a real app, 
  // but let's add a fixed "₹0 Pickup" or show the fee.
  const finalTotal = cartTotalPrice + taxAmount + (cartItems.length > 0 ? 0 : 0);

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
              <p>Thank you for choosing Cream Dream. We'll send an email confirmation shortly with your order details.</p>
              <Link to="/products" onClick={() => setSubmitted(false)} className="btn-secondary mt-4">
                Continue Shopping
              </Link>
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
                <span>₹${cartTotalPrice.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Tax (8%)</span>
                <span>₹${taxAmount.toFixed(2)}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>₹${finalTotal.toFixed(2)}</span>
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
                Confirm Order - ₹${finalTotal.toFixed(2)} <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
