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
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Active Rentals</h1>

        {bookings.length === 0 ? (
          <p className="text-slate-500">No active rentals</p>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Variant</th>
                  <th className="p-4">Qty</th>
                  <th className="p-4">Return Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr
                    key={b.id}
                    className={`border-t ${
                      new Date(b.end_date).setHours(0,0,0,0) < new Date().setHours(0,0,0,0) &&
                      b.status !== "returned"
                        ? "bg-red-50"
                        : ""
                    }`}
                  >
                    <td className="p-4">{b.customer_name}</td>
                    <td className="p-4">{b.phone}</td>
                    <td className="p-4">{b.product?.name}</td>
                    <td className="p-4">{b.variant}</td>
                    <td className="p-4">{b.quantity}</td>
                    <td className="p-4">{b.end_date}</td>
                    <td className="p-4 capitalize">{b.status}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleReturn(b.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
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
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-screen overflow-y-auto">
            {/* Header */}
            <div className="bg-green-50 border-b-2 border-green-200 p-6">
              <h2 className="text-xl font-bold text-green-700">
                ✅ Return Confirmation
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                To: {whatsappModal.customerName}
              </p>
            </div>

            {/* Message Preview */}
            <div className="p-6">
              <p className="text-slate-700 font-semibold mb-3">Message to send:</p>
              <div className="bg-slate-50 border rounded-lg p-4 mb-6 text-sm whitespace-pre-wrap font-mono text-slate-700 max-h-64 overflow-y-auto">
                {whatsappModal.message}
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm">
                <p className="text-blue-900">
                  <strong>💡 Tip:</strong> Click "Open WhatsApp" to send the confirmation to the customer.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setWhatsappModal(null)}
                  className="flex-1 px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    openWhatsAppDeepLink(whatsappModal.phone, whatsappModal.message);
                    setWhatsappModal(null);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
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
