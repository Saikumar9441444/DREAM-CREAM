import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Menu, X, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar({ onOpenCart }) {
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  
  const { cartTotalItems } = useCart();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState('');

  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Autofocus search input when expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  const navLinks = [
    { path: '/home', label: 'HOME' },
    { path: '/products', label: 'FLAVORS' },
    { path: '/about', label: 'ABOUT US' },
    { path: '/contact', label: 'CONTACT' }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(navSearchQuery.trim())}`);
      setIsSearchExpanded(false);
      setNavSearchQuery('');
    }
  };

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (isSearchExpanded) setNavSearchQuery('');
  };

  const navbarClasses = [
    'navbar-modern',
    (isHomePage && !scrolled) ? 'style-transparent-light' : 'style-professional-colored',
    scrolled ? 'scrolled' : ''
  ].filter(Boolean).join(' ');

  return (
    <nav className={navbarClasses}>
      <div className="navbar-inner container">
        {/* Left: Brand Identity */}
        <Link to="/" className="navbar-brand">
          <img src="/logo.png" alt="Logo" className="brand-logo" />
          <span className="brand-name">CREAM DREAM</span>
        </Link>

        {/* Center: Essential Navigation */}
        <div className="navbar-nav">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.div layoutId="nav-line" className="nav-line" />
              )}
            </Link>
          ))}
        </div>

        {/* Right: Functional Actions */}
        <div className="navbar-actions">
          <div className={`nav-search-wrapper ${isSearchExpanded ? 'expanded' : ''}`}>
            <form onSubmit={handleSearchSubmit} className="nav-search-form">
              <AnimatePresence>
                {isSearchExpanded && (
                  <motion.input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search flavors..."
                    className="nav-search-input"
                    value={navSearchQuery}
                    onChange={(e) => setNavSearchQuery(e.target.value)}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 200, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </AnimatePresence>
              <button 
                type="button" 
                className="action-btn" 
                onClick={toggleSearch}
                aria-label="Toggle Search"
              >
                {isSearchExpanded ? <X size={20} /> : <Search size={20} />}
              </button>
            </form>
          </div>

          <button className="cart-trigger" onClick={onOpenCart} aria-label="Open Parcel">
            <Package size={20} />
            {cartTotalItems > 0 && (
              <span className="cart-indicator">{cartTotalItems}</span>
            )}
          </button>

          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="mobile-drawer"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="drawer-header container">
              <span className="brand-name dark">MENU</span>
              <button onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
            </div>
            <div className="drawer-content">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} className="drawer-link" onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
