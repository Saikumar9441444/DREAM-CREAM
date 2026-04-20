import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartSidebar.css';

export default function CartSidebar({ isOpen, onClose }) {
  const { cartItems, cartTotalItems, cartTotalPrice, addToCart, removeFromCart, clearItemFromCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/orders');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="cart-sidebar glass-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="cart-header">
              <h2>Your Cart ({cartTotalItems})</h2>
              <button className="close-cart-btn" onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            <div className="cart-content">
              {cartItems.length === 0 ? (
                <div className="empty-cart flex-center">
                  <p>Your cart is empty.</p>
                  <button className="btn-secondary mt-4" onClick={onClose}>Continue Shopping</button>
                </div>
              ) : (
                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <motion.div key={item._id || item.id} className="cart-item">
                      <img src={item.image} alt={item.name} className="cart-item-image" style={{ filter: `hue-rotate(${item.hue || 0}deg)` }} />
                      <div className="cart-item-details">
                        <h3>{item.name}</h3>
                        <span className="cart-item-price">{item.price}</span>
                      </div>
                      <div className="cart-item-actions">
                        <div className="quantity-controls">
                          <button onClick={() => removeFromCart(item._id || item.id)}><Minus size={14} /></button>
                          <span>{item.quantity}</span>
                          <button onClick={() => addToCart(item)}><Plus size={14} /></button>
                        </div>
                        <button className="remove-btn" onClick={() => clearItemFromCart(item._id || item.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
               <div className="cart-footer">
                 <div className="total-row">
                   <span>Subtotal</span>
                   <span>₹{cartTotalPrice.toFixed(2)}</span>
                 </div>
                 <button className="btn-primary checkout-btn" onClick={handleCheckout}>
                   Proceed to Checkout <Send size={18} />
                 </button>
               </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
