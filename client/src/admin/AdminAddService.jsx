import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import api from "../services/api";

const tagColors = [
  { label: "Rose", value: "bg-rose-500" },
  { label: "Violet", value: "bg-violet-500" },
  { label: "Pink", value: "bg-pink-500" },
  { label: "Amber", value: "bg-amber-500" },
  { label: "Blue", value: "bg-blue-500" },
  { label: "Emerald", value: "bg-emerald-500" },
  { label: "Green", value: "bg-green-600" },
  { label: "Yellow", value: "bg-yellow-600" },
  { label: "Fuchsia", value: "bg-fuchsia-500" },
  { label: "Orange", value: "bg-orange-500" },
  { label: "Red", value: "bg-red-500" },
  { label: "Pink Light", value: "bg-pink-400" },
];

const AdminAddService = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewImg, setPreviewImg] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "", subtitle: "", desc: "", icon: "", tag: "", tagColor: "",
    price: "", rating: "", reviews: "", img: "", highlights: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await api.post("/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((prev) => ({ ...prev, img: data.url }));
      setPreviewImg(data.url);
    } catch {
      setError("Image upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title) { setError("Title is required"); return; }
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        rating: parseFloat(form.rating) || 0,
        reviews: parseInt(form.reviews) || 0,
        highlights: form.highlights.split(",").map(h => h.trim()).filter(Boolean),
      };
      await api.post("/admin/services", payload);
      navigate("/admin/services");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "13px 16px", borderRadius: "12px",
    background: "rgba(212,175,55,0.04)", border: "1px solid rgba(212,175,55,0.15)",
    color: "#fff", fontSize: "14px", outline: "none", transition: "all 0.2s", boxSizing: "border-box",
  };
  const labelStyle = {
    display: "block", marginBottom: "8px", fontSize: "11px",
    fontWeight: "700", letterSpacing: "0.12em", textTransform: "uppercase", color: "#d4af37",
  };
  const sectionStyle = {
    borderRadius: "20px", padding: "28px", marginBottom: "20px",
    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(212,175,55,0.1)",
  };
  const sectionTitleStyle = {
    display: "flex", alignItems: "center", gap: "8px", marginBottom: "22px",
  };

  const onFocus = (e) => {
    e.target.style.borderColor = "rgba(212,175,55,0.5)";
    e.target.style.background = "rgba(212,175,55,0.07)";
    e.target.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.08)";
  };
  const onBlur = (e) => {
    e.target.style.borderColor = "rgba(212,175,55,0.15)";
    e.target.style.background = "rgba(212,175,55,0.04)";
    e.target.style.boxShadow = "none";
  };

  return (
    <AdminLayout>
      <div style={{ padding: "32px", maxWidth: "780px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "36px" }}>
          <button onClick={() => navigate("/admin/services")}
            style={{
              width: "40px", height: "40px", borderRadius: "12px",
              border: "1px solid rgba(212,175,55,0.2)", background: "rgba(212,175,55,0.06)",
              color: "#d4af37", fontSize: "18px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>←</button>
          <div>
            <h1 style={{ color: "#fff", fontSize: "22px", fontWeight: "800", margin: "0 0 4px", letterSpacing: "-0.3px" }}>
              ➕ Add New Service
            </h1>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", margin: 0 }}>
              Fill in the details to create a new wedding service
            </p>
          </div>
        </div>

        {/* Gold divider */}
        <div style={{
          height: "1px", marginBottom: "32px",
          background: "linear-gradient(to right, rgba(212,175,55,0.5), rgba(212,175,55,0.05), transparent)"
        }} />

        {/* Error */}
        {error && (
          <div style={{
            padding: "12px 16px", borderRadius: "12px", marginBottom: "24px",
            background: "rgba(239,68,68,0.1)", color: "#f87171",
            border: "1px solid rgba(239,68,68,0.2)", fontSize: "13px",
          }}>⚠️ {error}</div>
        )}

        {/* Section 1 — Basic Info */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>
            <span style={{ color: "#d4af37" }}>✦</span>
            <p style={{ color: "#d4af37", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>
              Basic Information
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { name: "title", label: "Title *", placeholder: "e.g. Photography" },
              { name: "subtitle", label: "Subtitle", placeholder: "e.g. Capture Every Moment" },
              { name: "icon", label: "Icon (Emoji)", placeholder: "e.g. 📸" },
              { name: "price", label: "Price", placeholder: "e.g. Starting from ₹5,000" },
              { name: "rating", label: "Rating", placeholder: "e.g. 4.9" },
              { name: "reviews", label: "Reviews Count", placeholder: "e.g. 238" },
            ].map((f) => (
              <div key={f.name}>
                <label style={labelStyle}>{f.label}</label>
                <input name={f.name} value={form[f.name]} onChange={handleChange}
                  placeholder={f.placeholder} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
            ))}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Highlights (comma separated)</label>
              <input name="highlights" value={form.highlights} onChange={handleChange}
                placeholder="HD Photos, Drone Shots, Online Gallery"
                style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </div>
          </div>
        </div>

        {/* Section 2 — Tag & Visuals */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>
            <span style={{ color: "#d4af37" }}>✦</span>
            <p style={{ color: "#d4af37", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>
              Tag & Visuals
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

            {/* Tag */}
            <div>
              <label style={labelStyle}>Tag</label>
              <input name="tag" value={form.tag} onChange={handleChange}
                placeholder="e.g. Most Popular" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </div>

            {/* Tag Color */}
            <div>
              <label style={labelStyle}>Tag Color</label>
              <select name="tagColor" value={form.tagColor} onChange={handleChange}
                style={{ ...inputStyle, cursor: "pointer" }}>
                <option value="">Select color</option>
                {tagColors.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Image URL */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Image URL (optional)</label>
              <input name="img" value={form.img} onChange={handleChange}
                placeholder="https://..." style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
            </div>

            {/* Upload */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Upload Image</label>
              <label style={{
                display: "flex", alignItems: "center", gap: "14px",
                padding: "18px 20px", borderRadius: "14px", cursor: "pointer",
                background: "rgba(212,175,55,0.04)", border: "2px dashed rgba(212,175,55,0.25)",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(212,175,55,0.25)"}>
                <span style={{ fontSize: "26px" }}>🖼️</span>
                <div>
                  <p style={{ color: uploading ? "#fbbf24" : "#d4af37", fontSize: "14px", fontWeight: "600", margin: 0 }}>
                    {uploading ? "Uploading..." : "Click to upload image"}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", margin: "3px 0 0" }}>
                    PNG, JPG, WEBP — Max 5MB
                  </p>
                </div>
                <input type="file" accept="image/*" style={{ display: "none" }}
                  onChange={handleImageUpload} disabled={uploading} />
              </label>

              {previewImg && (
                <div style={{ marginTop: "14px", borderRadius: "16px", overflow: "hidden", height: "200px", position: "relative" }}>
                  <img src={previewImg} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }} />
                  <div style={{
                    position: "absolute", bottom: "12px", left: "14px",
                    background: "rgba(212,175,55,0.9)", borderRadius: "6px",
                    padding: "3px 10px", fontSize: "11px", fontWeight: "700", color: "#000"
                  }}>✓ Image Ready</div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Section 3 — Description */}
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>
            <span style={{ color: "#d4af37" }}>✦</span>
            <p style={{ color: "#d4af37", fontSize: "11px", fontWeight: "700", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>
              Description
            </p>
          </div>
          <textarea name="desc" value={form.desc} onChange={handleChange}
            placeholder="Write a compelling description for this service..."
            rows={5}
            style={{ ...inputStyle, resize: "none", lineHeight: "1.6" }}
            onFocus={onFocus} onBlur={onBlur} />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={() => navigate("/admin/services")}
            style={{
              flex: 1, padding: "14px", borderRadius: "14px", cursor: "pointer",
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)", fontSize: "14px", fontWeight: "600",
            }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving || uploading}
            style={{
              flex: 2, padding: "14px", borderRadius: "14px",
              cursor: saving ? "not-allowed" : "pointer",
              background: saving ? "rgba(212,175,55,0.3)" : "linear-gradient(135deg, #d4af37, #f472b6)",
              border: "none", color: "#fff", fontSize: "14px", fontWeight: "800",
              letterSpacing: "0.05em", boxShadow: saving ? "none" : "0 4px 20px rgba(212,175,55,0.25)",
            }}>
            {saving ? "⏳ Saving..." : "✦ Add Service"}
          </button>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminAddService;