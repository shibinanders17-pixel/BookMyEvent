import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import api from "../services/api";

const statusColor = (s) =>
  s === "confirmed"  ? { bg: "rgba(52,211,153,0.15)",  color: "#34d399" } :
  s === "completed"  ? { bg: "rgba(99,102,241,0.15)",  color: "#818cf8" } :
  s === "cancelled"  ? { bg: "rgba(239,68,68,0.15)",   color: "#f87171" } :
                       { bg: "rgba(251,191,36,0.15)",   color: "#fbbf24" };

const AdminBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage]                 = useState(1);
  const perPage = 8;

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/bookings");
      setBookings(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const deleteBooking = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this booking?")) return;
    try {
      await api.delete(`/admin/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch { alert("Failed to delete booking"); }
  };

  const filtered = bookings.filter((b) => {
    if (b.isCustomEvent) return false;          // custom events → Admin Custom Requests page
    const q = search.toLowerCase();
    const matchSearch =
      b.name?.toLowerCase().includes(q) ||
      b.email?.toLowerCase().includes(q) ||
      b.package?.service?.toLowerCase().includes(q) ||
      b.venue?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">📋 Bookings</h1>
          <p style={{ color: "rgba(255,255,255,0.4)" }}>Click any row to view full booking details</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, service, venue..."
            className="px-4 py-2 rounded-xl text-white text-sm outline-none flex-1 min-w-48"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }} />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 rounded-xl text-white text-sm outline-none cursor-pointer"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="px-4 py-2 rounded-xl text-sm"
            style={{ background: "rgba(192,132,252,0.1)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.2)" }}>
            {filtered.length} bookings
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {loading ? (
            <div className="text-center py-16">
              <div className="text-4xl animate-pulse mb-3">📋</div>
              <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading bookings...</p>
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📭</p>
              <p style={{ color: "rgba(255,255,255,0.4)" }}>No bookings found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    {["Customer", "Service", "Date", "Venue", "Amount", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "rgba(255,255,255,0.4)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((b) => (
                    <tr key={b._id}
                      onClick={() => navigate(`/admin/bookings/${b._id}`)}
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer", transition: "background 0.15s" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(192,132,252,0.06)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                      <td className="px-4 py-4">
                        <p className="text-white text-sm font-medium">{b.name}</p>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{b.email}</p>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{b.phone}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-white text-sm">{b.package?.service || "—"}</p>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{b.package?.event || ""}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-white text-sm">{new Date(b.date).toLocaleDateString("en-IN")}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-white text-sm">{b.venue}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-sm" style={{ color: "#f59e0b" }}>
                          ₹{b.package?.price?.toLocaleString() || "—"}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs px-3 py-1 rounded-full font-semibold"
                          style={{ background: statusColor(b.status).bg, color: statusColor(b.status).color }}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button onClick={() => navigate(`/admin/bookings/${b._id}`)}
                            className="text-xs px-3 py-1 rounded-lg"
                            style={{ background: "rgba(192,132,252,0.12)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.2)" }}>
                            View
                          </button>
                          <button onClick={(e) => deleteBooking(e, b._id)}
                            className="text-xs px-3 py-1 rounded-lg hover:opacity-80"
                            style={{ background: "rgba(239,68,68,0.15)", color: "#f87171" }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-30"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}>
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className="w-9 h-9 rounded-xl text-sm font-medium"
                style={{ background: page === p ? "linear-gradient(135deg, #c084fc, #f472b6)" : "rgba(255,255,255,0.06)",
                  color: page === p ? "#fff" : "rgba(255,255,255,0.5)",
                  border: page === p ? "none" : "1px solid rgba(255,255,255,0.1)" }}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-30"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}>
              Next
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;