import { useEffect, useState } from "react";
import {
  getCart,
  removeFromCart,
  updateCartItem,
} from "../../utils/cart";

function Cart() {
  const [cart, setCart] = useState([]);

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
        Cart is empty
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

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
                <h2 className="font-semibold text-lg">
                  {item.product_name}
                </h2>

                <p className="text-sm text-slate-500">
                  Size: {item.variant}
                </p>

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
      </div>
    </div>
  );
}

export default Cart;