import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Heart, Star, Check } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { getCategoryInteraction } from '../utils/animations';
import { ENDPOINTS } from '../api/config';
import { STATIC_PRODUCTS } from '../data/staticProducts';
import './Products.css';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [addedItems, setAddedItems] = useState({});
  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  // Sync state if URL search param changes
  useEffect(() => {
    const q = searchParams.get('search') || '';
    setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      // 1. Instantly show backup data so the page is NEVER empty
      setProducts(STATIC_PRODUCTS);
      setLoading(false);

      try {
        // 2. Silently fetch from database in the background
        const response = await fetch(ENDPOINTS.PRODUCTS);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data); // Upgrade to real data if it works
          }
        }
      } catch (err) {
        // Silently fail, we already have static products visible
        console.log("Using backup flavors...");
      }
    };
    fetchProducts();
  }, []);

  const categories = ['All', 'Dairy', 'Vegan', 'Sorbet', 'Specialty', 'Milkshake', 'Thick Shake'];

  const filteredProducts = (Array.isArray(products) ? products : []).filter(p => {
    const matchesCategory = filter === 'All' || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product) => {
    addToCart(product);
    
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  return (
    <motion.div 
      className="products-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container" style={{ paddingTop: '70px' }}>
        <header className="section-header mb-8">
          <motion.h1 
            className="section-title"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            Our Flavors
          </motion.h1>
          <motion.p 
            className="section-subtitle"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Handcrafted daily with the finest ingredients. Which one will be your new favorite?
          </motion.p>
          <div className="section-header-accent"></div>
        </header>

        <motion.div 
          className="filters-container glass-panel"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="search-bar">
            <Search size={20} color="var(--color-text-muted)" />
            <input 
              type="text" 
              placeholder="Search flavors..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchParams({ search: e.target.value });
              }}
            />
          </div>
          <div className="category-filters">
            {categories.map(cat => (
              <button 
                key={cat} 
                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="flavors-grid products-grid mt-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence mode="popLayout">
            {loading ? (
              <motion.div 
                className="loading-state text-center" 
                style={{ gridColumn: '1 / -1', padding: '5rem' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex flex-col items-center">
                   <div className="loader-spinner mb-4"></div>
                   <p className="text-xl font-bold opacity-60">Preparing your flavors...</p>
                </div>
              </motion.div>
            ) : error ? (
              <motion.div 
                className="error-state text-center glass-panel" 
                style={{ gridColumn: '1 / -1', padding: '4rem', border: '1px solid rgba(255,107,107,0.3)' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex flex-col items-center">
                   <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--color-accent)' }}>🍨 The Shop is Chilling Out...</h2>
                   <p className="text-lg opacity-80 max-w-md mx-auto mb-6">
                     We're having a slight melt-down connecting to our flavor vault. This is usually due to a temporary connection issue.
                   </p>
                   <button 
                     onClick={() => window.location.reload()} 
                     className="btn-primary"
                     style={{ padding: '0.8rem 2rem' }}
                   >
                     Try Refreshing
                   </button>
                </div>
              </motion.div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map(flavor => (
                <motion.div 
                  variants={itemVariants} 
                  key={flavor._id || flavor.id}
                  layoutId={`product-${flavor._id || flavor.id}`}
                  style={{ display: 'flex' }}
                  whileHover={getCategoryInteraction(flavor.category).whileHover}
                  whileTap={getCategoryInteraction(flavor.category).whileTap}
                >
                  <Tilt 
                    tiltMaxAngleX={window.innerWidth < 768 ? 0 : getCategoryInteraction(flavor.category).tiltMaxAngleX} 
                    tiltMaxAngleY={window.innerWidth < 768 ? 0 : getCategoryInteraction(flavor.category).tiltMaxAngleY} 
                    scale={window.innerWidth < 768 ? 1 : getCategoryInteraction(flavor.category).scale} 
                    transitionSpeed={getCategoryInteraction(flavor.category).transitionSpeed} 
                    style={{ height: '100%', width: '100%' }} /* Ensure Tilt fills the flex item */
                    className={`flavor-card glass-panel ${flavor.category === 'Specialty' ? 'specialty' : ''} ${getCategoryInteraction(flavor.category).className}`} 
                  >
                    <div className="flavor-image-container">
                      <img 
                        src={flavor.image} 
                        alt={flavor.name} 
                        className="flavor-img" 
                        loading="eager" /* PERFECT PRE-LOAD FOR PRESENTATION */
                        style={{ filter: `hue-rotate(${flavor.hue || 0}deg)`, mixBlendMode: 'multiply' }} 
                      />
                      {flavor.category === 'Specialty' && (
                        <div className="specialty-shine"></div>
                      )}
                      <button className="favorite-btn" aria-label="Add to favorites">
                        <Heart size={20} />
                      </button>
                    </div>
                    <div className="flavor-info">
                      <h3>{flavor.name}</h3>
                      <div className="flavor-meta">
                        <div className="flavor-rating">
                          <Star size={16} fill="var(--color-accent)" color="var(--color-accent)" />
                          <span>{flavor.rating}</span>
                        </div>
                        <span className="flavor-price">{flavor.price}</span>
                      </div>
                      <button 
                        className={`btn-primary add-to-cart-btn ${addedItems[flavor._id || flavor.id] ? 'added' : ''}`}

                        onClick={() => handleAddToCart(flavor)}
                      >

                        {addedItems[flavor._id || flavor.id] ? (
                          <span style={{ display: 'flex', alignItems: 'center' }}>Added <Check size={16} className="ml-1" /></span>
                        ) : (
                          'Add to Order'
                        )}
                      </button>
                    </div>
                  </Tilt>
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="no-results text-center" 
                style={{ gridColumn: '1 / -1', padding: '3rem' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p>No flavors found for "{searchQuery}". Try a different search!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
