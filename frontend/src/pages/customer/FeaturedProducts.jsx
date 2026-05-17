import { Star, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const COLOR_PALETTE = ['#ef476f', '#ffd166', '#118ab2', '#06d6a0', '#ff9f1c', '#8338ec'];

export function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const API_URL = 'https://costume-rental-system.onrender.com';

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products/featured-section`);
      const featured = res.data.slice(0, 6);
      setProducts(featured);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_URL}/storage/${path}`;
  };

  return (
    <section className="py-24 px-4 bg-[#bde0fe] border-y-4 border-black relative overflow-hidden">
      {/* Background ZigZags */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="zigzag" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M0 20L10 0L20 20L30 0L40 20L30 40L20 20L10 40L0 20Z" fill="black" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#zigzag)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-16 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 20, rotate: 5 }}
            whileInView={{ opacity: 1, y: 0, rotate: -2 }}
            viewport={{ once: true }}
            className="mb-2 bg-white border-2 border-black px-4 py-1 rounded-2xl shadow-[3px_3px_0_0_rgba(0,0,0,1)]"
          >
            <span className="text-black font-bold tracking-wider text-sm">Hottest Picks!</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl text-black drop-shadow-[2px_2px_0_rgba(255,255,255,1)]" style={{
              fontFamily: "'Chewy', cursive",
            }}
          >
            Top Rated Costumes!
          </motion.h2>
        </div>

        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {products.map((product, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  key={product.id}
                  className="relative group"
                >
                  <div 
                    className="absolute inset-0 rounded-3xl border-4 border-black translate-x-3 translate-y-3"
                    style={{ backgroundColor: COLOR_PALETTE[index % COLOR_PALETTE.length] }}
                  ></div>
                  <div className="bg-white rounded-3xl border-4 border-black overflow-hidden relative h-full flex flex-col">
                    
                    <div className="relative aspect-video border-b-4 border-black overflow-hidden">
                      {product.is_featured && (
                        <div className="absolute top-4 left-4 z-10 bg-[#ff006e] text-white px-3 py-1 font-bold text-sm border-2 border-black rounded-xl shadow-[2px_2px_0_0_rgba(0,0,0,1)] rotate-[-5deg]">
                          SUPER POPULAR!
                        </div>
                      )}
                      <button className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:scale-110 transition-transform">
                        <Heart className="w-5 h-5 text-[#ff006e] fill-transparent hover:fill-[#ff006e] transition-colors" />
                      </button>
                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl text-black" style={{ fontFamily: "'Chewy', cursive" }}>{product.name}</h3>
                        <span className="text-xl font-bold bg-[#ffd166] border-2 border-black px-2 py-1 rounded-lg shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                          ₹{product.rent_price}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-6">
                        <div className="flex text-[#ff9f1c]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" strokeWidth={2} />
                          ))}
                        </div>
                        <span className="text-sm font-bold text-neutral-600">(--)</span>
                      </div>

                      <button className="mt-auto w-full py-3 bg-black text-white font-bold rounded-xl border-2 border-black hover:bg-neutral-800 hover:scale-[1.02] active:scale-[0.98] transition-all">
                        Add to Cart!
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-16 flex justify-center">
              <button className="bg-white text-black px-8 py-4 rounded-xl border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 font-bold transition-all text-xl" style={{ fontFamily: "'Chewy', cursive" }}>
                Load More Fun Stuff!
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-neutral-600">No featured products available yet. Admin can add them from the Products page!</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProducts;
