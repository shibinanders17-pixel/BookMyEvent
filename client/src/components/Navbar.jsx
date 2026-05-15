import { useState, useContext, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../services/api";

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const { user, logout } = useContext(AuthContext);
  const { totalItems: cartCount } = useCart();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const desktopBellRef = useRef(null);
  const mobileBellRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.get("/users/notifications/my");
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch {}
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      const inDesktop = desktopBellRef.current && desktopBellRef.current.contains(e.target);
      const inMobile  = mobileBellRef.current  && mobileBellRef.current.contains(e.target);
      if (!inDesktop && !inMobile) setBellOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => { logout(); setDropdownOpen(false); navigate("/login"); };
  const goTo = (path) => { navigate(path); setDropdownOpen(false); setIsOpen(false); };

  const handleBellOpen = async () => {
    setBellOpen((prev) => !prev);
    if (!bellOpen && unreadCount > 0) {
      try {
        await api.put("/users/notifications/read-all");
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      } catch {}
    }
  };

  const timeAgo = (date) => {
    const mins = Math.floor((Date.now() - new Date(date)) / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const Avatar = () =>
    user?.profileImg
      ? <img src={user.profileImg} alt="avatar" className="w-9 h-9 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-purple-400 transition" />
      : <div className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:ring-2 hover:ring-purple-400 transition">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-purple-600 text-white font-extrabold text-xl px-3 py-1 rounded-lg">BME</div>
          <span className="text-xl font-bold text-gray-800">Book<span className="text-purple-600">My</span>Event</span>
        </Link>

        {/* ── Desktop ── */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className="text-gray-600 hover:text-purple-600 font-medium">Home</Link>
          <Link to="/services" className="text-gray-600 hover:text-purple-600 font-medium">Services</Link>
          <Link to="/availability" className="text-gray-600 hover:text-purple-600 font-medium">Availability</Link>

          {user && (
            <button onClick={() => navigate("/cart-checkout")}
              className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-purple-50 transition" title="Saved Events">
              <span className="text-xl">📅</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 text-xs font-bold px-1.5 py-0.5 rounded-full text-white"
                  style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)", minWidth: "18px", textAlign: "center" }}>
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Desktop Bell */}
          {user && (
            <div className="relative" ref={desktopBellRef}>
              <button onClick={handleBellOpen}
                className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-purple-50 transition text-gray-600" title="Notifications">
                <BellIcon />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs font-bold px-1.5 py-0.5 rounded-full text-white"
                    style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)", minWidth: "18px", textAlign: "center" }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {bellOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-purple-50 border-b border-gray-100 flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-800">🔔 Notifications</p>
                    {/* ✅ Link — no event conflict with mousedown */}
                    <Link to="/notifications" onClick={() => setBellOpen(false)}
                      className="text-xs text-purple-600 hover:underline font-medium">
                      View All
                    </Link>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-gray-400 text-sm">No notifications yet</div>
                    ) : (
                      notifications.map((n) => (
                        // ✅ Link wrapper — reliable, no navigate/event race condition
                        <Link to="/notifications" key={n._id} onClick={() => setBellOpen(false)}
                          className={`block px-4 py-3 border-b border-gray-50 hover:bg-purple-50 transition ${!n.isRead ? "bg-purple-50/50" : ""}`}>
                          <div className="flex items-start gap-2">
                            <span className="text-lg mt-0.5">{n.type === "custom_request_status" ? "📋" : "✨"}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                              <p className="text-xs text-purple-400 mt-1">{timeAgo(n.createdAt)}</p>
                            </div>
                            {!n.isRead && (
                              <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                                style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }} />
                            )}
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <div onClick={() => setDropdownOpen(!dropdownOpen)}><Avatar /></div>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 bg-purple-50 border-b border-gray-100 flex items-center gap-3">
                    <Avatar />
                    <div className="overflow-hidden">
                      <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="py-1">
                    <button onClick={() => goTo("/dashboard/profile")} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 transition">👤 My Profile</button>
                    <button onClick={() => goTo("/dashboard/bookings")} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 transition">📋 My Bookings</button>
                    <button onClick={() => goTo("/dashboard/wallet")} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 transition">👛 Wallet</button>
                    <div className="border-t border-gray-100 my-1" />
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition font-semibold">🚪 Logout</button>
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

        {/* ── Mobile ── */}
        <div className="md:hidden flex items-center gap-3">
          {user && (
            <>
              <button onClick={() => navigate("/cart-checkout")} className="relative">
                <span className="text-xl">📅</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs font-bold px-1 rounded-full text-white"
                    style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>{cartCount}</span>
                )}
              </button>

              {/* Mobile Bell */}
              <div className="relative" ref={mobileBellRef}>
                <button onClick={handleBellOpen} className="relative text-gray-600">
                  <BellIcon />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 text-xs font-bold px-1 rounded-full text-white"
                      style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>{unreadCount}</span>
                  )}
                </button>
                {bellOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <div className="px-4 py-3 bg-purple-50 border-b border-gray-100 flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-800">🔔 Notifications</p>
                      <Link to="/notifications" onClick={() => setBellOpen(false)}
                        className="text-xs text-purple-600 hover:underline font-medium">
                        View All
                      </Link>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-4 text-center text-gray-400 text-sm">No notifications yet</div>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <Link to="/notifications" key={n._id} onClick={() => setBellOpen(false)}
                            className="block px-4 py-3 border-b border-gray-50 hover:bg-purple-50">
                            <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                            <p className="text-xs text-purple-400 mt-1">{timeAgo(n.createdAt)}</p>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
          <button className="text-gray-600 text-2xl" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white px-4 pb-4 flex flex-col gap-3 border-t border-gray-100">
          <Link to="/" className="text-gray-600 hover:text-purple-600 font-medium py-1" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/services" className="text-gray-600 hover:text-purple-600 font-medium py-1" onClick={() => setIsOpen(false)}>Services</Link>
          <Link to="/availability" className="text-gray-600 hover:text-purple-600 font-medium py-1" onClick={() => setIsOpen(false)}>Availability</Link>
          {user ? (
            <>
              <button onClick={() => goTo("/dashboard/profile")} className="text-gray-700 font-medium text-left py-1">👤 My Profile</button>
              <button onClick={() => goTo("/dashboard/bookings")} className="text-gray-700 font-medium text-left py-1">📋 My Bookings</button>
              <button onClick={() => goTo("/dashboard/wallet")} className="text-gray-700 font-medium text-left py-1">👛 Wallet</button>
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-red-500 font-semibold text-left py-1">🚪 Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-purple-600 font-medium py-1" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/register" className="bg-purple-600 text-white px-4 py-2 rounded-full text-center hover:bg-purple-700" onClick={() => setIsOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}