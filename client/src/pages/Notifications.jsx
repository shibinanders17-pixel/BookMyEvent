import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const typeConfig = {
  custom_request_status: { icon: "📋", label: "Custom Request" },
  booking_confirmed:     { icon: "✅", label: "Booking" },
  booking_cancelled:     { icon: "❌", label: "Booking" },
  payment:               { icon: "💳", label: "Payment" },
  default:               { icon: "✨", label: "Update" },
};

const timeAgo = (date) => {
  const mins = Math.floor((Date.now() - new Date(date)) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

export default function Notifications() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | unread | read

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await api.get("/users/notifications/my");
      setNotifications(data);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchNotifications();
  }, [user, fetchNotifications, navigate]);

  // Mark all as read when page loads
  useEffect(() => {
    const markRead = async () => {
      try { await api.put("/users/notifications/read-all"); } catch {}
    };
    markRead();
  }, []);

  const handleNotificationClick = (n) => {
    if (n.type === "custom_request_status") {
      navigate("/dashboard/requests");
    } else {
      navigate("/dashboard/bookings");
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read")   return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" }}
      className="py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)}
            className="text-white/60 hover:text-white text-xl transition">←</button>
          <div>
            <h1 className="text-2xl font-bold text-white">🔔 Notifications</h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-5">
          {["all", "unread", "read"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition"
              style={{
                background: filter === f
                  ? "linear-gradient(135deg, #c084fc, #f472b6)"
                  : "rgba(255,255,255,0.07)",
                color: filter === f ? "#fff" : "rgba(255,255,255,0.5)",
                border: filter === f ? "none" : "1px solid rgba(255,255,255,0.1)",
              }}>
              {f}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>

          {loading && (
            <div className="py-16 text-center" style={{ color: "rgba(255,255,255,0.4)" }}>
              <div className="text-3xl mb-3 animate-pulse">🔔</div>
              <p>Loading notifications...</p>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="py-16 text-center">
              <div className="text-5xl mb-4">🔕</div>
              <p className="text-white font-semibold text-lg">No notifications</p>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                {filter !== "all" ? `No ${filter} notifications` : "You're all caught up!"}
              </p>
            </div>
          )}

          {!loading && filtered.map((n, idx) => {
            const cfg = typeConfig[n.type] || typeConfig.default;
            return (
              <div key={n._id}
                onClick={() => handleNotificationClick(n)}
                className="flex items-start gap-4 px-5 py-4 cursor-pointer transition-all"
                style={{
                  borderBottom: idx < filtered.length - 1
                    ? "1px solid rgba(255,255,255,0.06)" : "none",
                  background: !n.isRead
                    ? "rgba(192,132,252,0.08)" : "transparent",
                }}>

                {/* Icon */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
                  style={{ background: "rgba(255,255,255,0.08)" }}>
                  {cfg.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-white truncate">{n.title}</p>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }} />
                    )}
                  </div>
                  <p className="text-xs mt-0.5 leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.55)" }}>{n.message}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(192,132,252,0.15)", color: "#c084fc" }}>
                      {cfg.label}
                    </span>
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {timeAgo(n.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer hint */}
        {!loading && filtered.length > 0 && (
          <p className="text-center text-xs mt-4" style={{ color: "rgba(255,255,255,0.25)" }}>
            Click a notification to view details
          </p>
        )}
      </div>
    </div>
  );
}