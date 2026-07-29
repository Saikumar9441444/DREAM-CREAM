import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import { CartProvider } from './context/CartContext';

import Preloader from './components/Preloader';
import ErrorBoundary from './components/ErrorBoundary';
import AmbientBackground from './components/AmbientBackground';
import SmoothScroll from './components/SmoothScroll';
import './App.css';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Orders = lazy(() => import('./pages/Orders'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin Pages
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminAddons = lazy(() => import('./pages/admin/AdminAddons'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminInventory = lazy(() => import('./pages/admin/AdminInventory'));
const AdminSubscriptions = lazy(() => import('./pages/admin/AdminSubscriptions'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminEnquiries = lazy(() => import('./pages/admin/AdminEnquiries'));
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'));
const AdminKitchen = lazy(() => import('./pages/admin/AdminKitchen'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));

function App() {
  const { scrollYProgress } = useScroll();
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic Page Title Management
  React.useEffect(() => {
    const routeTitles = {
      '/': 'Cream Dream | Premium Ice Cream Parlor',
      '/home': 'Cream Dream | Premium Ice Cream Parlor',
      '/products': 'Cream Dream | Explore Flavors',
      '/about': 'Cream Dream | Our Story',
      '/contact': 'Cream Dream | Get In Touch',
      '/orders': 'Cream Dream | Your Parcel',
      '/admin/login': 'Cream Dream | Admin Login'
    };
    
    if (location.pathname.startsWith('/admin') && location.pathname !== '/admin/login') {
      document.title = 'Cream Dream | Admin Dashboard';
    } else {
      document.title = routeTitles[location.pathname] || 'Cream Dream | Premium Ice Cream';
    }
  }, [location.pathname]);

  // Detect QR code table number
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const table = params.get('table');
    if (table) {
      localStorage.setItem('dream_cream_table', table);
    }
  }, [location.search]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <ErrorBoundary>
      <CartProvider>
        <div className="app-layout">
          {!isAdminRoute && <Navbar onOpenCart={() => setIsCartOpen(true)} />}
          {!isAdminRoute && <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />}

          <SmoothScroll>
            <AmbientBackground />

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
                    <Route 
                      path="/" 
                      element={
                        location.search.includes('table=') 
                          ? <Navigate to={`/products${location.search}`} replace /> 
                          : <Navigate to="/home" replace />
                      } 
                    />
                    <Route path="/home" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/menu" element={<Navigate to="/products" replace />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/ourstory" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/testimonials" element={<Home />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/admin/login" element={<AdminLogin />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<Navigate to="/admin/dashboard" replace />} />
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="menu" element={<AdminProducts />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="addons" element={<AdminAddons />} />
                      <Route path="categories" element={<AdminCategories />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="inventory" element={<AdminInventory />} />
                      <Route path="subscriptions" element={<AdminSubscriptions />} />
                      <Route path="customers" element={<AdminCustomers />} />
                      <Route path="analytics" element={<AdminAnalytics />} />
                      <Route path="enquiries" element={<AdminEnquiries />} />
                      <Route path="testimonials" element={<AdminTestimonials />} />
                      <Route path="settings" element={<AdminSettings />} />
                      <Route path="kitchen" element={<AdminKitchen />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </AnimatePresence>
            </main>

            {!isAdminRoute && <Footer />}
          </SmoothScroll>
        </div>
      </CartProvider>
    </ErrorBoundary>
  );
}

export default App;
