import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const admin = localStorage.getItem("admin");

  const link = "text-white hover:text-yellow-300 transition";

  const logout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <nav className="bg-slate-900 shadow-md px-6 py-4 flex flex-wrap gap-5 items-center">
      <h1 className="text-xl font-bold text-yellow-400 mr-6">
        Costume Rental
      </h1>

      {/* Public Links */}
      <Link to="/" className={link}>Home</Link>
      <Link to="/products" className={link}>Products</Link>

      <div className="ml-auto flex gap-4 items-center">
        {!admin ? (
          <Link to="/admin/login" className={link}>
            Admin Login
          </Link>
        ) : (
          <>
            <Link to="/admin" className={link}>Dashboard</Link>
            <Link to="/admin/products" className={link}>Add Products</Link>
            <Link to="/admin/requests" className={link}>Requests</Link>
            <Link to="/admin/bookings" className={link}>Bookings</Link>
            <Link to="/admin/direct-order" className={link}>Direct Order</Link>

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