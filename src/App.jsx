import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import Cursor from './components/Cursor';
import Preloader from './components/Preloader';
import AmbientBackground from './components/AmbientBackground';
import './App.css';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const About = lazy(() => import('./pages/About'));
const Orders = lazy(() => import('./pages/Orders'));

function App() {
  const { scrollYProgress } = useScroll();
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="app-layout">
      <AmbientBackground />
      <Cursor />
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="scroll-progress-bar"
        style={{ scaleX: scrollYProgress }}
      />
      
      <Navbar onOpenCart={() => setIsCartOpen(true)} />
      
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <main className="main-content">
        <AnimatePresence mode="wait">
          <Suspense fallback={<div className="loading-fallback"></div>}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/about" element={<About />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
