import { useState, useEffect, useCallback, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../services/api";

const navItems = [
  { path: "/admin/dashboard", icon: "📊", label: "Dashboard" },
  { path: "/admin/bookings", icon: "📋", label: "Package Bookings" },
  { path: "/admin/custom-requests", icon: "✨", label: "Custom Requests" },
  { path: "/admin/users", icon: "👥", label: "All Users" },
  { path: "/admin/services", icon: "🎭", label: "All Services" },
  { path: "/admin/settings", icon: "⚙️", label: "Settings" },
];

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await api.get("/admin/notifications");
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch {}
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellOpen = async () => {
    setBellOpen((prev) => !prev);
    if (!bellOpen && unreadCount > 0) {
      try {
        await api.put("/admin/notifications/read-all");
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

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen" style={{ background: "#0f0a1e" }}>

      {/* Sidebar */}
      <div className="w-64 flex flex-col justify-between py-6 px-4"
        style={{ background: "rgba(255,255,255,0.03)", borderRight: "1px solid rgba(255,255,255,0.07)", minHeight: "100vh" }}>

        {/* Logo + Bell */}
        <div>
          <div className="flex items-center justify-between mb-10 px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
                <span className="text-lg">🛡️</span>
              </div>
              <div>
                <p className="font-bold text-white text-sm">BookMyEvent</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Admin Panel</p>
              </div>
            </div>

            {/* Bell Icon */}
            <div className="relative" ref={bellRef}>
              <button onClick={handleBellOpen}
                className="relative flex items-center justify-center w-8 h-8 rounded-lg transition"
                style={{ color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.05)" }}
                title="Notifications">
                <BellIcon />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs font-bold px-1.5 py-0.5 rounded-full text-white"
                    style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)", minWidth: "18px", textAlign: "center", fontSize: "10px" }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Bell Dropdown */}
              {bellOpen && (
                <div className="absolute left-0 mt-2 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  style={{ background: "#1a1030", border: "1px solid rgba(192,132,252,0.2)" }}>
                  <div className="px-4 py-3 border-b flex items-center justify-between"
                    style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                    <p className="text-sm font-bold text-white">🔔 Notifications</p>
                    <button onClick={() => { navigate("/admin/custom-requests"); setBellOpen(false); }}
                      className="text-xs font-medium" style={{ color: "#c084fc" }}>
                      View All
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n._id}
                          className="px-4 py-3 border-b cursor-pointer transition"
                          style={{
                            borderColor: "rgba(255,255,255,0.05)",
                            background: !n.isRead ? "rgba(192,132,252,0.05)" : "transparent",
                          }}
                          onClick={() => { navigate("/admin/custom-requests"); setBellOpen(false); }}>
                          <div className="flex items-start gap-2">
                            <span className="text-base mt-0.5">✨</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white">{n.title}</p>
                              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{n.message}</p>
                              <p className="text-xs mt-1" style={{ color: "#c084fc" }}>{timeAgo(n.createdAt)}</p>
                            </div>
                            {!n.isRead && (
                              <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                                style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }} />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`
                }
                style={({ isActive }) => isActive ? { background: "linear-gradient(135deg, #c084fc33, #f472b633)", border: "1px solid rgba(192,132,252,0.3)" } : {}}>
                <span className="text-lg">{item.icon}</span>
                {item.label}
                {/* Show unread count badge on Custom Requests nav item */}
                {item.path === "/admin/custom-requests" && unreadCount > 0 && (
                  <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full text-white"
                    style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)", minWidth: "18px", textAlign: "center" }}>
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full"
          style={{ color: "#f87171", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <span className="text-lg">🚪</span>
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;