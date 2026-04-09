import React from 'react';
import { motion } from 'framer-motion';
import './FallingElements.css';

export default function FallingElements() {
  const elements = [
    { id: 1, src: '/cherry.png', left: '5%', delay: 0, duration: 15, size: '60px' },
    { id: 2, src: '/mixed_nuts.png', left: '15%', delay: 4, duration: 18, size: '80px' },
    { id: 3, src: '/scoop.png', left: '8%', delay: 8, duration: 22, size: '90px' },
    { id: 4, src: '/cherry.png', left: '85%', delay: 2, duration: 16, size: '50px' },
    { id: 5, src: '/scoop.png', left: '92%', delay: 6, duration: 19, size: '100px' },
    { id: 6, src: '/mixed_nuts.png', left: '80%', delay: 10, duration: 20, size: '70px' },
    { id: 7, src: '/cherry.png', left: '95%', delay: 12, duration: 14, size: '65px' }
  ];

  return (
    <div className="falling-elements-container">
      {elements.map((el) => (
        <motion.img
          key={el.id}
          src={el.src}
          className="falling-element"
          style={{ 
            left: el.left,
            width: el.size,
            height: 'auto',
          }}
          initial={{ top: '-10%', rotate: 0 }}
          animate={{ 
            top: ['-10%', '110%'], 
            rotate: [0, 360] 
          }}
          transition={{ 
            duration: el.duration * 2, // Slow down since the distance is much larger
            delay: el.delay, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
      ))}
    </div>
  );
}
