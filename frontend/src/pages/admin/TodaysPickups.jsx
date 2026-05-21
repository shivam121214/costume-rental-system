import { useEffect, useState } from "react";
import axios from "axios";

function TodaysPickups() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    const res = await axios.get(
      "https://costume-rental-system.onrender.com/api/bookings/todays-pickups",
    );
    setBookings(res.data);
  };

  const handlePickup = async (id) => {
    try {
      await axios.post(
        `https://costume-rental-system.onrender.com/api/bookings/${id}/pickup`,
      );

      // remove from UI instantly
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      alert("Failed to mark pickup");
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-20" style={{ backgroundColor: '#fdf8e6' }}>
      {/* Decorative background blurs */}
      <div className="fixed top-20 left-20 w-96 h-96 rounded-full blur-3xl pointer-events-none -z-10" style={{ backgroundColor: 'rgba(255, 209, 102, 0.3)' }} />
      <div className="fixed bottom-20 right-20 w-96 h-96 rounded-full blur-3xl pointer-events-none -z-10" style={{ backgroundColor: 'rgba(6, 214, 160, 0.2)' }} />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <h1 className="text-5xl font-black mb-8 text-black" style={{ fontFamily: "'Chewy', cursive", textShadow: '2px 2px 0px rgba(0,0,0,0.3)' }}>
          Today's Pickups
        </h1>

        {bookings.length === 0 ? (
          <div className="bg-white border-4 border-black rounded-3xl p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-2xl font-black text-black" style={{ fontFamily: "'Chewy', cursive" }}>✨ No pickups scheduled for today</p>
            <p className="text-black font-bold mt-2">Great day for you!</p>
          </div>
        ) : (
          <div className="bg-white border-4 border-black rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr style={{ backgroundColor: '#ffd166' }}>
                  <th className="p-4 font-black text-black border-b-4 border-black">Customer</th>
                  <th className="p-4 font-black text-black border-b-4 border-black">Phone</th>
                  <th className="p-4 font-black text-black border-b-4 border-black">Product</th>
                  <th className="p-4 font-black text-black border-b-4 border-black">Variant</th>
                  <th className="p-4 font-black text-black border-b-4 border-black">Qty</th>
                  <th className="p-4 font-black text-black border-b-4 border-black">Pickup Date</th>
                  <th className="p-4 font-black text-black border-b-4 border-black">Status</th>
                  <th className="p-4 font-black text-black border-b-4 border-black">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b-2 border-black hover:bg-yellow-50">
                    <td className="p-4 font-bold text-black">{b.customer_name}</td>
                    <td className="p-4 font-bold text-black">{b.phone}</td>
                    <td className="p-4 font-bold text-black">{b.product?.name}</td>
                    <td className="p-4 font-bold text-black">{b.variant}</td>
                    <td className="p-4 font-bold text-black">{b.quantity}</td>
                    <td className="p-4 font-bold text-black">{b.start_date}</td>
                    <td className="p-4 capitalize font-bold text-black">{b.status}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handlePickup(b.id)}
                        className="px-4 py-2 bg-[#ffd166] text-black font-black border-2 border-black rounded-xl hover:bg-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                      >
                        Mark Picked
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default TodaysPickups;
