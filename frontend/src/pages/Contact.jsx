import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Send, ChevronDown, Star } from 'lucide-react';
import { createEnquiry } from '../data/enquiryStore';
import './Contact.css';

const faqs = [
  {
    question: "Do you offer vegan or dairy-free options?",
    answer: "Yes! We have an extensive vegan menu featuring oat milk bases, coconut matcha, and a variety of refreshing fruit sorbets."
  },
  {
    question: "Can I order bulk ice cream for parties or events?",
    answer: "Absolutely. We provide catering packages and bulk tubs for weddings, birthdays, and corporate events. Please mention 'Catering' in your message below."
  },
  {
    question: "What are your delivery hours?",
    answer: "Our parlor is open from 10 AM to 11 PM daily. Delivery is available within a 10km radius from 11 AM to 10:30 PM."
  },
  {
    question: "Are your ingredients locally sourced?",
    answer: "We pride ourselves on using premium, locally-sourced dairy and fresh seasonal fruits for all our artisanal flavors."
  }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await createEnquiry({
        name: formData.name,
        email: formData.email,
        subject: formData.phone || 'General Enquiry', 
        message: formData.message
      });
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      console.error('Failed to submit enquiry', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="contact-page fade-in">
      {/* 4K Official Banner Section */}
      <section className="contact-banner" style={{ backgroundImage: `url('/images/strawberry_dream_1785224539169.png')` }}>
        <div className="banner-overlay"></div>
        <div className="banner-content">
          <motion.p 
            className="contact-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Get In Touch
          </motion.p>
          <motion.h1 
            className="contact-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We'd Love to Hear From You
          </motion.h1>
          <motion.div 
            className="banner-separator"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="separator-line"></div>
            <Star size={16} fill="currentColor" />
            <div className="separator-line"></div>
          </motion.div>
        </div>
      </section>

      <div className="contact-main-content">
        {/* Row 1: 3-Column Info Cards */}
        <motion.div 
          className="contact-info-bar"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="info-card-horizontal glass-panel" variants={itemVariants}>
            <div className="info-icon-wrapper">
              <MapPin size={24} />
            </div>
            <div className="info-content">
              <h3>Visit Our Parlor</h3>
              <p>MG Road, Nellore, AP</p>
            </div>
          </motion.div>

          <motion.div className="info-card-horizontal glass-panel" variants={itemVariants}>
            <div className="info-icon-wrapper">
              <Phone size={24} />
            </div>
            <div className="info-content">
              <h3>Call Us</h3>
              <p>+91 9014002314</p>
            </div>
          </motion.div>

          <motion.div className="info-card-horizontal glass-panel" variants={itemVariants}>
            <div className="info-icon-wrapper">
              <Mail size={24} />
            </div>
            <div className="info-content">
              <h3>Email Us</h3>
              <p>OCW@gmail.com</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Row 2: Form (Left) and FAQs (Right) */}
        <div className="contact-middle-section">
          {/* Contact Form */}
          <motion.div 
            className="contact-form-wrapper glass-panel"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="form-header">
              <h2>Send a Message</h2>
              <p>Have a special request? Drop us a line.</p>
            </div>

            {isSuccess && (
              <motion.div 
                className="form-success-msg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
              >
                Message sent successfully! We'll get back to you shortly.
              </motion.div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input 
                    type="text" 
                    id="name"
                    name="name" 
                    className="form-input" 
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    required 
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    className="form-input" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone"
                  className="form-input" 
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  required 
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  name="message"
                  className="form-input" 
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you today?"
                  required 
                ></textarea>
              </div>

              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
                {!isSubmitting && <Send size={18} />}
              </button>
            </form>
          </motion.div>

          {/* FAQ Accordion & Social Info */}
          <motion.div 
            className="contact-side-info"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="faq-container glass-panel">
              <h2>FAQs</h2>
              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <div 
                    key={index} 
                    className={`faq-item ${openFaq === index ? 'open' : ''}`}
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <div className="faq-question">
                      <h4>{faq.question}</h4>
                      <ChevronDown className={`faq-icon ${openFaq === index ? 'rotated' : ''}`} />
                    </div>
                    <AnimatePresence>
                      {openFaq === index && (
                        <motion.div 
                          className="faq-answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p>{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="social-links-card glass-panel">
              <h3>Follow Our Journey</h3>
              <div className="social-icons">
                <a href="#" className="social-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" className="social-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" className="social-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Row 3: Full Width Interactive Map */}
        <motion.div 
          className="map-container-full glass-panel"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>Find Us in Nellore</h2>
          <div className="map-frame-wrapper-full">
            <iframe 
              src="https://maps.google.com/maps?q=MG%20Road,%20Nellore,%20Andhra%20Pradesh&z=15&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
