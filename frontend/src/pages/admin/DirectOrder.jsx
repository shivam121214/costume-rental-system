import { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDays, Hash, Package, Phone, User, Users, ArrowRight, ChevronDown } from "lucide-react";

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
    const res = await axios.get("https://costume-rental-system.onrender.com/api/products");
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

    await axios.post("https://costume-rental-system.onrender.com/api/direct-order", form);

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
    <div className="min-h-screen flex items-center justify-center p-4 pt-20 pb-20" style={{ backgroundColor: '#fdf8e6' }}>
      {/* Decorative background blurs */}
      <div className="fixed top-20 left-20 w-96 h-96 rounded-full blur-3xl pointer-events-none -z-10" style={{ backgroundColor: 'rgba(255, 209, 102, 0.3)' }} />
      <div className="fixed bottom-20 right-20 w-96 h-96 rounded-full blur-3xl pointer-events-none -z-10" style={{ backgroundColor: 'rgba(239, 71, 111, 0.2)' }} />

      {/* Main cartoony card container */}
      <div className="w-full max-w-6xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col lg:flex-row overflow-hidden rounded-3xl relative z-10">
        
        {/* Left Side: Promo Panel */}
        <div className="lg:w-5/12 p-8 lg:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden border-b-4 lg:border-b-0 lg:border-r-4 border-black" style={{ backgroundColor: '#ff5c8d' }}>
          
          {/* Decorative background shapes */}
          <div className="absolute top-10 left-10 w-20 h-20 rounded-full border-3 border-black opacity-40 -z-10" style={{ backgroundColor: '#ffd166', animation: 'bounce 2s infinite' }} />
          <div className="absolute bottom-20 right-10 w-16 h-16 rotate-45 border-3 border-black opacity-40 -z-10" style={{ backgroundColor: '#bde0fe' }} />

          {/* Cartoony Image Frame */}
          <div className="relative z-10 w-full aspect-square max-w-xs mx-auto mb-8 mt-4">
            {/* Fake shadow block */}
            <div className="absolute inset-0 bg-black rounded-3xl translate-x-3 translate-y-3" />
            <img 
              src="https://images.unsplash.com/photo-1624623327145-68298404e205?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraWRzJTIwZmFuY3klMjBkcmVzcyUyMGNvc3R1bWV8ZW58MXx8fHwxNzc5MjI4MTM3fDA&ixlib=rb-4.1.0&q=80&w=1080" 
              alt="Kids in fancy dress"
              className="w-full h-full object-cover rounded-3xl border-4 border-black relative z-10 -rotate-3 hover:rotate-0 transition-transform duration-300"
            />
          </div>
          
          <div className="relative z-10 mt-auto">
            <h2 
              className="text-4xl lg:text-5xl font-black mb-6 text-white leading-tight" 
              style={{ fontFamily: "'Chewy', cursive", textShadow: '4px 4px 0 rgba(0,0,0,0.5)' }}
            >
              Ready for<br/>Adventure!
            </h2>
            <div className="inline-block transform hover:scale-105 transition-transform">
              <p className="text-xl font-bold text-black px-6 py-3 rounded-2xl border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" style={{ backgroundColor: '#ffd166' }}>
                Quick walk-in magic ✨
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:w-7/12 p-8 md:p-12 lg:p-14 bg-white relative">
          
          <div className="mb-8 pb-6 border-b-4 border-black border-dashed">
            <h2 className="text-4xl lg:text-5xl font-black text-black mb-3" style={{ fontFamily: "'Chewy', cursive" }}>
              Direct Walk-in Order
            </h2>
            <p className="text-lg font-bold text-black/70">
              Fill in the details below for a super fast checkout! 🚀
            </p>
          </div>

          <form onSubmit={submitOrder} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Name */}
              <div className="space-y-2">
                <label className="text-lg font-black text-black ml-2">Customer Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <User className="h-6 w-6 text-black" strokeWidth={3} />
                  </div>
                  <input 
                    type="text" 
                    name="customer_name"
                    placeholder="e.g. John Doe" 
                    value={form.customer_name}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white border-3 border-black rounded-2xl text-black font-bold text-lg placeholder-black/40 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-lg font-black text-black ml-2">Phone Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Phone className="h-6 w-6 text-black" strokeWidth={3} />
                  </div>
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="+1 (555) 000-0000" 
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white border-3 border-black rounded-2xl text-black font-bold text-lg placeholder-black/40 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Select Product */}
              <div className="space-y-2">
                <label className="text-lg font-black text-black ml-2">Select Costume</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Package className="h-6 w-6 text-black" strokeWidth={3} />
                  </div>
                  <select 
                    name="product_id"
                    value={form.product_id}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-12 py-3.5 bg-white border-3 border-black rounded-2xl text-black font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Choose a costume...</option>
                    {products.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
                    <ChevronDown className="h-6 w-6 text-black" strokeWidth={3} />
                  </div>
                </div>
              </div>

              {/* Select Age Group */}
              <div className="space-y-2">
                <label className="text-lg font-black text-black ml-2">Age Group</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Users className="h-6 w-6 text-black" strokeWidth={3} />
                  </div>
                  <select 
                    name="variant"
                    value={form.variant}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-12 py-3.5 bg-white border-3 border-black rounded-2xl text-black font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select age...</option>
                    {ageGroups.map((group, i) => (
                      <option key={i} value={group}>{group}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none z-10">
                    <ChevronDown className="h-6 w-6 text-black" strokeWidth={3} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-lg font-black text-black ml-2">Quantity</label>
              <div className="relative w-full md:w-1/2 md:pr-3 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Hash className="h-6 w-6 text-black" strokeWidth={3} />
                </div>
                <input 
                  type="number" 
                  name="quantity"
                  min="1"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-3 border-black rounded-2xl text-black font-bold text-lg placeholder-black/40 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Date */}
              <div className="space-y-2">
                <label className="text-lg font-black text-black ml-2">Pickup Date</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <CalendarDays className="h-6 w-6 text-black" strokeWidth={3} />
                  </div>
                  <input 
                    type="date" 
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white border-3 border-black rounded-2xl text-black font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  />
                </div>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label className="text-lg font-black text-black ml-2">Return Date</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <CalendarDays className="h-6 w-6 text-black" strokeWidth={3} />
                  </div>
                  <input 
                    type="date" 
                    name="end_date"
                    value={form.end_date}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white border-3 border-black rounded-2xl text-black font-bold text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-0.5 focus:translate-y-0.5 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Product Info */}
            {selectedProduct && (
              <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="px-4 py-3 rounded-2xl border-3 border-black font-black text-black text-center" style={{ backgroundColor: '#ffd166' }}>
                    <p className="text-sm opacity-70">Rent Price</p>
                    <p className="text-2xl">₹ {selectedProduct.rent_price}</p>
                  </div>
                  <div className="px-4 py-3 rounded-2xl border-3 border-black font-black text-black text-center" style={{ backgroundColor: '#bde0fe' }}>
                    <p className="text-sm opacity-70">Security Deposit</p>
                    <p className="text-2xl">₹ {selectedProduct.security_deposit}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="submit"
                className="w-full py-5 font-black text-2xl text-black border-4 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1.5 active:translate-x-1.5 active:shadow-none transition-all flex items-center justify-center gap-3 group"
                style={{ backgroundColor: '#06d6a0', fontFamily: "'Chewy', cursive" }}
              >
                Create Order 
                <ArrowRight size={32} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default DirectOrder;
