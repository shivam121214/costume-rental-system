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

      
      {/* Left Decoration - Photo Frame with WHOOSH */}
      <motion.div
        className="absolute top-12 left-8 pointer-events-none z-5 md:block hidden"
        animate={{ rotate: [-5, 5, -5], y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-32 h-24 bg-white border-4 border-black rounded-lg shadow-[8px_8px_0_0_rgba(0,0,0,1)] relative">
          <div className="absolute inset-2 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-sm flex items-center justify-center">
            <img src="/spiderman.png" alt="frame" className="w-full h-full object-cover rounded-sm" />
          </div>
        </div>
        {/* WHOOSH label */}
        <motion.div
          className="absolute -bottom-3 -right-2 bg-[#ef476f] text-white border-3 border-black px-3 py-1 rounded-full font-black text-sm"
          style={{ fontFamily: "'Chewy', cursive" }}
          animate={{ rotate: [20, -20, 20] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          WHOOSH!
        </motion.div>
      </motion.div>

      {/* Center Top - Lightning Bolt Circle with ZAP */}
      <motion.div
        className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-5 md:block hidden"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-24 h-24 bg-[#ffd166] border-4 border-black rounded-full flex items-center justify-center shadow-[6px_6px_0_0_rgba(0,0,0,1)] relative">
          <div className="text-4xl">⚡</div>
        </div>
      </motion.div>

      {/* Right Decoration - Spider-Man Circle with THWIP */}
      <motion.div
        className="absolute top-12 right-8 pointer-events-none z-5 md:block hidden"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-32 h-32 bg-white border-4 border-black rounded-full shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden">
          <img src="/spiderman.png" alt="spider" className="w-full h-full object-cover" />
        </div>
        {/* THWIP speech bubble */}
        <motion.div
          className="absolute -top-2 -right-8 bg-white border-3 border-black px-3 py-1 rounded-lg font-black text-sm"
          style={{ fontFamily: "'Chewy', cursive" }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
        >
          THWIP!
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
            <h1 className="mt-2 text-3xl md:text-4xl font-black text-black uppercase tracking-wider" style={{ fontFamily: "'Chewy', cursive" }}>
              Hero Login
            </h1>
            <div className="mt-2 inline-block">
              <p className="text-black font-black text-xs uppercase tracking-widest bg-[#ffd166] px-4 py-1.5 border-2 border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
                Fancy Dress Store ⚡
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={login} className="space-y-5">
            {/* Email Input */}
            <div className="relative">
              <label className="block text-black font-black uppercase mb-2 text-xs tracking-widest">
                Secret Identity (Email)
              </label>
              <motion.div whileTap={{ scale: 0.99 }}>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="hero@multiverse.com"
                  required
                  className="w-full px-4 py-3 bg-white border-3 border-black rounded-2xl font-bold focus:outline-none focus:border-[#ef476f] transition-all placeholder:text-gray-400"
                />
              </motion.div>
            </div>

            {/* Password Input */}
            <div className="relative">
              <label className="block text-black font-black uppercase mb-2 text-xs tracking-widest">
                Access Code (Password)
              </label>
              <motion.div whileTap={{ scale: 0.99 }} className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-12 bg-white border-3 border-black rounded-2xl font-bold focus:outline-none focus:border-[#ef476f] transition-all placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black bg-white border-2 border-black rounded-full p-1.5 hover:bg-gray-100 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={3} /> : <Eye className="w-4 h-4" strokeWidth={3} />}
                </button>
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#ffd166] text-black border-4 border-black font-black uppercase text-lg rounded-xl shadow-[6px_6px_0_0_rgba(0,0,0,1)] hover:bg-[#ffeb99] disabled:opacity-50 transition-colors mt-6 flex items-center justify-center gap-2"
              whileHover={!loading ? { y: -2, x: -2, boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" } : {}}
              whileTap={!loading ? { y: 4, x: 4, boxShadow: "0px 0px 0px 0px rgba(0,0,0,1)" } : {}}
              style={{
                fontFamily: "'Chewy', cursive",
              }}
            >
              {loading ? "Logging In..." : "SUIT UP! ⚫"}
            </motion.button>

            {/* Dashed Divider */}
            <div className="my-4 border-t-2 border-dashed border-black opacity-40"></div>

            {/* Register Link */}
            <div className="text-center text-sm">
              <span className="text-black font-bold">Need a costume? </span>
              <a href="/register" className="text-blue-600 font-black hover:underline">
                REGISTER HERE
              </a>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;