import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  CalendarDays,
  AlertTriangle,
  Shirt,
  ClipboardList,
  Tags,
  Star,
} from "lucide-react";
import { motion } from "motion/react";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_products: 0,
    pending_requests: 0,
    total_bookings: 0,
    active_rentals: 0,
    late_returns: 0,
    todays_pickups: 0,
    todays_returns: 0,
    total_revenue: 0,
    paid_amount: 0,
    pending_amount: 0,
    partial_count: 0,
  });
  const [noShowBookings, setNoShowBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    // Load from localStorage if available
    const cachedStats = localStorage.getItem('dashboardStats');
    
    if (cachedStats) {
      setStats(JSON.parse(cachedStats));
      setLoading(false);
    } else {
      getStats();
    }
    
    // Fetch no-show bookings
    getNoShowBookings();
  }, []);

  const getStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://costume-rental-system.onrender.com/api/dashboard"
      );
      setStats(res.data);
      // Cache stats to localStorage
      localStorage.setItem('dashboardStats', JSON.stringify(res.data));
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: { message: "✅ Dashboard refreshed!", type: 'success' }
      }));
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const getNoShowBookings = async () => {
    try {
      const res = await axios.get(
        "https://costume-rental-system.onrender.com/api/bookings?status=no-show"
      );
      setNoShowBookings(res.data);
    } catch (error) {
      console.error("Error fetching no-show bookings:", error);
    }
  };

  const markAsPickedNow = async (id) => {
    setProcessingId(id);
    try {
      await axios.post(
        `https://costume-rental-system.onrender.com/api/bookings/${id}/status`,
        { status: "picked" }
      );
      // Remove from no-show list
      setNoShowBookings((prev) => prev.filter((b) => b.id !== id));
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: { message: "✅ Booking marked as picked!", type: 'success' }
      }));
    } catch (error) {
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: { message: `❌ ${error.response?.data?.message || "Error marking as picked."}`, type: 'error' }
      }));
    } finally {
      setProcessingId(null);
    }
  };

  const deleteNoShowBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this no-show booking? This action cannot be undone.")) {
      return;
    }
    setProcessingId(id);
    try {
      await axios.delete(
        `https://costume-rental-system.onrender.com/api/bookings/${id}`
      );
      // Remove from no-show list
      setNoShowBookings((prev) => prev.filter((b) => b.id !== id));
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: { message: "✅ No-show booking deleted!", type: 'success' }
      }));
    } catch (error) {
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: { message: `❌ ${error.response?.data?.message || "Error deleting booking."}`, type: 'error' }
      }));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf8e6] font-sans text-black selection:bg-pink-300 selection:text-black pt-20">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <motion.div
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1
              className="text-4xl md:text-5xl font-black tracking-wide text-black drop-shadow-[3px_3px_0px_#ffd166]"
              style={{ fontFamily: "'Chewy', cursive" }}
            >
              Dashboard
            </h1>
            <p className="font-bold mt-2 text-lg">Welcome back, Boss!</p>
          </div>
          <button
            onClick={getStats}
            disabled={loading}
            className="px-6 py-3 bg-[#06d6a0] text-black font-black rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "🔄 Refreshing..." : "🔄 Refresh"}
          </button>
        </motion.div>

        <DashboardContent stats={stats} navigate={navigate} noShowBookings={noShowBookings} markAsPickedNow={markAsPickedNow} deleteNoShowBooking={deleteNoShowBooking} processingId={processingId} />
      </main>
    </div>
  );
}

