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
    <div className="relative size-full min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-[#8338ec] via-[#bde0fe] to-[#06d6a0] font-sans">
      
      {/* Animated background blobs */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-[#ffd166] rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-56 h-56 bg-[#ef476f] rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-[#ff5c8d] rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>

      {/* Comic Halftone Dots */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(#000 2px, transparent 2px)",
          backgroundSize: "24px 24px"
        }}
      />
      
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
          className="w-56 h-56 md:w-72 md:h-72 object-contain transform rotate-30"
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