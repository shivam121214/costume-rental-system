import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://costume-rental-system.onrender.com/api/admin/login",
        form
      );

      localStorage.setItem("admin", JSON.stringify(res.data.user));

      navigate("/admin");
    } catch (error) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <form
        onSubmit={login}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md grid gap-4"
      >
        <h1 className="text-3xl font-bold text-center">
          Admin Login
        </h1>

        <input
          name="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button className="bg-slate-900 text-white py-3 rounded-lg">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;