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
  const { user, isAdmin, logout, loading: authLoading } = useAuth();
  const [activeMainTab, setActiveMainTab] = useState('inventory');
  const [inventoryFilter, setInventoryFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Data States
  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [orders, setOrders] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [siteContent, setSiteContent] = useState([]);

  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: 'Dairy', price: '', rating: 4.5, image: '', hue: 0 });

  // Security check - wait for auth to finish loading
  if (authLoading) {
    return (
      <div className="admin-loading-container">
        <div className="loading-spinner"></div>
        <p>Verifying Credentials...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: '/admin' }} />;
  }
  
  const currentEmail = user.email ? user.email.trim().toLowerCase() : '';
  if (!isAdmin || currentEmail !== 'saikumar89515@gmail.com') {
    return <Navigate to="/" />;
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpointMap = {
        inventory: ENDPOINTS.PRODUCTS,
        orders: ENDPOINTS.ORDERS,
        visitors: ENDPOINTS.VISITORS,
        cms: ENDPOINTS.CONTENT
      };
      
      const res = await fetch(endpointMap[activeMainTab]);
      const data = await res.json();
      
      const safeData = Array.isArray(data) && data.length > 0 ? data : (activeMainTab === 'inventory' ? STATIC_PRODUCTS : []);
      
      if (activeMainTab === 'inventory') setProducts(safeData);
      else if (activeMainTab === 'orders') setOrders(safeData);
      else if (activeMainTab === 'visitors') setVisitors(safeData);
      else if (activeMainTab === 'cms') setSiteContent(safeData);
      
    } catch (err) { 
      console.error("Data fetch error:", err); 
      // Ensure we don't crash by providing static fallbacks on failure
      if (activeMainTab === 'inventory') setProducts(STATIC_PRODUCTS);
      else if (activeMainTab === 'orders') setOrders([]);
      else if (activeMainTab === 'visitors') setVisitors([]);
      else if (activeMainTab === 'cms') setSiteContent([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [activeMainTab]);

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct ? `${ENDPOINTS.PRODUCTS}/${editingProduct._id}` : ENDPOINTS.PRODUCTS;
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        fetchData();
        setIsAdding(false);
        setEditingProduct(null);
        setFormData({ name: '', category: 'Dairy', price: '', rating: 4.5, image: '', hue: 0 });
      }
    } catch (err) { console.error("Product save error:", err); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Confirm permanent removal? This cannot be undone.")) return;
    try {
      await fetch(`${ENDPOINTS.PRODUCTS}/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) { console.error("Delete error:", err); }
  };

  const handleUpdateContent = async (section, key, value) => {
    try {
      await fetch(ENDPOINTS.CONTENT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, key, value })
      });
      fetchData();
    } catch (err) { console.error("CMS update error:", err); }
  };

  // Security check - redirect to login if not admin or not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: '/admin' }} />;
  }
  
  if (!isAdmin || user.email !== 'saikumar89515@gmail.com') {
    return <Navigate to="/" />;
  }

  const generateWhatsAppLink = (order) => {
    if (!order) return '#';
    const itemsText = order.items.map(i => `- ${i.name} x ${i.quantity}`).join('\n');
    const message = `🍦 *Cream Dream Order Slip* 🍦\n------------------------------\n*Order Status:* ${order.status}\n*Customer:* ${order.customerName}\n*Total:* ₹${order.total.toFixed(2)}\n\n*Items:*\n${itemsText}\n\nThank you for choosing Cream Dream!`;
    
    // Clean phone number (removing non-digits)
    const cleanPhone = (order.customerPhone || "").replace(/\D/g, '');
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
              <p className="admin-badge-text">SECURE SESSION: {user?.email}</p>
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
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                      >
                        <button className="modal-close-corner" onClick={() => setIsAdding(false)}><X size={24}/></button>
                        
                        <div className="modal-header-deluxe">
                          <h2>{editingProduct ? 'Modify Flavor' : 'Add New Flavor'}</h2>
                          <p>{editingProduct ? `REFINING: ${editingProduct.name}` : 'EXPANDING THE CATALOG'}</p>
                        </div>

                        <form className="flavor-form-official" onSubmit={handleSaveProduct}>
                          <div className="flavor-photo-preview-section">
                            <div className="modal-photo-preview-circle" style={{ filter: `hue-rotate(${formData.hue || 0}deg)` }}>
                              <img src={formData.image || 'https://images.unsplash.com/photo-1501443762994-82bd5dabb892?auto=format&fit=crop&q=80&w=200'} alt="Preview" />
                            </div>
                            <div className="premium-input w-full">
                              <label>Photograph URL</label>
                              <input 
                                placeholder="https://images.unsplash.com/..." 
                                value={formData.image} 
                                onChange={e => setFormData({...formData, image: e.target.value})} 
                              />
                            </div>
                          </div>

                          <div className="form-grid-premium grid grid-cols-2 gap-6">
                            <div className="premium-input">
                              <label>Flavor Identity</label>
                              <input placeholder="Enter name..." required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className="premium-input">
                              <label>Category Group</label>
                              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                <option>Dairy</option><option>Vegan</option><option>Sorbet</option>
                                <option>Specialty</option><option>Milkshake</option><option>Thick Shake</option>
                              </select>
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

                          <div className="form-actions-premium mt-10 flex gap-4">
                            <button type="submit" className="save-btn-premium flex-1 py-5 bg-pink-500 text-white rounded-2xl font-black tracking-widest hover:bg-pink-600 transition-all">
                              {editingProduct ? 'COMMIT CHANGES' : 'CREATE FLAVOR'} <Database size={16} className="ml-2 inline"/>
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
                                <tr key={p._id} className="perfect-row">
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
                                         onClick={() => handleDeleteProduct(p._id)}
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
                        <tr key={o._id} className="perfect-row">
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
                                style={{ background: 'rgba(37, 211, 102, 0.1)', color: '#25D366' }}
                                title="Send WhatsApp Slip"
                              >
                                <MessageSquare size={14}/> <span>WhatsApp</span>
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
