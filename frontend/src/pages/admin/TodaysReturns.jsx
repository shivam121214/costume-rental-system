import { useEffect, useState } from "react";
import axios from "axios";

function TodaysReturns() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    const res = await axios.get(
      "https://costume-rental-system.onrender.com/api/bookings/todays-returns"
    );
    setBookings(res.data);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Today's Returns</h1>

        {bookings.length === 0 ? (
          <p className="text-slate-500">No returns scheduled for today</p>
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
                    <td className="p-4">{b.end_date}</td>
                    <td className="p-4 capitalize">{b.status}</td>
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

export default TodaysReturns;