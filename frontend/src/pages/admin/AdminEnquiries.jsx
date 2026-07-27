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
        <h2 style={{ fontSize: '2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageSquare size={28} className="text-primary" /> Enquiries
        </h2>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header" style={{ borderBottom: '1px solid #eee', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input 
              type="text" 
              placeholder="Search messages..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
            />
          </div>
        </div>

        <div className="admin-table-container">
          {filteredEnquiries.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <Mail size={48} style={{ color: 'var(--color-primary)', opacity: 0.5, margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Messages Yet</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>When customers use the contact form, messages will appear here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <AnimatePresence>
                {filteredEnquiries.map((enquiry) => (
                  <motion.div 
                    key={enquiry._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    style={{ 
                      padding: '1.5rem', 
                      background: enquiry.status === 'unread' ? '#f0f9ff' : '#f8fafc', 
                      borderLeft: enquiry.status === 'unread' ? '4px solid var(--color-primary)' : '4px solid transparent',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {enquiry.name} 
                          {enquiry.status === 'unread' && <span style={{ fontSize: '0.7rem', background: 'var(--color-primary)', color: 'white', padding: '2px 6px', borderRadius: '12px' }}>New</span>}
                        </h3>
                        <a href={`mailto:${enquiry.email}`} style={{ color: '#64748b', fontSize: '0.9rem', textDecoration: 'none' }}>{enquiry.email}</a>
                      </div>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                        {new Date(enquiry.timestamp).toLocaleString()}
                      </span>
                    </div>
                    
                    <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#334155', lineHeight: '1.5' }}>
                      <p style={{ margin: 0 }}><strong>Phone/Subject:</strong> {enquiry.subject}</p>
                      <hr style={{ border: 0, borderTop: '1px solid #e2e8f0', margin: '0.5rem 0' }} />
                      <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{enquiry.message}</p>
                    </div>

                    {enquiry.status === 'unread' && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button 
                          className="btn-outline-primary" 
                          onClick={() => handleMarkAsRead(enquiry._id)}
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                          <Check size={16} /> Mark as Read
                        </button>
                      </div>
                    )}
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
