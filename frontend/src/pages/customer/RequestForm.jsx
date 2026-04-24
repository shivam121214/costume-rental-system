import { useEffect, useState } from "react";
import axios from "axios";

function RequestForm() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    product_id: "",
    quantity: "",
    start_date: "",
    end_date: ""
  });

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/products");
    setProducts(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitRequest = async (e) => {
    e.preventDefault();

    await axios.post("http://127.0.0.1:8000/api/requests", form);

    alert("Request Sent!");

    setForm({
      customer_name: "",
      phone: "",
      product_id: "",
      quantity: "",
      start_date: "",
      end_date: ""
    });
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Send Booking Request</h1>

      <form onSubmit={submitRequest} style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
        <input name="customer_name" placeholder="Name" value={form.customer_name} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />

        <select name="product_id" value={form.product_id} onChange={handleChange} required>
          <option value="">Select Product</option>
          {products.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
        <input name="start_date" type="date" value={form.start_date} onChange={handleChange} required />
        <input name="end_date" type="date" value={form.end_date} onChange={handleChange} required />

        <button>Send Request</button>
      </form>
    </div>
  );
}

export default RequestForm;