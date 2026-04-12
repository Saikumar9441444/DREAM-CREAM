import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import Cursor from './components/Cursor';
import Preloader from './components/Preloader';
import ErrorBoundary from './components/ErrorBoundary';
import AmbientBackground from './components/AmbientBackground';
import './App.css';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const About = lazy(() => import('./pages/About'));
const Orders = lazy(() => import('./pages/Orders'));
const Admin = lazy(() => import('./pages/Admin'));
const Login = lazy(() => import('./pages/Login'));

function App() {
  const { scrollYProgress } = useScroll();
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic Page Title Management
  React.useEffect(() => {
    const routeTitles = {
      '/': 'Cream Dream',
      '/products': 'Cream Dream',
      '/about': 'Cream Dream',
      '/orders': 'Cream Dream',
      '/admin': 'Cream Dream',
      '/login': 'Cream Dream'
    };
    document.title = routeTitles[location.pathname] || 'Dream Cream';
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <AuthProvider>
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
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/login" element={<Login />} />
                </Routes>
              </Suspense>
            </AnimatePresence>
          </main>
          
          <Footer />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
