import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const COLOR_THEMES = ["Gold & White", "Red & Black", "Pastel Pink", "Royal Blue & Silver", "Green & Ivory", "Rustic Brown", "Minimalist White", "Custom..."];
const STYLE_OPTS   = ["Royal / Grand", "Minimalist", "Boho / Rustic", "Modern & Sleek", "Traditional", "Garden / Outdoor", "Vintage", "Floral"];
const BUDGET_OPTS  = ["Under ₹50K", "₹50K–1L", "₹1L–2L", "₹2L–5L", "₹5L+"];

const StyleBoard = () => {
  const navigate  = useNavigate();
  const { user }  = useContext(AuthContext);
  const fileRef   = useRef(null);

  const [board, setBoard]         = useState(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved]         = useState(false);

  const [colorTheme, setColorTheme] = useState("");
  const [style, setStyle]           = useState("");
  const [budget, setBudget]         = useState("");
  const [notes, setNotes]           = useState("");
  const [customColor, setCustomColor] = useState("");

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    api.get("/users/styleboard")
      .then(r => {
        if (r.data) {
          setBoard(r.data);
          setColorTheme(r.data.colorTheme || "");
          setStyle(r.data.style || "");
          setBudget(r.data.budget || "");
          setNotes(r.data.notes || "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const finalColor = colorTheme === "Custom..." ? customColor : colorTheme;
      const res = await api.put("/users/styleboard", {
        colorTheme: finalColor, style, budget, notes,
      });
      setBoard(res.data.board);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert("Failed to save. Try again.");
    } finally { setSaving(false); }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (board?.images?.length >= 8) {
      alert("Max 8 images allowed!"); return;
    }
    setUploading(true);
    const form = new FormData();
    form.append("image", file);
    try {
      const res = await api.post("/users/styleboard/image", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setBoard(res.data.board);
    } catch { alert("Upload failed."); }
    finally { setUploading(false); }
  };

  const handleDeleteImage = async (publicId) => {
    if (!window.confirm("Remove this image?")) return;
    try {
      const res = await api.delete("/users/styleboard/image", { data: { publicId } });
      setBoard(res.data.board);
    } catch { alert("Delete failed."); }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0a1e" }}>
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">🎨</div>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading your Style Board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "#0f0a1e" }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎨</div>
          <h1 className="text-3xl font-extrabold text-white">My Style Board</h1>
          <p style={{ color: "rgba(255,255,255,0.5)" }} className="mt-2">
            Show us your dream event — upload inspiration images & preferences
          </p>
        </div>

        {/* Inspiration Images */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white text-lg">📸 Inspiration Images</h2>
            <span style={{ color: "rgba(255,255,255,0.4)" }} className="text-sm">
              {board?.images?.length || 0}/8
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Existing images */}
            {(board?.images || []).map((img, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square">
                <img src={img.url} alt={`style-${idx}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <button onClick={() => handleDeleteImage(img.publicId)}
                    className="text-white text-2xl hover:text-red-400 transition">🗑️</button>
                </div>
              </div>
            ))}

            {/* Upload slot */}
            {(board?.images?.length || 0) < 8 && (
              <button onClick={() => fileRef.current.click()}
                disabled={uploading}
                className="aspect-square rounded-xl flex flex-col items-center justify-center transition hover:opacity-80"
                style={{ background: "rgba(192,132,252,0.08)", border: "2px dashed rgba(192,132,252,0.3)" }}>
                {uploading ? (
                  <span className="text-purple-400 text-sm">Uploading...</span>
                ) : (
                  <>
                    <span className="text-3xl text-purple-400">+</span>
                    <span className="text-xs text-purple-400 mt-1">Add Photo</span>
                  </>
                )}
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>

        {/* Preferences */}
        <div className="rounded-2xl p-6 mb-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <h2 className="font-bold text-white text-lg mb-5">⚙️ Preferences</h2>

          {/* Color Theme */}
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-3" style={{ color: "rgba(255,255,255,0.7)" }}>
              🎨 Color Theme
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_THEMES.map(c => (
                <button key={c} onClick={() => setColorTheme(c)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition"
                  style={{
                    background: colorTheme === c ? "linear-gradient(135deg, #c084fc, #f472b6)" : "rgba(255,255,255,0.06)",
                    color: colorTheme === c ? "white" : "rgba(255,255,255,0.6)",
                    border: colorTheme === c ? "none" : "1px solid rgba(255,255,255,0.1)",
                  }}>
                  {c}
                </button>
              ))}
            </div>
            {colorTheme === "Custom..." && (
              <input value={customColor} onChange={e => setCustomColor(e.target.value)}
                placeholder="Type your color theme..."
                className="mt-3 w-full px-4 py-2 rounded-xl text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.06)", color: "white", border: "1px solid rgba(255,255,255,0.15)" }} />
            )}
          </div>

          {/* Style */}
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-3" style={{ color: "rgba(255,255,255,0.7)" }}>
              ✨ Event Style
            </label>
            <div className="flex flex-wrap gap-2">
              {STYLE_OPTS.map(s => (
                <button key={s} onClick={() => setStyle(s)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition"
                  style={{
                    background: style === s ? "linear-gradient(135deg, #c084fc, #f472b6)" : "rgba(255,255,255,0.06)",
                    color: style === s ? "white" : "rgba(255,255,255,0.6)",
                    border: style === s ? "none" : "1px solid rgba(255,255,255,0.1)",
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-3" style={{ color: "rgba(255,255,255,0.7)" }}>
              💰 Budget Range
            </label>
            <div className="flex flex-wrap gap-2">
              {BUDGET_OPTS.map(b => (
                <button key={b} onClick={() => setBudget(b)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition"
                  style={{
                    background: budget === b ? "linear-gradient(135deg, #c084fc, #f472b6)" : "rgba(255,255,255,0.06)",
                    color: budget === b ? "white" : "rgba(255,255,255,0.6)",
                    border: budget === b ? "none" : "1px solid rgba(255,255,255,0.1)",
                  }}>
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "rgba(255,255,255,0.7)" }}>
              📝 Additional Notes
            </label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Any specific ideas, themes, dos and don'ts..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(255,255,255,0.1)",
              }} />
          </div>
        </div>

        {/* Actions */}
        {saved && (
          <div className="text-center text-green-400 font-semibold mb-4">
            ✅ Style board saved successfully!
          </div>
        )}

        <button onClick={handleSave} disabled={saving}
          className="w-full py-4 rounded-2xl font-extrabold text-white text-lg mb-3 transition disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #7c3aed, #c084fc)" }}>
          {saving ? "Saving..." : "💾 Save Style Board"}
        </button>

        <button onClick={() => navigate("/cart-checkout")}
          className="w-full py-3 rounded-2xl font-bold text-sm transition"
          style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}>
          🛒 Go to Cart & Book
        </button>

        <button onClick={() => navigate("/dashboard")}
          className="w-full mt-2 py-2 text-sm transition"
          style={{ color: "rgba(255,255,255,0.4)" }}>
          ← Back to Dashboard
        </button>

      </div>
    </div>
  );
};

export default StyleBoard;