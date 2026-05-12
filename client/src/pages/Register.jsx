import { useState, useContext } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const EyeIcon = ({ show }) =>
  show ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: "Weak", color: "#ef4444" };
  if (score === 2) return { score, label: "Fair", color: "#f97316" };
  if (score === 3) return { score, label: "Good", color: "#eab308" };
  if (score === 4) return { score, label: "Strong", color: "#22c55e" };
  return { score, label: "Very Strong", color: "#16a34a" };
};

const Register = () => {
  const navigate = useNavigate();
  const { login, user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (user) return <Navigate to="/" />;

  const handleChange = (e) => {
    const val = e.target.name === "phone" ? e.target.value.replace(/\D/g, "").slice(0, 10) : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setError(""); setSuccess("");

    if (!formData.name.trim()) { setError("Please enter your full name."); return; }
    if (!formData.email) { setError("Please enter your email address."); return; }
    if (!formData.phone || formData.phone.length !== 10) { setError("Please enter a valid 10-digit phone number."); return; }
    if (!formData.password || formData.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match!"); return; }

    try {
      setLoading(true);
      const { name, email, phone, password } = formData;
      const res = await api.post("/users/register", { name, email, phone, password });
      if (res.data.status === "success") {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎉</div>
          <h1 className="text-3xl font-extrabold text-gray-800">Create Account</h1>
          <p className="text-gray-500 mt-2">Join us to book your dream event!</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 px-4 py-3 rounded-xl mb-5 text-sm text-center">{error}</div>}
        {success && <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl mb-5 text-sm text-center font-semibold">✅ {success}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Full Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition" />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition" />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">+91</span>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                placeholder="10 digit mobile number"
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition" />
            </div>
            {formData.phone && (
              <p className={`text-xs mt-1 ${formData.phone.length === 10 ? "text-green-500" : "text-gray-400"}`}>
                {formData.phone.length}/10 digits {formData.phone.length === 10 ? "✓" : ""}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password}
                onChange={handleChange} placeholder="Create a password (min 6 chars)"
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition" tabIndex={-1}>
                <EyeIcon show={showPassword} />
              </button>
            </div>
            {/* Password Strength Meter */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex-1 h-1.5 rounded-full transition-all duration-300"
                      style={{ background: i <= strength.score ? strength.color : "#e5e7eb" }} />
                  ))}
                </div>
                <p className="text-xs font-medium" style={{ color: strength.color }}>{strength.label}</p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Confirm Password</label>
            <div className="relative">
              <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword"
                value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password"
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition" />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition" tabIndex={-1}>
                <EyeIcon show={showConfirmPassword} />
              </button>
            </div>
            {formData.confirmPassword && (
              <p className={`text-xs mt-1 ${formData.password === formData.confirmPassword ? "text-green-500" : "text-red-400"}`}>
                {formData.password === formData.confirmPassword ? "✓ Passwords match" : "✗ Passwords don't match"}
              </p>
            )}
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition mt-2 disabled:opacity-60">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Creating Account...
              </span>
            ) : "Create Account 🎉"}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 font-semibold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;