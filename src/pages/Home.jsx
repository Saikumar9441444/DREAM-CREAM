import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Heart, ArrowRight } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { motion, AnimatePresence } from 'framer-motion';
import FallingElements from '../components/FallingElements';
import AntiGravityHero from '../components/AntiGravityHero';
import { getCategoryInteraction } from '../utils/animations';
import { Autoplay, EffectCards } from 'swiper/modules';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'swiper/css';
import 'swiper/css/effect-cards';
import heroBg from '../assets/hero_bg.png';
import { ENDPOINTS } from '../api/config';
import { STATIC_PRODUCTS } from '../data/staticProducts';
import './Home.css';

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [cmsContent, setCmsContent] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    // 1. Fetch Products from Cloud
    const fetchProducts = async () => {
      // 1. Set static content instantly as a baseline
      setProducts(STATIC_PRODUCTS);
      setLoading(false);

      try {
        const res = await fetch(ENDPOINTS.PRODUCTS);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data); // Upgrade if database is available
          }
        }
      } catch (err) {
        console.warn("Using backup flavors on Home page...");
      }
    };

    fetchProducts();

    // 2. Fetch CMS Content from Cloud
    fetch(ENDPOINTS.CONTENT)
      .then(res => {
        if (!res.ok) throw new Error("CMS Fetch Failed");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const contentMap = {};
          data.forEach(item => { contentMap[item.key] = item.value; });
          setCmsContent(contentMap);
        }
      })
      .catch(err => {
        console.warn("CMS fetch failed, using default values.");
        setCmsContent({});
      });

    // GSAP Smooth Scroll Scrubbing for Hero
    const ctx = gsap.context(() => {
      gsap.to(videoRef.current, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
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
    { name: "Sarah Jenkins", role: "Food Blogger", text: "Literally the best ice cream I've ever had. The Madagascar Vanilla is life-changing. It's not just dessert; it's an event.", rating: 5 },
    { name: "Marcus T.", role: "Local Guide", text: "A cinematic experience in every scoop. The aesthetic of the shop matches the quality of the desserts. The attention to detail is mind-blowing.", rating: 5 },
    { name: "Elena R.", role: "Dessert Critic", text: "Their Thick Shakes redefine indulgence. Perfectly balanced, ridiculously rich, and surprisingly light in texture.", rating: 5 },
    { name: "David Kim", role: "Regular Customer", text: "I drive 45 minutes just for their seasonal specials. The variety and creativity they bring to traditional flavors is unmatched.", rating: 5 }
  ];

  const safeProducts = Array.isArray(products) ? products : [];
  const topIceCreams = safeProducts.filter(p => p.category === 'Specialty' || p.category === 'Dairy').slice(0, 4).map(p => ({ ...p, tag: 'Bestseller' }));
  const topMilkshakes = safeProducts.filter(p => p.category === 'Milkshake').slice(0, 4).map(p => ({ ...p, tag: 'Must Try' }));
  const topThickShakes = safeProducts.filter(p => p.category === 'Thick Shake').slice(0, 4).map(p => ({ ...p, tag: 'Dense & Rich' }));

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
      <section className="hero-section" ref={heroRef}>
        <div className="hero-fullscreen-bg" ref={videoRef}>
          <motion.img 
            src={heroBg} 
            alt="Cream Dream Background" 
            className="hero-bg-media placeholder-layer" 
            style={{ scale: 1.1 }}
          />
          {/* PERFORMANCE: We now use the 'Total Preloading' system, so we can afford the heavy gif on all devices */}
          <motion.img 
            src="/videos/hero_scoop.gif" 
            alt="Cream Dream Experience" 
            className="hero-bg-media video-layer loaded" // FORCE LOADED CLASS
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
              {cmsContent.heroTitle || "Experience the Magic of Cream Dream"}
            </motion.h1>
            <motion.p variants={childVariant} className="hero-subtitle">
              {cmsContent.heroSubtitle || "Artisanal ice cream handcrafted with love, fresh ingredients, and a sprinkle of joy. Come taste why we're the city's favorite sweet escape."}
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

      {/* Hero section is now completely clean. Decorative elements begin below the fold. */}
      <div className="anti-gravity-wrapper" style={{ position: 'absolute', top: '100vh', width: '100%', pointerEvents: 'none' }}>
        <AntiGravityHero />
      </div>

      {/* Falling elements now only begin below the hero section */}
      <div className="falling-elements-wrapper" style={{ top: '100vh' }}>
        <FallingElements />
      </div>

      <div className="marquee-container">
        <div className="marquee-content">
          <span>✨ 100% Organic Ingredients</span> <span className="marquee-dot">•</span>
          <span>Handcrafted Daily</span> <span className="marquee-dot">•</span>
          <span>Award Winning Flavors</span> <span className="marquee-dot">•</span>
          <span>Taste the Magic</span> <span className="marquee-dot">•</span>
          <span>✨ 100% Organic Ingredients</span> <span className="marquee-dot">•</span>
          <span>Handcrafted Daily</span> <span className="marquee-dot">•</span>
          <span>Award Winning Flavors</span> <span className="marquee-dot">•</span>
          <span>Taste the Magic</span> <span className="marquee-dot">•</span>
        </div>
      </div>


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
            initial="show"
            animate="show"
          >
            {section.items.map(flavor => (
              <motion.div 
                variants={childVariant} 
                key={flavor._id || flavor.id}
                whileHover={getCategoryInteraction(flavor.category).whileHover}
                whileTap={getCategoryInteraction(flavor.category).whileTap}
              >
                <Tilt 
                  tiltMaxAngleX={getCategoryInteraction(flavor.category).tiltMaxAngleX} 
                  tiltMaxAngleY={getCategoryInteraction(flavor.category).tiltMaxAngleY} 
                  scale={getCategoryInteraction(flavor.category).scale} 
                  transitionSpeed={getCategoryInteraction(flavor.category).transitionSpeed}
                  className={`flavor-card glass-panel ${getCategoryInteraction(flavor.category).className}`}
                >
                  <div className="flavor-image-container">
                    <img src={flavor.image} alt={flavor.name} className="flavor-img" loading="eager" style={{ filter: `hue-rotate(${flavor.hue || 0}deg)`, mixBlendMode: 'multiply' }} />
                    <span className="flavor-tag">{flavor.tag}</span>
                    <button className="favorite-btn"><Heart size={20} /></button>
                  </div>
                  <div className="flavor-info">
                    <h3>{flavor.name}</h3>
                    <div className="flavor-rating">
                      <Star size={16} fill="var(--color-accent)" color="var(--color-accent)" />
                      <span>(120+ Reviews)</span>
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </motion.div>
        </section>
      ))}

      <section className="testimonials-section container py-16">
        <h2 className="section-title text-center">The Sweet Talk</h2>
        <div className="testimonials-spotlight-wrapper">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTestimonial}
              className="testimonial-spotlight-card glass-panel"
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
            >
              <p className="testimonial-text">"{testimonials[activeTestimonial].text}"</p>
              <h4 className="author-name">{testimonials[activeTestimonial].name}</h4>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-box glass-panel">
            <div className="newsletter-content">
              <h2>Join the Dream Club</h2>
              <p>Sign up to get exclusive access to secret menu drops.</p>
            </div>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email..." required className="newsletter-input" />
              <button type="submit" className="btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
