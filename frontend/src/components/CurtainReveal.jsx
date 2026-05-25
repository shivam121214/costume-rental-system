import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

export function CurtainReveal({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);

  useEffect(() => {
    // Prevent scrolling while loading
    document.body.style.overflow = 'hidden';
    
    const openTimer = setTimeout(() => {
      setIsOpen(true);
      document.body.style.overflow = 'unset';
    }, 1800);

    const unmountTimer = setTimeout(() => {
      setIsUnmounted(true);
    }, 3200);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(unmountTimer);
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <>
      {!isUnmounted && (
        <div className="fixed inset-0 pointer-events-none flex font-['Fredoka',sans-serif]" style={{ zIndex: 200 }}>
          {/* Left Curtain */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: isOpen ? '-100%' : 0 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="w-1/2 h-full bg-[#ff5c8d] border-r-[6px] border-black flex items-center justify-end relative overflow-hidden"
            style={{
              boxShadow: 'inset -15px 0 40px rgba(0,0,0,0.25), inset -2px 0 8px rgba(255,255,255,0.2)'
            }}
          >
            {/* Curtain Folds Pattern */}
            <div 
              className="absolute inset-0 opacity-25 pointer-events-none" 
              style={{ 
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.5) 40px, rgba(0,0,0,0.5) 46px)',
                backgroundAttachment: 'fixed'
              }} 
            />
            {/* Additional depth shadow */}
            <div 
              className="absolute right-0 top-0 w-12 h-full opacity-40 pointer-events-none" 
              style={{ 
                background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.3))'
              }} 
            />
          </motion.div>

          {/* Right Curtain */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: isOpen ? '100%' : 0 }}
            transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
            className="w-1/2 h-full bg-[#ff5c8d] border-l-[6px] border-black flex items-center justify-start relative overflow-hidden"
            style={{
              boxShadow: 'inset 15px 0 40px rgba(0,0,0,0.25), inset 2px 0 8px rgba(255,255,255,0.2)'
            }}
          >
            {/* Curtain Folds Pattern */}
            <div 
              className="absolute inset-0 opacity-25 pointer-events-none" 
              style={{ 
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.5) 40px, rgba(0,0,0,0.5) 46px)',
                backgroundAttachment: 'fixed'
              }} 
            />
            {/* Additional depth shadow */}
            <div 
              className="absolute left-0 top-0 w-12 h-full opacity-40 pointer-events-none" 
              style={{ 
                background: 'linear-gradient(to left, transparent, rgba(0,0,0,0.3))'
              }} 
            />
          </motion.div>

          {/* Center Badge Container */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto" style={{ zIndex: 201 }}>
            <AnimatePresence>
              {!isOpen && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0, rotate: 15, y: 50 }}
                  transition={{ 
                    initial: { duration: 0.6, ease: 'backOut' },
                    exit: { duration: 0.5, ease: 'backIn' }
                  }}
                  className="relative"
                >
                  {/* Glow effect background */}
                  <div className="absolute inset-0 bg-yellow-300 blur-3xl opacity-40 rounded-3xl -z-10 animate-pulse" />
                  
                  <motion.div
                    className="bg-[#ffd166] border-[6px] border-black px-10 py-8 rounded-3xl text-center flex flex-col items-center justify-center w-max relative"
                    style={{
                      boxShadow: '12px 12px 0 rgba(0,0,0,1), 24px 24px 0 rgba(0,0,0,0.15)',
                      transform: 'rotate(-3deg)'
                    }}
                  >
                    {/* Shine effect */}
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-40 pointer-events-none" 
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 50%)'
                      }}
                    />

                    <motion.div
                      animate={{ y: [-5, 5, -5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="relative z-10"
                    >
                      <motion.h1 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="text-5xl md:text-7xl font-['Chewy'] text-[#ff5c8d] drop-shadow-[3px_3px_0_rgba(0,0,0,1)] mb-2 tracking-wide"
                      >
                        Aadya's
                      </motion.h1>
                      <motion.h2 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-xl md:text-3xl font-bold text-black uppercase tracking-widest border-t-4 border-black pt-3 border-dashed"
                      >
                        Fancy Dresses!
                      </motion.h2>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Decorative corner elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isOpen ? 0 : 1 }}
            transition={{ duration: 0.5 }}
            className="absolute top-8 left-8 w-8 h-8 border-2 border-black pointer-events-none opacity-40"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isOpen ? 0 : 1 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-8 right-8 w-8 h-8 border-2 border-black pointer-events-none opacity-40"
          />
        </div>
      )}
      {children}
    </>
  );
}
