import { useEffect, useState } from "react";
import axios from "axios";
import {
  openWhatsAppDeepLink,
  generateReturnConfirmedMessage,
} from "../../services/whatsappService";

function ActiveRentals() {
  const [bookings, setBookings] = useState([]);
  const [whatsappModal, setWhatsappModal] = useState(null);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    const res = await axios.get(
      "https://costume-rental-system.onrender.com/api/bookings/active-rentals",
    );
    setBookings(res.data);
  };

  const handleReturn = async (id) => {
    try {
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

      // remove from UI instantly
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      alert("Failed to mark return");
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-20" style={{ backgroundColor: '#fdf8e6' }}>
      {/* Decorative background blurs */}
      <div className="fixed top-20 left-20 w-96 h-96 rounded-full blur-3xl pointer-events-none -z-10" style={{ backgroundColor: 'rgba(177, 232, 104, 0.3)' }} />
      <div className="fixed bottom-20 right-20 w-96 h-96 rounded-full blur-3xl pointer-events-none -z-10" style={{ backgroundColor: 'rgba(6, 214, 160, 0.2)' }} />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <h1 className="text-5xl font-black mb-8 text-black" style={{ fontFamily: "'Chewy', cursive", textShadow: '2px 2px 0px rgba(0,0,0,0.3)' }}>
          Active Rentals
        </h1>

        {bookings.length === 0 ? (
          <div className="bg-white border-4 border-black rounded-3xl p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-2xl font-black text-black" style={{ fontFamily: "'Chewy', cursive" }}>✨ No active rentals</p>
            <p className="text-black font-bold mt-2">All rented out! Great business!</p>
          </div>
        ) : (
          <div className="bg-white border-4 border-black rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr style={{ backgroundColor: '#b1e868' }}>
                  <th className="p-4 font-black text-black border-b-4 border-black">Customer</th>
                  <th className="p-4 font-black text-black border-b-4 border-black">Phone</th>
                  <th className="p-4 font-black text-black border-b-4 border-black">Product</th>
                  <th className="p-4 font-black text-black border-b-4 border-black">Variant</th>
                  <th className="p-4 font-black text-black border-b-4 border-black">Qty</th>
                  <th className="p-4 font-black text-black border-b-4 border-black">Return Date</th>
                  <th className="p-4 font-black text-black border-b-4 border-black">Status</th>
                  <th className="p-4 font-black text-black border-b-4 border-black">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr
                    key={b.id}
                    className={`border-b-2 border-black ${
                      new Date(b.end_date).setHours(0,0,0,0) < new Date().setHours(0,0,0,0) &&
                      b.status !== "returned"
                        ? "bg-red-100"
                        : "hover:bg-lime-50"
                    }`}
                  >
                    <td className="p-4 font-bold text-black">{b.customer_name}</td>
                    <td className="p-4 font-bold text-black">{b.phone}</td>
                    <td className="p-4 font-bold text-black">{b.product?.name}</td>
                    <td className="p-4 font-bold text-black">{b.variant}</td>
                    <td className="p-4 font-bold text-black">{b.quantity}</td>
                    <td className="p-4 font-bold text-black">{b.end_date}</td>
                    <td className="p-4 capitalize font-bold text-black">{b.status}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleReturn(b.id)}
                        className="px-4 py-2 bg-[#06d6a0] text-black font-black border-2 border-black rounded-xl hover:bg-teal-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                      >
                        Mark Returned
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* WhatsApp Message Modal */}
      {whatsappModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-lg w-full max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b-4 border-black" style={{ backgroundColor: '#06d6a0' }}>
              <h2 className="text-2xl font-black text-black" style={{ fontFamily: "'Chewy', cursive" }}>
                ✅ Return Confirmation
              </h2>
              <p className="text-sm font-bold text-black mt-2">
                To: {whatsappModal.customerName}
              </p>
            </div>

            {/* Message Preview */}
            <div className="p-6">
              <p className="font-black text-black mb-3">Message to send:</p>
              <div className="bg-[#fdf8e6] border-3 border-black rounded-2xl p-4 mb-6 text-sm whitespace-pre-wrap font-mono text-black max-h-48 overflow-y-auto shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {whatsappModal.message}
              </div>

              {/* Info Box */}
              <div className="bg-[#bde0fe] border-3 border-black rounded-2xl p-4 mb-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-black font-bold text-sm">💡 Tip: Click "Open WhatsApp" to send the confirmation!</p>
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
                  className="flex-1 px-4 py-3 bg-[#06d6a0] text-black rounded-2xl font-black border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
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

export default ActiveRentals;
