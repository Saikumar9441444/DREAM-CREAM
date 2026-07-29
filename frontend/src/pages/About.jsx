import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSubscriptions } from '../data/subscriptionStore';
import './About.css';

export default function About() {
  const cmsContent = {
    heroTitle: "Our Story",
    heroSubtitle: "From a small cart to your neighborhood creamery."
  };

  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subForm, setSubForm] = useState({ name: '', phone: '', address: '' });
  const [subSuccess, setSubSuccess] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getSubscriptions();
        setPlans(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribeSubmit = async (e) => {
    e.preventDefault();
    if (!subForm.name || !subForm.phone || !subForm.address) return;

    setSubLoading(true);

    const orderData = {
      customerName: subForm.name,
      phone: subForm.phone,
      address: subForm.address,
      deliveryType: 'Delivery',
      items: [{
        name: `Subscription: ${selectedPlan.name}`,
        quantity: 1,
        price: selectedPlan.price
      }],
      totalAmount: selectedPlan.price,
      paymentMethod: 'cod',
      status: 'Waiting Approval'
    };

    try {
      const socketUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${socketUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) {
        setSubSuccess(true);
        setTimeout(() => {
          setSelectedPlan(null);
          setSubSuccess(false);
          setSubForm({ name: '', phone: '', address: '' });
        }, 2000);
      } else {
        alert('Failed to place subscription request');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to place subscription request');
    } finally {
      setSubLoading(false);
    }
  };

  const storyColumns = [
    { id: '01', total: '03', label: 'THE SOURCE', title: 'Our Ingredients', desc: 'We source the richest madagascar vanilla and the deepest organic cacao for an unparalleled pure taste.', img: '/ingredients_bg.png' },
    { id: '02', total: '03', label: 'THE CRAFT', title: 'The Artisans', desc: 'Every morning, our team of artisans arrives to pasteurize local dairy and hand-churn small batches.', img: '/craft_bg.png' },
    { id: '03', total: '03', label: 'THE MAGIC', title: 'The Experience', desc: 'More than just an ice cream shop, we are a gathering place where memories are made, one scoop at a time.', img: '/experience_bg.png' }
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
            {cmsContent.storyText || `It began with an exhausting search for ice cream that tasted like memories—not chemicals. 
            We tore up the rules of mass production and built Cream Dream on a single, unwavering promise:
            If we wouldn't serve it to our own family, we won't serve it to you.`}
          </p>
          <div className="founder-signoff">
            — The Cream Dream Family
          </div>
        </div>
      </section>

      {/* Subscriptions Showcase Section */}
      <section className="about-subscriptions-section container" style={{ margin: '6rem auto' }}>
        <div className="section-header text-center mb-16" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p className="story-label" style={{ color: 'var(--color-primary)', fontWeight: 800, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>CREAM CLUB</p>
          <h2 className="section-title" style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-serif)', color: 'var(--color-text-main)', margin: 0 }}>Join Our Subscriptions</h2>
          <div className="section-header-accent" style={{ width: '60px', height: '4px', background: 'var(--color-accent)', margin: '1rem auto 0' }}></div>
          <p style={{ maxWidth: '600px', margin: '1.5rem auto 0', color: 'var(--color-text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Get your favorite handcrafted tubs, cones, and popsicles delivered fresh on a recurring schedule.
          </p>
        </div>

        {loadingPlans ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Loading plans...</div>
        ) : (
          <div className="plans-grid">
            {plans.map((plan) => (
              <div key={plan._id || plan.id} className={`plan-card glass-panel ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <span className="popular-badge">MOST POPULAR</span>}
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-price">
                  <span className="currency">₹</span>
                  <span className="amount">{plan.price}</span>
                  <span className="period">/ {plan.frequency.toLowerCase()}</span>
                </div>
                <ul className="plan-features">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>
                      <Check size={16} className="feature-check" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="btn-primary plan-btn" onClick={() => setSelectedPlan(plan)}>
                  Subscribe Now
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Subscription Checkout Modal */}
      <AnimatePresence>
        {selectedPlan && (
          <div className="instant-modal-overlay flex-center" onClick={() => setSelectedPlan(null)} style={{ zIndex: 99999 }}>
            <motion.div 
              className="instant-modal-card glass-panel"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: '#ffffff', maxWidth: '460px', padding: '2.5rem' }}
            >
              {subSuccess ? (
                <div className="instant-success flex-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem 0' }}>
                  <div className="success-badge" style={{ background: '#dcfce7', color: '#16a34a', padding: '1rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={36} />
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Subscription Requested!</h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>Waiting for manager approval...</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#1e293b' }}>Subscribe to {selectedPlan.name}</h3>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    Enter your details below to request a subscription. Cash on delivery (COD) will be collected on each delivery date.
                  </p>
                  
                  <div className="input-group">
                    <input 
                      type="text" 
                      id="subCustName" 
                      value={subForm.name} 
                      onChange={(e) => setSubForm(prev => ({ ...prev, name: e.target.value }))} 
                      required 
                      placeholder=" " 
                      disabled={subLoading}
                    />
                    <label htmlFor="subCustName">Full Name</label>
                  </div>

                  <div className="input-group">
                    <input 
                      type="tel" 
                      id="subCustPhone" 
                      value={subForm.phone} 
                      onChange={(e) => setSubForm(prev => ({ ...prev, phone: e.target.value }))} 
                      required 
                      placeholder=" " 
                      disabled={subLoading}
                    />
                    <label htmlFor="subCustPhone">Phone Number</label>
                  </div>

                  <div className="input-group">
                    <textarea 
                      id="subCustAddress" 
                      rows="3"
                      value={subForm.address} 
                      onChange={(e) => setSubForm(prev => ({ ...prev, address: e.target.value }))} 
                      required 
                      placeholder=" " 
                      disabled={subLoading}
                      style={{ width: '100%', padding: '0.85rem', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none', resize: 'vertical' }}
                    />
                    <label htmlFor="subCustAddress">Delivery Address</label>
                  </div>

                  <div className="modal-actions" style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      type="button" 
                      className="btn-secondary" 
                      style={{ flex: 1, padding: '0.85rem' }}
                      onClick={() => setSelectedPlan(null)}
                      disabled={subLoading}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn-primary" 
                      style={{ flex: 1, padding: '0.85rem' }}
                      disabled={subLoading}
                    >
                      {subLoading ? 'Sending...' : 'Confirm Subscription'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cinematic Visit Us Footer */}
      <section className="visit-us-cinematic" style={{ backgroundImage: `url('/visit_us_bg.png')` }}>
        <div className="visit-overlay"></div>
        <div className="container visit-content">
          <div className="section-header mb-12">
            <h2 className="section-title">Your Table is Ready</h2>
            <div className="section-header-accent"></div>
          </div>
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
