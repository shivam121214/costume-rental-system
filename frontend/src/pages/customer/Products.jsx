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
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 mb-6">
          Browse Costumes
        </h1>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <input
            type="text"
            placeholder="Search costume..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white rounded-xl p-4 shadow"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-white rounded-xl p-4 shadow"
          >
            <option value="">All Categories</option>
            {categories.map((cat, i) => (
              <option key={i}>{cat}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white rounded-xl p-4 shadow"
          >
            <option value="">Sort By</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <Link
              to={`/products/${item.id}`}
              key={item.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden block hover:shadow-xl transition"
            >
              <div className="h-52 bg-slate-200 flex items-center justify-center text-slate-500">
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

              <div className="p-5">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-slate-500">{item.category}</p>

                <div className="mt-4">
                  <span className="font-bold text-lg">
                    ₹ {item.rent_price} Rent
                  </span>

                  <p className="text-sm text-slate-500 mt-1">
                    + ₹ {item.security_deposit} Security Deposit
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Products;
