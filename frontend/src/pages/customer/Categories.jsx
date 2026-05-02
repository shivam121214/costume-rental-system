import { motion } from 'motion/react';

const categories = [
  {
    name: 'Spooky Halloween',
    image: 'https://images.unsplash.com/photo-1604138769357-19ee3cc8be99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    count: '3,000+ BOOs!',
    color: '#ff9f1c'
  },
  {
    name: 'Magical Fairies',
    image: 'https://images.unsplash.com/photo-1691698088069-9a8e3eca96a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    count: '1,500+ Sparkles',
    color: '#ef476f'
  },
  {
    name: 'Superheroes',
    image: 'https://images.unsplash.com/photo-1531343717540-5e36502ba7c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    count: '2,000+ POWs!',
    color: '#118ab2'
  },
  {
    name: 'Roaring Dinos',
    image: 'https://images.unsplash.com/photo-1572614947388-4c994baaeb2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    count: '999+ ROARs!',
    color: '#06d6a0'
  }
];

export function Categories() {
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
              className="text-5xl md:text-6xl font-['Chewy'] text-black drop-shadow-[2px_2px_0_rgba(255,255,255,1)] mt-2"
            >
              Pick Your Adventure!
            </motion.h2>
          </div>
          <button className="bg-white text-black px-6 py-3 rounded-xl border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 font-bold transition-all text-lg">
            See All Themes
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
              key={category.name}
              className="group relative cursor-pointer"
            >
              <div 
                className="absolute inset-0 rounded-3xl border-4 border-black translate-x-3 translate-y-3"
                style={{ backgroundColor: category.color }}
              ></div>
              <div className="relative rounded-3xl border-4 border-black overflow-hidden bg-white h-full flex flex-col">
                <div className="aspect-video relative border-b-4 border-black">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 text-center bg-white flex-1 flex flex-col justify-center">
                  <h3 className="text-2xl font-['Chewy'] mb-2 text-black">{category.name}</h3>
                  <p className="font-bold rounded-full px-3 py-1 inline-block text-sm border-2 border-black self-center" style={{ backgroundColor: category.color, color: 'white' }}>
                    {category.count}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
