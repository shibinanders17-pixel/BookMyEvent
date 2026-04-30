import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);


  const addToCart = (item) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.serviceId === item.serviceId && i.styleId === item.styleId);
      if (exists) {
        return prev.map(i =>
          i.serviceId === item.serviceId && i.styleId === item.styleId
            ? { ...i, quantity: item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (serviceId, styleId) => {
    setCartItems(prev => prev.filter(i => !(i.serviceId === serviceId && i.styleId === styleId)));
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.length;
  const totalPrice = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};