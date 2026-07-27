import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

import './ProductShowcaseSlider.css';

const showcaseSlides = [
  {
    id: 1,
    title: "Luxurious Madagascar Vanilla",
    subtitle: "The Purest Ingredients",
    image: "/ingredients_bg.png",
    description: "Sourced from the finest vanilla orchids, creating an incredibly rich, aromatic base for our signature flavors."
  },
  {
    id: 2,
    title: "Handcrafted Daily",
    subtitle: "Artisanal Perfection",
    image: "/craft_bg.png",
    description: "Every morning, our master artisans blend fresh local dairy into small batches for ultimate creaminess."
  },
  {
    id: 3,
    title: "The Ultimate Experience",
    subtitle: "More Than Ice Cream",
    image: "/experience_bg.png",
    description: "A gathering place where memories are made. Indulge in an eye-catching, melt-in-your-mouth masterpiece."
  }
];

export default function ProductShowcaseSlider() {
  return (
    <div className="product-showcase-wrapper">
      <motion.div 
        className="product-showcase-container glass-panel"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Swiper
          modules={[EffectFade, Autoplay, Pagination]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1000}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          loop={true}
          className="product-showcase-swiper"
        >
          {showcaseSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="showcase-slide">
                <div 
                  className="showcase-bg-image" 
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
                <div className="showcase-overlay" />
                
                <div className="showcase-content">
                  <motion.span 
                    className="showcase-subtitle"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    {slide.subtitle}
                  </motion.span>
                  <motion.h2 
                    className="showcase-title"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {slide.title}
                  </motion.h2>
                  <motion.p 
                    className="showcase-desc"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    {slide.description}
                  </motion.p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </div>
  );
}
