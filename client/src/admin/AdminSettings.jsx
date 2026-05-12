import { useState } from "react";
import AdminLayout from "./AdminLayout";
import api from "../services/api";

const AdminSettings = () => {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const adminInfo = JSON.parse(localStorage.getItem("adminInfo") || "{}");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setMsg({ type: "error", text: "Please fill all fields" }); return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setMsg({ type: "error", text: "New passwords do not match" }); return;
    }
    if (form.newPassword.length < 6) {
      setMsg({ type: "error", text: "Password must be at least 6 characters" }); return;
    }
    setLoading(true);
    try {
      await api.put("/admin/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setMsg({ type: "success", text: "Password changed successfully!" });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Failed to change password" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-lg">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">⚙️ Settings</h1>
          <p style={{ color: "rgba(255,255,255,0.4)" }}>Manage admin account</p>
        </div>

        {/* Admin Info Card */}
        <div className="p-5 rounded-2xl mb-6"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>Admin Account</p>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
              🛡️
            </div>
            <div>
              <p className="text-white font-bold">Admin</p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{adminInfo.email || "admin@bookmyevent.com"}</p>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="p-5 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-sm font-semibold text-white mb-4">🔒 Change Password</p>

          {msg.text && (
            <div className="rounded-xl px-4 py-3 mb-4 text-sm"
              style={{
                background: msg.type === "success" ? "rgba(52,211,153,0.15)" : "rgba(239,68,68,0.15)",
                color: msg.type === "success" ? "#34d399" : "#f87171",
                border: `1px solid ${msg.type === "success" ? "rgba(52,211,153,0.3)" : "rgba(239,68,68,0.3)"}`,
              }}>
              {msg.text}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {[
              { name: "currentPassword", label: "Current Password" },
              { name: "newPassword", label: "New Password" },
              { name: "confirmPassword", label: "Confirm New Password" },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {field.label}
                </label>
                <input
                  type="password"
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl outline-none text-white placeholder-gray-600 text-sm"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                />
              </div>
            ))}

            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white transition hover:opacity-90 disabled:opacity-60 mt-1"
              style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminSettings;