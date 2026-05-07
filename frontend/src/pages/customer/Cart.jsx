import { useEffect, useState } from "react";
import { getCart, removeFromCart, updateCartItem } from "../../utils/cart";
import { 
    generateRequestSubmissionMessage, 
    openWhatsAppDeepLink,
    isValidPhoneNumber,
    normalizePhoneNumber
} from "../../services/whatsappService";
import axios from "axios";

function Cart() {
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

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

  const handleSendRequest = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit all cart items to backend
      const responses = [];
      const normalizedPhone = normalizePhoneNumber(phone);

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
              phone: normalizedPhone,
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
        { name: customerName, phone: normalizedPhone },
        cartItemsForMessage
      );

      // Show success message
      alert("✅ Request submitted successfully! WhatsApp will now open.");

      // Clear cart
      localStorage.removeItem("cart");
      setCart([]);
      setCustomerName("");
      setPhone("");

      // Open WhatsApp with pre-filled message
      openWhatsAppDeepLink(ADMIN_PHONE, whatsappMessage);

    } catch (err) {
      console.error("Error:", err);
      const errorMessage = err.response?.data?.message 
        || err.message 
        || "Error sending request. Please try again.";
      alert(`❌ ${errorMessage}`);
    } finally {
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

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500">
        <p className="text-lg">Your cart is empty</p>
        <p className="text-sm mt-2">Add some costumes to get started!</p>
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
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold">Your Rental Cart</h1>

      {/* Cart Items */}
      <div className="space-y-4">
        {cart.map((item, index) => (
          <div 
            key={item.id} 
            className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-lg">
                  {item.product_name || "Costume Item"}
                </h3>
                {item.message && (
                  <p className="text-orange-600 text-sm mt-1">
                    ⚠️ {item.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                className="text-red-500 hover:text-red-700 font-semibold"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div>
                <label className="block text-slate-600 mb-1">Variant/Size</label>
                <p className="font-medium">{item.variant}</p>
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => 
                    handleChange(item.id, "quantity", parseInt(e.target.value))
                  }
                  className="w-full px-2 py-1 border rounded"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">Start Date</label>
                <p className="font-medium text-sm">
                  {formatDateForMessage(item.start_date)}
                </p>
              </div>
              <div>
                <label className="block text-slate-600 mb-1">End Date</label>
                <p className="font-medium text-sm">
                  {formatDateForMessage(item.end_date)}
                </p>
              </div>
            </div>

            <div className="flex items-center text-sm">
              {item.is_available === false ? (
                <span className="text-red-600">❌ Not Available</span>
              ) : (
                <span className="text-green-600">✅ Available</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Availability Check */}
      <button
        onClick={checkAllAvailability}
        className="w-full px-4 py-2 border border-slate-300 rounded text-slate-700 font-semibold hover:bg-slate-50"
      >
        Check Availability
      </button>

      {/* Customer Information */}
      <div className="border-t pt-6 space-y-4 bg-slate-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold">Your Information</h2>

        <div>
          <label className="block text-slate-700 font-semibold mb-2">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value);
              if (validationErrors.name) {
                setValidationErrors({ ...validationErrors, name: "" });
              }
            }}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
              validationErrors.name 
                ? "border-red-500 focus:ring-red-200" 
                : "border-slate-300 focus:ring-blue-200"
            }`}
          />
          {validationErrors.name && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="Enter your phone number (e.g., 9876543210)"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (validationErrors.phone) {
                setValidationErrors({ ...validationErrors, phone: "" });
              }
            }}
            className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
              validationErrors.phone 
                ? "border-red-500 focus:ring-red-200" 
                : "border-slate-300 focus:ring-blue-200"
            }`}
          />
          {validationErrors.phone && (
            <p className="text-red-600 text-sm mt-1">{validationErrors.phone}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSendRequest}
        disabled={isSubmitting || cart.length === 0 || !allAvailable}
        className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg transition-all"
      >
        {isSubmitting ? (
          <>
            <span className="inline-block animate-spin">⌛</span>
            Sending...
          </>
        ) : (
          <>
            <span>📱</span>
            Send Request via WhatsApp
          </>
        )}
      </button>

      {!allAvailable && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-sm text-yellow-800">
          ⚠️ Some items are not available for your selected dates. Please adjust quantities or dates.
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 p-4 rounded text-sm text-blue-800">
        <p className="font-semibold mb-1">ℹ️ How it works:</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Review your cart and check availability</li>
          <li>Enter your name and phone number</li>
          <li>Click "Send Request via WhatsApp"</li>
          <li>WhatsApp opens with a pre-filled message</li>
          <li>Simply press Send - we receive your request!</li>
        </ol>
      </div>
    </div>
  );
}

export default Cart;
