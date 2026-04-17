import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate frontend-only submission delay
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      
      // Hide success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="contact-page fade-in">
      {/* Official Banner Section */}
      <section className="contact-banner" style={{ backgroundImage: `url('/visit_us_bg.png')` }}>
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
        </div>
      </section>

      <motion.div 
        className="contact-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Contact Info Col */}
        <motion.div className="contact-info" variants={itemVariants}>
          <div className="info-card">
            <div className="info-icon-wrapper">
              <MapPin size={28} />
            </div>
            <div className="info-content">
              <h3>Visit Our Parlor</h3>
              <p>MG Road<br />Nellore, Andhra Pradesh</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon-wrapper">
              <Phone size={28} />
            </div>
            <div className="info-content">
              <h3>Call Us</h3>
              <p>Feel free to call if you have any questions.<br />9014002314</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon-wrapper">
              <Mail size={28} />
            </div>
            <div className="info-content">
              <h3>Email Us</h3>
              <p>Drop us a line anytime.<br />OCW@gmail.com</p>
            </div>
          </div>
        </motion.div>

        {/* Contact Form Col */}
        <motion.div className="contact-form-wrapper" variants={itemVariants}>
          {isSuccess && (
            <motion.div 
              className="form-success-msg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              Thank you for reaching out! We'll get back to you shortly.
            </motion.div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name"
                name="name" 
                className="form-input" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                className="form-input" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
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
                required 
              ></textarea>
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
              {!isSubmitting && <Send size={18} />}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
