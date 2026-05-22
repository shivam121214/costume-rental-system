import { Link } from "react-router-dom";
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Categories } from "./Categories";
import { FeaturedProducts } from "./FeaturedProducts";
import { Testimonials } from "./Testimonials";
import { ContactUs } from "./ContactUs";
import { Footer } from "../../components/Footer";
import { HeroSlideshow } from "../../components/HeroSlideshow";

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const API_URL = 'https://costume-rental-system.onrender.com';

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products/featured-section`);
      setFeaturedProducts(res.data);
    } catch (error) {
      console.error('Error fetching featured products:', error);
      setFeaturedProducts([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf8e6]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-start overflow-hidden bg-[#fdf8e6] pt-20">
        {/* Fun background decorative shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#ffd166] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-[#ef476f] rounded-full mix-blend-multiply filter blur-xl opacity-60"></div>
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-[#06d6a0] rounded-full mix-blend-multiply filter blur-xl opacity-60"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex flex-col-reverse md:flex-row items-center gap-12 relative z-10 py-12">
          
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
              className="inline-block mb-4 bg-[#ffd166] border-[3px] border-black px-4 py-2 rounded-2xl shadow-[4px_4px_0_0_rgba(0,0,0,1)] rotate-3"
            >
              <span className="text-sm font-bold tracking-wider text-black flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#ef476f]" /> New Arrivals!
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="text-6xl md:text-7xl lg:text-8xl mb-6 leading-[1.1]"
            >
              <span className="text-6xl md:text-7xl lg:text-8xl text-[#000000]" style={{
                fontFamily: "'Chewy', cursive",
                textShadow: '3px 3px 0px rgba(0,0,0,0.5)',
              }}>Unleash Your</span> <br/>
              <span className="text-6xl md:text-7xl lg:text-8xl text-[#ef476f]" style={{
                fontFamily: "'Chewy', cursive",
                textShadow: '3px 3px 0px rgba(0,0,0,0.5)',
              }}>Imagination!</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl mb-10 text-neutral-800 max-w-xl font-medium"
            >
              Ready to become a superhero, a magical princess, or a hilarious hotdog? Find the craziest costumes in town!
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 items-center justify-center md:justify-start"
            >
              <Link to="/products" className="group relative bg-[#06d6a0] text-black px-8 py-4 rounded-xl text-lg font-bold border-[3px] border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-3">
                Browse Your Childhood Dreams
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
              </Link>
            </motion.div>
          </div>

          <div className="flex-1 relative w-full max-w-lg mx-auto md:max-w-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: -2 }}
              transition={{ type: "spring", bounce: 0.4, duration: 1, delay: 0.2 }}
            >
              <HeroSlideshow products={featuredProducts} />
            </motion.div>
            {/* Decorative dots/stars */}
            <div className="absolute -top-8 -right-8 text-[#ffd166] hidden md:block animate-bounce">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" stroke="black" strokeWidth="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <div className="absolute -bottom-6 -left-8 text-[#06d6a0] hidden md:block animate-pulse">
              <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor" stroke="black" strokeWidth="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <Categories />

      {/* Featured Products Section */}
      <FeaturedProducts products={featuredProducts} />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Contact Us Section */}
      <ContactUs />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;