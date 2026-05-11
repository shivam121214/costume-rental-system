import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const COLOR_PALETTE = ['#ff9f1c', '#ef476f', '#118ab2', '#06d6a0', '#ffd166', '#f78c6b'];

export function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = "https://costume-rental-system.onrender.com";

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}/storage/${path}`;
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/products`);
      const products = res.data;

      // Group products by category
      const grouped = {};
      products.forEach((product) => {
        const category = product.category || 'Other';
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(product);
      });

      // Convert to array format with colors and select featured/latest products
      const categoriesArray = Object.entries(grouped).map(([name, products], index) => {
        // Prioritize featured products, then get up to 4 products
        const featured = products.filter(p => p.is_featured);
        const selected = featured.length > 0 ? featured.slice(0, 4) : products.slice(0, 4);
        
        return {
          name,
          products: selected,
          image: selected[0]?.image || '',
          count: `${products.length} Items`,
          color: COLOR_PALETTE[index % COLOR_PALETTE.length]
        };
      });

      setCategories(categoriesArray);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  }
  return (
    <section className="py-24 px-4 bg-[#fdf8e6] relative overflow-hidden border-t-4 border-black">
      {/* Confetti background dots */}
      <div className="absolute top-10 left-10 w-4 h-4 rounded-full bg-[#ef476f]"></div>
      <div className="absolute top-20 right-20 w-6 h-6 rounded-full bg-[#118ab2]"></div>
      <div className="absolute bottom-10 left-1/4 w-5 h-5 rounded-full bg-[#06d6a0]"></div>
      <div className="absolute bottom-20 right-10 w-4 h-4 rounded-full bg-[#ffd166]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
          <div className="text-center md:text-left">
            <motion.div 
              initial={{ opacity: 0, y: 20, rotate: -5 }}
              whileInView={{ opacity: 1, y: 0, rotate: -2 }}
              viewport={{ once: true }}
              className="inline-block mb-2 bg-white border-2 border-black px-3 py-1 rounded-xl shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
            >
              <span className="text-black font-bold tracking-wider text-sm">Explore by Theme</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl text-black drop-shadow-[2px_2px_0_rgba(255,255,255,1)] mt-2" style={{
                fontFamily: "'Chewy', cursive",
              }}
            >
              Pick Your Adventure!
            </motion.h2>
          </div>
          <Link to="/products" className="block">
            <button className="bg-white text-black px-6 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 font-bold transition-all text-lg">
              See All Themes
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-xl text-black font-bold">Loading categories...</div>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-xl text-black font-bold">No categories available yet.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link to={`/products?category=${encodeURIComponent(category.name)}`} key={category.name} className="no-underline">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
                  className="group relative cursor-pointer h-full"
                >
                  <div 
                    className="absolute inset-0 rounded-3xl border-4 border-black translate-x-3 translate-y-3"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <div className="relative rounded-3xl border-4 border-black overflow-hidden bg-white h-full flex flex-col">
                    {/* Product Grid Showcase */}
                    <div className="grid grid-cols-2 border-b-4 border-black bg-gray-100">
                      {category.products.map((product, idx) => (
                        <div key={idx} className="aspect-square border-r-2 border-b-2 border-black last:border-r-0 last:border-b-0 flex items-center justify-center bg-gray-200 overflow-hidden">
                          {product.image ? (
                            <img
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br text-white text-xs font-bold">
                              No Image
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="p-6 text-center bg-white flex-1 flex flex-col justify-center">
                      <h3 className="text-2xl mb-2 text-black" style={{ fontFamily: "'Chewy', cursive" }}>{category.name}</h3>
                      <p className="font-bold rounded-full px-3 py-1 inline-block text-sm border-2 border-black self-center text-white" style={{ backgroundColor: category.color }}>
                        {category.count}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Categories;
