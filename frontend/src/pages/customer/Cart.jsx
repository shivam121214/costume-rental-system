import { useEffect, useState } from "react";
import { getCart, removeFromCart, updateCartItem } from "../../utils/cart";
import { 
    generateRequestSubmissionMessage, 
    openWhatsAppDeepLink,
    isValidPhoneNumber,
    normalizePhoneNumber
} from "../../services/whatsappService";
import axios from "axios";
import { Loader2, AlertTriangle, CheckCircle, Search, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function Cart() {
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showPhoneConfirmation, setShowPhoneConfirmation] = useState(false);
  const [normalizedPhoneForConfirm, setNormalizedPhoneForConfirm] = useState("");
  const [whatsappModal, setWhatsappModal] = useState(null); // {phone, message, customerName}

  const API_BASE_URL = import.meta.env.VITE_API_URL || "https://costume-rental-system.onrender.com/api";
  const ADMIN_PHONE = import.meta.env.VITE_WHATSAPP_ADMIN_PHONE || "919876543210";

  const validateForm = () => {
    const errors = {};

    if (!customerName.trim()) {
      errors.name = "Please enter your name";
    }

    if (!phone.trim()) {
      errors.phone = "Please enter your phone number";
    } else if (!isValidPhoneNumber(phone)) {
      errors.phone = "Please enter a valid phone number (10-15 digits)";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const normalized = normalizePhoneNumber(phone);
    setNormalizedPhoneForConfirm(normalized);
    setShowPhoneConfirmation(true);
  };

  const handleConfirmPhone = async (confirmed) => {
    if (!confirmed) {
      setShowPhoneConfirmation(false);
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit all cart items to backend
      const responses = [];

      for (let item of cart) {
        try {
          const response = await axios.post(
            `${API_BASE_URL}/requests`,
            {
              product_id: item.product_id,
              variant: item.variant,
              quantity: item.quantity,
              start_date: item.start_date,
              end_date: item.end_date,
              customer_name: customerName.trim(),
              phone: normalizedPhoneForConfirm,
            }
          );
          responses.push(response.data);
        } catch (itemError) {
          console.error("Error submitting item:", itemError);
          throw new Error(`Failed to submit ${item.product_name}`);
        }
      }

      // Generate WhatsApp message from cart data
      const cartItemsForMessage = cart.map((item, index) => {
        const productName = responses[index]?.booking_request?.product?.name 
          || item.product_name 
          || "Costume Item";
        
        return {
          product_name: productName,
          variant: item.variant,
          quantity: item.quantity,
          start_date: formatDateForMessage(item.start_date),
          end_date: formatDateForMessage(item.end_date),
        };
      });

      const whatsappMessage = generateRequestSubmissionMessage(
        { name: customerName, phone: normalizedPhoneForConfirm },
        cartItemsForMessage
      );

      // Close phone confirmation and show WhatsApp modal
      setShowPhoneConfirmation(false);
      setWhatsappModal({
        phone: ADMIN_PHONE,
        message: whatsappMessage,
        customerName: customerName
      });

      setIsSubmitting(false);

    } catch (err) {
      console.error("Error:", err);
      const errorMessage = err.response?.data?.message 
        || err.message 
        || "Error sending request. Please try again.";
      alert(`❌ ${errorMessage}`);
      setShowPhoneConfirmation(false);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    setCart(getCart());
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    loadCart();
  };

  const handleChange = (id, field, value) => {
    updateCartItem(id, { [field]: value });
    loadCart();
  };

  // Show empty cart message only if there's no modal (no pending request)
  if (cart.length === 0 && !whatsappModal && !showPhoneConfirmation) {
    return (
      <div className="min-h-screen pt-20 pb-20 flex items-center justify-center p-4" style={{ backgroundColor: '#fdf8e6' }}>
        <div className="text-center bg-white border-4 border-black rounded-3xl p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md">
          <div className="w-24 h-24 bg-[#bde0fe] rounded-full border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-6 mx-auto">
            <Search className="w-10 h-10 text-black" strokeWidth={3} />
          </div>
          <h3 className="text-4xl font-black text-black mb-4" style={{ fontFamily: "'Chewy', cursive" }}>Your Cart is Empty!</h3>
          <p className="font-bold text-lg text-black">Time to find some awesome costumes!</p>
        </div>
      </div>
    );
  }

  const formatDateForMessage = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const checkAllAvailability = async () => {
    const updatedCart = await Promise.all(
      cart.map(async (item) => {
        try {
          const res = await axios.post(
            "https://costume-rental-system.onrender.com/api/check-availability",
            {
              product_id: item.product_id,
              variant: item.variant,
              quantity: item.quantity,
              start_date: item.start_date,
              end_date: item.end_date,
            },
          );

          return {
            ...item,
            is_available: res.data.available_quantity >= item.quantity,
            message:
              res.data.available_quantity >= item.quantity
                ? ""
                : `Only ${res.data.available_quantity} available`,
          };
        } catch (err) {
          return {
            ...item,
            is_available: false,
            message: "Error checking availability",
          };
        }
      }),
    );

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const allAvailable =
    cart.length > 0 && cart.every((item) => item.is_available === true);

  return (
    <div className="min-h-screen pt-20 pb-20" style={{ backgroundColor: '#fdf8e6' }}>
      {/* Decorative background blurs */}
      <div className="fixed top-20 left-20 w-96 h-96 rounded-full blur-3xl pointer-events-none -z-10" style={{ backgroundColor: 'rgba(255, 209, 102, 0.3)' }} />
      <div className="fixed bottom-20 right-20 w-96 h-96 rounded-full blur-3xl pointer-events-none -z-10" style={{ backgroundColor: 'rgba(239, 71, 111, 0.2)' }} />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
          <h2 className="text-5xl font-black text-black p-4 rounded-3xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" style={{ fontFamily: "'Chewy', cursive", backgroundColor: '#bde0fe', transform: 'rotate(1deg)' }}>
            Your Magical Cart!
          </h2>
          {cart.length > 0 && (
            <span className="text-4xl font-black text-white px-8 py-4 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2" style={{ backgroundColor: '#ef476f', fontFamily: "'Chewy', cursive" }}>
              🛍️ {cart.length} {cart.length === 1 ? 'Item' : 'Items'}
            </span>
          )}
        </div>

        {/* Cart Items */}
        <div className="space-y-6 mb-8">
          {cart.map((item) => (
            <div 
              key={item.id} 
              className="bg-white border-4 border-black rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-black text-2xl text-black">
                    {item.product_name || "Costume Item"}
                  </h3>
                  <span className="inline-block mt-2 px-3 py-1 rounded-full border-2 border-black font-black text-sm" style={{ backgroundColor: '#ffd166' }}>
                    {item.variant}
                  </span>
                  {item.message && (
                    <p className="text-black font-bold mt-2" style={{ color: '#ef476f' }}>
                      ⚠️ {item.message}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="w-10 h-10 bg-[#ef476f] text-white rounded-full border-2 border-black font-black flex items-center justify-center hover:scale-110 transition-transform"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="px-3 py-2 rounded-2xl border-2 border-black font-black text-sm text-center" style={{ backgroundColor: '#bde0fe' }}>
                  Qty: <span className="text-lg">{item.quantity}</span>
                </div>
                <div className="px-3 py-2 rounded-2xl border-2 border-black font-bold text-sm">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => 
                      handleChange(item.id, "quantity", parseInt(e.target.value) || 1)
                    }
                    className="w-full px-2 py-1 border-2 border-black rounded-lg font-black text-center"
                    style={{ backgroundColor: '#fdf8e6' }}
                  />
                </div>
                <div className="px-3 py-2 rounded-2xl border-2 border-black font-black text-sm text-center" style={{ backgroundColor: '#ffd166' }}>
                  Start: {formatDateForMessage(item.start_date)}
                </div>
                <div className="px-3 py-2 rounded-2xl border-2 border-black font-black text-sm text-center" style={{ backgroundColor: '#ef476f', color: 'white' }}>
                  End: {formatDateForMessage(item.end_date)}
                </div>
              </div>

              <div className="flex items-center font-black text-lg">
                {item.is_available === null ? (
                  <span style={{ color: '#a0a0a0' }}>⏳ Check availability</span>
                ) : item.is_available === false ? (
                  <span style={{ color: '#ef476f' }}>❌ Not Available</span>
                ) : (
                  <span style={{ color: '#06d6a0' }}>✅ Available</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Hint */}
        <div className="text-center bg-[#bde0fe] border-2 border-black p-4 rounded-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-8 font-black text-black max-w-md mx-auto">
          ✨ Hint: Check availability to verify all items can be booked!
        </div>

        {/* Availability Check Button */}
        <button
          onClick={checkAllAvailability}
          className="w-full px-6 py-4 rounded-3xl border-4 border-black font-black text-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 transition-all flex items-center justify-center gap-3"
          style={{ backgroundColor: '#06d6a0', color: 'black', fontFamily: "'Chewy', cursive" }}
        >
          <CheckCircle className="w-8 h-8" strokeWidth={3} />
          Check Availability!
        </button>

        {/* Availability Status Box */}
        {!allAvailable && cart.length > 0 && (
          <div className="mt-8 bg-[#ff9e9e] border-4 border-black rounded-3xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-full border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0">
              <AlertTriangle className="w-10 h-10 text-black" strokeWidth={3} />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-3xl font-black text-black mb-2" style={{ fontFamily: "'Chewy', cursive" }}>Oops! Missing Items!</h3>
              <p className="font-bold text-black">Some items may not be available. Please adjust quantities or dates.</p>
            </div>
          </div>
        )}

        {/* Customer Information Form */}
        {allAvailable && (
          <div className="mt-12 space-y-8">
            <div className="bg-[#06d6a0] border-4 border-black rounded-3xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-center gap-6" style={{ transform: 'rotate(-1deg)' }}>
              <div className="w-20 h-20 bg-white rounded-full border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0">
                <CheckCircle className="w-10 h-10 text-black" strokeWidth={3} />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-4xl font-black text-black mb-2" style={{ fontFamily: "'Chewy', cursive" }}>Yay! Everything's Here!</h3>
                <p className="font-bold text-black text-lg">Tell us who you are so we can prepare your magical costumes.</p>
              </div>
            </div>

            <form onSubmit={handleSendRequest} className="bg-white border-4 border-black rounded-3xl p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6" style={{ transform: 'rotate(1deg)' }}>
              <div>
                <label htmlFor="name" className="block font-black text-3xl text-black mb-3" style={{ fontFamily: "'Chewy', cursive" }}>Your Magical Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (validationErrors.name) {
                      setValidationErrors({ ...validationErrors, name: "" });
                    }
                  }}
                  placeholder="e.g. Princess Fiona"
                  className="w-full text-lg font-bold px-5 py-4 rounded-2xl border-3 border-black"
                  style={{ backgroundColor: '#fdf8e6' }}
                />
                {validationErrors.name && (
                  <p className="text-black font-bold mt-2" style={{ color: '#ef476f' }}>{validationErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block font-black text-3xl text-black mb-3" style={{ fontFamily: "'Chewy', cursive" }}>Contact Number</label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (validationErrors.phone) {
                      setValidationErrors({ ...validationErrors, phone: "" });
                    }
                  }}
                  placeholder="e.g. +91 9876543210"
                  className="w-full text-lg font-bold px-5 py-4 rounded-2xl border-3 border-black"
                  style={{ backgroundColor: '#fdf8e6' }}
                />
                {validationErrors.phone && (
                  <p className="text-black font-bold mt-2" style={{ color: '#ef476f' }}>{validationErrors.phone}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-5 text-white rounded-2xl border-4 border-black font-black text-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                style={{ backgroundColor: '#ff5c8d', fontFamily: "'Chewy', cursive" }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" strokeWidth={3} />
                    Booking...
                  </>
                ) : (
                  <>
                    Book Order via WhatsApp
                    <Send className="w-6 h-6" strokeWidth={3} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Phone Confirmation Modal */}
      {showPhoneConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 max-w-sm w-full">
            <h2 className="text-2xl font-black text-black mb-6" style={{ fontFamily: "'Chewy', cursive" }}>📱 Confirm Your Phone</h2>
            
            <p className="font-bold text-black mb-4">We'll send WhatsApp updates to this number:</p>
            
            <div className="bg-[#bde0fe] border-3 border-black rounded-2xl p-4 mb-6 text-center">
              <p className="text-3xl font-black text-black">{normalizedPhoneForConfirm}</p>
              <p className="text-sm font-bold text-black mt-2">Make sure this is correct!</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleConfirmPhone(false)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 border-3 border-black text-black rounded-2xl font-black hover:bg-[#fdf8e6]"
              >
                ❌ No, Edit
              </button>
              <button
                onClick={() => handleConfirmPhone(true)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 text-white rounded-2xl font-black border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: '#06d6a0' }}
              >
                ✅ Yes, Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Message Modal */}
      {whatsappModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-lg w-full max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b-4 border-black" style={{ backgroundColor: '#06d6a0' }}>
              <h2 className="text-2xl font-black text-black" style={{ fontFamily: "'Chewy', cursive" }}>✅ Ready to Send!</h2>
              <p className="text-sm font-bold text-black mt-2">Customer: {whatsappModal.customerName}</p>
            </div>

            {/* Message Preview */}
            <div className="p-6">
              <p className="font-black text-black mb-3">Your message:</p>
              <div className="bg-[#fdf8e6] border-3 border-black rounded-2xl p-4 mb-6 text-sm whitespace-pre-wrap font-mono text-black max-h-48 overflow-y-auto shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {whatsappModal.message}
              </div>

              {/* Info Box */}
              <div className="bg-[#bde0fe] border-3 border-black rounded-2xl p-4 mb-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-black font-bold text-sm">💡 Tip: Click "Open WhatsApp" to send your booking request!</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setWhatsappModal(null);
                    // Clear cart after modal is closed
                    localStorage.removeItem("cart");
                    setCart([]);
                    setCustomerName("");
                    setPhone("");
                  }}
                  className="flex-1 px-4 py-3 border-3 border-black text-black rounded-2xl font-black hover:bg-[#fdf8e6]"
                >
                  Done
                </button>
                <button
                  onClick={() => {
                    openWhatsAppDeepLink(whatsappModal.phone, whatsappModal.message);
                    setWhatsappModal(null);
                    // Clear cart after opening WhatsApp
                    localStorage.removeItem("cart");
                    setCart([]);
                    setCustomerName("");
                    setPhone("");
                  }}
                  className="flex-1 px-4 py-3 text-white rounded-2xl font-black border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
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
  );
}

export default Cart;
