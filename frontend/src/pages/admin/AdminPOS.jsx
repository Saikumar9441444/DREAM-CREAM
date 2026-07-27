import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Printer, Search } from 'lucide-react';
import { getProducts } from '../../data/productStore';
import { addOrder } from '../../data/orderStore';
import './Admin.css';

export default function AdminPOS() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModifier, setActiveModifier] = useState(null); // holds product being customized
  const [lastOrder, setLastOrder] = useState(null);
  
  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const handleProductClick = (product) => {
    if (product.inStock === false) return;
    // Open modifier modal for every product to keep it simple for the demo
    setActiveModifier(product);
  };

  const handleAddToCart = (modifierText, extraPrice) => {
    if (!activeModifier) return;
    
    const product = activeModifier;
    const finalPrice = product.price + extraPrice;
    const finalName = modifierText ? `${product.name} (${modifierText})` : product.name;
    // Use a unique ID based on product and modifier
    const uniqueId = `${product.id}-${modifierText}`;

    setCart(prev => {
      const existing = prev.find(item => item.id === uniqueId);
      if (existing) {
        return prev.map(item => item.id === uniqueId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, id: uniqueId, name: finalName, price: finalPrice, quantity: 1 }];
    });
    
    setActiveModifier(null);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const [lastOrder, setLastOrder] = useState(null);

  const handleCheckout = (method) => {
    if (cart.length === 0) return;
    
    const orderData = {
      customerName: 'Walk-in Customer',
      phone: 'N/A',
      address: 'Store Pickup',
      deliveryType: 'pickup',
      items: cart.map(c => ({ name: c.name, quantity: c.quantity, price: c.price })),
      totalAmount: totalAmount,
      paymentMethod: method
    };
    
    const newOrder = addOrder(orderData);
    
    setLastOrder(newOrder);
    setCart([]);
    
    // Slight delay to allow React to render the hidden receipt before triggering print
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <>
      {/* Hide the POS UI during printing */}
      <div className="no-print" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', height: 'calc(100vh - 80px)', background: '#f1f5f9' }}>
      {/* Products Area */}
      <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Point of Sale</h2>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input 
              type="text" 
              placeholder="Search flavors..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
          {filteredProducts.map(product => (
            <div 
              key={product.id}
              onClick={() => handleProductClick(product)}
              style={{ 
                background: 'white', borderRadius: '12px', padding: '1rem', cursor: product.inStock === false ? 'not-allowed' : 'pointer', 
                opacity: product.inStock === false ? 0.5 : 1, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', textAlign: 'center', transition: 'transform 0.1s' 
              }}
              onMouseOver={e => e.currentTarget.style.transform = product.inStock !== false ? 'scale(1.05)' : 'scale(1)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--color-primary)', margin: '0 auto 0.5rem' }} />
              <h4 style={{ margin: '0 0 0.25rem', fontSize: '0.9rem', color: '#333' }}>{product.name}</h4>
              <p style={{ margin: 0, fontWeight: 700, color: 'var(--color-primary)' }}>₹{product.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div style={{ background: 'white', borderLeft: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShoppingCart size={20} /> Current Order</h3>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cart.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', marginTop: '2rem' }}>Cart is empty</p>
          ) : (
            cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #e2e8f0', paddingBottom: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem' }}>{item.name}</h4>
                  <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-primary)', fontSize: '0.9rem' }}>₹{item.price}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button onClick={() => updateQuantity(item.id, -1)} style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={14}/></button>
                  <span style={{ fontWeight: 600, width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={14}/></button>
                  <button onClick={() => removeFromCart(item.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', marginLeft: '0.5rem' }}><Trash2 size={16}/></button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div style={{ padding: '1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 700 }}>
            <span>Total Payable</span>
            <span style={{ color: 'var(--color-primary)' }}>₹{totalAmount.toLocaleString()}</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <button onClick={() => handleCheckout('Cash')} style={{ padding: '1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Cash</button>
            <button onClick={() => handleCheckout('UPI/Card')} style={{ padding: '1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>UPI / Card</button>
          </div>
        </div>
      </div>

      {/* Modifier Modal */}
      {activeModifier && (
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Customize {activeModifier.name}</h3>
              <button className="close-btn" onClick={() => setActiveModifier(null)}>X</button>
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <button 
                onClick={() => handleAddToCart('Cup', 0)} 
                style={{ padding: '1.5rem', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Cup (+₹0)
              </button>
              <button 
                onClick={() => handleAddToCart('Waffle Cone', 30)} 
                style={{ padding: '1.5rem', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
              >
                <span>Waffle Cone</span>
                <span style={{ color: 'var(--color-primary)' }}>+₹30</span>
              </button>
              <button 
                onClick={() => handleAddToCart('Cone + Sprinkles', 50)} 
                style={{ padding: '1.5rem', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
              >
                <span>Cone + Sprinkles</span>
                <span style={{ color: 'var(--color-primary)' }}>+₹50</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Receipt Area */}
      {lastOrder && (
        <div className="print-only" style={{ display: 'none' }}>
          <div style={{ width: '80mm', padding: '10mm', fontFamily: 'monospace', color: '#000', fontSize: '12px', lineHeight: '1.4' }}>
            <div style={{ textAlign: 'center', marginBottom: '5mm' }}>
              <h1 style={{ margin: 0, fontSize: '18px' }}>CREAM DREAM</h1>
              <p style={{ margin: '2px 0 0' }}>123 Ice Cream Street</p>
              <p style={{ margin: 0 }}>Tel: 919014002314</p>
              <p style={{ margin: '5px 0' }}>-------------------------</p>
              <h2 style={{ margin: '5px 0', fontSize: '14px' }}>ORDER #{lastOrder.id.split('-')[1]}</h2>
              <p style={{ margin: 0 }}>{new Date(lastOrder.timestamp).toLocaleString()}</p>
              <p style={{ margin: 0 }}>{lastOrder.paymentMethod.toUpperCase()}</p>
            </div>
            
            <table style={{ width: '100%', marginBottom: '5mm', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px dashed #000' }}>
                  <th style={{ textAlign: 'left', paddingBottom: '3px' }}>Item</th>
                  <th style={{ textAlign: 'center', paddingBottom: '3px' }}>Qty</th>
                  <th style={{ textAlign: 'right', paddingBottom: '3px' }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {lastOrder.items.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ paddingTop: '3px' }}>{item.name}</td>
                    <td style={{ textAlign: 'center', paddingTop: '3px' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right', paddingTop: '3px' }}>{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div style={{ borderTop: '1px dashed #000', paddingTop: '5px', marginBottom: '10mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px' }}>
                <span>TOTAL</span>
                <span>₹{lastOrder.totalAmount.toFixed(2)}</span>
              </div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0 }}>Thank you for visiting!</p>
              <p style={{ margin: 0 }}>Enjoy your sweet treat.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
