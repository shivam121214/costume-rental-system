import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { addToCart } from "../../utils/cart";

function ProductDetails() {
  const { id } = useParams();
  const API_URL = "https://costume-rental-system.onrender.com";
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}/storage/${path}`;
  };

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [message, setMessage] = useState("");

  const [availability, setAvailability] = useState(null);

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

  const submitRequest = async (e) => {
    e.preventDefault();

    if (
      availability &&
      Number(form.quantity) > availability.available_quantity
    ) {
      setMessage("Selected quantity is not available");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/requests`, {
        product_id: id,
        ...form,
      });

      setMessage("Request sent successfully! We will contact you soon.");

      setForm({
        customer_name: "",
        phone: "",
        variant: "",
        quantity: 1,
        start_date: "",
        end_date: "",
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Selected quantity is not available",
      );
    }
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

              <button
                type="button"
                onClick={handleAddToCart}
                className="bg-slate-700 text-white py-3 rounded-lg"
              >
                Add to Cart
              </button>
            </form>

            {availability && (
              <p className="mt-3 font-semibold">
                <span
                  className={
                    availability.available_quantity > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  Available: {availability.available_quantity}
                </span>
              </p>
            )}

            {availability &&
              Number(form.quantity) > availability.available_quantity && (
                <p className="text-red-600 mt-2">
                  Selected quantity is not available
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
                    onClick={submitRequest}
                    className="bg-yellow-400 py-3 rounded-lg font-semibold"
                  >
                    Send Booking Request
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
