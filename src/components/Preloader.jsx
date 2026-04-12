import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Preloader.css';
import { STATIC_PRODUCTS } from '../data/staticProducts';

export default function Preloader({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 1. Identify all critical assets
    const imagesToLoad = [
      '/logo.png',
      '/assets/hero_bg.png', 
      '/videos/hero_scoop.gif', // Only if we want to wait for the big one on desktop
      ...new Set(STATIC_PRODUCTS.map(p => p.image)) // All flavor visuals
    ];

    let loadedCount = 0;
    const totalAssets = imagesToLoad.length;

    if (totalAssets === 0) {
      setIsVisible(false);
      if (onComplete) onComplete();
      return;
    }

    const loadAsset = (src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedCount++;
          setProgress((loadedCount / totalAssets) * 100);
          resolve();
        };
        img.onerror = () => {
          loadedCount++; // Count as "done" even if fail to avoid hanging
          setProgress((loadedCount / totalAssets) * 100);
          resolve();
        };
      });
    };

    // 2. Load everything in parallel
    Promise.all(imagesToLoad.map(loadAsset)).then(() => {
      // Small buffer for smoothness
      setTimeout(() => {
        setIsVisible(false);
        if (onComplete) setTimeout(onComplete, 800);
      }, 500);
    });
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="preloader-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <div className="preloader-content">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <img src="/logo.png" alt="Cream Dream Logo" className="preloader-logo" />
            </motion.div>
            <motion.h2
              className="preloader-text"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Cream Dream
            </motion.h2>
            <motion.div 
              className="preloader-bar"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
