import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, LogOut, ShieldCheck, Database, LayoutDashboard, Search } from 'lucide-react';
import './Admin.css';

const API_URL = 'http://localhost:5000/api/products';

export default function Admin() {
  const { user, isAdmin, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: 'Dairy',
    price: '',
    rating: 4.5,
    hue: 0
  });

  // Redirect if not admin
  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  // Fetch products from Cloud API
  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          image: '/dairy.png' // Default image
        })
      });
      if (resp.ok) {
        fetchProducts();
        setIsAdding(false);
        setFormData({ name: '', category: 'Dairy', price: '', rating: 4.5, hue: 0 });
      }
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this flavor?")) return;
    try {
      const resp = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (resp.ok) fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      className="admin-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        <header className="admin-header glass-panel">
          <div className="admin-profile">
            <div className="admin-avatar-container">
              <ShieldCheck color="var(--color-primary)" size={40} />
            </div>
            <div>
              <h1>Admin Dashboard</h1>
              <p>Welcome, {user?.displayName} • Cloud Management</p>
            </div>
          </div>
          <button onClick={logout} className="logout-btn flex items-center">
            <LogOut size={18} className="mr-2" /> Logout
          </button>
        </header>

        <div className="dashboard-controls mt-12 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="search-bar-admin glass-panel flex items-center px-4 py-2 rounded-2xl w-full max-w-md">
            <Search size={20} color="var(--color-text-muted)" className="mr-2" />
            <input 
              type="text" 
              placeholder="Filter products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none w-full py-2"
            />
          </div>
          
          <button onClick={() => setIsAdding(!isAdding)} className="btn-primary flex items-center gap-2">
            {isAdding ? <X size={20} /> : <Plus size={20} />}
            {isAdding ? 'Cancel' : 'New Flavor'}
          </button>
        </div>

        <AnimatePresence>
          {isAdding && (
            <motion.form 
              onSubmit={handleAdd} 
              className="admin-form glass-panel"
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
            >
              <div className="form-grid">
                <div className="input-group">
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder=" " />
                  <label>Flavor Name</label>
                </div>
                <div className="input-group">
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="Dairy">Dairy</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Sorbet">Sorbet</option>
                    <option value="Specialty">Specialty</option>
                  </select>
                  <label className="always-float">Category</label>
                </div>
                <div className="input-group">
                  <input type="text" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder=" " />
                  <label>Price</label>
                </div>
                <div className="input-group">
                  <input type="number" step="0.1" max="5" value={formData.rating} onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})} placeholder=" " />
                  <label>Rating</label>
                </div>
              </div>
              <button type="submit" className="btn-primary mt-8 w-full md:w-auto px-12">
                Create Flavor <Database size={18} className="ml-2 inline" />
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <motion.div 
          className="admin-products glass-panel"
          initial={{ y: 20, opacity: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h2>Product Catalog</h2>
            <span className="text-sm font-bold opacity-40">{filteredProducts.length} Items</span>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th className="text-right">Manage</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map(product => (
                    <motion.tr 
                      key={product._id || product.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td><div className="font-bold">{product.name}</div></td>
                      <td><span className="flavor-tag">{product.category}</span></td>
                      <td className="text-primary font-bold">{product.price}</td>
                      <td>
                        <div className="action-btns justify-end">
                          <button className="action-btn" onClick={() => {/* TODO: Edit */}}>
                            <Edit2 size={16} />
                          </button>
                          <button className="action-btn delete" onClick={() => handleDelete(product._id || product.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-20 opacity-60">
                      <LayoutDashboard size={48} className="mx-auto mb-4 opacity-20" />
                      <p>No products found matching your search.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
