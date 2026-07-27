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
      const completedOrders = orders.filter(o => o.status === 'completed');
      
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
        <h2 style={{ fontSize: '2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart2 size={28} className="text-primary" /> iAnalytics
        </h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select className="btn-outline-primary" style={{ padding: '0.5rem 1rem' }}>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Year</option>
          </select>
          <button className="btn-primary">Download Report</button>
        </div>
      </div>

      <div className="admin-grid" style={{ gridTemplateColumns: '1fr' }}>
        <motion.div 
          className="admin-panel" 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2rem' }}
        >
          <div className="admin-panel-header" style={{ marginBottom: '2rem' }}>
            <h3>Revenue Overview</h3>
          </div>
          
          <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '15px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
            {chartData.map((data, index) => {
              const maxTotal = Math.max(...chartData.map(d => d.total), 1);
              const heightPct = (data.total / maxTotal) * 100;
              return (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    width: '100%', 
                    height: `${heightPct}%`, 
                    minHeight: '4px',
                    background: 'linear-gradient(to top, var(--color-primary), #FF9EBB)', 
                    borderRadius: '8px 8px 0 0',
                    transition: 'height 1s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative'
                  }}>
                    <div style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontWeight: 'bold', color: 'var(--color-primary)', fontSize: '0.85rem' }}>
                      ₹{data.total}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>{data.date}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
      
      <div className="admin-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="admin-panel">
           <h3 style={{ marginBottom: '1rem' }}>Top Selling Products</h3>
           <p style={{ color: 'var(--color-text-muted)' }}>More detailed product analytics will be available in future updates.</p>
        </div>
        <div className="admin-panel">
           <h3 style={{ marginBottom: '1rem' }}>Traffic Sources</h3>
           <p style={{ color: 'var(--color-text-muted)' }}>Connect Google Analytics to view traffic sources.</p>
        </div>
      </div>
    </div>
  );
}
