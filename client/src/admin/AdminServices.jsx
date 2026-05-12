import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import api from "../services/api";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 6;
  const navigate = useNavigate();

  useEffect(() => { fetchServices(); }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users/services");
      setServices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await api.delete(`/admin/services/${id}`);
      fetchServices();
    } catch {
      alert("Failed to delete service");
    }
  };

  const filtered = services.filter((s) =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.tag?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <AdminLayout>
      <div className="p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">🎭 Services</h1>
            <p style={{ color: "rgba(255,255,255,0.4)" }}>Manage all wedding services</p>
          </div>
          <button
            onClick={() => navigate("/admin/services/add")}
            className="px-5 py-2.5 rounded-xl font-bold text-white text-sm hover:opacity-90 transition"
            style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
            + Add Service
          </button>
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-6">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search services..."
            className="px-4 py-2 rounded-xl text-white text-sm outline-none flex-1"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          />
          <div className="px-4 py-2 rounded-xl text-sm"
            style={{ background: "rgba(192,132,252,0.1)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.2)" }}>
            {filtered.length} services
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {loading ? (
            <div className="text-center py-16">
              <div className="text-4xl animate-pulse mb-3">🎭</div>
              <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading services...</p>
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📭</p>
              <p style={{ color: "rgba(255,255,255,0.4)" }}>No services found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    {["Image", "Service", "Tag", "Price", "Rating", "Packages", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "rgba(255,255,255,0.4)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((s) => (
                    <tr key={s._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td className="px-4 py-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center"
                          style={{ background: "linear-gradient(135deg, #1a0533, #2d1b69)" }}>
                          {s.img ? (
                            <img src={s.img} alt={s.title} className="w-full h-full object-cover"
                              onError={(e) => { e.target.style.display = "none"; }} />
                          ) : (
                            <span className="text-2xl">{s.icon}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-white font-semibold text-sm">{s.icon} {s.title}</p>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{s.subtitle}</p>
                      </td>
                      <td className="px-4 py-3">
                        {s.tag && (
                          <span className={`text-xs px-2 py-0.5 rounded-full text-white font-bold ${s.tagColor}`}>
                            {s.tag}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold" style={{ color: "#d4af37" }}>{s.price}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400 text-xs">★</span>
                          <span className="text-white text-sm">{s.rating}</span>
                          <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>({s.reviews})</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                          {s.styles?.length || 0} packages
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/admin/services/edit/${s._id}`)}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium hover:opacity-80"
                            style={{ background: "rgba(96,165,250,0.15)", color: "#60a5fa" }}>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(s._id)}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium hover:opacity-80"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-30"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}>
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className="w-9 h-9 rounded-xl text-sm font-medium"
                style={{
                  background: page === p ? "linear-gradient(135deg, #c084fc, #f472b6)" : "rgba(255,255,255,0.06)",
                  color: page === p ? "#fff" : "rgba(255,255,255,0.5)",
                  border: page === p ? "none" : "1px solid rgba(255,255,255,0.1)",
                }}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-30"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}>
              Next →
            </button>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default AdminServices;