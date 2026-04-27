import { useEffect, useState } from "react";
import axios from "axios";

function Requests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getRequests();
  }, []);

  const getRequests = async () => {
    const res = await axios.get(
      "https://costume-rental-system.onrender.com/api/requests",
    );
    setRequests(res.data);
  };

  const acceptRequest = async (id) => {
    try {
      await axios.post(
        `https://costume-rental-system.onrender.com/api/requests/${id}/accept`,
      );

      getRequests();
    } catch (error) {
      alert(
        error.response?.data?.message || "Cannot accept request right now.",
      );
    }
  };

  const rejectRequest = async (id) => {
    const reason = prompt("Enter reject reason:");

    await axios.post(
      `https://costume-rental-system.onrender.com/api/requests/${id}/reject`,
      {
        reject_reason: reason || "Not available",
      },
    );

    getRequests();
  };

  const badge = (status) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      accepted: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };

    return styles[status] || "bg-slate-100 text-slate-700";
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Requests</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {requests.map((item) => (
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
            <p>Available: {item.available_quantity}</p>
            <p>
              {item.start_date} → {item.end_date}
            </p>

            {item.status === "pending" && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => acceptRequest(item.id)}
                  disabled={item.available_quantity < item.quantity}
                  className={`px-4 py-2 rounded-lg text-white ${
                    item.available_quantity < item.quantity
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600"
                  }`}
                >
                  Accept
                </button>

                <button
                  onClick={() => rejectRequest(item.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Reject
                </button>
              </div>
            )}

            {item.reject_reason && (
              <p className="mt-3 text-red-500 text-sm">
                Reason: {item.reject_reason}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Requests;
