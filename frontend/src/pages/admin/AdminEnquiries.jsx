import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Check, Trash2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEnquiries, updateEnquiry } from '../../data/enquiryStore';
import './Admin.css';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    const data = await getEnquiries();
    setEnquiries(data);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await updateEnquiry(id, { status: 'read' });
      fetchEnquiries();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredEnquiries = enquiries.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.2rem', margin: 0, fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MessageSquare size={28} style={{ color: 'var(--color-primary)' }} /> Customer Enquiries
        </h2>
      </div>

      <div className="admin-panel-pro" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)', minHeight: '600px', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', borderRadius: '16px 16px 0 0' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b', fontWeight: 700 }}>Inbox</h3>
          <div style={{ position: 'relative', width: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search by sender or content..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#ffffff', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', background: '#ffffff' }}>
          {filteredEnquiries.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', gap: '1rem' }}>
              <Mail size={48} style={{ opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: '1.1rem' }}>Inbox is empty</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <AnimatePresence>
                {filteredEnquiries.map((enquiry) => (
                  <motion.div 
                    key={enquiry._id || enquiry.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ 
                      padding: '1.5rem', 
                      background: enquiry.status === 'unread' ? '#f0f9ff' : '#ffffff', 
                      borderLeft: enquiry.status === 'unread' ? '4px solid var(--color-primary)' : '4px solid transparent',
                      borderBottom: '1px solid #f1f5f9',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      transition: 'background 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if(enquiry.status !== 'unread') e.currentTarget.style.background = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      if(enquiry.status !== 'unread') e.currentTarget.style.background = '#ffffff';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: enquiry.status === 'unread' ? 'var(--color-primary)' : '#e2e8f0', color: enquiry.status === 'unread' ? 'white' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                          {enquiry.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 style={{ margin: '0 0 0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b', fontSize: '1.1rem' }}>
                            {enquiry.name}
                            {enquiry.status === 'unread' && <span className="badge-pro primary" style={{ fontSize: '0.7rem' }}>New</span>}
                          </h3>
                          <a href={`mailto:${enquiry.email}`} style={{ color: '#64748b', fontSize: '0.9rem', textDecoration: 'none', display: 'block', marginBottom: '0.5rem' }}>{enquiry.email}</a>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}>
                        {new Date(enquiry.timestamp).toLocaleString()}
                      </span>
                    </div>
                    
                    <div style={{ marginLeft: '56px', background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#334155', lineHeight: '1.6' }}>
                      <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>{enquiry.subject || 'Enquiry'}</p>
                      <p style={{ margin: '0.5rem 0 0 0', whiteSpace: 'pre-wrap', color: '#475569' }}>{enquiry.message}</p>
                    </div>

                    <div style={{ marginLeft: '56px', display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                       {enquiry.status === 'unread' && (
                         <button 
                           onClick={() => handleMarkAsRead(enquiry._id || enquiry.id)}
                           className="btn-pro"
                           style={{ background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0', padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                         >
                           <Check size={16} /> Mark as Read
                         </button>
                       )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
