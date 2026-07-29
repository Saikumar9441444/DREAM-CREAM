import React, { useState, useEffect } from 'react';
import { Users, Search, Download, Star, MapPin, Mail, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOrders } from '../../data/orderStore';
import './Admin.css';

export default function AdminCustomers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const orders = await getOrders();
        // Group orders by customerName + phone
        const customerMap = {};
        orders.forEach(order => {
          const name = order.customerName || 'Dine-In Guest';
          const phone = order.phone || 'N/A';
          const key = `${name}-${phone}`;
          if (!customerMap[key]) {
            customerMap[key] = {
              id: `CUST-${Object.keys(customerMap).length + 101}`,
              name: name,
              email: order.email || 'guest@creamdream.com',
              phone: phone,
              location: order.address || 'Dine-In',
              totalOrders: 0,
              totalSpent: 0,
              status: 'Regular',
              joinDate: new Date(order.timestamp || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
            };
          }
          customerMap[key].totalOrders += 1;
          customerMap[key].totalSpent += order.totalAmount || 0;
        });

        const list = Object.values(customerMap);
        list.forEach(c => {
          if (c.totalOrders >= 5) c.status = 'VIP';
          else if (c.totalOrders >= 2) c.status = 'Loyal';
        });

        setCustomers(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.2rem', margin: 0, fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Users size={28} style={{ color: 'var(--color-primary)' }} /> Customer Directory
        </h2>
        <button className="btn-pro btn-pro-outline">
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="admin-panel-pro">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', width: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search by Name, Email, or ID..." 
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
                <th>Customer</th>
                <th>Contact Info</th>
                <th>Location</th>
                <th>Orders & Spend</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredCustomers.length === 0 ? (
                   <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No customers found.</td></tr>
                ) : filteredCustomers.map((customer, index) => (
                  <motion.tr 
                    key={customer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,123,156,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--color-primary)', fontSize: '1.1rem' }}>
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#1e293b' }}>{customer.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.85rem' }}><Mail size={14}/> {customer.email}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.85rem' }}><Phone size={14}/> {customer.phone}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#475569', fontSize: '0.85rem' }}>
                        <MapPin size={14} /> {customer.location}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>₹{customer.totalSpent.toLocaleString()}</span>
                        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{customer.totalOrders} Orders</span>
                      </div>
                    </td>
                    <td>
                      {customer.status === 'VIP' ? (
                        <span className="badge-pro primary" style={{ display: 'inline-flex', gap: '0.25rem' }}><Star size={12} fill="currentColor" /> VIP</span>
                      ) : customer.status === 'Loyal' ? (
                        <span className="badge-pro info">Loyal</span>
                      ) : (
                        <span className="badge-pro" style={{ background: '#f1f5f9', color: '#64748b' }}>Regular</span>
                      )}
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.9rem' }}>
                      {customer.joinDate}
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
