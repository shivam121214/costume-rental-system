import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const admin = localStorage.getItem("admin");
  const [pendingCount, setPendingCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const API_URL = "https://costume-rental-system.onrender.com";

  const link = "text-white hover:text-yellow-300 transition";

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
    <nav className="bg-slate-900 shadow-md px-6 py-4 flex flex-wrap gap-5 items-center">
      <h1 className="text-xl font-bold text-yellow-400 mr-6">Costume Rental</h1>

      {/* Public Links */}
      <Link to="/" className={link}>
        Home
      </Link>
      <Link to="/products" className={link}>
        Products
      </Link>

      {!admin && (
        <Link to="/cart" className={link}>
          Cart
          {cartCount > 0 && (
            <span className="ml-2 bg-yellow-400 text-black text-xs px-2 py-1 rounded-full">
              {cartCount}
            </span>
          )}
        </Link>
      )}

      <div className="ml-auto flex gap-4 items-center">
        {!admin ? (
          <Link to="/admin/login" className={link}>
            Admin Login
          </Link>
        ) : (
          <>
            <Link to="/admin" className={link}>
              Dashboard
            </Link>
            <Link to="/admin/products" className={link}>
              Add Products
            </Link>
            <Link to="/admin/requests" className={link}>
              Requests
              {pendingCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {pendingCount}
                </span>
              )}
            </Link>
            <Link to="/admin/bookings" className={link}>
              Bookings
            </Link>
            <Link to="/admin/direct-order" className={link}>
              Direct Order
            </Link>

            <button
              onClick={logout}
              className="bg-red-500 px-4 py-2 rounded-lg text-white"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
