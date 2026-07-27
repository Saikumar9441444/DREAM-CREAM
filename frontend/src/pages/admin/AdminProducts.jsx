import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { getProducts, addProduct, deleteProduct, updateProduct } from '../../data/productStore';
import { getCategories } from '../../data/categoryStore';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: 'Dairy', price: '', image: '/dairy.png' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    setProducts(getProducts());
    setCategories(getCategories());
  }, []);

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
      const updated = deleteProduct(id);
      setProducts(updated);
    }
  };

  const handleOpenAdd = () => {
    setFormData({ name: '', category: categories[0] || 'Dairy', price: '', image: '/dairy.png' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleToggleStock = (product) => {
    const updatedProduct = { ...product, inStock: product.inStock === false ? true : false };
    updateProduct(product.id || product._id, updatedProduct);
    const updatedData = getProducts();
    setProducts(updatedData);
  };

  const handleOpenEdit = (product) => {
    setFormData({ name: product.name, category: product.category, price: product.price, image: product.image });
    setEditId(product.id || product._id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      const updated = updateProduct({ ...formData, id: editId });
      setProducts(updated);
    } else {
      const updated = addProduct(formData);
      setProducts(updated);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', margin: 0 }}>Products</h2>
        <button 
          className="btn-primary"
          style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={handleOpenAdd}
        >
          <Plus size={20} /> Add New Flavor
        </button>
      </div>
      
      <div className="admin-panel">
        <div className="admin-panel-header" style={{ borderBottom: '1px solid #eee', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>
        </div>
        
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>
                    <img src={product.image} alt={product.name} className="product-img-small" />
                  </td>
                  <td style={{ fontWeight: 700 }}>{product.name}</td>
                  <td><span className="status-badge" style={{ background: '#f3f4f6', color: '#4b5563' }}>{product.category}</span></td>
                  <td>{product.price}</td>
                  <td>
                    <button 
                      onClick={() => handleToggleStock(product)}
                      style={{
                        padding: '0.4rem 0.8rem',
                        borderRadius: '20px',
                        border: 'none',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        background: product.inStock === false ? '#fee2e2' : '#dcfce7',
                        color: product.inStock === false ? '#ef4444' : '#16a34a',
                        transition: 'all 0.2s'
                      }}
                    >
                      {product.inStock === false ? 'Out of Stock' : 'In Stock'}
                    </button>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn" onClick={() => handleOpenEdit(product)}><Edit2 size={18} /></button>
                      <button className="action-btn" style={{ color: '#ef4444' }} onClick={() => handleDelete(product.id || product._id)}><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEditing ? 'Edit Flavor' : 'Add New Flavor'}</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label>Flavor Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Strawberry Dream" />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select 
                  required 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Price</label>
                <input type="text" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="e.g. ₹373" />
              </div>
              <div className="form-group">
                <label>Image URL / Path</label>
                <input type="text" required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="/dairy.png" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-outline-primary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">{isEditing ? 'Save Changes' : 'Add Flavor'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
