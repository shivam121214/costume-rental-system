export const getCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
  // Emit custom event to notify cart update
  window.dispatchEvent(new Event("cartUpdated"));
};

export const addToCart = (item) => {
  const cart = getCart();

  if (cart.length >= 10) {
    return { success: false, message: "Max 10 items allowed" };
  }

  const exists = cart.find(
    (c) =>
      c.product_id === item.product_id &&
      c.variant === item.variant &&
      c.start_date === item.start_date &&
      c.end_date === item.end_date
  );

  if (exists) {
    return { success: false, message: "Item already in cart" };
  }

  item.id = Date.now(); // unique id
  item.is_available = null;
  item.message = "";

  cart.push(item);
  saveCart(cart);

  return { success: true };
};

export const removeFromCart = (id) => {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
};

export const updateCartItem = (id, updatedData) => {
  const cart = getCart().map((item) =>
    item.id === id ? { ...item, ...updatedData, is_available: null } : item
  );

  saveCart(cart);
};

export const clearCart = () => {
  localStorage.removeItem("cart");
};