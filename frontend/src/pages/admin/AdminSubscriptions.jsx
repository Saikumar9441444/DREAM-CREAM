import React, { useState, useEffect } from 'react';
import { Repeat, Plus, Check, Star, Edit2, Trash2, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSubscriptions, addSubscription, updateSubscription, deleteSubscription } from '../../data/subscriptionStore';
import './Admin.css';

export default function AdminSubscriptions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    frequency: 'Weekly',
    subscribers: 0,
    features: '',
    popular: false
  });

  const fetchPlans = async () => {
    const data = await getSubscriptions();
    setPlans(data);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      price: '',
      frequency: 'Weekly',
      subscribers: 0,
      features: '',
      popular: false
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setFormData({
      name: plan.name,
      price: plan.price,
      frequency: plan.frequency,
      subscribers: plan.subscribers,
      features: plan.features.join(', '),
      popular: plan.popular
    });
    setEditId(plan._id || plan.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscription plan?')) {
      await deleteSubscription(id);
      await fetchPlans();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      subscribers: Number(formData.subscribers),
      features: formData.features.split(',').map(f => f.trim()).filter(Boolean)
    };

    if (isEditing) {
      await updateSubscription(editId, payload);
    } else {
      await addSubscription(payload);
    }
    await fetchPlans();
    setIsModalOpen(false);
  };

  const filteredPlans = plans.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: '10px',
    border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none',
    fontSize: '0.95rem', transition: 'border-color 0.2s'
  };

  const labelStyle = {
    display: 'block', marginBottom: '0.4rem', fontWeight: 600,
    color: '#475569', fontSize: '0.9rem'
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.2rem', margin: 0, fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Repeat size={28} style={{ color: 'var(--color-primary)' }} /> Subscription Plans
        </h2>
        <button className="btn-pro btn-pro-primary" onClick={handleOpenAdd}>
          <Plus size={18} /> Create New Plan
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Search plans..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {filteredPlans.map((plan, index) => (
          <motion.div 
            key={plan._id || plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="admin-panel-pro"
            style={{ 
              position: 'relative',
              display: 'flex', 
              flexDirection: 'column',
              border: plan.popular ? '2px solid var(--color-primary)' : '1px solid rgba(255, 255, 255, 0.6)'
            }}
          >
            {plan.popular && (
              <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-primary)', color: 'white', padding: '0.25rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Star size={14} /> Most Popular
              </div>
            )}
            
            <div style={{ textAlign: 'center', marginBottom: '1.5rem', marginTop: plan.popular ? '1rem' : '0' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.5rem 0' }}>{plan.name}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.25rem' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a' }}>₹{plan.price}</span>
                <span style={{ color: '#64748b', fontWeight: 600 }}>/{plan.frequency.toLowerCase()}</span>
              </div>
              <p style={{ margin: '1rem 0 0 0', color: '#10b981', fontWeight: 600, fontSize: '0.9rem', background: '#dcfce7', display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '12px' }}>
                {plan.subscribers} Active Subscribers
              </p>
            </div>

            <div style={{ flex: 1, borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', marginBottom: '2rem' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {plan.features.map((feature, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569', fontWeight: 500 }}>
                    <div style={{ background: '#e0f2fe', color: '#0ea5e9', borderRadius: '50%', padding: '4px' }}>
                      <Check size={14} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: 'auto' }}>
              <button className="btn-pro btn-pro-outline" style={{ justifyContent: 'center' }} onClick={() => handleOpenEdit(plan)}>
                <Edit2 size={16} /> Edit
              </button>
              <button className="btn-pro" style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', justifyContent: 'center' }} onClick={() => handleDelete(plan._id || plan.id)}>
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit/Add Modal */}
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
                <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#1e293b' }}>{isEditing ? 'Edit Plan' : 'Create New Plan'}</h3>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Plan Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} placeholder="e.g. Family Pack Weekly" />
                </div>
                <div>
                  <label style={labelStyle}>Price (₹)</label>
                  <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} style={inputStyle} placeholder="e.g. 1499" />
                </div>
                <div>
                  <label style={labelStyle}>Frequency</label>
                  <select required value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value})} style={inputStyle}>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Subscribers</label>
                  <input type="number" value={formData.subscribers} onChange={e => setFormData({...formData, subscribers: e.target.value})} style={inputStyle} placeholder="e.g. 42" />
                </div>
                <div>
                  <label style={labelStyle}>Features (comma separated)</label>
                  <input type="text" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} style={inputStyle} placeholder="e.g. Free Delivery, Extra sauce" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input type="checkbox" id="popular" checked={formData.popular} onChange={e => setFormData({...formData, popular: e.target.checked})} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  <label htmlFor="popular" style={{ fontWeight: 600, color: '#475569', cursor: 'pointer' }}>Mark as Popular</label>
                </div>
                <button type="submit" className="btn-pro btn-pro-primary" style={{ marginTop: '0.5rem', padding: '1rem' }}>
                  <Check size={18} /> {isEditing ? 'Save Changes' : 'Create Plan'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
