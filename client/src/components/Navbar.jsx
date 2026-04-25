import { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { cartItems, removeFromCart, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // ─── Outside click → dropdown close ───────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCheckout = () => {
    setCartOpen(false);
    navigate("/booking");
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  // ─── Avatar — name first letter ───────────────────────────
  const Avatar = () => (
    <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:ring-2 hover:ring-purple-400 transition">
      {user?.name?.charAt(0).toUpperCase() || "U"}
    </div>
  );

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-purple-600 text-white font-extrabold text-xl px-3 py-1 rounded-lg">BME</div>
            <span className="text-xl font-bold text-gray-800">Book<span className="text-purple-600">My</span>Event</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-6 items-center">
            <Link to="/" className="text-gray-600 hover:text-purple-600 font-medium">Home</Link>
            <Link to="/services" className="text-gray-600 hover:text-purple-600 font-medium">Services</Link>

            {/* Cart Button */}
            <button onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full font-medium transition hover:bg-purple-50"
              style={{ border: "2px solid #c084fc", color: "#7c3aed" }}>
              🛒 Cart
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                  style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
                  {totalItems}
                </span>
              )}
            </button>

            {/* Auth Section */}
            {user ? (
              // ─── Avatar + Dropdown ───────────────────────
              <div className="relative" ref={dropdownRef}>
                <div onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <Avatar />
                </div>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">

                    {/* User Info */}
                    <div className="px-4 py-3 bg-purple-50 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <Avatar />
                        <div>
                          <p className="text-sm font-bold text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <button onClick={() => { navigate("/dashboard"); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                        📋 My Bookings
                      </button>

                      <div className="border-t border-gray-100 my-1" />

                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition font-semibold">
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-purple-600 font-medium">Login</Link>
                <Link to="/register" className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700">Register</Link>
              </>
            )}
          </div>

          {/* Mobile right side */}
          <div className="md:hidden flex items-center gap-3">
            <button onClick={() => setCartOpen(true)} className="relative text-xl">
              🛒
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold"
                  style={{ background: "#c084fc", fontSize: "9px" }}>
                  {totalItems}
                </span>
              )}
            </button>
            <button className="text-gray-600 text-2xl" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden bg-white px-4 pb-4 flex flex-col gap-3">
            <Link to="/" className="text-gray-600 hover:text-purple-600 font-medium" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/services" className="text-gray-600 hover:text-purple-600 font-medium" onClick={() => setIsOpen(false)}>Services</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-purple-600 font-medium" onClick={() => setIsOpen(false)}>My Bookings</Link>
                <button onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="text-red-500 font-semibold text-left">
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-purple-600 font-medium" onClick={() => setIsOpen(false)}>Login</Link>
                <Link to="/register" className="bg-purple-600 text-white px-4 py-2 rounded-full text-center hover:bg-purple-700" onClick={() => setIsOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Cart Drawer Overlay */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setCartOpen(false)} />
          <div className="relative w-full max-w-md h-full flex flex-col shadow-2xl"
            style={{ background: "#0f0a1e", borderLeft: "1px solid rgba(192,132,252,0.2)" }}>

            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
              <div>
                <p className="text-white font-bold text-xl">🛒 Your Cart</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {totalItems === 0 ? "No services added yet" : `${totalItems} service${totalItems > 1 ? "s" : ""} selected`}
                </p>
              </div>
              <button onClick={() => setCartOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                style={{ background: "rgba(255,255,255,0.08)" }}>✕</button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-5xl mb-4">🛍️</p>
                  <p className="text-white font-bold mb-2">Cart is empty!</p>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Go to services and add what you need</p>
                  <button onClick={() => { setCartOpen(false); navigate("/services"); }}
                    className="mt-6 px-6 py-2 rounded-full font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
                    Browse Services
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {cartItems.map((item, i) => (
                    <div key={i} className="flex gap-3 p-4 rounded-2xl"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(192,132,252,0.15)" }}>
                      <img src={item.styleImg} alt={item.styleName}
                        className="w-16 h-14 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span>{item.serviceIcon}</span>
                          <p className="text-xs font-bold" style={{ color: "#c084fc" }}>{item.serviceTitle}</p>
                        </div>
                        <p className="text-white font-bold text-sm truncate">{item.styleName}</p>
                        {item.quantity > 1 && (
                          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                            {item.unit}: {item.quantity}
                          </p>
                        )}
                        <p className="font-bold mt-1" style={{ color: "#d4af37" }}>
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                      <button onClick={() => removeFromCart(item.serviceId, item.styleId)}
                        className="text-lg self-start mt-1 hover:scale-110 transition">🗑️</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="px-6 py-5" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex justify-between items-center mb-4">
                  <p className="text-white font-bold">Total</p>
                  <p className="text-2xl font-extrabold" style={{ color: "#d4af37" }}>₹{totalPrice.toLocaleString()}</p>
                </div>
                <button onClick={handleCheckout}
                  className="w-full py-4 rounded-2xl font-bold text-white text-lg transition hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
                  Proceed to Book 🚀
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}