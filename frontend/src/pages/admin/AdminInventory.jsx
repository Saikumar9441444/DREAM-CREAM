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
        <h2 style={{ fontSize: '2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Archive size={28} className="text-primary" /> Inventory (Stock)
        </h2>
      </div>
      
      <div className="admin-panel">
        <div className="admin-panel-header" style={{ borderBottom: '1px solid #eee', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input 
              type="text" 
              placeholder="Search inventory..." 
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
                <th>Item</th>
                <th>Category</th>
                <th>Stock Status</th>
                <th>Quick Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredProducts.map((product, index) => (
                  <motion.tr 
                    key={product.id || product._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    style={{ borderBottom: '1px solid #eee' }}
                  >
                    <td style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={product.image} alt={product.name} className="product-img-small" />
                      {product.name}
                    </td>
                    <td><span className="status-badge" style={{ background: '#f3f4f6', color: '#4b5563' }}>{product.category}</span></td>
                    <td>
                      <span style={{ 
                        fontWeight: 600, 
                        color: product.inStock === false ? '#ef4444' : '#16a34a' 
                      }}>
                        {product.inStock === false ? 'Out of Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleToggleStock(product)}
                        className="btn-outline-primary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
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
