import React, { useState, useEffect, Suspense } from 'react';
import { Outlet, Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Tags, ShoppingCart, Settings, LogOut, Menu, X } from 'lucide-react';
import './Admin.css';

const AdminSkeleton = () => (
  <div className="admin-skeleton">
    <div className="skeleton-box skeleton-title"></div>
    <div className="skeleton-card-container">
      <div className="skeleton-box skeleton-card"></div>
      <div className="skeleton-box skeleton-card"></div>
      <div className="skeleton-box skeleton-card"></div>
    </div>
    <div className="skeleton-box skeleton-table"></div>
  </div>
);

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('dream_cream_admin_auth');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/pos', icon: <ShoppingCart size={20} />, label: 'POS Terminal' },
    { path: '/admin/products', icon: <Package size={20} />, label: 'Products' },
    { path: '/admin/categories', icon: <Tags size={20} />, label: 'Categories' },
    { path: '/admin/orders', icon: <ShoppingCart size={20} />, label: 'Orders' },
    { path: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className={`admin-layout ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar Overlay for Mobile */}
      {!isSidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}
      
      {/* Sidebar */}
      <aside className={`admin-sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
        <div className="admin-sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'space-between' : 'center', marginBottom: '2rem' }}>
          <Link to="/" className="admin-brand" style={{ display: isSidebarOpen ? 'flex' : 'none', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'inherit', margin: 0 }}>
            <img src="/logo.png" alt="Cream Dream Logo" />
            <h2 className="brand-text" style={{ fontSize: '1.1rem', lineHeight: '1.2' }}>
              CREAM<br />DREAM
            </h2>
          </Link>
          <button className="sidebar-toggle-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Menu size={24} />
          </button>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
              title={!isSidebarOpen ? item.label : ""}
            >
              <div className="nav-icon">{item.icon}</div>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="admin-logout" onClick={handleLogout} title={!isSidebarOpen ? "Logout" : ""}>
          <LogOut size={20} />
          <span className="nav-label">Logout</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main">
        <header className="admin-topbar">
          <h2 className="admin-topbar-title">Admin Panel</h2>
          <div className="admin-profile">
            <span className="text-sm font-semibold text-gray-500">Hello, Admin</span>
            <div className="admin-avatar">A</div>
          </div>
        </header>

        <div className="admin-content">
          <Suspense fallback={<AdminSkeleton />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
