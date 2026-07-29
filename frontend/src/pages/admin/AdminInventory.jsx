import React, { useState, useEffect } from 'react';
import { Archive, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts, updateProduct } from '../../data/productStore';
import './Admin.css';

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const handleToggleStock = async (product) => {
    try {
      await updateProduct(product.id || product._id, { ...product, inStock: !product.inStock });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.2rem', margin: 0, fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Archive size={28} style={{ color: 'var(--color-primary)' }} /> Inventory Management
        </h2>
      </div>
      
      <div className="admin-panel-pro">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search inventory..." 
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
                <th>Item</th>
                <th>Category</th>
                <th>Stock Status</th>
                <th style={{ textAlign: 'right' }}>Quick Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredProducts.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No items found.</td></tr>
                ) : filteredProducts.map((product, index) => (
                  <motion.tr 
                    key={product.id || product._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
                          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <span style={{ fontWeight: 700, color: '#1e293b' }}>{product.name}</span>
                      </div>
                    </td>
                    <td><span className="badge-pro info">{product.category}</span></td>
                    <td>
                      {product.inStock === false ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 600 }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)' }}></div>
                          Out of Stock
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontWeight: 600 }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }}></div>
                          In Stock
                        </div>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => handleToggleStock(product)}
                        className="btn-pro"
                        style={{ 
                          padding: '0.4rem 1rem', 
                          fontSize: '0.85rem',
                          background: product.inStock === false ? '#dcfce7' : '#fef2f2',
                          color: product.inStock === false ? '#16a34a' : '#ef4444',
                          border: `1px solid ${product.inStock === false ? '#bbf7d0' : '#fecaca'}`
                        }}
                      >
                        Mark as {product.inStock === false ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
