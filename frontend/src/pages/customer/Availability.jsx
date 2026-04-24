import { useEffect, useState } from "react";
import axios from "axios";

function Availability() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    start_date: "",
    end_date: ""
  });
  const [result, setResult] = useState(null);

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

  const checkAvailability = async (e) => {
    e.preventDefault();

    const res = await axios.post(
      "http://127.0.0.1:8000/api/check-availability",
      form
    );

    setResult(res.data);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Check Availability</h1>

      <form onSubmit={checkAvailability} style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
        <select name="product_id" value={form.product_id} onChange={handleChange} required>
          <option value="">Select Product</option>
          {products.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        <input type="date" name="start_date" value={form.start_date} onChange={handleChange} required />
        <input type="date" name="end_date" value={form.end_date} onChange={handleChange} required />

        <button>Check</button>
      </form>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <p>Total: {result.total_quantity}</p>
          <p>Booked: {result.booked_quantity}</p>
          <h3>Available: {result.available_quantity}</h3>
        </div>
      )}
    </div>
  );
}

export default Availability;