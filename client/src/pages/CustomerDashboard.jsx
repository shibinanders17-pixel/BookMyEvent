import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import api from "../services/api";

const statusStyles = {
  pending:   "bg-yellow-100 text-yellow-600",
  confirmed: "bg-green-100 text-green-600",
  cancelled: "bg-red-100 text-red-600",
};

const statusIcons = {
  pending:   "⏳",
  confirmed: "✅",
  cancelled: "❌",
};

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { wishlistItems, removeFromWishlist, totalWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await api.get("/users/bookings/my");
        setBookings(res.data);
      } catch (err) {
        setError("Failed to load bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    }; 
    if (user) fetchBookings();
  }, [user]);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.delete(`/users/bookings/${id}`);
      setBookings(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      alert("Failed to cancel booking. Please try again.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  const confirmed = bookings.filter(b => b.status === "confirmed").length;
  const pending = bookings.filter(b => b.status === "pending").length;

  return (
    <div className="min-h-screen" style={{ background: "#0f0a1e" }}>

      {/* Header */}
      <div className="py-10 px-6"
        style={{ background: "linear-gradient(135deg, #1a0533 0%, #0f0a1e 100%)", borderBottom: "1px solid rgba(192,132,252,0.15)" }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="font-extrabold text-2xl w-14 h-14 rounded-full flex items-center justify-center text-white"
              style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Welcome, {user.name}! 👋</h1>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="px-4 py-2 rounded-full text-sm font-bold transition hover:scale-105"
            style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
            Logout 🚪
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-6 mt-6">
        <div className="flex gap-4 mb-8" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          {[
            { key: "bookings", label: "📋 My Bookings" },
            { key: "wishlist", label: `❤️ Wishlist ${totalWishlist > 0 ? `(${totalWishlist})` : ""}` },
            { key: "profile", label: "👤 My Profile" },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="pb-3 font-semibold text-sm transition border-b-2 whitespace-nowrap"
              style={{
                borderColor: activeTab === tab.key ? "#c084fc" : "transparent",
                color: activeTab === tab.key ? "#c084fc" : "rgba(255,255,255,0.4)",
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Total Bookings", value: bookings.length, color: "rgba(192,132,252,0.1)", textColor: "#c084fc" },
                { label: "Confirmed", value: confirmed, color: "rgba(34,197,94,0.1)", textColor: "#4ade80" },
                { label: "Pending", value: pending, color: "rgba(234,179,8,0.1)", textColor: "#facc15" },
              ].map((stat, i) => (
                <div key={i} className="rounded-2xl p-4 text-center"
                  style={{ background: stat.color, border: `1px solid ${stat.textColor}30` }}>
                  <p className="text-3xl font-extrabold" style={{ color: stat.textColor }}>{stat.value}</p>
                  <p className="text-sm font-medium mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mb-4"></div>
                <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading your bookings...</p>
              </div>
            )}

            {error && !loading && (
              <div className="text-center py-10 px-4 rounded-2xl"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {!loading && !error && bookings.length === 0 && (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">📭</p>
                <p className="text-white text-lg font-bold mb-2">No bookings yet!</p>
                <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>Start by exploring our services</p>
                <button onClick={() => navigate("/services")}
                  className="px-6 py-3 rounded-full font-bold text-white transition hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
                  Browse Services
                </button>
              </div>
            )}

            {!loading && !error && bookings.length > 0 && (
              <div className="flex flex-col gap-4 pb-10">
                {bookings.map((booking) => (
                  <div key={booking._id} className="rounded-2xl p-6 transition hover:scale-[1.01]"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(192,132,252,0.15)" }}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          {booking.package?.service || "Booking"}
                        </h3>
                        <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                          {booking.package?.event} {booking.package?.duration ? `— ${booking.package.duration}` : ""}
                        </p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusStyles[booking.status]}`}>
                        {statusIcons[booking.status]} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      {[
                        { icon: "📅", label: "Date", value: booking.date },
                        { icon: "📍", label: "Venue", value: booking.venue },
                        { icon: "📞", label: "Phone", value: booking.phone },
                        { icon: "💰", label: "Price", value: booking.package?.price ? `₹${booking.package.price.toLocaleString()}` : "—" },
                      ].map((item, i) => (
                        <div key={i} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                          <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>{item.icon} {item.label}</p>
                          <p className="text-white font-medium truncate"
                            style={item.label === "Price" ? { color: "#d4af37" } : {}}>{item.value}</p>
                        </div>
                      ))}
                    </div>

                    {booking.message && (
                      <p className="text-xs mb-4 p-3 rounded-xl italic"
                        style={{ background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.4)" }}>
                        💬 {booking.message}
                      </p>
                    )}

                    {booking.status === "pending" && (
                      <button onClick={() => handleCancel(booking._id)}
                        className="text-sm font-bold px-4 py-2 rounded-xl transition hover:scale-105"
                        style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                        ❌ Cancel Booking
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === "wishlist" && (
          <div>
            {wishlistItems.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-6xl mb-4">🤍</p>
                <p className="text-white text-lg font-bold mb-2">Your wishlist is empty!</p>
                <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Go to services, click ❤️ on any style to save it here
                </p>
                <button onClick={() => navigate("/services")}
                  className="px-6 py-3 rounded-full font-bold text-white transition hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
                  Browse Services
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {totalWishlist} service{totalWishlist > 1 ? "s" : ""} saved — ready to book when you are! 💫
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-10">
                  {wishlistItems.map((item, i) => (
                    <div key={i} className="rounded-3xl overflow-hidden transition hover:scale-[1.02]"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(239,68,68,0.2)" }}>
                      <div className="relative h-40 overflow-hidden">
                        <img src={item.styleImg} alt={item.styleName}
                          className="w-full h-full object-cover" />
                        <div className="absolute inset-0"
                          style={{ background: "linear-gradient(to top, rgba(15,10,30,0.85) 0%, transparent 50%)" }} />
                        <div className="absolute top-3 right-3 text-xl">❤️</div>
                        <div className="absolute bottom-3 left-4">
                          <p className="text-xs font-bold mb-0.5" style={{ color: "#c084fc" }}>{item.serviceIcon} {item.serviceTitle}</p>
                          <p className="text-white font-bold">{item.styleName}</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>{item.desc}</p>
                        {item.specs && (
                          <div className="grid grid-cols-2 gap-1.5 mb-4">
                            {item.specs.slice(0, 4).map((spec, si) => (
                              <div key={si} className="p-1.5 rounded-lg"
                                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>{spec.label}</p>
                                <p className="text-xs font-semibold text-white">{spec.value}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex justify-between items-center mb-3">
                          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Starting Price</p>
                          <p className="font-bold text-lg" style={{ color: "#d4af37" }}>₹{item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => navigate(`/services/${item.serviceId}`)}
                            className="flex-1 py-2.5 rounded-xl font-bold text-white text-sm transition hover:opacity-90"
                            style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
                            Book Now →
                          </button>
                          <button onClick={() => removeFromWishlist(item.serviceId, item.styleId)}
                            className="w-10 h-10 rounded-xl flex items-center justify-center transition hover:scale-110"
                            style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}>
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="max-w-md pb-10">
            <div className="rounded-3xl p-8"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(192,132,252,0.15)" }}>
              <h2 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "'Georgia', serif" }}>My Profile</h2>
              <div className="flex flex-col gap-5">
                {[
                  { label: "Full Name", value: user.name, icon: "👤" },
                  { label: "Email Address", value: user.email, icon: "📧" },
                  { label: "Phone Number", value: user.phone, icon: "📞" },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>{item.icon} {item.label}</p>
                    <p className="text-white font-semibold">{item.value || "—"}</p>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl text-center"
                    style={{ background: "rgba(192,132,252,0.08)", border: "1px solid rgba(192,132,252,0.2)" }}>
                    <p className="text-2xl font-bold" style={{ color: "#c084fc" }}>{bookings.length}</p>
                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Total Bookings</p>
                  </div>
                  <div className="p-4 rounded-2xl text-center"
                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <p className="text-2xl font-bold" style={{ color: "#f87171" }}>{totalWishlist}</p>
                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Wishlist Items</p>
                  </div>
                </div>
                <button onClick={handleLogout}
                  className="w-full py-3 rounded-xl font-bold transition hover:scale-105"
                  style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
                  Logout 🚪
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;