function DashboardContent({ stats, navigate, noShowBookings, markAsPickedNow, deleteNoShowBooking, processingId }) {
  return (
    <div className="space-y-16">
      {/* Priority Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-3 bg-[#ef476f] rounded-sm border-2 border-black"></div>
          <h2
            className="text-3xl font-black text-black"
            style={{ fontFamily: "'Chewy', cursive" }}
          >
            Priority Alerts!
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Pending Requests"
            value={stats.pending_requests}
            icon={<Clock className="w-8 h-8 text-black" strokeWidth={2.5} />}
            badgeColor="bg-[#ef476f]"
            badgeTextColor="text-white"
            onClick={() => navigate("/admin/requests")}
          />
          <MetricCard
            title="Today's Pickups"
            value={stats.todays_pickups}
            icon={
              <CalendarDays className="w-8 h-8 text-black" strokeWidth={2.5} />
            }
            badgeColor="bg-[#06d6a0]"
            badgeTextColor="text-black"
            onClick={() => navigate("/admin/todays-pickups")}
          />
          <MetricCard
            title="Today's Returns"
            value={stats.todays_returns}
            icon={
              <CalendarDays className="w-8 h-8 text-black" strokeWidth={2.5} />
            }
            badgeColor="bg-[#a259ff]"
            badgeTextColor="text-white"
            onClick={() => navigate("/admin/todays-returns")}
          />
          <MetricCard
            title="Late Returns"
            value={stats.late_returns}
            icon={
              <AlertTriangle className="w-8 h-8 text-black" strokeWidth={2.5} />
            }
            badgeColor="bg-[#ffd166]"
            badgeTextColor="text-black"
            onClick={() => navigate("/admin/late-returns")}
          />
        </div>
      </motion.section>

      {/* No-Show Bookings Section */}
      {noShowBookings.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[#ff5c8d] border-4 border-black rounded-3xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-8 h-8 text-white" strokeWidth={3} />
            <h2
              className="text-3xl font-black text-white"
              style={{ fontFamily: "'Chewy', cursive" }}
            >
              ⚠️ No-Show Bookings ({noShowBookings.length})
            </h2>
          </div>
          <p className="text-white font-bold mb-6">Customers who didn't pick up on their scheduled date:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {noShowBookings.map((booking) => (
              <div key={booking.id} className="bg-white border-3 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-black text-black">{booking.customer_name}</h3>
                    <p className="text-sm font-bold text-black/70">📞 {booking.phone}</p>
                  </div>
                </div>
                
                <div className="bg-[#fdf8e6] border-2 border-black rounded-xl p-3 mb-3 text-sm">
                  <p className="font-bold text-black">📦 {booking.product?.name || "Deleted Product"}</p>
                  <p className="text-xs text-black/70 font-bold">Qty: {booking.quantity} | Scheduled: {booking.start_date}</p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => markAsPickedNow(booking.id)}
                    disabled={processingId === booking.id}
                    className="flex-1 px-3 py-2 bg-[#06d6a0] text-black font-black text-sm border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                  >
                    {processingId === booking.id ? "..." : "✅ Picked Now"}
                  </button>
                  <button
                    onClick={() => deleteNoShowBooking(booking.id)}
                    disabled={processingId === booking.id}
                    className="flex-1 px-3 py-2 bg-[#ef476f] text-white font-black text-sm border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                  >
                    {processingId === booking.id ? "..." : "❌ Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Status Section */}
      <motion.section
        className="bg-[#fdf8e6] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 border-y-[3px] border-black"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <h2
              className="text-3xl font-black text-black bg-white px-4 py-1 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block transform -rotate-2"
              style={{ fontFamily: "'Chewy', cursive" }}
            >
              Current Status
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricCard
              title="Active Rentals"
              value={stats.active_rentals}
              icon={<Shirt className="w-8 h-8 text-black" strokeWidth={2.5} />}
              badgeColor="bg-[#b1e868]"
              badgeTextColor="text-black"
              onClick={() => navigate("/admin/active-rentals")}
            />
            <MetricCard
              title="Total Bookings"
              value={stats.total_bookings}
              icon={
                <ClipboardList className="w-8 h-8 text-black" strokeWidth={2.5} />
              }
              badgeColor="bg-[#e86868]"
              badgeTextColor="text-black"
            />
          </div>
        </div>
      </motion.section>

      {/* Business Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Star className="w-8 h-8 fill-[#ffd166] text-black stroke-2" />
          <h2
            className="text-3xl font-black text-black"
            style={{ fontFamily: "'Chewy', cursive" }}
          >
            Business Overview
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Total Products"
            value={stats.total_products}
            icon={<Tags className="w-8 h-8 text-black" strokeWidth={2.5} />}
            badgeColor="bg-[#06d6a0]"
            badgeTextColor="text-black"
            onClick={() => navigate("/admin/products")}
          />
        </div>
      </motion.section>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  badgeColor,
  badgeTextColor,
  onClick,
}) {
  const shadowColors = ["bg-[#ef476f]", "bg-[#ffd166]", "bg-[#4dd0e1]"];
  const [shadowColor] = useState(
    () => shadowColors[Math.floor(Math.random() * shadowColors.length)]
  );

  return (
    <motion.div
      className="group relative cursor-pointer"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Colored Shadow background for 3D effect */}
      <div
        className={`absolute inset-0 ${shadowColor} border-[3px] border-black rounded-2xl transform translate-x-2 translate-y-2 transition-transform group-hover:translate-x-3 group-hover:translate-y-3`}
      ></div>

      {/* Main Card Content */}
      <div className="relative h-full bg-white border-[3px] border-black rounded-2xl p-6 transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1 flex flex-col justify-between z-10">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-bold leading-tight text-black max-w-[60%]">
            {title}
          </h3>
          <div className="p-2 bg-[#f3f4f6] rounded-xl border-2 border-black">
            {icon}
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div
            className={`px-4 py-1.5 rounded-full border-[3px] border-black font-black text-2xl ${badgeColor} ${badgeTextColor}`}
          >
            {value}
          </div>
          {/* Decorative dots */}
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-black"></div>
            <div className="w-2 h-2 rounded-full bg-black"></div>
            <div className="w-2 h-2 rounded-full bg-black"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;
