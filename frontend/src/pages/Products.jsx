import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Heart, Star, Check, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ENDPOINTS } from '../api/config';
import { STATIC_PRODUCTS } from '../data/staticProducts';
import SpotlightSearch from '../components/SpotlightSearch';
import './Products.css';

// 1. MEMOIZED FLAVOR CARD
const FlavorCard = memo(({ flavor, isAdded, onAdd, itemVariants, priority }) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      whileTap={{ scale: 0.97 }}
      className={`flavor-card glass-panel ${flavor.category === 'Specialty' ? 'specialty' : ''}`}
    >
      <div className="flavor-image-container">
        <img
          src={flavor.image}
          alt={flavor.name}
          className="flavor-img"
          loading={priority ? "eager" : "lazy"}
          style={{ filter: `hue-rotate(${flavor.hue || 0}deg)`, mixBlendMode: 'multiply' }}
        />
        {/* Clean overlay on image only */}
        <div className="flavor-img-overlay" />

        <div className="flavor-badges">
          {flavor.rating >= 4.9 && <span className="badge-bestseller">Bestseller</span>}
          <span className="badge-eta">
            <Clock size={12} /> {flavor.category.includes('Shake') ? '10-15' : '15-20'} min
          </span>
        </div>
        <button className="favorite-btn" aria-label="Add to favorites">
          <Heart size={18} />
        </button>
        <div className="dietary-indicator">
          <div className={`dietary-icon ${flavor.category === 'Vegan' || flavor.category === 'Sorbet' ? 'vegan' : 'dairy'}`}>
            <div className="dietary-dot"></div>
          </div>
        </div>
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
          className={`btn-primary add-to-cart-btn ${isAdded ? 'added' : ''}`}
          onClick={() => onAdd(flavor)}
        >
          {isAdded ? (
            <span style={{ display: 'flex', alignItems: 'center' }}>Added <Check size={16} className="ml-1" /></span>
          ) : (
            'Add to Order'
          )}
        </button>
      </div>
    </motion.div>
  );
});

// 2. SKELETON LOADER FOR SMOOTH INITIAL VIEW
const SkeletonCard = () => (
  <div className="flavor-card glass-panel skeleton-loading" style={{ height: '400px', opacity: 0.5 }}>
    <div className="flavor-image-container" style={{ background: 'rgba(0,0,0,0.05)', borderRadius: '25px' }}></div>
    <div className="flavor-info" style={{ gap: '10px', display: 'flex', flexDirection: 'column' }}>
       <div style={{ height: '24px', background: 'rgba(0,0,0,0.05)', width: '70%', borderRadius: '4px' }}></div>
       <div style={{ height: '16px', background: 'rgba(0,0,0,0.05)', width: '40%', borderRadius: '4px' }}></div>
       <div style={{ height: '45px', background: 'rgba(0,0,0,0.05)', width: '100%', borderRadius: '12px', marginTop: 'auto' }}></div>
    </div>
  </div>
);

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  // 0. INITIALIZE FROM CACHE FOR INSTANT LOADING
  const getInitialProducts = () => {
    const cached = localStorage.getItem('dream_cream_products_cache');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return [];
      }
    }
    return []; // No more static fallback here, we want "working" flavours from DB/Cache
  };

  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [addedItems, setAddedItems] = useState({});
  const [products, setProducts] = useState(getInitialProducts); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const q = searchParams.get('search') || '';
    setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      // Show loading if we have no products at all (first visit)
      if (products.length === 0) {
        setLoading(true);
      }
      
      try {
        const response = await fetch(ENDPOINTS.PRODUCTS);
        if (!response.ok) throw new Error('Failed to fetch flavors');
        const data = await response.json();
        
        setProducts(data);
        // Persist fresh data from DB to cache
        localStorage.setItem('dream_cream_products_cache', JSON.stringify(data));
      } catch (err) {
        console.error("API Fetch Error:", err);
        setError(err.message);
        // If fetch fails and we have no cache, we show the error or stay empty
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  // 3. OPTIMIZED FILTERING
  const filteredProducts = useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    return list.filter(p => {
      const matchesCategory = filter === 'All' || p.category === filter;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, filter, searchQuery]);

  // 4. MEMOIZED HANDLERS
  const handleAddToCart = useCallback((product) => {
    const id = product._id || product.id;
    const success = addToCart(product);
    if (success === false) return; // Means user wasn't logged in and gets redirected
    
    setAddedItems(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [id]: false }));
    }, 1500);
  }, [addToCart]);

  const categories = ['All', 'Dairy', 'Vegan', 'Sorbet', 'Specialty', 'Milkshake', 'Thick Shake'];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <motion.div className="products-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <div className="products-hero">
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <header className="section-header">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="section-title">Our Flavors</h1>
            <p className="section-subtitle">Handcrafted daily with the finest ingredients.</p>
            <div className="section-header-accent"></div>
          </motion.div>
        </header>
      </div>
    </div>

    <div className="container">
      <div className="filters-container glass-panel">
        <SpotlightSearch 
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSearchParams({ search: e.target.value });
          }}
        />
        <div className="category-section">
          <span className="category-label-text">Select Category</span>
          <div className="category-filters-wrapper">
            <div className="category-filters">
              {categories.map(cat => (
                <button 
                  key={cat} className={`filter-btn ${filter === cat ? 'active' : ''}`}
                  onClick={() => setFilter(cat)}
                >{cat}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <motion.div className="flavors-grid products-grid mt-8" variants={containerVariants} initial="hidden" animate="show">
        <AnimatePresence mode="popLayout">
          {loading ? (
            [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((flavor, index) => (
              <FlavorCard 
                key={flavor._id || flavor.id}
                flavor={flavor}
                isAdded={!!addedItems[flavor._id || flavor.id]}
                onAdd={handleAddToCart}
                itemVariants={itemVariants}
                priority={index < 4}
              />
            ))
          ) : (
            <div className="no-results" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
              <p>No flavors found for "{searchQuery}".</p>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  </motion.div>
  );
}
