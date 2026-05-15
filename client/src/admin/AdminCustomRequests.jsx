import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import api from "../services/api";

const STATUS_STYLES = {
  pending:   { bg: "rgba(251,191,36,0.15)",  color: "#fbbf24" },
  reviewing: { bg: "rgba(96,165,250,0.15)",  color: "#60a5fa" },
  quoted:    { bg: "rgba(167,139,250,0.15)", color: "#a78bfa" },
  accepted:  { bg: "rgba(251,146,60,0.15)",  color: "#fb923c" },
  confirmed: { bg: "rgba(34,197,94,0.15)",   color: "#4ade80" },
  completed: { bg: "rgba(20,184,166,0.15)",  color: "#2dd4bf" },
  rejected:  { bg: "rgba(239,68,68,0.15)",   color: "#f87171" },
};

const FILTER_OPTIONS = ["pending", "reviewing", "quoted", "accepted", "confirmed", "completed", "rejected"];

const EVENT_EMOJIS = {
  Wedding: "💍", Birthday: "🎂", Engagement: "💐", "Baby Shower": "🍼",
  Anniversary: "🥂", "Corporate Event": "🏢", "House Warming": "🏠",
  Graduation: "🎓", Farewell: "👋", "Get Together": "🎉",
  "Naming Ceremony": "👶", Other: "✨",
};

const inputStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "10px 14px",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
  width: "100%",
};

