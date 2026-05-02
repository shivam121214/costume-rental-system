import { Heart, Phone, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export function Footer() {
  const handleReviewClick = () => {
    // This will later be connected to Google Maps link
    // For now, just log the action
    console.log('Opening Google Maps for reviews');
    // window.open('https://maps.google.com/...', '_blank');
  };

  return (
    <footer className="bg-[#118ab2] text-white pt-24 pb-12 px-6 border-t-[6px] border-black relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#06d6a0] rounded-full mix-blend-multiply filter blur-2xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ef476f] rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 bg-white p-10 rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)] text-black">
          
          <div className="md:col-span-5">
            <a href="/" className="inline-flex items-center mb-6 transform hover:scale-105 transition-transform">
              <span className="text-4xl text-[#ef476f] drop-shadow-[2px_2px_0_rgba(0,0,0,1)] tracking-wide" style={{
                fontFamily: "'Chewy', cursive",
              }}>
                Aadya Fancy Dresses
              </span>
            </a>
            <p className="text-lg font-bold leading-relaxed max-w-sm mb-6">
              The craziest, funnest, most awesome costume shop in the universe! Get ready to transform into your wildest dreams!
            </p>
            <div className="flex gap-4">
              <a href="#" className="bg-[#ef476f] p-3 rounded-xl border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)] transition-all text-white">
                <Heart className="w-6 h-6" style={{ strokeWidth: 3 }} />
              </a>
              <a href="#" className="bg-[#ffd166] p-3 rounded-xl border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[1px_1px_0_0_rgba(0,0,0,1)] transition-all text-black">
                <Phone className="w-6 h-6" style={{ strokeWidth: 3 }} />
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-xl mb-6 inline-block border-b-4 border-[#06d6a0]" style={{
              fontFamily: "'Chewy', cursive",
            }}>Quick Links</h3>
            <ul className="space-y-3 font-bold text-lg">
              <li><a href="#" className="hover:text-[#ef476f] hover:pl-2 transition-all flex items-center gap-2">► New Arrivals</a></li>
              <li><a href="#" className="hover:text-[#ef476f] hover:pl-2 transition-all flex items-center gap-2">► Best Sellers</a></li>
              <li><a href="#" className="hover:text-[#ef476f] hover:pl-2 transition-all flex items-center gap-2">► Size Guide</a></li>
              <li><a href="#" className="hover:text-[#ef476f] hover:pl-2 transition-all flex items-center gap-2">► Super Sale!</a></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-xl mb-6 inline-block border-b-4 border-[#ffd166]" style={{
              fontFamily: "'Chewy', cursive",
            }}>Give Your Review!</h3>
            <p className="font-bold text-lg mb-6">
              Visit our shop location and share your amazing party moments with us on Google Maps! Your reviews help us keep the party going!
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReviewClick}
              className="bg-[#ffd166] text-black px-8 py-4 rounded-xl border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 font-bold text-lg flex items-center gap-3 transition-all uppercase tracking-wide w-full justify-center" style={{
                fontFamily: "'Chewy', cursive",
              }}
            >
              <MapPin className="w-5 h-5" style={{ strokeWidth: 3 }} />
              View Location & Review
            </motion.button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between font-bold text-lg gap-4 text-white">
          <p>&copy; 2026 Party Palooza! All rules broken.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#ffd166] transition-colors underline decoration-2 underline-offset-4">Privacy Rules</a>
            <a href="#" className="hover:text-[#ffd166] transition-colors underline decoration-2 underline-offset-4">Boring Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
