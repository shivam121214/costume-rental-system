import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [searchParams] = useSearchParams();
  const API_URL = "https://costume-rental-system.onrender.com";
  
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}/storage/${path}`;
  };

  useEffect(() => {
    getProducts();
    // Get category from URL params if present
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setCategory(categoryParam);
    }
  }, [searchParams]);

  const getProducts = async () => {
    const res = await axios.get(`${API_URL}/api/products`);
    setProducts(res.data);
  };

  const categories = [
    ...new Set(products.map((item) => item.category).filter(Boolean)),
  ];

  let filtered = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (category) {
    filtered = filtered.filter((item) => item.category === category);
  }

  if (sort === "low") {
    filtered.sort((a, b) => a.rent_price - b.rent_price);
  }

  if (sort === "high") {
    filtered.sort((a, b) => b.rent_price - a.rent_price);
  }

  return (
    <div className="min-h-screen bg-[#fdf8e6] text-black pt-20 pb-20 relative overflow-hidden">
      {/* Background Radial Blurs */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-[#ffd166]/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-[#ef476f]/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen bg-[#bde0fe]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <h1 className="text-5xl md:text-6xl font-black text-black mb-8" style={{ fontFamily: "'Chewy', cursive" }}>
          🎨 Browse Costumes
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Search costume..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 bg-white border-3 border-black rounded-2xl font-bold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ef476f] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-3 bg-white border-3 border-black rounded-2xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#ef476f] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all appearance-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat, i) => (
              <option key={i}>{cat}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-3 bg-white border-3 border-black rounded-2xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#ef476f] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all appearance-none"
          >
            <option value="">Sort By</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((item) => {
          const shadowColors = ["bg-[#ef476f]", "bg-[#ffd166]", "bg-[#06d6a0]", "bg-[#bde0fe]", "bg-[#8338ec]"];
          const randomShadowColor = shadowColors[item.id % shadowColors.length];

          return (
            <Link
              to={`/products/${item.id}`}
              key={item.id}
              className="group relative"
            >
              {/* Shadow Background */}
              <div className={`absolute inset-0 ${randomShadowColor} border-4 border-black rounded-3xl transform translate-x-2 translate-y-2 transition-transform group-hover:translate-x-3 group-hover:translate-y-3`}></div>

              {/* Main Card */}
              <div className="relative h-full bg-white border-4 border-black rounded-3xl overflow-hidden transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1 flex flex-col">
                <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden border-b-4 border-black">
                  {item.image ? (
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "No Image"
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-black text-black leading-tight">{item.name}</h3>
                  <p className="text-sm text-gray-600 font-bold uppercase">{item.category}</p>

                  <div className="mt-4 mb-3 flex-1">
                    <div className="inline-block bg-[#ef476f] text-white border-3 border-black rounded-full px-4 py-1 font-black text-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      ₹{item.rent_price}
                    </div>

                    <p className="text-xs font-bold text-gray-600 mt-2">
                      + ₹{item.security_deposit} Security Deposit
                    </p>
                  </div>

                  {/* Decorative Dots */}
                  <div className="flex gap-1 justify-center mt-2">
                    <div className="w-2 h-2 rounded-full bg-black"></div>
                    <div className="w-2 h-2 rounded-full bg-black"></div>
                    <div className="w-2 h-2 rounded-full bg-black"></div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
        </div>

        {filtered.length === 0 && (
          <div className="border-4 border-black border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
            <div className="bg-[#ffd166] p-6 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
              <span className="text-5xl">🎭</span>
            </div>
            <h3 className="text-3xl text-black mb-3 font-black" style={{ fontFamily: "'Chewy', cursive" }}>
              Oops! No costumes found.
            </h3>
            <p className="text-gray-600 font-bold text-lg max-w-md mb-6">
              We couldn't find any costumes matching your search. Try adjusting your filters!
            </p>
            <button 
              onClick={() => {
                setSearch("");
                setCategory("");
                setSort("");
              }}
              className="px-8 py-3 bg-[#06d6a0] text-black border-4 border-black rounded-2xl font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all"
              style={{ fontFamily: "'Chewy', cursive" }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
