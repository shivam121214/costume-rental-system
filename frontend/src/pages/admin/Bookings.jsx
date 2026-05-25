import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Phone, Package, CalendarDays } from "lucide-react";
import {
  openWhatsAppDeepLink,
  generatePickupConfirmedMessage,
  generateReturnConfirmedMessage,
} from "../../services/whatsappService";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [whatsappModal, setWhatsappModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    // Load from localStorage if available
    const cachedBookings = localStorage.getItem('adminBookings');
    
    if (cachedBookings) {
      setBookings(JSON.parse(cachedBookings));
      setLoading(false);
    } else {
      getBookings();
    }
  }, []);

  const getBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://costume-rental-system.onrender.com/api/bookings",
      );
      setBookings(res.data);
      // Cache bookings to localStorage
      localStorage.setItem('adminBookings', JSON.stringify(res.data));
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: { message: "✅ Bookings refreshed!", type: 'success' }
      }));
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    if (status === "picked") {
      const received = prompt("Enter total amount received (Rent + Deposit):");

      if (!received) return;

      await axios.post(
        `https://costume-rental-system.onrender.com/api/bookings/${id}/status`,
        {
          status,
        },
      );

      // Find booking and show WhatsApp modal
      const booking = bookings.find(b => b.id === id);
      if (booking) {
        const message = generatePickupConfirmedMessage({
          customer_name: booking.customer_name,
          product_name: booking.product?.name || "Costume Item",
          variant: booking.variant,
          quantity: booking.quantity,
          start_date: booking.start_date,
          end_date: booking.end_date,
        });

        setWhatsappModal({
          phone: booking.phone,
          message: message,
          customerName: booking.customer_name,
          action: "pickup"
        });
      }

      getBookings();
    } else {
      await axios.post(
        `https://costume-rental-system.onrender.com/api/bookings/${id}/status`,
        {
          status,
        },
      );

      getBookings();
    }
  };

  const markReturn = async (id) => {
    const confirmReturn = confirm(
      "Refund security deposit and close this booking?",
    );

    if (!confirmReturn) return;

    await axios.post(
      `https://costume-rental-system.onrender.com/api/bookings/${id}/return`,
    );

    // Find booking and show WhatsApp modal
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      const message = generateReturnConfirmedMessage({
        customer_name: booking.customer_name,
        product_name: booking.product?.name || "Costume Item",
        variant: booking.variant,
        quantity: booking.quantity,
      });

      setWhatsappModal({
        phone: booking.phone,
        message: message,
        customerName: booking.customer_name,
        action: "return"
      });
    }

    getBookings();
  };

  const badge = (status) => {
    const styles = {
      reserved: "bg-[#bde0fe] text-black",
      picked: "bg-[#ffd166] text-black",
      late: "bg-[#ef476f] text-black",
      returned: "bg-[#06d6a0] text-black",
      "no-show": "bg-[#ff5c8d] text-white",
    };
    return styles[status] || "bg-white text-black";
  };

  const getDisplayStatus = (item) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const end = new Date(item.end_date).setHours(0, 0, 0, 0);

    if (
      item.status !== "returned" &&
      item.status !== "no-show" &&
      end < today
    ) {
      return "late";
    }

    return item.status;
  };

  return (
    <div className="min-h-screen pt-20 pb-20" style={{ backgroundColor: '#fdf8e6' }}>
      {/* Decorative background blurs */}
      <div className="fixed top-20 left-20 w-96 h-96 rounded-full blur-3xl pointer-events-none -z-10" style={{ backgroundColor: 'rgba(255, 209, 102, 0.3)' }} />
      <div className="fixed bottom-20 right-20 w-96 h-96 rounded-full blur-3xl pointer-events-none -z-10" style={{ backgroundColor: 'rgba(239, 71, 111, 0.2)' }} />

      <main className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-5xl font-black text-black" style={{ fontFamily: "'Chewy', cursive", textShadow: '2px 2px 0px rgba(0,0,0,0.3)' }}>
            Bookings
          </h1>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-black" strokeWidth={3} />
              <input 
                placeholder="Search by name, item..." 
                className="pl-10 pr-4 py-3 bg-white border-2 border-black rounded-2xl focus:outline-none w-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold text-black"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-48 px-4 py-3 bg-white border-2 border-black rounded-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold text-black focus:outline-none"
            >
              <option value="newest">Newest to oldest</option>
              <option value="oldest">Oldest to newest</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="bg-white border-4 border-black rounded-3xl p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <img src="/ghost.gif" alt="Loading" className="w-32 h-32 mb-4 mx-auto" />
            <p className="text-2xl font-black text-black" style={{ fontFamily: "'Chewy', cursive" }}>Loading Bookings...</p>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings
            .filter(b => 
              b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              b.product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              b.phone.includes(searchQuery)
            )
            .sort((a, b) => {
              const dateA = new Date(a.created_at || 0).getTime();
              const dateB = new Date(b.created_at || 0).getTime();
              return sortBy === "newest" ? dateB - dateA : dateA - dateB;
            })
            .map((item) => (
              <div key={item.id} className="bg-white border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col h-full">
                
                {/* Header: Customer Name and Status Badge */}
                <div className="flex justify-between items-start mb-4 gap-2">
                  <h3 className="font-black text-2xl text-black">
                    {item.customer_name}
                  </h3>
                  <span className={`px-4 py-2 text-xs font-black rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap ${badge(getDisplayStatus(item))}`}>
                    {getDisplayStatus(item).toUpperCase()}
                  </span>
                </div>

                {/* Details Section */}
                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center gap-3 bg-[#bde0fe] p-3 border-2 border-black rounded-2xl">
                    <div className="w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center shrink-0">
                      <Phone size={14} className="text-black" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-black font-bold">{item.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-[#ffd166] p-3 border-2 border-black rounded-2xl">
                    <div className="w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center shrink-0">
                      <Package size={14} className="text-black" strokeWidth={3} />
                    </div>
                    <div className="text-sm text-black flex flex-col">
                      <span className="font-bold">{item.product?.name || "Deleted Product"}</span>
                      <span className="text-xs font-bold">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-[#06d6a0] p-3 border-2 border-black rounded-2xl">
                    <div className="w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center shrink-0">
                      <CalendarDays size={14} className="text-black" strokeWidth={3} />
                    </div>
                    <div className="text-xs text-black flex flex-col font-bold">
                      <span>{item.start_date} →</span>
                      <span>{item.end_date}</span>
                    </div>
                  </div>
                </div>

                {/* Actions (Buttons) */}
                <div className="grid grid-cols-3 gap-2 pt-4 mt-auto">
                  <button 
                    onClick={() => updateStatus(item.id, "picked")}
                    className="px-3 py-2 bg-[#ffd166] hover:bg-yellow-400 text-black font-black text-sm border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    Picked
                  </button>
                  <button 
                    onClick={() => markReturn(item.id)}
                    className="px-3 py-2 bg-[#06d6a0] hover:bg-teal-400 text-black font-black text-sm border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    Returned
                  </button>
                  <button 
                    onClick={() => updateStatus(item.id, "no-show")}
                    className="px-3 py-2 bg-[#ff5c8d] hover:bg-pink-400 text-black font-black text-sm border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    No-show
                  </button>
                </div>
                
              </div>
            ))}
            {/* Empty State */}
            {bookings.filter(b => 
              b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              b.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              b.phone.includes(searchQuery)
            ).length === 0 && (
              <div className="col-span-full py-20 text-center bg-white border-4 border-dashed border-black rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-3xl font-black text-black" style={{ fontFamily: "'Chewy', cursive" }}>No bookings found!</p>
                <p className="text-black font-bold mt-2">Try searching for something else.</p>
              </div>
            )}
            </div>
          </div>
        )}
      </main>

      {/* WhatsApp Message Modal */}
      {whatsappModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-lg w-full max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b-4 border-black" style={{ backgroundColor: whatsappModal.action === "pickup" ? '#ffd166' : '#06d6a0' }}>
              <h2 className="text-2xl font-black text-black" style={{ fontFamily: "'Chewy', cursive" }}>
                {whatsappModal.action === "pickup" ? "🎉 Pickup Notification" : "✅ Return Confirmation"}
              </h2>
              <p className="text-sm font-bold text-black mt-2">To: {whatsappModal.customerName}</p>
            </div>

            {/* Message Preview */}
            <div className="p-6">
              <p className="font-black text-black mb-3">Message to send:</p>
              <div className="bg-[#fdf8e6] border-3 border-black rounded-2xl p-4 mb-6 text-sm whitespace-pre-wrap font-mono text-black max-h-48 overflow-y-auto shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {whatsappModal.message}
              </div>

              {/* Info Box */}
              <div className="bg-[#bde0fe] border-3 border-black rounded-2xl p-4 mb-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-black font-bold text-sm">💡 Tip: Click "Open WhatsApp" to send the notification!</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setWhatsappModal(null)}
                  className="flex-1 px-4 py-3 border-3 border-black text-black rounded-2xl font-black hover:bg-[#fdf8e6]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    openWhatsAppDeepLink(whatsappModal.phone, whatsappModal.message);
                    setWhatsappModal(null);
                  }}
                  className="flex-1 px-4 py-3 text-black rounded-2xl font-black border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  style={{ backgroundColor: whatsappModal.action === "pickup" ? '#ffd166' : '#06d6a0' }}
                >
                  📱 Open WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookings;
