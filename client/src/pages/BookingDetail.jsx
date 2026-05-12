import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const statusConfig = {
  confirmed:  { bg: "rgba(34,197,94,0.12)",  color: "#4ade80", border: "rgba(34,197,94,0.3)",  icon: "✅", label: "Confirmed" },
  pending:    { bg: "rgba(250,204,21,0.12)", color: "#facc15", border: "rgba(250,204,21,0.3)", icon: "⏳", label: "Pending" },
  completed:  { bg: "rgba(99,102,241,0.12)", color: "#818cf8", border: "rgba(99,102,241,0.3)", icon: "🎉", label: "Completed" },
  cancelled:  { bg: "rgba(239,68,68,0.12)",  color: "#f87171", border: "rgba(239,68,68,0.3)",  icon: "❌", label: "Cancelled" },
};

const InfoCard = ({ icon, label, value, highlight }) => (
  <div style={{
    padding: "14px 16px", borderRadius: "14px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
  }}>
    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginBottom: "5px" }}>{icon} {label}</p>
    <p style={{ fontSize: "14px", fontWeight: "700", color: highlight ? "#d4af37" : "white", wordBreak: "break-word" }}>
      {value || "—"}
    </p>
  </div>
);

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [customRequest, setCustomRequest] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/users/bookings/my");
        const found = data.find(b => b._id === id);
        if (!found) { setLoading(false); return; }
        setBooking(found);

        if (found.isCustomEvent && found.customRequest) {
          // Custom event booking → fetch the custom request details
          try {
            const crRes = await api.get("/users/custom-requests/my");
            const cr = crRes.data.find(r => r._id === found.customRequest);
            setCustomRequest(cr || null);
          } catch { /* ignore */ }
        } else if (!found.isMultiBooking && found.package?.service) {
          // Normal booking → fetch matching service details
          try {
            const sRes = await api.get("/users/services");
            const allServices = sRes.data;
            const serviceName = found.package.service.toLowerCase().trim();
            const match =
              allServices.find(s => s.title?.toLowerCase().trim() === serviceName) ||
              allServices.find(s =>
                s.title?.toLowerCase().includes(serviceName) ||
                serviceName.includes(s.title?.toLowerCase().trim())
              );
            setService(match || null);
          } catch { /* ignore */ }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Cancel this booking?")) return;
    setCancelling(true);
    try {
      await api.delete(`/users/bookings/${id}`);
      setBooking(prev => ({ ...prev, status: "cancelled" }));
    } catch { alert("Failed to cancel. Try again."); }
    finally { setCancelling(false); }
  };

  // only booked style image
  const bookedStyle = service && booking && !booking.isMultiBooking
    ? (service.styles || []).find(s => s.name?.toLowerCase().trim() === booking.package?.event?.toLowerCase().trim())
    : null;
  const bookedImg = bookedStyle?.img || service?.img || null;
  const allImages = (booking && !booking.isMultiBooking && service)
    ? [bookedImg].filter(Boolean)
    : [...(customRequest?.referenceImages || [])].filter(Boolean);

  const sc = statusConfig[booking?.status] || statusConfig.pending;

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0d0b1a", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
      <div style={{ width: "44px", height: "44px", borderRadius: "50%", border: "3px solid #c084fc", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>Loading booking...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!booking) return (
    <div style={{ minHeight: "100vh", background: "#0d0b1a", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px" }}>
      <p style={{ fontSize: "48px" }}>🔍</p>
      <p style={{ color: "white", fontSize: "18px", fontWeight: "700" }}>Booking not found</p>
      <button onClick={() => navigate("/dashboard/bookings")}
        style={{ marginTop: "8px", padding: "10px 24px", borderRadius: "50px", background: "linear-gradient(135deg,#c084fc,#f472b6)", color: "white", fontWeight: "700", border: "none", cursor: "pointer" }}>
        ← Back to Bookings
      </button>
    </div>
  );

  const price = booking.isMultiBooking
    ? (booking.totalAmount ? `₹${booking.totalAmount.toLocaleString()}` : "—")
    : (booking.package?.price ? `₹${booking.package.price.toLocaleString()}` : "—");

  return (
    <div style={{ minHeight: "100vh", background: "#0d0b1a", paddingBottom: "60px" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .detail-fade { animation: fadeUp 0.4s ease both; }
        .img-thumb:hover { opacity: 1 !important; transform: scale(1.05); }
        .action-btn:hover { opacity: 0.85; transform: translateY(-1px); }
      `}</style>

      {/* Hero Section */}
      <div style={{ position: "relative", minHeight: allImages.length ? "320px" : "180px", overflow: "hidden" }}>
        {/* Background image or gradient */}
        {allImages[activeImg] ? (
          <img src={allImages[activeImg]} alt="service"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.35)" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#1a0d2e,#0d0b1a)" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(13,11,26,0.95))" }} />

        {/* Back Button */}
        <div style={{ position: "relative", padding: "20px 20px 0", zIndex: 2 }}>
          <button onClick={() => navigate("/dashboard/bookings")}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 16px", borderRadius: "50px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer", backdropFilter: "blur(8px)" }}>
            ← Back
          </button>
        </div>

        {/* Hero Content */}
        <div style={{ position: "relative", zIndex: 2, padding: "24px 20px 32px" }} className="detail-fade">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", padding: "4px 12px", borderRadius: "50px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
              {sc.icon} {sc.label}
            </span>
            {booking.paymentType === "advance" && (
              <span style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "50px", background: "rgba(212,175,55,0.15)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.3)", fontWeight: "600" }}>
                25% Advance
              </span>
            )}
          </div>

          <h1 style={{ fontSize: "28px", fontWeight: "900", color: "white", margin: "0 0 4px", lineHeight: 1.2 }}>
            {booking.isMultiBooking ? "Multi-Service Booking" : (booking.package?.service || "Booking")}
          </h1>
          {!booking.isMultiBooking && (
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", margin: "0 0 4px" }}>
              {booking.package?.event}{booking.package?.duration ? ` · ${booking.package.duration}` : ""}
            </p>
          )}
          <p style={{ fontSize: "24px", fontWeight: "900", color: "#d4af37", margin: "8px 0 0" }}>{price}</p>
        </div>

        {/* Image Thumbnails */}
        {allImages.length > 1 && (
          <div style={{ position: "relative", zIndex: 2, display: "flex", gap: "8px", padding: "0 20px 20px", overflowX: "auto" }}>
            {allImages.map((img, i) => (
              <img key={i} src={img} alt={`img-${i}`}
                className="img-thumb"
                onClick={() => setActiveImg(i)}
                style={{
                  width: "60px", height: "60px", borderRadius: "10px", objectFit: "cover", cursor: "pointer",
                  border: i === activeImg ? "2px solid #c084fc" : "2px solid transparent",
                  opacity: i === activeImg ? 1 : 0.55,
                  transition: "all 0.2s", flexShrink: 0,
                }} />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "0 16px", maxWidth: "640px", margin: "0 auto" }}>

        {/* Booking ID strip */}
        <div style={{ margin: "16px 0", padding: "12px 16px", borderRadius: "12px", background: "rgba(192,132,252,0.08)", border: "1px solid rgba(192,132,252,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Booking ID</p>
          <p style={{ fontSize: "13px", fontWeight: "800", color: "#c084fc", fontFamily: "monospace", letterSpacing: "0.1em" }}>
            #{booking._id?.slice(-8).toUpperCase()}
          </p>
        </div>

        {/* 3-Step Status Stepper — only for non-custom, non-cancelled bookings */}
        {!booking.isCustomEvent && booking.status !== "cancelled" && (() => {
          const steps = [
            { key: "pending",   icon: "📋", label: "Pending" },
            { key: "confirmed", icon: "✅", label: "Confirmed" },
            { key: "completed", icon: "🎉", label: "Completed" },
          ];
          const currentIdx = steps.findIndex(s => s.key === booking.status);
          return (
            <div style={{ margin: "0 0 16px", padding: "18px 16px", borderRadius: "18px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <p style={{ fontSize: "11px", fontWeight: "800", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>📍 Booking Progress</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
                {steps.map((step, i) => {
                  const done = i < currentIdx;
                  const active = i === currentIdx;
                  const stepColor = active ? "#c084fc" : done ? "#4ade80" : "rgba(255,255,255,0.15)";
                  const labelColor = active ? "#c084fc" : done ? "#4ade80" : "rgba(255,255,255,0.3)";
                  return (
                    <div key={step.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, position: "relative", zIndex: 1 }}>
                      {i < steps.length - 1 && (
                        <div style={{ position: "absolute", top: "20px", left: "50%", width: "100%", height: "2px",
                          background: done ? "#4ade80" : "rgba(255,255,255,0.08)", zIndex: 0 }} />
                      )}
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px",
                        background: active ? "rgba(192,132,252,0.18)" : done ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.05)",
                        border: `2px solid ${stepColor}`,
                        boxShadow: active ? "0 0 14px rgba(192,132,252,0.4)" : "none",
                        transition: "all 0.3s", zIndex: 1, position: "relative" }}>
                        {done ? "✓" : step.icon}
                      </div>
                      <p style={{ fontSize: "11px", fontWeight: active ? "800" : "600", color: labelColor, marginTop: "7px", textAlign: "center" }}>
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Multi-booking packages */}
        {booking.isMultiBooking && (
          <Section title="🛒 Services Booked">
            {(booking.packages || []).map((pkg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div>
                  <p style={{ color: "white", fontWeight: "700", fontSize: "14px" }}>{pkg.service}</p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>{pkg.event}{pkg.duration ? ` · ${pkg.duration}` : ""}</p>
                </div>
                <p style={{ color: "#d4af37", fontWeight: "800", fontSize: "15px" }}>₹{pkg.price?.toLocaleString()}</p>
              </div>
            ))}
          </Section>
        )}

        {/* Service / Event Details */}
        {!booking.isMultiBooking && (
          booking.isCustomEvent ? (
            <Section title="🎨 Custom Event Details">
              {customRequest ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ padding: "14px 16px", borderRadius: "14px", background: "linear-gradient(135deg, rgba(192,132,252,0.1), rgba(244,114,182,0.08))", border: "1px solid rgba(192,132,252,0.25)" }}>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginBottom: "5px" }}>🎪 Event Category</p>
                    <p style={{ color: "white", fontWeight: "800", fontSize: "17px" }}>{customRequest.eventCategory}</p>
                  </div>
                  {customRequest.services?.length > 0 && (
                    <div>
                      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: "700", marginBottom: "8px" }}>🛒 SERVICES REQUESTED</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {customRequest.services.map((s, i) => (
                          <span key={i} style={{ fontSize: "12px", padding: "6px 14px", borderRadius: "50px", background: "rgba(192,132,252,0.1)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.25)", fontWeight: "600" }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {customRequest.guestCount > 0 && <InfoCard icon="👥" label="Guest Count" value={customRequest.guestCount} />}
                    {customRequest.budgetRange && <InfoCard icon="💰" label="Budget Range" value={customRequest.budgetRange} highlight />}
                    {customRequest.duration && <InfoCard icon="⏱" label="Duration" value={customRequest.duration} />}
                    {customRequest.preferredContact && <InfoCard icon="📲" label="Preferred Contact" value={customRequest.preferredContact} />}
                  </div>
                  {customRequest.notes && (
                    <div style={{ padding: "12px 14px", borderRadius: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)", fontSize: "13px", fontStyle: "italic", lineHeight: 1.6 }}>
                      📝 {customRequest.notes}
                    </div>
                  )}
                  {customRequest.quotedPrice > 0 && (
                    <div style={{ padding: "14px 16px", borderRadius: "14px", background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.25)" }}>
                      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginBottom: "5px" }}>💎 Quoted Price</p>
                      <p style={{ color: "#d4af37", fontWeight: "900", fontSize: "20px" }}>₹{customRequest.quotedPrice?.toLocaleString()}</p>
                    </div>
                  )}
                  {customRequest.adminNote && (
                    <div style={{ padding: "12px 14px", borderRadius: "14px", background: "rgba(96,165,250,0.06)", border: "1px solid rgba(96,165,250,0.2)", color: "#93c5fd", fontSize: "13px" }}>
                      💬 {customRequest.adminNote}
                    </div>
                  )}
                  {customRequest.referenceImages?.length > 0 && (
                    <div>
                      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: "700", marginBottom: "8px" }}>🖼️ REFERENCE IMAGES</p>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
                        {customRequest.referenceImages.map((img, i) => (
                          <img key={i} src={img} alt={`ref-${i}`} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: "10px" }} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", textAlign: "center", padding: "12px 0" }}>Custom event details not available</p>
              )}
            </Section>
          ) : (
            <Section title="✨ Service Details">
              {!service ? (
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", textAlign: "center", padding: "12px 0" }}>Service details not available</p>
              ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Service header */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {service.icon && <span style={{ fontSize: "28px" }}>{service.icon}</span>}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <h2 style={{ color: "white", fontSize: "18px", fontWeight: "900", margin: 0 }}>{service.title}</h2>
                      {service.tag && (
                        <span style={{ fontSize: "11px", padding: "2px 10px", borderRadius: "50px", background: "rgba(212,175,55,0.15)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.3)", fontWeight: "700" }}>
                          {service.tag}
                        </span>
                      )}
                    </div>
                    {service.subtitle && <p style={{ color: "#c084fc", fontSize: "13px", margin: "3px 0 0" }}>{service.subtitle}</p>}
                  </div>
                </div>

                {service.desc && (
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>{service.desc}</p>
                )}

                {/* Rating */}
                {service.rating && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "#facc15", fontSize: "15px" }}>
                      {"★".repeat(Math.round(service.rating))}{"☆".repeat(5 - Math.round(service.rating))}
                    </span>
                    <span style={{ color: "white", fontWeight: "700", fontSize: "14px" }}>{service.rating}</span>
                    {service.reviews > 0 && <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px" }}>({service.reviews} reviews)</span>}
                  </div>
                )}

                {/* Highlights */}
                {service.highlights?.length > 0 && (
                  <div>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: "700", marginBottom: "8px" }}>🌟 HIGHLIGHTS</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {service.highlights.map((h, i) => (
                        <span key={i} style={{ fontSize: "12px", padding: "5px 12px", borderRadius: "50px", background: "rgba(192,132,252,0.1)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.2)" }}>
                          ✓ {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Styles / packages */}
                {service.styles?.length > 0 && (
                  <div>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: "700", marginBottom: "10px" }}>🎨 PACKAGES</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {service.styles.filter(style =>
                        style.name?.toLowerCase() === booking.package?.event?.toLowerCase() ||
                        style.name?.toLowerCase() === booking.package?.duration?.toLowerCase()
                      ).map((style, si) => {
                        const isBooked = true;
                        return (
                          <div key={si} style={{
                            borderRadius: "16px", overflow: "hidden",
                            border: isBooked ? "1.5px solid rgba(192,132,252,0.5)" : "1px solid rgba(255,255,255,0.07)",
                            background: isBooked ? "rgba(192,132,252,0.06)" : "rgba(255,255,255,0.03)",
                          }}>
                            {style.img && (
                              <img src={style.img} alt={style.name}
                                style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }} />
                            )}
                            <div style={{ padding: "14px 16px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                                <div>
                                  <p style={{ color: "white", fontWeight: "800", fontSize: "15px", margin: 0 }}>{style.name}</p>
                                  {style.desc && <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", margin: "3px 0 0" }}>{style.desc}</p>}
                                </div>
                                <p style={{ color: "#d4af37", fontWeight: "900", fontSize: "16px", margin: 0, flexShrink: 0, paddingLeft: "12px" }}>
                                  ₹{style.price?.toLocaleString()}
                                </p>
                              </div>
                              {style.specs?.length > 0 && (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                                  {style.specs.map((sp, spi) => (
                                    <span key={spi} style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "6px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>
                                      {sp.label}: {sp.value}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {isBooked && (
                                <div style={{ marginTop: "10px", padding: "6px 12px", borderRadius: "8px", background: "rgba(192,132,252,0.12)", display: "inline-block" }}>
                                  <span style={{ color: "#c084fc", fontSize: "12px", fontWeight: "700" }}>✓ Your booked package</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Section>
          )
        )}

        {/* Event Info */}
        <Section title="📋 Event Info">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <InfoCard icon="📅" label="Event Date" value={booking.date} />
            <InfoCard icon="📍" label="Venue" value={booking.venue} />
            <InfoCard icon="📞" label="Phone" value={booking.phone} />
            <InfoCard icon="✉️" label="Email" value={booking.email} />
            <InfoCard icon="👤" label="Booked By" value={booking.name} />
            <InfoCard icon="🗓️" label="Booked On" value={new Date(booking.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} />
          </div>
          {booking.message && (
            <div style={{ marginTop: "10px", padding: "12px 14px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", fontSize: "13px", fontStyle: "italic" }}>
              💬 "{booking.message}"
            </div>
          )}
        </Section>

        {/* Payment Info */}
        <Section title="💳 Payment Info">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <InfoCard icon="💰" label="Total Amount" value={price} highlight />
            <InfoCard icon="🧾" label="Payment Mode" value={booking.paymentType === "advance" ? "25% Advance" : "Full Payment"} />
            {booking.advanceAmount > 0 && <InfoCard icon="⬆️" label="Advance Paid" value={`₹${booking.advanceAmount?.toLocaleString()}`} />}
            {booking.remainingAmount > 0 && <InfoCard icon="⏳" label="Remaining Due" value={`₹${booking.remainingAmount?.toLocaleString()}`} />}
            {booking.walletUsed > 0 && <InfoCard icon="👛" label="Wallet Used" value={`₹${booking.walletUsed?.toLocaleString()}`} />}
          </div>
        </Section>

        {/* Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
          {booking.status === "confirmed" && (
            <button onClick={handleCancel} disabled={cancelling} className="action-btn"
              style={{ width: "100%", padding: "15px", borderRadius: "14px", background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)", fontSize: "15px", fontWeight: "800", cursor: "pointer", transition: "all 0.2s" }}>
              {cancelling ? "Cancelling..." : "❌ Cancel Booking"}
            </button>
          )}
          {booking.status === "cancelled" && !booking.isMultiBooking && booking.package && (
            <button onClick={() => navigate("/booking", { state: { package: booking.package } })} className="action-btn"
              style={{ width: "100%", padding: "15px", borderRadius: "14px", background: "rgba(192,132,252,0.12)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.3)", fontSize: "15px", fontWeight: "800", cursor: "pointer", transition: "all 0.2s" }}>
              🔄 Rebook This Event
            </button>
          )}
          <button onClick={() => navigate("/dashboard/bookings")} className="action-btn"
            style={{ width: "100%", padding: "14px", borderRadius: "14px", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)", fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s" }}>
            ← Back to All Bookings
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "16px", borderRadius: "18px", padding: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <p style={{ fontSize: "11px", fontWeight: "800", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>{title}</p>
      {children}
    </div>
  );
}