import { useEffect, useState } from "react";
import axios from "axios";

function Products() {
  const emptyForm = {
    name: "",
    category: "",
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

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    const res = await axios.get(`${API_URL}/api/admin/products`);
    setProducts(res.data);
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
    data.append("category", form.category || "");
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
      } else {
        await axios.post(`${API_URL}/api/products`, data);
      }

      setForm(emptyForm);
      setEditId(null);
      getProducts();
    } catch (error) {
      console.log(error.response.data);
      alert(error.response?.data?.message || "Upload failed");
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
  };

  const deleteProduct = async (id) => {
    const input = prompt(
      "Warning: This will permanently delete the product.\nType CONFIRM to continue.",
    );

    if (input !== "CONFIRM") {
      alert("Delete cancelled");
      return;
    }

    await axios.delete(`${API_URL}/api/products/${id}`);
    getProducts();
  };

  const toggleFeatured = async (id, currentStatus) => {
    try {
      await axios.post(`${API_URL}/api/products/${id}/toggle-featured`);
      getProducts();
      alert(`Product ${currentStatus ? "removed from" : "added to"} featured!`);
    } catch (error) {
      console.error("Error toggling featured:", error);
      alert("Failed to toggle featured status");
    }
  };

  const toggleVisibility = async (item) => {
    const data = new FormData();

    data.append("name", item.name);
    data.append("category", item.category || "");
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

    await axios.post(`${API_URL}/api/products/${item.id}?_method=PUT`, data);
    getProducts();
  };

  const removeGalleryImage = (index) => {
    const updated = [...form.gallery];
    updated.splice(index, 1);

    setForm({
      ...form,
      gallery: updated,
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

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <form
        onSubmit={saveProduct}
        className="bg-white rounded-2xl shadow-md p-6 grid gap-3 max-w-xl"
      >
        <input
          className="border p-3 rounded-lg"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          className="border p-3 rounded-lg"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />
        <input
          className="border p-3 rounded-lg"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <p className="text-sm text-slate-500">
          Cover Image (JPG, PNG, WEBP • Max 5MB)
        </p>
        <input
          className="border p-3 rounded-lg"
          type="file"
          name="image"
          onChange={handleChange}
        />
        <p className="text-sm text-slate-500">
          Gallery Images (Multiple • Max 5MB each)
        </p>
        <input
          className="border p-3 rounded-lg"
          type="file"
          name="gallery"
          multiple
          onChange={handleChange}
        />

        {form.existingGallery?.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-2">
            {form.existingGallery.map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={getImageUrl(img)}
                  alt=""
                  className="w-full h-24 object-cover rounded-lg"
                />

                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {form.gallery.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-2">
            {form.gallery.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt=""
                  className="w-full h-24 object-cover rounded-lg"
                />

                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <input
          className="border p-3 rounded-lg"
          name="rent_price"
          placeholder="Rent Price"
          value={form.rent_price}
          onChange={handleChange}
          required
        />

        <input
          className="border p-3 rounded-lg"
          name="security_deposit"
          placeholder="Security Deposit"
          value={form.security_deposit}
          onChange={handleChange}
          required
        />

        <h3 className="font-semibold mt-2">Age Group Stock</h3>

        {Object.keys(form.variants).map((key) => (
          <input
            key={key}
            className="border p-3 rounded-lg"
            placeholder={key}
            value={form.variants[key]}
            onChange={(e) => handleVariant(key, e.target.value)}
          />
        ))}

        <p>Total Quantity: {totalQty}</p>

        <select
          className="border p-3 rounded-lg"
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
          <option value="damaged">Damaged</option>
        </select>

        <button className="bg-slate-900 text-white py-3 rounded-lg">
          {editId ? "Update Product" : "Add Product"}
        </button>
      </form>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {products.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-md p-5">
            {item.image && (
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                className="w-full h-48 object-cover rounded-xl mb-3"
              />
            )}

            <h3 className="text-xl font-semibold">{item.name}</h3>
            <p>{item.category}</p>
            <p className="font-bold mt-2">₹ {item.rent_price}</p>
            {item.is_featured && (
              <span className="inline-block mt-2 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                Featured ⭐
              </span>
            )}

            <div className="flex gap-2 flex-wrap mt-4">
              <button
                onClick={() => editProduct(item)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => toggleFeatured(item.id, item.is_featured)}
                className={`px-4 py-2 text-white rounded-lg text-sm ${
                  item.is_featured ? "bg-orange-500 hover:bg-orange-600" : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {item.is_featured ? "Unfeature" : "Feature"}
              </button>

              <button
                onClick={() => toggleVisibility(item)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm"
              >
                {item.status === "available" ? "Hide" : "Unhide"}
              </button>

              <button
                onClick={() => deleteProduct(item.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
