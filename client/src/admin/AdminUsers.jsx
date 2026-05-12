import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import api from "../services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user? All their bookings will remain.")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch { alert("Failed to delete user"); }
  };

  const toggleBlock = async (id, isBlocked) => {
  try {
    await api.put(`/admin/users/${id}/block`, { isBlocked: !isBlocked });
    fetchUsers();
  } catch { 
    alert("Failed to update user status"); 
  }
};

  const filtered = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <AdminLayout>
      <div className="p-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">👥 Users</h1>
          <p style={{ color: "rgba(255,255,255,0.4)" }}>Manage registered users</p>
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-6">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, phone..."
            className="px-4 py-2 rounded-xl text-white text-sm outline-none flex-1"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          />
          <div className="px-4 py-2 rounded-xl text-sm"
            style={{ background: "rgba(192,132,252,0.1)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.2)" }}>
            {filtered.length} users
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {loading ? (
            <div className="text-center py-16">
              <div className="text-4xl animate-pulse mb-3">👥</div>
              <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading users...</p>
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">👤</p>
              <p style={{ color: "rgba(255,255,255,0.4)" }}>No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    {["User", "Email", "Phone", "Joined", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "rgba(255,255,255,0.4)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((u) => (
                    <tr key={u._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", opacity: u.isBlocked ? 0.5 : 1 }}>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)", color: "#fff" }}>
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <p className="text-white text-sm font-medium">{u.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{u.email}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{u.phone}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                          {new Date(u.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-xs px-2 py-1 rounded-full"
                          style={{
                            background: u.isBlocked ? "rgba(239,68,68,0.15)" : "rgba(52,211,153,0.15)",
                            color: u.isBlocked ? "#f87171" : "#34d399",
                          }}>
                          {u.isBlocked ? "🚫 Blocked" : "✅ Active"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => toggleBlock(u._id, u.isBlocked)}
                            className="text-xs px-3 py-1 rounded-lg hover:opacity-80"
                            style={{
                              background: u.isBlocked ? "rgba(52,211,153,0.15)" : "rgba(251,191,36,0.15)",
                              color: u.isBlocked ? "#34d399" : "#fbbf24",
                            }}>
                            {u.isBlocked ? "Unblock" : "Block"}
                          </button>
                          <button onClick={() => deleteUser(u._id)}
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

export default AdminUsers;