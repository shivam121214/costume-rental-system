import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Menu,
  Clock,
  CalendarDays,
  AlertTriangle,
  Shirt,
  ClipboardList,
  Tags,
  Star,
  LogOut,
} from "lucide-react";
import { motion } from "motion/react";

function Dashboard() {
  const navigate = useNavigate();
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
    todays_returns: 0,
  });

  useEffect(() => {
    getStats();
  }, []);

  const getStats = async () => {
    try {
      const res = await axios.get(
        "https://costume-rental-system.onrender.com/api/dashboard"
      );
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf8e6] font-sans text-black selection:bg-pink-300 selection:text-black">
      <Header navigate={navigate} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <motion.div
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1
              className="text-4xl md:text-5xl font-black tracking-wide text-black drop-shadow-[3px_3px_0px_#ffd166]"
              style={{ fontFamily: "'Chewy', cursive" }}
            >
              Dashboard
            </h1>
            <p className="font-bold mt-2 text-lg">Welcome back, Boss!</p>
          </div>
        </motion.div>

        <DashboardContent stats={stats} navigate={navigate} />
      </main>
    </div>
  );
}

function Header({ navigate }) {
  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  return (
    <header className="bg-[#fdf8e6] border-b-[3px] border-black sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8 lg:gap-12">
          {/* Logo */}
          <div className="flex flex-col select-none">
            <span
              className="text-2xl md:text-3xl font-black tracking-wider text-[#ef476f]"
              style={{
                fontFamily: "'Chewy', cursive",
                textShadow:
                  "2px 2px 0px #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
              }}
            >
              Aadya Fancy Dresses
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 pl-4">
            {["Costumes", "Accessories", "Themes"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-base font-black text-black hover:text-[#ef476f] transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ActionButton
            icon={<Search size={20} strokeWidth={2.5} />}
            bgColor="bg-[#ffd166]"
          />
          <ActionButton
            icon={<ShoppingCart size={20} strokeWidth={2.5} />}
            bgColor="bg-[#06d6a0]"
          />
          <ActionButton
            icon={<Menu size={20} strokeWidth={2.5} />}
            bgColor="bg-[#bde0fe]"
          />
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-11 h-11 rounded-full flex items-center justify-center border-[2.5px] border-black bg-[#ef476f] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none text-white ml-2"
          >
            <LogOut size={20} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
    </header>
  );
}

function ActionButton({ icon, bgColor }) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ y: 2 }}
      className={`w-11 h-11 rounded-full flex items-center justify-center border-[2.5px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:shadow-none ${bgColor}`}
    >
      {icon}
    </motion.button>
  );
}

function DashboardContent({ stats, navigate }) {
  return (
    <div className="space-y-16">
      {/* Priority Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-8 w-3 bg-[#ef476f] rounded-sm border-2 border-black"></div>
          <h2
            className="text-3xl font-black text-black"
            style={{ fontFamily: "'Chewy', cursive" }}
          >
            Priority Alerts!
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Pending Requests"
            value={stats.pending_requests}
            icon={<Clock className="w-8 h-8 text-black" strokeWidth={2.5} />}
            badgeColor="bg-[#ef476f]"
            badgeTextColor="text-white"
            onClick={() => navigate("/admin/requests")}
          />
          <MetricCard
            title="Today's Returns"
            value={stats.todays_returns}
            icon={
              <CalendarDays className="w-8 h-8 text-black" strokeWidth={2.5} />
            }
            badgeColor="bg-[#a259ff]"
            badgeTextColor="text-white"
            onClick={() => navigate("/admin/todays-returns")}
          />
          <MetricCard
            title="Late Returns"
            value={stats.late_returns}
            icon={
              <AlertTriangle className="w-8 h-8 text-black" strokeWidth={2.5} />
            }
            badgeColor="bg-[#ffd166]"
            badgeTextColor="text-black"
            onClick={() => navigate("/admin/late-returns")}
          />
        </div>
      </motion.section>

      {/* Status Section */}
      <motion.section
        className="bg-[#fdf8e6] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-12 border-y-[3px] border-black"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <h2
              className="text-3xl font-black text-black bg-white px-4 py-1 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block transform -rotate-2"
              style={{ fontFamily: "'Chewy', cursive" }}
            >
              Current Status
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricCard
              title="Active Rentals"
              value={stats.active_rentals}
              icon={<Shirt className="w-8 h-8 text-black" strokeWidth={2.5} />}
              badgeColor="bg-[#b1e868]"
              badgeTextColor="text-black"
              onClick={() => navigate("/admin/active-rentals")}
            />
            <MetricCard
              title="Total Bookings"
              value={stats.total_bookings}
              icon={
                <ClipboardList className="w-8 h-8 text-black" strokeWidth={2.5} />
              }
              badgeColor="bg-[#e86868]"
              badgeTextColor="text-black"
            />
          </div>
        </div>
      </motion.section>

      {/* Business Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Star className="w-8 h-8 fill-[#ffd166] text-black stroke-2" />
          <h2
            className="text-3xl font-black text-black"
            style={{ fontFamily: "'Chewy', cursive" }}
          >
            Business Overview
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Total Products"
            value={stats.total_products}
            icon={<Tags className="w-8 h-8 text-black" strokeWidth={2.5} />}
            badgeColor="bg-[#06d6a0]"
            badgeTextColor="text-black"
            onClick={() => navigate("/admin/products")}
          />
        </div>
      </motion.section>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  badgeColor,
  badgeTextColor,
  onClick,
}) {
  const shadowColors = ["bg-[#ef476f]", "bg-[#ffd166]", "bg-[#4dd0e1]"];
  const [shadowColor] = useState(
    () => shadowColors[Math.floor(Math.random() * shadowColors.length)]
  );

  return (
    <motion.div
      className="group relative cursor-pointer"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Colored Shadow background for 3D effect */}
      <div
        className={`absolute inset-0 ${shadowColor} border-[3px] border-black rounded-2xl transform translate-x-2 translate-y-2 transition-transform group-hover:translate-x-3 group-hover:translate-y-3`}
      ></div>

      {/* Main Card Content */}
      <div className="relative h-full bg-white border-[3px] border-black rounded-2xl p-6 transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1 flex flex-col justify-between z-10">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-bold leading-tight text-black max-w-[60%]">
            {title}
          </h3>
          <div className="p-2 bg-[#f3f4f6] rounded-xl border-2 border-black">
            {icon}
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div
            className={`px-4 py-1.5 rounded-full border-[3px] border-black font-black text-2xl ${badgeColor} ${badgeTextColor}`}
          >
            {value}
          </div>
          {/* Decorative dots */}
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-black"></div>
            <div className="w-2 h-2 rounded-full bg-black"></div>
            <div className="w-2 h-2 rounded-full bg-black"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;
