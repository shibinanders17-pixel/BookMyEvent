import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import api from "../services/api";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("revenue");

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data: res } = await api.get("/admin/analytics");
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Build 6-month labels & values
  const buildMonthlyChart = () => {
    const result = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const found = data?.monthlyData?.find(
        (m) => m._id.year === d.getFullYear() && m._id.month === d.getMonth() + 1
      );
      result.push({
        label: MONTHS[d.getMonth()],
        revenue: found?.revenue || 0,
        bookings: found?.bookings || 0,
        confirmed: found?.confirmed || 0,
        cancelled: found?.cancelled || 0,
      });
    }
    return result;
  };

  const growthPct = () => {
    const curr = data?.recentRevenue?.total || 0;
    const prev = data?.prevRevenue?.total || 0;
    if (prev === 0) return curr > 0 ? 100 : 0;
    return Math.round(((curr - prev) / prev) * 100);
  };

  const statusMap = () => {
    const map = { pending: 0, confirmed: 0, cancelled: 0 };
    data?.statusBreakdown?.forEach((s) => { map[s._id] = s.count; });
    return map;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📊</div>
            <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading analytics...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const monthly = buildMonthlyChart();
  const maxRevenue = Math.max(...monthly.map((m) => m.revenue), 1);
  const maxBookings = Math.max(...monthly.map((m) => m.bookings), 1);
  const growth = growthPct();
  const status = statusMap();
  const totalStatus = (status.pending + status.confirmed + status.cancelled) || 1;

  const cardStyle = {
    borderRadius: "20px", padding: "24px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
  };

  return (
    <AdminLayout>
      <div style={{ padding: "28px", maxWidth: "1100px" }}>

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: "800", margin: "0 0 4px" }}>
            📊 Analytics
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0 }}>
            Revenue, bookings & performance overview
          </p>
        </div>

        {/* Top KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            {
              label: "Last 30 Days Revenue",
              value: `₹${(data?.recentRevenue?.total || 0).toLocaleString()}`,
              icon: "💰",
              color: "#f59e0b",
              sub: `${growth >= 0 ? "+" : ""}${growth}% vs prev month`,
              subColor: growth >= 0 ? "#34d399" : "#f87171",
            },
            {
              label: "Last 30 Days Bookings",
              value: data?.recentRevenue?.count || 0,
              icon: "📋",
              color: "#c084fc",
              sub: `${data?.prevRevenue?.count || 0} prev month`,
              subColor: "rgba(255,255,255,0.4)",
            },
            {
              label: "Confirmed",
              value: status.confirmed,
              icon: "✅",
              color: "#34d399",
              sub: `${Math.round((status.confirmed / totalStatus) * 100)}% of total`,
              subColor: "#34d399",
            },
            {
              label: "Cancelled",
              value: status.cancelled,
              icon: "❌",
              color: "#f87171",
              sub: `${Math.round((status.cancelled / totalStatus) * 100)}% of total`,
              subColor: "#f87171",
            },
          ].map((card, i) => (
            <div key={i} style={cardStyle}>
              <div style={{ fontSize: "28px", marginBottom: "10px" }}>{card.icon}</div>
              <div style={{ fontSize: "26px", fontWeight: "800", color: card.color, marginBottom: "4px" }}>
                {card.value}
              </div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>
                {card.label}
              </div>
              <div style={{ fontSize: "11px", color: card.subColor, fontWeight: "600" }}>
                {card.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Bar Chart */}
        <div style={{ ...cardStyle, marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
            <p style={{ color: "#fff", fontWeight: "700", fontSize: "15px", margin: 0 }}>
              📈 Last 6 Months
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              {["revenue", "bookings"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "6px 16px", borderRadius: "10px", fontSize: "12px",
                    fontWeight: "600", cursor: "pointer", border: "none",
                    background: activeTab === tab
                      ? "linear-gradient(135deg, #c084fc, #f472b6)"
                      : "rgba(255,255,255,0.06)",
                    color: activeTab === tab ? "#fff" : "rgba(255,255,255,0.5)",
                  }}>
                  {tab === "revenue" ? "💰 Revenue" : "📋 Bookings"}
                </button>
              ))}
            </div>
          </div>

          {/* Bars */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "180px" }}>
            {monthly.map((m, i) => {
              const val = activeTab === "revenue" ? m.revenue : m.bookings;
              const max = activeTab === "revenue" ? maxRevenue : maxBookings;
              const pct = Math.max((val / max) * 100, 2);
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%" }}>
                  <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)", fontWeight: "600" }}>
                    {activeTab === "revenue"
                      ? val >= 1000 ? `₹${(val / 1000).toFixed(0)}k` : `₹${val}`
                      : val}
                  </div>
                  <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                    <div style={{
                      width: "100%", height: `${pct}%`, borderRadius: "8px 8px 4px 4px",
                      background: activeTab === "revenue"
                        ? "linear-gradient(180deg, #f59e0b, #f472b6)"
                        : "linear-gradient(180deg, #c084fc, #60a5fa)",
                      minHeight: "6px", transition: "height 0.5s ease",
                    }} />
                  </div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", fontWeight: "600" }}>{m.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

          {/* Top Services */}
          <div style={cardStyle}>
            <p style={{ color: "#fff", fontWeight: "700", fontSize: "15px", margin: "0 0 20px" }}>
              🏆 Top Services
            </p>
            {data?.topServices?.length === 0 && (
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>No data yet</p>
            )}
            {data?.topServices?.map((s, i) => {
              const maxCount = data.topServices[0]?.count || 1;
              const pct = Math.round((s.count / maxCount) * 100);
              return (
                <div key={i} style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px" }}>
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "  "} {s._id || "Unknown"}
                    </span>
                    <span style={{ color: "#f59e0b", fontSize: "12px", fontWeight: "600" }}>
                      {s.count} bookings
                    </span>
                  </div>
                  <div style={{ height: "6px", borderRadius: "4px", background: "rgba(255,255,255,0.06)" }}>
                    <div style={{
                      height: "100%", borderRadius: "4px", width: `${pct}%`,
                      background: i === 0
                        ? "linear-gradient(90deg, #f59e0b, #f472b6)"
                        : i === 1
                        ? "linear-gradient(90deg, #c084fc, #60a5fa)"
                        : "linear-gradient(90deg, #34d399, #60a5fa)",
                    }} />
                  </div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "3px" }}>
                    ₹{(s.revenue || 0).toLocaleString()} revenue
                  </div>
                </div>
              );
            })}
          </div>

          {/* Booking Status Breakdown */}
          <div style={cardStyle}>
            <p style={{ color: "#fff", fontWeight: "700", fontSize: "15px", margin: "0 0 20px" }}>
              🍩 Status Breakdown
            </p>
            {[
              { key: "confirmed", label: "Confirmed", color: "#34d399", icon: "✅" },
              { key: "pending",   label: "Pending",   color: "#fbbf24", icon: "⏳" },
              { key: "cancelled", label: "Cancelled", color: "#f87171", icon: "❌" },
            ].map((s) => {
              const pct = Math.round((status[s.key] / totalStatus) * 100);
              return (
                <div key={s.key} style={{ marginBottom: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px" }}>
                      {s.icon} {s.label}
                    </span>
                    <span style={{ color: s.color, fontSize: "13px", fontWeight: "700" }}>
                      {status[s.key]} <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: "400" }}>({pct}%)</span>
                    </span>
                  </div>
                  <div style={{ height: "10px", borderRadius: "6px", background: "rgba(255,255,255,0.06)" }}>
                    <div style={{
                      height: "100%", borderRadius: "6px", width: `${pct}%`,
                      background: s.color, transition: "width 0.6s ease",
                      boxShadow: `0 0 8px ${s.color}55`,
                    }} />
                  </div>
                </div>
              );
            })}

            {/* Donut visual (CSS) */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px", gap: "20px" }}>
              {[
                { label: "Confirmed", color: "#34d399", val: status.confirmed },
                { label: "Pending",   color: "#fbbf24", val: status.pending },
                { label: "Cancelled", color: "#f87171", val: status.cancelled },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "50%",
                    background: `conic-gradient(${s.color} 0% ${Math.round((s.val / totalStatus) * 100)}%, rgba(255,255,255,0.06) 0%)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 6px",
                  }}>
                    <div style={{
                      width: "32px", height: "32px", borderRadius: "50%",
                      background: "#0f0a1e",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "11px", fontWeight: "800", color: s.color,
                    }}>{Math.round((s.val / totalStatus) * 100)}%</div>
                  </div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;