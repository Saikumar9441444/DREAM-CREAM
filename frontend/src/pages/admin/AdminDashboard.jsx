import React from 'react';
import { 
  Users, UserCheck, UserX, IndianRupee, AlertTriangle, 
  TrendingUp, Plus, Eye, Settings, Clock, Star, Bell 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="fade-in" style={{ paddingBottom: '2rem' }}>
      
      {/* 1. TOP ROW STAT CARDS (5 Cards) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginBottom: '1.5rem' 
      }}>
        {/* Card 1 */}
        <div className="admin-stat-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ background: '#e0f2fe', color: '#0ea5e9', padding: '8px', borderRadius: '8px', alignSelf: 'flex-start' }}>
            <Users size={20} />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', lineHeight: '1' }}>3,277</h2>
          <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Total Orders</h3>
        </div>

        {/* Card 2 */}
        <div className="admin-stat-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ background: '#dbeafe', color: '#3b82f6', padding: '8px', borderRadius: '8px', alignSelf: 'flex-start' }}>
            <UserCheck size={20} />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', lineHeight: '1' }}>14</h2>
          <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Active Orders</h3>
        </div>

        {/* Card 3 */}
        <div className="admin-stat-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ background: '#fef3c7', color: '#d97706', padding: '8px', borderRadius: '8px', alignSelf: 'flex-start' }}>
            <UserX size={20} />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', lineHeight: '1' }}>24</h2>
          <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Total Flavors</h3>
        </div>

        {/* Card 4 */}
        <div className="admin-stat-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ background: '#dcfce7', color: '#16a34a', padding: '8px', borderRadius: '8px', alignSelf: 'flex-start' }}>
            <IndianRupee size={20} />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', lineHeight: '1' }}>₹7,960</h2>
          <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Today's Revenue</h3>
        </div>

        {/* Card 5 */}
        <div className="admin-stat-card" style={{ padding: '1.5rem', border: '1px solid #fee2e2', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ background: '#fee2e2', color: '#ef4444', padding: '8px', borderRadius: '8px', alignSelf: 'flex-start' }}>
            <AlertTriangle size={20} />
          </div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', lineHeight: '1', color: '#ef4444' }}>₹2,450</h2>
          <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#ef4444', fontWeight: 500 }}>Pending Payments</h3>
        </div>
      </div>

      {/* 2. MAIN 3-COLUMN GRID */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        
        {/* --- LEFT COLUMN: CHART --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
          <div className="admin-panel" style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
            <div className="admin-panel-header" style={{ marginBottom: '1rem' }}>
              <h3>Order Growth</h3>
            </div>
            {/* Chart Placeholder */}
            <div style={{ flex: 1, border: '1px dashed #cbd5e1', borderRadius: '12px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <TrendingUp size={64} style={{ opacity: 0.1 }} />
              <p style={{ position: 'absolute', color: '#64748b', fontWeight: 600 }}>Interactive Chart Area</p>
              
              {/* Fake Chart Lines */}
              <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, opacity: 0.5 }}>
                <path d="M 0,200 C 50,150 100,180 150,100 C 200,20 250,80 300,50 C 350,20 400,60 500,10" fill="none" stroke="#3b82f6" strokeWidth="3" />
                <path d="M 0,250 C 50,220 100,240 150,200 C 200,160 250,190 300,150 C 350,110 400,130 500,80" fill="none" stroke="#10b981" strokeWidth="3" />
              </svg>
            </div>
          </div>
          
          {/* Two small boxes below chart */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="admin-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', flexShrink: 0 }}></div>
                <span style={{ fontSize: '0.9rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>New Orders</span>
              </div>
              <h3 style={{ margin: 0 }}>24</h3>
            </div>
            <div className="admin-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                <div style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%', flexShrink: 0 }}></div>
                <span style={{ fontSize: '0.9rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Cumulative Total</span>
              </div>
              <h3 style={{ margin: 0 }}>3,275</h3>
            </div>
          </div>
        </div>

        {/* --- MIDDLE COLUMN: QUICK ACTIONS --- */}
        <div className="admin-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: 0 }}>
          <div className="admin-panel-header">
            <h3>Quick Actions</h3>
          </div>
          <button 
            onClick={() => navigate('/admin/products')}
            style={{ padding: '1.2rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'transform 0.2s' }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Plus size={20} /> Add New Flavor
          </button>
          <button 
            onClick={() => navigate('/admin/orders')}
            style={{ padding: '1.2rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'transform 0.2s' }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Eye size={20} /> Live Order KDS
          </button>
          <button 
            onClick={() => navigate('/admin/settings')}
            style={{ padding: '1.2rem', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'transform 0.2s' }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Settings size={20} /> Store Settings
          </button>
        </div>

        {/* --- RIGHT COLUMN: ALERTS & LISTS --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
          
          {/* Alerts Panel */}
          <div className="admin-panel">
            <div className="admin-panel-header" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={18} color="#f59e0b" /> Alerts
              </h3>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <div style={{ flex: 1, background: '#fef2f2', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <Clock size={20} color="#ef4444" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>Delayed</div>
                <div style={{ fontSize: '1.5rem', color: '#ef4444', fontWeight: 700 }}>2</div>
              </div>
              <div style={{ flex: 1, background: '#fffbeb', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                <AlertTriangle size={20} color="#f59e0b" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 600 }}>Low Stock</div>
                <div style={{ fontSize: '1.5rem', color: '#f59e0b', fontWeight: 700 }}>5</div>
              </div>
            </div>
            <button style={{ width: '100%', marginTop: '1rem', padding: '0.8rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#64748b', fontWeight: 600, cursor: 'pointer' }}>
              View All Alerts
            </button>
          </div>

          {/* Top Flavors Panel */}
          <div className="admin-panel" style={{ flex: 1 }}>
            <div className="admin-panel-header" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Star size={18} color="#f59e0b" /> Top Flavors
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>This Month</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ minWidth: 0, paddingRight: '10px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>Strawberry Dream</h4>
                  <small style={{ color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>₹120 / scoop</small>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ color: '#10b981', fontWeight: 700 }}>342</div>
                  <small style={{ color: '#64748b' }}>Sold</small>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ minWidth: 0, paddingRight: '10px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>Mango Sorbet</h4>
                  <small style={{ color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>₹150 / scoop</small>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ color: '#10b981', fontWeight: 700 }}>289</div>
                  <small style={{ color: '#64748b' }}>Sold</small>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ minWidth: 0, paddingRight: '10px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>Classic Vanilla</h4>
                  <small style={{ color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>₹90 / scoop</small>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ color: '#10b981', fontWeight: 700 }}>156</div>
                  <small style={{ color: '#64748b' }}>Sold</small>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
