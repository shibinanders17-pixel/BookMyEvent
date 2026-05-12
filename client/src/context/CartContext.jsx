import { createContext, useContext, useState, useEffect } from "react";
import { useContext as useAuthContext } from "react";
import { AuthContext } from "./AuthContext";
import api from "../services/api";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [cartToast, setCartToast] = useState(null); // { type: "success"|"error", msg: string }

  const showToast = (type, msg) => {
    setCartToast({ type, msg });
    setTimeout(() => setCartToast(null), 3000);
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setCartLoading(true);
      const { data } = await api.get("/users/cart");
      setCartItems(data);
    } catch {
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  };

  const addToCart = async (item) => {
    try {
      const { data } = await api.post("/users/cart", item);
      setCartItems(data.cart);
      showToast("success", "Added to cart!");
    } catch (err) {
      console.error("Add to cart failed", err?.response?.status, err?.response?.data || err?.message);
      const msg = err?.response?.status === 401 || err?.response?.status === 403
        ? "Please login to add items to cart."
        : "Failed to add to cart. Try again.";
      showToast("error", msg);
    }
  };

  const removeFromCart = async (serviceId, styleId) => {
    try {
      const { data } = await api.delete("/users/cart/item", {
        data: { serviceId, styleId },
      });
      setCartItems(data.cart);
    } catch (err) {
      console.error("Remove from cart failed", err);
    }
  };

  const isInCart = (serviceId, styleId) =>
    cartItems.some(i => String(i.serviceId) === String(serviceId) && String(i.styleId) === String(styleId));

  const clearCart = async () => {
    try {
      await api.delete("/users/cart");
      setCartItems([]);
    } catch (err) {
      console.error("Clear cart failed", err);
    }
  };

  const totalItems = cartItems.length;
  const totalPrice = cartItems.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0);

  return (
    <CartContext.Provider value={{
      cartItems, cartLoading, cartToast,
      addToCart, removeFromCart, isInCart, clearCart,
      totalItems, totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
};