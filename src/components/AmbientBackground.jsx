import React from 'react';
import { motion } from 'framer-motion';
import './AmbientBackground.css';

export default function AmbientBackground() {
  return (
    <div className="ambient-bg-container">
      <div className="noise-overlay"></div>
      <motion.div 
        className="ambient-orb orb-primary"
        animate={{ 
          x: [0, 100, -50, 0], 
          y: [0, 50, -100, 0],
          scale: [1, 1.2, 0.9, 1] 
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="ambient-orb orb-secondary"
        animate={{ 
          x: [0, -150, 50, 0], 
          y: [0, -50, 150, 0],
          scale: [1, 0.8, 1.3, 1] 
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="ambient-orb orb-accent"
        animate={{ 
          x: [0, 80, -120, 0], 
          y: [0, 120, -80, 0],
          scale: [1, 1.4, 1.1, 1] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
