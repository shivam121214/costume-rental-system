import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Search, ShoppingCart, User } from 'lucide-react';
import { motion } from 'motion/react';

function Navbar() {
  const navigate = useNavigate();
  const admin = localStorage.getItem("admin");
  const [pendingCount, setPendingCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const API_URL = "https://costume-rental-system.onrender.com";

  const getCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
  };

  const logout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  useEffect(() => {
    if (admin) {
      getPendingRequests();

      const interval = setInterval(() => {
        getPendingRequests();
      }, 5000);

      return () => clearInterval(interval);
    }

    getCartCount();

    const interval = setInterval(() => {
      getCartCount();
    }, 5000);

    return () => clearInterval(interval);
  }, [admin]);

  const getPendingRequests = async () => {
    const res = await axios.get(`${API_URL}/api/requests?status=pending`);

    const pending = res.data.data.length;

    setPendingCount(pending);
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: 'spring', bounce: 0.5 }}
      className="fixed top-0 w-full z-50 bg-[#fdf8e6] border-b-[3px] border-black shadow-[0_4px_0_0_rgba(0,0,0,1)]"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center group transform hover:scale-105 transition-transform">
              <span className="text-3xl font-['Chewy'] font-bold text-[#ff5c8d] drop-shadow-[2px_2px_0_rgba(0,0,0,1)] tracking-wide">
                Party Palooza!
              </span>
            </Link>

            <nav className="hidden md:flex gap-8">
              {['Costumes', 'Accessories', 'Themes'].map((item) => (
                <a 
                  key={item} 
                  href="#" 
                  className="text-lg font-bold text-black hover:text-[#ff5c8d] transition-colors relative group py-2"
                >
                  {item}
                  <span className="absolute bottom-1 left-0 w-0 h-1 bg-[#ff5c8d] transition-all duration-300 group-hover:w-full rounded-full"></span>
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/products" className="hover:scale-110 transition-transform bg-[#ffd166] p-2 rounded-full border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              <Search className="w-5 h-5 text-black stroke-[3]" />
            </Link>
            <Link to="/cart" className="hover:scale-110 transition-transform bg-[#06d6a0] p-2 rounded-full border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] relative">
              <ShoppingCart className="w-5 h-5 text-black stroke-[3]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#ef476f] text-white text-xs font-bold rounded-full border-2 border-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {admin && (
              <Link to="/admin" className="hover:scale-110 transition-transform bg-[#a8dadc] p-2 rounded-full border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
                <User className="w-5 h-5 text-black stroke-[3]" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default Navbar;
