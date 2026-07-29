import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Search, X, Tags, IceCream, Cherry, ChevronDown, ChevronUp, Check, Upload, ImageIcon } from 'lucide-react';
import { getProducts, addProduct, deleteProduct, updateProduct } from '../../data/productStore';
import { getCategories, addCategory, deleteCategory } from '../../data/categoryStore';
import { getAddons, addAddon, deleteAddon, updateAddon } from '../../data/addonStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [addons, setAddons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: 'Dairy', price: '', image: '/dairy.png' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Inline card open states
  const [openCard, setOpenCard] = useState(null); // 'category' | 'flavour' | 'addon' | null

  // Inline form states
  const [catName, setCatName] = useState('');
  const [catError, setCatError] = useState('');
  const [flavourForm, setFlavourForm] = useState({ name: '', category: 'Dairy', price: '', image: '/dairy.png' });
  const [addonForm, setAddonForm] = useState({ name: '', category: 'Toppings', price: '' });
  const [commitSuccess, setCommitSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  const handleImageUpload = (e, target) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be under 2 MB');
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert('Only JPG, PNG, or WebP images are allowed');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (target === 'flavour') {
        setFlavourForm(prev => ({ ...prev, image: reader.result }));
        setImagePreview(reader.result);
      } else {
        setFormData(prev => ({ ...prev, image: reader.result }));
        setEditImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const fetchAddons = async () => {
    const data = await getAddons();
    setAddons(data);
  };

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchAddons();
  }, []);

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
      await fetchProducts();
    }
  };

  const handleToggleStock = async (product) => {
    const updatedProduct = { ...product, inStock: product.inStock === false ? true : false };
    await updateProduct(product.id || product._id, updatedProduct);
    await fetchProducts();
  };

  const handleOpenEdit = (product) => {
    setFormData({ name: product.name, category: product.category, price: product.price, image: product.image });
    setEditId(product.id || product._id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateProduct(editId, formData);
    } else {
      await addProduct(formData);
    }
    await fetchProducts();
    setIsModalOpen(false);
  };

  const toggleCard = (card) => {
    setOpenCard(openCard === card ? null : card);
    setCommitSuccess('');
    setCatError('');
  };

  // Commit Category
  const commitCategory = () => {
    if (!catName.trim()) return;
    try {
      const updated = addCategory(catName.trim());
      setCategories(updated);
      setCatName('');
      setCatError('');
      setCommitSuccess('Category added successfully!');
      setTimeout(() => setCommitSuccess(''), 3000);
    } catch (err) {
      setCatError(err.message);
    }
  };

  // Commit Flavour
  const commitFlavour = async () => {
    if (!flavourForm.name.trim() || !flavourForm.price) return;
    await addProduct({ ...flavourForm, price: Number(flavourForm.price) });
    await fetchProducts();
    setFlavourForm({ name: '', category: categories[0] || 'Dairy', price: '', image: '/dairy.png' });
    setCommitSuccess('Flavour added successfully!');
    setTimeout(() => setCommitSuccess(''), 3000);
  };

  // Commit Add-on
  const commitAddon = async () => {
    if (!addonForm.name.trim() || !addonForm.price) return;
    await addAddon({ ...addonForm, price: Number(addonForm.price), inStock: true });
    await fetchAddons();
    setAddonForm({ name: '', category: 'Toppings', price: '' });
    setCommitSuccess('Add-on added successfully!');
    setTimeout(() => setCommitSuccess(''), 3000);
  };

  const handleDeleteAddon = async (id) => {
    if(window.confirm('Delete this add-on?')) {
      await deleteAddon(id);
      await fetchAddons();
    }
  };

  const handleDeleteCategory = (name) => {
    if(window.confirm(`Delete category "${name}"?`)) {
      try {
        const updated = deleteCategory(name);
        setCategories(updated);
      } catch(err) { alert(err.message); }
    }
  };

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
    border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none',
    fontSize: '0.95rem', transition: 'border-color 0.2s'
  };

  const labelStyle = {
    display: 'block', marginBottom: '0.4rem', fontWeight: 600,
    color: '#475569', fontSize: '0.9rem'
  };

  const cardButtons = [
    { key: 'category', label: 'Add Category', icon: <Tags size={18} />, color: '#0ea5e9', bg: '#e0f2fe' },
    { key: 'flavour', label: 'Add Flavours', icon: <IceCream size={18} />, color: '#ec4899', bg: '#fce7f3' },
    { key: 'addon', label: 'Add Ons', icon: <Cherry size={18} />, color: '#a855f7', bg: '#f3e8ff' },
  ];

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.2rem', margin: 0, fontWeight: 800, color: '#1e293b' }}>Menu Management</h2>
      </div>

      {/* Three Action Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {cardButtons.map(btn => (
          <button
            key={btn.key}
            onClick={() => toggleCard(btn.key)}
            className="quick-action-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              background: openCard === btn.key ? '#fff' : '#f8fafc',
              border: openCard === btn.key ? `2px solid ${btn.color}` : '1px solid #e2e8f0',
              padding: '1.1rem 1.25rem', borderRadius: '16px', cursor: 'pointer',
              transition: 'all 0.25s', textAlign: 'left', width: '100%',
              boxShadow: openCard === btn.key ? `0 4px 20px ${btn.color}22` : 'none',
            }}
          >
            <div style={{ background: btn.bg, color: btn.color, padding: '0.6rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {btn.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>{btn.label}</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Click to expand</div>
            </div>
            {openCard === btn.key ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
          </button>
        ))}
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {commitSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              background: '#dcfce7', color: '#16a34a', padding: '1rem 1.5rem',
              borderRadius: '12px', marginBottom: '1.5rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              border: '1px solid #bbf7d0'
            }}
          >
            <Check size={18} /> {commitSuccess}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inline Expandable Cards */}
      <AnimatePresence>
        {openCard === 'category' && (
          <motion.div
            key="cat-card"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: '2rem' }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="admin-panel-pro" style={{ border: '2px solid #e0f2fe' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Tags size={20} color="#0ea5e9" /> Add New Category
                </h3>
                <button onClick={() => setOpenCard(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <label style={labelStyle}>Category Name</label>
                  <input
                    type="text"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="e.g. Smoothies, Frozen Yogurt..."
                    style={inputStyle}
                  />
                  {catError && <small style={{ color: '#ef4444', display: 'block', marginTop: '0.5rem' }}>{catError}</small>}
                </div>
                <div>
                  <label style={labelStyle}>Existing Categories</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {categories.map(cat => (
                      <span key={cat} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                        background: '#f1f5f9', padding: '0.4rem 0.75rem', borderRadius: '20px',
                        fontSize: '0.85rem', fontWeight: 600, color: '#475569'
                      }}>
                        {cat}
                        <button onClick={() => handleDeleteCategory(cat)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex' }}><X size={14} /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '1.5rem', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={commitCategory} className="btn-pro btn-pro-primary" style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }}>
                  <Check size={18} /> Commit Changes
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {openCard === 'flavour' && (
          <motion.div
            key="flav-card"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: '2rem' }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="admin-panel-pro" style={{ border: '2px solid #fce7f3' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <IceCream size={20} color="#ec4899" /> Add New Flavour
                </h3>
                <button onClick={() => setOpenCard(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={labelStyle}>Flavour Name</label>
                  <input type="text" value={flavourForm.name} onChange={e => setFlavourForm({...flavourForm, name: e.target.value})} placeholder="e.g. Strawberry Dream" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select value={flavourForm.category} onChange={e => setFlavourForm({...flavourForm, category: e.target.value})} style={inputStyle}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Price (₹)</label>
                  <input type="number" value={flavourForm.price} onChange={e => setFlavourForm({...flavourForm, price: e.target.value})} placeholder="e.g. 373" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Product Image</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleImageUpload(e, 'flavour')}
                    style={{ display: 'none' }}
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '1.25rem',
                      textAlign: 'center', cursor: 'pointer', background: '#f8fafc',
                      transition: 'all 0.2s', display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: '0.5rem', minHeight: '120px', justifyContent: 'center'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.background = '#fdf2f8'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover' }} />
                    ) : (
                      <Upload size={28} color="#94a3b8" />
                    )}
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
                      {imagePreview ? 'Click to change image' : 'Click to upload image'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      JPG, PNG or WebP &#x2022; Max 2 MB &#x2022; Square (1:1) recommended
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '1.5rem', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={commitFlavour} className="btn-pro btn-pro-primary" style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }}>
                  <Check size={18} /> Commit Changes
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {openCard === 'addon' && (
          <motion.div
            key="addon-card"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: '2rem' }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="admin-panel-pro" style={{ border: '2px solid #f3e8ff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Cherry size={20} color="#a855f7" /> Add New Add-on
                </h3>
                <button onClick={() => setOpenCard(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={labelStyle}>Add-on Name</label>
                  <input type="text" value={addonForm.name} onChange={e => setAddonForm({...addonForm, name: e.target.value})} placeholder="e.g. Rainbow Sprinkles" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Type</label>
                  <select value={addonForm.category} onChange={e => setAddonForm({...addonForm, category: e.target.value})} style={inputStyle}>
                    <option value="Toppings">Toppings</option>
                    <option value="Cones">Cones</option>
                    <option value="Sauces">Sauces</option>
                    <option value="Special Mix">Special Mix</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Price (₹)</label>
                  <input type="number" value={addonForm.price} onChange={e => setAddonForm({...addonForm, price: e.target.value})} placeholder="e.g. 20" style={inputStyle} />
                </div>
              </div>

              {/* Show existing add-ons */}
              {addons.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <label style={{ ...labelStyle, marginBottom: '0.75rem' }}>Current Add-ons</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {addons.map(a => (
                      <span key={a.id} style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                        background: a.inStock ? '#f0fdf4' : '#fef2f2', padding: '0.4rem 0.75rem',
                        borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600,
                        color: a.inStock ? '#16a34a' : '#ef4444', border: `1px solid ${a.inStock ? '#bbf7d0' : '#fecaca'}`
                      }}>
                        {a.name} — ₹{a.price}
                        <button onClick={() => handleDeleteAddon(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex' }}><X size={14} /></button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '1.5rem', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={commitAddon} className="btn-pro btn-pro-primary" style={{ padding: '0.75rem 2rem', fontSize: '0.95rem' }}>
                  <Check size={18} /> Commit Changes
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Table */}
      <div className="admin-panel-pro">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>All Flavours</h3>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search products..."
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
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredProducts.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No products found.</td></tr>
                ) : filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product.id || product._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', overflow: 'hidden', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: '#1e293b' }}>{product.name}</td>
                    <td><span className="badge-pro info">{product.category}</span></td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>₹{product.price}</td>
                    <td>
                      <button
                        onClick={() => handleToggleStock(product)}
                        style={{
                          padding: '0.4rem 0.8rem', borderRadius: '20px', border: 'none',
                          fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                          background: product.inStock === false ? '#fee2e2' : '#dcfce7',
                          color: product.inStock === false ? '#ef4444' : '#16a34a',
                          transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}
                      >
                        {product.inStock === false ? 'Out of Stock' : 'In Stock'}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button className="btn-pro" style={{ padding: '0.4rem', background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }} onClick={() => handleOpenEdit(product)}><Edit2 size={16} /></button>
                        <button className="btn-pro" style={{ padding: '0.4rem', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' }} onClick={() => handleDelete(product.id || product._id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal (only for editing existing flavours) */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setIsModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ background: '#fff', padding: '2rem', borderRadius: '24px', width: '90%', maxWidth: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#1e293b' }}>Edit Flavor</h3>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Flavor Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} placeholder="e.g. Strawberry Dream" />
                </div>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={inputStyle}>
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Price</label>
                  <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={inputStyle} placeholder="e.g. 373" />
                </div>
                <div>
                  <label style={labelStyle}>Product Image</label>
                  <input
                    type="file"
                    ref={editFileInputRef}
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleImageUpload(e, 'edit')}
                    style={{ display: 'none' }}
                  />
                  <div
                    onClick={() => editFileInputRef.current?.click()}
                    style={{
                      border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '1.25rem',
                      textAlign: 'center', cursor: 'pointer', background: '#f8fafc',
                      transition: 'all 0.2s', display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: '0.5rem', minHeight: '120px', justifyContent: 'center'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.background = '#fff5f7'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; }}
                  >
                    {(editImagePreview || formData.image) ? (
                      <img src={editImagePreview || formData.image} alt="Preview" style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover' }} />
                    ) : (
                      <Upload size={28} color="#94a3b8" />
                    )}
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
                      {(editImagePreview || formData.image) ? 'Click to change image' : 'Click to upload image'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      JPG, PNG or WebP &#x2022; Max 2 MB &#x2022; Square (1:1) recommended
                    </span>
                  </div>
                </div>
                <button type="submit" className="btn-pro btn-pro-primary" style={{ marginTop: '0.5rem', padding: '1rem' }}>
                  <Check size={18} /> Save Changes
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
