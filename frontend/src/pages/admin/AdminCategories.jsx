import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Tags } from 'lucide-react';
import { getCategories, addCategory, deleteCategory } from '../../data/categoryStore';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const updated = addCategory(newCategoryName.trim());
      setCategories(updated);
      setNewCategoryName('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCategory = (categoryName) => {
    if (window.confirm(`Are you sure you want to delete the category "${categoryName}"? Products in this category will not be deleted, but they may not display correctly.`)) {
      try {
        const updated = deleteCategory(categoryName);
        setCategories(updated);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', margin: 0 }}>Category Management</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Add Category Form */}
        <div className="admin-panel" style={{ height: 'fit-content' }}>
          <div className="admin-panel-header" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={18} /> Add Category
            </h3>
          </div>
          
          <form className="admin-form" onSubmit={handleAddCategory}>
            <div className="form-group">
              <label>Category Name</label>
              <input 
                type="text" 
                required 
                value={newCategoryName} 
                onChange={(e) => setNewCategoryName(e.target.value)} 
                placeholder="e.g. Smoothies" 
              />
            </div>
            {error && <small style={{ color: '#ef4444', display: 'block', marginTop: '-0.5rem', marginBottom: '1rem' }}>{error}</small>}
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Create Category</button>
          </form>
        </div>

        {/* Categories List */}
        <div className="admin-panel">
          <div className="admin-panel-header" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Tags size={18} /> Existing Categories
            </h3>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th style={{ width: '100px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category}>
                    <td style={{ fontWeight: 600 }}>{category}</td>
                    <td style={{ textAlign: 'center' }}>
                      {category !== 'All Flavors' ? (
                        <button 
                          className="action-btn" 
                          style={{ color: '#ef4444' }} 
                          onClick={() => handleDeleteCategory(category)}
                        >
                          <Trash2 size={18} />
                        </button>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Default</span>
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
