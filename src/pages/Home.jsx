import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Heart, ArrowRight } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { motion, AnimatePresence } from 'framer-motion';
import FallingElements from '../components/FallingElements';
import { Autoplay, EffectCards } from 'swiper/modules';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'swiper/css';
import 'swiper/css/effect-cards';
import heroBg from '../assets/hero_bg.png';
import heroGif from '../components/videos/Ice_cream_scoop_202604111206-ezgif.com-optimize.gif';
import './Home.css';

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    // GSAP Smooth Scroll Scrubbing for Hero
    const ctx = gsap.context(() => {
      gsap.to(videoRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5, // High value for "smooth" feeling
        },
        scale: 1.3,
        y: 150,
        opacity: 0.3,
        ease: 'none'
      });

      gsap.to(titleRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        y: -100,
        opacity: 0,
        scale: 0.9,
        ease: 'power1.out'
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const childVariant = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
  };

  const testimonials = [
    { 
      name: "Sarah Jenkins", 
      role: "Food Blogger", 
      text: "Literally the best ice cream I've ever had. The Madagascar Vanilla is life-changing. It's not just dessert; it's an event.", 
      rating: 5
    },
    { 
      name: "Marcus T.", 
      role: "Local Guide", 
      text: "A cinematic experience in every scoop. The aesthetic of the shop matches the quality of the desserts. The attention to detail is mind-blowing.", 
      rating: 5
    },
    { 
      name: "Elena R.", 
      role: "Dessert Critic", 
      text: "Their Thick Shakes redefine indulgence. Perfectly balanced, ridiculously rich, and surprisingly light in texture.", 
      rating: 5
    },
    { 
      name: "David Kim", 
      role: "Regular Customer", 
      text: "I drive 45 minutes just for their seasonal specials. The variety and creativity they bring to traditional flavors is unmatched.", 
      rating: 5
    }
  ];

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error("Home fetch error:", err);
      }
    };
    fetchProducts();
  }, []);

  const topIceCreams = products.filter(p => p.category === 'Specialty' || p.category === 'Dairy').slice(0, 3).map(p => ({ ...p, tag: 'Bestseller' }));
  const topMilkshakes = products.filter(p => p.category === 'Milkshake').slice(0, 3).map(p => ({ ...p, tag: 'Must Try' }));
  const topThickShakes = products.filter(p => p.category === 'Thick Shake').slice(0, 3).map(p => ({ ...p, tag: 'Dense & Rich' }));

  const floatingVariants = {
    animate: {
      y: [0, -15, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }
  };

  const nextTestimonial = () => setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      className="home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Cinematic Hero Section */}
      <section className="hero-section" ref={heroRef}>
        {/* Fullscreen Background Media - Smart Hybrid Loading */}
        <div className="hero-fullscreen-bg" ref={videoRef}>
          {/* Layer 1: Instant Static Placeholder */}
          <motion.img 
            src={heroBg} 
            alt="Cream Dream Background" 
            className="hero-bg-media placeholder-layer" 
            style={{ scale: 1.1 }}
          />
          
          {/* Layer 2: Cinematic Video (GIF) - Fades in when loaded */}
          <motion.img 
            src={heroGif} 
            alt="Cream Dream Experience" 
            className={`hero-bg-media video-layer ${videoLoaded ? 'loaded' : ''}`}
            onLoad={() => setVideoLoaded(true)}
            style={{ scale: 1.1 }}
          />
          <div className="hero-bg-overlay"></div>
        </div>

        <div className="container hero-content-single" ref={titleRef}>
          <motion.div 
            className="hero-text-content"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={childVariant} className="badge">
              Scooping Happiness Daily ✨
            </motion.div>
            <motion.h1 variants={childVariant} className="hero-title">
              Experience the Magic of <span>Cream Dream</span>
            </motion.h1>
            <motion.p variants={childVariant} className="hero-subtitle">
              Artisanal ice cream handcrafted with love, fresh ingredients, and a sprinkle of joy. 
              Come taste why we're the city's favorite sweet escape.
            </motion.p>
            <motion.div variants={childVariant} className="hero-actions">
              <Link to="/products" className="btn-primary hero-btn">
                Explore Flavors <ChevronRight size={20} />
              </Link>
              <Link to="/orders" className="hero-link btn-outline-white">
                Order Now <ArrowRight size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Falling elements container for the body of the home page */}
      <div className="falling-elements-wrapper">
        <FallingElements />
      </div>

      {/* Custom Scrolling Marquee */}
      <div className="marquee-container">
        <div className="marquee-content">
          <span>✨ 100% Organic Ingredients</span>
          <span className="marquee-dot">•</span>
          <span>Handcrafted Daily</span>
          <span className="marquee-dot">•</span>
          <span>Award Winning Flavors</span>
          <span className="marquee-dot">•</span>
          <span>Taste the Magic</span>
          <span className="marquee-dot">•</span>
          <span>✨ 100% Organic Ingredients</span>
          <span className="marquee-dot">•</span>
          <span>Handcrafted Daily</span>
          <span className="marquee-dot">•</span>
          <span>Award Winning Flavors</span>
          <span className="marquee-dot">•</span>
          <span>Taste the Magic</span>
          <span className="marquee-dot">•</span>
        </div>
      </div>

      {/* Category Sections */}
      {[
        { title: "Artisan Ice Creams", subtitle: "Our award-winning signature scoops.", items: topIceCreams },
        { title: "Premium Milkshakes", subtitle: "Smooth, cold, and hand-spun to perfection.", items: topMilkshakes },
        { title: "Decadent Thick Shakes", subtitle: "Dense, rich, and ridiculously indulgent.", items: topThickShakes }
      ].map((section, idx) => (
        <section className="featured-section container" key={idx} style={{ paddingTop: idx === 0 ? '2rem' : '0.5rem' }}>
          <motion.div 
            className="section-header text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">{section.title}</h2>
            <p className="section-subtitle">{section.subtitle}</p>
            <div className="section-header-accent"></div>
          </motion.div>
          
          <motion.div 
            className="flavors-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            {section.items.map(flavor => (
              <motion.div variants={childVariant} key={flavor.id}>
                <Tilt 
                  tiltMaxAngleX={10} 
                  tiltMaxAngleY={10} 
                  scale={1.02} 
                  transitionSpeed={2000} 
                  className="flavor-card glass-panel" 
                >
                  <div className="flavor-image-container">
                    <img src={flavor.image} alt={flavor.name} className="flavor-img" loading="lazy" style={{ filter: `hue-rotate(${flavor.hue || 0}deg)`, mixBlendMode: 'multiply' }} />
                    <span className="flavor-tag">{flavor.tag}</span>
                    <button className="favorite-icon-btn" aria-label="Favorite">
                      <Heart size={24} />
                    </button>
                  </div>
                  <div className="flavor-info">
                    <h3>{flavor.name}</h3>
                    <div className="flavor-rating">
                      <Star size={16} fill="var(--color-accent)" color="var(--color-accent)" />
                      <Star size={16} fill="var(--color-accent)" color="var(--color-accent)" />
                      <Star size={16} fill="var(--color-accent)" color="var(--color-accent)" />
                      <Star size={16} fill="var(--color-accent)" color="var(--color-accent)" />
                      <Star size={16} fill="var(--color-accent)" color="var(--color-accent)" />
                      <span>(120+ Reviews)</span>
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-4" style={{ marginTop: '3rem' }}>
            <Link to="/products" className="btn-secondary">View More</Link>
          </div>
        </section>
      ))}

      {/* Taste Critics (Testimonials) Section */}
      <section className="testimonials-section container py-16">
        <motion.div 
          className="section-header text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">The Sweet Talk</h2>
          <p className="section-subtitle">What the critics are saying</p>
          <div className="section-header-accent"></div>
        </motion.div>

        <div className="testimonials-spotlight-wrapper">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTestimonial}
              className="testimonial-spotlight-card glass-panel"
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="quote-icon">"</div>
              <p className="testimonial-text">
                {testimonials[activeTestimonial].text}
              </p>
              
              <div className="testimonial-footer">
                <div className="author-info">
                  <div className="stars">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <Star key={i} size={16} fill="var(--color-accent)" color="var(--color-accent)" />
                    ))}
                  </div>
                  <h4 className="author-name">{testimonials[activeTestimonial].name}</h4>
                  <p className="author-role">{testimonials[activeTestimonial].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="testimonial-controls">
            <button className="control-btn prev" onClick={prevTestimonial} aria-label="Previous testimonial">
              <ChevronRight size={24} style={{ transform: 'rotate(180deg)' }} />
            </button>
            <div className="testimonial-dots">
              {testimonials.map((_, i) => (
                <button 
                  key={i} 
                  className={`dot ${activeTestimonial === i ? 'active' : ''}`}
                  onClick={() => setActiveTestimonial(i)}
                />
              ))}
            </div>
            <button className="control-btn next" onClick={nextTestimonial} aria-label="Next testimonial">
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Join the Club Newsletter */}
      <section className="newsletter-section">
        <div className="container">
          <motion.div 
            className="newsletter-box glass-panel"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="newsletter-content">
              <h2>Join the Dream Club</h2>
              <p>Sign up to get exclusive access to secret menu drops, special events, and sweet discounts.</p>
              <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Enter your email address..." required className="newsletter-input" />
                <button type="submit" className="btn-primary newsletter-btn">Subscribe</button>
              </form>
            </div>
            <div className="newsletter-decoration">
              <span role="img" aria-label="ice cream">🍦</span>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
