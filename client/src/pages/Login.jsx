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

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1=email, 2=otp, 3=new password
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmNewPass, setShowConfirmNewPass] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  if (user && !error) return <Navigate to="/" />;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.email || !formData.password) { setError("Please fill in all fields!"); return; }
    try {
      setLoading(true);
      const res = await api.post("/users/login", formData);
      login(res.data);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openForgotModal = () => {
    setShowForgotModal(true); setForgotStep(1); setForgotEmail(""); setForgotOtp("");
    setNewPassword(""); setConfirmNewPassword(""); setForgotError(""); setForgotSuccess("");
  };

  const closeForgotModal = () => {
    setShowForgotModal(false); setForgotStep(1); setForgotError(""); setForgotSuccess("");
  };

  // Step 1 — Email check & OTP send
  const handleForgotEmailCheck = async (e) => {
    e.preventDefault(); setForgotError("");
    if (!forgotEmail) { setForgotError("Please enter your email."); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(forgotEmail)) { setForgotError("Please enter a valid email."); return; }
    try {
      setForgotLoading(true);
      await api.post("/users/forgot-password/check", { email: forgotEmail });
      setForgotStep(2);
    } catch (err) {
      setForgotError(err.response?.data?.message || "Email not found. Please check and try again.");
    } finally { setForgotLoading(false); }
  };

  // Step 2 — OTP verify
  const handleVerifyOtp = async (e) => {
    e.preventDefault(); setForgotError("");
    if (!forgotOtp) { setForgotError("Please enter the OTP."); return; }
    if (forgotOtp.length !== 6) { setForgotError("OTP must be 6 digits."); return; }
    try {
      setForgotLoading(true);
      await api.post("/users/forgot-password/verify-otp", { email: forgotEmail, otp: forgotOtp });
      setForgotStep(3);
    } catch (err) {
      setForgotError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally { setForgotLoading(false); }
  };

  // Step 3 — Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault(); setForgotError("");
    if (!newPassword || !confirmNewPassword) { setForgotError("Please fill in all fields."); return; }
    if (newPassword.length < 6) { setForgotError("Password must be at least 6 characters."); return; }
    if (newPassword !== confirmNewPassword) { setForgotError("Passwords do not match."); return; }
    try {
      setForgotLoading(true);
      await api.post("/users/forgot-password/reset", { email: forgotEmail, otp: forgotOtp, newPassword });
      setForgotSuccess("Password reset successfully! You can now login with your new password.");
      setTimeout(() => closeForgotModal(), 2500);
    } catch (err) {
      setForgotError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally { setForgotLoading(false); }
  };

  const stepLabels = ["Verify Email", "Enter OTP", "New Password"];

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">👋</div>
            <h1 className="text-3xl font-extrabold text-gray-800">Welcome Back!</h1>
            <p className="text-gray-500 mt-2">Login to book your dream event</p>
          </div>

          {error && (
            <div className={`px-4 py-3 rounded-xl mb-5 text-sm text-center ${error.includes("blocked") ? "bg-red-100 text-red-700 border-2 border-red-400 font-bold" : "bg-red-50 text-red-500"}`}>
              {error.includes("blocked") ? "🚫 " : ""}{error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition" />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password}
                  onChange={handleChange} placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition" tabIndex={-1}>
                  <EyeIcon show={showPassword} />
                </button>
              </div>
            </div>

            <div className="text-right -mt-1">
              <button type="button" onClick={openForgotModal}
                className="text-sm text-purple-600 hover:underline font-medium">
                Forgot Password?
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition mt-1 disabled:opacity-60">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Logging in...
                </span>
              ) : "Login →"}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-purple-600 font-semibold hover:underline">Register here</Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm relative">
            <button onClick={closeForgotModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition text-xl font-bold">✕</button>

            {/* Step Indicator — 3 steps */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition"
                    style={{ background: forgotStep >= step ? "#7c3aed" : "#f3f4f6", color: forgotStep >= step ? "#fff" : "#9ca3af" }}>
                    {forgotStep > step ? "✓" : step}
                  </div>
                  {step < 3 && <div className="h-1 rounded-full w-8 transition" style={{ background: forgotStep > step ? "#7c3aed" : "#e5e7eb" }} />}
                </div>
              ))}
              <span className="text-xs text-gray-400 ml-2">{stepLabels[forgotStep - 1]}</span>
            </div>

            {/* Step Header */}
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">
                {forgotStep === 1 ? "🔑" : forgotStep === 2 ? "📧" : "🔒"}
              </div>
              <h2 className="text-xl font-extrabold text-gray-800">
                {forgotStep === 1 ? "Forgot Password?" : forgotStep === 2 ? "Enter OTP" : "Set New Password"}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {forgotStep === 1
                  ? "Enter your registered email to proceed"
                  : forgotStep === 2
                  ? `OTP sent to ${forgotEmail}`
                  : `Setting new password for ${forgotEmail}`}
              </p>
            </div>

            {forgotError && <div className="bg-red-50 text-red-500 px-4 py-3 rounded-xl mb-4 text-sm text-center">{forgotError}</div>}
            {forgotSuccess && <div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl mb-4 text-sm text-center font-semibold">✅ {forgotSuccess}</div>}

            {/* Step 1 — Email */}
            {forgotStep === 1 && !forgotSuccess && (
              <form onSubmit={handleForgotEmailCheck} className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
                  <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your registered email" autoFocus
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition" />
                </div>
                <button type="submit" disabled={forgotLoading}
                  className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition disabled:opacity-60">
                  {forgotLoading ? "Sending OTP..." : "Send OTP →"}
                </button>
              </form>
            )}

            {/* Step 2 — OTP */}
            {forgotStep === 2 && !forgotSuccess && (
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">6-digit OTP</label>
                  <input
                    type="text" value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter OTP" autoFocus maxLength={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition tracking-widest text-center text-xl font-bold" />
                  <p className="text-xs text-gray-400 mt-1 text-center">OTP valid for 10 minutes</p>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => { setForgotStep(1); setForgotError(""); setForgotOtp(""); }}
                    className="flex-1 py-3 rounded-xl font-bold border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition">
                    ← Back
                  </button>
                  <button type="submit" disabled={forgotLoading}
                    className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition disabled:opacity-60">
                    {forgotLoading ? "Verifying..." : "Verify OTP →"}
                  </button>
                </div>
                <button type="button" onClick={handleForgotEmailCheck}
                  className="text-sm text-purple-600 hover:underline text-center">
                  Resend OTP
                </button>
              </form>
            )}

            {/* Step 3 — New Password */}
            {forgotStep === 3 && !forgotSuccess && (
              <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">New Password</label>
                  <div className="relative">
                    <input type={showNewPass ? "text" : "password"} value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 6 characters" autoFocus
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition" />
                    <button type="button" onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition" tabIndex={-1}>
                      <EyeIcon show={showNewPass} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Confirm New Password</label>
                  <div className="relative">
                    <input type={showConfirmNewPass ? "text" : "password"} value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder="Confirm new password"
                      className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition" />
                    <button type="button" onClick={() => setShowConfirmNewPass(!showConfirmNewPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition" tabIndex={-1}>
                      <EyeIcon show={showConfirmNewPass} />
                    </button>
                  </div>
                  {confirmNewPassword && (
                    <p className={`text-xs mt-1 ${newPassword === confirmNewPassword ? "text-green-500" : "text-red-400"}`}>
                      {newPassword === confirmNewPassword ? "✓ Passwords match" : "✗ Passwords don't match"}
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => { setForgotStep(2); setForgotError(""); }}
                    className="flex-1 py-3 rounded-xl font-bold border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition">
                    ← Back
                  </button>
                  <button type="submit" disabled={forgotLoading}
                    className="flex-1 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition disabled:opacity-60">
                    {forgotLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Login;