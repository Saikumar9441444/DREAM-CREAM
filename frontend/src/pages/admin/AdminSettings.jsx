import React, { useState } from 'react';
import { Save, Store, Phone, Clock } from 'lucide-react';
import './Admin.css';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: 'Cream Dream',
    whatsappNumber: '919014002314', // Using the placeholder we saw earlier
    openingTime: '10:00 AM',
    closingTime: '10:00 PM',
    status: 'Open'
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    // Here we would normally save to backend or localStorage
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', margin: 0 }}>Store Settings</h2>
        <button 
          className="btn-primary"
          style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={handleSave}
        >
          <Save size={20} /> {isSaved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="admin-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        
        {/* General Settings */}
        <div className="admin-panel">
          <div className="admin-panel-header" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', margin: 0 }}>
              <Store size={20} className="text-primary" /> General Info
            </h3>
          </div>
          
          <form className="admin-form">
            <div className="form-group">
              <label>Store Name</label>
              <input 
                type="text" 
                value={settings.storeName} 
                onChange={e => setSettings({...settings, storeName: e.target.value})} 
              />
            </div>
            
            <div className="form-group">
              <label>WhatsApp Business Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                <input 
                  type="text" 
                  value={settings.whatsappNumber} 
                  onChange={e => setSettings({...settings, whatsappNumber: e.target.value})} 
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
              <small style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Include country code without + (e.g. 919014002314)</small>
            </div>
          </form>
        </div>

        {/* Operating Hours */}
        <div className="admin-panel">
          <div className="admin-panel-header" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.2rem', margin: 0 }}>
              <Clock size={20} className="text-primary" /> Operating Hours
            </h3>
          </div>
          
          <form className="admin-form">
            <div className="form-group">
              <label>Store Status</label>
              <select 
                value={settings.status}
                onChange={e => setSettings({...settings, status: e.target.value})}
              >
                <option value="Open">Accepting Orders</option>
                <option value="Closed">Temporarily Closed</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Opening Time</label>
                <input 
                  type="text" 
                  value={settings.openingTime} 
                  onChange={e => setSettings({...settings, openingTime: e.target.value})} 
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Closing Time</label>
                <input 
                  type="text" 
                  value={settings.closingTime} 
                  onChange={e => setSettings({...settings, closingTime: e.target.value})} 
                />
              </div>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
