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
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Today's Pickups</h1>

        {bookings.length === 0 ? (
          <p className="text-slate-500">No pickups scheduled for today</p>
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
                  <th className="p-4">Pickup Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-t">
                    <td className="p-4">{b.customer_name}</td>
                    <td className="p-4">{b.phone}</td>
                    <td className="p-4">{b.product?.name}</td>
                    <td className="p-4">{b.variant}</td>
                    <td className="p-4">{b.quantity}</td>
                    <td className="p-4">{b.start_date}</td>
                    <td className="p-4 capitalize">{b.status}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handlePickup(b.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
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
