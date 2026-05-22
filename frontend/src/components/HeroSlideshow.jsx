import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function HeroSlideshow({ products = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://costume-rental-system.onrender.com';
  const SLIDE_INTERVAL = 5000; // 5 seconds

  // Use first 4 featured products for hero
  const heroProducts = products.slice(0, 4);

  // Auto-advance slideshow
  useEffect(() => {
    if (!isAutoPlay || heroProducts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroProducts.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [isAutoPlay, heroProducts.length]);

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_URL}/storage/${path}`;
  };

  const goToPrevious = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + heroProducts.length) % heroProducts.length);
  };

  const goToNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % heroProducts.length);
  };

  const goToSlide = (index) => {
    setIsAutoPlay(false);
    setCurrentIndex(index);
  };

  // If no products, show fallback
  if (heroProducts.length === 0) {
    return (
      <div className="relative z-10 rounded-3xl border-4 border-black overflow-hidden shadow-[12px_12px_0_0_rgba(0,0,0,1)] bg-white aspect-square">
        <img
          src="https://images.unsplash.com/photo-1713357796381-591aadda442b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwZmFuY3klMjBkcmVzcyUyMHBhcnR5JTIwZnVuJTIwYnJpZ2h0fGVufDF8fHx8MTc3NzYxODIwMHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Kids in fun costumes"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const currentProduct = heroProducts[currentIndex];

  return (
    <div className="relative z-10 rounded-3xl border-4 border-black overflow-hidden shadow-[12px_12px_0_0_rgba(0,0,0,1)] bg-white aspect-square group">
      {/* Main Image with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          <img
            src={getImageUrl(currentProduct.image)}
            alt={currentProduct.name}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Product Name Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black to-transparent p-6"
      >
        <h3 className="text-white font-bold text-2xl" style={{ fontFamily: "'Chewy', cursive" }}>
          {currentProduct.name}
        </h3>
        <p className="text-yellow-300 font-bold text-lg">₹{currentProduct.rent_price}</p>
      </motion.div>

      {/* Navigation Buttons */}
      {heroProducts.length > 1 && (
        <>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToPrevious}
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setTimeout(() => setIsAutoPlay(true), 1000)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white text-black p-3 rounded-full border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-20 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={3} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToNext}
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setTimeout(() => setIsAutoPlay(true), 1000)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-black p-3 rounded-full border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-20 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-6 h-6" strokeWidth={3} />
          </motion.button>
        </>
      )}

      {/* Slide Indicators */}
      {heroProducts.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {heroProducts.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
              className={`rounded-full border-2 border-black transition-all ${
                index === currentIndex
                  ? 'w-4 h-4 bg-[#ff006e] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'w-3 h-3 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#ffd166]'
              }`}
            />
          ))}
        </div>
      )}

      {/* Auto-play indicator */}
      {heroProducts.length > 1 && (
        <div className="absolute top-4 right-4 z-20">
          <motion.div
            animate={{ opacity: isAutoPlay ? [1, 0.5, 1] : 1 }}
            transition={{ duration: 1, repeat: isAutoPlay ? Infinity : 0 }}
            className={`px-3 py-1 rounded-full border-2 border-black font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
              isAutoPlay
                ? 'bg-[#06d6a0] text-black'
                : 'bg-[#ffd166] text-black'
            }`}
          >
            {isAutoPlay ? '▶ Auto' : '⏸ Manual'}
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default HeroSlideshow;
