import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../components/Loader";
import {
  openWhatsAppDeepLink,
  generateRequestAcceptedMessage,
  generateRequestRejectedMessage,
} from "../../services/whatsappService";

function Requests() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [whatsappModal, setWhatsappModal] = useState(null); // {phone, message, customerName}

  useEffect(() => {
    getRequests();
  }, [filter]);

  const getRequests = async () => {
    setLoading(true);
    const res = await axios.get(
      `https://costume-rental-system.onrender.com/api/requests?status=${filter}`,
    );

    setRequests(res.data.data);
    setNextPageUrl(res.data.next_page_url);
    setLoading(false);
  };

  const loadMore = async () => {
    if (!nextPageUrl) return;

    setLoadingMore(true);

    const res = await axios.get(nextPageUrl);

    setRequests((prev) => [...prev, ...res.data.data]);
    setNextPageUrl(res.data.next_page_url);

    setLoadingMore(false);
  };

  const acceptRequest = async (id) => {
    try {
      const requestItem = requests.find((req) => req.id === id);
      
      await axios.post(
        `https://costume-rental-system.onrender.com/api/requests/${id}/accept`,
      );

      // Generate acceptance message
      const acceptMessage = generateRequestAcceptedMessage({
        customer_name: requestItem.customer_name,
        product_name: requestItem.product?.name || "Costume Item",
        variant: requestItem.variant,
        quantity: requestItem.quantity,
        start_date: requestItem.start_date,
        end_date: requestItem.end_date,
      });

      // Show WhatsApp modal with message
      setWhatsappModal({
        phone: requestItem.phone,
        message: acceptMessage,
        customerName: requestItem.customer_name,
        action: "accepted"
      });

      // Refresh requests
      getRequests();
    } catch (error) {
      alert(
        error.response?.data?.message || "Cannot accept request right now.",
      );
    }
  };

  const rejectRequest = async (id) => {
    const reason = prompt("Enter reject reason:");
    
    if (reason === null) return; // User cancelled

    try {
      const requestItem = requests.find((req) => req.id === id);
      
      await axios.post(
        `https://costume-rental-system.onrender.com/api/requests/${id}/reject`,
        {
          reject_reason: reason || "Not available",
        },
      );

      // Generate rejection message
      const rejectMessage = generateRequestRejectedMessage(
        {
          customer_name: requestItem.customer_name,
          product_name: requestItem.product?.name || "Costume Item",
          variant: requestItem.variant,
          quantity: requestItem.quantity,
          start_date: requestItem.start_date,
          end_date: requestItem.end_date,
        },
        reason || "Not available"
      );

      // Show WhatsApp modal with message
      setWhatsappModal({
        phone: requestItem.phone,
        message: rejectMessage,
        customerName: requestItem.customer_name,
        action: "rejected"
      });

      getRequests();
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert(
        error.response?.data?.message || "Error rejecting request.",
      );
    }
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
      <div className="flex gap-3 mb-6">
        {["pending", "accepted", "rejected", "all"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg capitalize ${
              filter === tab ? "bg-slate-900 text-white" : "bg-white border"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        // <div className="text-center mt-16 text-slate-500">
        //   Loading requests...
        // </div>
        <Loader />
      ) : requests.length === 0 ? (
        <div className="text-center mt-16">
          <p className="text-xl font-semibold text-slate-600">
            No {filter === "all" ? "" : filter} requests
          </p>
          <p className="text-slate-400 mt-2">You're all caught up 🎉</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {requests.map((item) => {
            const remaining = Math.max(
              0,
              item.available_quantity - item.quantity,
            );
            return (
              <div key={item.id} className="bg-white rounded-2xl shadow-md p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold">
                    {item.customer_name}
                  </h3>

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
                  After accept:{" "}
                  <span
                    className={
                      item.available_quantity < item.quantity
                        ? "text-red-600 font-semibold"
                        : "text-green-600 font-semibold"
                    }
                  >
                    {remaining}
                  </span>
                </p>
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
            );
          })}
        </div>
      )}
      {nextPageUrl && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-3 bg-slate-900 text-white rounded-lg"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {/* WhatsApp Message Modal */}
      {whatsappModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-screen overflow-y-auto">
            {/* Header */}
            <div className={`p-6 ${whatsappModal.action === "accepted" ? "bg-green-50 border-b-2 border-green-200" : "bg-red-50 border-b-2 border-red-200"}`}>
              <h2 className={`text-xl font-bold ${whatsappModal.action === "accepted" ? "text-green-700" : "text-red-700"}`}>
                {whatsappModal.action === "accepted" ? "✅ Message to Send (Accepted)" : "❌ Message to Send (Rejected)"}
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                To: {whatsappModal.customerName}
              </p>
            </div>

            {/* Message Preview */}
            <div className="p-6">
              <div className="bg-slate-50 border rounded-lg p-4 mb-6 text-sm whitespace-pre-wrap font-mono text-slate-700 max-h-64 overflow-y-auto">
                {whatsappModal.message}
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm">
                <p className="text-blue-900">
                  <strong>💡 Tip:</strong> If WhatsApp doesn't open automatically, the "Open WhatsApp" button below will open it manually.
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
                    whatsappModal.action === "accepted"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
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

export default Requests;
