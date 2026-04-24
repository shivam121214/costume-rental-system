import { useEffect, useState } from "react";
import axios from "axios";

function DirectOrder() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    product_id: "",
    variant: "",
    quantity: 1,
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/products");
    setProducts(res.data);
  };

  const selectedProduct = products.find((item) => item.id == form.product_id);

  const ageGroups =
    selectedProduct?.variants && typeof selectedProduct.variants === "object"
      ? Object.keys(selectedProduct.variants)
      : [];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitOrder = async (e) => {
    e.preventDefault();

    await axios.post("http://127.0.0.1:8000/api/direct-order", form);

    alert("Walk-in Order Created!");

    setForm({
      customer_name: "",
      phone: "",
      product_id: "",
      variant: "",
      quantity: 1,
      start_date: "",
      end_date: "",
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Direct Walk-in Order</h1>

        <form onSubmit={submitOrder} className="grid gap-3">
          <input
            className="border p-3 rounded-lg"
            name="customer_name"
            placeholder="Customer Name"
            value={form.customer_name}
            onChange={handleChange}
            required
          />

          <input
            className="border p-3 rounded-lg"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <select
            className="border p-3 rounded-lg"
            name="product_id"
            value={form.product_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Product</option>
            {products.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            className="border p-3 rounded-lg"
            name="variant"
            value={form.variant}
            onChange={handleChange}
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
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            className="border p-3 rounded-lg"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            className="border p-3 rounded-lg"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            required
          />

          {selectedProduct && (
            <div className="bg-slate-50 rounded-xl p-4 mt-2">
              <p>Rent: ₹ {selectedProduct.rent_price}</p>
              <p>Deposit: ₹ {selectedProduct.security_deposit}</p>
            </div>
          )}

          <button className="bg-slate-900 text-white py-3 rounded-lg">
            Create Order
          </button>
        </form>
      </div>
    </div>
  );
}

export default DirectOrder;
