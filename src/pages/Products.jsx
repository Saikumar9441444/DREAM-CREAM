import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Heart, Star, Check } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { getCategoryInteraction } from '../utils/animations';
import { ENDPOINTS } from '../api/config';
import { STATIC_PRODUCTS } from '../data/staticProducts';
import './Products.css';

// 1. MEMOIZED FLAVOR CARD FOR ELITE RENDERING
const FlavorCard = memo(({ flavor, isAdded, onAdd, itemVariants }) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const interaction = getCategoryInteraction(flavor.category);

  return (
    <motion.div 
      variants={itemVariants} 
      layoutId={`product-${flavor._id || flavor.id}`}
      style={{ display: 'flex' }}
      whileHover={isMobile ? undefined : interaction.whileHover}
      whileTap={interaction.whileTap}
    >
      <Tilt 
        tiltMaxAngleX={isMobile ? 0 : interaction.tiltMaxAngleX} 
        tiltMaxAngleY={isMobile ? 0 : interaction.tiltMaxAngleY} 
        scale={isMobile ? 1 : interaction.scale} 
        transitionSpeed={interaction.transitionSpeed} 
        style={{ height: '100%', width: '100%' }}
        className={`flavor-card glass-panel ${flavor.category === 'Specialty' ? 'specialty' : ''} ${interaction.className}`} 
      >
        <div className="flavor-image-container">
          <img 
            src={flavor.image} 
            alt={flavor.name} 
            className="flavor-img" 
            loading="eager"
            style={{ filter: `hue-rotate(${flavor.hue || 0}deg)`, mixBlendMode: 'multiply' }} 
          />
          {flavor.category === 'Specialty' && <div className="specialty-shine"></div>}
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
      </Tilt>
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
  
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [addedItems, setAddedItems] = useState({});
  const [products, setProducts] = useState([]); // Start empty for skeleton test
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const q = searchParams.get('search') || '';
    setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      // 1. Set static content instantly as a baseline
      setProducts(STATIC_PRODUCTS);

      try {
        const response = await fetch(ENDPOINTS.PRODUCTS);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data); // Upgrade to live data if available
          }
        }
      } catch (err) {
        console.error("Fetch failed, using static fallback.");
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
    addToCart(product);
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
      {/* Decorative background elements */}
      <div className="hero-decor decor-left">
        <motion.img 
          src="/scoop.png" 
          className="decor-item scoop-left"
          animate={{ y: [0, -20, 0], rotate: [0, 8, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img 
          src="/cherry.png" 
          className="decor-item cherry-left"
          animate={{ y: [0, 15, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="hero-decor decor-right">
        <motion.img 
          src="/mixed_nuts.png" 
          className="decor-item nuts-right"
          animate={{ y: [0, -15, 0], rotate: [10, -10, 10] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img 
          src="/scoop.png" 
          className="decor-item scoop-right"
          animate={{ y: [0, 20, 0], rotate: [-5, 5, -5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </div>

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
        <div className="search-bar">
          <Search size={20} color="var(--color-text-muted)" />
          <input 
            type="text" placeholder="Search flavors..." value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchParams({ search: e.target.value });
            }}
          />
        </div>
        <div className="category-filters">
          {categories.map(cat => (
            <button 
              key={cat} className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >{cat}</button>
          ))}
        </div>
      </div>

      <motion.div className="flavors-grid products-grid mt-8" variants={containerVariants} initial="hidden" animate="show">
        <AnimatePresence mode="popLayout">
          {loading ? (
            [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map(flavor => (
              <FlavorCard 
                key={flavor._id || flavor.id}
                flavor={flavor}
                isAdded={!!addedItems[flavor._id || flavor.id]}
                onAdd={handleAddToCart}
                itemVariants={itemVariants}
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
