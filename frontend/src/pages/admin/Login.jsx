import { motion } from "motion/react";
import { Eye, EyeOff, Sparkles, Gift, Star } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "https://costume-rental-system.onrender.com/api/admin/login",
        form
      );

      localStorage.setItem("admin", JSON.stringify(res.data.user));
      navigate("/admin");
    } catch (error) {
      alert("Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative size-full min-h-screen flex items-center justify-center overflow-hidden font-sans">
      
      {/* Blue Radiant Burst Background */}
      <div className="absolute inset-0 bg-gradient-conic from-[#0891b2] via-[#06b6d4] to-[#0891b2]"></div>
      
      {/* Animated rotating radial lines */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: `
            repeating-conic-gradient(from 0deg, 
              transparent 0deg, 
              transparent 5deg,
              rgba(15, 118, 110, 0.6) 5deg,
              rgba(15, 118, 110, 0.6) 10deg
            )
          `
        }}
      />
      
      {/* Dots pattern overlay */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(#0f766e 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px"
        }}
      />

      {/* MCU-Style Silhouette Doodles Background */}
      {/* Top Left - Shield Icon */}
      <motion.div 
        className="absolute top-12 left-8 pointer-events-none z-0 opacity-40"
        animate={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-12 h-12 border-3 border-black rounded-lg transform rotate-45" />
      </motion.div>

      {/* Top Center Left - Star Circle */}
      <motion.div 
        className="absolute top-20 left-1/4 pointer-events-none z-0 opacity-35"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-10 h-10 border-3 border-black rounded-full flex items-center justify-center">
          <div className="text-xl font-black">★</div>
        </div>
      </motion.div>

      {/* Top Right - Lightning Bolt */}
      <motion.div 
        className="absolute top-16 right-20 pointer-events-none z-0 opacity-40 font-black text-4xl"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
      >
        ⚡
      </motion.div>

      {/* Top Right - Mask Silhouette */}
      <motion.div 
        className="absolute top-32 right-8 pointer-events-none z-0 opacity-35"
        animate={{ rotateY: [0, 180, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="32" height="24" viewBox="0 0 32 24" fill="none" stroke="black" strokeWidth="2">
          <path d="M2 8 Q2 2 8 2 Q16 2 16 8 Q16 2 24 2 Q30 2 30 8 L28 20 Q28 22 26 22 L6 22 Q4 22 4 20 Z" />
        </svg>
      </motion.div>

      {/* Middle Left - Character Silhouette */}
      <motion.div 
        className="absolute left-4 top-1/3 pointer-events-none z-0 opacity-35"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="28" height="40" viewBox="0 0 28 40" fill="black">
          <circle cx="14" cy="8" r="6" />
          <rect x="8" y="16" width="16" height="12" />
          <rect x="4" y="28" width="8" height="12" />
          <rect x="16" y="28" width="8" height="12" />
        </svg>
      </motion.div>

      {/* Middle Center - Spiral Symbol */}
      <motion.div 
        className="absolute left-1/3 top-1/2 pointer-events-none z-0 opacity-30 font-black text-3xl"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        ◎
      </motion.div>

      {/* Middle Right - Sword/Blade */}
      <motion.div 
        className="absolute right-6 top-2/5 pointer-events-none z-0 opacity-35"
        animate={{ rotate: [0, -15, 15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="12" height="40" viewBox="0 0 12 40" fill="black">
          <polygon points="6,0 10,8 6,30 2,8" />
          <rect x="4" y="30" width="4" height="10" />
        </svg>
      </motion.div>

      {/* Bottom Left - Gun/Blaster */}
      <motion.div 
        className="absolute bottom-24 left-12 pointer-events-none z-0 opacity-35"
        animate={{ rotateY: [0, 180, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="36" height="20" viewBox="0 0 36 20" fill="black">
          <rect x="2" y="8" width="20" height="4" rx="2" />
          <circle cx="24" cy="10" r="4" />
          <polygon points="28,6 34,8 34,12 28,14" />
        </svg>
      </motion.div>

      {/* Bottom Center - Sphere with Rings */}
      <motion.div 
        className="absolute bottom-32 left-1/2 -translate-x-1/2 pointer-events-none z-0 opacity-30"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="black" strokeWidth="1.5">
          <circle cx="14" cy="14" r="6" />
          <circle cx="14" cy="14" r="10" />
          <circle cx="14" cy="14" r="14" />
        </svg>
      </motion.div>

      {/* Bottom Right - Target/Crosshair */}
      <motion.div 
        className="absolute bottom-20 right-16 pointer-events-none z-0 opacity-35"
        animate={{ scale: [1, 1.15, 1], rotate: [0, 45, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="black" strokeWidth="2">
          <circle cx="16" cy="16" r="4" />
          <circle cx="16" cy="16" r="10" />
          <line x1="8" y1="16" x2="24" y2="16" />
          <line x1="16" y1="8" x2="16" y2="24" />
        </svg>
      </motion.div>

      {/* Far Right - Character Gesture */}
      <motion.div 
        className="absolute right-4 top-2/3 pointer-events-none z-0 opacity-30"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="24" height="36" viewBox="0 0 24 36" fill="black">
          <circle cx="12" cy="6" r="4" />
          <polygon points="12,12 8,18 8,30 12,28 16,30 16,18" />
          <line x1="4" y1="16" x2="2" y2="22" strokeWidth="2" stroke="black" />
          <line x1="20" y1="16" x2="22" y2="22" strokeWidth="2" stroke="black" />
        </svg>
      </motion.div>

      {/* Far Left Bottom - Hexagon Pattern */}
      <motion.div 
        className="absolute bottom-16 left-6 pointer-events-none z-0 opacity-30"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5">
          <polygon points="12,2 20,6 20,14 12,18 4,14 4,6" />
        </svg>
      </motion.div>

      {/* Far Right Top - Tech Icon */}
      <motion.div 
        className="absolute top-1/4 right-2 pointer-events-none z-0 opacity-30"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="black">
          <rect x="2" y="4" width="24" height="18" rx="2" />
          <rect x="8" y="22" width="12" height="2" />
          <line x1="14" y1="22" x2="14" y2="26" strokeWidth="2" stroke="black" />
        </svg>
      </motion.div>

      {/* Center Top - Web/Network */}
      <motion.div 
        className="absolute top-1/4 right-1/3 pointer-events-none z-0 opacity-25"
        animate={{ rotate: [0, 180, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="black" strokeWidth="1.5">
          <circle cx="16" cy="8" r="3" fill="black" />
          <circle cx="8" cy="20" r="3" fill="black" />
          <circle cx="24" cy="20" r="3" fill="black" />
          <circle cx="16" cy="28" r="3" fill="black" />
          <line x1="16" y1="8" x2="8" y2="20" />
          <line x1="16" y1="8" x2="24" y2="20" />
          <line x1="8" y1="20" x2="16" y2="28" />
          <line x1="24" y1="20" x2="16" y2="28" />
        </svg>
      </motion.div>
      
      {/* Animated decorative elements */}
      <motion.div
        className="absolute top-20 right-20 pointer-events-none z-0"
        animate={{ rotate: 360, y: [-10, 10, -10] }}
        transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
      >
        <div className="w-16 h-16 bg-[#ffd166] border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0_rgba(0,0,0,1)] transform rotate-45">
          <Sparkles className="w-8 h-8 text-black" style={{ strokeWidth: 3 }} />
        </div>
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 left-20 pointer-events-none z-0"
        animate={{ rotate: -360, y: [10, -10, 10] }}
        transition={{ rotate: { duration: 25, repeat: Infinity, ease: "linear" }, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
      >
        <div className="w-12 h-12 bg-[#06d6a0] border-3 border-black rounded-lg flex items-center justify-center shadow-[3px_3px_0_rgba(0,0,0,1)]">
          <Gift className="w-6 h-6 text-black" style={{ strokeWidth: 3 }} />
        </div>
      </motion.div>

      {/* Swinging Spider-Man Animation */}
      <motion.div
        className="absolute top-[30%] left-1/2 -translate-x-1/2 pointer-events-none z-0"
        style={{ transformOrigin: "50% -120vh" }}
        animate={{ rotate: [35, -35, 35] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* The web line extending up to the pivot point */}
        <div className="absolute left-1/2 bottom-full w-1 h-[120vh] -translate-x-1/2 bg-white border-x border-gray-300 shadow-[2px_0px_0px_0px_rgba(0,0,0,0.5)]" />
        
        {/* The Spider-Man character inside a comic panel mask */}
        <img 
          src="/spiderman.png" 
          alt="Spider-Man" 
          className="w-56 h-56 md:w-72 md:h-72 object-contain transform rotate-37"
        />
        
        {/* THWIP action text */}
        <motion.div 
          className="absolute -top-4 -right-12 bg-white text-black border-4 border-black px-3 py-1 font-black text-xl md:text-2xl rounded-xl shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
          style={{ fontFamily: "'Chewy', cursive" }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2.5 }}
        >
          THWIP!
        </motion.div>
      </motion.div>

      {/* Flying Iron Man Animation - Right to Left */}
      <motion.div
        className="absolute top-[20%] pointer-events-none z-0"
        initial={{ right: "-40%" }}
        animate={{ 
          right: ["-40%", "140%"],
          y: [0, -80, 50, -30, 0]
        }}
        transition={{ 
          right: { duration: 12, repeat: Infinity, ease: "linear", delay: 2 },
          y: { duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }
        }}
      >
        <img 
          src="/ironman.png" 
          alt="Iron Man" 
          className="w-52 h-36 md:w-80 md:h-56 object-cover"
        />
        {/* Action text */}
        <motion.div 
          className="absolute -bottom-6 -left-6 bg-[#ef476f] text-white border-4 border-black px-4 py-1 font-black text-xl md:text-2xl rounded-full shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
          style={{ fontFamily: "'Chewy', cursive" }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ZOOM!
        </motion.div>
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-white rounded-3xl p-8 md:p-10 border-4 border-black shadow-[12px_12px_0_0_rgba(0,0,0,1)] relative">
          
          {/* Card Star Decoration */}
          <motion.div 
            className="absolute -top-6 -right-6 w-14 h-14 bg-[#ffd166] border-4 border-black rounded-full flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)] z-20"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Star className="w-6 h-6 text-black fill-black" />
          </motion.div>

          {/* Header */}
          <div className="text-center mb-8 relative">
            <motion.div
              className="absolute -top-16 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#ef476f] border-4 border-black rounded-full flex items-center justify-center shadow-[6px_6px_0_0_rgba(0,0,0,1)] z-20"
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-10 h-10 text-white" style={{ strokeWidth: 3 }} />
            </motion.div>
            
            <h1 className="mt-6 text-4xl font-black text-black uppercase tracking-wider" style={{ fontFamily: "'Chewy', cursive", textShadow: "3px 3px 0px rgba(0,0,0,0.3)" }}>
              Party Time Login
            </h1>
            <div className="mt-3 inline-block">
              <p className="text-black font-bold text-sm uppercase tracking-wider bg-[#ffd166] px-4 py-1 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                Admin Control 🎭
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={login} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <label className="block text-black font-black uppercase mb-2 text-sm tracking-wide">
                Email Address
              </label>
              <motion.div whileTap={{ scale: 0.99 }}>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@partypalooza.com"
                  required
                  className="w-full px-4 py-3 bg-[#fdf8e6] border-3 border-black rounded-xl font-bold focus:bg-[#fff9e6] focus:outline-none focus:border-[#ef476f] transition-all shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.05)] placeholder:text-gray-400"
                />
              </motion.div>
            </div>

            {/* Password Input */}
            <div className="relative">
              <label className="block text-black font-black uppercase mb-2 text-sm tracking-wide">
                Secret Code
              </label>
              <motion.div whileTap={{ scale: 0.99 }} className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-12 bg-[#fdf8e6] border-3 border-black rounded-xl font-bold focus:bg-[#fff9e6] focus:outline-none focus:border-[#ef476f] transition-all shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.05)] placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-[#ef476f] transition-colors bg-white border-2 border-black rounded-full p-1.5 shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#ffd166] text-black border-4 border-black font-black uppercase text-lg rounded-xl shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:bg-[#ffeb99] disabled:opacity-50 transition-colors mt-6 relative overflow-hidden group flex items-center justify-center gap-2"
              whileHover={!loading ? { y: -2, x: -2, boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" } : {}}
              whileTap={!loading ? { y: 4, x: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)" } : {}}
              style={{
                fontFamily: "'Chewy', cursive",
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 tracking-wider">
                {loading ? "Logging In..." : "Let's Party!"}
              </span>
              {!loading && <div className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-12 z-0" />}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="text-center mt-8 font-bold border-t-4 border-black pt-6 border-dashed">
            <p className="text-black text-sm uppercase tracking-wider">
              Back to store?{" "}
              <a href="/" className="text-[#ef476f] hover:text-[#118ab2] underline decoration-2 underline-offset-4 transition-colors font-black">
                Home Page
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;