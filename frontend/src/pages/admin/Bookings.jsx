import { useEffect, useState } from "react";
import axios from "axios";
import {
  openWhatsAppDeepLink,
  generatePickupConfirmedMessage,
  generateReturnConfirmedMessage,
} from "../../services/whatsappService";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [whatsappModal, setWhatsappModal] = useState(null);

  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = async () => {
    const res = await axios.get(
      "https://costume-rental-system.onrender.com/api/bookings",
    );
    setBookings(res.data);
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
      reserved: "bg-blue-100 text-blue-700",
      picked: "bg-yellow-100 text-yellow-700",
      late: "bg-red-100 text-red-700",
      returned: "bg-green-100 text-green-700",
      "no-show": "bg-slate-200 text-slate-700",
    };

    return styles[status] || "bg-slate-100 text-slate-700";
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
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Bookings</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {bookings.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-md p-5">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold">{item.customer_name}</h3>

              <span
                className={`px-3 py-1 rounded-full text-sm ${badge(getDisplayStatus(item))}`}
              >
                {getDisplayStatus(item).toUpperCase()}
              </span>
            </div>

            <p className="text-slate-500 mt-1">
              {item.product?.name || "Deleted Product"}
            </p>
            <p className="mt-2">Qty: {item.quantity}</p>
            <p>
              {item.start_date} → {item.end_date}
            </p>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={() => updateStatus(item.id, "picked")}
                className="bg-yellow-500 text-white py-2 rounded-lg"
              >
                Picked
              </button>

              <button
                onClick={() => updateStatus(item.id, "no-show")}
                className="bg-slate-700 text-white py-2 rounded-lg"
              >
                No-show
              </button>

              <button
                onClick={() => markReturn(item.id)}
                className="bg-green-600 text-white py-2 rounded-lg"
              >
                Returned
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* WhatsApp Message Modal */}
      {whatsappModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-screen overflow-y-auto">
            {/* Header */}
            <div className={`p-6 ${whatsappModal.action === "pickup" ? "bg-yellow-50 border-b-2 border-yellow-200" : "bg-green-50 border-b-2 border-green-200"}`}>
              <h2 className={`text-xl font-bold ${whatsappModal.action === "pickup" ? "text-yellow-700" : "text-green-700"}`}>
                {whatsappModal.action === "pickup" ? "🎉 Pickup Notification" : "✅ Return Confirmation"}
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
                  <strong>💡 Tip:</strong> Click "Open WhatsApp" to send the notification to the customer.
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
                  className={`flex-1 px-4 py-2 text-white rounded-lg font-semibold ${
                    whatsappModal.action === "pickup"
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
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
