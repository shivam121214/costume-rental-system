import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/customer/Home";
import Products from "./pages/customer/Products";
import ProductDetails from "./pages/customer/ProductDetails";

import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProductsAdmin from "./pages/admin/Products";
import Requests from "./pages/admin/Requests";
import Bookings from "./pages/admin/Bookings";
import DirectOrder from "./pages/admin/DirectOrder";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import TodaysReturns from "./pages/admin/TodaysReturns";
import ActiveRentals from "./pages/admin/ActiveRentals";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Customer */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;