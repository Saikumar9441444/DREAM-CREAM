import React, { useState, useEffect } from 'react';
import { Save, Store, Phone, Clock, Trash2 } from 'lucide-react';
import { getSettings, updateSettings } from '../../data/settingsStore';
import { clearOrders } from '../../data/orderStore';
import { motion } from 'framer-motion';
import './Admin.css';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: 'Cream Dream',
    whatsappNumber: '919014002314',
    openingHours: '10:00 AM - 11:00 PM',
    status: 'Open'
  });

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getSettings();
      setSettings(data);
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    await updateSettings(settings);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleResetOrders = async () => {
    if (window.confirm("⚠️ WARNING: This will permanently delete all orders from the database. Are you sure you want to reset everything to 0?")) {
      try {
        await clearOrders();
        alert("✨ All orders successfully cleared! Admin dashboard is now fresh at 0.");
      } catch (err) {
        alert("Failed to reset database: " + err.message);
      }
    }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '2.2rem', margin: 0, fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Store size={28} style={{ color: 'var(--color-primary)' }} /> Settings & Configuration
        </h2>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className="btn-pro"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5' }}
            onClick={handleResetOrders}
          >
            <Trash2 size={18} /> Reset Database (0)
          </button>
          <button 
            className="btn-pro btn-pro-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            onClick={handleSave}
          >
            <Save size={18} /> {isSaved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        
        {/* General Settings */}
        <motion.div 
          className="admin-panel-pro"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>
              <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '8px', color: 'var(--color-primary)' }}>
                <Store size={20} />
              </div>
              General Info
            </h3>
            <p style={{ margin: '0.5rem 0 0 3rem', color: '#64748b', fontSize: '0.9rem' }}>Basic details and contact information</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>Store Name</label>
              <input 
                type="text" 
                value={settings.storeName} 
                onChange={e => setSettings({...settings, storeName: e.target.value})} 
                style={{ padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>WhatsApp Business Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="text" 
                  value={settings.whatsappNumber} 
                  onChange={e => setSettings({...settings, whatsappNumber: e.target.value})} 
                  style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>
              <small style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Include country code without + (e.g. 919014002314)</small>
            </div>
          </div>
        </motion.div>

        {/* Operating Hours */}
        <motion.div 
          className="admin-panel-pro"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>
              <div style={{ background: '#f8fafc', padding: '0.5rem', borderRadius: '8px', color: 'var(--color-primary)' }}>
                <Clock size={20} />
              </div>
              Operating Hours
            </h3>
            <p style={{ margin: '0.5rem 0 0 3rem', color: '#64748b', fontSize: '0.9rem' }}>Manage store availability and timings</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>Store Status</label>
              <select 
                value={settings.status}
                onChange={e => setSettings({...settings, status: e.target.value})}
                style={{ padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              >
                <option value="Open">Accepting Orders</option>
                <option value="Closed">Temporarily Closed</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, color: '#1e293b', fontSize: '0.95rem' }}>Opening Hours</label>
                <input 
                  type="text" 
                  value={settings.openingHours || ''} 
                  onChange={e => setSettings({...settings, openingHours: e.target.value})} 
                  placeholder="e.g. 10:00 AM - 11:00 PM"
                  style={{ padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
                <small style={{ color: '#94a3b8', fontSize: '0.8rem' }}>e.g. 10:00 AM - 11:00 PM</small>
              </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
