import { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { totalWishlist } = useWishlist();
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

                      <button onClick={() => { navigate("/dashboard"); setDropdownOpen(false); }}
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
                        <span>🔖 Saved List</span>
                        {totalWishlist > 0 && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                            style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
                            {totalWishlist}
                          </span>
                        )}
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

    </>
  );
}