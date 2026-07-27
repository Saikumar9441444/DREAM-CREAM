import React from 'react';
import { Link } from 'react-router-dom';
import { IceCream2 } from 'lucide-react';
import { motion } from 'framer-motion';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer overflow-hidden">
      <motion.div 
        className="container footer-content"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="footer-brand">
          <div className="footer-logo">
            <IceCream2 className="logo-icon" size={28} color="var(--color-primary)" />
            <span className="logo-text">Cream Dream</span>
          </div>
          <p>Handcrafted, artisanal ice cream made with love and magic, daily.</p>
          <div className="social-links">
            <motion.a whileHover={{ scale: 1.2, color: 'var(--color-primary)' }} whileTap={{ scale: 0.9 }} href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </motion.a>
            <motion.a whileHover={{ scale: 1.2, color: 'var(--color-primary)' }} whileTap={{ scale: 0.9 }} href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </motion.a>
            <motion.a whileHover={{ scale: 1.2, color: 'var(--color-primary)' }} whileTap={{ scale: 0.9 }} href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </motion.a>
          </div>
        </div>
        
        <div className="footer-links">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Our Flavors</Link></li>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/orders">Order Now</Link></li>
          </ul>
        </div>
        
        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>MG Road</p>
          <p>Nellore, Andhra Pradesh</p>
          <p>OCW@gmail.com</p>
          <p>9014002314</p>
        </div>
      </motion.div>
      <motion.div 
        className="footer-bottom"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <p>&copy; {new Date().getFullYear()} Cream Dream Ice Cream Shop. All rights reserved.</p>
      </motion.div>
    </footer>
  );
}
