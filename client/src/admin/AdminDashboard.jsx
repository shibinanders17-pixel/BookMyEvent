
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import AdminLayout from "./AdminLayout";
// import api from "../services/api";

// const AdminDashboard = () => {
//   const navigate = useNavigate();
//   const [stats, setStats] = useState({});
//   const [recentBookings, setRecentBookings] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const adminToken = localStorage.getItem("adminToken");
//     if (!adminToken) { navigate("/admin/login"); return; }
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [statsRes, bookingsRes] = await Promise.all([
//         api.get("/admin/stats"),
//         api.get("/admin/bookings"),
//       ]);
//       setStats(statsRes.data);
//       setRecentBookings(bookingsRes.data.slice(0, 5));
//     } catch (err) {
//       if (err.response?.status === 401) {
//         localStorage.removeItem("adminToken");
//         navigate("/admin/login");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const statusColor = (s) =>
//     s === "confirmed" ? { bg: "rgba(52,211,153,0.15)", color: "#34d399" } :
//     s === "cancelled" ? { bg: "rgba(239,68,68,0.15)", color: "#f87171" } :
//     { bg: "rgba(251,191,36,0.15)", color: "#fbbf24" };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0a1e" }}>
//         <div className="text-center">
//           <div className="text-5xl mb-4 animate-pulse">🛡️</div>
//           <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <AdminLayout>
//       <div className="p-6">

//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-white">📊 Dashboard</h1>
//           <p style={{ color: "rgba(255,255,255,0.4)" }}>Welcome back, Admin 👋</p>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//           {[
//             { label: "Total Bookings", value: stats.totalBookings || 0, icon: "📋", color: "#c084fc" },
//             { label: "Confirmed", value: stats.confirmedBookings || 0, icon: "✅", color: "#34d399" },
//             { label: "Total Users", value: stats.totalUsers || 0, icon: "👥", color: "#60a5fa" },
//             { label: "Revenue", value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: "💰", color: "#f59e0b" },
//           ].map((stat, i) => (
//             <div key={i} className="rounded-2xl p-5"
//               style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
//               <p className="text-2xl mb-2">{stat.icon}</p>
//               <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
//               <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{stat.label}</p>
//             </div>
//           ))}
//         </div>

//         {/* Recent Bookings */}
//         <div className="rounded-2xl overflow-hidden"
//           style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
//           <div className="px-5 py-4 flex items-center justify-between"
//             style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
//             <p className="text-white font-semibold">Recent Bookings</p>
//             <button onClick={() => navigate("/admin/bookings")}
//               className="text-xs px-3 py-1 rounded-lg"
//               style={{ color: "#c084fc", background: "rgba(192,132,252,0.1)" }}>
//               View All →
//             </button>
//           </div>
//           {recentBookings.length === 0 ? (
//             <div className="text-center py-10">
//               <p style={{ color: "rgba(255,255,255,0.4)" }}>No bookings yet</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
//                     {["Customer", "Service", "Date", "Amount", "Status"].map((h) => (
//                       <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
//                         style={{ color: "rgba(255,255,255,0.4)" }}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {recentBookings.map((b) => (
//                     <tr key={b._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
//                       <td className="px-4 py-3">
//                         <p className="text-white text-sm">{b.name}</p>
//                         <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{b.email}</p>
//                       </td>
//                       <td className="px-4 py-3">
//                         <p className="text-white text-sm">
//                             {b.isMultiBooking
//                            ? b.packages?.map(p => p.service).join(", ") || "-"
//                            : b.package?.service || "-"}
//                         </p>
//                       </td>
//                       <td className="px-4 py-3">
//                         <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
//                           {new Date(b.date).toLocaleDateString("en-IN")}
//                         </p>
//                       </td>
//                       <td className="px-4 py-3">
//                         <p className="text-sm font-semibold" style={{ color: "#f59e0b" }}>
//                           ₹{(b.isMultiBooking ? b.totalAmount : b.package?.price)?.toLocaleString() || "-"}
//                         </p>
//                       </td>
//                       <td className="px-4 py-3">
//                         <span className="text-xs px-2 py-1 rounded-full"
//                           style={{ background: statusColor(b.status).bg, color: statusColor(b.status).color }}>
//                           {b.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//       </div>
//     </AdminLayout>
//   );
// };

// export default AdminDashboard;








import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import api from "../services/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) { navigate("/admin/login"); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, bookingsRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/bookings"),
      ]);
      setStats(statsRes.data);
      setRecentBookings(bookingsRes.data.slice(0, 5));
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (s) =>
    s === "confirmed" ? { bg: "rgba(52,211,153,0.15)", color: "#34d399" } :
    s === "cancelled" ? { bg: "rgba(239,68,68,0.15)", color: "#f87171" } :
    { bg: "rgba(251,191,36,0.15)", color: "#fbbf24" };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0a1e" }}>
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">🛡️</div>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">📊 Dashboard</h1>
          <p style={{ color: "rgba(255,255,255,0.4)" }}>Welcome back, Admin 👋</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Bookings", value: stats.totalBookings || 0, icon: "📋", color: "#c084fc" },
            { label: "Confirmed", value: stats.confirmedBookings || 0, icon: "✅", color: "#34d399" },
            { label: "Total Users", value: stats.totalUsers || 0, icon: "👥", color: "#60a5fa" },
            { label: "Revenue", value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: "💰", color: "#f59e0b" },
          ].map((stat, i) => (
            <div key={i} className="rounded-2xl p-5"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-2xl mb-2">{stat.icon}</p>
              <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Bookings */}
        <div className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-white font-semibold">Recent Bookings</p>
            <button onClick={() => navigate("/admin/bookings")}
              className="text-xs px-3 py-1 rounded-lg"
              style={{ color: "#c084fc", background: "rgba(192,132,252,0.1)" }}>
              View All →
            </button>
          </div>
          {recentBookings.length === 0 ? (
            <div className="text-center py-10">
              <p style={{ color: "rgba(255,255,255,0.4)" }}>No bookings yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {["Customer", "Service", "Date", "Amount", "Status"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "rgba(255,255,255,0.4)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr key={b._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td className="px-4 py-3">
                        <p className="text-white text-sm">{b.name}</p>
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{b.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-white text-sm">
                          {b.isMultiBooking
                            ? b.packages?.map(p => p.service).join(", ") || "-"
                            : b.package?.service || "-"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                          {new Date(b.date).toLocaleDateString("en-IN")}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold" style={{ color: "#f59e0b" }}>
                          ₹{(b.isMultiBooking ? b.totalAmount : b.package?.price)?.toLocaleString() || "-"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-1 rounded-full"
                          style={{ background: statusColor(b.status).bg, color: statusColor(b.status).color }}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;