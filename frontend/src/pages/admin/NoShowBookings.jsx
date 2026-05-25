import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Phone, Package, CalendarDays } from "lucide-react";
import { motion } from "motion/react";

function NoShowBookings() {
  const navigate = useNavigate();
  const [noShowBookings, setNoShowBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getNoShowBookings();
  }, []);

  const getNoShowBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://costume-rental-system.onrender.com/api/bookings"
      );
      
      // Filter for only "reserved" status bookings where pickup date has passed
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const filteredBookings = res.data.filter((booking) => {
        const pickupDate = new Date(booking.start_date);
        pickupDate.setHours(0, 0, 0, 0);
        return booking.status === "reserved" && pickupDate < today;
      });
      
      setNoShowBookings(filteredBookings);
    } catch (error) {
      console.error("Error fetching no-show bookings:", error);
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: { message: "❌ Error loading no-show bookings", type: 'error' }
      }));
    } finally {
      setLoading(false);
    }
  };

  const markAsPickedNow = async (id) => {
    setProcessingId(id);
    try {
      await axios.post(
        `https://costume-rental-system.onrender.com/api/bookings/${id}/status`,
        { status: "picked" }
      );
      // Remove from list
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
      // Remove from list
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

  const filteredBookings = noShowBookings.filter(b =>
    b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.phone.includes(searchQuery)
  );

  return (
    <div className="min-h-screen pt-20 pb-20" style={{ backgroundColor: '#fdf8e6' }}>
      {/* Decorative background blurs */}
      <div className="fixed top-20 left-20 w-96 h-96 rounded-full blur-3xl pointer-events-none -z-10" style={{ backgroundColor: 'rgba(255, 209, 102, 0.3)' }} />
      <div className="fixed bottom-20 right-20 w-96 h-96 rounded-full blur-3xl pointer-events-none -z-10" style={{ backgroundColor: 'rgba(239, 71, 111, 0.2)' }} />

      <main className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-10 h-10 text-[#ff5c8d]" strokeWidth={2.5} />
            <h1 className="text-5xl font-black text-black" style={{ fontFamily: "'Chewy', cursive", textShadow: '2px 2px 0px rgba(0,0,0,0.3)' }}>
              No-Show Bookings
            </h1>
          </div>
          
          <button
            onClick={() => navigate("/admin")}
            className="px-6 py-3 bg-white text-black font-black rounded-xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            ← Back to Dashboard
          </button>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <input
            placeholder="Search by name, phone, or product..."
            className="w-full px-6 py-3 bg-white border-3 border-black rounded-2xl focus:outline-none font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </motion.div>

        {/* Content */}
        {loading ? (
          <motion.div
            className="bg-white border-4 border-black rounded-3xl p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <img src="/ghost.gif" alt="Loading" className="w-32 h-32 mb-4 mx-auto" />
            <p className="text-2xl font-black text-black" style={{ fontFamily: "'Chewy', cursive" }}>
              Loading No-Show Bookings...
            </p>
          </motion.div>
        ) : noShowBookings.length === 0 ? (
          <motion.div
            className="text-center bg-white border-4 border-dashed border-black rounded-3xl p-16 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-6xl mb-4">🎉</p>
            <p className="text-4xl font-black text-black mb-3" style={{ fontFamily: "'Chewy', cursive" }}>
              No No-Shows!
            </p>
            <p className="text-black font-bold text-lg">All customers are showing up on time. Great job! 👏</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.05 }}
          >
            {filteredBookings.map((booking) => (
              <motion.div
                key={booking.id}
                className="bg-white border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col h-full"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Customer Info */}
                <div className="mb-4 pb-4 border-b-2 border-black/10">
                  <h3 className="text-xl font-black text-black mb-2">
                    {booking.customer_name}
                  </h3>
                  <div className="flex items-center gap-3 bg-[#bde0fe] p-3 border-2 border-black rounded-2xl">
                    <div className="w-6 h-6 bg-white border-2 border-black rounded-full flex items-center justify-center">
                      <Phone size={12} className="text-black" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-black font-bold">{booking.phone}</span>
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-3 mb-5 pb-5 border-b-2 border-black/10">
                  <div className="font-black text-black uppercase text-sm">Products Booked</div>
                  <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <p className="font-black text-black mb-3">{booking.product?.name || "Deleted Product"}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="px-3 py-2 rounded-xl font-black text-xs border-2 border-black" style={{ backgroundColor: '#bde0fe' }}>
                        Qty: <span className="text-sm">{booking.quantity}</span>
                      </div>
                      <div className="px-3 py-2 rounded-xl font-black text-xs border-2 border-black" style={{ backgroundColor: '#06d6a0' }}>
                        Stock: <span className="text-sm">{booking.available_quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-2 mb-5 pb-5 border-b-2 border-black/10">
                  <div className="px-4 py-3 rounded-2xl font-bold border-2 border-black flex justify-between text-sm" style={{ backgroundColor: '#ffd166' }}>
                    <span>Scheduled:</span>
                    <span className="font-black">{booking.start_date}</span>
                  </div>
                  <div className="px-4 py-3 rounded-2xl font-bold border-2 border-black flex justify-between text-sm" style={{ backgroundColor: '#ef476f' }}>
                    <span>End Date:</span>
                    <span className="font-black">{booking.end_date}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => markAsPickedNow(booking.id)}
                    disabled={processingId === booking.id}
                    className="flex-1 px-3 py-3 bg-[#06d6a0] text-black font-black border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 text-sm"
                  >
                    {processingId === booking.id ? "..." : "✅ Picked Now"}
                  </button>
                  <button
                    onClick={() => deleteNoShowBooking(booking.id)}
                    disabled={processingId === booking.id}
                    className="flex-1 px-3 py-3 bg-[#ef476f] text-white font-black border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 text-sm"
                  >
                    {processingId === booking.id ? "..." : "❌ Delete"}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No Results Message */}
        {!loading && filteredBookings.length === 0 && noShowBookings.length > 0 && (
          <motion.div
            className="text-center bg-white border-4 border-dashed border-black rounded-3xl p-12 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-3xl font-black text-black mb-2" style={{ fontFamily: "'Chewy', cursive" }}>
              No Results Found!
            </p>
            <p className="text-black font-bold">Try searching with different keywords.</p>
          </motion.div>
        )}
      </main>
    </div>
  );
}

export default NoShowBookings;