export default function AdminCustomRequests() {
  const [requests, setRequests]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected]     = useState(null);
  const [actionMsg, setActionMsg]   = useState("");
  const [acting, setActing]         = useState(false);

  // for "Send Quote" form inside modal
  const [quotePrice, setQuotePrice] = useState("");
  const [quoteNote, setQuoteNote]   = useState("");

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/custom-requests");
      setRequests(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openDetail = (req) => {
    setSelected(req);
    setActionMsg("");
    setQuotePrice(req.quotedPrice || "");
    setQuoteNote(req.adminNote || "");
  };

  // Generic status update helper
  const updateStatus = async (newStatus, extra = {}) => {
    setActing(true);
    setActionMsg("");
    try {
      const { data } = await api.put(`/admin/custom-requests/${selected._id}`, {
        status: newStatus,
        ...extra,
      });
      setRequests(prev => prev.map(r => r._id === selected._id ? data.request : r));
      setSelected(data.request);
      setActionMsg("✅ Done!");
    } catch (err) {
      setActionMsg("❌ " + (err.response?.data?.message || "Failed"));
    } finally { setActing(false); }
  };

  const markCompleted = async () => {
    if (!window.confirm("Mark this event as completed?")) return;
    setActing(true);
    setActionMsg("");
    try {
      const { data } = await api.post(`/admin/custom-requests/${selected._id}/mark-completed`);
      setRequests(prev => prev.map(r => r._id === selected._id ? data.request : r));
      setSelected(data.request);
      setActionMsg("✅ Event marked completed!");
    } catch (err) {
      setActionMsg("❌ " + (err.response?.data?.message || "Failed"));
    } finally { setActing(false); }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm("Delete this request?")) return;
    try {
      await api.delete(`/admin/custom-requests/${id}`);
      setRequests(prev => prev.filter(r => r._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch { alert("Delete failed"); }
  };

  const filtered = requests.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      r.name?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.phone?.includes(q) ||
      r.eventCategory?.toLowerCase().includes(q) ||
      r.venue?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = FILTER_OPTIONS.reduce((acc, s) => {
    acc[s] = requests.filter(r => r.status === s).length;
    return acc;
  }, {});

  const cardStyle = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "18px 20px",
    cursor: "pointer",
    transition: "border-color 0.2s",
  };

  return (
    <AdminLayout>
      <div style={{ padding: "28px 24px" }}>

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">✨ Custom Requests</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginTop: 2 }}>
              {requests.length} total requests
            </p>
          </div>
          <button onClick={fetchRequests}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: "rgba(124,58,237,0.3)", border: "1px solid rgba(124,58,237,0.5)" }}>
            Refresh
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {[["all", "All", requests.length], ...FILTER_OPTIONS.map(s => [s, s.charAt(0).toUpperCase()+s.slice(1), counts[s]])].map(([key, label, count]) => (
            <button key={key} onClick={() => setStatusFilter(key)}
              className="px-4 py-1.5 rounded-xl text-xs font-bold"
              style={{
                background: statusFilter === key ? (STATUS_STYLES[key]?.bg || "rgba(124,58,237,0.2)") : "rgba(255,255,255,0.04)",
                color: statusFilter === key ? (STATUS_STYLES[key]?.color || "#c084fc") : "rgba(255,255,255,0.4)",
                border: `1px solid ${statusFilter === key ? (STATUS_STYLES[key]?.color || "#c084fc") + "55" : "rgba(255,255,255,0.08)"}`,
                cursor: "pointer",
              }}>
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Search */}
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email, event type, venue..."
          style={{ ...inputStyle, marginBottom: 20, maxWidth: 420 }} />

        {/* List */}
        {loading ? (
          <div className="text-center py-20" style={{ color: "rgba(255,255,255,0.3)" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20" style={{ color: "rgba(255,255,255,0.3)" }}>No requests found.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(req => {
              const s = STATUS_STYLES[req.status] || STATUS_STYLES.pending;
              return (
                <div key={req._id} onClick={() => openDetail(req)} style={cardStyle}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-white font-bold">
                          {EVENT_EMOJIS[req.eventCategory] || "✨"} {req.eventCategory}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                          style={{ background: s.bg, color: s.color }}>
                          {req.status}
                        </span>
                        {req.quotedPrice > 0 && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                            style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa" }}>
                            ₹{req.quotedPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>
                        👤 {req.name} &nbsp;|&nbsp; 📞 {req.phone} &nbsp;|&nbsp; 📧 {req.email}
                      </p>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", marginTop: 2 }}>
                        📅 {req.date} &nbsp;|&nbsp; 📍 {req.venue}
                        {req.guestCount > 0 && ` | 👥 ${req.guestCount}`}
                        {req.budgetRange && ` | 💰 ${req.budgetRange}`}
                      </p>
                      {req.services?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {req.services.map(sv => (
                            <span key={sv} className="px-2 py-0.5 rounded text-xs"
                              style={{ background: "rgba(192,132,252,0.08)", color: "#c084fc" }}>
                              {sv}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {req.referenceImages?.length > 0 && (
                        <div className="flex gap-1">
                          {req.referenceImages.slice(0, 3).map((url, i) => (
                            <img key={i} src={url} alt="" className="rounded-lg object-cover"
                              style={{ width: 44, height: 44, border: "1px solid rgba(192,132,252,0.2)" }} />
                          ))}
                        </div>
                      )}
                      <button onClick={e => { e.stopPropagation(); deleteRequest(req._id); }}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                        style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                        Delete
                      </button>
                    </div>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", marginTop: 8 }}>
                    {new Date(req.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
          onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="w-full max-w-2xl rounded-3xl p-7"
            style={{ background: "#12091a", border: "1px solid rgba(192,132,252,0.2)" }}>

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-white">
                {EVENT_EMOJIS[selected.eventCategory] || "✨"} {selected.eventCategory} Request
              </h2>
              <button onClick={() => setSelected(null)}
                style={{ color: "rgba(255,255,255,0.4)", background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>
                ✕
              </button>
            </div>

            {/* Status Badge */}
            <div className="mb-5">
              <span className="px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: STATUS_STYLES[selected.status]?.bg, color: STATUS_STYLES[selected.status]?.color }}>
                {selected.status.toUpperCase()}
              </span>
              {selected.quotedPrice > 0 && (
                <span className="ml-2 px-3 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa" }}>
                  ₹{selected.quotedPrice.toLocaleString()} quoted
                </span>
              )}
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
              {[
                ["Name", selected.name],
                ["Phone", selected.phone],
                ["Email", selected.email],
                ["Date", selected.date + (selected.time ? " " + selected.time : "")],
                ["Venue", selected.venue],
                ["Guests", selected.guestCount || "—"],
                ["Budget", selected.budgetRange || "—"],
              ].map(([k, v]) => (
                <div key={k}>
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginBottom: 2 }}>{k.toUpperCase()}</p>
                  <p style={{ color: "#fff" }}>{v}</p>
                </div>
              ))}
            </div>

            {/* Services */}
            {selected.services?.length > 0 && (
              <div className="mb-4">
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginBottom: 6 }}>SERVICES REQUESTED</p>
                <div className="flex flex-wrap gap-2">
                  {selected.services.map(s => (
                    <span key={s} className="px-3 py-1 rounded-xl text-xs font-semibold"
                      style={{ background: "rgba(192,132,252,0.1)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.2)" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Service Details */}
            {selected.serviceDetails && Object.keys(selected.serviceDetails).length > 0 && (() => {
              const SERVICE_PREFIX = {
                "Photography": "photo_", "Videography": "video_",
                "Decoration": "deco_", "Stage Setup": "stage_",
                "Catering": "cater_", "DJ & Music": "dj_",
                "Lighting": "light_", "Mehendi Artist": "mehendi_",
                "Makeup Artist": "makeup_", "Florist": "floral_",
                "Transportation": "trans_",
              };
              const SD = selected.serviceDetails;
              const sections = (selected.services || []).map(service => {
                const prefix = SERVICE_PREFIX[service];
                const keys = prefix
                  ? Object.keys(SD).filter(k => k.startsWith(prefix))
                  : Object.keys(SD).filter(k => k.toLowerCase().startsWith(service.substring(0,4).toLowerCase()));
                return { service, keys };
              }).filter(s => s.keys.length > 0);
              if (!sections.length) return null;
              return (
                <div className="mb-4">
                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginBottom: 8 }}>SERVICE DETAILS</p>
                  <div className="flex flex-col gap-3">
                    {sections.map(({ service, keys }) => (
                      <div key={service} className="p-3 rounded-xl" style={{ background: "rgba(192,132,252,0.05)", border: "1px solid rgba(192,132,252,0.12)" }}>
                        <p className="text-xs font-bold mb-2" style={{ color: "#c084fc" }}>{service}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {keys.map(k => (
                            <div key={k}>
                              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", marginBottom: 2 }}>
                                {k.replace(/_/g, " ").replace(/^[a-z]+ /, "").toUpperCase()}
                              </p>
                              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px" }}>
                                {Array.isArray(SD[k]) ? SD[k].join(", ") : SD[k]}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Service Images */}
            {selected.serviceImages && Object.keys(selected.serviceImages).length > 0 && (
              <div className="mb-4">
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginBottom: 8 }}>SERVICE REFERENCE IMAGES</p>
                <div className="flex flex-col gap-4">
                  {Object.entries(selected.serviceImages).map(([service, urls]) => (
                    urls?.length > 0 && (
                      <div key={service}>
                        <p className="text-xs font-semibold mb-2" style={{ color: "#a78bfa" }}>{service}</p>
                        <div className="flex flex-wrap gap-2">
                          {urls.map((url, i) => (
                            <a key={i} href={url} target="_blank" rel="noreferrer">
                              <img src={url} alt="" className="rounded-xl object-cover"
                                style={{ width: 90, height: 90, border: "1px solid rgba(192,132,252,0.25)" }} />
                            </a>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Preferred Contact & Duration */}
            {(selected.preferredContact || selected.duration) && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {selected.preferredContact && (
                  <div>
                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginBottom: 2 }}>PREFERRED CONTACT</p>
                    <p style={{ color: "#fff", fontSize: "13px" }}>{selected.preferredContact}</p>
                  </div>
                )}
                {selected.duration && (
                  <div>
                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginBottom: 2 }}>EVENT DURATION</p>
                    <p style={{ color: "#fff", fontSize: "13px" }}>{selected.duration}</p>
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            {selected.notes && (
              <div className="mb-5 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", marginBottom: 4 }}>CUSTOMER NOTES</p>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>{selected.notes}</p>
              </div>
            )}

            {/* Admin Note (read-only if exists) */}
            {selected.adminNote && (
              <div className="mb-5 p-4 rounded-2xl" style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)" }}>
                <p style={{ color: "rgba(192,132,252,0.6)", fontSize: "11px", marginBottom: 4 }}>YOUR NOTE TO CUSTOMER</p>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>{selected.adminNote}</p>
              </div>
            )}

            {/* ══ SMART ACTION BUTTONS ══ */}

            {/* PENDING → Start Reviewing or Reject */}
            {selected.status === "pending" && (
              <div className="mt-5 p-5 rounded-2xl" style={{ background: "rgba(96,165,250,0.07)", border: "1px solid rgba(96,165,250,0.25)" }}>
                <p className="text-white font-bold text-sm mb-2">📋 New Request</p>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", marginBottom: 14 }}>
                  Start reviewing this request, or reject it if you can't take it up.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => updateStatus("reviewing")} disabled={acting}
                    className="flex-1 py-3 rounded-xl font-bold text-white text-sm"
                    style={{ background: acting ? "rgba(96,165,250,0.3)" : "linear-gradient(135deg,#60a5fa,#3b82f6)", cursor: acting ? "not-allowed" : "pointer" }}>
                    {acting ? "Updating..." : "🔍 Start Reviewing"}
                  </button>
                  <button onClick={() => {
                    if (window.confirm("Reject this request?")) updateStatus("rejected");
                  }} disabled={acting}
                    className="flex-1 py-3 rounded-xl font-bold text-sm"
                    style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)", cursor: acting ? "not-allowed" : "pointer" }}>
                    ❌ Reject Request
                  </button>
                </div>
                {actionMsg && <p className="mt-3 text-center text-sm font-bold" style={{ color: actionMsg.startsWith("✅") ? "#4ade80" : "#f87171" }}>{actionMsg}</p>}
              </div>
            )}

            {/* REVIEWING → Send Quote */}
            {selected.status === "reviewing" && (
              <div className="mt-5 p-5 rounded-2xl" style={{ background: "rgba(167,139,250,0.07)", border: "1px solid rgba(167,139,250,0.25)" }}>
                <p className="text-white font-bold text-sm mb-3">💬 Send Quote to Customer</p>
                <div className="mb-3">
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginBottom: 5 }}>QUOTED PRICE (₹) *</p>
                  <input type="number" value={quotePrice} onChange={e => setQuotePrice(e.target.value)}
                    placeholder="e.g. 50000"
                    style={inputStyle} />
                </div>
                <div className="mb-4">
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginBottom: 5 }}>NOTE TO CUSTOMER (optional)</p>
                  <textarea value={quoteNote} onChange={e => setQuoteNote(e.target.value)}
                    placeholder="e.g. Package includes decoration, photography, and catering for 200 guests..."
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical" }} />
                </div>
                <button
                  onClick={() => {
                    if (!quotePrice) return alert("Please enter a quoted price");
                    updateStatus("quoted", {
                      quotedPrice: Number(quotePrice),
                      adminNote: quoteNote,
                    });
                  }}
                  disabled={acting}
                  className="w-full py-3 rounded-xl font-bold text-white text-sm"
                  style={{ background: acting ? "rgba(167,139,250,0.3)" : "linear-gradient(135deg,#a78bfa,#7c3aed)", cursor: acting ? "not-allowed" : "pointer" }}>
                  {acting ? "Sending..." : "📨 Send Quote"}
                </button>
                {actionMsg && <p className="mt-3 text-center text-sm font-bold" style={{ color: actionMsg.startsWith("✅") ? "#4ade80" : "#f87171" }}>{actionMsg}</p>}
              </div>
            )}

            {/* QUOTED → Waiting for user */}
            {selected.status === "quoted" && (
              <div className="mt-5 p-4 rounded-2xl" style={{ background: "rgba(167,139,250,0.07)", border: "1px solid rgba(167,139,250,0.25)" }}>
                <p className="text-white font-bold text-sm mb-1">⏳ Quote Sent</p>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px" }}>
                  Waiting for the customer to Accept or Decline your quote of <strong style={{ color: "#a78bfa" }}>₹{selected.quotedPrice?.toLocaleString()}</strong>.
                </p>
              </div>
            )}

            {/* ACCEPTED → Waiting for payment */}
            {selected.status === "accepted" && (
              <div className="mt-5 p-4 rounded-2xl" style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.3)" }}>
                <p className="text-white font-bold text-sm mb-1">🤝 Customer Accepted!</p>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px" }}>
                  Waiting for the customer to complete their booking & advance payment. Once they pay, status will auto-update to <strong style={{ color: "#4ade80" }}>Confirmed</strong>.
                </p>
              </div>
            )}

            {/* CONFIRMED → Mark Completed */}
            {selected.status === "confirmed" && (
              <div className="mt-5 p-5 rounded-2xl" style={{ background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.3)" }}>
                <p className="text-white font-bold text-sm mb-1">✅ Event Confirmed!</p>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", marginBottom: 14 }}>
                  Event date done and full payment received? Mark as completed.
                </p>
                <button onClick={markCompleted} disabled={acting}
                  className="w-full py-3 rounded-xl font-bold text-white text-sm"
                  style={{ background: acting ? "rgba(20,184,166,0.3)" : "linear-gradient(135deg,#2dd4bf,#0d9488)", cursor: acting ? "not-allowed" : "pointer" }}>
                  {acting ? "Updating..." : "🎊 Mark Event as Completed"}
                </button>
                {actionMsg && <p className="mt-3 text-center text-sm font-bold" style={{ color: actionMsg.startsWith("✅") ? "#4ade80" : "#f87171" }}>{actionMsg}</p>}
              </div>
            )}

            {/* COMPLETED */}
            {selected.status === "completed" && (
              <div className="mt-5 p-4 rounded-2xl" style={{ background: "rgba(20,184,166,0.07)", border: "1px solid rgba(20,184,166,0.3)" }}>
                <p className="font-bold text-sm" style={{ color: "#2dd4bf" }}>🎊 Event Completed! Great work.</p>
              </div>
            )}

            {/* REJECTED */}
            {selected.status === "rejected" && (
              <div className="mt-5 p-4 rounded-2xl" style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.25)" }}>
                <p className="font-bold text-sm" style={{ color: "#f87171" }}>❌ Request was declined by the customer.</p>
              </div>
            )}

          </div>
        </div>
      )}
    </AdminLayout>
  );
}