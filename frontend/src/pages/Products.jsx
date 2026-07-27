import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Heart, Star, Check, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

import { getProducts } from '../data/productStore';
import { getCategories } from '../data/categoryStore';
import SpotlightSearch from '../components/SpotlightSearch';
import ProductShowcaseSlider from '../components/ProductShowcaseSlider';
import './Products.css';

// 1. MEMOIZED FLAVOR CARD
const FlavorCard = memo(React.forwardRef(({ flavor, isAdded, onAdd, itemVariants, priority }, ref) => {
  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate="show"
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      whileTap={{ scale: 0.97 }}
      className={`flavor-card premium-card ${flavor.category === 'Specialty' ? 'specialty' : ''}`}
    >
      <div className="flavor-image-container">
        <img
          src={flavor.image}
          alt={flavor.name}
          className="flavor-img"
          loading={priority ? "eager" : "lazy"}
          style={{ 
            filter: `hue-rotate(${flavor.hue || 0}deg) ${flavor.inStock === false ? 'grayscale(100%)' : ''}`, 
            mixBlendMode: 'multiply',
            opacity: flavor.inStock === false ? 0.5 : 1
          }}
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
        <div className="premium-cart-action">
          {flavor.inStock === false ? (
            <button className="btn-primary add-to-cart-btn" style={{ background: '#ccc', color: '#666', cursor: 'not-allowed' }} disabled>
              Out of Stock
            </button>
          ) : (
            <button
              className={`btn-primary add-to-cart-btn ${isAdded ? 'added' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onAdd(flavor);
              }}
            >
              {isAdded ? <><Check size={18} /> Ordered</> : 'Order'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}));

// 2. SKELETON LOADER FOR SMOOTH INITIAL VIEW
const SkeletonCard = () => (
  <div className="flavor-card premium-card skeleton-loading" style={{ height: '400px', opacity: 0.5 }}>
    <div className="flavor-image-container" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '25px' }}></div>
    <div className="flavor-info" style={{ gap: '10px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '24px', background: 'rgba(255,255,255,0.05)', width: '70%', borderRadius: '4px' }}></div>
      <div style={{ height: '16px', background: 'rgba(255,255,255,0.05)', width: '40%', borderRadius: '4px' }}></div>
      <div style={{ height: '45px', background: 'rgba(255,255,255,0.05)', width: '100%', borderRadius: '12px', marginTop: 'auto' }}></div>
    </div>
  </div>
);

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [activeCategory, setActiveCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [addedItems, setAddedItems] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    setCategories(['All', ...getCategories()]);
  }, []);

  useEffect(() => {
    const q = searchParams.get('search') || '';
    setSearchQuery(q);
  }, [searchParams]);

  // 3. OPTIMIZED FILTERING
  const filteredProducts = useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    return list.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.4 } }
  };

  return (
    <motion.div className="products-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <ProductShowcaseSlider />

      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="filters-container glass-panel">
          <SpotlightSearch
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchParams({ search: e.target.value });
            }}
          />
          <div className="category-section" style={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <span className="category-label-text">Select Category</span>
            <div className="category-filters-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
              
              <button 
                className="scroll-arrow left" 
                onClick={() => {
                  const el = document.getElementById('category-scroll');
                  if(el) el.scrollBy({ left: -150, behavior: 'smooth' });
                }}
                aria-label="Scroll left"
              >
                <ChevronLeft size={16} />
              </button>

              <div id="category-scroll" className="category-filters" style={{ flex: 1 }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                    style={{ position: 'relative' }}
                  >
                    {activeCategory === cat && (
                      <motion.div
                        layoutId="activeFilterTab"
                        className="active-filter-bg"
                        initial={false}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span style={{ position: 'relative', zIndex: 1 }}>{cat}</span>
                  </button>
                ))}
              </div>
              
              <button 
                className="scroll-arrow right" 
                onClick={() => {
                  const el = document.getElementById('category-scroll');
                  if(el) el.scrollBy({ left: 150, behavior: 'smooth' });
                }}
                aria-label="Scroll right"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeCategory + searchQuery}
            className="flavors-grid products-grid mt-8"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {loading ? (
              [...Array(8)].map((_, i) => <SkeletonCard key={`skel-${i}`} />)
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
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
