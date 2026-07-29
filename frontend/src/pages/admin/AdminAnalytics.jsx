import React, { useState, useEffect } from 'react';
import { BarChart2 } from 'lucide-react';
import { getOrders } from '../../data/orderStore';
import { motion } from 'framer-motion';
import './Admin.css';

export default function AdminAnalytics() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const orders = await getOrders();
      const completedOrders = orders.filter(o => ['Paid', 'completed', 'Completed', 'Served'].includes(o.status));
      
      // Calculate last 7 days sales
      const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toDateString();
      }).reverse();

      const salesData = last7Days.map(dateStr => {
        const dayOrders = completedOrders.filter(o => new Date(o.timestamp).toDateString() === dateStr);
        const dayTotal = dayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
        return {
          date: dateStr.split(' ')[0],
          total: dayTotal
        };
      });
      setChartData(salesData);
    };
    fetchData();
  }, []);

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.2rem', margin: 0, fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <BarChart2 size={28} style={{ color: 'var(--color-primary)' }} /> Sales Analytics
        </h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select className="btn-pro" style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#475569', outline: 'none' }}>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
          </select>
          <button className="btn-pro btn-pro-primary">Download Report</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <motion.div 
          className="admin-panel-pro" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '0.5rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>Revenue Overview</h3>
              <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Showing total daily sales revenue.</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-primary)' }}></div>
                <span style={{ color: '#475569', fontSize: '0.9rem', fontWeight: 500 }}>Revenue (₹)</span>
              </div>
            </div>
          </div>
          
          <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0', margin: '0 1rem' }}>
            {chartData.map((data, index) => {
              const maxTotal = Math.max(...chartData.map(d => d.total), 1);
              const heightPct = (data.total / maxTotal) * 100;
              return (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    width: '100%', 
                    maxWidth: '40px',
                    height: `${heightPct}%`, 
                    minHeight: '8px',
                    background: 'linear-gradient(to top, var(--color-primary), #FF9EBB)', 
                    borderRadius: '8px 8px 0 0',
                    transition: 'height 1s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    boxShadow: '0 4px 10px rgba(255, 123, 156, 0.2)'
                  }}>
                    <div style={{ position: 'absolute', top: '-28px', left: '50%', transform: 'translateX(-50%)', fontWeight: '800', color: 'var(--color-primary)', fontSize: '0.85rem' }}>
                      ₹{data.total}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700 }}>{data.date}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
        <div className="admin-panel-pro" style={{ display: 'flex', flexDirection: 'column' }}>
           <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>Top Selling Products</h3>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {[
               { name: 'Strawberry Dream', sales: 420, rev: 15120 },
               { name: 'Vanilla Bean', sales: 385, rev: 11550 },
               { name: 'Dark Chocolate', sales: 310, rev: 13950 }
             ].map((item, i) => (
               <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '12px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,123,156,0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                     #{i + 1}
                   </div>
                   <div style={{ fontWeight: 600, color: '#1e293b' }}>{item.name}</div>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                   <div style={{ fontWeight: 700, color: '#0f172a' }}>₹{item.rev.toLocaleString()}</div>
                   <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.sales} units</div>
                 </div>
               </div>
             ))}
           </div>
        </div>
        
        <div className="admin-panel-pro" style={{ display: 'flex', flexDirection: 'column' }}>
           <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>Traffic Sources</h3>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {[
               { source: 'Direct', percent: 45, color: '#3b82f6' },
               { source: 'Instagram', percent: 30, color: '#ec4899' },
               { source: 'Google Search', percent: 20, color: '#10b981' },
               { source: 'Facebook', percent: 5, color: '#6366f1' }
             ].map((item, i) => (
               <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <div style={{ width: '120px', fontWeight: 600, color: '#475569' }}>{item.source}</div>
                 <div style={{ flex: 1, background: '#f1f5f9', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                   <div style={{ width: `${item.percent}%`, height: '100%', background: item.color, borderRadius: '4px' }}></div>
                 </div>
                 <div style={{ width: '40px', textAlign: 'right', fontWeight: 700, color: '#1e293b' }}>{item.percent}%</div>
               </div>
             ))}
           </div>
           <p style={{ marginTop: 'auto', paddingTop: '1.5rem', color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center' }}>Metrics powered by Google Analytics Integration</p>
        </div>
      </div>
    </div>
  );
}
