import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Trash2 } from "lucide-react";
import { motion } from "motion/react";

function Products() {
  const emptyForm = {
    name: "",
    theme: "Seasonal",
    description: "",
    image: null,
    gallery: [],
    existingGallery: [],
    rent_price: "",
    security_deposit: "",
    sizes: "",
    status: "available",
    is_featured: false,
    variants: {
      "3-5 Years": "",
      "6-10 Years": "",
      "11-15 Years": "",
      Adult: "",
    },
  };

  const API_URL = "https://costume-rental-system.onrender.com";
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}/storage/${path}`;
  };
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [toggleLoading, setToggleLoading] = useState({});
  const [showStockModal, setShowStockModal] = useState(null);
  const [stockLoading, setStockLoading] = useState({});

  useEffect(() => {
    // Load from localStorage if available, otherwise fetch from API
    const cachedProducts = localStorage.getItem('adminProducts');
    
    if (cachedProducts) {
      setProducts(JSON.parse(cachedProducts));
      setHasLoadedOnce(true);
    } else {
      getProducts();
    }
  }, []);

  const getProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/admin/products`);
      setProducts(res.data);
      // Cache products to localStorage
      localStorage.setItem('adminProducts', JSON.stringify(res.data));
      setHasLoadedOnce(true);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else if (name === "gallery") {
      setForm({ ...form, gallery: Array.from(files) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleVariant = (key, value) => {
    setForm({
      ...form,
      variants: {
        ...form.variants,
        [key]: value,
      },
    });
  };

  const totalQty = Object.values(form.variants).reduce(
    (sum, val) => sum + Number(val || 0),
    0,
  );

  const saveProduct = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", form.name);
    data.append("theme", form.theme);
    data.append("description", form.description || "");
    data.append("rent_price", form.rent_price);
    data.append("security_deposit", form.security_deposit);
    data.append("status", form.status);
    data.append("sizes", form.sizes || "");
    data.append("is_featured", form.is_featured ? "1" : "0");

    data.append("variants", JSON.stringify(form.variants));
    data.append("total_quantity", totalQty);
    data.append("existingGallery", JSON.stringify(form.existingGallery || []));

    if (form.image instanceof File) {
      data.append("image", form.image);
    }

    if (form.gallery && form.gallery.length > 0) {
      form.gallery.forEach((file) => {
        if (file instanceof File) {
          data.append("gallery[]", file);
        }
      });
    }

    try {
      if (editId) {
        await axios.post(`${API_URL}/api/products/${editId}?_method=PUT`, data);
        window.dispatchEvent(new CustomEvent('showNotification', {
          detail: { message: "✅ Product updated successfully!", type: 'success' }
        }));
      } else {
        await axios.post(`${API_URL}/api/products`, data);
        window.dispatchEvent(new CustomEvent('showNotification', {
          detail: { message: "✅ Product added successfully!", type: 'success' }
        }));
      }

      setForm(emptyForm);
      setEditId(null);
      getProducts();
    } catch (error) {
      console.log(error.response.data);
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: { message: `❌ ${error.response?.data?.message || "Upload failed"}`, type: 'error' }
      }));
    }
  };

  const editProduct = (item) => {
    setForm({
      ...item,
      image: null,
      gallery: [],
      existingGallery: item.gallery || [],
      is_featured: item.is_featured || false,
      variants: item.variants || emptyForm.variants,
    });

    setEditId(item.id);
    setShowForm(true);
  };

  const deleteProduct = async (id) => {
    const input = prompt(
      "Warning: This will permanently delete the product.\nType CONFIRM to continue.",
    );

    if (input !== "CONFIRM") {
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: { message: "❌ Delete cancelled", type: 'error' }
      }));
      return;
    }

    setToggleLoading(prev => ({ ...prev, [`delete-${id}`]: true }));
    try {
      await axios.delete(`${API_URL}/api/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: { message: "✅ Product deleted successfully!", type: 'success' }
      }));
    } catch (error) {
      console.error("Error deleting product:", error);
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: { message: "❌ Failed to delete product", type: 'error' }
      }));
    } finally {
      setToggleLoading(prev => ({ ...prev, [`delete-${id}`]: false }));
    }
  };

  const toggleFeatured = async (id, currentStatus) => {
    setToggleLoading(prev => ({ ...prev, [`featured-${id}`]: true }));
    try {
      await axios.post(`${API_URL}/api/products/${id}/toggle-featured`);
      setProducts(prev => prev.map(p => 
        p.id === id ? { ...p, is_featured: !p.is_featured } : p
      ));
      localStorage.setItem('adminProducts', JSON.stringify(products));
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: { message: `✅ Product ${currentStatus ? "removed from" : "added to"} featured!`, type: 'success' }
      }));
    } catch (error) {
      console.error("Error toggling featured:", error);
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: { message: "❌ Failed to toggle featured status", type: 'error' }
      }));
    } finally {
      setToggleLoading(prev => ({ ...prev, [`featured-${id}`]: false }));
    }
  };

  const toggleFeaturedSection = async (id, currentStatus) => {
    setToggleLoading(prev => ({ ...prev, [`section-${id}`]: true }));
    try {
      await axios.post(`${API_URL}/api/products/${id}/toggle-featured-section`);
      setProducts(prev => prev.map(p => 
        p.id === id ? { ...p, show_on_featured_section: !p.show_on_featured_section } : p
      ));
      localStorage.setItem('adminProducts', JSON.stringify(products));
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: { message: `✅ Product ${currentStatus ? "removed from" : "added to"} Featured Section!`, type: 'success' }
      }));
    } catch (error) {
      console.error("Error toggling featured section:", error);
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: { message: "❌ Failed to toggle featured section status", type: 'error' }
      }));
    } finally {
      setToggleLoading(prev => ({ ...prev, [`section-${id}`]: false }));
    }
  };

  const toggleVisibility = async (item) => {
    const data = new FormData();

    data.append("name", item.name);
    data.append("theme", item.theme);
    data.append("description", item.description || "");
    data.append("rent_price", item.rent_price);
    data.append("security_deposit", item.security_deposit);
    data.append("sizes", item.sizes || "");
    data.append("variants", JSON.stringify(item.variants || {}));
    data.append("total_quantity", item.total_quantity);
    data.append("existingGallery", JSON.stringify(item.gallery || []));
    data.append(
      "status",
      item.status === "available" ? "unavailable" : "available",
    );

    setToggleLoading(prev => ({ ...prev, [`visibility-${item.id}`]: true }));
    try {
      await axios.post(`${API_URL}/api/products/${item.id}?_method=PUT`, data);
      setProducts(prev => prev.map(p => 
        p.id === item.id ? { ...p, status: item.status === "available" ? "unavailable" : "available" } : p
      ));
      localStorage.setItem('adminProducts', JSON.stringify(products));
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: { message: `✅ Product ${item.status === "available" ? "hidden" : "shown"} successfully!`, type: 'success' }
      }));
    } catch (error) {
      console.error("Error toggling visibility:", error);
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: { message: "❌ Failed to toggle visibility", type: 'error' }
      }));
    } finally {
      setToggleLoading(prev => ({ ...prev, [`visibility-${item.id}`]: false }));
    }
  };

  const removeGalleryImage = (index) => {
    const updated = [...form.gallery];
    updated.splice(index, 1);

    setForm({
      ...form,
      gallery: updated,
    });
  };

  const removeCoverImage = () => {
    setForm({
      ...form,
      image: null,
    });
  };

  const removeExistingImage = (index) => {
    const updated = [...form.existingGallery];
    updated.splice(index, 1);

    setForm({
      ...form,
      existingGallery: updated,
    });
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(emptyForm);
    setEditId(null);
  };

  const checkLiveStock = async (product) => {
    // Fetch live availability for each variant for today's date
    const today = new Date().toISOString().slice(0, 10);
    setStockLoading(prev => ({ ...prev, [product.id]: true }));

    try {
      const variants = product.variants || {};
      const liveVariants = {};
      let totalAvailable = 0;

      for (const [size] of Object.entries(variants)) {
        try {
          const res = await axios.post(`${API_URL}/api/check-availability`, {
            product_id: product.id,
            variant: size,
            start_date: today,
            end_date: today,
          });

          liveVariants[size] = res.data;
          totalAvailable += Number(res.data.available_quantity || 0);
        } catch (err) {
          // if an individual variant fails, fallback to stored value
          liveVariants[size] = { available_quantity: variants[size] || 0 };
        }
      }

      setShowStockModal({ ...product, liveVariants, total_available: totalAvailable });
    } catch (err) {
      console.error('Failed to fetch live availability', err);
      setShowStockModal(product);
    } finally {
      setStockLoading(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fdf8e6] text-black relative overflow-hidden pt-20">
      {/* Background Radial Blurs */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-[#ffd166]/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-[#ef476f]/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen bg-[#bde0fe]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* Add Product Button */}
        {!showForm && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-4 bg-[#ffd166] text-black border-4 border-black rounded-2xl font-black text-lg uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
              style={{ fontFamily: "'Chewy', cursive" }}
            >
              ➕ Add New Product!
            </button>
          </motion.div>
        )}
        
        {/* Top Section: Form and Search */}
        {showForm && (
          <motion.section
            className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Add Product Form */}
            <div className="xl:col-span-7">
              <form
                onSubmit={saveProduct}
                className="bg-linear-to-br from-[#ffd166] to-[#ffea94] rounded-3xl border-4 border-black p-6 md:p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="flex items-center justify-between gap-2 mb-8">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">✨</span>
                    <h2
                      className="text-3xl md:text-4xl font-black text-black"
                      style={{ fontFamily: "'Chewy', cursive" }}
                    >
                      Add New Product!
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="w-10 h-10 flex items-center justify-center bg-[#ef476f] text-white border-3 border-black rounded-full font-black text-xl hover:bg-[#ff5c8d] transition-colors"
                  >
                    ✕
                  </button>
                </div>

              {/* Form Grid */}
              <div className="space-y-4">
                {/* Product Name & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wide mb-2">
                      Product Name
                    </label>
                    <input
                      className="w-full px-4 py-3 bg-white border-3 border-black rounded-2xl font-bold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ef476f]"
                      name="name"
                      placeholder="e.g. Magical Princess"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wide mb-2">
                      Theme
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-white border-3 border-black rounded-2xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#ef476f]"
                      name="theme"
                      value={form.theme}
                      onChange={handleChange}
                      required
                    >
                      <option value="Seasonal">Seasonal</option>
                      <option value="Christmas">Christmas</option>
                      <option value="Halloween">Halloween</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Superhero">Superhero</option>
                      <option value="Princess">Princess</option>
                      <option value="Animal">Animal</option>
                      <option value="Funny">Funny</option>
                      <option value="Scary">Scary</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wide mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-3 bg-white border-3 border-black rounded-2xl font-bold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ef476f] min-h-24 resize-none"
                    name="description"
                    placeholder="Tell us about this awesome item..."
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>

                {/* Cover Image Upload */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wide mb-2">
                    Cover Image (JPG, PNG, WEBP • Max 5MB)
                  </label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-3 border-black rounded-2xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#ef476f]"
                  />
                </div>

                {/* Cover Image Preview */}
                {form.image && (
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wide mb-2">
                      Cover Image Preview
                    </label>
                    <div className="relative inline-block">
                      <img
                        src={URL.createObjectURL(form.image)}
                        alt="Cover preview"
                        className="w-32 h-32 object-cover rounded-lg border-3 border-black"
                      />
                      <button
                        type="button"
                        onClick={removeCoverImage}
                        className="absolute top-1 right-1 bg-[#ef476f] text-white w-8 h-8 rounded-full text-sm font-black border-2 border-black hover:bg-[#ff5c8d] transition-colors flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}

                {/* Gallery Images Upload */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wide mb-2">
                    Gallery Images (Multiple • Max 5MB each)
                  </label>
                  <input
                    type="file"
                    name="gallery"
                    multiple
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border-3 border-black rounded-2xl font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#ef476f]"
                  />
                </div>

                {/* Existing Gallery Display */}
                {form.existingGallery?.length > 0 && (
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wide mb-2">
                      Existing Gallery
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {form.existingGallery.map((img, index) => (
                        <div key={index} className="relative">
                          <img
                            src={getImageUrl(img)}
                            alt=""
                            className="w-full h-24 object-cover rounded-lg border-2 border-black"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute top-1 right-1 bg-[#ef476f] text-white w-6 h-6 rounded-full text-sm font-black border-2 border-black"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Gallery Preview */}
                {form.gallery.length > 0 && (
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wide mb-2">
                      New Gallery Preview
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {form.gallery.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt=""
                            className="w-full h-24 object-cover rounded-lg border-2 border-black"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute top-1 right-1 bg-[#ef476f] text-white w-6 h-6 rounded-full text-sm font-black border-2 border-black"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price & Security Deposit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wide mb-2">
                      Rent Price
                    </label>
                    <input
                      className="w-full px-4 py-3 bg-white border-3 border-black rounded-2xl font-bold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ef476f]"
                      name="rent_price"
                      placeholder="0.00"
                      value={form.rent_price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wide mb-2">
                      Security Deposit
                    </label>
                    <input
                      className="w-full px-4 py-3 bg-white border-3 border-black rounded-2xl font-bold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ef476f]"
                      name="security_deposit"
                      placeholder="0.00"
                      value={form.security_deposit}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Age Group Stock */}
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wide mb-3">Age Group Stock</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(form.variants).map((key) => (
                      <div key={key}>
                        <label className="block text-xs font-bold mb-1">{key}</label>
                        <input
                          className="w-full px-4 py-3 bg-white border-3 border-black rounded-2xl font-bold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ef476f]"
                          type="number"
                          placeholder={key}
                          value={form.variants[key]}
                          onChange={(e) => handleVariant(key, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-black mt-2 text-black">Total Quantity: <span className="text-[#ef476f]">{totalQty}</span></p>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98, y: 2 }}
                  className="w-full py-4 bg-[#06d6a0] text-black border-4 border-black rounded-2xl font-black text-lg uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all mt-6"
                  style={{ fontFamily: "'Chewy', cursive" }}
                >
                  {editId ? "UPDATE PRODUCT! 📝" : "ADD PRODUCT! 🎉"}
                </motion.button>
              </div>
            </form>
          </div>

          {/* Search Inventory */}
          <div className="xl:col-span-5">
            <motion.div
              className="bg-[#bde0fe] rounded-3xl border-4 border-black p-6 md:p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] h-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2
                className="text-3xl md:text-4xl font-black text-black mb-6 flex items-center gap-2"
                style={{ fontFamily: "'Chewy', cursive" }}
              >
                <Search size={28} strokeWidth={3} /> Search Inventory
              </h2>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={20} strokeWidth={3} className="text-black" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Find costumes..."
                  className="w-full pl-12 pr-4 py-4 bg-white border-3 border-black rounded-2xl font-bold text-black outline-none focus:ring-2 focus:ring-[#ef476f] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-400"
                />
              </div>

              <div className="mt-6">
                <div className="inline-block bg-[#ffd166] border-3 border-black rounded-full px-4 py-2 font-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  {filteredProducts.length} items found
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>
        )}

        {/* Search Inventory - Always Visible */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-[#bde0fe] rounded-3xl border-4 border-black p-6 md:p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <h2
              className="text-3xl md:text-4xl font-black text-black mb-6 flex items-center gap-2"
              style={{ fontFamily: "'Chewy', cursive" }}
            >
              <Search size={28} strokeWidth={3} /> Search Inventory
            </h2>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={20} strokeWidth={3} className="text-black" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find costumes..."
                className="w-full pl-12 pr-4 py-4 bg-white border-3 border-black rounded-2xl font-bold text-black outline-none focus:ring-2 focus:ring-[#ef476f] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-400"
              />
            </div>

            <div className="mt-6">
              <div className="inline-block bg-[#ffd166] border-3 border-black rounded-full px-4 py-2 font-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                {filteredProducts.length} items found
              </div>
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="w-full h-1 bg-black rounded-full my-8 opacity-20" />

        {/* Product Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-10">
            <h2
              className="text-4xl md:text-5xl font-black text-black drop-shadow-[3px_3px_0px_rgba(0,0,0,0.2)] flex items-center gap-3"
              style={{ fontFamily: "'Chewy', cursive" }}
            >
              <span>🎨</span> {searchQuery ? `Search Results!` : `Manage Products`}
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <img src="/dance.gif" alt="Loading..." className="w-32 h-32 mb-6" />
              <h2 className="text-2xl font-black text-black" style={{ fontFamily: "'Chewy', cursive" }}>
                Loading Products...
              </h2>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  getImageUrl={getImageUrl}
                  onEdit={editProduct}
                  onToggleFeatured={toggleFeatured}
                  onToggleSection={toggleFeaturedSection}
                  onToggleVisibility={toggleVisibility}
                  toggleLoading={toggleLoading}
                  onDelete={deleteProduct}
                  onCheckStock={() => checkLiveStock(product)}
                />
              ))}
            </div>
          ) : (
            <div className="border-4 border-black border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center bg-white/50 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
              <div className="bg-[#ffd166] p-6 rounded-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
                <Search size={48} strokeWidth={3} className="text-black" />
              </div>
              <h3
                className="text-3xl text-black mb-3 font-black"
                style={{ fontFamily: "'Chewy', cursive" }}
              >
                Oops! Nothing found.
              </h3>
              <p className="text-gray-600 font-bold text-lg max-w-md">
                We couldn't find any items matching "{searchQuery}". Try searching for something else!
              </p>
            </div>
          )}
        </motion.section>
      </main>

      {/* Stock Modal */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-4 border-black rounded-3xl p-8 max-w-md w-full shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
          >
            <h2 className="text-3xl font-black text-black mb-6" style={{ fontFamily: "'Chewy', cursive" }}>
              📦 {showStockModal.name}
            </h2>
            
            <div className="space-y-4 mb-8">
              <div className="bg-[#ffd166] border-3 border-black rounded-2xl p-4">
                <p className="text-sm font-bold text-gray-700 mb-1">Total Stock (stored)</p>
                <p className="text-4xl font-black text-black">{showStockModal.total_quantity || 0}</p>
                {showStockModal.total_available !== undefined && (
                  <p className="text-sm font-bold text-black mt-2">Live Available: <span className="text-2xl">{showStockModal.total_available}</span></p>
                )}
              </div>

              {showStockModal.variants && (
                <div className="bg-[#bde0fe] border-3 border-black rounded-2xl p-4">
                  <p className="text-sm font-bold text-black mb-3">Stock by Size:</p>
                  <div className="space-y-2">
                    {Object.entries(showStockModal.variants).map(([size, qty]) => {
                      const live = showStockModal.liveVariants && showStockModal.liveVariants[size];
                      const displayQty = live ? live.available_quantity : qty;

                      return (
                        <div key={size} className="flex justify-between items-center bg-white border-2 border-black rounded-lg p-2">
                          <span className="font-bold text-black">{size}</span>
                          <span className="bg-[#06d6a0] text-black px-3 py-1 rounded-full font-black border-2 border-black">{displayQty}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowStockModal(null)}
              className="w-full py-3 bg-[#ef476f] text-white font-black border-3 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              ✕ Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function ProductCard({
  product,
  getImageUrl,
  onEdit,
  onToggleFeatured,
  onToggleSection,
  onToggleVisibility,
  onDelete,
  onCheckStock,
  toggleLoading = {},
}) {
  const badgeColors = ["bg-[#ef476f]", "bg-[#ffd166]", "bg-[#06d6a0]"];
  const [badgeColor] = useState(
    () => badgeColors[Math.floor(Math.random() * badgeColors.length)]
  );

  return (
    <motion.div
      className="group relative"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Shadow Background */}
      <div className={`absolute inset-0 ${badgeColor} border-4 border-black rounded-3xl transform translate-x-2 translate-y-2 transition-transform group-hover:translate-x-3 group-hover:translate-y-3`}></div>

      {/* Main Card */}
      <div className="relative h-full bg-white border-4 border-black rounded-3xl p-4 transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1 flex flex-col justify-between z-10">
        {/* Product Image */}
        {product.image && (
          <div className="relative mb-4 overflow-hidden rounded-2xl border-3 border-black">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="w-full h-40 object-cover"
            />
            {/* Status Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-2">
              {product.is_featured && (
                <span className="inline-block px-2 py-1 bg-[#ffd166] text-black text-xs font-black border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  FEATURED
                </span>
              )}
              {product.show_on_featured_section && (
                <span className="inline-block px-2 py-1 bg-[#06d6a0] text-black text-xs font-black border-2 border-black rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  IN SECTION
                </span>
              )}
            </div>
          </div>
        )}

        {/* Product Info */}
        <div className="mb-4">
          <h3 className="text-lg font-black text-black leading-tight">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 font-bold uppercase">
            {product.theme}
          </p>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="inline-block bg-[#ef476f] text-white border-3 border-black rounded-full px-4 py-1 font-black text-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            ${product.rent_price}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ y: 1 }}
              onClick={() => onEdit(product)}
              className="py-2 bg-white border-3 border-black rounded-xl font-black text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-1"
            >
              ✏️ EDIT
            </motion.button>
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ y: 1 }}
              onClick={() => onToggleFeatured(product.id, product.is_featured)}
              disabled={toggleLoading[`featured-${product.id}`]}
              className={`py-2 border-3 border-black rounded-xl font-black text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                product.is_featured
                  ? "bg-[#ffd166] text-black"
                  : "bg-white text-black"
              }`}
            >
              {toggleLoading[`featured-${product.id}`] ? "⏳..." : `⭐ ${product.is_featured ? "UNFEATURE" : "FEATURE"}`}
            </motion.button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ y: 1 }}
              onClick={() => onToggleSection(product.id, product.show_on_featured_section)}
              disabled={toggleLoading[`section-${product.id}`]}
              className={`py-2 border-3 border-black rounded-xl font-black text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-60 disabled:cursor-not-allowed text-center ${
                product.show_on_featured_section
                  ? "bg-[#06d6a0] text-black"
                  : "bg-white text-black"
              }`}
            >
              {toggleLoading[`section-${product.id}`] ? "⏳..." : `${product.show_on_featured_section ? "REMOVE SECTION" : "ADD SECTION"}`}
            </motion.button>
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ y: 1 }}
              onClick={() => onToggleVisibility(product)}
              disabled={toggleLoading[`visibility-${product.id}`]}
              className="py-2 bg-white border-3 border-black rounded-xl font-black text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {toggleLoading[`visibility-${product.id}`] ? "⏳..." : `👁️ ${product.status === "available" ? "HIDE" : "SHOW"}`}
            </motion.button>
          </div>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ y: 1 }}
            onClick={onCheckStock}
            className="w-full py-2 bg-[#06d6a0] text-black border-3 border-black rounded-xl font-black text-xs uppercase shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            📦 CHECK STOCK
          </motion.button>

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ y: 1 }}
            onClick={() => onDelete(product.id)}
            disabled={toggleLoading[`delete-${product.id}`]}
            className="w-full py-3 bg-[#ef476f] text-white border-3 border-black rounded-xl font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {toggleLoading[`delete-${product.id}`] ? (
              <>
                <span className="inline-block animate-spin">⏳</span> DELETING...
              </>
            ) : (
              <>
                <Trash2 size={16} strokeWidth={3} /> DELETE PRODUCT
              </>
            )}
          </motion.button>
        </div>

        {/* Decorative Dots */}
        <div className="flex gap-1 justify-center mt-3">
          <div className="w-2 h-2 rounded-full bg-black"></div>
          <div className="w-2 h-2 rounded-full bg-black"></div>
          <div className="w-2 h-2 rounded-full bg-black"></div>
        </div>
      </div>
    </motion.div>
  );
}

export default Products;
