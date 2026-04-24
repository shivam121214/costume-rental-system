import { useEffect, useState } from "react";
import axios from "axios";

function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getBookings();
  }, []);

  const getBookings = async () => {
    const res = await axios.get("https://costume-rental-system-production-c63d.up.railway.app/api/bookings");
    setBookings(res.data);
  };

  const updateStatus = async (id, status) => {
    if (status === "picked") {
      const received = prompt("Enter total amount received (Rent + Deposit):");

      if (!received) return;
    }

    await axios.post(`https://costume-rental-system-production-c63d.up.railway.app/api/bookings/${id}/status`, {
      status,
    });

    getBookings();
  };

  const markReturn = async (id) => {
    const confirmReturn = confirm(
      "Refund security deposit and close this booking?",
    );

    if (!confirmReturn) return;

    await axios.post(`https://costume-rental-system-production-c63d.up.railway.app/api/bookings/${id}/return`);

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

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Bookings</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {bookings.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-md p-5">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold">{item.customer_name}</h3>

              <span
                className={`px-3 py-1 rounded-full text-sm ${badge(item.status)}`}
              >
                {item.status}
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
                onClick={() => updateStatus(item.id, "late")}
                className="bg-red-600 text-white py-2 rounded-lg"
              >
                Late
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
    </div>
  );
}

export default Bookings;
