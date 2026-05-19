import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import api from "../services/api";

const statusColor = (s) =>
  s === "confirmed"  ? { bg: "rgba(52,211,153,0.15)",  color: "#34d399" } :
  s === "completed"  ? { bg: "rgba(99,102,241,0.15)",  color: "#818cf8" } :
  s === "cancelled"  ? { bg: "rgba(239,68,68,0.15)",   color: "#f87171" } :
                       { bg: "rgba(251,191,36,0.15)",   color: "#fbbf24" };

const Section = ({ title, children }) => (
  <div style={{ marginBottom: "20px", borderRadius: "14px", padding: "16px 18px",
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
    <p style={{ color: "#c084fc", fontSize: "11px", fontWeight: "700", letterSpacing: "0.1em",
      textTransform: "uppercase", margin: "0 0 12px" }}>{title}</p>
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>{children}</div>
  </div>
);

const Row = ({ label, value, highlight, mono }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", flexShrink: 0 }}>{label}</span>
    <span style={{ color: highlight ? "#f59e0b" : "#fff", fontSize: "13px",
      fontWeight: highlight ? "700" : "500", textAlign: "right",
      fontFamily: mono ? "monospace" : "inherit", wordBreak: "break-all" }}>{value}</span>
  </div>
);

const AdminBookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => { fetchBooking(); }, [id]);

  const fetchBooking = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/bookings/${id}`);
      setBooking(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    setUpdating(true);
    try {
      await api.put(`/admin/bookings/${id}`, { status });
      setBooking((prev) => ({ ...prev, status }));
    } catch {
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const deleteBooking = async () => {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await api.delete(`/admin/bookings/${id}`);
      navigate("/admin/bookings");
    } catch {
      alert("Failed to delete booking");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }} className="animate-pulse">📋</div>
            <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading booking details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!booking) {
    return (
      <AdminLayout>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
            <p style={{ color: "rgba(255,255,255,0.4)" }}>Booking not found</p>
            <button onClick={() => navigate("/admin/bookings")}
              style={{ marginTop: "16px", padding: "10px 20px", borderRadius: "12px", cursor: "pointer",
                background: "rgba(192,132,252,0.15)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.3)",
                fontSize: "13px", fontWeight: "600" }}>
              Back to Bookings
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const sc = statusColor(booking.status);

  return (
    <AdminLayout>
      <div className="p-6" style={{ maxWidth: "720px" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
          <button onClick={() => navigate("/admin/bookings")}
            style={{ padding: "8px 16px", borderRadius: "12px", cursor: "pointer",
              background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(255,255,255,0.1)", fontSize: "13px", fontWeight: "600" }}>
            Back
          </button>
          <div>
            <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: "800", margin: "0 0 2px" }}>
              Booking Details
            </h1>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", margin: 0, fontFamily: "monospace" }}>
              {booking._id}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: "24px", padding: "14px 18px", borderRadius: "14px",
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <span style={{ padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "700",
            background: sc.bg, color: sc.color, border: `1px solid ${sc.color}44` }}>
            {booking.status === "confirmed" ? "✅" : booking.status === "completed" ? "🎉" : booking.status === "cancelled" ? "❌" : "⏳"} {booking.status}
          </span>
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
            Booked on {new Date(booking.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric"
            })}
          </span>
        </div>

        <Section title="👤 Customer Information">
          <Row label="Name"  value={booking.name} />
          <Row label="Email" value={booking.email} />
          <Row label="Phone" value={booking.phone} />
        </Section>

<Section title="🎭 Service & Package">
    {booking.isMultiBooking ? (
      (booking.packages || []).map((pkg, i) => (
      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>{pkg.service} · {pkg.event}</span>
        <span style={{ color: "#f59e0b", fontWeight: "700", fontSize: "13px" }}>₹{pkg.price?.toLocaleString()}</span>
      </div>
    ))
  ) : (
    <>
      <Row label="Service"  value={booking.package?.service  || "—"} />
      <Row label="Event"    value={booking.package?.event    || "—"} />
      <Row label="Duration" value={booking.package?.duration || "—"} />
      <Row label="Price"    value={"₹" + (booking.package?.price?.toLocaleString() || "—")} highlight />
    </>
  )}
</Section>

        <Section title="📅 Event Details">
          <Row label="Date" value={new Date(booking.date).toLocaleDateString("en-IN", {
            weekday: "long", year: "numeric", month: "long", day: "numeric"
          })} />
          <Row label="Venue" value={booking.venue} />
          {booking.message && <Row label="Message" value={booking.message} />}
        </Section>

        {(booking.paymentId || booking.orderId) && (
          <Section title="💳 Payment Info">
            {booking.paymentId && <Row label="Payment ID" value={booking.paymentId} mono />}
            {booking.orderId   && <Row label="Order ID"   value={booking.orderId}   mono />}
          </Section>
        )}

        <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
          <select
            value={booking.status}
            onChange={(e) => updateStatus(e.target.value)}
            disabled={updating}
            style={{ flex: 1, padding: "12px 14px", borderRadius: "12px",
              background: "rgba(192,132,252,0.1)", border: "1px solid rgba(192,132,252,0.3)",
              color: "#c084fc", fontSize: "13px", fontWeight: "600", cursor: "pointer", outline: "none",
              opacity: updating ? 0.6 : 1 }}>
            <option value="pending">⏳ Mark as Pending</option>
            <option value="confirmed">✅ Mark as Confirmed</option>
            <option value="completed">🎉 Mark as Completed</option>
            <option value="cancelled">❌ Mark as Cancelled</option>
          </select>
          <button onClick={deleteBooking}
            style={{ padding: "12px 20px", borderRadius: "12px", cursor: "pointer",
              background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)",
              color: "#f87171", fontSize: "13px", fontWeight: "600" }}>
            🗑️ Delete
          </button>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminBookingDetail;