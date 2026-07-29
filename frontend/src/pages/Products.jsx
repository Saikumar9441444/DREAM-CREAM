import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Heart, Star, Check, Clock, ChevronLeft, ChevronRight, Zap, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

import { getProducts } from '../data/productStore';
import { getCategories } from '../data/categoryStore';
import SpotlightSearch from '../components/SpotlightSearch';
import ProductShowcaseSlider from '../components/ProductShowcaseSlider';
import './Products.css';

// 1. MEMOIZED FLAVOR CARD
const FlavorCard = memo(React.forwardRef(({ flavor, isAdded, onAdd, onInstantOrder, itemVariants, priority }, ref) => {
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
        <div className="premium-cart-action dual-buttons">
          {flavor.inStock === false ? (
            <button className="btn-primary add-to-cart-btn" style={{ background: '#ccc', color: '#666', cursor: 'not-allowed', width: '100%' }} disabled>
              Out of Stock
            </button>
          ) : (
            <>
              <button
                className={`btn-secondary action-btn-parcel ${isAdded ? 'added' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd(flavor);
                }}
                title="Add to Parcel list"
              >
                {isAdded ? <Check size={16} /> : <Package size={16} />}
                <span>Parcel</span>
              </button>
              <button
                className="btn-primary action-btn-order"
                onClick={(e) => {
                  e.stopPropagation();
                  onInstantOrder(flavor);
                }}
                title="Dine-In Instant Order"
              >
                <Zap size={16} />
                <span>Order</span>
              </button>
            </>
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

  const [selectedInstantProduct, setSelectedInstantProduct] = useState(null);
  const [instantTableNumber, setInstantTableNumber] = useState(localStorage.getItem('dream_cream_table') || '');
  const [instantOrderSuccess, setInstantOrderSuccess] = useState(false);
  const [instantOrderLoading, setInstantOrderLoading] = useState(false);

  const handleOpenInstantOrder = useCallback((product) => {
    setSelectedInstantProduct(product);
    setInstantOrderSuccess(false);
    setInstantOrderLoading(false);
    
    // Refresh table number from storage in case it changed
    const currentTable = localStorage.getItem('dream_cream_table') || '';
    setInstantTableNumber(currentTable);
  }, []);

  const handleConfirmInstantOrder = async (e) => {
    e.preventDefault();
    if (!selectedInstantProduct) return;
    if (!instantTableNumber.trim()) return;

    setInstantOrderLoading(true);

    // Save table number to local storage
    localStorage.setItem('dream_cream_table', instantTableNumber.trim());

    // Calculate dynamic totals matching the order summary formula:
    // price + 5% GST + restaurant charges (₹15)
    const rawPrice = typeof selectedInstantProduct.price === 'string'
      ? parseFloat(selectedInstantProduct.price.replace(/[^\d.]/g, ''))
      : selectedInstantProduct.price;

    const gst = rawPrice * 0.05;
    const charges = 15;
    const finalTotal = rawPrice + gst + charges;

    const orderData = {
      customerName: 'Dine-In Guest',
      phone: 'N/A',
      address: `Dine-In (Table ${instantTableNumber.trim()})`,
      tableNumber: instantTableNumber.trim(),
      deliveryType: 'Dine-In',
      items: [{
        name: selectedInstantProduct.name,
        quantity: 1,
        price: rawPrice
      }],
      totalAmount: finalTotal,
      paymentMethod: 'cod', // Pay later
      status: 'Waiting Approval' // Requires admin approval!
    };

    try {
      const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${socketUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) throw new Error('Failed to submit order');

      setInstantOrderSuccess(true);
      setTimeout(() => {
        setSelectedInstantProduct(null);
        setInstantOrderSuccess(false);
      }, 2000);
    } catch (err) {
      alert('Error placing order: ' + err.message);
    } finally {
      setInstantOrderLoading(false);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
        const cats = await getCategories();
        setCategories(['All', ...cats]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
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
                  onInstantOrder={handleOpenInstantOrder}
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

      {/* Instant Order Modal */}
      <AnimatePresence>
        {selectedInstantProduct && (
          <div className="instant-modal-overlay flex-center" onClick={() => setSelectedInstantProduct(null)}>
            <motion.div 
              className="instant-modal-card glass-panel"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {instantOrderSuccess ? (
                <div className="instant-success flex-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem 0' }}>
                  <div className="success-badge" style={{ background: '#dcfce7', color: '#16a34a', padding: '1rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={36} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Order Submitted!</h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>Waiting for manager approval...</p>
                </div>
              ) : (
                <form onSubmit={handleConfirmInstantOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#1e293b' }}>Dine-In Instant Order</h3>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    You are ordering <strong>{selectedInstantProduct.name}</strong> instantly to your table.
                  </p>
                  
                  <div className="input-group">
                    <input 
                      type="text" 
                      id="modalTableNumber" 
                      value={instantTableNumber} 
                      onChange={(e) => setInstantTableNumber(e.target.value)} 
                      required 
                      placeholder=" " 
                      disabled={instantOrderLoading}
                    />
                    <label htmlFor="modalTableNumber">Table Number</label>
                  </div>

                  <div className="modal-price-breakdown" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#64748b' }}>
                      <span>{selectedInstantProduct.name}</span>
                      <span>₹{(typeof selectedInstantProduct.price === 'string' ? parseFloat(selectedInstantProduct.price.replace(/[^\d.]/g, '')) : selectedInstantProduct.price).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#64748b' }}>
                      <span>GST (5%)</span>
                      <span>₹{((typeof selectedInstantProduct.price === 'string' ? parseFloat(selectedInstantProduct.price.replace(/[^\d.]/g, '')) : selectedInstantProduct.price) * 0.05).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#64748b' }}>
                      <span>Service Charges</span>
                      <span>₹15.00</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 'bold', color: '#1e293b', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
                      <span>Total to Pay Later</span>
                      <span>₹{((typeof selectedInstantProduct.price === 'string' ? parseFloat(selectedInstantProduct.price.replace(/[^\d.]/g, '')) : selectedInstantProduct.price) * 1.05 + 15).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="modal-actions" style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <button 
                      type="button" 
                      className="btn-secondary" 
                      style={{ flex: 1, padding: '0.85rem' }}
                      onClick={() => setSelectedInstantProduct(null)}
                      disabled={instantOrderLoading}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn-primary" 
                      style={{ flex: 1, padding: '0.85rem' }}
                      disabled={instantOrderLoading}
                    >
                      {instantOrderLoading ? 'Sending...' : 'Confirm Order'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
