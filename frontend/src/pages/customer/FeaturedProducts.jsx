import { Star, Heart } from 'lucide-react';
import { motion } from 'motion/react';

const products = [
  {
    id: 1,
    name: 'Sparkle Fairy Wings',
    price: 45,
    rating: 5.0,
    reviews: 124,
    image: 'https://images.unsplash.com/photo-1691698088069-9a8e3eca96a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    popular: true,
    color: '#ef476f'
  },
  {
    id: 2,
    name: 'Grumpy Pirate Hat',
    price: 35,
    rating: 4.6,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1595083161474-0f2c41ca81e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    popular: false,
    color: '#ffd166'
  },
  {
    id: 3,
    name: 'Mega Superhero Cape',
    price: 55,
    rating: 4.9,
    reviews: 203,
    image: 'https://images.unsplash.com/photo-1531343717540-5e36502ba7c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    popular: true,
    color: '#118ab2'
  },
  {
    id: 4,
    name: 'Classic Ghost Sheet',
    price: 25,
    rating: 4.5,
    reviews: 67,
    image: 'https://images.unsplash.com/photo-1604138769357-19ee3cc8be99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    popular: false,
    color: '#06d6a0'
  },
  {
    id: 5,
    name: 'T-Rex Inflatable',
    price: 80,
    rating: 4.8,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1572614947388-4c994baaeb2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    popular: true,
    color: '#ff9f1c'
  },
  {
    id: 6,
    name: 'Space Astronaut Helmet',
    price: 38,
    rating: 4.7,
    reviews: 92,
    image: 'https://images.unsplash.com/photo-1627854659779-8808d279589f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    popular: false,
    color: '#8338ec'
  }
];

export function FeaturedProducts() {
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
            className="text-5xl md:text-6xl font-['Chewy'] text-black drop-shadow-[2px_2px_0_rgba(255,255,255,1)]"
          >
            Top Rated Costumes!
          </motion.h2>
        </div>

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
                style={{ backgroundColor: product.color }}
              ></div>
              <div className="bg-white rounded-3xl border-4 border-black overflow-hidden relative h-full flex flex-col">
                
                <div className="relative aspect-video border-b-4 border-black overflow-hidden">
                  {product.popular && (
                    <div className="absolute top-4 left-4 z-10 bg-[#ff006e] text-white px-3 py-1 font-bold text-sm border-2 border-black rounded-xl shadow-[2px_2px_0_0_rgba(0,0,0,1)] rotate-[-5deg]">
                      SUPER POPULAR!
                    </div>
                  )}
                  <button className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:scale-110 transition-transform">
                    <Heart className="w-5 h-5 text-[#ff006e] fill-transparent hover:fill-[#ff006e] transition-colors" />
                  </button>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-['Chewy'] text-black">{product.name}</h3>
                    <span className="text-xl font-bold bg-[#ffd166] border-2 border-black px-2 py-1 rounded-lg shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                      ${product.price}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex text-[#ff9f1c]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'fill-transparent'}`} strokeWidth={2} />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-neutral-600">({product.reviews})</span>
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
          <button className="bg-white text-black px-8 py-4 rounded-xl border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 font-bold transition-all text-xl font-['Chewy']">
            Load More Fun Stuff!
          </button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
