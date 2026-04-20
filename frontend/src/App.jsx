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
import SmoothScroll from './components/SmoothScroll';
import './App.css';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const About = lazy(() => import('./pages/About'));
const Orders = lazy(() => import('./pages/Orders'));
const Admin = lazy(() => import('./pages/Admin'));
const Login = lazy(() => import('./pages/Login'));
const Contact = lazy(() => import('./pages/Contact'));

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
      '/login': 'Cream Dream',
      '/contact': 'Cream Dream'
    };
    document.title = routeTitles[location.pathname] || 'Dream Cream';
  }, [location.pathname]);

  // 🔥 Keep-alive: ping backend every 14 min so Render never sleeps
  React.useEffect(() => {
    const BACKEND_URL = import.meta.env.VITE_API_URL || '';
    const ping = () => {
      fetch(`${BACKEND_URL}/api/products?_keepalive=1`)
        .catch(() => {}); // Silent — never shows errors to user
    };
    ping(); // Ping immediately on first load to wake backend
    const interval = setInterval(ping, 14 * 60 * 1000); // Every 14 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="app-layout">
          <Navbar onOpenCart={() => setIsCartOpen(true)} />
          <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

          <SmoothScroll>
            <AmbientBackground />
            <Cursor />
            {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
            
            {/* Scroll Progress Bar */}
            <motion.div
              className="scroll-progress-bar"
              style={{ scaleX: scrollYProgress }}
            />

          <main className="main-content">
            <AnimatePresence mode="wait">
              <Suspense fallback={
                <div className="loading-fallback">
                  <div className="loader-orbit">
                    <div className="loader-planet"></div>
                  </div>
                  <p>Preparing Freshness...</p>
                </div>
              }>
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </Suspense>
            </AnimatePresence>
          </main>
          
          <Footer />
        </SmoothScroll>
      </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
