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
  const [processingId, setProcessingId] = useState(null);
  const [whatsappModal, setWhatsappModal] = useState(null); // {phone, message, customerName}

  useEffect(() => {
    // Load cached data immediately for fast UI
    const cacheKey = `adminRequests_${filter}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { requests, nextPageUrl } = JSON.parse(cached);
      setRequests(requests);
      setNextPageUrl(nextPageUrl);
    }

    // Then fetch fresh data in background
    getRequests();

    // Auto-refresh pending requests every 10 seconds, but only fetch if count changed
    let interval;
    if (filter === "pending") {
      interval = setInterval(() => {
        getRequestsIfNewData();
      }, 10000); // 10 seconds
    }

    return () => clearInterval(interval);
  }, [filter]);

  const getRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://costume-rental-system.onrender.com/api/requests?status=${filter}`,
      );

      // Only update state if data actually changed
      setRequests((prev) => {
        const isDataChanged = JSON.stringify(prev) !== JSON.stringify(res.data.data);
        if (isDataChanged) {
          // Cache the fresh data
          const cacheKey = `adminRequests_${filter}`;
          localStorage.setItem(cacheKey, JSON.stringify({
            requests: res.data.data,
            nextPageUrl: res.data.next_page_url,
            timestamp: Date.now()
          }));
        }
        return isDataChanged ? res.data.data : prev;
      });

      setNextPageUrl(res.data.next_page_url);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // Lightweight check: only fetch full data if pending count changed
  const getRequestsIfNewData = async () => {
    try {
      const res = await axios.get(
        `https://costume-rental-system.onrender.com/api/requests?status=${filter}`,
      );

      // Compare with cached data
      const cacheKey = `adminRequests_${filter}`;
      const cached = localStorage.getItem(cacheKey);
      const cachedRequests = cached ? JSON.parse(cached).requests : [];

      // Only update if count or IDs changed (new data exists)
      if (res.data.data.length !== cachedRequests.length || 
          JSON.stringify(res.data.data.map(r => r.id)) !== JSON.stringify(cachedRequests.map(r => r.id))) {
        
        setRequests(res.data.data);
        setNextPageUrl(res.data.next_page_url);
        
        // Update cache with new data
        localStorage.setItem(cacheKey, JSON.stringify({
          requests: res.data.data,
          nextPageUrl: res.data.next_page_url,
          timestamp: Date.now()
        }));
      }
    } catch (error) {
      console.error("Error checking for new requests:", error);
    }
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
    setProcessingId(id);
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

      // Remove request from list and update cache
      setRequests((prev) => {
        const updated = prev.filter((req) => req.id !== id);
        // Update cache with the new list
        const cacheKey = `adminRequests_${filter}`;
        localStorage.setItem(cacheKey, JSON.stringify({
          requests: updated,
          nextPageUrl: nextPageUrl,
          timestamp: Date.now()
        }));
        return updated;
      });

    } catch (error) {
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: { message: `❌ ${error.response?.data?.message || "Cannot accept request right now."}`, type: 'error' }
      }));
    } finally {
      setProcessingId(null);
    }
  };

  const rejectRequest = async (id) => {
    const reason = prompt("Enter reject reason:");
    
    if (reason === null) return; // User cancelled

    setProcessingId(id);
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

      // Remove request from list and update cache
      setRequests((prev) => {
        const updated = prev.filter((req) => req.id !== id);
        // Update cache with the new list
        const cacheKey = `adminRequests_${filter}`;
        localStorage.setItem(cacheKey, JSON.stringify({
          requests: updated,
          nextPageUrl: nextPageUrl,
          timestamp: Date.now()
        }));
        return updated;
      });

    } catch (error) {
      console.error("Error rejecting request:", error);
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: { message: `❌ ${error.response?.data?.message || "Error rejecting request."}`, type: 'error' }
      }));
    } finally {
      setProcessingId(null);
    }
  };

  const badge = (status) => {
    const styles = {
      pending: { bg: '#ffd166', text: 'black' },
      accepted: { bg: '#06d6a0', text: 'black' },
      rejected: { bg: '#ef476f', text: 'black' },
    };
    return styles[status] || { bg: '#bde0fe', text: 'black' };
  };

  return (
    <div className="min-h-screen text-black pt-20 pb-20 relative overflow-hidden" style={{ backgroundColor: '#fdf8e6' }}>
      {/* Background Radial Blurs */}
      <div className="fixed top-20 left-20 w-96 h-96 rounded-full blur-3xl pointer-events-none -z-10" style={{ backgroundColor: 'rgba(255, 209, 102, 0.3)' }} />
      <div className="fixed bottom-20 right-20 w-96 h-96 rounded-full blur-3xl pointer-events-none -z-10" style={{ backgroundColor: 'rgba(239, 71, 111, 0.2)' }} />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-5xl font-black text-black uppercase tracking-tight" style={{ fontFamily: "'Chewy', cursive" }}>
            Booking Requests
          </h1>
          <p className="text-black text-lg font-bold">Manage all your fancy dress bookings here! 👗✨</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {["pending", "accepted", "rejected", "all"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className="px-6 py-3 rounded-2xl capitalize font-black border-3 border-black transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              style={{
                backgroundColor: filter === tab ? '#ffd166' : 'white',
                boxShadow: filter === tab ? '4px_4px_0px_0px_rgba(0,0,0,1)' : '2px_2px_0px_0px_rgba(0,0,0,0.5)',
                transform: filter === tab ? 'translateY(-2px)' : 'none'
              }}
            >
              {tab}
              {tab === "pending" && requests.filter(r => r.status === "pending").length > 0 && (
                <span className="ml-2 inline-block px-3 py-1 rounded-full border-2 border-black font-black text-sm" style={{ backgroundColor: '#ff5c8d', color: 'white' }}>
                  {requests.filter(r => r.status === "pending").length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <Loader />
        ) : requests.length === 0 ? (
          <div className="text-center mt-16 bg-white border-4 border-black rounded-3xl p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-3xl font-black text-black">No {filter === "all" ? "" : filter} requests</p>
            <p className="text-black font-bold mt-3 text-lg">You're all caught up 🎉</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((item) => {
              const remaining = Math.max(0, item.available_quantity - item.quantity);
              const statusStyle = badge(item.status);
              return (
                <div key={item.id} className="bg-white border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-black text-black flex-1">
                      {item.customer_name}
                    </h3>
                    <span
                      className="px-4 py-2 rounded-full text-sm font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                    >
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>

                  <p className="text-black/80 font-bold mb-4 pb-4 border-b-2 border-black/10">
                    📞 {item.phone}
                  </p>

                  <div className="space-y-3 mb-5 pb-5 border-b-2 border-black/10">
                    <div className="font-black text-black uppercase text-sm">Products Booked</div>
                    <div className="bg-white border-3 border-black rounded-2xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <p className="font-black text-black mb-3">{item.product?.name || "Deleted Product"}</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="px-3 py-2 rounded-xl font-black text-sm border-2 border-black" style={{ backgroundColor: '#bde0fe' }}>
                          Qty: <span className="text-base">{item.quantity}</span>
                        </div>
                        <div className="px-3 py-2 rounded-xl font-black text-sm border-2 border-black" style={{ backgroundColor: '#06d6a0' }}>
                          Stock: <span className="text-base">{item.available_quantity}</span>
                        </div>
                      </div>
                      <div className="mt-3 px-3 py-2 rounded-xl font-black text-sm border-2 border-black text-center" style={{ backgroundColor: remaining > 0 ? '#06d6a0' : '#ef476f' }}>
                        After: {remaining}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-5">
                    <div className="px-4 py-3 rounded-2xl font-bold border-2 border-black flex justify-between" style={{ backgroundColor: '#ffd166' }}>
                      <span>Start Date:</span>
                      <span className="font-black">{item.start_date}</span>
                    </div>
                    <div className="px-4 py-3 rounded-2xl font-bold border-2 border-black flex justify-between" style={{ backgroundColor: '#ef476f' }}>
                      <span>End Date:</span>
                      <span className="font-black">{item.end_date}</span>
                    </div>
                  </div>

                  {item.status === "pending" && (
                    <div className="flex gap-3 mt-5">
                      <button
                        onClick={() => acceptRequest(item.id)}
                        disabled={item.available_quantity < item.quantity || processingId === item.id}
                        className="flex-1 px-4 py-3 rounded-2xl font-black text-black border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                        style={{ backgroundColor: '#ffd166' }}
                      >
                        {processingId === item.id ? "Processing..." : "Accept"}
                      </button>
                      <button
                        onClick={() => rejectRequest(item.id)}
                        disabled={processingId === item.id}
                        className="flex-1 px-4 py-3 rounded-2xl font-black text-black border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                        style={{ backgroundColor: '#ef476f' }}
                      >
                        {processingId === item.id ? "Processing..." : "Decline"}
                      </button>
                    </div>
                  )}

                  {item.reject_reason && (
                    <p className="mt-4 px-4 py-3 rounded-2xl font-bold border-2 border-black" style={{ backgroundColor: '#ef476f', color: 'black' }}>
                      Reason: {item.reject_reason}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {nextPageUrl && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-8 py-4 rounded-2xl font-black text-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
              style={{ backgroundColor: '#06d6a0' }}
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}

        {/* WhatsApp Message Modal */}
        {whatsappModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-lg w-full max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="p-6 border-b-4 border-black" style={{ backgroundColor: whatsappModal.action === "accepted" ? '#06d6a0' : '#ef476f' }}>
                <h2 className="text-2xl font-black text-black" style={{ fontFamily: "'Chewy', cursive" }}>
                  {whatsappModal.action === "accepted" ? "✅ Message to Send" : "❌ Message to Send"}
                </h2>
                <p className="text-sm font-bold text-black mt-2">
                  To: {whatsappModal.customerName}
                </p>
              </div>

              {/* Message Preview */}
              <div className="p-6">
                <p className="text-black font-black mb-3">Your message:</p>
                <div className="bg-[#fdf8e6] border-3 border-black rounded-2xl p-4 mb-6 text-sm whitespace-pre-wrap font-mono text-black max-h-48 overflow-y-auto shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {whatsappModal.message}
                </div>

                {/* Info Box */}
                <div className="bg-[#bde0fe] border-3 border-black rounded-2xl p-4 mb-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-black font-bold text-sm">
                    <strong>💡 Tip:</strong> If WhatsApp doesn't open automatically, the button below will open it manually.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setWhatsappModal(null)}
                    className="flex-1 px-4 py-3 border-3 border-black text-black rounded-2xl font-black bg-white hover:bg-[#fdf8e6] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      openWhatsAppDeepLink(whatsappModal.phone, whatsappModal.message);
                      setWhatsappModal(null);
                    }}
                    className="flex-1 px-4 py-3 text-black rounded-2xl font-black border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                    style={{ backgroundColor: '#06d6a0' }}
                  >
                    📱 Open WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Requests;
