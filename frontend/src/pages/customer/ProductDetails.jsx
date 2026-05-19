import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { addToCart } from "../../utils/cart";
import {
  openWhatsAppDeepLink,
  generateRequestSubmissionMessage,
  normalizePhoneNumber,
  isValidPhoneNumber,
} from "../../services/whatsappService";

function ProductDetails() {
  const { id } = useParams();
  const API_URL = "https://costume-rental-system.onrender.com";
  const ADMIN_PHONE = import.meta.env.VITE_WHATSAPP_ADMIN_PHONE || "919876543210";
  
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}/storage/${path}`;
  };

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [message, setMessage] = useState("");
  const [availability, setAvailability] = useState(null);
  const [showPhoneConfirmation, setShowPhoneConfirmation] = useState(false);
  const [normalizedPhoneForConfirm, setNormalizedPhoneForConfirm] = useState("");
  const [whatsappModal, setWhatsappModal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    variant: "",
    quantity: 1,
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    const res = await axios.get(`${API_URL}/api/products/${id}`);
    setProduct(res.data);

    if (res.data.image) {
      setSelectedImage(res.data.image);
    }
  };

  const checkAvailability = async (e) => {
    e.preventDefault();

    const res = await axios.post(`${API_URL}/api/check-availability`, {
      product_id: id,
      ...form,
    });

    setAvailability(res.data);
    setMessage("");
  };

  const handleSendRequest = () => {
    // Validate form
    if (!form.customer_name.trim()) {
      setMessage("Please enter your name");
      return;
    }

    if (!form.phone.trim()) {
      setMessage("Please enter your phone number");
      return;
    }

    if (!isValidPhoneNumber(form.phone)) {
      setMessage("Please enter a valid phone number (10-15 digits)");
      return;
    }

    // Show phone confirmation
    const normalized = normalizePhoneNumber(form.phone);
    setNormalizedPhoneForConfirm(normalized);
    setShowPhoneConfirmation(true);
  };

  const handleConfirmPhone = async (confirmed) => {
    setShowPhoneConfirmation(false);

    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_URL}/api/requests`, {
        product_id: id,
        customer_name: form.customer_name,
        phone: normalizedPhoneForConfirm,
        variant: form.variant,
        quantity: form.quantity,
        start_date: form.start_date,
        end_date: form.end_date,
      });

      // Generate WhatsApp message
      const whatsappMessage = generateRequestSubmissionMessage(
        { name: form.customer_name, phone: normalizedPhoneForConfirm },
        [
          {
            product_name: product.name,
            variant: form.variant,
            quantity: form.quantity,
            start_date: form.start_date,
            end_date: form.end_date,
          },
        ]
      );

      // Show WhatsApp modal
      setWhatsappModal({
        phone: ADMIN_PHONE,
        message: whatsappMessage,
        customerName: form.customer_name,
      });

      // Clear form
      setForm({
        customer_name: "",
        phone: "",
        variant: "",
        quantity: 1,
        start_date: "",
        end_date: "",
      });
      setAvailability(null);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Error sending request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateForMessage = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!product) return <div className="p-6">Loading...</div>;

  const ageGroups =
    product?.variants && typeof product.variants === "object"
      ? Object.keys(product.variants)
      : [];

  const images = [
    ...(product.image ? [product.image] : []),
    ...(product.gallery || []),
  ];

  const today = new Date().toISOString().split("T")[0];

  const handleAddToCart = () => {
    if (!form.variant || !form.start_date || !form.end_date) {
      alert("Please select size and dates");
      return;
    }

    const item = {
      product_id: product.id,
      product_name: product.name,
      image: product.image,
      variant: form.variant,
      quantity: Number(form.quantity),
      start_date: form.start_date,
      end_date: form.end_date,
    };

    const res = addToCart(item);

    if (!res.success) {
      alert(res.message);
      return;
    }

    alert("Added to cart");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden grid md:grid-cols-2 gap-6 p-6">
        {/* Left Side */}
        <div>
          <div className="h-96 bg-slate-200 rounded-xl overflow-hidden">
            {selectedImage ? (
              <img
                src={getImageUrl(selectedImage)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                No Image
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-4 flex-wrap">
            {images.map((img, index) => (
              <img
                key={index}
                src={getImageUrl(img)}
                alt=""
                onClick={() => setSelectedImage(img)}
                className="w-20 h-20 object-cover rounded-lg cursor-pointer border"
              />
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div>
          <p className="text-sm text-slate-500">{product.category}</p>
          <h1 className="text-4xl font-bold mt-2">{product.name}</h1>
          <p className="text-slate-600 mt-4">{product.description}</p>
          <p className="text-3xl font-bold mt-6">₹ {product.rent_price} Rent</p>

          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="font-semibold text-slate-800">
              ₹ {product.security_deposit} Refundable Security Deposit
            </p>
            <p className="text-sm text-slate-600 mt-1">
              Returned after costume is returned in proper condition.
            </p>
          </div>

          {/* Availability */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-3">
              Check Availability & Send Request
            </h2>

            <form onSubmit={checkAvailability} className="grid gap-3">
              <select
                className="border p-3 rounded-lg"
                value={form.variant}
                onChange={(e) =>
                  setForm({
                    ...form,
                    variant: e.target.value,
                  })
                }
                required
              >
                <option value="">Select Age Group</option>
                {ageGroups.map((group, i) => (
                  <option key={i}>{group}</option>
                ))}
              </select>

              <input
                type="number"
                className="border p-3 rounded-lg"
                placeholder="Quantity"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                required
              />

              <input
                type="date"
                min={today}
                className="border p-3 rounded-lg"
                value={form.start_date}
                onChange={(e) =>
                  setForm({
                    ...form,
                    start_date: e.target.value,
                  })
                }
                required
              />

              <input
                type="date"
                min={form.start_date || today}
                className="border p-3 rounded-lg"
                value={form.end_date}
                onChange={(e) =>
                  setForm({
                    ...form,
                    end_date: e.target.value,
                  })
                }
                required
              />

              <button className="bg-slate-900 text-white py-3 rounded-lg">
                Check
              </button>
            </form>

            {availability &&
              Number(form.quantity) > availability.available_quantity && (
                <p className="text-red-600 mt-2 font-semibold">
                  {availability.available_quantity === 0
                    ? "Unavailable"
                    : `Only ${availability.available_quantity} available`}
                </p>
              )}

            {availability &&
              Number(form.quantity) <= availability.available_quantity && (
                <div className="grid gap-3 mt-4">
                  <input
                    className="border p-3 rounded-lg"
                    placeholder="Your Name"
                    value={form.customer_name}
                    onChange={(e) =>
                      setForm({ ...form, customer_name: e.target.value })
                    }
                    required
                  />

                  <input
                    className="border p-3 rounded-lg"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    required
                  />

                  {message && (
                    <p className="text-sm font-medium text-red-600">
                      {message}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={handleSendRequest}
                    className="bg-yellow-400 py-3 rounded-lg font-semibold"
                  >
                    Send Booking Request
                  </button>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="bg-slate-700 text-white py-3 rounded-lg font-semibold"
                  >
                    Add to Cart
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Phone Confirmation Dialog */}
      {showPhoneConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-slate-900">
              📱 Confirm Your Phone Number
            </h2>

            <p className="text-slate-600 mb-4">
              We'll send WhatsApp updates to this number:
            </p>

            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-6 text-center">
              <p className="text-3xl font-bold text-blue-600">
                {normalizedPhoneForConfirm}
              </p>
              <p className="text-sm text-slate-600 mt-2">
                Make sure this is correct!
              </p>
            </div>

            <p className="text-sm text-slate-700 mb-6">
              If this is incorrect, click "No" to edit your phone number.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => handleConfirmPhone(false)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 disabled:opacity-50"
              >
                ❌ No, Edit It
              </button>
              <button
                onClick={() => handleConfirmPhone(true)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block animate-spin">⌛</span>
                    Sending...
                  </>
                ) : (
                  <>✅ Yes, Confirm</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Message Modal */}
      {whatsappModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-screen overflow-y-auto">
            {/* Header */}
            <div className="p-6 bg-green-50 border-b-2 border-green-200">
              <h2 className="text-xl font-bold text-green-700">
                ✅ Request Submitted Successfully!
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Now send to: {whatsappModal.customerName}
              </p>
            </div>

            {/* Message Preview */}
            <div className="p-6">
              <p className="text-slate-700 font-semibold mb-3">
                Your message:
              </p>
              <div className="bg-slate-50 border rounded-lg p-4 mb-6 text-sm whitespace-pre-wrap font-mono text-slate-700 max-h-64 overflow-y-auto">
                {whatsappModal.message}
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm">
                <p className="text-blue-900">
                  <strong>💡 Next Step:</strong> Click the button below to
                  open WhatsApp and send your request!
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setWhatsappModal(null)}
                  className="flex-1 px-4 py-2 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Done
                </button>
                <button
                  onClick={() => {
                    openWhatsAppDeepLink(
                      whatsappModal.phone,
                      whatsappModal.message
                    );
                    setWhatsappModal(null);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
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

export default ProductDetails;
