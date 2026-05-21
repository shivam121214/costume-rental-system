import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/customer/Home";
import Products from "./pages/customer/Products";
import ProductDetails from "./pages/customer/ProductDetails";
import Themes from "./pages/customer/Themes";
import TermsAndConditions from "./pages/customer/TermsAndConditions";

import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProductsAdmin from "./pages/admin/Products";
import Requests from "./pages/admin/Requests";
import Bookings from "./pages/admin/Bookings";
import DirectOrder from "./pages/admin/DirectOrder";

import Navbar from "./components/Navbar";
import Notification from "./components/Notification";
import ProtectedRoute from "./components/ProtectedRoute";
import TodaysPickups from "./pages/admin/TodaysPickups";
import TodaysReturns from "./pages/admin/TodaysReturns";
import ActiveRentals from "./pages/admin/ActiveRentals";
import LateReturns from "./pages/admin/LateReturns";
import Cart from "./pages/customer/Cart";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Notification />

      <div className="pt-24">
        <Routes>
        {/* Customer */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/themes" element={<Themes />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <ProductsAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/requests"
          element={
            <ProtectedRoute>
              <Requests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/direct-order"
          element={
            <ProtectedRoute>
              <DirectOrder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/todays-pickups"
          element={
            <ProtectedRoute>
              <TodaysPickups />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/todays-returns"
          element={
            <ProtectedRoute>
              <TodaysReturns />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/active-rentals"
          element={
            <ProtectedRoute>
              <ActiveRentals />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/late-returns"
          element={
            <ProtectedRoute>
              <LateReturns />
            </ProtectedRoute>
          }
        />
        
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;