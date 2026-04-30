import { createContext, useContext, useState } from "react";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);


  const addToWishlist = (item) => {
    setWishlistItems(prev => {
      const exists = prev.find(i => i.serviceId === item.serviceId && i.styleId === item.styleId);
      if (exists) return prev; // already in wishlist
      return [...prev, item];
    });
  }; 

  const removeFromWishlist = (serviceId, styleId) => {
    setWishlistItems(prev => prev.filter(i => !(i.serviceId === serviceId && i.styleId === styleId)));
  };

  const isInWishlist = (serviceId, styleId) =>
    wishlistItems.some(i => i.serviceId === serviceId && i.styleId === styleId);

  const toggleWishlist = (item) => {
    if (isInWishlist(item.serviceId, item.styleId)) {
      removeFromWishlist(item.serviceId, item.styleId);
    } else {
      addToWishlist(item);
    }
  };

  const totalWishlist = wishlistItems.length;

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      totalWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};