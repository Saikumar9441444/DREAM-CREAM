import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Heart, ArrowRight } from 'lucide-react';
import Tilt from 'react-parallax-tilt';
import { motion, useScroll, useTransform } from 'framer-motion';
import { products } from '../data/products';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';
import heroGif from '../components/videos/creamdream-ezgif.com-video-to-gif-converter.gif';
import FallingElements from '../components/FallingElements';
import './Home.css';

export default function Home() {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], ['0%', '25%']);

  const topIceCreams = products.filter(p => p.category === 'Specialty' || p.category === 'Classic').slice(0, 3).map(p => ({ ...p, tag: 'Bestseller' }));
  const topMilkshakes = products.filter(p => p.category === 'Milkshake').slice(0, 3).map(p => ({ ...p, tag: 'Must Try' }));
  const topThickShakes = products.filter(p => p.category === 'Thick Shake').slice(0, 3).map(p => ({ ...p, tag: 'Dense & Rich' }));

  const floatingVariants = {
    animate: {
      y: [0, -15, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }
  };

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

  return (
    <motion.div 
      className="home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Cinematic Hero Section */}
      <section className="hero-section">
        {/* Fullscreen Background Media */}
        <div className="hero-fullscreen-bg">
          <motion.img 
            src={heroGif} 
            alt="Cream Dream Experience" 
            className="hero-bg-media" 
            style={{ y: backgroundY, scale: 1.1 }}
          />
          <div className="hero-bg-overlay"></div>
        </div>

        <div className="container hero-content-single">
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
        <section className="featured-section container" key={idx} style={{ paddingTop: idx === 0 ? '6rem' : '2rem' }}>
          <motion.div 
            className="section-header text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">{section.title}</h2>
            <p className="section-subtitle">{section.subtitle}</p>
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
        </motion.div>

        <div className="testimonials-container">
          <Swiper
            effect={'cards'}
            grabCursor={true}
            modules={[EffectCards, Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            className="testimonials-swiper"
          >
            {[
              { name: "Sarah Jenkins", role: "Food Blogger", text: "Literally the best ice cream I've ever had. The Madagascar Vanilla is life-changing.", rating: 5 },
              { name: "Marcus T.", role: "Local Guide", text: "A cinematic experience in every scoop. The aesthetic of the shop matches the quality of the desserts.", rating: 5 },
              { name: "Elena R.", role: "Dessert Critic", text: "Their Thick Shakes redefine indulgence. Perfectly balanced, ridiculously rich.", rating: 5 },
              { name: "David Kim", role: "Regular Customer", text: "I drive 45 minutes just for their seasonal specials. 10/10 recommend.", rating: 5 }
            ].map((testimonial, idx) => (
              <SwiperSlide key={idx} className="testimonial-card glass-panel">
                <div className="stars mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => <Star key={i} size={20} fill="var(--color-accent)" color="var(--color-accent)" />)}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author mt-6">
                  <h4 className="author-name">{testimonial.name}</h4>
                  <p className="author-role">{testimonial.role}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
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
