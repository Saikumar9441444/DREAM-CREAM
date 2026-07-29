import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { getAddons, addAddon, deleteAddon, updateAddon } from '../../data/addonStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminAddons() {
  const [addons, setAddons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: 'Toppings', price: '', inStock: true });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchAddons = async () => {
    const data = await getAddons();
    setAddons(data);
  };

  useEffect(() => {
    fetchAddons();
  }, []);

  const filteredAddons = addons.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this Add-on?')) {
      await deleteAddon(id);
      await fetchAddons();
    }
  };

  const handleOpenAdd = () => {
    setFormData({ name: '', category: 'Toppings', price: '', inStock: true });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addon) => {
    setFormData({ name: addon.name, category: addon.category, price: addon.price, inStock: addon.inStock });
    setEditId(addon.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleToggleStock = async (addon) => {
    const updatedAddon = { ...addon, inStock: !addon.inStock };
    await updateAddon(addon.id, updatedAddon);
    await fetchAddons();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, price: Number(formData.price) };
    if (isEditing) {
      await updateAddon(editId, payload);
    } else {
      await addAddon(payload);
    }
    await fetchAddons();
    setIsModalOpen(false);
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.2rem', margin: 0, fontWeight: 800, color: '#1e293b' }}>Modifier Add-ons</h2>
        <button className="btn-pro btn-pro-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Add New Add-on
        </button>
      </div>
      
      <div className="admin-panel-pro">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search add-ons..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            />
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table-pro">
            <thead>
              <tr>
                <th>Add-on Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredAddons.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No add-ons found.</td></tr>
                ) : filteredAddons.map((addon, index) => (
                  <motion.tr 
                    key={addon.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td style={{ fontWeight: 700, color: '#1e293b' }}>{addon.name}</td>
                    <td><span className="badge-pro info">{addon.category}</span></td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>₹{addon.price}</td>
                    <td>
                      <button 
                        onClick={() => handleToggleStock(addon)}
                        style={{
                          padding: '0.4rem 0.8rem',
                          borderRadius: '20px',
                          border: 'none',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          background: addon.inStock === false ? '#fee2e2' : '#dcfce7',
                          color: addon.inStock === false ? '#ef4444' : '#16a34a',
                          transition: 'all 0.2s',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}
                      >
                        {addon.inStock === false ? 'Out of Stock' : 'In Stock'}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button className="btn-pro" style={{ padding: '0.4rem', background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }} onClick={() => handleOpenEdit(addon)}><Edit2 size={16} /></button>
                        <button className="btn-pro" style={{ padding: '0.4rem', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' }} onClick={() => handleDelete(addon.id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ background: '#fff', padding: '2rem', borderRadius: '24px', width: '90%', maxWidth: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#1e293b' }}>{isEditing ? 'Edit Add-on' : 'Add New Add-on'}</h3>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24} /></button>
              </div>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }}>
                    <option value="Toppings">Toppings</option>
                    <option value="Cones">Cones</option>
                    <option value="Sauces">Sauces</option>
                    <option value="Special Mix">Special Mix</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Price (₹)</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }} required />
                </div>
                <button type="submit" className="btn-pro btn-pro-primary" style={{ marginTop: '1rem', padding: '1rem' }}>
                  {isEditing ? 'Update Add-on' : 'Create Add-on'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
