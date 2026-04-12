import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import './AntiGravityHero.css';

/**
 * Interactive Anti-Gravity Floating Element
 * Reacts to both Scroll (Parallax) and Mouse (Proximity Physics)
 */
const FloatingItem = ({ src, initialX, initialY, scrollSpeed = 0.5, size = '80px', rotateSpeed = 20 }) => {
  const itemRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  
  // Parallax Effect
  const yParallax = useTransform(scrollY, [0, 1000], [0, 1000 * -scrollSpeed]);
  
  // Smooth Mouse Reactive Movement
  const xMouse = useSpring(0, { stiffness: 100, damping: 20 });
  const yMouse = useSpring(0, { stiffness: 100, damping: 20 });
  const rotateMouse = useSpring(0, { stiffness: 50, damping: 10 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!itemRef.current) return;
      const rect = itemRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Interaction radius: 300px
      if (distance < 300) {
        // "Flee" logic: Push away from cursor
        const force = (300 - distance) / 300;
        xMouse.set(-dx * force * 0.4);
        yMouse.set(-dy * force * 0.4);
        rotateMouse.set(dx * force * 0.1);
      } else {
        xMouse.set(0);
        yMouse.set(0);
        rotateMouse.set(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      ref={itemRef}
      className="anti-gravity-item"
      style={{
        position: 'absolute',
        left: initialX,
        top: initialY,
        width: size,
        height: 'auto',
        x: xMouse,
        y: yMouse,
        rotate: rotateMouse,
        translateY: yParallax,
        zIndex: 10,
        pointerEvents: 'none',
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: 0.9, 
        scale: 1,
        y: [0, -20, 0], // Continuous bobbing
      }}
      transition={{
        opacity: { duration: 1 },
        scale: { duration: 1 },
        y: {
          duration: 4 + Math.random() * 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
    >
      <img 
        src={src} 
        alt="floating treat" 
        style={{ 
          width: '100%', 
          filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))',
          transform: `rotate(${Math.random() * 360}deg)`
        }} 
      />
    </motion.div>
  );
};

export default function AntiGravityHero() {
  const isMobile = window.innerWidth < 768;
  
  // High-end official side items
  const leftElements = [
    { src: '/cherry.png', x: '5%', y: '15%', speed: 0.3, size: '70px' },
    { src: '/mixed_nuts.png', x: '12%', y: '45%', speed: 0.1, size: '90px' },
    { src: '/scoop.png', x: '3%', y: '75%', speed: 0.5, size: '120px' },
  ];

  const rightElements = [
    { src: '/scoop.png', x: '88%', y: '20%', speed: 0.4, size: '110px' },
    { src: '/mixed_nuts.png', x: '92%', y: '55%', speed: 0.2, size: '80px' },
    { src: '/cherry.png', x: '85%', y: '85%', speed: 0.6, size: '60px' },
  ];

  if (isMobile) return null; // Conserve performance on mobile

  return (
    <div className="anti-gravity-container">
      {leftElements.map((el, i) => (
        <FloatingItem 
          key={`left-${i}`} 
          src={el.src} 
          initialX={el.x} 
          initialY={el.y} 
          scrollSpeed={el.speed} 
          size={el.size}
        />
      ))}
      {rightElements.map((el, i) => (
        <FloatingItem 
          key={`right-${i}`} 
          src={el.src} 
          initialX={el.x} 
          initialY={el.y} 
          scrollSpeed={el.speed} 
          size={el.size}
        />
      ))}
    </div>
  );
}
