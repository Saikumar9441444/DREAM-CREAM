import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit2, Save, X, LogOut, ShieldCheck, 
  Database, LayoutDashboard, Search, ShoppingBag, 
  Users, Settings, CheckCircle, RefreshCcw, Filter,
  Layers, IceCream, Coffee, Star
} from 'lucide-react';
import './Admin.css';

const API_BASE = 'http://localhost:5000/api';

export default function Admin() {
  const { user, isAdmin, logout } = useAuth();
  const [activeMainTab, setActiveMainTab] = useState('inventory');
  const [inventoryFilter, setInventoryFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  
  // Data States
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [siteContent, setSiteContent] = useState([]);

  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: 'Dairy', price: '', rating: 4.5 });

  if (!isAdmin || user?.email !== 'saikumar89515@gmail.com') {
    return <Navigate to="/" />;
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeMainTab === 'inventory') {
        const res = await fetch(`${API_BASE}/products`);
        setProducts(await res.json());
      } else if (activeMainTab === 'orders') {
        const res = await fetch(`${API_BASE}/orders`);
        setOrders(await res.json());
      } else if (activeMainTab === 'visitors') {
        const res = await fetch(`${API_BASE}/visitors`);
        setVisitors(await res.json());
      } else if (activeMainTab === 'cms') {
        const res = await fetch(`${API_BASE}/content`);
        setSiteContent(await res.json());
      }
    } catch (err) { console.error("Data fetch error:", err); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [activeMainTab]);

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct ? `${API_BASE}/products/${editingProduct._id}` : `${API_BASE}/products`;
    
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
        setFormData({ name: '', category: 'Dairy', price: '', rating: 4.5 });
      }
    } catch (err) { console.error("Product save error:", err); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Confirm permanent removal? This cannot be undone.")) return;
    try {
      await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) { console.error("Delete error:", err); }
  };

  const handleUpdateContent = async (section, key, value) => {
    try {
      await fetch(`${API_BASE}/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, key, value })
      });
      fetchData();
    } catch (err) { console.error("CMS update error:", err); }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = inventoryFilter === 'All' || p.category === inventoryFilter || (inventoryFilter === 'Ice Cream' && (p.category === 'Dairy' || p.category === 'Vegan' || p.category === 'Sorbet' || p.category === 'Specialty'));
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div className="admin-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="container">
        
        {/* Cinematic Admin Header */}
        <header className="admin-header glass-panel deluxe-header">
          <div className="admin-profile">
            <div className="admin-shield-wrapper"><ShieldCheck color="var(--color-primary)" size={32} /></div>
            <div>
              <h1 className="luxury-text">Master Control Center</h1>
              <p className="admin-badge-text">SECURE SESSION: {user.email}</p>
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
                    <motion.div className="flavor-form-wrapper" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <form className="flavor-form-deluxe glass-panel mb-10" onSubmit={handleSaveProduct}>
                        <div className="form-grid-premium">
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
                        </div>
                        <button type="submit" className="save-btn-premium mt-8">PERMANENTLY COMMIT FLAVOR <Database size={16} className="ml-2 inline"/></button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flavor-table-deluxe glass-panel p-0">
                  <table className="perfect-table">
                    <thead><tr><th>PREVIEW</th><th>FLAVOR NAME</th><th>CATEGORY</th><th>PRICE</th><th className="text-right">MGMT</th></tr></thead>
                    <tbody>
                      {filteredProducts.map(p => (
                        <tr key={p._id} className="perfect-row">
                          <td className="w-20"><div className="flavor-circle-preview" style={{ filter: `hue-rotate(${p.hue || 0}deg)` }}><img src={p.image} alt="" /></div></td>
                          <td><div className="flavor-main-name">{p.name}</div><div className="flavor-rating-mini"><Star size={10} fill="var(--color-primary)"/> {p.rating}</div></td>
                          <td><span className={`cat-pill ${p.category.toLowerCase().replace(' ', '-')}`}>{p.category}</span></td>
                          <td><span className="price-text">{p.price}</span></td>
                          <td className="text-right">
                             <div className="mgmt-btns">
                               <button className="p-btn edit" title="Modify" onClick={() => { setEditingProduct(p); setFormData(p); setIsAdding(true); }}><Edit2 size={16}/></button>
                               <button className="p-btn delete" title="Erase" onClick={() => handleDeleteProduct(p._id)}><Trash2 size={16}/></button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredProducts.length === 0 && <div className="p-12 text-center opacity-40 italic">System: No flavors detected in this frequency.</div>}
                </div>
              </motion.div>
            )}

            {/* --- ORDERS TAB (CATEGORIZED BY STATUS) --- */}
            {activeMainTab === 'orders' && (
              <motion.div key="orders" className="tab-pane" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="perfect-table-wrapper glass-panel p-0">
                  <table className="perfect-table">
                    <thead><tr><th>CUSTOMER</th><th>ORDER SPECS</th><th>TOTAL VALUE</th><th className="text-right">STATUS</th></tr></thead>
                    <tbody>
                      {orders.length === 0 ? <tr><td colSpan="4" className="text-center py-20 opacity-50">Zero incoming transmissions.</td></tr> : orders.map(o => (
                        <tr key={o._id} className="perfect-row">
                          <td><div className="cust-name">{o.customerName}</div><div className="cust-email">{o.customerEmail}</div></td>
                          <td className="w-1/3"><div className="item-specs">{o.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</div></td>
                          <td><span className="order-price">₹{o.total.toFixed(2)}</span></td>
                          <td className="text-right"><span className={`status-orb ${o.status.toLowerCase().replace(' ', '-')}`}>{o.status}</span></td>
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
                       <div className="cms-card-icon"><IceCream size={24}/></div>
                       <h3>Home Hero Architecture</h3>
                       <div className="cms-fields mt-6">
                         <div className="cms-field">
                           <label>Main H1 Title</label>
                           <input defaultValue={siteContent.find(c => c.key === 'heroTitle')?.value || "Experience the Magic"} onBlur={e => handleUpdateContent('Hero', 'heroTitle', e.target.value)} />
                         </div>
                         <div className="cms-field mt-4">
                           <label>Supportive Prop-text</label>
                           <textarea rows="3" onBlur={e => handleUpdateContent('Hero', 'heroSubtitle', e.target.value)} placeholder="Cinematic subtitle..."></textarea>
                         </div>
                       </div>
                    </div>

                    <div className="cms-card glass-panel">
                       <div className="cms-card-icon"><Coffee size={24}/></div>
                       <h3>Brand Storytelling</h3>
                       <div className="cms-fields mt-6">
                         <div className="cms-field">
                           <label>Our Mission Paragraph</label>
                           <textarea rows="6" onBlur={e => handleUpdateContent('About', 'storyText', e.target.value)} placeholder="Narrate the vision..."></textarea>
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
