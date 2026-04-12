import React from 'react';
import { IceCream2, Share2, Mail, MessageCircle } from 'lucide-react';
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
            <motion.a whileHover={{ scale: 1.2, color: 'var(--color-primary)' }} whileTap={{ scale: 0.9 }} href="#" aria-label="Share"><Share2 size={20} /></motion.a>
            <motion.a whileHover={{ scale: 1.2, color: 'var(--color-primary)' }} whileTap={{ scale: 0.9 }} href="#" aria-label="Mail"><Mail size={20} /></motion.a>
            <motion.a whileHover={{ scale: 1.2, color: 'var(--color-primary)' }} whileTap={{ scale: 0.9 }} href="#" aria-label="Chat"><MessageCircle size={20} /></motion.a>
          </div>
        </div>
        
        <div className="footer-links">
          <h4>Explore</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Our Flavors</a></li>
            <li><a href="/about">Our Story</a></li>
            <li><a href="/orders">Order Now</a></li>
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
