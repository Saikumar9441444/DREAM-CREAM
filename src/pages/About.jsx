import React from 'react';
import { MapPin, Clock, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import './About.css';

export default function About() {
  const storyColumns = [
    {
      id: '01',
      total: '03',
      label: 'THE SOURCE',
      title: 'Our Ingredients',
      desc: 'We source the richest madagascar vanilla and the deepest organic cacao for an unparalleled pure taste.',
      img: '/ingredients_bg.png'
    },
    {
      id: '02',
      total: '03',
      label: 'THE CRAFT',
      title: 'The Artisans',
      desc: 'Every morning, our team of artisans arrives to pasteurize local dairy and hand-churn small batches.',
      img: '/craft_bg.png'
    },
    {
      id: '03',
      total: '03',
      label: 'THE MAGIC',
      title: 'The Experience',
      desc: 'More than just an ice cream shop, we are a gathering place where memories are made, one scoop at a time.',
      img: '/experience_bg.png'
    }
  ];

  return (
    <div className="about-page fade-in">
      {/* Cinematic 3 Column Grid */}
      <section className="story-cinematic-grid">
        {storyColumns.map((col, index) => (
          <motion.div 
            className="story-col" 
            key={col.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          >
            <div className="story-col-bg" style={{ backgroundImage: `url(${col.img})` }}></div>
            <div className="story-col-overlay"></div>
            <div className="story-col-content">
              <div className="story-index">
                <span>{col.id}</span>
                <span className="separator">—</span>
                <span>{col.total}</span>
              </div>
              <p className="story-label">{col.label}</p>
              <h2 className="story-title">{col.title}</h2>
              <p className="story-desc">{col.desc}</p>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Cinematic Marquee */}
      <div className="marquee-container">
        <div className="marquee-content">
          <span>HANDCRAFTED DAILY • PURE INGREDIENTS • LOCAL DAIRY • COMMUNITY MAGIC •&nbsp;</span>
          <span>HANDCRAFTED DAILY • PURE INGREDIENTS • LOCAL DAIRY • COMMUNITY MAGIC •&nbsp;</span>
        </div>
      </div>

      {/* Founder's Vision Section */}
      <section className="founder-section">
        <div className="founder-image-wrapper">
          <img src="/founder_vision.png" alt="Antique Churner" className="founder-img" loading="lazy" />
        </div>
        <div className="founder-text-wrapper">
          <div className="quote-mark">"</div>
          <h2 className="founder-title">A Return to<br/>Real Craft.</h2>
          <p className="founder-desc">
            It began with an exhausting search for ice cream that tasted like memories—not chemicals. 
            We tore up the rules of mass production and built Cream Dream on a single, unwavering promise:
            If we wouldn't serve it to our own family, we won't serve it to you.
          </p>
          <div className="founder-signoff">
            — The Cream Dream Family
          </div>
        </div>
      </section>

      {/* Cinematic Visit Us Footer */}
      <section className="visit-us-cinematic" style={{ backgroundImage: `url('/visit_us_bg.png')` }}>
        <div className="visit-overlay"></div>
        <div className="container visit-content">
          <h2 className="visit-title text-center">Your Table is Ready</h2>
          <div className="visit-info-grid">
            <div className="visit-card">
              <MapPin size={40} className="visit-icon" />
              <h3>Location</h3>
              <p>MG Road</p>
              <p>Nellore, Andhra Pradesh</p>
            </div>
            <div className="visit-card">
              <Clock size={40} className="visit-icon" />
              <h3>Hours</h3>
              <p>Mon-Thu: 11am - 9pm</p>
              <p>Fri-Sun: 11am - 11pm</p>
            </div>
            <div className="visit-card">
              <Phone size={40} className="visit-icon" />
              <h3>Contact</h3>
              <p>OCW@gmail.com</p>
              <p>9014002314</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
