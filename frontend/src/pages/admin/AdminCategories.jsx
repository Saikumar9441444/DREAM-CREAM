import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Tags } from 'lucide-react';
import { getCategories, addCategory, deleteCategory } from '../../data/categoryStore';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCats = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCats();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const updated = await addCategory(newCategoryName.trim());
      setCategories(updated);
      setNewCategoryName('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCategory = async (categoryName) => {
    if (window.confirm(`Are you sure you want to delete the category "${categoryName}"? Products in this category will not be deleted, but they may not display correctly.`)) {
      try {
        const updated = await deleteCategory(categoryName);
        setCategories(updated);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.2rem', margin: 0, fontWeight: 800, color: '#1e293b' }}>Category Management</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Add Category Form */}
        <div className="admin-panel-pro" style={{ height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>
              <Plus size={20} color="var(--color-primary)" /> Add Category
            </h3>
          </div>
          
          <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Category Name</label>
              <input 
                type="text" 
                required 
                value={newCategoryName} 
                onChange={(e) => setNewCategoryName(e.target.value)} 
                placeholder="e.g. Smoothies" 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }}
              />
            </div>
            {error && <small style={{ color: '#ef4444', display: 'block' }}>{error}</small>}
            <button type="submit" className="btn-pro btn-pro-primary" style={{ width: '100%' }}>Create Category</button>
          </form>
        </div>

        {/* Categories List */}
        <div className="admin-panel-pro" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>
              <Tags size={20} color="var(--color-primary)" /> Existing Categories
            </h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table-pro">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th style={{ width: '100px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category}>
                    <td style={{ fontWeight: 600, color: '#1e293b' }}>{category}</td>
                    <td style={{ textAlign: 'right' }}>
                      {category !== 'All Flavors' ? (
                        <button 
                          className="btn-pro" 
                          style={{ padding: '0.4rem', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' }} 
                          onClick={() => handleDeleteCategory(category)}
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Default</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
