import { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const EVENT_CATEGORIES = [
  { key: "Wedding",         emoji: "💍" },
  { key: "Birthday",        emoji: "🎂" },
  { key: "Engagement",      emoji: "💐" },
  { key: "Baby Shower",     emoji: "🍼" },
  { key: "Anniversary",     emoji: "🥂" },
  { key: "Corporate Event", emoji: "🏢" },
  { key: "House Warming",   emoji: "🏠" },
  { key: "Graduation",      emoji: "🎓" },
  { key: "Farewell",        emoji: "👋" },
  { key: "Get Together",    emoji: "🎉" },
  { key: "Naming Ceremony", emoji: "👶" },
  { key: "Other",           emoji: "✨" },
];

const SERVICE_OPTIONS = [
  "Decoration", "Photography", "Videography", "Catering",
  "DJ / Music", "Invitation Cards", "Mehendi", "Makeup",
  "Stage Setup", "Lighting", "Florist", "Transportation",
];


const STATUS_STYLES = {
  pending:   { bg: "rgba(251,191,36,0.15)",  border: "rgba(251,191,36,0.3)",  color: "#fbbf24", label: "⏳ Pending" },
  reviewing: { bg: "rgba(96,165,250,0.15)",  border: "rgba(96,165,250,0.3)",  color: "#60a5fa", label: "🔍 Reviewing" },
  quoted:    { bg: "rgba(167,139,250,0.15)", border: "rgba(167,139,250,0.3)", color: "#a78bfa", label: "💬 Quoted" },
  confirmed: { bg: "rgba(34,197,94,0.15)",   border: "rgba(34,197,94,0.3)",   color: "#4ade80", label: "✅ Confirmed" },
  rejected:  { bg: "rgba(239,68,68,0.15)",   border: "rgba(239,68,68,0.3)",   color: "#f87171", label: "❌ Rejected" },
  cancelled: { bg: "rgba(107,114,128,0.15)", border: "rgba(107,114,128,0.3)", color: "#9ca3af", label: "🚫 Cancelled" },
};

// ── Service-specific question definitions ─────────────────
const SERVICE_QUESTIONS = {
  "Photography": [
    { id: "photo_hours",   label: "How many hours do you need?", type: "select", options: ["2–4 hrs", "4–6 hrs", "6–8 hrs", "Full Day (8+ hrs)"] },
    { id: "photo_style",   label: "Photography style", type: "multiselect", options: ["Candid", "Traditional", "Portrait", "Aerial / Drone"] },
    { id: "photo_setting", label: "Shooting setting", type: "multiselect", options: ["Indoor", "Outdoor", "Both"] },
  ],
  "Videography": [
    { id: "video_hours",   label: "How many hours do you need?", type: "select", options: ["2–4 hrs", "4–6 hrs", "Full Day (8+ hrs)"] },
    { id: "video_type",    label: "Video type", type: "multiselect", options: ["Highlight Reel", "Full Coverage", "Cinematic", "Live Streaming", "Drone Footage"] },
    { id: "video_delivery",label: "Delivery format", type: "multiselect", options: ["Edited Video", "Raw Footage", "Both"] },
  ],
  "Decoration": [
    { id: "deco_style",    label: "Decoration style", type: "multiselect", options: ["Floral", "Balloon", "Fairy Lights", "Theme Based", "Minimal / Elegant", "Traditional"] },
    { id: "deco_areas",    label: "Areas to decorate", type: "multiselect", options: ["Stage", "Entrance", "Tables", "Mandap", "Photo Booth", "Full Venue"] },
    { id: "deco_color",    label: "Color preference", type: "text", placeholder: "e.g. Gold & White, Pastel Pink..." },
  ],
  "Stage Setup": [
    { id: "stage_type",    label: "Stage type", type: "select", options: ["Simple Stage", "Floral Arch", "LED Backdrop", "Theme Stage", "Mandap Setup"] },
    { id: "stage_size",    label: "Approx. stage size", type: "select", options: ["Small (10x10 ft)", "Medium (15x15 ft)", "Large (20x20 ft+)", "Not Sure"] },
  ],
  "Catering": [
    { id: "cater_guests",  label: "Number of guests for food", type: "number", placeholder: "e.g. 200" },
    { id: "cater_type",    label: "Food type", type: "multiselect", options: ["Veg Only", "Non-Veg", "Both Veg & Non-Veg", "Jain / Special Diet"] },
    { id: "cater_meals",   label: "Meals required", type: "multiselect", options: ["Breakfast", "Lunch", "Snacks / Hi-Tea", "Dinner"] },
    { id: "cater_service", label: "Service style", type: "select", options: ["Buffet", "Sit-Down / Served", "Live Counters", "Mix of Both"] },
  ],
  "DJ / Music": [
    { id: "dj_hours",      label: "Duration needed", type: "select", options: ["2–3 hrs", "4–5 hrs", "Full Event (6+ hrs)"] },
    { id: "dj_type",       label: "Music type", type: "multiselect", options: ["Bollywood", "Tamil / Regional", "Western / EDM", "Classical / Live Band", "Mix"] },
    { id: "dj_equipment",  label: "Equipment needed", type: "multiselect", options: ["DJ Setup", "Sound System Only", "Mic Setup", "All Included"] },
  ],
  "Lighting": [
    { id: "light_type",    label: "Lighting type", type: "multiselect", options: ["Fairy Lights", "LED Wash", "Spotlights", "Neon Signs", "Truss Lighting", "Candle / Ambient"] },
    { id: "light_area",    label: "Area to cover", type: "select", options: ["Stage Only", "Full Indoor Venue", "Outdoor", "Full Venue (Indoor + Outdoor)"] },
  ],
  "Mehendi": [
    { id: "mehendi_people",label: "How many people need Mehendi?", type: "select", options: ["1–2", "3–5", "6–10", "10+"] },
    { id: "mehendi_style", label: "Mehendi style", type: "multiselect", options: ["Bridal (Full hands & feet)", "Arabic", "Simple / Party", "Indo-Western"] },
  ],
  "Makeup": [
    { id: "makeup_people", label: "How many people need Makeup?", type: "select", options: ["1 (Bride only)", "2–3", "4–6", "7+"] },
    { id: "makeup_type",   label: "Makeup type", type: "multiselect", options: ["Bridal Makeup", "Party Makeup", "HD Makeup", "Airbrush", "Natural / Minimal"] },
    { id: "makeup_hair",   label: "Hair styling needed?", type: "select", options: ["Yes", "No", "Only Hair (no makeup)"] },
  ],
  "Florist": [
    { id: "floral_type",   label: "Floral arrangement type", type: "multiselect", options: ["Bridal Bouquet", "Table Centerpieces", "Garlands", "Car Decoration", "Venue Flowers", "Flower Shower"] },
    { id: "floral_pref",   label: "Flower preference", type: "multiselect", options: ["Roses", "Marigold / Traditional", "Orchids", "Mixed Seasonal", "Artificial Flowers"] },
  ],
  "Transportation": [
    { id: "trans_type",    label: "Vehicle type needed", type: "multiselect", options: ["Bridal Car (Decorated)", "Guest Shuttle Bus", "Luxury Car", "Vintage Car", "Bike / Unique Entry"] },
    { id: "trans_count",   label: "Number of vehicles", type: "select", options: ["1", "2–3", "4–5", "5+"] },
    { id: "trans_route",   label: "Route", type: "text", placeholder: "e.g. From hotel to venue, within city..." },
  ],
  "Invitation Cards": [
    { id: "invite_type",   label: "Invitation type", type: "multiselect", options: ["Printed Cards", "Digital (WhatsApp)", "Both", "Premium Box Invite"] },
    { id: "invite_count",  label: "Quantity needed", type: "select", options: ["Below 50", "50–100", "100–200", "200–500", "500+"] },
    { id: "invite_design", label: "Design preference", type: "multiselect", options: ["Traditional / Religious", "Modern / Minimalist", "Floral", "Theme Based", "Custom Design"] },
  ],
};

// ── Reusable question renderer ────────────────────────────
const ServiceQuestionField = ({ q, value, onChange, inputStyle, labelStyle }) => {
  if (q.type === "select") {
    return (
      <div>
        <label style={labelStyle}>{q.label.toUpperCase()}</label>
        <select value={value || ""} onChange={e => onChange(q.id, e.target.value)}
          style={{ ...inputStyle, appearance: "none", colorScheme: "dark" }}>
          <option value="" style={{ background: "#1a0f2e", color: "#fff" }}>Select...</option>
          {q.options.map(o => <option key={o} value={o} style={{ background: "#1a0f2e", color: "#fff" }}>{o}</option>)}
        </select>
      </div>
    );
  }
  if (q.type === "multiselect") {
    const selected = value || [];
    return (
      <div>
        <label style={labelStyle}>{q.label.toUpperCase()}</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {q.options.map(o => (
            <button key={o} type="button"
              onClick={() => onChange(q.id, selected.includes(o) ? selected.filter(x => x !== o) : [...selected, o])}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold transition"
              style={{
                background: selected.includes(o) ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${selected.includes(o) ? "#7c3aed" : "rgba(255,255,255,0.1)"}`,
                color: selected.includes(o) ? "#c084fc" : "rgba(255,255,255,0.5)",
                cursor: "pointer",
              }}>
              {selected.includes(o) ? "✓ " : ""}{o}
            </button>
          ))}
        </div>
      </div>
    );
  }
  if (q.type === "number") {
    return (
      <div>
        <label style={labelStyle}>{q.label.toUpperCase()}</label>
        <input type="number" value={value || ""} onChange={e => onChange(q.id, e.target.value)}
          placeholder={q.placeholder} style={inputStyle} min={0} />
      </div>
    );
  }
  return (
    <div>
      <label style={labelStyle}>{q.label.toUpperCase()}</label>
      <input type="text" value={value || ""} onChange={e => onChange(q.id, e.target.value)}
        placeholder={q.placeholder} style={inputStyle} />
    </div>
  );
};

export default function CustomRequest() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const fileRef = useRef(null);

  const [view, setView] = useState("new");
  const [myRequests, setMyRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [step, setStep] = useState(1);

  // Form state
  const [eventCategory, setEventCategory] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [serviceDetails, setServiceDetails] = useState({}); // { photo_hours: "4-6 hrs", ... }
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [showMap, setShowMap]       = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const mapRef                      = useRef(null);
  const mapInstanceRef              = useRef(null);
  const [guestCount, setGuestCount] = useState("");
  const [notes, setNotes] = useState("");
  const [preferredContact, setPreferredContact] = useState("WhatsApp");
  const [duration, setDuration] = useState("");
  const [images, setImages] = useState([]);
  const [serviceImages, setServiceImages] = useState({}); // { 'Photography': [{file, preview}], ... }
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const toggleService = (s) => {
    setSelectedServices(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const updateServiceDetail = (fieldId, value) => {
    setServiceDetails(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleImagePick = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.slice(0, 5 - images.length).map(file => ({
      file, preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newImgs].slice(0, 5));
    e.target.value = "";
  };

  const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx));

  const addServiceImage = (service, files) => {
    const newImgs = Array.from(files).slice(0, 3).map(file => ({
      file, preview: URL.createObjectURL(file),
    }));
    setServiceImages(prev => ({
      ...prev,
      [service]: [...(prev[service] || []), ...newImgs].slice(0, 3),
    }));
  };

  const removeServiceImage = (service, idx) => {
    setServiceImages(prev => ({
      ...prev,
      [service]: (prev[service] || []).filter((_, i) => i !== idx),
    }));
  };

  // ── Map helpers ──────────────────────────────────────────
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const data = await res.json();
      return data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    } catch { return `${lat.toFixed(5)}, ${lng.toFixed(5)}`; }
  };

  const initMap = (lat, lng) => {
    if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
    const map = L.map(mapRef.current).setView([lat, lng], 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap" }).addTo(map);
    const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    marker.on("dragend", async (e) => {
      const { lat: newLat, lng: newLng } = e.target.getLatLng();
      const address = await reverseGeocode(newLat, newLng);
      setVenue(address);
    });
    mapInstanceRef.current = map;
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    setMapLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const address = await reverseGeocode(lat, lng);
        setVenue(address);
        setShowMap(true);
        setMapLoading(false);
        setTimeout(() => initMap(lat, lng), 100);
      },
      () => { setMapLoading(false); alert("Could not get location. Please allow location access."); }
    );
  };
  // ─────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setError("");
    if (!eventCategory) return setError("Please select an event category.");
    if (!name.trim() || !phone.trim() || !email.trim()) return setError("Please fill in your contact details.");
    if (phone.trim().length !== 10 || !/^[0-9]{10}$/.test(phone.trim())) return setError("Please enter a valid 10-digit phone number.");
    if (!date) return setError("Please select the event date.");
    if (!venue.trim()) return setError("Please enter the venue.");

    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("phone", phone.trim());
      fd.append("email", email.trim());
      fd.append("eventCategory", eventCategory);
      fd.append("services", JSON.stringify(selectedServices));
      fd.append("serviceDetails", JSON.stringify(serviceDetails));
      fd.append("date", date);
      fd.append("time", time);
      fd.append("venue", venue.trim());
      fd.append("guestCount", guestCount || 0);
      fd.append("notes", notes.trim());
      fd.append("preferredContact", preferredContact);
      fd.append("duration", duration);
      images.forEach(img => fd.append("referenceImages", img.file));
      // Append service-specific images with service name as key
      Object.entries(serviceImages).forEach(([service, imgs]) => {
        imgs.forEach(img => fd.append(`serviceImage_${service.replace(/[^a-zA-Z0-9]/g, "_")}`, img.file));
      });

      await api.post("/users/custom-requests", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("🎉 Your custom request has been submitted! Our team will review and get back to you shortly.");
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fetchMyRequests = async () => {
    if (!user) { navigate("/login"); return; }
    setLoadingRequests(true);
    try {
      const res = await api.get("/users/custom-requests/my");
      setMyRequests(res.data);
    } catch {}
    finally { setLoadingRequests(false); }
    setView("mine");
  };

  const cancelRequest = async (id) => {
    if (!window.confirm("Cancel this request?")) return;
    try {
      await api.delete(`/users/custom-requests/${id}`);
      setMyRequests(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      alert(err?.response?.data?.message || "Could not cancel");
    }
  };

  // ── Styles ─────────────────────────────────────────────
  const pageStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a0a0f 0%, #12091a 50%, #0d1117 100%)",
    paddingTop: "80px",
    paddingBottom: "60px",
  };
  const cardStyle = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(192,132,252,0.15)",
    borderRadius: "24px",
    padding: "28px",
  };
  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(192,132,252,0.2)",
    borderRadius: "12px",
    padding: "12px 16px",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
  };
  const labelStyle = {
    color: "rgba(255,255,255,0.6)",
    fontSize: "12px",
    fontWeight: "600",
    letterSpacing: "0.05em",
    marginBottom: "6px",
    display: "block",
  };

  // ── MY REQUESTS VIEW ───────────────────────────────────
  if (view === "mine") {
    return (
      <div style={pageStyle}>
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setView("new")}
              style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", background: "none", border: "none", cursor: "pointer" }}>
              ← Back
            </button>
            <h1 className="text-2xl font-bold text-white">My Custom Requests</h1>
          </div>
          {loadingRequests ? (
            <div className="text-center py-20" style={{ color: "rgba(255,255,255,0.4)" }}>Loading...</div>
          ) : myRequests.length === 0 ? (
            <div style={cardStyle} className="text-center py-12">
              <div className="text-5xl mb-4">📭</div>
              <p style={{ color: "rgba(255,255,255,0.4)" }}>No custom requests yet.</p>
              <button onClick={() => setView("new")}
                className="mt-6 px-6 py-2 rounded-xl font-semibold text-white"
                style={{ background: "linear-gradient(135deg,#7c3aed,#c084fc)" }}>
                Create One →
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {myRequests.map(req => {
                const s = STATUS_STYLES[req.status] || STATUS_STYLES.pending;
                return (
                  <div key={req._id} style={cardStyle}>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <span className="text-white font-bold text-lg">
                            {EVENT_CATEGORIES.find(e => e.key === req.eventCategory)?.emoji} {req.eventCategory}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-bold"
                            style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
                            {s.label}
                          </span>
                        </div>
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
                          📅 {req.date} &nbsp;|&nbsp; 📍 {req.venue}
                          {req.guestCount > 0 && ` | 👥 ${req.guestCount} guests`}
                        </p>
                        {req.services?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {req.services.map(sv => (
                              <span key={sv} className="px-2 py-0.5 rounded-lg text-xs"
                                style={{ background: "rgba(192,132,252,0.1)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.2)" }}>
                                {sv}
                              </span>
                            ))}
                          </div>
                        )}
                        {/* Service Details Summary */}
                        {req.serviceDetails && Object.keys(req.serviceDetails).length > 0 && (
                          <div className="mt-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(192,132,252,0.1)" }}>
                            <p className="text-xs font-bold mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>SERVICE DETAILS</p>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(req.serviceDetails).map(([k, v]) => (
                                <span key={k} className="text-xs px-2 py-1 rounded-lg"
                                  style={{ background: "rgba(192,132,252,0.08)", color: "rgba(255,255,255,0.6)" }}>
                                  {Array.isArray(v) ? v.join(", ") : v}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {req.quotedPrice > 0 && (
                          <p className="mt-2 font-bold" style={{ color: "#a78bfa" }}>
                            💰 Quoted Price: ₹{req.quotedPrice.toLocaleString()}
                          </p>
                        )}
                        {req.adminNote && (
                          <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                            🗒 Admin Note: {req.adminNote}
                          </p>
                        )}
                      </div>
                      {["pending", "reviewing"].includes(req.status) && (
                        <button onClick={() => cancelRequest(req._id)}
                          className="px-4 py-2 rounded-xl text-xs font-semibold"
                          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
                          Cancel
                        </button>
                      )}
                    </div>
                    {req.referenceImages?.length > 0 && (
                      <div className="flex gap-2 mt-4 flex-wrap">
                        {req.referenceImages.map((url, i) => (
                          <img key={i} src={url} alt="" className="rounded-xl object-cover"
                            style={{ width: 80, height: 80, border: "1px solid rgba(192,132,252,0.2)" }} />
                        ))}
                      </div>
                    )}
                    <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px", marginTop: "10px" }}>
                      Submitted {new Date(req.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── SUCCESS ────────────────────────────────────────────
  if (step === 2) {
    return (
      <div style={pageStyle}>
        <div className="max-w-lg mx-auto px-4 text-center">
          <div style={cardStyle} className="py-16">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-2xl font-bold text-white mb-3">Request Submitted!</h2>
            <p style={{ color: "rgba(255,255,255,0.5)" }} className="text-sm mb-8">{success}</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button onClick={() => { setStep(1); setSuccess(""); setView("new"); setEventCategory(""); setSelectedServices([]); setServiceDetails({}); setImages([]); setServiceImages({}); setNotes(""); setDate(""); setTime(""); setVenue(""); setGuestCount(""); setDuration(""); }}
                className="px-6 py-3 rounded-2xl font-bold text-white"
                style={{ background: "linear-gradient(135deg,#7c3aed,#c084fc)" }}>
                New Request
              </button>
              <button onClick={() => navigate("/dashboard/requests")}
                className="px-6 py-3 rounded-2xl font-bold"
                style={{ background: "rgba(192,132,252,0.1)", border: "1px solid rgba(192,132,252,0.3)", color: "#c084fc" }}>
                View My Requests
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── FORM VIEW ──────────────────────────────────────────
  return (
    <div style={pageStyle}>
      <div className="max-w-3xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-white">✨ Custom Event Request</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginTop: 4 }}>
              Tell us your dream event — we'll make it happen!
            </p>
          </div>
          {user && (
            <button onClick={() => navigate("/dashboard/requests")}
              className="px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: "rgba(192,132,252,0.1)", border: "1px solid rgba(192,132,252,0.25)", color: "#c084fc" }}>
              📋 My Requests
            </button>
          )}
        </div>

        {/* Step 1: Category */}
        <div style={cardStyle} className="mb-5">
          <h2 className="text-white font-bold text-base mb-4">1. What's the occasion?</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {EVENT_CATEGORIES.map(cat => (
              <button key={cat.key} onClick={() => setEventCategory(cat.key)}
                className="flex flex-col items-center gap-2 py-4 rounded-2xl text-xs font-semibold transition"
                style={{
                  background: eventCategory === cat.key ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${eventCategory === cat.key ? "#7c3aed" : "rgba(255,255,255,0.07)"}`,
                  color: eventCategory === cat.key ? "#c084fc" : "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                }}>
                <span style={{ fontSize: 26 }}>{cat.emoji}</span>
                {cat.key}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Services */}
        <div style={cardStyle} className="mb-5">
          <h2 className="text-white font-bold text-base mb-2">2. Services needed <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>(select all that apply)</span></h2>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", marginBottom: 16 }}>After selecting, you'll see specific questions for each service below</p>
          <div className="flex flex-wrap gap-2">
            {SERVICE_OPTIONS.map(s => (
              <button key={s} onClick={() => toggleService(s)}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition"
                style={{
                  background: selectedServices.includes(s) ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${selectedServices.includes(s) ? "#7c3aed" : "rgba(255,255,255,0.1)"}`,
                  color: selectedServices.includes(s) ? "#c084fc" : "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                }}>
                {selectedServices.includes(s) ? "✓ " : ""}{s}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Service-specific questions (dynamic) */}
        {selectedServices.filter(s => SERVICE_QUESTIONS[s]).length > 0 && (
          <div style={{ ...cardStyle, border: "1px solid rgba(192,132,252,0.25)" }} className="mb-5">
            <h2 className="text-white font-bold text-base mb-1">3. Service Details</h2>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", marginBottom: 20 }}>
              Help us understand exactly what you need — this helps us give you an accurate quote
            </p>
            <div className="flex flex-col gap-8">
              {selectedServices.filter(s => SERVICE_QUESTIONS[s]).map(service => (
                <div key={service}>
                  {/* Service header */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(135deg,#c084fc,#f472b6)" }}></div>
                    <h3 className="text-white font-bold text-sm">{service}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-3">
                    {SERVICE_QUESTIONS[service].map(q => (
                      <div key={q.id} className={q.type === "multiselect" ? "sm:col-span-2" : ""}>
                        <ServiceQuestionField
                          q={q}
                          value={serviceDetails[q.id]}
                          onChange={updateServiceDetail}
                          inputStyle={inputStyle}
                          labelStyle={labelStyle}
                        />
                      </div>
                    ))}
                    {/* Per-service reference image upload */}
                    <div className="sm:col-span-2 mt-2">
                      <label style={labelStyle}>REFERENCE IMAGES <span style={{ color: "rgba(255,255,255,0.25)", fontWeight: 400 }}>(optional, max 3)</span></label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {(serviceImages[service] || []).map((img, idx) => (
                          <div key={idx} className="relative" style={{ width: 72, height: 72 }}>
                            <img src={img.preview} alt="" className="rounded-xl object-cover w-full h-full"
                              style={{ border: "1px solid rgba(192,132,252,0.25)" }} />
                            <button type="button" onClick={() => removeServiceImage(service, idx)}
                              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                              style={{ background: "#ef4444", color: "#fff", border: "none", cursor: "pointer" }}>×</button>
                          </div>
                        ))}
                        {(serviceImages[service] || []).length < 3 && (
                          <label className="flex flex-col items-center justify-center rounded-xl text-xs font-semibold cursor-pointer"
                            style={{ width: 72, height: 72, border: "2px dashed rgba(192,132,252,0.25)", color: "rgba(192,132,252,0.5)", background: "rgba(192,132,252,0.03)" }}>
                            <span style={{ fontSize: 18 }}>+</span>
                            <span>Add</span>
                            <input type="file" accept="image/*" multiple style={{ display: "none" }}
                              onChange={e => { addServiceImage(service, e.target.files); e.target.value = ""; }} />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Event Details */}
        <div style={cardStyle} className="mb-5">
          <h2 className="text-white font-bold text-base mb-5">
            {selectedServices.filter(s => SERVICE_QUESTIONS[s]).length > 0 ? "4." : "3."} Event Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>EVENT DATE *</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                style={inputStyle} min={new Date().toISOString().split("T")[0]} />
            </div>
            <div>
              <label style={labelStyle}>EVENT TIME</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} style={inputStyle} />
            </div>
            <div className="sm:col-span-2">
              <label style={labelStyle}>VENUE / LOCATION *</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <input type="text" value={venue} onChange={e => setVenue(e.target.value)}
                  placeholder="Hall name, address or area..." style={{ ...inputStyle, flex: 1 }} />
                <button type="button" onClick={handleUseLocation} disabled={mapLoading}
                  style={{ padding: "0 16px", borderRadius: "12px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "700", whiteSpace: "nowrap",
                    background: "linear-gradient(135deg,#c084fc,#f472b6)", color: "white", opacity: mapLoading ? 0.7 : 1 }}>
                  {mapLoading ? "..." : "📍 My Location"}
                </button>
              </div>
              {showMap && (
                <div style={{ marginTop: "10px", borderRadius: "14px", overflow: "hidden", border: "2px solid rgba(192,132,252,0.4)" }}>
                  <p style={{ fontSize: "12px", color: "#c084fc", fontWeight: "700", padding: "8px 12px", background: "rgba(192,132,252,0.08)" }}>
                    📌 Drag the pin to set exact location
                  </p>
                  <div ref={mapRef} style={{ height: "220px", width: "100%" }} />
                </div>
              )}
            </div>
            <div>
              <label style={labelStyle}>APPROX. GUEST COUNT</label>
              <input type="number" value={guestCount} onChange={e => setGuestCount(e.target.value)}
                placeholder="e.g. 150" style={inputStyle} min={0} />
            </div>
            <div>
              <label style={labelStyle}>EVENT DURATION</label>
              <select value={duration} onChange={e => setDuration(e.target.value)}
                style={{ ...inputStyle, appearance: "none", colorScheme: "dark" }}>
                <option value="" style={{ background: "#1a0f2e", color: "#fff" }}>Select duration</option>
                {["Half Day (4–6 hrs)", "Full Day (8–10 hrs)", "Multi-Day (2+ days)"].map(d => (
                  <option key={d} value={d} style={{ background: "#1a0f2e", color: "#fff" }}>{d}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step 5: Contact Info */}
        <div style={cardStyle} className="mb-5">
          <h2 className="text-white font-bold text-base mb-1">
            {selectedServices.filter(s => SERVICE_QUESTIONS[s]).length > 0 ? "5." : "4."} Your Contact Details
          </h2>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", marginBottom: 20 }}>We'll reach out to you with a personalised quote within 24 hours</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>FULL NAME *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Your name" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>PHONE * <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: 400 }}>(10-digit)</span></label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="10-digit mobile"
                style={{ ...inputStyle, borderColor: phone && phone.length !== 10 ? "rgba(239,68,68,0.5)" : "rgba(192,132,252,0.2)" }} />
              {phone && phone.length !== 10 && (
                <p style={{ color: "#f87171", fontSize: "11px", marginTop: 4 }}>⚠ Enter 10-digit number</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label style={labelStyle}>EMAIL *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" style={inputStyle} />
            </div>

            {/* Preferred Contact */}
            <div className="sm:col-span-2">
              <label style={labelStyle}>PREFERRED CONTACT METHOD</label>
              <div className="flex gap-3 flex-wrap mt-1">
                {[{ label: "WhatsApp", icon: "💬" }, { label: "Phone Call", icon: "📞" }, { label: "Email", icon: "✉️" }].map(m => (
                  <button key={m.label} type="button" onClick={() => setPreferredContact(m.label)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition"
                    style={{
                      background: preferredContact === m.label ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${preferredContact === m.label ? "#7c3aed" : "rgba(255,255,255,0.1)"}`,
                      color: preferredContact === m.label ? "#c084fc" : "rgba(255,255,255,0.5)",
                      cursor: "pointer",
                    }}>
                    {m.icon} {m.label} {preferredContact === m.label && "✓"}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label style={labelStyle}>SPECIAL REQUIREMENTS / NOTES</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Any special instructions, theme ideas, things to avoid..."
                rows={4} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-2xl text-sm font-semibold text-center"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
            {error}
          </div>
        )}

        {/* Submit */}
        <button onClick={user ? handleSubmit : () => navigate("/login")}
          disabled={submitting}
          className="w-full py-4 rounded-2xl font-bold text-white text-base transition"
          style={{ background: submitting ? "rgba(124,58,237,0.4)" : "linear-gradient(135deg,#7c3aed,#c084fc)", cursor: submitting ? "not-allowed" : "pointer" }}>
          {submitting ? "Submitting..." : user ? "🚀 Submit Custom Request" : "Login to Submit →"}
        </button>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", textAlign: "center", marginTop: 12 }}>
          Our team will review your request and send you a personalised quote within 24 hours.
        </p>

        {/* Contact strip */}
        <div style={{
          marginTop: "20px", borderRadius: "16px", padding: "16px 20px",
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
          textAlign: "center"
        }}>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginBottom: "12px", letterSpacing: "0.05em" }}>
            NEED HELP? REACH US DIRECTLY
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "10px 20px", borderRadius: "50px", textDecoration: "none",
                background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.3)",
                color: "#25d366", fontSize: "13px", fontWeight: "700", transition: "all 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(37,211,102,0.2)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(37,211,102,0.12)"}>
              <span style={{ fontSize: "16px" }}>💬</span> WhatsApp Us
            </a>
            <a href="tel:+918838333261"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "10px 20px", borderRadius: "50px", textDecoration: "none",
                background: "rgba(192,132,252,0.12)", border: "1px solid rgba(192,132,252,0.25)",
                color: "#c084fc", fontSize: "13px", fontWeight: "700", transition: "all 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(192,132,252,0.22)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(192,132,252,0.12)"}>
              <span style={{ fontSize: "16px" }}>📞</span> Call Us--8838333261
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}