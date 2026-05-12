import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

// ── Status config ────────────────────────────────────────────
const statusColors = {
  pending:   { bg: "rgba(234,179,8,0.12)",   text: "#facc15", border: "rgba(234,179,8,0.3)" },
  reviewing: { bg: "rgba(59,130,246,0.12)",  text: "#60a5fa", border: "rgba(59,130,246,0.3)" },
  quoted:    { bg: "rgba(167,139,250,0.12)", text: "#a78bfa", border: "rgba(167,139,250,0.3)" },
  accepted:  { bg: "rgba(251,146,60,0.12)",  text: "#fb923c", border: "rgba(251,146,60,0.3)" },
  confirmed: { bg: "rgba(34,197,94,0.12)",   text: "#4ade80", border: "rgba(34,197,94,0.3)" },
  completed: { bg: "rgba(20,184,166,0.12)",  text: "#2dd4bf", border: "rgba(20,184,166,0.3)" },
  rejected:  { bg: "rgba(239,68,68,0.12)",   text: "#f87171", border: "rgba(239,68,68,0.3)" },
  cancelled: { bg: "rgba(107,114,128,0.12)", text: "#9ca3af", border: "rgba(107,114,128,0.3)" },
};
const statusIcons = { pending: "⏳", reviewing: "👀", quoted: "💰", accepted: "🤝", confirmed: "✅", completed: "🎊", rejected: "❌", cancelled: "🚫" };
const statusLabel = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

const STEPS = ["Submitted", "Reviewing", "Quoted", "Accepted", "Confirmed", "Completed"];
const stepStatus = { pending: 0, reviewing: 1, quoted: 2, accepted: 3, confirmed: 4, completed: 5 };

