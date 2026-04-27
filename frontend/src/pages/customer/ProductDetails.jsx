import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

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

  const [availabilityForm, setAvailabilityForm] = useState({
    variant: "",
    start_date: "",
    end_date: "",
  });

  const [availability, setAvailability] = useState(null);

  const [requestForm, setRequestForm] = useState({
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
      ...availabilityForm,
    });

    setAvailability(res.data);
  };

  const submitRequest = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/api/requests`, {
        product_id: id,
        ...requestForm,
      });

      alert("Request Sent Successfully!");

      setRequestForm({
        customer_name: "",
        phone: "",
        variant: "",
        quantity: 1,
        start_date: "",
        end_date: "",
      });
    } catch (error) {
      alert(
        error.response?.data?.message || "Unable to send request right now.",
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
            <h2 className="text-xl font-semibold mb-3">Check Availability</h2>

            <form onSubmit={checkAvailability} className="grid gap-3">
              <select
                className="border p-3 rounded-lg"
                value={availabilityForm.variant}
                onChange={(e) =>
                  setAvailabilityForm({
                    ...availabilityForm,
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
                type="date"
                className="border p-3 rounded-lg"
                value={availabilityForm.start_date}
                onChange={(e) =>
                  setAvailabilityForm({
                    ...availabilityForm,
                    start_date: e.target.value,
                  })
                }
                required
              />

              <input
                type="date"
                className="border p-3 rounded-lg"
                value={availabilityForm.end_date}
                onChange={(e) =>
                  setAvailabilityForm({
                    ...availabilityForm,
                    end_date: e.target.value,
                  })
                }
                required
              />

              <button className="bg-slate-900 text-white py-3 rounded-lg">
                Check
              </button>
            </form>

            {availability && (
              <p className="mt-3 font-semibold">
                Available: {availability.available_quantity}
              </p>
            )}
          </div>

          {/* Request Form */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-3">Send Booking Request</h2>

            <form onSubmit={submitRequest} className="grid gap-3">
              <input
                className="border p-3 rounded-lg"
                placeholder="Your Name"
                value={requestForm.customer_name}
                onChange={(e) =>
                  setRequestForm({
                    ...requestForm,
                    customer_name: e.target.value,
                  })
                }
                required
              />

              <input
                className="border p-3 rounded-lg"
                placeholder="Phone Number"
                value={requestForm.phone}
                onChange={(e) =>
                  setRequestForm({
                    ...requestForm,
                    phone: e.target.value,
                  })
                }
                required
              />

              <select
                className="border p-3 rounded-lg"
                value={requestForm.variant}
                onChange={(e) =>
                  setRequestForm({
                    ...requestForm,
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
                value={requestForm.quantity}
                onChange={(e) =>
                  setRequestForm({
                    ...requestForm,
                    quantity: e.target.value,
                  })
                }
                required
              />

              <input
                type="date"
                className="border p-3 rounded-lg"
                value={requestForm.start_date}
                onChange={(e) =>
                  setRequestForm({
                    ...requestForm,
                    start_date: e.target.value,
                  })
                }
                required
              />

              <input
                type="date"
                className="border p-3 rounded-lg"
                value={requestForm.end_date}
                onChange={(e) =>
                  setRequestForm({
                    ...requestForm,
                    end_date: e.target.value,
                  })
                }
                required
              />

              <button className="bg-yellow-400 py-3 rounded-lg font-semibold">
                Send Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
