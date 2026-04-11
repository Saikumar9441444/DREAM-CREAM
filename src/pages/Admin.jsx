import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Edit2, Save, X, LogOut, ShieldCheck, 
  Database, LayoutDashboard, Search, ShoppingBag, 
  Users, Settings, CheckCircle, RefreshCcw 
} from 'lucide-react';
import './Admin.css';

const API_BASE = 'http://localhost:5000/api';

export default function Admin() {
  const { user, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('inventory');
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

  // Redirect if not the designated admin
  if (!isAdmin || user?.email !== 'saikumar89515@gmail.com') {
    return <Navigate to="/" />;
  }

  // --- API DATA FETCHING ---
  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'inventory') {
        const res = await fetch(`${API_BASE}/products`);
        setProducts(await res.json());
      } else if (activeTab === 'orders') {
        const res = await fetch(`${API_BASE}/orders`);
        setOrders(await res.json());
      } else if (activeTab === 'visitors') {
        const res = await fetch(`${API_BASE}/visitors`);
        setVisitors(await res.json());
      } else if (activeTab === 'cms') {
        const res = await fetch(`${API_BASE}/content`);
        setSiteContent(await res.json());
      }
    } catch (err) { console.error("Data fetch error:", err); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  // --- CATALOG MANAGEMENT (CRUD) ---
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
    if (!window.confirm("Permanent Delete?")) return;
    try {
      await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) { console.error("Delete error:", err); }
  };

  // --- CMS MANAGEMENT ---
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

  return (
    <motion.div className="admin-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="container">
        {/* Header Section */}
        <header className="admin-header glass-panel">
          <div className="admin-profile">
            <ShieldCheck color="var(--color-primary)" size={40} />
            <div>
              <h1>Master Control</h1>
              <p>Admin: {user.email} • Cloud Connected</p>
            </div>
          </div>
          <button onClick={logout} className="logout-btn"><LogOut size={18} /> Exit Portal</button>
        </header>

        {/* Tab Navigation */}
        <div className="admin-tabs-nav mt-8">
          {[
            { id: 'inventory', label: 'FLAVOR CATALOG', icon: Database },
            { id: 'orders', label: 'CUSTOMER ORDERS', icon: ShoppingBag },
            { id: 'visitors', label: 'VISITOR INSIGHTS', icon: Users },
            { id: 'cms', label: 'WEBSITE CMS', icon: Settings }
          ].map(tab => (
            <button 
              key={tab.id} 
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        {/* --- DYNAMIC DASHBOARD AREA --- */}
        <div className="admin-content-area mt-8">
          <AnimatePresence mode="wait">
            
            {/* 1. INVENTORY TAB */}
            {activeTab === 'inventory' && (
              <motion.div key="inventory" className="fade-in" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex justify-between items-center mb-6">
                  <div className="search-bar-admin glass-panel"><Search size={20} /><input placeholder="Search flavor..." onChange={e => setSearchTerm(e.target.value)} /></div>
                  <button className="btn-primary" onClick={() => setIsAdding(!isAdding)}>{isAdding ? <X size={20}/> : <Plus size={20}/>} New Flavor</button>
                </div>

                <AnimatePresence>
                  {isAdding && (
                    <motion.form className="admin-form glass-panel mb-8" onSubmit={handleSaveProduct} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                       <div className="form-grid">
                         <div className="input-group"><input placeholder="Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} /><label>Flavor Name</label></div>
                         <div className="input-group">
                           <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                            <option>Dairy</option><option>Vegan</option><option>Sorbet</option>
                            <option>Specialty</option><option>Milkshake</option><option>Thick Shake</option>
                           </select>
                           <label className="always-float">Category</label>
                         </div>
                         <div className="input-group"><input placeholder="Price (e.g. ₹350)" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} /><label>Price</label></div>
                       </div>
                       <button type="submit" className="btn-primary mt-6">Confirm and Save</button>
                    </motion.form>
                  )}
                </AnimatePresence>

                <div className="glass-panel p-0 overflow-hidden">
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead><tr><th>Name</th><th>Category</th><th>Price</th><th className="text-right">Actions</th></tr></thead>
                      <tbody>
                        {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                          <tr key={p._id}>
                            <td><b>{p.name}</b></td>
                            <td><span className="flavor-tag">{p.category}</span></td>
                            <td>{p.price}</td>
                            <td className="text-right">
                               <button className="action-btn" onClick={() => { setEditingProduct(p); setFormData(p); setIsAdding(true); }}><Edit2 size={16}/></button>
                               <button className="action-btn delete" onClick={() => handleDeleteProduct(p._id)}><Trash2 size={16}/></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. ORDERS TAB */}
            {activeTab === 'orders' && (
              <motion.div key="orders" className="fade-in" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="glass-panel p-0 overflow-hidden">
                   <div className="admin-table-container">
                    <table className="admin-table">
                      <thead><tr><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
                      <tbody>
                        {orders.length === 0 ? <tr><td colSpan="4" className="text-center py-10 opacity-50">No orders yet.</td></tr> : orders.map(o => (
                          <tr key={o._id}>
                            <td><div><b>{o.customerName}</b></div><div className="text-xs opacity-50">{o.customerEmail}</div></td>
                            <td>{o.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</td>
                            <td><b>₹{o.total.toFixed(2)}</b></td>
                            <td><span className={`status-badge ${o.status.toLowerCase().replace(' ', '-')}`}>{o.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                   </div>
                </div>
              </motion.div>
            )}

            {/* 3. VISITORS TAB */}
            {activeTab === 'visitors' && (
              <motion.div key="visitors" className="fade-in" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="visitors-grid">
                  {visitors.map(v => (
                    <div key={v._id} className="visitor-card glass-panel flex items-center gap-4">
                      <div className="visitor-avatar">{v.email[0].toUpperCase()}</div>
                      <div>
                        <div className="visitor-email">{v.email}</div>
                        <div className="visitor-meta">Logins: {v.loginCount} • Last: {new Date(v.lastVisited).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                  {visitors.length === 0 && <div className="glass-panel text-center py-10 opacity-50 w-full col-span-full">No visitors tracked yet.</div>}
                </div>
              </motion.div>
            )}

            {/* 4. CMS TAB */}
            {activeTab === 'cms' && (
              <motion.div key="cms" className="fade-in" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="cms-grid grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="glass-panel">
                    <h3>Home Hero Content</h3>
                    <div className="mt-6 flex flex-col gap-6">
                      <div className="input-group">
                        <input defaultValue={siteContent.find(c => c.key === 'heroTitle')?.value || "Experience the Magic"} onBlur={e => handleUpdateContent('Hero', 'heroTitle', e.target.value)} />
                        <label className="always-float">Hero Main Title</label>
                      </div>
                      <div className="input-group">
                        <textarea rows="3" onBlur={e => handleUpdateContent('Hero', 'heroSubtitle', e.target.value)} placeholder="Enter a cinematic subtitle..."></textarea>
                        <label className="always-float">Hero Subtitle</label>
                      </div>
                    </div>
                  </div>

                  <div className="glass-panel">
                    <h3>About Us Content</h3>
                    <div className="mt-6 flex flex-col gap-6">
                      <div className="input-group">
                        <textarea rows="5" onBlur={e => handleUpdateContent('About', 'storyText', e.target.value)} placeholder="Tell your brand's story..."></textarea>
                        <label className="always-float">Our Story Paragraph</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 glass-panel warning-banner flex items-center gap-4 opacity-80">
                   <Settings size={24} />
                   <p className="text-sm">Changes made here reflect <b>instantly</b> on the live website. Use with cinematic care.</p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
