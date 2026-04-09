import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar({ onOpenCart }) {
  const location = useLocation();
  const { cartTotalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Flavors' },
    { path: '/about', label: 'About Us' }
  ];

  return (
    <motion.nav 
      className={`navbar ${scrolled ? 'scrolled glass-panel' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <div className="navbar-container container">
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="Cream Dream Logo" className="logo-image" />
          <span className="logo-text">Cream Dream</span>
        </Link>
        
        <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className="nav-link relative">
              {link.label}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="underline"
                  className="active-underline"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          ))}
          
          <Link to="/orders" className="nav-btn ml-4">
            Order Now
          </Link>
          
          <button className="nav-cart" onClick={onOpenCart} aria-label="Cart">
            <ShoppingCart size={24} color="var(--color-text-main)" />
            {cartTotalItems > 0 && (
              <motion.span 
                className="cart-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={cartTotalItems}
              >
                {cartTotalItems}
              </motion.span>
            )}
          </button>
        </div>
        
        <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </motion.nav>
  );
}
