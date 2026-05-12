import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields!");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/admin/login", formData);
      localStorage.setItem("adminToken", data.token);
     
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #0f0a1e 0%, #1a0533 100%)" }}>

      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
            <span className="text-2xl">🛡️</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Admin Login</h1>
          <p className="mt-2" style={{ color: "rgba(255,255,255,0.5)" }}>
            BookMyEvent Admin Panel
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}>

          {error && (
            <div className="rounded-xl px-4 py-3 mb-5 text-sm text-center"
              style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">

            {/* Email */}
            <div>
              <label className="text-sm font-medium mb-1 block" style={{ color: "rgba(255,255,255,0.7)" }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@bookmyevent.com"
                className="w-full px-4 py-3 rounded-xl outline-none text-white placeholder-gray-500"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium mb-1 block" style={{ color: "rgba(255,255,255,0.7)" }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl outline-none text-white placeholder-gray-500"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white mt-2 transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}
            >
              {loading ? "Logging in..." : "Login as Admin"}
            </button>

          </div>
        </div>

        {/* Back link */}
        <p className="text-center mt-6 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
          Not an admin?{" "}
          <span className="cursor-pointer" style={{ color: "#c084fc" }}
            onClick={() => navigate("/login")}>
            Go to User Login
          </span>
        </p>

      </div>
    </div>
  );
};

export default AdminLogin;