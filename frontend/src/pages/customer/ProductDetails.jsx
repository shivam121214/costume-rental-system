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
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

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
    console.log('Product fetched:', res.data); // Debug: check what data we get
    setProduct(res.data);

    if (res.data.image) {
      setSelectedImage(res.data.image);
    }
  };

  const checkAvailability = async (e) => {
    e.preventDefault();

    setIsCheckingAvailability(true);
    try {
      const res = await axios.post(`${API_URL}/api/check-availability`, {
        product_id: id,
        ...form,
      });

      setAvailability(res.data);
      setMessage("");
    } catch (err) {
      setMessage("Error checking availability");
    } finally {
      setIsCheckingAvailability(false);
    }
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

  if (!product) return (
    <div className="min-h-screen bg-[#fdf8e6] flex items-center justify-center pt-20">
      <div className="text-center">
        <img src="/dance.gif" alt="Loading" className="w-32 h-32 mb-4 mx-auto" />
        <p className="text-2xl font-black text-black" style={{ fontFamily: "'Chewy', cursive" }}>Loading...</p>
      </div>
    </div>
  );

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
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: { message: "⚠️ Please select size and dates", type: 'error' }
      }));
      return;
    }

    const item = {
      product_id: product.id,
      product_name: product.name,
      image: product.image,
      rent_price: product.rent_price,
      variant: form.variant,
      quantity: Number(form.quantity),
      start_date: form.start_date,
      end_date: form.end_date,
    };

    console.log('Item being added to cart:', item); // Debug: check item object
    console.log('Product rent_price:', product.rent_price); // Debug: check rent_price specifically

    const res = addToCart(item);

    if (!res.success) {
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: { message: `❌ ${res.message}`, type: 'error' }
      }));
      return;
    }
  };

  return (
    <div className="min-h-screen text-black pt-20 pb-20 relative overflow-hidden" style={{ backgroundColor: '#fdf8e6' }}>
      {/* Background Radial Blurs */}
      <div className="fixed top-20 left-20 w-96 h-96 rounded-full blur-3xl pointer-events-none -z-10" style={{ backgroundColor: 'rgba(255, 209, 102, 0.3)' }} />
      <div className="fixed bottom-20 right-20 w-96 h-96 rounded-full blur-3xl pointer-events-none -z-10" style={{ backgroundColor: 'rgba(239, 71, 111, 0.2)' }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen rounded-full blur-3xl pointer-events-none -z-10" style={{ backgroundColor: 'rgba(189, 224, 254, 0.2)', transform: 'translate(-50%, -50%)' }} />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Side - Images */}
          <div className="flex flex-col gap-6">
            <div className="aspect-4/5 rounded-3xl overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative" style={{ backgroundColor: 'white' }}>
              {selectedImage ? (
                <img
                  src={getImageUrl(selectedImage)}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-lg">
                  No Image
                </div>
              )}
              <div className="absolute top-4 left-4 border-3 border-black px-4 py-2 rounded-full text-sm font-black text-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#ffd166' }}>
                ✨ Featured
              </div>
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-4">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square rounded-2xl overflow-hidden border-4 border-black transition-all ${
                      selectedImage === img
                        ? 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1'
                        : 'shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Details & Form */}
          <div className="flex flex-col">
            <div className="mb-8">
              {product.theme && (
                <div className="inline-block px-4 py-2 rounded-full border-3 border-black text-black text-sm font-black uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4" style={{ backgroundColor: '#bde0fe', transform: 'rotate(-5deg)' }}>
                  {product.theme} Theme
                </div>
              )}
              <h1 className="text-5xl md:text-6xl font-black text-black mb-6 leading-tight" style={{ fontFamily: "'Chewy', cursive" }}>
                {product.name}
              </h1>
              <div className="bg-white border-3 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                <p className="text-black/80 font-bold leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Rent Price Box */}
            <div className="border-4 border-black rounded-2xl p-5 mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] inline-block" style={{ backgroundColor: '#ef476f' }}>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-black" style={{ fontFamily: "'Chewy', cursive" }}>
                  ₹{product.rent_price}
                </span>
                <span className="text-black/80 font-black text-lg uppercase">Per Day</span>
              </div>
            </div>
            <div className="border-4 border-black rounded-3xl p-6 mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#ffd166' }}>
              <div className="flex items-start gap-4">
                <div className="border-3 border-black p-3 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: 'white' }}>
                  <span className="text-2xl">🛡️</span>
                </div>
                <div>
                  <h3 className="font-black text-black text-lg mb-1">Security Deposit</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-black" style={{ fontFamily: "'Chewy', cursive" }}>
                      ₹{product.security_deposit}
                    </span>
                    <span className="text-black/80 text-sm font-bold">(Refundable on return)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <div className="grow border-4 border-black rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: 'white' }}>
              <form onSubmit={checkAvailability} className="space-y-6">
                {/* Base Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-black text-black uppercase">
                      Age Group
                    </label>
                    <select
                      className="w-full px-4 py-3 border-3 border-black rounded-2xl font-bold text-black focus:outline-none focus:ring-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      style={{ backgroundColor: '#fdf8e6', focusRingColor: '#ef476f' }}
                      value={form.variant}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          variant: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select group</option>
                      {ageGroups.map((group, i) => (
                        <option key={i}>{group}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-black text-black uppercase">
                      Quantity
                    </label>
                    <div className="flex items-center border-3 border-black rounded-2xl overflow-hidden bg-[#fdf8e6] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, quantity: Math.max(1, form.quantity - 1) })}
                        className="px-4 py-3 text-black hover:bg-[#ffd166] transition-colors border-r-3 border-black font-black"
                      >
                        −
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        className="flex-1 text-center font-black text-xl text-black bg-transparent focus:outline-none cursor-text"
                        value={form.quantity}
                        onChange={(e) => {
                          const val = e.target.value.trim();
                          if (val === '') {
                            setForm({ ...form, quantity: '' });
                          } else {
                            const num = parseInt(val);
                            if (!isNaN(num) && num > 0) {
                              setForm({ ...form, quantity: num });
                            }
                          }
                        }}
                        onBlur={() => {
                          if (form.quantity === '' || form.quantity === 0) {
                            setForm({ ...form, quantity: 1 });
                          }
                        }}
                        onFocus={(e) => e.target.select()}
                      />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, quantity: form.quantity + 1 })}
                        className="px-4 py-3 text-black hover:bg-[#06d6a0] transition-colors border-l-3 border-black font-black"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-black text-black uppercase">
                      Booking Start Date
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={form.start_date}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          start_date: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-3 border-black rounded-2xl font-bold text-black focus:outline-none focus:ring-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      style={{ backgroundColor: '#fdf8e6' }}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-black text-black uppercase">
                      Booking End Date
                    </label>
                    <input
                      type="date"
                      min={form.start_date || today}
                      value={form.end_date}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          end_date: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-3 border-black rounded-2xl font-bold text-black focus:outline-none focus:ring-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      style={{ backgroundColor: '#fdf8e6' }}
                      required
                    />
                  </div>
                </div>

                {/* Availability Status & Check Button */}
                <div className="pt-6 border-t-2 border-black/10">
                  {!availability && (
                    <>
                      <button
                        type="submit"
                        disabled={isCheckingAvailability}
                        className="w-full py-4 px-6 rounded-2xl font-black text-black text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        style={{ backgroundColor: '#06d6a0' }}
                      >
                        {isCheckingAvailability ? (
                          "Checking..."
                        ) : (
                          <>🔍 Check Availability</>
                        )}
                      </button>

                      {isCheckingAvailability && (
                        <div className="flex justify-center my-4">
                          <img src="/dance.gif" alt="Checking" className="w-24 h-24" />
                        </div>
                      )}
                    </>
                  )}

                  {availability && Number(form.quantity) > availability.available_quantity && (
                    <div className="border-4 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#ef476f' }}>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">😢</span>
                        <div>
                          <p className="font-black text-black text-lg">Not Available</p>
                          <p className="text-black/80 font-bold">
                            {availability.available_quantity === 0
                              ? "This costume is fully booked for these dates."
                              : `Only ${availability.available_quantity} available for these dates.`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {availability && Number(form.quantity) <= availability.available_quantity && (
                    <div className="border-4 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6" style={{ backgroundColor: '#06d6a0' }}>
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">✅</span>
                        <div>
                          <p className="font-black text-black text-lg">Woohoo! It's Available! 🎉</p>
                          <p className="text-black/80 font-bold">Good news! The costume is available for your selected dates.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Extended Form Fields - Name & Phone */}
                {availability && Number(form.quantity) <= availability.available_quantity && (
                  <div className="space-y-6 pt-6 border-t-2 border-black/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="block text-sm font-black text-black uppercase">
                          Full Name
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Jane Doe"
                          value={form.customer_name}
                          onChange={(e) =>
                            setForm({ ...form, customer_name: e.target.value })
                          }
                          className="w-full px-4 py-3 border-3 border-black rounded-2xl font-bold text-black placeholder:text-black/40 focus:outline-none focus:ring-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                          style={{ backgroundColor: '#fdf8e6' }}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-black text-black uppercase">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={form.phone}
                          onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                          }
                          className="w-full px-4 py-3 border-3 border-black rounded-2xl font-bold text-black placeholder:text-black/40 focus:outline-none focus:ring-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                          style={{ backgroundColor: '#fdf8e6' }}
                          required
                        />
                      </div>
                    </div>

                    {message && (
                      <div className="border-3 border-black rounded-2xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#ef476f' }}>
                        <p className="font-black text-black">{message}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <button
                        type="button"
                        onClick={handleSendRequest}
                        disabled={isSubmitting}
                        className="w-full py-4 px-6 rounded-2xl font-black text-black text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 transition-all disabled:opacity-50"
                        style={{ backgroundColor: '#ffd166' }}
                      >
                        📝 Send Request
                      </button>
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="w-full py-4 px-6 rounded-2xl font-black text-black text-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 transition-all flex items-center justify-center gap-2"
                        style={{ backgroundColor: '#ef476f' }}
                      >
                        🛒 Add to Cart
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Phone Confirmation Dialog */}
      {showPhoneConfirmation && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 max-w-sm w-full">
            <h2 className="text-2xl font-black text-black mb-4" style={{ fontFamily: "'Chewy', cursive" }}>
              📱 Confirm Your Phone
            </h2>

            <p className="text-black/80 font-bold mb-6">
              We'll send WhatsApp updates to this number:
            </p>

            <div className="border-4 border-black rounded-2xl p-6 mb-6 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#bde0fe' }}>
              <p className="text-4xl font-black text-black" style={{ fontFamily: "'Chewy', cursive" }}>
                {normalizedPhoneForConfirm}
              </p>
              <p className="text-sm text-black/80 font-bold mt-2">
                Make sure this is correct!
              </p>
            </div>

            <p className="text-sm text-black/80 font-bold mb-6">
              If this is incorrect, click "No" to edit your phone number.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => handleConfirmPhone(false)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 border-3 border-black text-black rounded-2xl font-black bg-white hover:bg-[#fdf8e6] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 transition-all"
              >
                ❌ No
              </button>
              <button
                onClick={() => handleConfirmPhone(true)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 text-black rounded-2xl font-black border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: '#06d6a0' }}
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block animate-spin">⌛</span>
                    Sending...
                  </>
                ) : (
                  <>✅ Yes</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Message Modal */}
      {whatsappModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-lg w-full max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b-4 border-black" style={{ backgroundColor: '#06d6a0' }}>
              <h2 className="text-2xl font-black text-black" style={{ fontFamily: "'Chewy', cursive" }}>
                ✅ Request Submitted!
              </h2>
              <p className="text-sm text-black/80 font-bold mt-2">
                Now send to: {whatsappModal.customerName}
              </p>
            </div>

            {/* Message Preview */}
            <div className="p-6">
              <p className="text-black font-black mb-3 text-lg">
                Your message:
              </p>
              <div className="border-3 border-black rounded-2xl p-4 mb-6 text-sm whitespace-pre-wrap font-mono text-black max-h-48 overflow-y-auto shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#fdf8e6' }}>
                {whatsappModal.message}
              </div>

              {/* Info Box */}
              <div className="border-3 border-black rounded-2xl p-4 mb-6 text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#bde0fe' }}>
                <p className="text-black font-bold">
                  <strong>💡 Next Step:</strong> Click the button below to open WhatsApp and send your request!
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setWhatsappModal(null)}
                  className="flex-1 px-4 py-3 border-3 border-black text-black rounded-2xl font-black bg-white hover:bg-[#fdf8e6] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
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
                  className="flex-1 px-4 py-3 text-black rounded-2xl font-black border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
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

export default ProductDetails;
