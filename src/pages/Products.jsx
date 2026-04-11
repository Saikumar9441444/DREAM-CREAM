import React, { useState, useEffect } from 'react';
import { Search, Heart, Star, Check } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import './Products.css';
import './Home.css'; // Reuse card styles

const API_URL = 'http://localhost:5000/api/products';

export default function Products() {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItems, setAddedItems] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['All', 'Dairy', 'Vegan', 'Sorbet', 'Specialty', 'Milkshake', 'Thick Shake'];

  const filteredProducts = products.filter(p => {
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
              onChange={(e) => setSearchQuery(e.target.value)}
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
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map(flavor => (
                <motion.div 
                  variants={itemVariants} 
                  key={flavor._id || flavor.id}
                  layoutId={`product-${flavor._id || flavor.id}`}
                  style={{ display: 'flex' }}
                >
                  <Tilt 
                    tiltMaxAngleX={10} 
                    tiltMaxAngleY={10} 
                    scale={1.05} 
                    transitionSpeed={2000} 
                    className="flavor-card glass-panel w-full" 
                  >
                    <div className="flavor-image-container">
                      <img src={flavor.image} alt={flavor.name} className="flavor-img" loading="lazy" style={{ filter: `hue-rotate(${flavor.hue || 0}deg)` }} />
                      <span className="flavor-tag">{flavor.category}</span>
                      <button className="favorite-icon-btn" aria-label="Favorite">
                        <Heart size={24} />
                      </button>
                    </div>
                    <div className="flavor-info">
                      <h3>{flavor.name}</h3>
                      <div className="flavor-meta">
                        <div className="flavor-rating">
                          <Star size={16} fill="var(--color-accent)" color="var(--color-accent)" />
                          <span>{flavor.rating}</span>
                        </div>
                        <span className="flavor-price font-bold text-lg">{flavor.price}</span>
                      </div>
                      <button 
                        className={`btn-primary add-to-cart-btn mt-4 w-full flex justify-center ${addedItems[flavor._id || flavor.id] ? 'added' : ''}`}
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
