import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [stats, setStats] = useState({
    total_products: 0,
    pending_requests: 0,
    total_bookings: 0,
    active_rentals: 0,
    late_returns: 0,
    total_revenue: 0,
    paid_amount: 0,
    pending_amount: 0,
    partial_count: 0,
  });

  useEffect(() => {
    getStats();
  }, []);

  const getStats = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/dashboard");
    setStats(res.data);
  };

  const card = "bg-white rounded-2xl shadow-md p-6 border border-slate-100";

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 mb-8">Dashboard</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className={card}>
            <p className="text-slate-500">Total Products</p>
            <h2 className="text-4xl font-bold mt-2">{stats.total_products}</h2>
          </div>

          <div className={card}>
            <p className="text-slate-500">Pending Requests</p>
            <h2 className="text-4xl font-bold mt-2 text-orange-500">
              {stats.pending_requests}
            </h2>
          </div>

          <div className={card}>
            <p className="text-slate-500">Total Bookings</p>
            <h2 className="text-4xl font-bold mt-2">{stats.total_bookings}</h2>
          </div>

          <div className={card}>
            <p className="text-slate-500">Active Rentals</p>
            <h2 className="text-4xl font-bold mt-2 text-blue-600">
              {stats.active_rentals}
            </h2>
          </div>

          <div className={card}>
            <p className="text-slate-500">Late Returns</p>
            <h2 className="text-4xl font-bold mt-2 text-red-500">
              {stats.late_returns}
            </h2>
          </div>

          <div className={card}>
            <p className="text-slate-500">Total Revenue</p>
            <h2 className="text-4xl font-bold mt-2 text-green-600">
              ₹ {stats.total_revenue}
            </h2>
          </div>

          <div className={card}>
            <p className="text-slate-500">Paid Amount</p>
            <h2 className="text-4xl font-bold mt-2 text-emerald-600">
              ₹ {stats.paid_amount}
            </h2>
          </div>

          <div className={card}>
            <p className="text-slate-500">Pending Amount</p>
            <h2 className="text-4xl font-bold mt-2 text-red-500">
              ₹ {stats.pending_amount}
            </h2>
          </div>

          <div className={card}>
            <p className="text-slate-500">Partial Payments</p>
            <h2 className="text-4xl font-bold mt-2 text-orange-500">
              {stats.partial_count}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
