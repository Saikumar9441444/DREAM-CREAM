import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, IceCream } from 'lucide-react';

export default function NotFound() {
  return (
    <motion.div
      className="not-found-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        textAlign: 'center',
        padding: '2rem',
        gap: '1.5rem'
      }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
      >
        <IceCream size={80} style={{ color: 'var(--color-primary)', opacity: 0.8 }} />
      </motion.div>
      
      <motion.h1
        style={{ 
          fontSize: 'clamp(3rem, 8vw, 6rem)', 
          fontFamily: 'var(--font-serif)', 
          color: 'var(--color-primary)',
          lineHeight: 1,
          margin: 0
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        404
      </motion.h1>

      <motion.h2
        style={{ 
          fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', 
          fontFamily: 'var(--font-serif)',
          opacity: 0.9,
          margin: 0
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        This flavor doesn't exist... yet!
      </motion.h2>

      <motion.p
        style={{ opacity: 0.6, maxWidth: '400px', lineHeight: 1.6 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.5 }}
      >
        Looks like this page melted away. But don't worry — we have plenty of delicious options waiting for you.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <Link to="/" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowLeft size={18} /> Back to Home
        </Link>
        <Link to="/products" className="btn-primary" style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'transparent', 
          border: '2px solid var(--color-primary)', 
          color: 'var(--color-primary)' 
        }}>
          Explore Flavors
        </Link>
      </motion.div>
    </motion.div>
  );
}