// ── Section wrapper ──────────────────────────────────────────
const Section = ({ title, children }) => (
  <div style={{ marginBottom: "14px", borderRadius: "18px", padding: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
    <p style={{ fontSize: "11px", fontWeight: "800", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>{title}</p>
    {children}
  </div>
);

// ── Info card ────────────────────────────────────────────────
const InfoCard = ({ icon, label, value, highlight }) => (
  <div style={{ padding: "14px 16px", borderRadius: "14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "5px" }}>{icon} {label}</p>
    <p style={{ fontSize: "14px", fontWeight: "700", color: highlight ? "#d4af37" : "white", wordBreak: "break-word" }}>{value || "—"}</p>
  </div>
);

// ── Status Stepper ───────────────────────────────────────────
const StatusStepper = ({ status }) => {
  if (["rejected", "cancelled"].includes(status)) return null;
  const activeStep = stepStatus[status] ?? 0;
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
      {STEPS.map((step, i) => {
        const done = i < activeStep;
        const active = i === activeStep;
        return (
          <div key={step} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: "700",
                background: done ? "#a78bfa" : active ? "linear-gradient(135deg,#c084fc,#f472b6)" : "rgba(255,255,255,0.07)",
                color: done || active ? "#fff" : "rgba(255,255,255,0.3)",
                boxShadow: active ? "0 0 10px rgba(192,132,252,0.5)" : "none",
                border: done || active ? "none" : "1px solid rgba(255,255,255,0.1)",
              }}>
                {done ? "✓" : i + 1}
              </div>
              <p style={{ fontSize: "9px", marginTop: "4px", fontWeight: "600", whiteSpace: "nowrap",
                color: active ? "#c084fc" : done ? "#a78bfa" : "rgba(255,255,255,0.25)" }}>
                {step}
              </p>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: "2px", margin: "0 4px 16px", borderRadius: "2px",
                background: i < activeStep ? "#a78bfa" : "rgba(255,255,255,0.08)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────
export default function CustomRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [req, setReq] = useState(location.state?.request || null);
  const [loading, setLoading] = useState(!req);
  const [cancelling, setCancelling] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  // Fallback: fetch from API if not passed via state
  useEffect(() => {
    if (req) return;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/users/custom-requests/my");
        const found = data.find(r => r._id === id);
        setReq(found || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Cancel this request?")) return;
    setCancelling(true);
    try {
      await api.delete(`/users/custom-requests/${id}`);
      setReq(prev => ({ ...prev, status: "cancelled" }));
    } catch { alert("Failed to cancel. Try again."); }
    finally { setCancelling(false); }
  };

  // All images: referenceImages + serviceImages values
  const refImages = req?.referenceImages || [];
  const svcImagesList = req?.serviceImages
    ? Object.values(req.serviceImages).flat()
    : [];
  const allImages = [...refImages, ...svcImagesList].filter(Boolean);

  const sc = statusColors[req?.status] || statusColors.pending;

  // ── Loading ──
  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0d0b1a", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
      <div style={{ width: "44px", height: "44px", borderRadius: "50%", border: "3px solid #c084fc", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>Loading request...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  // ── Not found ──
  if (!req) return (
    <div style={{ minHeight: "100vh", background: "#0d0b1a", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px" }}>
      <p style={{ fontSize: "48px" }}>🔍</p>
      <p style={{ color: "white", fontSize: "18px", fontWeight: "700" }}>Request not found</p>
      <button onClick={() => navigate("/dashboard/requests")}
        style={{ marginTop: "8px", padding: "10px 24px", borderRadius: "50px", background: "linear-gradient(135deg,#c084fc,#f472b6)", color: "white", fontWeight: "700", border: "none", cursor: "pointer" }}>
        ← Back to Requests
      </button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0d0b1a", paddingBottom: "60px" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease both; }
        .img-thumb:hover { opacity: 1 !important; transform: scale(1.05); }
        .action-btn:hover { opacity: 0.85; transform: translateY(-1px); }
      `}</style>

      {/* ── Hero ── */}
      <div style={{ position: "relative", minHeight: allImages.length ? "300px" : "180px", overflow: "hidden" }}>
        {allImages[activeImg] ? (
          <img src={allImages[activeImg]} alt="reference"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.3)" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#1e0d35,#0d0b1a)" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(13,11,26,0.97))" }} />

        {/* Back */}
        <div style={{ position: "relative", padding: "20px 20px 0", zIndex: 2 }}>
          <button onClick={() => navigate("/dashboard/requests")}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "50px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer", backdropFilter: "blur(8px)" }}>
            ← Back
          </button>
        </div>

        {/* Hero content */}
        <div style={{ position: "relative", zIndex: 2, padding: "20px 20px 28px" }} className="fade-up">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "50px", background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
              {statusIcons[req.status] || "⏳"} {statusLabel(req.status)}
            </span>
            {req.quotedPrice > 0 && (
              <span style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "50px", background: "rgba(212,175,55,0.15)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.3)", fontWeight: "600" }}>
                💎 Quoted: ₹{req.quotedPrice.toLocaleString()}
              </span>
            )}
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: "900", color: "white", margin: "0 0 4px", lineHeight: 1.2 }}>
            {req.eventCategory}
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", margin: "0 0 2px" }}>
            📅 {req.date}{req.time ? ` at ${req.time}` : ""} &nbsp;·&nbsp; 📍 {req.venue || "—"}
          </p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", margin: 0 }}>
            👥 {req.guestCount || "—"} guests
          </p>
        </div>

        {/* Image thumbnails */}
        {allImages.length > 1 && (
          <div style={{ position: "relative", zIndex: 2, display: "flex", gap: "8px", padding: "0 20px 20px", overflowX: "auto" }}>
            {allImages.map((img, i) => (
              <img key={i} src={img} alt={`img-${i}`}
                className="img-thumb"
                onClick={() => setActiveImg(i)}
                style={{ width: "60px", height: "60px", borderRadius: "10px", objectFit: "cover", cursor: "pointer", flexShrink: 0, transition: "all 0.2s",
                  border: i === activeImg ? "2px solid #c084fc" : "2px solid transparent",
                  opacity: i === activeImg ? 1 : 0.5 }} />
            ))}
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div style={{ padding: "0 16px", maxWidth: "640px", margin: "0 auto" }}>

        {/* Request ID strip */}
        <div style={{ margin: "16px 0", padding: "12px 16px", borderRadius: "12px", background: "rgba(192,132,252,0.08)", border: "1px solid rgba(192,132,252,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Request ID</p>
          <p style={{ fontSize: "13px", fontWeight: "800", color: "#c084fc", fontFamily: "monospace", letterSpacing: "0.1em" }}>
            #{req._id?.slice(-8).toUpperCase()}
          </p>
        </div>

        {/* Status Stepper */}
        <Section title="📊 Request Progress">
          <StatusStepper status={req.status} />
          {["rejected", "cancelled"].includes(req.status) && (
            <div style={{ padding: "10px 14px", borderRadius: "12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", fontSize: "13px", fontWeight: "600" }}>
              {req.status === "cancelled" ? "🚫 This request was cancelled." : "❌ This request was rejected."}
            </div>
          )}
        </Section>

        {/* Quoted Price */}
        {req.quotedPrice > 0 && (
          <Section title="💎 Quoted Price">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: "14px", background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.25)" }}>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>Admin quoted price</p>
              <p style={{ color: "#d4af37", fontWeight: "900", fontSize: "22px" }}>₹{req.quotedPrice.toLocaleString()}</p>
            </div>
          </Section>
        )}

        {/* Admin Note */}
        {req.adminNote && (
          <Section title="💬 Message from Admin">
            <div style={{ padding: "12px 14px", borderRadius: "14px", background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.2)", color: "#93c5fd", fontSize: "14px", lineHeight: 1.6 }}>
              {req.adminNote}
            </div>
          </Section>
        )}

        {/* Services */}
        {req.services?.length > 0 && (
          <Section title="🛠️ Requested Services">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {req.services.map(sv => (
                <span key={sv} style={{ fontSize: "13px", padding: "6px 14px", borderRadius: "50px", background: "rgba(192,132,252,0.1)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.25)", fontWeight: "600" }}>
                  ✦ {sv}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Event Info */}
        <Section title="📋 Event Info">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <InfoCard icon="📅" label="Event Date" value={req.date} />
            <InfoCard icon="📍" label="Venue" value={req.venue} />
            <InfoCard icon="👥" label="Guests" value={req.guestCount ? `${req.guestCount} people` : null} />
            <InfoCard icon="📞" label="Phone" value={req.phone} />
            <InfoCard icon="🗓️" label="Submitted" value={new Date(req.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} />
          </div>
          {req.notes && (
            <div style={{ marginTop: "10px", padding: "12px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", fontSize: "13px", fontStyle: "italic", lineHeight: 1.6 }}>
              💬 "{req.notes}"
            </div>
          )}
        </Section>

        {/* Service Details Q&A */}
        {req.serviceDetails && Object.keys(req.serviceDetails).length > 0 && (
          <Section title="📝 Service Preferences">
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {Object.entries(req.serviceDetails).map(([key, value]) => (
                <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.04)" }}>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</p>
                  <p style={{ fontSize: "13px", fontWeight: "600", color: "white" }}>{value}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Service Images (per service) */}
        {req.serviceImages && Object.keys(req.serviceImages).length > 0 && (
          <Section title="🖼️ Service Reference Images">
            {Object.entries(req.serviceImages).map(([service, imgs]) => (
              <div key={service} style={{ marginBottom: "14px" }}>
                <p style={{ fontSize: "12px", fontWeight: "700", color: "#c084fc", marginBottom: "8px" }}>{service}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                  {imgs.map((img, i) => (
                    <img key={i} src={img} alt={service}
                      onClick={() => window.open(img, "_blank")}
                      style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "10px", cursor: "pointer", border: "1px solid rgba(192,132,252,0.25)", transition: "transform 0.2s" }}
                      onMouseEnter={e => e.target.style.transform = "scale(1.04)"}
                      onMouseLeave={e => e.target.style.transform = "scale(1)"} />
                  ))}
                </div>
              </div>
            ))}
          </Section>
        )}

        {/* Reference Images */}
        {refImages.length > 0 && (
          <Section title="📸 Reference Images">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
              {refImages.map((img, i) => (
                <img key={i} src={img} alt={`ref-${i}`}
                  onClick={() => window.open(img, "_blank")}
                  style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "10px", cursor: "pointer", border: "1px solid rgba(192,132,252,0.25)", transition: "transform 0.2s" }}
                  onMouseEnter={e => e.target.style.transform = "scale(1.04)"}
                  onMouseLeave={e => e.target.style.transform = "scale(1)"} />
              ))}
            </div>
          </Section>
        )}

        {/* Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
          {["pending", "reviewing"].includes(req.status) && (
            <button onClick={handleCancel} disabled={cancelling} className="action-btn"
              style={{ width: "100%", padding: "15px", borderRadius: "14px", background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)", fontSize: "15px", fontWeight: "800", cursor: "pointer", transition: "all 0.2s" }}>
              {cancelling ? "Cancelling..." : "❌ Cancel Request"}
            </button>
          )}
          <button onClick={() => navigate("/dashboard/requests")} className="action-btn"
            style={{ width: "100%", padding: "14px", borderRadius: "14px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)", fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s" }}>
            ← Back to All Requests
          </button>
        </div>

      </div>
    </div>
  );
}