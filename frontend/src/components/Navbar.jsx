import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { motion } from 'motion/react';

function Navbar() {
  const navigate = useNavigate();
  const admin = localStorage.getItem("admin");
  const [pendingCount, setPendingCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const API_URL = "https://costume-rental-system.onrender.com";

  const getCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(cart.length);
  };

  const logout = () => {
    localStorage.removeItem("admin");
    setMenuOpen(false);
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
              <span className="text-3xl font-bold text-[#ff5c8d] drop-shadow-[2px_2px_0_rgba(0,0,0,1)] tracking-wide" style={{
                fontFamily: "'Chewy', cursive",
              }}>
                Aadya Fancy Dresses
              </span>
            </Link>

            <nav className="hidden md:flex gap-8">
              <Link 
                to="/products" 
                className="text-lg font-bold text-black hover:text-[#ff5c8d] transition-colors relative group py-2"
              >
                Costumes
                <span className="absolute bottom-1 left-0 w-0 h-1 bg-[#ff5c8d] transition-all duration-300 group-hover:w-full rounded-full"></span>
              </Link>
              {['Accessories', 'Themes'].map((item) => (
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

          <div className="flex items-center gap-6 relative">
            <Link to="/products" className="hover:scale-110 transition-transform bg-[#ffd166] p-2 rounded-full border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
              <Search className="w-5 h-5 text-black" strokeWidth={3} />
            </Link>
            <Link to="/cart" className="hover:scale-110 transition-transform bg-[#06d6a0] p-2 rounded-full border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] relative">
              <ShoppingCart className="w-5 h-5 text-black" strokeWidth={3} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#ef476f] text-white text-xs font-bold rounded-full border-2 border-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="hover:scale-110 transition-transform bg-[#a8dadc] p-2 rounded-full border-2 border-black shadow-[2px_2px_0_0_rgba(0,0,0,1)] relative"
            >
              {menuOpen ? (
                <X className="w-5 h-5 text-black" strokeWidth={3} />
              ) : (
                <Menu className="w-5 h-5 text-black" strokeWidth={3} />
              )}
              {admin && pendingCount > 0 && (
                <span className="absolute -top-2 -right-2 w-3 h-3 bg-[#ef476f] rounded-full border-2 border-black"></span>
              )}
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-24 right-0 bg-[#fdf8e6] border-2 border-black rounded-lg shadow-[4px_4px_0_0_rgba(0,0,0,1)] py-2 min-w-max"
              >
                {admin ? (
                  <>
                    <Link 
                      to="/admin" 
                      onClick={() => setMenuOpen(false)}
                      className="block px-6 py-2 text-black font-bold hover:bg-[#ffd166] transition-colors border-b border-black"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/admin/products" 
                      onClick={() => setMenuOpen(false)}
                      className="block px-6 py-2 text-black font-bold hover:bg-[#ffd166] transition-colors border-b border-black"
                    >
                      Add Products
                    </Link>
                    <Link 
                      to="/admin/requests" 
                      onClick={() => setMenuOpen(false)}
                      className="block px-6 py-2 text-black font-bold hover:bg-[#ffd166] transition-colors border-b border-black relative"
                    >
                      Requests
                      {pendingCount > 0 && (
                        <span className="ml-2 bg-[#ef476f] text-white text-xs font-bold px-2 py-1 rounded-full inline-block">
                          {pendingCount}
                        </span>
                      )}
                    </Link>
                    <Link 
                      to="/admin/bookings" 
                      onClick={() => setMenuOpen(false)}
                      className="block px-6 py-2 text-black font-bold hover:bg-[#ffd166] transition-colors border-b border-black"
                    >
                      Bookings
                    </Link>
                    <Link 
                      to="/admin/direct-order" 
                      onClick={() => setMenuOpen(false)}
                      className="block px-6 py-2 text-black font-bold hover:bg-[#ffd166] transition-colors border-b border-black"
                    >
                      Direct Order
                    </Link>
                    <Link 
                      to="/admin/todays-returns" 
                      onClick={() => setMenuOpen(false)}
                      className="block px-6 py-2 text-black font-bold hover:bg-[#ffd166] transition-colors border-b border-black"
                    >
                      Today's Returns
                    </Link>
                    <Link 
                      to="/admin/active-rentals" 
                      onClick={() => setMenuOpen(false)}
                      className="block px-6 py-2 text-black font-bold hover:bg-[#ffd166] transition-colors border-b border-black"
                    >
                      Active Rentals
                    </Link>
                    <Link 
                      to="/admin/late-returns" 
                      onClick={() => setMenuOpen(false)}
                      className="block px-6 py-2 text-black font-bold hover:bg-[#ffd166] transition-colors border-b border-black"
                    >
                      Late Returns
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-6 py-2 text-black font-bold hover:bg-[#ef476f] hover:text-white transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/admin/login" 
                    onClick={() => setMenuOpen(false)}
                    className="block px-6 py-2 text-black font-bold hover:bg-[#ffd166] transition-colors"
                  >
                    Admin Login
                  </Link>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default Navbar;
