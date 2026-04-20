import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit2, Save, X, LogOut, ShieldCheck, 
  Database, LayoutDashboard, Search, ShoppingBag, 
  Users, Settings, CheckCircle, RefreshCcw, Filter,
  Layers, IceCream, Coffee, Star, MessageSquare, Phone, Copy
} from 'lucide-react';
import { ENDPOINTS } from '../api/config';
import { STATIC_PRODUCTS } from '../data/staticProducts';
import './Admin.css';

// Remove local API_BASE

export default function Admin() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [activeMainTab, setActiveMainTab] = useState('inventory');
  const [inventoryFilter, setInventoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data States
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [siteContent, setSiteContent] = useState([]);

  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: 'Dairy', price: '', rating: 4.5, image: '', hue: 0 });
  const [dbStatus, setDbStatus] = useState('Checking...');

  // 🔔 New Order Notification States
  const [newOrderAlert, setNewOrderAlert] = useState(null); // order to show in popup
  const [alertQueue, setAlertQueue] = useState([]);         // queue of new orders

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Products
      try {
        const prodRes = await fetch(ENDPOINTS.PRODUCTS);
        if (prodRes.ok) {
          const data = await prodRes.json();
          setProducts(data.length > 0 ? data : STATIC_PRODUCTS);
          setDbStatus('Connected to Cloud');
        } else {
          setProducts(STATIC_PRODUCTS);
          setDbStatus('Using Local Fallback');
        }
      } catch (e) {
        console.warn("Backend products unavailable, using static fallback.");
        setProducts(STATIC_PRODUCTS);
        setDbStatus('Backend Offline');
      }

      // 2. Fetch Orders & detect new ones for popup
      try {
        const orderRes = await fetch(ENDPOINTS.ORDERS);
        if (orderRes.ok) {
          const freshOrders = await orderRes.json();
          setOrders(freshOrders);

          // Check for orders not yet notified
          const notified = JSON.parse(localStorage.getItem('cream_dream_notified_orders') || '[]');
          const newOrders = freshOrders.filter(o => {
            const id = (o._id || o.id || '').toString();
            return id && !notified.includes(id);
          });
          if (newOrders.length > 0) {
            setAlertQueue(newOrders);
          }
        }
      } catch (e) {
        console.warn("Backend orders unavailable.");
      }

      // 3. Fallback for site content
      const savedContent = localStorage.getItem('dream_cream_content');
      if (savedContent) setSiteContent(JSON.parse(savedContent));
      
    } catch (err) {
      console.error("Critical Admin Sync Error:", err);
      setError("System partially offline. Using local vault.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (user && isAdmin) {
      fetchData();
      // Poll for new orders every 30 seconds
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [user, isAdmin]);

  // Show popup for next order in queue
  useEffect(() => {
    if (alertQueue.length > 0 && !newOrderAlert) {
      setNewOrderAlert(alertQueue[0]);
      setAlertQueue(prev => prev.slice(1));
    }
  }, [alertQueue, newOrderAlert]);

  const handleAlertConfirm = (order) => {
    // Mark order as notified
    const notified = JSON.parse(localStorage.getItem('cream_dream_notified_orders') || '[]');
    const id = (order._id || order.id || '').toString();
    localStorage.setItem('cream_dream_notified_orders', JSON.stringify([...notified, id]));
    // Open WhatsApp with confirmation to customer
    const waLink = generateWhatsAppLink(order);
    window.open(waLink, '_blank');
    setNewOrderAlert(null);
  };

  const handleAlertDismiss = (order) => {
    // Mark as notified but don't send WhatsApp
    const notified = JSON.parse(localStorage.getItem('cream_dream_notified_orders') || '[]');
    const id = (order._id || order.id || '').toString();
    localStorage.setItem('cream_dream_notified_orders', JSON.stringify([...notified, id]));
    setNewOrderAlert(null);
  };

  // Auth Protection
  if (authLoading) return <div className="admin-loading">AUTHENTICATING SECURE SESSION...</div>;
  if (!user || !isAdmin) return <Navigate to="/login" replace />;

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Convert price string to number for backend
    const cleanPrice = typeof formData.price === 'string' ? parseFloat(formData.price.replace(/[^\d.]/g, '')) : formData.price;
    const submissionData = { ...formData, price: cleanPrice };

    try {
      let response;
      if (editingProduct) {
        response = await fetch(`${ENDPOINTS.PRODUCTS}/${editingProduct._id || editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionData)
        });
      } else {
        response = await fetch(ENDPOINTS.PRODUCTS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submissionData)
        });
      }

      if (response.ok) {
        await fetchData(); // Refresh list
        setIsAdding(false);
        setEditingProduct(null);
        setFormData({ name: '', category: 'Dairy', price: '', rating: 4.5, image: '', hue: 0 });
      } else {
        const errData = await response.json();
        alert(`Failed to save: ${errData.message}`);
      }
    } catch (err) {
      console.error("Save Error:", err);
      alert("Network error while connecting to vault.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Confirm permanent removal? This cannot be undone.")) return;
    
    try {
      const response = await fetch(`${ENDPOINTS.PRODUCTS}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchData();
      } else {
        alert("Deletion failed on server.");
      }
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const handleUpdateContent = (section, key, value) => {
    const updatedContent = [...siteContent];
    const index = updatedContent.findIndex(c => c.key === key && c.section === section);
    
    if (index > -1) {
      updatedContent[index] = { ...updatedContent[index], value, updatedAt: new Date() };
    } else {
      updatedContent.push({ section, key, value, updatedAt: new Date() });
    }
    
    setSiteContent(updatedContent);
    localStorage.setItem('dream_cream_content', JSON.stringify(updatedContent));
  };

  const logout = () => { 
    localStorage.removeItem('dream_cream_user');
    localStorage.removeItem('dream_cream_token');
    window.location.href = '/'; 
  };

  const generateWhatsAppLink = (order) => {
    if (!order) return '#';
    const itemsText = order.items.map(i => {
      const price = typeof i.price === 'number' ? i.price : parseFloat((i.price || '0').toString().replace(/[^\d.]/g, '')) || 0;
      return `  • ${i.name} × ${i.quantity}  =  ₹${(price * i.quantity).toFixed(2)}`;
    }).join('\n');

    const orderId = (order._id || order.id || 'N/A').toString().slice(-6).toUpperCase();
    const deliveryType = (order.deliveryType || 'pickup').toUpperCase();
    const address = order.address && order.address.trim() ? order.address : 'Store Pickup';
    const paymentMethod = (order.paymentMethod || 'COD').toUpperCase();
    const orderDate = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

    const message =
      `🍦 *CREAM DREAM — ORDER CONFIRMED* 🍦\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `✅ *Your order has been received!*\n\n` +
      `📋 *Order ID:* #${orderId}\n` +
      `📅 *Date:* ${orderDate}\n` +
      `👤 *Name:* ${order.customerName}\n` +
      `📞 *Phone:* ${order.customerPhone}\n\n` +
      `🛒 *ITEMS ORDERED:*\n${itemsText}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🚚 *Delivery Type:* ${deliveryType}\n` +
      `📍 *Address:* ${address}\n` +
      `💳 *Payment:* ${paymentMethod}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━\n` +
      `💰 *TOTAL PAYABLE: ₹${order.total.toFixed(2)}*\n\n` +
      `🕐 *Estimated Time:* 30–45 mins\n\n` +
      `Thank you for ordering from *Cream Dream*! 🍦✨\n` +
      `We're preparing your order with love. ❤️\n\n` +
      `For queries, reply to this message.`;

    // Send to CUSTOMER's phone number
    const cleanPhone = (order.customerPhone || '').replace(/\D/g, '');
    const phoneWithCode = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

    return `https://wa.me/${phoneWithCode}?text=${encodeURIComponent(message)}`;
  };

  const generateSMSLink = (order) => {
    if (!order) return '#';
    const itemsText = order.items.map(i => `${i.name} x${i.quantity}`).join(', ');
    const message = `Cream Dream Order: Total ₹${order.total.toFixed(2)}. Items: ${itemsText}`;
    return `sms:${order.customerPhone}?body=${encodeURIComponent(message)}`;
  };

  const copySlipToClipboard = (order) => {
    if (!order) return;
    const itemsText = order.items.map(i => `- ${i.name} x ${i.quantity}`).join('\n');
    const text = `🍦 Cream Dream Order Slip 🍦\nCustomer: ${order.customerName}\nTotal: ₹${order.total.toFixed(2)}\nItems:\n${itemsText}`;
    navigator.clipboard.writeText(text);
    alert("Slip copied to clipboard!");
  };

  const filteredProducts = Array.isArray(products) ? products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = inventoryFilter === 'All' || p.category === inventoryFilter || (inventoryFilter === 'Ice Cream' && (p.category === 'Dairy' || p.category === 'Vegan' || p.category === 'Sorbet' || p.category === 'Specialty'));
    return matchesSearch && matchesCategory;
  }) : [];

  return (
    <motion.div className="admin-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

      {/* 🔔 NEW ORDER POPUP NOTIFICATION */}
      <AnimatePresence>
        {newOrderAlert && (
          <motion.div
            className="order-alert-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="order-alert-modal"
              initial={{ scale: 0.7, opacity: 0, y: -40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: -40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {/* Pulsing ring */}
              <div className="alert-ping-ring" />

              <div className="alert-header">
                <span className="alert-bell">🔔</span>
                <div>
                  <h3 className="alert-title">New Order Received!</h3>
                  <p className="alert-subtitle">A customer just placed an order</p>
                </div>
              </div>

              <div className="alert-order-card">
                <div className="alert-row">
                  <span className="alert-label">👤 Customer</span>
                  <span className="alert-value">{newOrderAlert.customerName}</span>
                </div>
                <div className="alert-row">
                  <span className="alert-label">📞 Phone</span>
                  <span className="alert-value">{newOrderAlert.customerPhone}</span>
                </div>
                <div className="alert-row">
                  <span className="alert-label">🛒 Items</span>
                  <span className="alert-value">
                    {newOrderAlert.items.map(i => `${i.name} ×${i.quantity}`).join(', ')}
                  </span>
                </div>
                <div className="alert-row">
                  <span className="alert-label">🚚 Type</span>
                  <span className="alert-value">{(newOrderAlert.deliveryType || 'Pickup').toUpperCase()}</span>
                </div>
                <div className="alert-total-row">
                  <span>Total Payable</span>
                  <span className="alert-total-amount">₹{newOrderAlert.total?.toFixed(2)}</span>
                </div>
              </div>

              <p className="alert-instruction">
                Click <strong>"Send Confirmation"</strong> to open WhatsApp on your phone and send the order details to the customer.
              </p>

              <div className="alert-actions">
                <button
                  className="alert-btn-confirm"
                  onClick={() => handleAlertConfirm(newOrderAlert)}
                >
                  <MessageSquare size={18} /> Send WhatsApp Confirmation
                </button>
                <button
                  className="alert-btn-dismiss"
                  onClick={() => handleAlertDismiss(newOrderAlert)}
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container">
        
        {/* Cinematic Admin Header */}
        <header className="admin-header glass-panel deluxe-header">
          <div className="admin-profile">
            <div className="admin-shield-wrapper">
               <ShieldCheck color="var(--color-primary)" size={32} />
            </div>
            <div>
              <h1 className="luxury-text">
                {(Array.isArray(siteContent) && siteContent.find(c => c.key === 'adminName')?.value) || "Master Control Center"}
              </h1>
              <div className="flex items-center gap-3">
                <p className="admin-badge-text">SECURE SESSION: {user?.email}</p>
                <div className={`connection-status-pill ${dbStatus.toLowerCase().replace(' ', '-')}`}>
                   <div className="status-dot"></div> {dbStatus}
                </div>
              </div>
            </div>
          </div>
          <button onClick={logout} className="logout-btn-deluxe"><LogOut size={18} /> EXIT PORTAL</button>
        </header>

        {/* Global Tab Navigation */}
        <div className="admin-main-nav mt-10">
          {[
            { id: 'inventory', label: 'CATALOG', icon: Layers },
            { id: 'orders', label: 'ORDERS', icon: ShoppingBag },
            { id: 'visitors', label: 'ANALYTICS', icon: Users },
            { id: 'cms', label: 'WEBSITE CMS', icon: Settings }
          ].map(tab => (
            <button key={tab.id} className={`main-tab-btn ${activeMainTab === tab.id ? 'active' : ''}`} onClick={() => setActiveMainTab(tab.id)}>
              <tab.icon size={20} /> <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="admin-viewport mt-8">
          <AnimatePresence mode="wait">
            
            {/* --- CATALOG TAB (WITH CATEGORY SUB-TABS) --- */}
            {activeMainTab === 'inventory' && (
              <motion.div key="inventory" className="tab-pane" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="catalog-controls glass-panel mb-8">
                  <div className="catalog-sub-nav">
                    {['All', 'Ice Cream', 'Milkshake', 'Thick Shake'].map(cat => (
                      <button key={cat} className={`sub-tab-btn ${inventoryFilter === cat ? 'active' : ''}`} onClick={() => setInventoryFilter(cat)}>
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="catalog-actions-row mt-6">
                    <div className="search-box-premium"><Search size={18}/><input placeholder="Filter by name..." onChange={e => setSearchTerm(e.target.value)} /></div>
                    <button className="add-flavor-btn-premium" onClick={() => setIsAdding(!isAdding)}>
                      {isAdding ? <X size={18}/> : <Plus size={18}/>} {isAdding ? 'Cancel' : 'Add New Flavor'}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isAdding && (
                    <div className="admin-modal-backdrop" onClick={(e) => { if(e.target === e.currentTarget) setIsAdding(false); }}>
                      <motion.div 
                        className="admin-modal-content"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                      >
                        <button className="modal-close-corner" onClick={() => setIsAdding(false)}><X size={20}/></button>
                        
                        <div className="modal-header-deluxe">
                          <h2>{editingProduct ? 'Modify Flavor' : 'Add New Flavor'}</h2>
                          <p>{editingProduct ? `REFINING: ${editingProduct.name}` : 'EXPANDING THE CATALOG'}</p>
                        </div>

                        <form className="flavor-form-official" onSubmit={handleSaveProduct}>
                          <div className="flavor-photo-preview-section">
                            <div className="modal-photo-preview-circle" style={{ filter: `hue-rotate(${formData.hue || 0}deg)` }}>
                              <img src={formData.image || 'https://images.unsplash.com/photo-1501443762994-82bd5dabb892?auto=format&fit=crop&q=80&w=200'} alt="Preview" />
                            </div>
                            <div className="photo-input-group">
                              <div className="premium-input mb-2">
                                <label>Photograph URL</label>
                                <input 
                                  placeholder="https://images.unsplash.com/..." 
                                  value={formData.image} 
                                  onChange={e => setFormData({...formData, image: e.target.value})} 
                                />
                              </div>
                              <div className="image-guideline">
                                <strong>Optimal Resolution: 800 x 800px (1:1 Ratio)</strong><br/>
                                For the best presentation, use high-quality transparent PNGs or images with a centered subject.
                              </div>
                            </div>
                          </div>

                          <div className="form-grid-premium">
                            <div className="premium-input">
                              <label>Flavor Identity</label>
                              <input placeholder="Enter name..." required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className="premium-input premium-category-selector">
                              <label>Category Group</label>
                              <div className="category-pill-group">
                                {['Dairy', 'Vegan', 'Sorbet', 'Specialty', 'Milkshake', 'Thick Shake'].map(cat => (
                                  <button 
                                    key={cat}
                                    type="button" 
                                    className={`cat-select-pill ${formData.category === cat ? 'active' : ''}`}
                                    onClick={() => setFormData({...formData, category: cat})}
                                  >
                                    {cat}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div className="premium-input">
                              <label>Pricing Unit</label>
                              <input placeholder="₹350" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                            </div>
                            <div className="premium-input">
                              <label>Color Hue Shift</label>
                              <input type="range" min="0" max="360" value={formData.hue || 0} onChange={e => setFormData({...formData, hue: parseInt(e.target.value)})} />
                            </div>
                          </div>

                          <div className="form-actions-premium">
                            <button type="button" className="p-btn delete" onClick={() => setIsAdding(false)}>Cancel</button>
                            <button type="submit" className="save-btn-premium p-btn">
                              {editingProduct ? 'COMMIT CHANGES' : 'CREATE FLAVOR'} <Database size={16}/>
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

                <div className="flavor-catalog-viewport">
                  {[
                    { title: 'Artisan Ice Creams', types: ['Dairy', 'Vegan', 'Sorbet', 'Specialty'], icon: IceCream },
                    { title: 'Premium Milkshakes', types: ['Milkshake'], icon: Star },
                    { title: 'Decadent Thick Shakes', types: ['Thick Shake'], icon: Coffee }
                  ].map(group => {
                    const groupProducts = filteredProducts.filter(p => group.types.includes(p.category));
                    if (groupProducts.length === 0 && inventoryFilter !== 'All') return null;
                    if (groupProducts.length === 0 && inventoryFilter === 'All') return null;

                    return (
                      <div key={group.title} className="admin-category-section">
                        <div className="admin-category-header">
                          <div className="category-icon"><group.icon size={20} /></div>
                          <h2>{group.title}</h2>
                          <div className="category-count-badge">{groupProducts.length} items</div>
                        </div>
                        
                        <div className="flavor-table-deluxe glass-panel p-0">
                          <table className="perfect-table">
                            <thead>
                              <tr>
                                <th>PREVIEW</th>
                                <th>FLAVOR NAME</th>
                                <th>CATEGORY</th>
                                <th>PRICE</th>
                                <th className="text-right">MGMT</th>
                              </tr>
                            </thead>
                            <tbody>
                              {groupProducts.map(p => (
                                <tr key={p._id || p.id} className="perfect-row">
                                  <td className="w-20">
                                    <div className="flavor-circle-preview" style={{ filter: `hue-rotate(${p.hue || 0}deg)` }}>
                                      <img src={p.image} alt="" />
                                    </div>
                                  </td>
                                  <td>
                                    <div className="flavor-main-name">{p.name}</div>
                                    <div className="flavor-rating-mini"><Star size={10} fill="var(--color-primary)"/> {p.rating}</div>
                                  </td>
                                  <td><span className={`cat-pill ${p.category.toLowerCase().replace(' ', '-')}`}>{p.category}</span></td>
                                  <td><span className="price-text">{p.price}</span></td>
                                  <td className="text-right">
                                     <div className="mgmt-btns">
                                       <button 
                                         className="p-btn edit" 
                                         title="Modify" 
                                         onClick={() => { setEditingProduct(p); setFormData(p); setIsAdding(true); }}
                                       >
                                         <Edit2 size={14}/> <span>Edit</span>
                                       </button>
                                       <button 
                                         className="p-btn delete" 
                                         title="Erase" 
                                         onClick={() => handleDeleteProduct(p._id || p.id)}
                                       >
                                         <Trash2 size={14}/> <span>Delete</span>
                                       </button>
                                     </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                  {filteredProducts.length === 0 && <div className="p-12 text-center opacity-40 italic">System: No flavors detected in this frequency.</div>}
                </div>
              </motion.div>
            )}

            {/* --- ORDERS TAB (CATEGORIZED BY STATUS) --- */}
            {activeMainTab === 'orders' && (
              <motion.div key="orders" className="tab-pane" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="perfect-table-wrapper glass-panel p-0">
                  <table className="perfect-table">
                    <thead><tr><th>CUSTOMER</th><th>CONTACT</th><th>ORDER SPECS</th><th>TOTAL</th><th>STATUS</th><th className="text-right">MGMT</th></tr></thead>
                    <tbody>
                      {orders.length === 0 ? <tr><td colSpan="6" className="text-center py-20 opacity-50">Zero incoming transmissions.</td></tr> : orders.map(o => (
                        <tr key={o._id || o.id} className="perfect-row">
                          <td><div className="cust-name">{o.customerName}</div><div className="cust-email">{o.customerEmail}</div></td>
                          <td><div className="cust-phone flex items-center gap-1"><Phone size={12}/> {o.customerPhone}</div></td>
                          <td className="w-1/4"><div className="item-specs">{o.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</div></td>
                          <td><span className="order-price">₹{o.total.toFixed(2)}</span></td>
                          <td><span className={`status-orb ${o.status.toLowerCase().replace(' ', '-')}`}>{o.status}</span></td>
                          <td className="text-right">
                            <div className="flex justify-end gap-2">
                              <a 
                                href={generateWhatsAppLink(o)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-btn edit flex items-center gap-1 justify-center px-3"
                                style={{ background: 'rgba(37, 211, 102, 0.15)', color: '#25D366', border: '1px solid rgba(37,211,102,0.4)', fontWeight: 700 }}
                                title="Send Order Confirmation to Customer via WhatsApp"
                              >
                                <MessageSquare size={14}/> <span>✉ Confirm to Customer</span>
                              </a>
                              <a 
                                href={generateSMSLink(o)} 
                                className="p-btn edit flex items-center gap-1 justify-center px-3"
                                style={{ background: 'rgba(0, 112, 243, 0.1)', color: '#0070f3' }}
                                title="Send SMS Slip"
                              >
                                <Phone size={14}/> <span>SMS</span>
                              </a>
                              <button 
                                onClick={() => copySlipToClipboard(o)} 
                                className="p-btn edit flex items-center gap-1 justify-center px-3"
                                style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--color-text-main)' }}
                                title="Copy Slip Text"
                              >
                                <Copy size={14}/> <span>Copy</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* --- ANALYTICS TAB --- */}
            {activeMainTab === 'visitors' && (
              <motion.div key="visitors" className="tab-pane" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="analytics-grid">
                  {visitors.map(v => (
                    <div key={v._id} className="user-access-card glass-panel">
                      <div className="user-icon-ring">{v.email[0].toUpperCase()}</div>
                      <div className="user-ident">
                        <div className="user-email-text">{v.email}</div>
                        <div className="user-stats-text">Accessed {v.loginCount} times • Last: {new Date(v.lastVisited).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* --- CMS TAB (GROUPED BY SECTION) --- */}
            {activeMainTab === 'cms' && (
              <motion.div key="cms" className="tab-pane" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                 <div className="cms-layout-deluxe">
                    <div className="cms-card glass-panel">
                       <div className="cms-card-icon"><ShieldCheck size={24}/></div>
                       <h3>Admin Profile Configuration</h3>
                       <div className="cms-fields mt-6">
                         <div className="cms-field">
                           <label>Admin Display Name</label>
                           <input defaultValue={siteContent.find(c => c.key === 'adminName')?.value || "Master Control Center"} onBlur={e => handleUpdateContent('Profile', 'adminName', e.target.value)} />
                         </div>
                         <div className="cms-field mt-4">
                           <label>Identity Status</label>
                           <input value="Verified Male Admin" disabled className="opacity-50" />
                         </div>
                       </div>
                    </div>

                    <div className="cms-card glass-panel">
                       <div className="cms-card-icon"><IceCream size={24}/></div>
                       <h3>Home Hero Architecture</h3>
                       <div className="cms-fields mt-6">
                         <div className="cms-field">
                           <label>Main H1 Title</label>
                           <input defaultValue={siteContent.find(c => c.key === 'heroTitle')?.value || "Experience the Magic"} onBlur={e => handleUpdateContent('Hero', 'heroTitle', e.target.value)} />
                         </div>
                         <div className="cms-field mt-4">
                           <label>Supportive Prop-text</label>
                           <textarea rows="3" defaultValue={siteContent.find(c => c.key === 'heroSubtitle')?.value || ""} onBlur={e => handleUpdateContent('Hero', 'heroSubtitle', e.target.value)} placeholder="Cinematic subtitle..."></textarea>
                         </div>
                       </div>
                    </div>

                    <div className="cms-card glass-panel">
                       <div className="cms-card-icon"><Coffee size={24}/></div>
                       <h3>Brand Storytelling</h3>
                       <div className="cms-fields mt-6">
                         <div className="cms-field">
                           <label>Our Mission Paragraph</label>
                           <textarea rows="6" defaultValue={siteContent.find(c => c.key === 'storyText')?.value || ""} onBlur={e => handleUpdateContent('About', 'storyText', e.target.value)} placeholder="Narrate the vision..."></textarea>
                         </div>
                       </div>
                    </div>
                 </div>
                 <div className="cms-safety-footer glass-panel mt-10">
                    <RefreshCcw size={16} className="animate-spin-slow" />
                    <p>SYSTEM NOTE: All modifications are committed to the cloud instantly. Review live at <a href="/" target="_blank">CreamDream.io</a></p>
                 </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
