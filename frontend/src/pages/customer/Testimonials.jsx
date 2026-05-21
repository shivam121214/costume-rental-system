import { Star, Quote } from 'lucide-react';
import { motion } from 'motion/react';

const testimonials = [
  {
    id: 1,
    name: 'Deepali Deewakar',
    role: 'Fairy Mom',
    rating: 5,
    text: 'Adya fancy dress is amazing for any fancy dress , or festival clothing as it provides you a fresh, good condition, and shiny dresses. I have a wonderful experience with this shop from 2 years. I could not say about the honour of this shop, she is very polite and always ready for provide the things on time  every time. There Pricing are reasonable for everyone pocket. You can book your festival, school function, skit and many more dresses from them. Happy customer Deepali',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=256&h=256&q=80',
    color: '#ff9f1c'
  },
  {
    id: 2,
    name: 'Shaily Dubey',
    role: 'Amateur Superhero',
    rating: 5,
    text: 'A Delightful Experience at Aadya Fancy Dress Shop! I had a wonderful experience at Aadya Fancy Dress Shop! The collection is impressive, with a wide variety of costumes for every theme imaginable — from fairy tale characters to historical figures and creative, one-of-a-kind outfits. Everything is well-maintained, clean, and ready to wear. Whether it’s for school events, parties, or festivals, Aadya is now my go-to place for costumes. Highly recommended for anyone looking to make their special occasion even more memorable!',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=256&h=256&q=80',
    color: '#118ab2'
  },
  {
    id: 3,
    name: 'Emma Williams',
    role: 'T-Rex Wrangler',
    rating: 5,
    text: 'Excellent rental costume shop! Wide range of costumes for kids and adults, all in neat and hygienic condition. Prices are reasonable and the service is very friendly. Had a smooth and pleasant experience. Will surely visit again.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=facearea&facepad=2&w=256&h=256&q=80',
    color: '#ef476f'
  }
];

export function Testimonials() {
  return (
    <section className="py-24 px-4 bg-[#ffd166] border-b-4 border-black relative overflow-hidden">
      {/* Playful background stars */}
      <div className="absolute top-10 right-20 w-10 h-10">
        <Star className="w-full h-full text-white fill-white opacity-60 animate-pulse" />
      </div>
      <div className="absolute bottom-20 left-10 w-16 h-16">
        <Star className="w-full h-full text-[#ef476f] fill-[#ef476f] opacity-50 animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 2 }}
            viewport={{ once: true }}
            className="inline-block mb-4 bg-white border-2 border-black px-4 py-1 rounded-full shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
          >
            <span className="text-black font-bold tracking-wider text-sm">Real Reviews!</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl text-black drop-shadow-[2px_2px_0_rgba(255,255,255,1)]" style={{
              fontFamily: "'Chewy', cursive",
            }}
          >
            Happy Party People!
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
              key={testimonial.id}
              className="relative group"
            >
              <div 
                className="absolute inset-0 rounded-3xl border-4 border-black translate-x-2 translate-y-2"
                style={{ backgroundColor: testimonial.color }}
              ></div>
              <div className="bg-white rounded-3xl p-8 border-4 border-black relative h-full flex flex-col z-10">
                <Quote className="absolute top-4 right-4 w-12 h-12 text-[#fdf8e6] fill-[#fdf8e6] group-hover:scale-110 transition-transform" />
                
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-[#ffd166] text-black" strokeWidth={2} />
                  ))}
                </div>

                <p className="text-black mb-8 leading-relaxed font-bold text-lg relative z-10 flex-1">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-4 pt-6 mt-auto border-t-4 border-black border-dashed">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-black"
                  />
                  <div>
                    <div className="text-black text-xl" style={{ fontFamily: "'Chewy', cursive" }}>{testimonial.name}</div>
                    <div className="text-sm font-bold text-neutral-600 rounded-full px-2 py-0.5 bg-gray-100 border border-black inline-block mt-1">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
