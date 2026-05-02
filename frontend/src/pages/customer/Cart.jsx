import { useEffect, useState } from "react";
import { getCart, removeFromCart, updateCartItem } from "../../utils/cart";
import axios from "axios";

function Cart() {
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSendRequest = async () => {
    if (!customerName || !phone) {
      alert("Enter name and phone");
      return;
    }

    try {
      for (let item of cart) {
        await axios.post(
          "https://costume-rental-system.onrender.com/api/requests",
          {
            product_id: item.product_id,
            variant: item.variant,
            quantity: item.quantity,
            start_date: item.start_date,
            end_date: item.end_date,
            customer_name: customerName,
            phone: phone,
          },
        );
      }

      alert("Request sent successfully");

      localStorage.removeItem("cart");
      setCart([]);
    } catch (err) {
      alert("Error sending request");
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
    return <div className="p-6 text-center text-slate-500">Cart is empty</div>;
  }

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
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        <button
          onClick={checkAllAvailability}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
        >
          Check All Availability
        </button>

        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-xl shadow flex gap-4"
            >
              <img
                src={item.image}
                alt=""
                className="w-24 h-24 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h2 className="font-semibold text-lg">{item.product_name}</h2>

                <p className="text-sm text-slate-500">Size: {item.variant}</p>

                <div className="flex gap-3 mt-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleChange(item.id, "quantity", e.target.value)
                    }
                    className="border p-2 rounded w-20"
                  />

                  <input
                    type="date"
                    value={item.start_date}
                    onChange={(e) =>
                      handleChange(item.id, "start_date", e.target.value)
                    }
                    className="border p-2 rounded"
                  />

                  <input
                    type="date"
                    value={item.end_date}
                    onChange={(e) =>
                      handleChange(item.id, "end_date", e.target.value)
                    }
                    className="border p-2 rounded"
                  />
                </div>
                {item.is_available !== null && (
                  <p
                    className={`mt-2 text-sm font-medium ${
                      item.is_available ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.is_available ? "Available" : item.message}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleRemove(item.id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        {allAvailable && (
          <div className="mt-6 bg-white p-4 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-3">Send Request</h2>

            <input
              type="text"
              placeholder="Your Name"
              className="border p-3 rounded-lg w-full mb-3"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Phone Number"
              className="border p-3 rounded-lg w-full mb-3"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button
              onClick={handleSendRequest}
              className="bg-yellow-400 py-3 rounded-lg w-full font-semibold"
            >
              Send Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
