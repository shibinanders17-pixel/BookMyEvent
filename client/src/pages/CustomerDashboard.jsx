// // import { useState, useEffect, useContext } from "react";
// // import { useNavigate, useParams, useLocation } from "react-router-dom";
// // import { AuthContext } from "../context/AuthContext";
// // import api from "../services/api";

// // const statusStyles = {
// //   pending:   "bg-yellow-100 text-yellow-600",
// //   confirmed: "bg-green-100 text-green-600",
// //   cancelled: "bg-red-100 text-red-600",
// // };
// // const statusIcons = { pending: "⏳", confirmed: "✅", completed: "🎉", cancelled: "❌" };

// // const paymentTypeLabel = (b) => {
// //   if (b.paymentType === "advance") return "25% Advance Paid";
// //   return "Full Payment";
// // };

// // const EyeIcon = ({ show }) =>
// //   show ? (
// //     <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
// //     </svg>
// //   ) : (
// //     <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
// //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
// //     </svg>
// //   );

// // // ── Requests Tab Component ─────────────────────────────────
// // const statusColors = {
// //   pending:   { bg: "rgba(234,179,8,0.1)",   text: "#facc15", border: "rgba(234,179,8,0.3)" },
// //   reviewing: { bg: "rgba(59,130,246,0.1)",  text: "#60a5fa", border: "rgba(59,130,246,0.3)" },
// //   quoted:    { bg: "rgba(167,139,250,0.1)", text: "#a78bfa", border: "rgba(167,139,250,0.3)" },
// //   accepted:  { bg: "rgba(251,146,60,0.1)",  text: "#fb923c", border: "rgba(251,146,60,0.3)" },
// //   confirmed: { bg: "rgba(34,197,94,0.1)",   text: "#4ade80", border: "rgba(34,197,94,0.3)" },
// //   completed: { bg: "rgba(20,184,166,0.1)",  text: "#2dd4bf", border: "rgba(20,184,166,0.3)" },
// //   rejected:  { bg: "rgba(239,68,68,0.1)",   text: "#f87171", border: "rgba(239,68,68,0.3)" },
// //   cancelled: { bg: "rgba(107,114,128,0.1)", text: "#9ca3af", border: "rgba(107,114,128,0.3)" },
// // };
// // const statusIcons2 = { pending: "⏳", reviewing: "👀", quoted: "💰", accepted: "🤝", confirmed: "✅", completed: "🎊", rejected: "❌", cancelled: "🚫" };

// // const STEPS = ["Submitted", "Reviewing", "Quoted", "Accepted", "Confirmed", "Completed"];
// // const stepStatus = { pending: 0, reviewing: 1, quoted: 2, accepted: 3, confirmed: 4, completed: 5 };

// // const StatusStepper = ({ status }) => {
// //   if (["rejected", "cancelled"].includes(status)) return null;
// //   const activeStep = stepStatus[status] ?? 0;
// //   return (
// //     <div className="flex items-center mb-5">
// //       {STEPS.map((step, i) => {
// //         const done = i < activeStep;
// //         const active = i === activeStep;
// //         return (
// //           <div key={step} className="flex items-center flex-1 last:flex-none">
// //             <div className="flex flex-col items-center">
// //               <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
// //                 style={{
// //                   background: done ? "#a78bfa" : active ? "linear-gradient(135deg,#c084fc,#f472b6)" : "rgba(255,255,255,0.07)",
// //                   color: done || active ? "#fff" : "rgba(255,255,255,0.3)",
// //                   boxShadow: active ? "0 0 10px rgba(192,132,252,0.5)" : "none",
// //                   border: done || active ? "none" : "1px solid rgba(255,255,255,0.1)",
// //                 }}>
// //                 {done ? "✓" : i + 1}
// //               </div>
// //               <p className="text-xs mt-1 font-medium"
// //                 style={{ color: active ? "#c084fc" : done ? "#a78bfa" : "rgba(255,255,255,0.25)", whiteSpace: "nowrap" }}>
// //                 {step}
// //               </p>
// //             </div>
// //             {i < STEPS.length - 1 && (
// //               <div className="flex-1 h-0.5 mx-1 mb-4 rounded"
// //                 style={{ background: i < activeStep ? "#a78bfa" : "rgba(255,255,255,0.08)" }} />
// //             )}
// //           </div>
// //         );
// //       })}
// //     </div>
// //   );
// // };

// // const RequestsTab = ({ navigate }) => {
// //   const [requests, setRequests] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [cancelMsg, setCancelMsg] = useState("");
// //   const [respondingId, setRespondingId] = useState(null);

// //   useEffect(() => {
// //     api.get("/users/custom-requests/my")
// //       .then(res => setRequests(res.data))
// //       .catch(() => {})
// //       .finally(() => setLoading(false));
// //   }, []);

// //   const handleCancel = async (id) => {
// //     if (!window.confirm("Cancel this custom request?")) return;
// //     try {
// //       await api.delete(`/users/custom-requests/${id}`);
// //       setRequests(prev => prev.map(r => r._id === id ? { ...r, status: "cancelled" } : r));
// //       setCancelMsg("✅ Request cancelled successfully!");
// //       setTimeout(() => setCancelMsg(""), 4000);
// //     } catch { alert("Failed to cancel. Please try again."); }
// //   };

// //   const handleRespond = async (id, response) => {
// //     const confirmMsg = response === "accepted"
// //       ? "Accept this quote and confirm the event?"
// //       : "Decline this quote?";
// //     if (!window.confirm(confirmMsg)) return;
// //     setRespondingId(id);
// //     try {
// //       const res = await api.put(`/users/custom-requests/${id}/respond`, { response });
// //       setRequests(prev => prev.map(r => r._id === id ? { ...r, status: res.data.request.status } : r));
// //       setCancelMsg(response === "accepted" ? "🤝 Quote accepted! Waiting for advance confirmation." : "Quote declined.");
// //       setTimeout(() => setCancelMsg(""), 5000);
// //     } catch { alert("Failed. Please try again."); }
// //     finally { setRespondingId(null); }
// //   };

// //   return (
// //     <div className="pb-10">

// //       {cancelMsg && (
// //         <div className="mb-4 px-4 py-3 rounded-xl text-sm font-semibold text-center"
// //           style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80" }}>
// //           {cancelMsg}
// //         </div>
// //       )}

// //       <div className="flex items-center justify-between mb-6">
// //         <div>
// //           <h2 className="text-2xl font-bold text-white">✨ My Custom Requests</h2>
// //           <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Track all your custom event requests here</p>
// //         </div>
// //         <button onClick={() => navigate("/custom-request")}
// //           className="px-4 py-2 rounded-full text-sm font-bold transition hover:scale-105"
// //           style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)", color: "#fff" }}>
// //           + New Request
// //         </button>
// //       </div>

// //       {loading && (
// //         <div className="flex flex-col items-center justify-center py-20">
// //           <div className="w-10 h-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mb-4"></div>
// //           <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading your requests...</p>
// //         </div>
// //       )}

// //       {!loading && requests.length === 0 && (
// //         <div className="text-center py-16 rounded-3xl"
// //           style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(192,132,252,0.1)" }}>
// //           <p className="text-5xl mb-4">📭</p>
// //           <p className="text-white text-lg font-bold mb-2">No custom requests yet!</p>
// //           <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>Have a unique event idea? Let us know!</p>
// //           <button onClick={() => navigate("/custom-request")}
// //             className="px-6 py-3 rounded-full font-bold text-white transition hover:scale-105"
// //             style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
// //             ✨ Submit Custom Request
// //           </button>
// //         </div>
// //       )}

// //       {!loading && requests.length > 0 && (
// //         <div className="flex flex-col gap-4">
// //           {requests.map((req) => {
// //             const sc = statusColors[req.status] || statusColors.pending;
// //             const isConfirmed  = req.status === "confirmed";
// //             const isAccepted   = req.status === "accepted";
// //             const isCompleted  = req.status === "completed";
// //             const isRejected   = req.status === "rejected";
// //             const isCancelled  = req.status === "cancelled";
// //             const isQuoted     = req.status === "quoted";
// //             const isResponding = respondingId === req._id;
// //             return (
// //               <div key={req._id} className="rounded-2xl p-6 transition hover:scale-[1.01]"
// //                 style={{
// //                   background: isCompleted
// //                     ? "rgba(20,184,166,0.06)"
// //                     : isConfirmed
// //                     ? "rgba(34,197,94,0.06)"
// //                     : isAccepted
// //                     ? "rgba(251,146,60,0.06)"
// //                     : isQuoted
// //                     ? "rgba(167,139,250,0.06)"
// //                     : "rgba(255,255,255,0.03)",
// //                   border: `1px solid ${isCompleted ? "rgba(20,184,166,0.3)" : isConfirmed ? "rgba(34,197,94,0.3)" : isAccepted ? "rgba(251,146,60,0.3)" : isQuoted ? "rgba(167,139,250,0.3)" : "rgba(192,132,252,0.12)"}`,
// //                 }}>

// //                 {/* ── Status Stepper ── */}
// //                 <StatusStepper status={req.status} />

// //                 {/* ── Rejected / Cancelled Banner ── */}
// //                 {isRejected && (
// //                   <div className="mb-4 px-4 py-3 rounded-xl text-sm font-bold text-center"
// //                     style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
// //                     ❌ You declined this quote. Feel free to submit a new request!
// //                   </div>
// //                 )}
// //                 {isCancelled && (
// //                   <div className="mb-4 px-4 py-3 rounded-xl text-sm font-bold text-center"
// //                     style={{ background: "rgba(107,114,128,0.12)", border: "1px solid rgba(107,114,128,0.3)", color: "#9ca3af" }}>
// //                     🚫 This request was cancelled.
// //                   </div>
// //                 )}

// //                 {/* ── Accepted: Book Now Button ── */}
// //                 {isAccepted && (
// //                   <div className="mb-4 p-4 rounded-xl"
// //                     style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.3)" }}>
// //                     <p className="text-sm font-semibold mb-1" style={{ color: "#fb923c" }}>
// //                       🎉 Quote Accepted! Complete your booking to confirm the event.
// //                     </p>
// //                     <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
// //                       Pay full or 25% advance via Razorpay to lock in your slot.
// //                     </p>
// //                     <button
// //                       onClick={() => navigate("/booking", {
// //                         state: {
// //                           package: {
// //                             name:    `Custom Event — ${req.eventCategory}`,
// //                             service: req.eventCategory,
// //                             event:   req.eventCategory,
// //                             price:   req.quotedPrice,
// //                             isCustomRequest: true,
// //                           },
// //                           customRequest: req,
// //                         },
// //                       })}
// //                       className="w-full py-3 rounded-xl text-sm font-bold transition hover:scale-105"
// //                       style={{ background: "linear-gradient(135deg,#fb923c,#f97316)", color: "#fff", boxShadow: "0 4px 15px rgba(251,146,60,0.3)" }}>
// //                       🚀 Book Now — ₹{req.quotedPrice?.toLocaleString()}
// //                     </button>
// //                   </div>
// //                 )}

// //                 {/* ── Confirmed Banner (advance received, event locked in) ── */}
// //                 {isConfirmed && (
// //                   <div className="mb-4 px-4 py-3 rounded-xl text-sm font-bold text-center"
// //                     style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)", color: "#4ade80" }}>
// //                     ✅ Advance received! Your event is confirmed. We'll be in touch for final details.
// //                   </div>
// //                 )}

// //                 {/* ── Completed Banner ── */}
// //                 {isCompleted && (
// //                   <div className="mb-4 px-4 py-3 rounded-xl text-sm font-bold text-center"
// //                     style={{ background: "rgba(20,184,166,0.15)", border: "1px solid rgba(20,184,166,0.4)", color: "#2dd4bf" }}>
// //                     🎊 Event completed! Thank you for trusting us. We hope it was amazing!
// //                   </div>
// //                 )}

// //                 <div className="flex justify-between items-start mb-4">
// //                   <div>
// //                     <h3 className="text-lg font-bold text-white">{req.eventCategory}</h3>
// //                     <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
// //                       📅 {req.date}{req.time ? ` at ${req.time}` : ""} &nbsp;|&nbsp; 👥 {req.guestCount || "—"} guests
// //                     </p>
// //                   </div>
// //                   <span className="text-xs font-bold px-3 py-1 rounded-full"
// //                     style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
// //                     {statusIcons2[req.status] || "⏳"} {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
// //                   </span>
// //                 </div>

// //                 <div className="grid grid-cols-2 gap-3 text-sm mb-4">
// //                   {[
// //                     { icon: "📍", label: "Venue", value: req.venue || "—" },
// //                     { icon: "📞", label: "Phone", value: req.phone || "—" },
// //                     { icon: "👥", label: "Guests", value: req.guestCount ? `${req.guestCount} people` : "—" },
// //                     { icon: "🗓️", label: "Submitted", value: new Date(req.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) },
// //                   ].map((item, i) => (
// //                     <div key={i} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
// //                       <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>{item.icon} {item.label}</p>
// //                       <p className="text-white font-medium truncate">{item.value}</p>
// //                     </div>
// //                   ))}
// //                 </div>

// //                 {/* Quoted Price */}
// //                 {req.quotedPrice > 0 && (
// //                   <div className="mb-4 px-4 py-3 rounded-xl flex items-center justify-between"
// //                     style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)" }}>
// //                     <span className="text-sm font-semibold" style={{ color: "#a78bfa" }}>💎 Quoted Price</span>
// //                     <span className="text-lg font-bold" style={{ color: "#a78bfa" }}>₹{req.quotedPrice.toLocaleString()}</span>
// //                   </div>
// //                 )}

// //                 {/* ── Quote Accept / Decline (only when status = quoted) ── */}
// //                 {isQuoted && (
// //                   <div className="mb-4 p-4 rounded-xl"
// //                     style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)" }}>
// //                     <p className="text-sm font-semibold mb-3" style={{ color: "#c084fc" }}>
// //                       🎯 Admin has sent you a quote! Would you like to proceed?
// //                     </p>
// //                     <div className="flex gap-3">
// //                       <button
// //                         onClick={() => handleRespond(req._id, "accepted")}
// //                         disabled={isResponding}
// //                         className="flex-1 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105 disabled:opacity-60"
// //                         style={{ background: "linear-gradient(135deg,#4ade80,#22c55e)", color: "#fff" }}>
// //                         {isResponding ? "..." : "✅ Accept Quote"}
// //                       </button>
// //                       <button
// //                         onClick={() => handleRespond(req._id, "declined")}
// //                         disabled={isResponding}
// //                         className="flex-1 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105 disabled:opacity-60"
// //                         style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
// //                         {isResponding ? "..." : "❌ Decline"}
// //                       </button>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* Services */}
// //                 {req.services?.length > 0 && (
// //                   <div className="flex flex-wrap gap-2 mb-4">
// //                     {req.services.map((sv) => (
// //                       <span key={sv} className="px-2 py-0.5 rounded text-xs"
// //                         style={{ background: "rgba(192,132,252,0.08)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.2)" }}>
// //                         {sv}
// //                       </span>
// //                     ))}
// //                   </div>
// //                 )}

// //                 {req.notes && (
// //                   <p className="text-xs mb-4 p-3 rounded-xl italic"
// //                     style={{ background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.4)" }}>
// //                     💬 {req.notes}
// //                   </p>
// //                 )}

// //                 {req.referenceImages?.length > 0 && (
// //                   <div className="flex gap-2 mb-4 flex-wrap">
// //                     {req.referenceImages.map((img, i) => (
// //                       <img key={i} src={img} alt="ref"
// //                         className="w-16 h-16 rounded-xl object-cover"
// //                         style={{ border: "1px solid rgba(192,132,252,0.2)" }} />
// //                     ))}
// //                   </div>
// //                 )}

// //                 {req.adminNote && (
// //                   <div className="mb-4 px-3 py-2 rounded-xl text-xs"
// //                     style={{ background: "rgba(192,132,252,0.08)", border: "1px solid rgba(192,132,252,0.2)", color: "#c084fc" }}>
// //                     📝 Admin Note: {req.adminNote}
// //                   </div>
// //                 )}

// //                 <div className="flex gap-2 mt-1">
// //                   <button onClick={() => navigate(`/dashboard/requests/${req._id}`, { state: { request: req } })}
// //                     className="flex-1 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105 flex items-center justify-center gap-1.5"
// //                     style={{ background: "linear-gradient(135deg, rgba(192,132,252,0.15), rgba(244,114,182,0.15))", color: "#c084fc", border: "1px solid rgba(192,132,252,0.25)" }}>
// //                     👁️ View Details
// //                   </button>
// //                   {["pending", "reviewing"].includes(req.status) && (
// //                     <button onClick={() => handleCancel(req._id)}
// //                       className="px-4 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105"
// //                       style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
// //                       ❌ Cancel
// //                     </button>
// //                   )}
// //                 </div>
// //               </div>
// //             );
// //           })}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // const CustomerDashboard = () => {
// //   const navigate = useNavigate();
// //   const { tab } = useParams();
// //   const activeTab = tab || "bookings";
// //   const location = useLocation();

// //   // Scroll to top whenever tab changes via navigation
// //   useEffect(() => {
// //     window.scrollTo({ top: 0, behavior: "smooth" });
// //   }, [activeTab, location.pathname]);

// //   const { user, logout, login, updateUser } = useContext(AuthContext);
// //   const [bookings, setBookings] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");
// //   const [selectedBooking, setSelectedBooking] = useState(null);
// //   const [serviceDetails, setServiceDetails] = useState(null);
// //   const [serviceDetailsLoading, setServiceDetailsLoading] = useState(false);
// //   const [walletBalance, setWalletBalance] = useState(0);
// //   const [cancelMsg, setCancelMsg] = useState("");
// //   const [imgUploading, setImgUploading] = useState(false);

// //   // Review states
// //   const [reviewBooking, setReviewBooking] = useState(null);
// //   const [reviewRating, setReviewRating] = useState(0);
// //   const [reviewComment, setReviewComment] = useState("");
// //   const [reviewLoading, setReviewLoading] = useState(false);
// //   const [reviewMsg, setReviewMsg] = useState("");

// //   // Profile edit states
// //   const [isEditingProfile, setIsEditingProfile] = useState(false);
// //   const [profileData, setProfileData] = useState({ name: "", phone: "" });
// //   const [profileLoading, setProfileLoading] = useState(false);
// //   const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });

// //   // Password change states
// //   const [isChangingPassword, setIsChangingPassword] = useState(false);
// //   const [passData, setPassData] = useState({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
// //   const [passLoading, setPassLoading] = useState(false);
// //   const [passMsg, setPassMsg] = useState({ type: "", text: "" });
// //   const [showCurrentPass, setShowCurrentPass] = useState(false);
// //   const [showNewPass, setShowNewPass] = useState(false);
// //   const [showConfirmPass, setShowConfirmPass] = useState(false);

// //   useEffect(() => { if (!user) navigate("/login"); }, [user, navigate]);

// //   useEffect(() => {
// //     const fetchBookings = async () => {
// //       try {
// //         setLoading(true);
// //         const res = await api.get("/users/bookings/my");
// //         setBookings(res.data);
// //       } catch (err) {
// //         console.error("Bookings fetch error:", err?.response?.status, err?.response?.data || err?.message);
// //         setError("Failed to load bookings. Please try again.");
// //       }
// //       finally { setLoading(false); }
// //     };
// //     if (user) {
// //       fetchBookings();
// //       setProfileData({ name: user.name || "", phone: user.phone || "" });
// //       api.get("/users/wallet")
// //         .then(res => setWalletBalance(res.data.walletBalance || 0))
// //         .catch(() => {});
// //     }
// //   }, [user]);

// //   const handleCancel = async (id) => {
// //     const booking = bookings.find(b => b._id === id);
// //     const isAdvance = booking?.paymentType === "advance";
// //     const advanceAmt = booking?.advanceAmount || 0;
// //     const fullAmt = booking?.totalAmount || booking?.package?.price || 0;
// //     const confirmMsg = isAdvance
// //       ? `Cancel this booking? ₹${advanceAmt.toLocaleString()} advance will be refunded to your wallet.`
// //       : `Cancel this booking? ₹${fullAmt.toLocaleString()} will be refunded to your wallet.`;
// //     if (!window.confirm(confirmMsg)) return;
// //     try {
// //       const res = await api.delete(`/users/bookings/${id}`);
// //       setBookings(prev =>
// //         prev.map(b => b._id === id ? { ...b, status: "cancelled" } : b)
// //       );
// //       if (selectedBooking?._id === id) setSelectedBooking(prev => ({ ...prev, status: "cancelled" }));
// //       if (res.data.refunded && res.data.refundAmount > 0) {
// //         setWalletBalance(prev => prev + res.data.refundAmount);
// //         setCancelMsg(`✅ Booking cancelled! ₹${res.data.refundAmount.toLocaleString()} refunded to your wallet.`);
// //         setTimeout(() => setCancelMsg(""), 5000);
// //       } else {
// //         setCancelMsg("✅ Booking cancelled successfully.");
// //         setTimeout(() => setCancelMsg(""), 4000);
// //       }
// //     } catch { alert("Failed to cancel booking. Please try again."); }
// //   };

// //   const handleLogout = () => { logout(); navigate("/"); };

// //   const handleSubmitReview = async () => {
// //     if (!reviewRating) return;
// //     try {
// //       setReviewLoading(true);
// //       await api.post("/users/reviews", {
// //         serviceName: reviewBooking.package?.service,
// //         bookingId: reviewBooking._id,
// //         rating: reviewRating,
// //         comment: reviewComment,
// //       });
// //       setReviewMsg("✅ Review submitted! Thank you.");
// //       setTimeout(() => {
// //         setReviewBooking(null);
// //         setReviewRating(0);
// //         setReviewComment("");
// //         setReviewMsg("");
// //       }, 2000);
// //     } catch (err) {
// //       setReviewMsg(err.response?.data?.message || "Failed to submit review.");
// //     } finally {
// //       setReviewLoading(false);
// //     }
// //   };

// //   // Profile save
// //   const handleProfileSave = async () => {
// //     setProfileMsg({ type: "", text: "" });
// //     if (!profileData.name.trim()) { setProfileMsg({ type: "error", text: "Name cannot be empty." }); return; }
// //     const phone = profileData.phone.replace(/\D/g, "");
// //     if (phone.length !== 10) { setProfileMsg({ type: "error", text: "Please enter a valid 10-digit phone number." }); return; }
// //     try {
// //       setProfileLoading(true);
// //       const res = await api.put("/users/profile", { name: profileData.name.trim(), phone });
// //       // Update auth context with new data
// //       login({ ...user, name: res.data.name, phone: res.data.phone });
// //       setProfileMsg({ type: "success", text: "Profile updated successfully! ✅" });
// //       setIsEditingProfile(false);
// //     } catch (err) {
// //       setProfileMsg({ type: "error", text: err.response?.data?.message || "Failed to update profile." });
// //     } finally { setProfileLoading(false); }
// //   };

// //   const handlePasswordChange = async () => {
// //     setPassMsg({ type: "", text: "" });
// //     if (!passData.currentPassword || !passData.newPassword || !passData.confirmNewPassword) {
// //       setPassMsg({ type: "error", text: "Please fill in all fields." }); return;
// //     }
// //     if (passData.newPassword.length < 6) { setPassMsg({ type: "error", text: "New password must be at least 6 characters." }); return; }
// //     if (passData.newPassword !== passData.confirmNewPassword) { setPassMsg({ type: "error", text: "New passwords do not match." }); return; }
// //     if (passData.currentPassword === passData.newPassword) { setPassMsg({ type: "error", text: "New password must be different from current password." }); return; }
// //     try {
// //       setPassLoading(true);
// //       await api.put("/users/change-password", { currentPassword: passData.currentPassword, newPassword: passData.newPassword });
// //       setPassMsg({ type: "success", text: "Password changed successfully! ✅" });
// //       setPassData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
// //       setIsChangingPassword(false);
// //     } catch (err) {
// //       setPassMsg({ type: "error", text: err.response?.data?.message || "Failed to change password." });
// //     } finally { setPassLoading(false); }
// //   };

// //   if (!user) return null;

// //   const packageBookingsAll = bookings.filter(b => !b.isCustomEvent);
// //   const confirmed  = packageBookingsAll.filter(b => b.status === "confirmed").length;
// //   const pending    = packageBookingsAll.filter(b => b.status === "pending").length;
// //   const cancelled  = packageBookingsAll.filter(b => b.status === "cancelled").length;

// //   return (
// //     <div className="min-h-screen" style={{ background: "#0f0a1e" }}>

// //       {/* Header */}
// //       <div className="py-10 px-6"
// //         style={{ background: "linear-gradient(135deg, #1a0533 0%, #0f0a1e 100%)", borderBottom: "1px solid rgba(192,132,252,0.15)" }}>
// //         <div className="max-w-5xl mx-auto flex items-center justify-between">
// //           <div className="flex items-center gap-4">
// //             <div className="font-extrabold text-2xl w-14 h-14 rounded-full flex items-center justify-center text-white"
// //               style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
// //               {user.name?.charAt(0).toUpperCase()}
// //             </div>
// //             <div>
// //               <h1 className="text-2xl font-extrabold text-white">Welcome, {user.name}! 👋</h1>
// //               <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{user.email}</p>
// //             </div>
// //           </div>
// //           <button onClick={handleLogout}
// //             className="px-4 py-2 rounded-full text-sm font-bold transition hover:scale-105"
// //             style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
// //             Logout 🚪
// //           </button>
// //         </div>
// //       </div>

// //       {/* Tabs */}
// //       <div className="max-w-5xl mx-auto px-6 mt-6">
// //         <div className="flex gap-4 mb-8" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
// //           {[
// //             { key: "bookings", label: "📦 Package Booking" },
// //             { key: "requests", label: "🎨 My Custom Booking" },
// //             { key: "wallet",   label: "👛 Wallet" },
// //             { key: "profile",  label: "👤 My Profile" },
// //           ].map(tab => (
// //             <button key={tab.key} onClick={() => navigate(`/dashboard/${tab.key}`)}
// //               className="pb-3 font-semibold text-sm transition border-b-2 whitespace-nowrap"
// //               style={{
// //                 borderColor: activeTab === tab.key ? "#c084fc" : "transparent",
// //                 color: activeTab === tab.key ? "#c084fc" : "rgba(255,255,255,0.4)",
// //               }}>
// //               {tab.label}
// //             </button>
// //           ))}
// //         </div>

// //         {/* ── BOOKINGS TAB ───────────────────────────────────── */}
// //         {activeTab === "bookings" && (
// //           <div>
// //             {cancelMsg && (
// //               <div className="mb-4 px-4 py-3 rounded-xl text-sm font-semibold text-center"
// //                 style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80" }}>
// //                 {cancelMsg}
// //               </div>
// //             )}


// //             {loading && (
// //               <div className="flex flex-col items-center justify-center py-20">
// //                 <div className="w-10 h-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mb-4"></div>
// //                 <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading your bookings...</p>
// //               </div>
// //             )}
// //             {error && !loading && (
// //               <div className="text-center py-10 px-4 rounded-2xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
// //                 <p className="text-red-400">{error}</p>
// //               </div>
// //             )}
// //             {!loading && !error && packageBookingsAll.length === 0 && (
// //               <div className="text-center py-16">
// //                 <p className="text-5xl mb-4">📭</p>
// //                 <p className="text-white text-lg font-bold mb-2">No bookings yet!</p>
// //                 <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>Start by exploring our services</p>
// //                 <button onClick={() => navigate("/services")}
// //                   className="px-6 py-3 rounded-full font-bold text-white transition hover:scale-105"
// //                   style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
// //                   Browse Services
// //                 </button>
// //               </div>
// //             )}
// //             {!loading && !error && packageBookingsAll.length > 0 && (
// //               <>
// //                 {/* ── Review Modal ── */}
// //                 {reviewBooking && (
// //                   <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
// //                     style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
// //                     onClick={() => setReviewBooking(null)}>
// //                     <div className="w-full max-w-md rounded-3xl p-6"
// //                       style={{ background: "linear-gradient(160deg, #1e1b3a, #16132b)", border: "1px solid rgba(192,132,252,0.25)" }}
// //                       onClick={e => e.stopPropagation()}>
// //                       <h2 className="text-xl font-extrabold text-white mb-1">⭐ Write a Review</h2>
// //                       <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>
// //                         {reviewBooking.package?.service}
// //                       </p>
// //                       <div className="flex gap-2 mb-5">
// //                         {[1,2,3,4,5].map(star => (
// //                           <button key={star} onClick={() => setReviewRating(star)}>
// //                             <span className="text-3xl" style={{ color: star <= reviewRating ? "#facc15" : "rgba(255,255,255,0.15)" }}>★</span>
// //                           </button>
// //                         ))}
// //                       </div>
// //                       <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)}
// //                         placeholder="Share your experience..."
// //                         rows={4}
// //                         className="w-full px-4 py-3 rounded-xl text-white outline-none text-sm resize-none mb-4"
// //                         style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(192,132,252,0.3)" }} />
// //                       {reviewMsg && (
// //                         <p className="text-sm text-center mb-3"
// //                           style={{ color: reviewMsg.includes("✅") ? "#4ade80" : "#f87171" }}>
// //                           {reviewMsg}
// //                         </p>
// //                       )}
// //                       <div className="flex gap-3">
// //                         <button onClick={() => { setReviewBooking(null); setReviewRating(0); setReviewComment(""); setReviewMsg(""); }}
// //                           className="flex-1 py-3 rounded-xl font-bold text-sm"
// //                           style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>
// //                           Cancel
// //                         </button>
// //                         <button onClick={handleSubmitReview} disabled={reviewLoading || !reviewRating}
// //                           className="flex-1 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-60"
// //                           style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
// //                           {reviewLoading ? "Submitting..." : "Submit ✓"}
// //                         </button>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* ── Booking Event Detail Modal ── */}
// //                 {selectedBooking && (
// //                   <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
// //                     style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
// //                     onClick={() => setSelectedBooking(null)}>
// //                     <div className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
// //                       style={{ background: "linear-gradient(160deg, #1e1b3a, #16132b)", border: "1px solid rgba(192,132,252,0.25)", maxHeight: "90vh", overflowY: "auto" }}
// //                       onClick={(e) => e.stopPropagation()}>

// //                       {/* Modal Header */}
// //                       <div className="px-6 py-5 flex items-start justify-between"
// //                         style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(192,132,252,0.08)" }}>
// //                         <div>
// //                           <p className="text-xs font-semibold mb-1" style={{ color: "#c084fc" }}>🎯 Event Details</p>
// //                           <h2 className="text-xl font-extrabold text-white">
// //                             {selectedBooking.isMultiBooking
// //                               ? `Multi-Service Booking`
// //                               : selectedBooking.package?.service || "Booking"}
// //                           </h2>
// //                           {!selectedBooking.isMultiBooking && (
// //                             <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
// //                               {selectedBooking.package?.event}
// //                               {selectedBooking.package?.duration ? ` — ${selectedBooking.package.duration}` : ""}
// //                             </p>
// //                           )}
// //                         </div>
// //                         <div className="flex flex-col items-end gap-2">
// //                           <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusStyles[selectedBooking.status]}`}>
// //                             {statusIcons[selectedBooking.status]} {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
// //                           </span>
// //                           <button onClick={() => setSelectedBooking(null)}
// //                             className="text-xs px-2 py-1 rounded-lg transition"
// //                             style={{ color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)" }}>
// //                             ✕ Close
// //                           </button>
// //                         </div>
// //                       </div>

// //                       <div className="px-6 py-5 flex flex-col gap-4">

// //                         {/* Multi-booking packages list */}
// //                         {selectedBooking.isMultiBooking && (
// //                           <div className="rounded-2xl p-4" style={{ background: "rgba(192,132,252,0.07)", border: "1px solid rgba(192,132,252,0.15)" }}>
// //                             <p className="text-xs font-bold mb-3" style={{ color: "#c084fc" }}>🛒 Services Booked</p>
// //                             <div className="flex flex-col gap-2">
// //                               {(selectedBooking.packages || []).map((pkg, i) => (
// //                                 <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl"
// //                                   style={{ background: "rgba(255,255,255,0.04)" }}>
// //                                   <div>
// //                                     <p className="text-sm font-semibold text-white">{pkg.service}</p>
// //                                     <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{pkg.event}{pkg.duration ? ` — ${pkg.duration}` : ""}</p>
// //                                   </div>
// //                                   <p className="text-sm font-bold" style={{ color: "#d4af37" }}>₹{pkg.price?.toLocaleString()}</p>
// //                                 </div>
// //                               ))}
// //                             </div>
// //                           </div>
// //                         )}

// //                         {/* Event Info Grid */}
// //                         <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
// //                           <p className="text-xs font-bold mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>📋 Event Info</p>
// //                           <div className="grid grid-cols-2 gap-3">
// //                             {[
// //                               { icon: "📅", label: "Event Date", value: selectedBooking.date },
// //                               { icon: "📍", label: "Venue", value: selectedBooking.venue },
// //                               { icon: "📞", label: "Phone", value: selectedBooking.phone },
// //                               { icon: "✉️", label: "Email", value: selectedBooking.email },
// //                               { icon: "👤", label: "Booked By", value: selectedBooking.name },
// //                               { icon: "🗓️", label: "Booked On", value: new Date(selectedBooking.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) },
// //                             ].map((item, i) => (
// //                               <div key={i} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
// //                                 <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>{item.icon} {item.label}</p>
// //                                 <p className="text-sm text-white font-semibold truncate">{item.value || "—"}</p>
// //                               </div>
// //                             ))}
// //                           </div>
// //                         </div>

// //                         {/* Payment Info */}
// //                         <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
// //                           <p className="text-xs font-bold mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>💳 Payment Info</p>
// //                           <div className="grid grid-cols-2 gap-3">
// //                             {[
// //                               { icon: "💰", label: "Total Amount", value: selectedBooking.isMultiBooking
// //                                   ? (selectedBooking.totalAmount ? `₹${selectedBooking.totalAmount.toLocaleString()}` : "—")
// //                                   : (selectedBooking.package?.price ? `₹${selectedBooking.package.price.toLocaleString()}` : "—"),
// //                                 highlight: true },
// //                               { icon: "🧾", label: "Payment Mode", value: paymentTypeLabel(selectedBooking) },
// //                               { icon: "⬆️", label: "Advance Paid", value: selectedBooking.advanceAmount > 0 ? `₹${selectedBooking.advanceAmount.toLocaleString()}` : "—" },
// //                               { icon: "⏳", label: "Remaining Due", value: selectedBooking.remainingAmount > 0 ? `₹${selectedBooking.remainingAmount.toLocaleString()}` : "—" },
// //                               { icon: "👛", label: "Wallet Used", value: selectedBooking.walletUsed > 0 ? `₹${selectedBooking.walletUsed.toLocaleString()}` : "—" },
// //                               { icon: "🔑", label: "Booking ID", value: selectedBooking._id?.slice(-8).toUpperCase() },
// //                             ].map((item, i) => (
// //                               <div key={i} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
// //                                 <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>{item.icon} {item.label}</p>
// //                                 <p className="text-sm font-bold truncate"
// //                                   style={{ color: item.highlight ? "#d4af37" : "white" }}>{item.value}</p>
// //                               </div>
// //                             ))}
// //                           </div>
// //                         </div>

// //                         {/* Message */}
// //                         {selectedBooking.message && (
// //                           <div className="px-4 py-3 rounded-2xl italic text-sm"
// //                             style={{ background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.06)" }}>
// //                             💬 "{selectedBooking.message}"
// //                           </div>
// //                         )}

// //                         {/* Service Details Section */}
// //                         {!selectedBooking.isMultiBooking && (
// //                           <div className="rounded-2xl overflow-hidden"
// //                             style={{ border: "1px solid rgba(192,132,252,0.2)", background: "rgba(192,132,252,0.04)" }}>
// //                             <div className="px-4 py-3 flex items-center justify-between"
// //                               style={{ borderBottom: "1px solid rgba(192,132,252,0.12)", background: "rgba(192,132,252,0.08)" }}>
// //                               <p className="text-xs font-bold" style={{ color: "#c084fc" }}>✨ Service Details</p>
// //                               {serviceDetailsLoading && (
// //                                 <div className="w-4 h-4 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
// //                               )}
// //                             </div>

// //                             {serviceDetailsLoading ? (
// //                               <div className="px-4 py-6 text-center text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
// //                                 Loading service info...
// //                               </div>
// //                             ) : serviceDetails ? (
// //                               <div className="px-4 py-4 flex flex-col gap-4">
// //                                 {/* Service banner image */}
// //                                 {serviceDetails.img && (
// //                                   <img src={serviceDetails.img} alt={serviceDetails.title}
// //                                     className="w-full rounded-xl object-cover"
// //                                     style={{ maxHeight: "180px" }} />
// //                                 )}

// //                                 {/* Title + desc */}
// //                                 <div>
// //                                   <div className="flex items-center gap-2 mb-1">
// //                                     {serviceDetails.icon && <span className="text-lg">{serviceDetails.icon}</span>}
// //                                     <h3 className="text-base font-extrabold text-white">{serviceDetails.title}</h3>
// //                                     {serviceDetails.tag && (
// //                                       <span className="text-xs px-2 py-0.5 rounded-full font-bold"
// //                                         style={{ background: "rgba(212,175,55,0.15)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.3)" }}>
// //                                         {serviceDetails.tag}
// //                                       </span>
// //                                     )}
// //                                   </div>
// //                                   {serviceDetails.subtitle && (
// //                                     <p className="text-xs mb-1" style={{ color: "#c084fc" }}>{serviceDetails.subtitle}</p>
// //                                   )}
// //                                   {serviceDetails.desc && (
// //                                     <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{serviceDetails.desc}</p>
// //                                   )}
// //                                 </div>

// //                                 {/* Rating */}
// //                                 {serviceDetails.rating && (
// //                                   <div className="flex items-center gap-2">
// //                                     <span className="text-yellow-400 text-sm">{"★".repeat(Math.round(serviceDetails.rating))}{"☆".repeat(5 - Math.round(serviceDetails.rating))}</span>
// //                                     <span className="text-xs font-bold text-white">{serviceDetails.rating}</span>
// //                                     {serviceDetails.reviews > 0 && (
// //                                       <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>({serviceDetails.reviews} reviews)</span>
// //                                     )}
// //                                   </div>
// //                                 )}

// //                                 {/* Highlights */}
// //                                 {serviceDetails.highlights?.length > 0 && (
// //                                   <div>
// //                                     <p className="text-xs font-bold mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>🌟 Highlights</p>
// //                                     <div className="flex flex-wrap gap-2">
// //                                       {serviceDetails.highlights.map((h, i) => (
// //                                         <span key={i} className="text-xs px-2.5 py-1 rounded-full"
// //                                           style={{ background: "rgba(192,132,252,0.1)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.2)" }}>
// //                                           ✓ {h}
// //                                         </span>
// //                                       ))}
// //                                     </div>
// //                                   </div>
// //                                 )}

// //                                 {/* Styles / packages with images */}
// //                                 {serviceDetails.styles?.length > 0 && (
// //                                   <div>
// //                                     <p className="text-xs font-bold mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>🎨 Available Packages</p>
// //                                     <div className="flex flex-col gap-2">
// //                                       {serviceDetails.styles.map((style, si) => {
// //                                         const isBooked = style.name?.toLowerCase() === selectedBooking.package?.event?.toLowerCase()
// //                                           || style.name?.toLowerCase() === selectedBooking.package?.duration?.toLowerCase();
// //                                         return (
// //                                           <div key={si} className="rounded-xl overflow-hidden"
// //                                             style={{
// //                                               border: isBooked ? "1px solid rgba(192,132,252,0.5)" : "1px solid rgba(255,255,255,0.06)",
// //                                               background: isBooked ? "rgba(192,132,252,0.08)" : "rgba(255,255,255,0.03)"
// //                                             }}>
// //                                             {style.img && (
// //                                               <img src={style.img} alt={style.name}
// //                                                 className="w-full object-cover"
// //                                                 style={{ maxHeight: "120px" }} />
// //                                             )}
// //                                             <div className="px-3 py-2.5">
// //                                               <div className="flex items-center justify-between">
// //                                                 <p className="text-sm font-bold text-white">{style.name}</p>
// //                                                 <p className="text-sm font-extrabold" style={{ color: "#d4af37" }}>₹{style.price?.toLocaleString()}</p>
// //                                               </div>
// //                                               {style.desc && (
// //                                                 <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{style.desc}</p>
// //                                               )}
// //                                               {style.specs?.length > 0 && (
// //                                                 <div className="flex flex-wrap gap-1 mt-2">
// //                                                   {style.specs.map((sp, spi) => (
// //                                                     <span key={spi} className="text-xs px-2 py-0.5 rounded-md"
// //                                                       style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>
// //                                                       {sp.label}: {sp.value}
// //                                                     </span>
// //                                                   ))}
// //                                                 </div>
// //                                               )}
// //                                               {isBooked && (
// //                                                 <p className="text-xs mt-1.5 font-bold" style={{ color: "#c084fc" }}>✓ Your booked package</p>
// //                                               )}
// //                                             </div>
// //                                           </div>
// //                                         );
// //                                       })}
// //                                     </div>
// //                                   </div>
// //                                 )}
// //                               </div>
// //                             ) : (
// //                               <div className="px-4 py-5 text-center">
// //                                 <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
// //                                   Service info not available
// //                                 </p>
// //                                 <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
// //                                   ({selectedBooking.package?.service})
// //                                 </p>
// //                               </div>
// //                             )}
// //                           </div>
// //                         )}

// //                         {/* Modal Actions */}
// //                         <div className="flex gap-3 pt-1">
// //                           {selectedBooking.status === "confirmed" && (
// //                             <button onClick={() => { handleCancel(selectedBooking._id); setSelectedBooking(null); }}
// //                               className="flex-1 py-3 rounded-xl font-bold text-sm transition hover:scale-105"
// //                               style={{ background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" }}>
// //                               ❌ Cancel Booking
// //                             </button>
// //                           )}
// //                           {selectedBooking.status === "cancelled" && !selectedBooking.isMultiBooking && selectedBooking.package && (
// //                             <button onClick={() => { setSelectedBooking(null); navigate("/booking", {
// //                               state: {
// //                                 package: selectedBooking.package,
// //                                 prefill: { date: selectedBooking.date, venue: selectedBooking.venue, phone: selectedBooking.phone, message: selectedBooking.message },
// //                               }
// //                             }); }}
// //                               className="flex-1 py-3 rounded-xl font-bold text-sm transition hover:scale-105"
// //                               style={{ background: "rgba(192,132,252,0.12)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.3)" }}>
// //                               🔄 Rebook This Event
// //                             </button>
// //                           )}
// //                           <button onClick={() => setSelectedBooking(null)}
// //                             className="px-5 py-3 rounded-xl font-semibold text-sm transition"
// //                             style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>
// //                             Close
// //                           </button>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* ── Booking Cards ── */}
// //                 {(() => {
// //                   const packageBookings = bookings.filter(b => !b.isCustomEvent);
// //                   const customBookings  = bookings.filter(b =>  b.isCustomEvent);

// //                   const BookingCard = ({ booking }) => {
// //                     const price = booking.isMultiBooking
// //                       ? (booking.totalAmount ? `₹${booking.totalAmount.toLocaleString()}` : "—")
// //                       : (booking.package?.price ? `₹${booking.package.price.toLocaleString()}` : "—");

// //                     const statusColor = {
// //                       confirmed: { bg: "rgba(34,197,94,0.1)",   text: "#4ade80",  border: "rgba(34,197,94,0.25)" },
// //                       pending:   { bg: "rgba(250,204,21,0.1)",  text: "#facc15",  border: "rgba(250,204,21,0.25)" },
// //                       completed: { bg: "rgba(99,102,241,0.1)",  text: "#818cf8",  border: "rgba(99,102,241,0.25)" },
// //                       cancelled: { bg: "rgba(239,68,68,0.1)",   text: "#f87171",  border: "rgba(239,68,68,0.25)" },
// //                     }[booking.status] || {};

// //                     return (
// //                       <div key={booking._id}
// //                         className="rounded-2xl overflow-hidden transition hover:scale-[1.01]"
// //                         style={{
// //                           background: "rgba(255,255,255,0.03)",
// //                           border: "1px solid rgba(192,132,252,0.12)",
// //                           boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
// //                           borderLeft: `4px solid ${statusColor.text || "rgba(192,132,252,0.4)"}`,
// //                         }}>

// //                         {/* Card Top */}
// //                         <div className="px-5 pt-5 pb-4">
// //                           <div className="flex items-start justify-between gap-3 mb-4">
// //                             <div className="flex-1 min-w-0">
// //                               {booking.isCustomEvent ? (
// //                                 <>
// //                                   <p className="text-xs font-semibold mb-1" style={{ color: "#f472b6" }}>🎨 Custom Event</p>
// //                                   <h3 className="text-base font-extrabold text-white truncate">
// //                                     {booking.package?.service || "Custom Booking"}
// //                                   </h3>
// //                                   {booking.package?.event && (
// //                                     <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
// //                                       🎪 {booking.package.event}
// //                                     </p>
// //                                   )}
// //                                 </>
// //                               ) : booking.isMultiBooking ? (
// //                                 <>
// //                                   <p className="text-xs font-semibold mb-1" style={{ color: "#c084fc" }}>🛒 Multi-Service</p>
// //                                   <h3 className="text-base font-extrabold text-white truncate">
// //                                     {booking.packages?.length || 0} Services Booked
// //                                   </h3>
// //                                   <div className="flex flex-wrap gap-1 mt-1.5">
// //                                     {(booking.packages || []).slice(0, 3).map((pkg, pi) => (
// //                                       <span key={pi} className="text-xs px-2 py-0.5 rounded-full"
// //                                         style={{ background: "rgba(192,132,252,0.15)", color: "#c084fc" }}>
// //                                         {pkg.service}
// //                                       </span>
// //                                     ))}
// //                                   </div>
// //                                 </>
// //                               ) : (
// //                                 <>
// //                                   <p className="text-xs font-semibold mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>
// //                                     🎪 {booking.package?.event || "Event"}
// //                                   </p>
// //                                   <h3 className="text-base font-extrabold text-white truncate">
// //                                     {booking.package?.service || "Booking"}
// //                                   </h3>
// //                                   {booking.package?.duration && (
// //                                     <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
// //                                       ⏱ {booking.package.duration}
// //                                     </p>
// //                                   )}
// //                                 </>
// //                               )}
// //                             </div>
// //                             <span className="text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0"
// //                               style={{ background: statusColor.bg, color: statusColor.text, border: `1px solid ${statusColor.border}` }}>
// //                               {statusIcons[booking.status]} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
// //                             </span>
// //                           </div>

// //                           {/* Info row */}
// //                           <div className="grid grid-cols-3 gap-2 mb-4">
// //                             {[
// //                               { icon: "📅", label: "Date",  value: booking.date },
// //                               { icon: "📍", label: "Venue", value: booking.venue },
// //                               { icon: "💰", label: "Price", value: price, gold: true },
// //                             ].map((item, i) => (
// //                               <div key={i} className="p-2.5 rounded-xl text-center"
// //                                 style={{ background: "rgba(255,255,255,0.04)" }}>
// //                                 <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>{item.icon}</p>
// //                                 <p className="text-xs font-bold truncate"
// //                                   style={{ color: item.gold ? "#d4af37" : "white" }}>{item.value}</p>
// //                                 <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>{item.label}</p>
// //                               </div>
// //                             ))}
// //                           </div>

// //                           {/* Advance badge */}
// //                           {booking.paymentType === "advance" && booking.status !== "cancelled" && (
// //                             <div className="mb-3 px-3 py-2 rounded-xl text-xs flex justify-between"
// //                               style={{ background: "rgba(250,204,21,0.08)", border: "1px solid rgba(250,204,21,0.15)" }}>
// //                               <span style={{ color: "#facc15" }}>💳 25% Advance — ₹{booking.advanceAmount?.toLocaleString()}</span>
// //                               <span style={{ color: "rgba(255,255,255,0.35)" }}>₹{booking.remainingAmount?.toLocaleString()} due</span>
// //                             </div>
// //                           )}

// //                           {/* Timeline */}
// //                           {booking.status !== "cancelled" && (
// //                             <div className="mb-3 px-3 py-3 rounded-xl flex items-center justify-between gap-2"
// //                               style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
// //                               {/* Confirmed step */}
// //                               <div className="flex flex-col items-center gap-1">
// //                                 <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
// //                                   style={{ background: "rgba(34,197,94,0.2)", border: "2px solid #22c55e", color: "#22c55e" }}>
// //                                   ✓
// //                                 </div>
// //                                 <span className="text-xs font-semibold" style={{ color: "#22c55e" }}>Confirmed</span>
// //                               </div>

// //                               {/* Connector line */}
// //                               <div className="flex-1 h-0.5 rounded-full" style={{
// //                                 background: booking.status === "completed"
// //                                   ? "linear-gradient(90deg, #22c55e, #a855f7)"
// //                                   : "rgba(255,255,255,0.1)"
// //                               }} />

// //                               {/* Completed step */}
// //                               <div className="flex flex-col items-center gap-1">
// //                                 <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
// //                                   style={booking.status === "completed"
// //                                     ? { background: "rgba(168,85,247,0.2)", border: "2px solid #a855f7", color: "#a855f7" }
// //                                     : { background: "rgba(255,255,255,0.05)", border: "2px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.3)" }}>
// //                                   🎉
// //                                 </div>
// //                                 <span className="text-xs font-semibold" style={{
// //                                   color: booking.status === "completed" ? "#a855f7" : "rgba(255,255,255,0.3)"
// //                                 }}>Completed</span>
// //                               </div>
// //                             </div>
// //                           )}
// //                           {booking.paymentType === "advance" && booking.status === "cancelled" && (
// //                             <div className="mb-3 px-3 py-2 rounded-xl text-xs"
// //                               style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)", color: "#4ade80" }}>
// //                               👛 ₹{booking.advanceAmount?.toLocaleString()} refunded to wallet
// //                             </div>
// //                           )}

// //                           {/* Action Buttons */}
// //                           <div className="flex items-center gap-2">
// //                             {/* View Event Button */}
// //                             <button onClick={() => navigate(`/dashboard/bookings/${booking._id}`)}
// //                               className="flex-1 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105 flex items-center justify-center gap-1.5"
// //                               style={{ background: "linear-gradient(135deg, rgba(192,132,252,0.15), rgba(244,114,182,0.15))", color: "#c084fc", border: "1px solid rgba(192,132,252,0.25)" }}>
// //                               🎯 View Event
// //                             </button>

// //                             {booking.status === "confirmed" && (
// //                               <button onClick={() => handleCancel(booking._id)}
// //                                 className="px-4 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105"
// //                                 style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
// //                                 ❌ Cancel
// //                               </button>
// //                             )}
// //                             {booking.status === "cancelled" && !booking.isMultiBooking && booking.package && (
// //                               <button onClick={() => navigate("/booking", {
// //                                 state: {
// //                                   package: booking.package,
// //                                   prefill: { date: booking.date, venue: booking.venue, phone: booking.phone, message: booking.message },
// //                                 }
// //                               })}
// //                                 className="px-4 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105"
// //                                 style={{ background: "rgba(192,132,252,0.1)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.2)" }}>
// //                                 🔄 Rebook
// //                               </button>
// //                             )}
// //                             {booking.status === "completed" && (
// //                               <button onClick={() => setReviewBooking(booking)}
// //                                 className="flex-1 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105"
// //                                 style={{ background: "rgba(250,204,21,0.1)", color: "#facc15", border: "1px solid rgba(250,204,21,0.3)" }}>
// //                                 ⭐ Write Review
// //                               </button>
// //                             )}
// //                           </div>
// //                         </div>
// //                       </div>
// //                     );
// //                   };

// //                   return (
// //                     <div className="pb-10 flex flex-col gap-8">

// //                       {/* ── Package Bookings ── */}
// //                       {packageBookings.length > 0 && (
// //                         <div>
// //                           <div className="flex items-center gap-3 mb-4">
// //                             <div className="h-px flex-1" style={{ background: "rgba(192,132,252,0.15)" }} />
// //                             <span className="text-xs font-extrabold px-3 py-1.5 rounded-full"
// //                               style={{ background: "rgba(192,132,252,0.1)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.2)", letterSpacing: "0.08em" }}>
// //                               📦 PACKAGE BOOKINGS
// //                             </span>
// //                             <div className="h-px flex-1" style={{ background: "rgba(192,132,252,0.15)" }} />
// //                           </div>
// //                           <div className="flex flex-col gap-5">
// //                             {packageBookings.map(b => <BookingCard key={b._id} booking={b} />)}
// //                           </div>
// //                         </div>
// //                       )}

// //                     </div>
// //                   );
// //                 })()}
// //               </>
// //             )}
// //           </div>
// //         )}

// //         {/* ── WALLET TAB ────────────────────────────────────── */}
// //         {activeTab === "wallet" && (
// //           <div className="max-w-lg pb-10">
// //             {/* Balance Card */}
// //             <div className="rounded-3xl p-8 mb-5 text-center"
// //               style={{ background: "linear-gradient(135deg, #6d28d9, #a21caf)", boxShadow: "0 10px 40px rgba(109,40,217,0.4)" }}>
// //               <p className="text-white/70 text-sm mb-2">👛 Wallet Balance</p>
// //               <p className="text-5xl font-extrabold text-white mb-1">₹{walletBalance.toLocaleString()}</p>
// //               <p className="text-white/50 text-xs mt-2">Use this balance for your next BookMyEvent booking</p>
// //             </div>

// //             {/* How it works */}
// //             <div className="rounded-3xl p-6 mb-5"
// //               style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(192,132,252,0.15)" }}>
// //               <h3 className="text-white font-bold mb-4">ℹ️ How Wallet Works</h3>
// //               <div className="flex flex-col gap-3">
// //                 {[
// //                   { icon: "💳", title: "Book with 25% Advance", desc: "Choose advance payment while booking to pay only 25% now." },
// //                   { icon: "❌", title: "Cancel → Wallet Refund", desc: "If you cancel, your advance amount is instantly credited to wallet." },
// //                   { icon: "🛒", title: "Use at Checkout", desc: "Apply wallet balance on your next booking to reduce payment." },
// //                   { icon: "🔒", title: "BookMyEvent Only", desc: "Wallet balance can only be used on BookMyEvent — no withdrawals." },
// //                 ].map((item, i) => (
// //                   <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
// //                     style={{ background: "rgba(255,255,255,0.04)" }}>
// //                     <span className="text-2xl">{item.icon}</span>
// //                     <div>
// //                       <p className="text-white font-semibold text-sm">{item.title}</p>
// //                       <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{item.desc}</p>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>

// //             {walletBalance === 0 && (
// //               <div className="text-center py-4">
// //                 <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
// //                   No balance yet. Book with advance payment and cancel to get wallet credits!
// //                 </p>
// //                 <button onClick={() => navigate("/services")}
// //                   className="px-6 py-3 rounded-full font-bold text-white transition hover:scale-105"
// //                   style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
// //                   Browse Services
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         )}

// //         {/* ── REQUESTS TAB ──────────────────────────────────── */}
// //         {activeTab === "requests" && (
// //           <RequestsTab key="requests-tab" navigate={navigate} />
// //         )}

// //         {/* ── PROFILE TAB ───────────────────────────────────── */}
// //         {activeTab === "profile" && (
// //           <div className="max-w-lg pb-10 flex flex-col gap-5">

// //             {/* Profile Info Card */}
// //             <div className="rounded-3xl p-6"
// //               style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(192,132,252,0.15)" }}>

// //               {/* Profile Image Upload */}
// //               <div className="flex flex-col items-center mb-6">
// //                 <div className="relative">
// //                   {user?.profileImg
// //                     ? <img src={user.profileImg} alt="profile"
// //                         className="w-24 h-24 rounded-full object-cover"
// //                         style={{ border: "3px solid #c084fc" }} />
// //                     : <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-4xl"
// //                         style={{ border: "3px solid #c084fc" }}>
// //                         {user?.name?.charAt(0).toUpperCase()}
// //                       </div>
// //                   }
// //                   <label htmlFor="profileImgInput"
// //                     className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition"
// //                     style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)", border: "2px solid #0f0a1e" }}
// //                     title="Change photo">
// //                     {imgUploading ? "⏳" : "📷"}
// //                   </label>
// //                   <input id="profileImgInput" type="file" accept="image/*" className="hidden"
// //                     onChange={async (e) => {
// //                       const file = e.target.files[0];
// //                       if (!file) return;
// //                       setImgUploading(true);
// //                       try {
// //                         const formData = new FormData();
// //                         formData.append("image", file);
// //                         const { data } = await api.post("/users/profile/image", formData, {
// //                           headers: { "Content-Type": "multipart/form-data" },
// //                         });
// //                         updateUser({ profileImg: data.profileImg });
// //                       } catch (err) {
// //                         alert("Image upload failed. Try again.");
// //                       } finally {
// //                         setImgUploading(false);
// //                         e.target.value = "";
// //                       }
// //                     }} />
// //                 </div>
// //                 <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>
// //                   {imgUploading ? "Uploading..." : "Click 📷 to change photo"}
// //                 </p>
// //               </div>
// //               <div className="flex items-center justify-between mb-5">
// //                 <h2 className="text-lg font-extrabold text-white">👤 Personal Information</h2>
// //                 {!isEditingProfile && (
// //                   <button onClick={() => { setIsEditingProfile(true); setProfileMsg({ type: "", text: "" }); }}
// //                     className="text-xs font-bold px-3 py-1.5 rounded-full transition hover:scale-105"
// //                     style={{ background: "rgba(192,132,252,0.1)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.3)" }}>
// //                     ✏️ Edit
// //                   </button>
// //                 )}
// //               </div>

// //               {profileMsg.text && (
// //                 <div className={`px-4 py-2.5 rounded-xl mb-4 text-sm text-center ${profileMsg.type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
// //                   {profileMsg.text}
// //                 </div>
// //               )}

// //               {!isEditingProfile ? (
// //                 <div className="flex flex-col gap-3">
// //                   {[
// //                     { label: "Full Name",    value: user.name,  icon: "👤" },
// //                     { label: "Email Address",value: user.email, icon: "📧" },
// //                     { label: "Phone Number", value: user.phone, icon: "📞" },
// //                   ].map((item, i) => (
// //                     <div key={i} className="p-4 rounded-2xl"
// //                       style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
// //                       <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>{item.icon} {item.label}</p>
// //                       <p className="text-white font-semibold">{item.value || "—"}</p>
// //                     </div>
// //                   ))}
// //                   <div className="grid grid-cols-1 gap-3 mt-1">
// //                     <div className="p-4 rounded-2xl text-center"
// //                       style={{ background: "rgba(192,132,252,0.08)", border: "1px solid rgba(192,132,252,0.2)" }}>
// //                       <p className="text-2xl font-bold" style={{ color: "#c084fc" }}>{bookings.length}</p>
// //                       <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Total Bookings</p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ) : (
// //                 <div className="flex flex-col gap-4">
// //                   <div>
// //                     <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(255,255,255,0.5)" }}>Full Name</label>
// //                     <input value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
// //                       placeholder="Your full name"
// //                       className="w-full px-4 py-3 rounded-xl text-white outline-none text-sm"
// //                       style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(192,132,252,0.3)" }} />
// //                   </div>
// //                   <div>
// //                     <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(255,255,255,0.5)" }}>📧 Email Address</label>
// //                     <input value={user.email} disabled
// //                       className="w-full px-4 py-3 rounded-xl text-sm cursor-not-allowed"
// //                       style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)" }} />
// //                     <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>Email cannot be changed</p>
// //                   </div>
// //                   <div>
// //                     <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(255,255,255,0.5)" }}>📞 Phone Number</label>
// //                     <input value={profileData.phone}
// //                       onChange={(e) => setProfileData({ ...profileData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
// //                       placeholder="10-digit phone number"
// //                       className="w-full px-4 py-3 rounded-xl text-white outline-none text-sm"
// //                       style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(192,132,252,0.3)" }} />
// //                   </div>
// //                   <div className="flex gap-3 mt-1">
// //                     <button onClick={() => { setIsEditingProfile(false); setProfileMsg({ type: "", text: "" }); setProfileData({ name: user.name || "", phone: user.phone || "" }); }}
// //                       className="flex-1 py-3 rounded-xl font-bold text-sm transition"
// //                       style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
// //                       Cancel
// //                     </button>
// //                     <button onClick={handleProfileSave} disabled={profileLoading}
// //                       className="flex-1 py-3 rounded-xl font-bold text-white text-sm transition hover:opacity-90 disabled:opacity-60"
// //                       style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
// //                       {profileLoading ? "Saving..." : "Save Changes ✓"}
// //                     </button>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>

// //             {/* Change Password Card */}
// //             <div className="rounded-3xl p-6"
// //               style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(192,132,252,0.15)" }}>
// //               <div className="flex items-center justify-between mb-5">
// //                 <h2 className="text-lg font-extrabold text-white">🔒 Password & Security</h2>
// //                 {!isChangingPassword && (
// //                   <button onClick={() => { setIsChangingPassword(true); setPassMsg({ type: "", text: "" }); }}
// //                     className="text-xs font-bold px-3 py-1.5 rounded-full transition hover:scale-105"
// //                     style={{ background: "rgba(192,132,252,0.1)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.3)" }}>
// //                     🔑 Change
// //                   </button>
// //                 )}
// //               </div>

// //               {passMsg.text && (
// //                 <div className={`px-4 py-2.5 rounded-xl mb-4 text-sm text-center ${passMsg.type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
// //                   {passMsg.text}
// //                 </div>
// //               )}

// //               {!isChangingPassword ? (
// //                 <div className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
// //                   <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>🔑 Password</p>
// //                   <p className="text-white font-semibold tracking-widest">••••••••</p>
// //                   <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>Last updated: Not tracked</p>
// //                 </div>
// //               ) : (
// //                 <div className="flex flex-col gap-4">
// //                   {[
// //                     { label: "Current Password", key: "currentPassword", show: showCurrentPass, setShow: setShowCurrentPass },
// //                     { label: "New Password",      key: "newPassword",     show: showNewPass,     setShow: setShowNewPass },
// //                     { label: "Confirm New Password", key: "confirmNewPassword", show: showConfirmPass, setShow: setShowConfirmPass },
// //                   ].map(({ label, key, show, setShow }) => (
// //                     <div key={key}>
// //                       <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</label>
// //                       <div className="relative">
// //                         <input type={show ? "text" : "password"} value={passData[key]}
// //                           onChange={(e) => setPassData({ ...passData, [key]: e.target.value })}
// //                           placeholder={label}
// //                           className="w-full px-4 py-3 pr-10 rounded-xl text-white outline-none text-sm"
// //                           style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(192,132,252,0.3)" }} />
// //                         <button type="button" onClick={() => setShow(!show)}
// //                           className="absolute right-3 top-1/2 -translate-y-1/2 transition"
// //                           style={{ color: "rgba(255,255,255,0.3)" }} tabIndex={-1}>
// //                           <EyeIcon show={show} />
// //                         </button>
// //                       </div>
// //                       {key === "confirmNewPassword" && passData.confirmNewPassword && (
// //                         <p className={`text-xs mt-1 ${passData.newPassword === passData.confirmNewPassword ? "text-green-400" : "text-red-400"}`}>
// //                           {passData.newPassword === passData.confirmNewPassword ? "✓ Passwords match" : "✗ Don't match"}
// //                         </p>
// //                       )}
// //                     </div>
// //                   ))}
// //                   <div className="flex gap-3 mt-1">
// //                     <button onClick={() => { setIsChangingPassword(false); setPassMsg({ type: "", text: "" }); setPassData({ currentPassword: "", newPassword: "", confirmNewPassword: "" }); }}
// //                       className="flex-1 py-3 rounded-xl font-bold text-sm transition"
// //                       style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
// //                       Cancel
// //                     </button>
// //                     <button onClick={handlePasswordChange} disabled={passLoading}
// //                       className="flex-1 py-3 rounded-xl font-bold text-white text-sm transition hover:opacity-90 disabled:opacity-60"
// //                       style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
// //                       {passLoading ? "Updating..." : "Update Password"}
// //                     </button>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>

// //             {/* Logout */}
// //             <button onClick={handleLogout}
// //               className="w-full py-3 rounded-xl font-bold transition hover:scale-105"
// //               style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
// //               Logout 🚪
// //             </button>
// //           </div>
// //         )}

// //       </div>
// //     </div>
// //   );
// // };

// // export default CustomerDashboard;








// import { useState, useEffect, useContext } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import api from "../services/api";

// const statusStyles = {
//   pending:   "bg-yellow-100 text-yellow-600",
//   confirmed: "bg-green-100 text-green-600",
//   cancelled: "bg-red-100 text-red-600",
// };
// const statusIcons = { pending: "⏳", confirmed: "✅", completed: "🎉", cancelled: "❌" };

// const paymentTypeLabel = (b) => {
//   if (b.paymentType === "advance") return "25% Advance Paid";
//   return "Full Payment";
// };

// const EyeIcon = ({ show }) =>
//   show ? (
//     <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//     </svg>
//   ) : (
//     <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//     </svg>
//   );

// // ── Requests Tab Component ─────────────────────────────────
// const statusColors = {
//   pending:   { bg: "rgba(234,179,8,0.1)",   text: "#facc15", border: "rgba(234,179,8,0.3)" },
//   reviewing: { bg: "rgba(59,130,246,0.1)",  text: "#60a5fa", border: "rgba(59,130,246,0.3)" },
//   quoted:    { bg: "rgba(167,139,250,0.1)", text: "#a78bfa", border: "rgba(167,139,250,0.3)" },
//   accepted:  { bg: "rgba(251,146,60,0.1)",  text: "#fb923c", border: "rgba(251,146,60,0.3)" },
//   confirmed: { bg: "rgba(34,197,94,0.1)",   text: "#4ade80", border: "rgba(34,197,94,0.3)" },
//   completed: { bg: "rgba(20,184,166,0.1)",  text: "#2dd4bf", border: "rgba(20,184,166,0.3)" },
//   rejected:  { bg: "rgba(239,68,68,0.1)",   text: "#f87171", border: "rgba(239,68,68,0.3)" },
//   cancelled: { bg: "rgba(107,114,128,0.1)", text: "#9ca3af", border: "rgba(107,114,128,0.3)" },
// };
// const statusIcons2 = { pending: "⏳", reviewing: "👀", quoted: "💰", accepted: "🤝", confirmed: "✅", completed: "🎊", rejected: "❌", cancelled: "🚫" };

// const STEPS = ["Submitted", "Reviewing", "Quoted", "Accepted", "Confirmed", "Completed"];
// const stepStatus = { pending: 0, reviewing: 1, quoted: 2, accepted: 3, confirmed: 4, completed: 5 };

// const StatusStepper = ({ status }) => {
//   if (["rejected", "cancelled"].includes(status)) return null;
//   const activeStep = stepStatus[status] ?? 0;
//   return (
//     <div className="flex items-center mb-5">
//       {STEPS.map((step, i) => {
//         const done = i < activeStep;
//         const active = i === activeStep;
//         return (
//           <div key={step} className="flex items-center flex-1 last:flex-none">
//             <div className="flex flex-col items-center">
//               <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
//                 style={{
//                   background: done ? "#a78bfa" : active ? "linear-gradient(135deg,#c084fc,#f472b6)" : "rgba(255,255,255,0.07)",
//                   color: done || active ? "#fff" : "rgba(255,255,255,0.3)",
//                   boxShadow: active ? "0 0 10px rgba(192,132,252,0.5)" : "none",
//                   border: done || active ? "none" : "1px solid rgba(255,255,255,0.1)",
//                 }}>
//                 {done ? "✓" : i + 1}
//               </div>
//               <p className="text-xs mt-1 font-medium"
//                 style={{ color: active ? "#c084fc" : done ? "#a78bfa" : "rgba(255,255,255,0.25)", whiteSpace: "nowrap" }}>
//                 {step}
//               </p>
//             </div>
//             {i < STEPS.length - 1 && (
//               <div className="flex-1 h-0.5 mx-1 mb-4 rounded"
//                 style={{ background: i < activeStep ? "#a78bfa" : "rgba(255,255,255,0.08)" }} />
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// const RequestsTab = ({ navigate }) => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [cancelMsg, setCancelMsg] = useState("");
//   const [respondingId, setRespondingId] = useState(null);

//   useEffect(() => {
//     api.get("/users/custom-requests/my")
//       .then(res => setRequests(res.data))
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);

//   const handleCancel = async (id) => {
//     if (!window.confirm("Cancel this custom request?")) return;
//     try {
//       await api.delete(`/users/custom-requests/${id}`);
//       setRequests(prev => prev.map(r => r._id === id ? { ...r, status: "cancelled" } : r));
//       setCancelMsg("✅ Request cancelled successfully!");
//       setTimeout(() => setCancelMsg(""), 4000);
//     } catch { alert("Failed to cancel. Please try again."); }
//   };

//   const handleRespond = async (id, response) => {
//     const confirmMsg = response === "accepted"
//       ? "Accept this quote and confirm the event?"
//       : "Decline this quote?";
//     if (!window.confirm(confirmMsg)) return;
//     setRespondingId(id);
//     try {
//       const res = await api.put(`/users/custom-requests/${id}/respond`, { response });
//       setRequests(prev => prev.map(r => r._id === id ? { ...r, status: res.data.request.status } : r));
//       setCancelMsg(response === "accepted" ? "🤝 Quote accepted! Waiting for advance confirmation." : "Quote declined.");
//       setTimeout(() => setCancelMsg(""), 5000);
//     } catch { alert("Failed. Please try again."); }
//     finally { setRespondingId(null); }
//   };

//   return (
//     <div className="pb-10">

//       {cancelMsg && (
//         <div className="mb-4 px-4 py-3 rounded-xl text-sm font-semibold text-center"
//           style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80" }}>
//           {cancelMsg}
//         </div>
//       )}

//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-white">✨ My Custom Requests</h2>
//           <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Track all your custom event requests here</p>
//         </div>
//         <button onClick={() => navigate("/custom-request")}
//           className="px-4 py-2 rounded-full text-sm font-bold transition hover:scale-105"
//           style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)", color: "#fff" }}>
//           + New Request
//         </button>
//       </div>

//       {loading && (
//         <div className="flex flex-col items-center justify-center py-20">
//           <div className="w-10 h-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mb-4"></div>
//           <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading your requests...</p>
//         </div>
//       )}

//       {!loading && requests.length === 0 && (
//         <div className="text-center py-16 rounded-3xl"
//           style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(192,132,252,0.1)" }}>
//           <p className="text-5xl mb-4">📭</p>
//           <p className="text-white text-lg font-bold mb-2">No custom requests yet!</p>
//           <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>Have a unique event idea? Let us know!</p>
//           <button onClick={() => navigate("/custom-request")}
//             className="px-6 py-3 rounded-full font-bold text-white transition hover:scale-105"
//             style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
//             ✨ Submit Custom Request
//           </button>
//         </div>
//       )}

//       {!loading && requests.length > 0 && (
//         <div className="flex flex-col gap-4">
//           {requests.map((req) => {
//             const sc = statusColors[req.status] || statusColors.pending;
//             const isConfirmed  = req.status === "confirmed";
//             const isAccepted   = req.status === "accepted";
//             const isCompleted  = req.status === "completed";
//             const isRejected   = req.status === "rejected";
//             const isCancelled  = req.status === "cancelled";
//             const isQuoted     = req.status === "quoted";
//             const isResponding = respondingId === req._id;
//             return (
//               <div key={req._id} className="rounded-2xl p-6 transition hover:scale-[1.01]"
//                 style={{
//                   background: isCompleted
//                     ? "rgba(20,184,166,0.06)"
//                     : isConfirmed
//                     ? "rgba(34,197,94,0.06)"
//                     : isAccepted
//                     ? "rgba(251,146,60,0.06)"
//                     : isQuoted
//                     ? "rgba(167,139,250,0.06)"
//                     : "rgba(255,255,255,0.03)",
//                   border: `1px solid ${isCompleted ? "rgba(20,184,166,0.3)" : isConfirmed ? "rgba(34,197,94,0.3)" : isAccepted ? "rgba(251,146,60,0.3)" : isQuoted ? "rgba(167,139,250,0.3)" : "rgba(192,132,252,0.12)"}`,
//                 }}>

//                 {/* ── Status Stepper ── */}
//                 <StatusStepper status={req.status} />

//                 {/* ── Rejected / Cancelled Banner ── */}
//                 {isRejected && (
//                   <div className="mb-4 px-4 py-3 rounded-xl text-sm font-bold text-center"
//                     style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
//                     ❌ You declined this quote. Feel free to submit a new request!
//                   </div>
//                 )}
//                 {isCancelled && (
//                   <div className="mb-4 px-4 py-3 rounded-xl text-sm font-bold text-center"
//                     style={{ background: "rgba(107,114,128,0.12)", border: "1px solid rgba(107,114,128,0.3)", color: "#9ca3af" }}>
//                     🚫 This request was cancelled.
//                   </div>
//                 )}

//                 {/* ── Accepted: Book Now Button ── */}
//                 {isAccepted && (
//                   <div className="mb-4 p-4 rounded-xl"
//                     style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.3)" }}>
//                     <p className="text-sm font-semibold mb-1" style={{ color: "#fb923c" }}>
//                       🎉 Quote Accepted! Complete your booking to confirm the event.
//                     </p>
//                     <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
//                       Pay full or 25% advance via Razorpay to lock in your slot.
//                     </p>
//                     <button
//                       onClick={() => navigate("/booking", {
//                         state: {
//                           package: {
//                             name:    `Custom Event — ${req.eventCategory}`,
//                             service: req.eventCategory,
//                             event:   req.eventCategory,
//                             price:   req.quotedPrice,
//                             isCustomRequest: true,
//                           },
//                           customRequest: req,
//                         },
//                       })}
//                       className="w-full py-3 rounded-xl text-sm font-bold transition hover:scale-105"
//                       style={{ background: "linear-gradient(135deg,#fb923c,#f97316)", color: "#fff", boxShadow: "0 4px 15px rgba(251,146,60,0.3)" }}>
//                       🚀 Book Now — ₹{req.quotedPrice?.toLocaleString()}
//                     </button>
//                   </div>
//                 )}

//                 {/* ── Confirmed Banner (advance received, event locked in) ── */}
//                 {isConfirmed && (
//                   <div className="mb-4 px-4 py-3 rounded-xl text-sm font-bold text-center"
//                     style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)", color: "#4ade80" }}>
//                     ✅ Advance received! Your event is confirmed. We'll be in touch for final details.
//                   </div>
//                 )}

//                 {/* ── Completed Banner ── */}
//                 {isCompleted && (
//                   <div className="mb-4 px-4 py-3 rounded-xl text-sm font-bold text-center"
//                     style={{ background: "rgba(20,184,166,0.15)", border: "1px solid rgba(20,184,166,0.4)", color: "#2dd4bf" }}>
//                     🎊 Event completed! Thank you for trusting us. We hope it was amazing!
//                   </div>
//                 )}

//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     <h3 className="text-lg font-bold text-white">{req.eventCategory}</h3>
//                     <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
//                       📅 {req.date}{req.time ? ` at ${req.time}` : ""} &nbsp;|&nbsp; 👥 {req.guestCount || "—"} guests
//                     </p>
//                   </div>
//                   <span className="text-xs font-bold px-3 py-1 rounded-full"
//                     style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
//                     {statusIcons2[req.status] || "⏳"} {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
//                   </span>
//                 </div>

//                 <div className="grid grid-cols-2 gap-3 text-sm mb-4">
//                   {[
//                     { icon: "📍", label: "Venue", value: req.venue || "—" },
//                     { icon: "📞", label: "Phone", value: req.phone || "—" },
//                     { icon: "👥", label: "Guests", value: req.guestCount ? `${req.guestCount} people` : "—" },
//                     { icon: "🗓️", label: "Submitted", value: new Date(req.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) },
//                   ].map((item, i) => (
//                     <div key={i} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
//                       <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>{item.icon} {item.label}</p>
//                       <p className="text-white font-medium truncate">{item.value}</p>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Quoted Price */}
//                 {req.quotedPrice > 0 && (
//                   <div className="mb-4 px-4 py-3 rounded-xl flex items-center justify-between"
//                     style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)" }}>
//                     <span className="text-sm font-semibold" style={{ color: "#a78bfa" }}>💎 Quoted Price</span>
//                     <span className="text-lg font-bold" style={{ color: "#a78bfa" }}>₹{req.quotedPrice.toLocaleString()}</span>
//                   </div>
//                 )}

//                 {/* ── Quote Accept / Decline (only when status = quoted) ── */}
//                 {isQuoted && (
//                   <div className="mb-4 p-4 rounded-xl"
//                     style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)" }}>
//                     <p className="text-sm font-semibold mb-3" style={{ color: "#c084fc" }}>
//                       🎯 Admin has sent you a quote! Would you like to proceed?
//                     </p>
//                     <div className="flex gap-3">
//                       <button
//                         onClick={() => handleRespond(req._id, "accepted")}
//                         disabled={isResponding}
//                         className="flex-1 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105 disabled:opacity-60"
//                         style={{ background: "linear-gradient(135deg,#4ade80,#22c55e)", color: "#fff" }}>
//                         {isResponding ? "..." : "✅ Accept Quote"}
//                       </button>
//                       <button
//                         onClick={() => handleRespond(req._id, "declined")}
//                         disabled={isResponding}
//                         className="flex-1 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105 disabled:opacity-60"
//                         style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
//                         {isResponding ? "..." : "❌ Decline"}
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {/* Services */}
//                 {req.services?.length > 0 && (
//                   <div className="flex flex-wrap gap-2 mb-4">
//                     {req.services.map((sv) => (
//                       <span key={sv} className="px-2 py-0.5 rounded text-xs"
//                         style={{ background: "rgba(192,132,252,0.08)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.2)" }}>
//                         {sv}
//                       </span>
//                     ))}
//                   </div>
//                 )}

//                 {req.notes && (
//                   <p className="text-xs mb-4 p-3 rounded-xl italic"
//                     style={{ background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.4)" }}>
//                     💬 {req.notes}
//                   </p>
//                 )}

//                 {req.referenceImages?.length > 0 && (
//                   <div className="flex gap-2 mb-4 flex-wrap">
//                     {req.referenceImages.map((img, i) => (
//                       <img key={i} src={img} alt="ref"
//                         className="w-16 h-16 rounded-xl object-cover"
//                         style={{ border: "1px solid rgba(192,132,252,0.2)" }} />
//                     ))}
//                   </div>
//                 )}

//                 {req.adminNote && (
//                   <div className="mb-4 px-3 py-2 rounded-xl text-xs"
//                     style={{ background: "rgba(192,132,252,0.08)", border: "1px solid rgba(192,132,252,0.2)", color: "#c084fc" }}>
//                     📝 Admin Note: {req.adminNote}
//                   </div>
//                 )}

//                 <div className="flex gap-2 mt-1">
//                   <button onClick={() => navigate(`/dashboard/requests/${req._id}`, { state: { request: req } })}
//                     className="flex-1 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105 flex items-center justify-center gap-1.5"
//                     style={{ background: "linear-gradient(135deg, rgba(192,132,252,0.15), rgba(244,114,182,0.15))", color: "#c084fc", border: "1px solid rgba(192,132,252,0.25)" }}>
//                     👁️ View Details
//                   </button>
//                   {["pending", "reviewing"].includes(req.status) && (
//                     <button onClick={() => handleCancel(req._id)}
//                       className="px-4 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105"
//                       style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
//                       ❌ Cancel
//                     </button>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// const CustomerDashboard = () => {
//   const navigate = useNavigate();
//   const { tab } = useParams();
//   const activeTab = tab || "bookings";
//   const location = useLocation();

//   // Scroll to top whenever tab changes via navigation
//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [activeTab, location.pathname]);

//   const { user, logout, login, updateUser } = useContext(AuthContext);
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedBooking, setSelectedBooking] = useState(null);
//   const [serviceDetails, setServiceDetails] = useState(null);
//   const [serviceDetailsLoading, setServiceDetailsLoading] = useState(false);
//   const [walletBalance, setWalletBalance] = useState(0);
//   const [cancelMsg, setCancelMsg] = useState("");
//   const [imgUploading, setImgUploading] = useState(false);

//   // Review states
//   const [reviewBooking, setReviewBooking] = useState(null);
//   const [reviewRating, setReviewRating] = useState(0);
//   const [reviewComment, setReviewComment] = useState("");
//   const [reviewLoading, setReviewLoading] = useState(false);
//   const [reviewMsg, setReviewMsg] = useState("");
//   const [reviewedBookingIds, setReviewedBookingIds] = useState([]);

//   // Profile edit states
//   const [isEditingProfile, setIsEditingProfile] = useState(false);
//   const [profileData, setProfileData] = useState({ name: "", phone: "" });
//   const [profileLoading, setProfileLoading] = useState(false);
//   const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });

//   // Password change states
//   const [isChangingPassword, setIsChangingPassword] = useState(false);
//   const [passData, setPassData] = useState({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
//   const [passLoading, setPassLoading] = useState(false);
//   const [passMsg, setPassMsg] = useState({ type: "", text: "" });
//   const [showCurrentPass, setShowCurrentPass] = useState(false);
//   const [showNewPass, setShowNewPass] = useState(false);
//   const [showConfirmPass, setShowConfirmPass] = useState(false);

//   useEffect(() => { if (!user) navigate("/login"); }, [user, navigate]);

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         setLoading(true);
//         const res = await api.get("/users/bookings/my");
//         setBookings(res.data);
//       } catch (err) {
//         console.error("Bookings fetch error:", err?.response?.status, err?.response?.data || err?.message);
//         setError("Failed to load bookings. Please try again.");
//       }
//       finally { setLoading(false); }
//     };
//     if (user) {
//       fetchBookings();
//       setProfileData({ name: user.name || "", phone: user.phone || "" });
//       api.get("/users/wallet")
//         .then(res => setWalletBalance(res.data.walletBalance || 0))
//         .catch(() => {});
//     }
//   }, [user]);

//   const handleCancel = async (id) => {
//     const booking = bookings.find(b => b._id === id);
//     const isAdvance = booking?.paymentType === "advance";
//     const advanceAmt = booking?.advanceAmount || 0;
//     const fullAmt = booking?.totalAmount || booking?.package?.price || 0;
//     const confirmMsg = isAdvance
//       ? `Cancel this booking? ₹${advanceAmt.toLocaleString()} advance will be refunded to your wallet.`
//       : `Cancel this booking? ₹${fullAmt.toLocaleString()} will be refunded to your wallet.`;
//     if (!window.confirm(confirmMsg)) return;
//     try {
//       const res = await api.delete(`/users/bookings/${id}`);
//       setBookings(prev =>
//         prev.map(b => b._id === id ? { ...b, status: "cancelled" } : b)
//       );
//       if (selectedBooking?._id === id) setSelectedBooking(prev => ({ ...prev, status: "cancelled" }));
//       if (res.data.refunded && res.data.refundAmount > 0) {
//         setWalletBalance(prev => prev + res.data.refundAmount);
//         setCancelMsg(`✅ Booking cancelled! ₹${res.data.refundAmount.toLocaleString()} refunded to your wallet.`);
//         setTimeout(() => setCancelMsg(""), 5000);
//       } else {
//         setCancelMsg("✅ Booking cancelled successfully.");
//         setTimeout(() => setCancelMsg(""), 4000);
//       }
//     } catch { alert("Failed to cancel booking. Please try again."); }
//   };

//   const handleLogout = () => { logout(); navigate("/"); };

//   const handleSubmitReview = async () => {
//     if (!reviewRating) return;
//     try {
//       setReviewLoading(true);
//       await api.post("/users/reviews", {
//         serviceName: reviewBooking.isMultiBooking
//           ? (reviewBooking.packages?.[0]?.service || "")
//           : (reviewBooking.package?.service || ""),
//         bookingId: reviewBooking._id,
//         rating: reviewRating,
//         comment: reviewComment,
//       });
//       setReviewMsg("✅ Review submitted! Thank you.");
//       setReviewedBookingIds(prev => [...prev, reviewBooking._id]);
//       setTimeout(() => {
//         setReviewBooking(null);
//         setReviewRating(0);
//         setReviewComment("");
//         setReviewMsg("");
//       }, 2000);
//     } catch (err) {
//       setReviewMsg(err.response?.data?.message || "Failed to submit review.");
//     } finally {
//       setReviewLoading(false);
//     }
//   };

//   // Profile save
//   const handleProfileSave = async () => {
//     setProfileMsg({ type: "", text: "" });
//     if (!profileData.name.trim()) { setProfileMsg({ type: "error", text: "Name cannot be empty." }); return; }
//     const phone = profileData.phone.replace(/\D/g, "");
//     if (phone.length !== 10) { setProfileMsg({ type: "error", text: "Please enter a valid 10-digit phone number." }); return; }
//     try {
//       setProfileLoading(true);
//       const res = await api.put("/users/profile", { name: profileData.name.trim(), phone });
//       // Update auth context with new data
//       login({ ...user, name: res.data.name, phone: res.data.phone });
//       setProfileMsg({ type: "success", text: "Profile updated successfully! ✅" });
//       setIsEditingProfile(false);
//     } catch (err) {
//       setProfileMsg({ type: "error", text: err.response?.data?.message || "Failed to update profile." });
//     } finally { setProfileLoading(false); }
//   };

//   const handlePasswordChange = async () => {
//     setPassMsg({ type: "", text: "" });
//     if (!passData.currentPassword || !passData.newPassword || !passData.confirmNewPassword) {
//       setPassMsg({ type: "error", text: "Please fill in all fields." }); return;
//     }
//     if (passData.newPassword.length < 6) { setPassMsg({ type: "error", text: "New password must be at least 6 characters." }); return; }
//     if (passData.newPassword !== passData.confirmNewPassword) { setPassMsg({ type: "error", text: "New passwords do not match." }); return; }
//     if (passData.currentPassword === passData.newPassword) { setPassMsg({ type: "error", text: "New password must be different from current password." }); return; }
//     try {
//       setPassLoading(true);
//       await api.put("/users/change-password", { currentPassword: passData.currentPassword, newPassword: passData.newPassword });
//       setPassMsg({ type: "success", text: "Password changed successfully! ✅" });
//       setPassData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
//       setIsChangingPassword(false);
//     } catch (err) {
//       setPassMsg({ type: "error", text: err.response?.data?.message || "Failed to change password." });
//     } finally { setPassLoading(false); }
//   };

//   if (!user) return null;

//   const packageBookingsAll = bookings.filter(b => !b.isCustomEvent);
//   const confirmed  = packageBookingsAll.filter(b => b.status === "confirmed").length;
//   const pending    = packageBookingsAll.filter(b => b.status === "pending").length;
//   const cancelled  = packageBookingsAll.filter(b => b.status === "cancelled").length;

//   return (
//     <div className="min-h-screen" style={{ background: "#0f0a1e" }}>

//       {/* Header */}
//       <div className="py-10 px-6"
//         style={{ background: "linear-gradient(135deg, #1a0533 0%, #0f0a1e 100%)", borderBottom: "1px solid rgba(192,132,252,0.15)" }}>
//         <div className="max-w-5xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <div className="font-extrabold text-2xl w-14 h-14 rounded-full flex items-center justify-center text-white"
//               style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
//               {user.name?.charAt(0).toUpperCase()}
//             </div>
//             <div>
//               <h1 className="text-2xl font-extrabold text-white">Welcome, {user.name}! 👋</h1>
//               <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{user.email}</p>
//             </div>
//           </div>
//           <button onClick={handleLogout}
//             className="px-4 py-2 rounded-full text-sm font-bold transition hover:scale-105"
//             style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
//             Logout 🚪
//           </button>
//         </div>
//       </div>

//       {/* Tabs */}
//       <div className="max-w-5xl mx-auto px-6 mt-6">
//         <div className="flex gap-4 mb-8" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
//           {[
//             { key: "bookings", label: "📦 Package Booking" },
//             { key: "requests", label: "🎨 My Custom Booking" },
//             { key: "wallet",   label: "👛 Wallet" },
//             { key: "profile",  label: "👤 My Profile" },
//           ].map(tab => (
//             <button key={tab.key} onClick={() => navigate(`/dashboard/${tab.key}`)}
//               className="pb-3 font-semibold text-sm transition border-b-2 whitespace-nowrap"
//               style={{
//                 borderColor: activeTab === tab.key ? "#c084fc" : "transparent",
//                 color: activeTab === tab.key ? "#c084fc" : "rgba(255,255,255,0.4)",
//               }}>
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* ── BOOKINGS TAB ───────────────────────────────────── */}
//         {activeTab === "bookings" && (
//           <div>
//             {cancelMsg && (
//               <div className="mb-4 px-4 py-3 rounded-xl text-sm font-semibold text-center"
//                 style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80" }}>
//                 {cancelMsg}
//               </div>
//             )}


//             {loading && (
//               <div className="flex flex-col items-center justify-center py-20">
//                 <div className="w-10 h-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mb-4"></div>
//                 <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading your bookings...</p>
//               </div>
//             )}
//             {error && !loading && (
//               <div className="text-center py-10 px-4 rounded-2xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
//                 <p className="text-red-400">{error}</p>
//               </div>
//             )}
//             {!loading && !error && packageBookingsAll.length === 0 && (
//               <div className="text-center py-16">
//                 <p className="text-5xl mb-4">📭</p>
//                 <p className="text-white text-lg font-bold mb-2">No bookings yet!</p>
//                 <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>Start by exploring our services</p>
//                 <button onClick={() => navigate("/services")}
//                   className="px-6 py-3 rounded-full font-bold text-white transition hover:scale-105"
//                   style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
//                   Browse Services
//                 </button>
//               </div>
//             )}
//             {!loading && !error && packageBookingsAll.length > 0 && (
//               <>
//                 {/* ── Review Modal ── */}
//                 {reviewBooking && (
//                   <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
//                     style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
//                     onClick={() => setReviewBooking(null)}>
//                     <div className="w-full max-w-md rounded-3xl p-6"
//                       style={{ background: "linear-gradient(160deg, #1e1b3a, #16132b)", border: "1px solid rgba(192,132,252,0.25)" }}
//                       onClick={e => e.stopPropagation()}>
//                       <h2 className="text-xl font-extrabold text-white mb-1">⭐ Write a Review</h2>
//                       <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>
//                         {reviewBooking.package?.service}
//                       </p>
//                       <div className="flex gap-2 mb-5">
//                         {[1,2,3,4,5].map(star => (
//                           <button key={star} onClick={() => setReviewRating(star)}>
//                             <span className="text-3xl" style={{ color: star <= reviewRating ? "#facc15" : "rgba(255,255,255,0.15)" }}>★</span>
//                           </button>
//                         ))}
//                       </div>
//                       <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)}
//                         placeholder="Share your experience..."
//                         rows={4}
//                         className="w-full px-4 py-3 rounded-xl text-white outline-none text-sm resize-none mb-4"
//                         style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(192,132,252,0.3)" }} />
//                       {reviewMsg && (
//                         <p className="text-sm text-center mb-3"
//                           style={{ color: reviewMsg.includes("✅") ? "#4ade80" : "#f87171" }}>
//                           {reviewMsg}
//                         </p>
//                       )}
//                       <div className="flex gap-3">
//                         <button onClick={() => { setReviewBooking(null); setReviewRating(0); setReviewComment(""); setReviewMsg(""); }}
//                           className="flex-1 py-3 rounded-xl font-bold text-sm"
//                           style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>
//                           Cancel
//                         </button>
//                         <button onClick={handleSubmitReview} disabled={reviewLoading || !reviewRating}
//                           className="flex-1 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-60"
//                           style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
//                           {reviewLoading ? "Submitting..." : "Submit ✓"}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* ── Booking Event Detail Modal ── */}
//                 {selectedBooking && (
//                   <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
//                     style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
//                     onClick={() => setSelectedBooking(null)}>
//                     <div className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
//                       style={{ background: "linear-gradient(160deg, #1e1b3a, #16132b)", border: "1px solid rgba(192,132,252,0.25)", maxHeight: "90vh", overflowY: "auto" }}
//                       onClick={(e) => e.stopPropagation()}>

//                       {/* Modal Header */}
//                       <div className="px-6 py-5 flex items-start justify-between"
//                         style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(192,132,252,0.08)" }}>
//                         <div>
//                           <p className="text-xs font-semibold mb-1" style={{ color: "#c084fc" }}>🎯 Event Details</p>
//                           <h2 className="text-xl font-extrabold text-white">
//                             {selectedBooking.isMultiBooking
//                               ? `Multi-Service Booking`
//                               : selectedBooking.package?.service || "Booking"}
//                           </h2>
//                           {!selectedBooking.isMultiBooking && (
//                             <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
//                               {selectedBooking.package?.event}
//                               {selectedBooking.package?.duration ? ` — ${selectedBooking.package.duration}` : ""}
//                             </p>
//                           )}
//                         </div>
//                         <div className="flex flex-col items-end gap-2">
//                           <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusStyles[selectedBooking.status]}`}>
//                             {statusIcons[selectedBooking.status]} {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
//                           </span>
//                           <button onClick={() => setSelectedBooking(null)}
//                             className="text-xs px-2 py-1 rounded-lg transition"
//                             style={{ color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)" }}>
//                             ✕ Close
//                           </button>
//                         </div>
//                       </div>

//                       <div className="px-6 py-5 flex flex-col gap-4">

//                         {/* Multi-booking packages list */}
//                         {selectedBooking.isMultiBooking && (
//                           <div className="rounded-2xl p-4" style={{ background: "rgba(192,132,252,0.07)", border: "1px solid rgba(192,132,252,0.15)" }}>
//                             <p className="text-xs font-bold mb-3" style={{ color: "#c084fc" }}>🛒 Services Booked</p>
//                             <div className="flex flex-col gap-2">
//                               {(selectedBooking.packages || []).map((pkg, i) => (
//                                 <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl"
//                                   style={{ background: "rgba(255,255,255,0.04)" }}>
//                                   <div>
//                                     <p className="text-sm font-semibold text-white">{pkg.service}</p>
//                                     <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{pkg.event}{pkg.duration ? ` — ${pkg.duration}` : ""}</p>
//                                   </div>
//                                   <p className="text-sm font-bold" style={{ color: "#d4af37" }}>₹{pkg.price?.toLocaleString()}</p>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}

//                         {/* Event Info Grid */}
//                         <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
//                           <p className="text-xs font-bold mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>📋 Event Info</p>
//                           <div className="grid grid-cols-2 gap-3">
//                             {[
//                               { icon: "📅", label: "Event Date", value: selectedBooking.date },
//                               { icon: "📍", label: "Venue", value: selectedBooking.venue },
//                               { icon: "📞", label: "Phone", value: selectedBooking.phone },
//                               { icon: "✉️", label: "Email", value: selectedBooking.email },
//                               { icon: "👤", label: "Booked By", value: selectedBooking.name },
//                               { icon: "🗓️", label: "Booked On", value: new Date(selectedBooking.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) },
//                             ].map((item, i) => (
//                               <div key={i} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
//                                 <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>{item.icon} {item.label}</p>
//                                 <p className="text-sm text-white font-semibold truncate">{item.value || "—"}</p>
//                               </div>
//                             ))}
//                           </div>
//                         </div>

//                         {/* Payment Info */}
//                         <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
//                           <p className="text-xs font-bold mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>💳 Payment Info</p>
//                           <div className="grid grid-cols-2 gap-3">
//                             {[
//                               { icon: "💰", label: "Total Amount", value: selectedBooking.isMultiBooking
//                                   ? (selectedBooking.totalAmount ? `₹${selectedBooking.totalAmount.toLocaleString()}` : "—")
//                                   : (selectedBooking.package?.price ? `₹${selectedBooking.package.price.toLocaleString()}` : "—"),
//                                 highlight: true },
//                               { icon: "🧾", label: "Payment Mode", value: paymentTypeLabel(selectedBooking) },
//                               { icon: "⬆️", label: "Advance Paid", value: selectedBooking.advanceAmount > 0 ? `₹${selectedBooking.advanceAmount.toLocaleString()}` : "—" },
//                               { icon: "⏳", label: "Remaining Due", value: selectedBooking.remainingAmount > 0 ? `₹${selectedBooking.remainingAmount.toLocaleString()}` : "—" },
//                               { icon: "👛", label: "Wallet Used", value: selectedBooking.walletUsed > 0 ? `₹${selectedBooking.walletUsed.toLocaleString()}` : "—" },
//                               { icon: "🔑", label: "Booking ID", value: selectedBooking._id?.slice(-8).toUpperCase() },
//                             ].map((item, i) => (
//                               <div key={i} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
//                                 <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>{item.icon} {item.label}</p>
//                                 <p className="text-sm font-bold truncate"
//                                   style={{ color: item.highlight ? "#d4af37" : "white" }}>{item.value}</p>
//                               </div>
//                             ))}
//                           </div>
//                         </div>

//                         {/* Message */}
//                         {selectedBooking.message && (
//                           <div className="px-4 py-3 rounded-2xl italic text-sm"
//                             style={{ background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.06)" }}>
//                             💬 "{selectedBooking.message}"
//                           </div>
//                         )}

//                         {/* Service Details Section */}
//                         {!selectedBooking.isMultiBooking && (
//                           <div className="rounded-2xl overflow-hidden"
//                             style={{ border: "1px solid rgba(192,132,252,0.2)", background: "rgba(192,132,252,0.04)" }}>
//                             <div className="px-4 py-3 flex items-center justify-between"
//                               style={{ borderBottom: "1px solid rgba(192,132,252,0.12)", background: "rgba(192,132,252,0.08)" }}>
//                               <p className="text-xs font-bold" style={{ color: "#c084fc" }}>✨ Service Details</p>
//                               {serviceDetailsLoading && (
//                                 <div className="w-4 h-4 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
//                               )}
//                             </div>

//                             {serviceDetailsLoading ? (
//                               <div className="px-4 py-6 text-center text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
//                                 Loading service info...
//                               </div>
//                             ) : serviceDetails ? (
//                               <div className="px-4 py-4 flex flex-col gap-4">
//                                 {/* Service banner image */}
//                                 {serviceDetails.img && (
//                                   <img src={serviceDetails.img} alt={serviceDetails.title}
//                                     className="w-full rounded-xl object-cover"
//                                     style={{ maxHeight: "180px" }} />
//                                 )}

//                                 {/* Title + desc */}
//                                 <div>
//                                   <div className="flex items-center gap-2 mb-1">
//                                     {serviceDetails.icon && <span className="text-lg">{serviceDetails.icon}</span>}
//                                     <h3 className="text-base font-extrabold text-white">{serviceDetails.title}</h3>
//                                     {serviceDetails.tag && (
//                                       <span className="text-xs px-2 py-0.5 rounded-full font-bold"
//                                         style={{ background: "rgba(212,175,55,0.15)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.3)" }}>
//                                         {serviceDetails.tag}
//                                       </span>
//                                     )}
//                                   </div>
//                                   {serviceDetails.subtitle && (
//                                     <p className="text-xs mb-1" style={{ color: "#c084fc" }}>{serviceDetails.subtitle}</p>
//                                   )}
//                                   {serviceDetails.desc && (
//                                     <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{serviceDetails.desc}</p>
//                                   )}
//                                 </div>

//                                 {/* Rating */}
//                                 {serviceDetails.rating && (
//                                   <div className="flex items-center gap-2">
//                                     <span className="text-yellow-400 text-sm">{"★".repeat(Math.round(serviceDetails.rating))}{"☆".repeat(5 - Math.round(serviceDetails.rating))}</span>
//                                     <span className="text-xs font-bold text-white">{serviceDetails.rating}</span>
//                                     {serviceDetails.reviews > 0 && (
//                                       <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>({serviceDetails.reviews} reviews)</span>
//                                     )}
//                                   </div>
//                                 )}

//                                 {/* Highlights */}
//                                 {serviceDetails.highlights?.length > 0 && (
//                                   <div>
//                                     <p className="text-xs font-bold mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>🌟 Highlights</p>
//                                     <div className="flex flex-wrap gap-2">
//                                       {serviceDetails.highlights.map((h, i) => (
//                                         <span key={i} className="text-xs px-2.5 py-1 rounded-full"
//                                           style={{ background: "rgba(192,132,252,0.1)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.2)" }}>
//                                           ✓ {h}
//                                         </span>
//                                       ))}
//                                     </div>
//                                   </div>
//                                 )}

//                                 {/* Styles / packages with images */}
//                                 {serviceDetails.styles?.length > 0 && (
//                                   <div>
//                                     <p className="text-xs font-bold mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>🎨 Available Packages</p>
//                                     <div className="flex flex-col gap-2">
//                                       {serviceDetails.styles.map((style, si) => {
//                                         const isBooked = style.name?.toLowerCase() === selectedBooking.package?.event?.toLowerCase()
//                                           || style.name?.toLowerCase() === selectedBooking.package?.duration?.toLowerCase();
//                                         return (
//                                           <div key={si} className="rounded-xl overflow-hidden"
//                                             style={{
//                                               border: isBooked ? "1px solid rgba(192,132,252,0.5)" : "1px solid rgba(255,255,255,0.06)",
//                                               background: isBooked ? "rgba(192,132,252,0.08)" : "rgba(255,255,255,0.03)"
//                                             }}>
//                                             {style.img && (
//                                               <img src={style.img} alt={style.name}
//                                                 className="w-full object-cover"
//                                                 style={{ maxHeight: "120px" }} />
//                                             )}
//                                             <div className="px-3 py-2.5">
//                                               <div className="flex items-center justify-between">
//                                                 <p className="text-sm font-bold text-white">{style.name}</p>
//                                                 <p className="text-sm font-extrabold" style={{ color: "#d4af37" }}>₹{style.price?.toLocaleString()}</p>
//                                               </div>
//                                               {style.desc && (
//                                                 <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{style.desc}</p>
//                                               )}
//                                               {style.specs?.length > 0 && (
//                                                 <div className="flex flex-wrap gap-1 mt-2">
//                                                   {style.specs.map((sp, spi) => (
//                                                     <span key={spi} className="text-xs px-2 py-0.5 rounded-md"
//                                                       style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>
//                                                       {sp.label}: {sp.value}
//                                                     </span>
//                                                   ))}
//                                                 </div>
//                                               )}
//                                               {isBooked && (
//                                                 <p className="text-xs mt-1.5 font-bold" style={{ color: "#c084fc" }}>✓ Your booked package</p>
//                                               )}
//                                             </div>
//                                           </div>
//                                         );
//                                       })}
//                                     </div>
//                                   </div>
//                                 )}
//                               </div>
//                             ) : (
//                               <div className="px-4 py-5 text-center">
//                                 <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
//                                   Service info not available
//                                 </p>
//                                 <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
//                                   ({selectedBooking.package?.service})
//                                 </p>
//                               </div>
//                             )}
//                           </div>
//                         )}

//                         {/* Modal Actions */}
//                         <div className="flex gap-3 pt-1">
//                           {selectedBooking.status === "confirmed" && (
//                             <button onClick={() => { handleCancel(selectedBooking._id); setSelectedBooking(null); }}
//                               className="flex-1 py-3 rounded-xl font-bold text-sm transition hover:scale-105"
//                               style={{ background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" }}>
//                               ❌ Cancel Booking
//                             </button>
//                           )}
//                           {selectedBooking.status === "cancelled" && !selectedBooking.isMultiBooking && selectedBooking.package && (
//                             <button onClick={() => { setSelectedBooking(null); navigate("/booking", {
//                               state: {
//                                 package: selectedBooking.package,
//                                 prefill: { date: selectedBooking.date, venue: selectedBooking.venue, phone: selectedBooking.phone, message: selectedBooking.message },
//                               }
//                             }); }}
//                               className="flex-1 py-3 rounded-xl font-bold text-sm transition hover:scale-105"
//                               style={{ background: "rgba(192,132,252,0.12)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.3)" }}>
//                               🔄 Rebook This Event
//                             </button>
//                           )}
//                           <button onClick={() => setSelectedBooking(null)}
//                             className="px-5 py-3 rounded-xl font-semibold text-sm transition"
//                             style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>
//                             Close
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* ── Booking Cards ── */}
//                 {(() => {
//                   const packageBookings = bookings.filter(b => !b.isCustomEvent);
//                   const customBookings  = bookings.filter(b =>  b.isCustomEvent);

//                   const BookingCard = ({ booking }) => {
//                     const price = booking.isMultiBooking
//                       ? (booking.totalAmount ? `₹${booking.totalAmount.toLocaleString()}` : "—")
//                       : (booking.package?.price ? `₹${booking.package.price.toLocaleString()}` : "—");

//                     const statusColor = {
//                       confirmed: { bg: "rgba(34,197,94,0.1)",   text: "#4ade80",  border: "rgba(34,197,94,0.25)" },
//                       pending:   { bg: "rgba(250,204,21,0.1)",  text: "#facc15",  border: "rgba(250,204,21,0.25)" },
//                       completed: { bg: "rgba(99,102,241,0.1)",  text: "#818cf8",  border: "rgba(99,102,241,0.25)" },
//                       cancelled: { bg: "rgba(239,68,68,0.1)",   text: "#f87171",  border: "rgba(239,68,68,0.25)" },
//                     }[booking.status] || {};

//                     return (
//                       <div key={booking._id}
//                         className="rounded-2xl overflow-hidden transition hover:scale-[1.01]"
//                         style={{
//                           background: "rgba(255,255,255,0.03)",
//                           border: "1px solid rgba(192,132,252,0.12)",
//                           boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
//                           borderLeft: `4px solid ${statusColor.text || "rgba(192,132,252,0.4)"}`,
//                         }}>

//                         {/* Card Top */}
//                         <div className="px-5 pt-5 pb-4">
//                           <div className="flex items-start justify-between gap-3 mb-4">
//                             <div className="flex-1 min-w-0">
//                               {booking.isCustomEvent ? (
//                                 <>
//                                   <p className="text-xs font-semibold mb-1" style={{ color: "#f472b6" }}>🎨 Custom Event</p>
//                                   <h3 className="text-base font-extrabold text-white truncate">
//                                     {booking.package?.service || "Custom Booking"}
//                                   </h3>
//                                   {booking.package?.event && (
//                                     <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
//                                       🎪 {booking.package.event}
//                                     </p>
//                                   )}
//                                 </>
//                               ) : booking.isMultiBooking ? (
//                                 <>
//                                   <p className="text-xs font-semibold mb-1" style={{ color: "#c084fc" }}>🛒 Multi-Service</p>
//                                   <h3 className="text-base font-extrabold text-white truncate">
//                                     {booking.packages?.length || 0} Services Booked
//                                   </h3>
//                                   <div className="flex flex-wrap gap-1 mt-1.5">
//                                     {(booking.packages || []).slice(0, 3).map((pkg, pi) => (
//                                       <span key={pi} className="text-xs px-2 py-0.5 rounded-full"
//                                         style={{ background: "rgba(192,132,252,0.15)", color: "#c084fc" }}>
//                                         {pkg.service}
//                                       </span>
//                                     ))}
//                                   </div>
//                                 </>
//                               ) : (
//                                 <>
//                                   <p className="text-xs font-semibold mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>
//                                     🎪 {booking.package?.event || "Event"}
//                                   </p>
//                                   <h3 className="text-base font-extrabold text-white truncate">
//                                     {booking.package?.service || "Booking"}
//                                   </h3>
//                                   {booking.package?.duration && (
//                                     <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
//                                       ⏱ {booking.package.duration}
//                                     </p>
//                                   )}
//                                 </>
//                               )}
//                             </div>
//                             <span className="text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0"
//                               style={{ background: statusColor.bg, color: statusColor.text, border: `1px solid ${statusColor.border}` }}>
//                               {statusIcons[booking.status]} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
//                             </span>
//                           </div>

//                           {/* Info row */}
//                           <div className="grid grid-cols-3 gap-2 mb-4">
//                             {[
//                               { icon: "📅", label: "Date",  value: booking.date },
//                               { icon: "📍", label: "Venue", value: booking.venue },
//                               { icon: "💰", label: "Price", value: price, gold: true },
//                             ].map((item, i) => (
//                               <div key={i} className="p-2.5 rounded-xl text-center"
//                                 style={{ background: "rgba(255,255,255,0.04)" }}>
//                                 <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>{item.icon}</p>
//                                 <p className="text-xs font-bold truncate"
//                                   style={{ color: item.gold ? "#d4af37" : "white" }}>{item.value}</p>
//                                 <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>{item.label}</p>
//                               </div>
//                             ))}
//                           </div>

//                           {/* Advance badge */}
//                           {booking.paymentType === "advance" && booking.status !== "cancelled" && (
//                             <div className="mb-3 px-3 py-2 rounded-xl text-xs flex justify-between"
//                               style={{ background: "rgba(250,204,21,0.08)", border: "1px solid rgba(250,204,21,0.15)" }}>
//                               <span style={{ color: "#facc15" }}>💳 25% Advance — ₹{booking.advanceAmount?.toLocaleString()}</span>
//                               <span style={{ color: "rgba(255,255,255,0.35)" }}>₹{booking.remainingAmount?.toLocaleString()} due</span>
//                             </div>
//                           )}

//                           {/* Timeline */}
//                           {booking.status !== "cancelled" && (
//                             <div className="mb-3 px-3 py-3 rounded-xl flex items-center justify-between gap-2"
//                               style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
//                               {/* Confirmed step */}
//                               <div className="flex flex-col items-center gap-1">
//                                 <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
//                                   style={{ background: "rgba(34,197,94,0.2)", border: "2px solid #22c55e", color: "#22c55e" }}>
//                                   ✓
//                                 </div>
//                                 <span className="text-xs font-semibold" style={{ color: "#22c55e" }}>Confirmed</span>
//                               </div>

//                               {/* Connector line */}
//                               <div className="flex-1 h-0.5 rounded-full" style={{
//                                 background: booking.status === "completed"
//                                   ? "linear-gradient(90deg, #22c55e, #a855f7)"
//                                   : "rgba(255,255,255,0.1)"
//                               }} />

//                               {/* Completed step */}
//                               <div className="flex flex-col items-center gap-1">
//                                 <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
//                                   style={booking.status === "completed"
//                                     ? { background: "rgba(168,85,247,0.2)", border: "2px solid #a855f7", color: "#a855f7" }
//                                     : { background: "rgba(255,255,255,0.05)", border: "2px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.3)" }}>
//                                   🎉
//                                 </div>
//                                 <span className="text-xs font-semibold" style={{
//                                   color: booking.status === "completed" ? "#a855f7" : "rgba(255,255,255,0.3)"
//                                 }}>Completed</span>
//                               </div>
//                             </div>
//                           )}
//                           {booking.paymentType === "advance" && booking.status === "cancelled" && (
//                             <div className="mb-3 px-3 py-2 rounded-xl text-xs"
//                               style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)", color: "#4ade80" }}>
//                               👛 ₹{booking.advanceAmount?.toLocaleString()} refunded to wallet
//                             </div>
//                           )}

//                           {/* Action Buttons */}
//                           <div className="flex items-center gap-2">
//                             {/* View Event Button */}
//                             <button onClick={() => navigate(`/dashboard/bookings/${booking._id}`)}
//                               className="flex-1 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105 flex items-center justify-center gap-1.5"
//                               style={{ background: "linear-gradient(135deg, rgba(192,132,252,0.15), rgba(244,114,182,0.15))", color: "#c084fc", border: "1px solid rgba(192,132,252,0.25)" }}>
//                               🎯 View Event
//                             </button>

//                             {booking.status === "confirmed" && (
//                               <button onClick={() => handleCancel(booking._id)}
//                                 className="px-4 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105"
//                                 style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
//                                 ❌ Cancel
//                               </button>
//                             )}
//                             {booking.status === "cancelled" && !booking.isMultiBooking && booking.package && (
//                               <button onClick={() => navigate("/booking", {
//                                 state: {
//                                   package: booking.package,
//                                   prefill: { date: booking.date, venue: booking.venue, phone: booking.phone, message: booking.message },
//                                 }
//                               })}
//                                 className="px-4 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105"
//                                 style={{ background: "rgba(192,132,252,0.1)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.2)" }}>
//                                 🔄 Rebook
//                               </button>
//                             )}
//                             {booking.status === "completed" && !reviewedBookingIds.includes(booking._id) && (
//                               <button onClick={() => setReviewBooking(booking)}
//                                 className="flex-1 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105"
//                                 style={{ background: "rgba(250,204,21,0.1)", color: "#facc15", border: "1px solid rgba(250,204,21,0.3)" }}>
//                                 ⭐ Write Review
//                               </button>
//                             )}
//                             {booking.status === "completed" && reviewedBookingIds.includes(booking._id) && (
//                               <div className="flex-1 py-2.5 rounded-xl text-sm font-bold text-center"
//                                 style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>
//                                 ✅ Reviewed
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   };

//                   return (
//                     <div className="pb-10 flex flex-col gap-8">

//                       {/* ── Package Bookings ── */}
//                       {packageBookings.length > 0 && (
//                         <div>
//                           <div className="flex items-center gap-3 mb-4">
//                             <div className="h-px flex-1" style={{ background: "rgba(192,132,252,0.15)" }} />
//                             <span className="text-xs font-extrabold px-3 py-1.5 rounded-full"
//                               style={{ background: "rgba(192,132,252,0.1)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.2)", letterSpacing: "0.08em" }}>
//                               📦 PACKAGE BOOKINGS
//                             </span>
//                             <div className="h-px flex-1" style={{ background: "rgba(192,132,252,0.15)" }} />
//                           </div>
//                           <div className="flex flex-col gap-5">
//                             {packageBookings.map(b => <BookingCard key={b._id} booking={b} />)}
//                           </div>
//                         </div>
//                       )}

//                     </div>
//                   );
//                 })()}
//               </>
//             )}
//           </div>
//         )}

//         {/* ── WALLET TAB ────────────────────────────────────── */}
//         {activeTab === "wallet" && (
//           <div className="max-w-lg pb-10">
//             {/* Balance Card */}
//             <div className="rounded-3xl p-8 mb-5 text-center"
//               style={{ background: "linear-gradient(135deg, #6d28d9, #a21caf)", boxShadow: "0 10px 40px rgba(109,40,217,0.4)" }}>
//               <p className="text-white/70 text-sm mb-2">👛 Wallet Balance</p>
//               <p className="text-5xl font-extrabold text-white mb-1">₹{walletBalance.toLocaleString()}</p>
//               <p className="text-white/50 text-xs mt-2">Use this balance for your next BookMyEvent booking</p>
//             </div>

//             {/* How it works */}
//             <div className="rounded-3xl p-6 mb-5"
//               style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(192,132,252,0.15)" }}>
//               <h3 className="text-white font-bold mb-4">ℹ️ How Wallet Works</h3>
//               <div className="flex flex-col gap-3">
//                 {[
//                   { icon: "💳", title: "Book with 25% Advance", desc: "Choose advance payment while booking to pay only 25% now." },
//                   { icon: "❌", title: "Cancel → Wallet Refund", desc: "If you cancel, your advance amount is instantly credited to wallet." },
//                   { icon: "🛒", title: "Use at Checkout", desc: "Apply wallet balance on your next booking to reduce payment." },
//                   { icon: "🔒", title: "BookMyEvent Only", desc: "Wallet balance can only be used on BookMyEvent — no withdrawals." },
//                 ].map((item, i) => (
//                   <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
//                     style={{ background: "rgba(255,255,255,0.04)" }}>
//                     <span className="text-2xl">{item.icon}</span>
//                     <div>
//                       <p className="text-white font-semibold text-sm">{item.title}</p>
//                       <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{item.desc}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {walletBalance === 0 && (
//               <div className="text-center py-4">
//                 <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
//                   No balance yet. Book with advance payment and cancel to get wallet credits!
//                 </p>
//                 <button onClick={() => navigate("/services")}
//                   className="px-6 py-3 rounded-full font-bold text-white transition hover:scale-105"
//                   style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
//                   Browse Services
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ── REQUESTS TAB ──────────────────────────────────── */}
//         {activeTab === "requests" && (
//           <RequestsTab key="requests-tab" navigate={navigate} />
//         )}

//         {/* ── PROFILE TAB ───────────────────────────────────── */}
//         {activeTab === "profile" && (
//           <div className="max-w-lg pb-10 flex flex-col gap-5">

//             {/* Profile Info Card */}
//             <div className="rounded-3xl p-6"
//               style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(192,132,252,0.15)" }}>

//               {/* Profile Image Upload */}
//               <div className="flex flex-col items-center mb-6">
//                 <div className="relative">
//                   {user?.profileImg
//                     ? <img src={user.profileImg} alt="profile"
//                         className="w-24 h-24 rounded-full object-cover"
//                         style={{ border: "3px solid #c084fc" }} />
//                     : <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-4xl"
//                         style={{ border: "3px solid #c084fc" }}>
//                         {user?.name?.charAt(0).toUpperCase()}
//                       </div>
//                   }
//                   <label htmlFor="profileImgInput"
//                     className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition"
//                     style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)", border: "2px solid #0f0a1e" }}
//                     title="Change photo">
//                     {imgUploading ? "⏳" : "📷"}
//                   </label>
//                   <input id="profileImgInput" type="file" accept="image/*" className="hidden"
//                     onChange={async (e) => {
//                       const file = e.target.files[0];
//                       if (!file) return;
//                       setImgUploading(true);
//                       try {
//                         const formData = new FormData();
//                         formData.append("image", file);
//                         const { data } = await api.post("/users/profile/image", formData, {
//                           headers: { "Content-Type": "multipart/form-data" },
//                         });
//                         updateUser({ profileImg: data.profileImg });
//                       } catch (err) {
//                         alert("Image upload failed. Try again.");
//                       } finally {
//                         setImgUploading(false);
//                         e.target.value = "";
//                       }
//                     }} />
//                 </div>
//                 <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>
//                   {imgUploading ? "Uploading..." : "Click 📷 to change photo"}
//                 </p>
//               </div>
//               <div className="flex items-center justify-between mb-5">
//                 <h2 className="text-lg font-extrabold text-white">👤 Personal Information</h2>
//                 {!isEditingProfile && (
//                   <button onClick={() => { setIsEditingProfile(true); setProfileMsg({ type: "", text: "" }); }}
//                     className="text-xs font-bold px-3 py-1.5 rounded-full transition hover:scale-105"
//                     style={{ background: "rgba(192,132,252,0.1)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.3)" }}>
//                     ✏️ Edit
//                   </button>
//                 )}
//               </div>

//               {profileMsg.text && (
//                 <div className={`px-4 py-2.5 rounded-xl mb-4 text-sm text-center ${profileMsg.type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
//                   {profileMsg.text}
//                 </div>
//               )}

//               {!isEditingProfile ? (
//                 <div className="flex flex-col gap-3">
//                   {[
//                     { label: "Full Name",    value: user.name,  icon: "👤" },
//                     { label: "Email Address",value: user.email, icon: "📧" },
//                     { label: "Phone Number", value: user.phone, icon: "📞" },
//                   ].map((item, i) => (
//                     <div key={i} className="p-4 rounded-2xl"
//                       style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
//                       <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>{item.icon} {item.label}</p>
//                       <p className="text-white font-semibold">{item.value || "—"}</p>
//                     </div>
//                   ))}
//                   <div className="grid grid-cols-1 gap-3 mt-1">
//                     <div className="p-4 rounded-2xl text-center"
//                       style={{ background: "rgba(192,132,252,0.08)", border: "1px solid rgba(192,132,252,0.2)" }}>
//                       <p className="text-2xl font-bold" style={{ color: "#c084fc" }}>{bookings.length}</p>
//                       <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Total Bookings</p>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex flex-col gap-4">
//                   <div>
//                     <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(255,255,255,0.5)" }}>Full Name</label>
//                     <input value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
//                       placeholder="Your full name"
//                       className="w-full px-4 py-3 rounded-xl text-white outline-none text-sm"
//                       style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(192,132,252,0.3)" }} />
//                   </div>
//                   <div>
//                     <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(255,255,255,0.5)" }}>📧 Email Address</label>
//                     <input value={user.email} disabled
//                       className="w-full px-4 py-3 rounded-xl text-sm cursor-not-allowed"
//                       style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)" }} />
//                     <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>Email cannot be changed</p>
//                   </div>
//                   <div>
//                     <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(255,255,255,0.5)" }}>📞 Phone Number</label>
//                     <input value={profileData.phone}
//                       onChange={(e) => setProfileData({ ...profileData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
//                       placeholder="10-digit phone number"
//                       className="w-full px-4 py-3 rounded-xl text-white outline-none text-sm"
//                       style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(192,132,252,0.3)" }} />
//                   </div>
//                   <div className="flex gap-3 mt-1">
//                     <button onClick={() => { setIsEditingProfile(false); setProfileMsg({ type: "", text: "" }); setProfileData({ name: user.name || "", phone: user.phone || "" }); }}
//                       className="flex-1 py-3 rounded-xl font-bold text-sm transition"
//                       style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
//                       Cancel
//                     </button>
//                     <button onClick={handleProfileSave} disabled={profileLoading}
//                       className="flex-1 py-3 rounded-xl font-bold text-white text-sm transition hover:opacity-90 disabled:opacity-60"
//                       style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
//                       {profileLoading ? "Saving..." : "Save Changes ✓"}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Change Password Card */}
//             <div className="rounded-3xl p-6"
//               style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(192,132,252,0.15)" }}>
//               <div className="flex items-center justify-between mb-5">
//                 <h2 className="text-lg font-extrabold text-white">🔒 Password & Security</h2>
//                 {!isChangingPassword && (
//                   <button onClick={() => { setIsChangingPassword(true); setPassMsg({ type: "", text: "" }); }}
//                     className="text-xs font-bold px-3 py-1.5 rounded-full transition hover:scale-105"
//                     style={{ background: "rgba(192,132,252,0.1)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.3)" }}>
//                     🔑 Change
//                   </button>
//                 )}
//               </div>

//               {passMsg.text && (
//                 <div className={`px-4 py-2.5 rounded-xl mb-4 text-sm text-center ${passMsg.type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
//                   {passMsg.text}
//                 </div>
//               )}

//               {!isChangingPassword ? (
//                 <div className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
//                   <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>🔑 Password</p>
//                   <p className="text-white font-semibold tracking-widest">••••••••</p>
//                   <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>Last updated: Not tracked</p>
//                 </div>
//               ) : (
//                 <div className="flex flex-col gap-4">
//                   {[
//                     { label: "Current Password", key: "currentPassword", show: showCurrentPass, setShow: setShowCurrentPass },
//                     { label: "New Password",      key: "newPassword",     show: showNewPass,     setShow: setShowNewPass },
//                     { label: "Confirm New Password", key: "confirmNewPassword", show: showConfirmPass, setShow: setShowConfirmPass },
//                   ].map(({ label, key, show, setShow }) => (
//                     <div key={key}>
//                       <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</label>
//                       <div className="relative">
//                         <input type={show ? "text" : "password"} value={passData[key]}
//                           onChange={(e) => setPassData({ ...passData, [key]: e.target.value })}
//                           placeholder={label}
//                           className="w-full px-4 py-3 pr-10 rounded-xl text-white outline-none text-sm"
//                           style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(192,132,252,0.3)" }} />
//                         <button type="button" onClick={() => setShow(!show)}
//                           className="absolute right-3 top-1/2 -translate-y-1/2 transition"
//                           style={{ color: "rgba(255,255,255,0.3)" }} tabIndex={-1}>
//                           <EyeIcon show={show} />
//                         </button>
//                       </div>
//                       {key === "confirmNewPassword" && passData.confirmNewPassword && (
//                         <p className={`text-xs mt-1 ${passData.newPassword === passData.confirmNewPassword ? "text-green-400" : "text-red-400"}`}>
//                           {passData.newPassword === passData.confirmNewPassword ? "✓ Passwords match" : "✗ Don't match"}
//                         </p>
//                       )}
//                     </div>
//                   ))}
//                   <div className="flex gap-3 mt-1">
//                     <button onClick={() => { setIsChangingPassword(false); setPassMsg({ type: "", text: "" }); setPassData({ currentPassword: "", newPassword: "", confirmNewPassword: "" }); }}
//                       className="flex-1 py-3 rounded-xl font-bold text-sm transition"
//                       style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
//                       Cancel
//                     </button>
//                     <button onClick={handlePasswordChange} disabled={passLoading}
//                       className="flex-1 py-3 rounded-xl font-bold text-white text-sm transition hover:opacity-90 disabled:opacity-60"
//                       style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
//                       {passLoading ? "Updating..." : "Update Password"}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Logout */}
//             <button onClick={handleLogout}
//               className="w-full py-3 rounded-xl font-bold transition hover:scale-105"
//               style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
//               Logout 🚪
//             </button>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default CustomerDashboard;







import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const statusStyles = {
  pending:   "bg-yellow-100 text-yellow-600",
  confirmed: "bg-green-100 text-green-600",
  cancelled: "bg-red-100 text-red-600",
};
const statusIcons = { pending: "⏳", confirmed: "✅", completed: "🎉", cancelled: "❌" };

const paymentTypeLabel = (b) => {
  if (b.paymentType === "advance") return "25% Advance Paid";
  return "Full Payment";
};

const EyeIcon = ({ show }) =>
  show ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

// ── Requests Tab Component ─────────────────────────────────
const statusColors = {
  pending:   { bg: "rgba(234,179,8,0.1)",   text: "#facc15", border: "rgba(234,179,8,0.3)" },
  reviewing: { bg: "rgba(59,130,246,0.1)",  text: "#60a5fa", border: "rgba(59,130,246,0.3)" },
  quoted:    { bg: "rgba(167,139,250,0.1)", text: "#a78bfa", border: "rgba(167,139,250,0.3)" },
  accepted:  { bg: "rgba(251,146,60,0.1)",  text: "#fb923c", border: "rgba(251,146,60,0.3)" },
  confirmed: { bg: "rgba(34,197,94,0.1)",   text: "#4ade80", border: "rgba(34,197,94,0.3)" },
  completed: { bg: "rgba(20,184,166,0.1)",  text: "#2dd4bf", border: "rgba(20,184,166,0.3)" },
  rejected:  { bg: "rgba(239,68,68,0.1)",   text: "#f87171", border: "rgba(239,68,68,0.3)" },
  cancelled: { bg: "rgba(107,114,128,0.1)", text: "#9ca3af", border: "rgba(107,114,128,0.3)" },
};
const statusIcons2 = { pending: "⏳", reviewing: "👀", quoted: "💰", accepted: "🤝", confirmed: "✅", completed: "🎊", rejected: "❌", cancelled: "🚫" };

const STEPS = ["Submitted", "Reviewing", "Quoted", "Accepted", "Confirmed", "Completed"];
const stepStatus = { pending: 0, reviewing: 1, quoted: 2, accepted: 3, confirmed: 4, completed: 5 };

const StatusStepper = ({ status }) => {
  if (["rejected", "cancelled"].includes(status)) return null;
  const activeStep = stepStatus[status] ?? 0;
  return (
    <div className="flex items-center mb-5">
      {STEPS.map((step, i) => {
        const done = i < activeStep;
        const active = i === activeStep;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{
                  background: done ? "#a78bfa" : active ? "linear-gradient(135deg,#c084fc,#f472b6)" : "rgba(255,255,255,0.07)",
                  color: done || active ? "#fff" : "rgba(255,255,255,0.3)",
                  boxShadow: active ? "0 0 10px rgba(192,132,252,0.5)" : "none",
                  border: done || active ? "none" : "1px solid rgba(255,255,255,0.1)",
                }}>
                {done ? "✓" : i + 1}
              </div>
              <p className="text-xs mt-1 font-medium"
                style={{ color: active ? "#c084fc" : done ? "#a78bfa" : "rgba(255,255,255,0.25)", whiteSpace: "nowrap" }}>
                {step}
              </p>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mx-1 mb-4 rounded"
                style={{ background: i < activeStep ? "#a78bfa" : "rgba(255,255,255,0.08)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
};

const RequestsTab = ({ navigate }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelMsg, setCancelMsg] = useState("");
  const [respondingId, setRespondingId] = useState(null);

  useEffect(() => {
    api.get("/users/custom-requests/my")
      .then(res => setRequests(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this custom request?")) return;
    try {
      await api.delete(`/users/custom-requests/${id}`);
      setRequests(prev => prev.map(r => r._id === id ? { ...r, status: "cancelled" } : r));
      setCancelMsg("✅ Request cancelled successfully!");
      setTimeout(() => setCancelMsg(""), 4000);
    } catch { alert("Failed to cancel. Please try again."); }
  };

  const handleRespond = async (id, response) => {
    const confirmMsg = response === "accepted"
      ? "Accept this quote and confirm the event?"
      : "Decline this quote?";
    if (!window.confirm(confirmMsg)) return;
    setRespondingId(id);
    try {
      const res = await api.put(`/users/custom-requests/${id}/respond`, { response });
      setRequests(prev => prev.map(r => r._id === id ? { ...r, status: res.data.request.status } : r));
      setCancelMsg(response === "accepted" ? "🤝 Quote accepted! Waiting for advance confirmation." : "Quote declined.");
      setTimeout(() => setCancelMsg(""), 5000);
    } catch { alert("Failed. Please try again."); }
    finally { setRespondingId(null); }
  };

  return (
    <div className="pb-10">

      {cancelMsg && (
        <div className="mb-4 px-4 py-3 rounded-xl text-sm font-semibold text-center"
          style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80" }}>
          {cancelMsg}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">✨ My Custom Requests</h2>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Track all your custom event requests here</p>
        </div>
        <button onClick={() => navigate("/custom-request")}
          className="px-4 py-2 rounded-full text-sm font-bold transition hover:scale-105"
          style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)", color: "#fff" }}>
          + New Request
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mb-4"></div>
          <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading your requests...</p>
        </div>
      )}

      {!loading && requests.length === 0 && (
        <div className="text-center py-16 rounded-3xl"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(192,132,252,0.1)" }}>
          <p className="text-5xl mb-4">📭</p>
          <p className="text-white text-lg font-bold mb-2">No custom requests yet!</p>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>Have a unique event idea? Let us know!</p>
          <button onClick={() => navigate("/custom-request")}
            className="px-6 py-3 rounded-full font-bold text-white transition hover:scale-105"
            style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
            ✨ Submit Custom Request
          </button>
        </div>
      )}

      {!loading && requests.length > 0 && (
        <div className="flex flex-col gap-4">
          {requests.map((req) => {
            const sc = statusColors[req.status] || statusColors.pending;
            const isConfirmed  = req.status === "confirmed";
            const isAccepted   = req.status === "accepted";
            const isCompleted  = req.status === "completed";
            const isRejected   = req.status === "rejected";
            const isCancelled  = req.status === "cancelled";
            const isQuoted     = req.status === "quoted";
            const isResponding = respondingId === req._id;
            return (
              <div key={req._id} className="rounded-2xl p-6 transition hover:scale-[1.01]"
                style={{
                  background: isCompleted
                    ? "rgba(20,184,166,0.06)"
                    : isConfirmed
                    ? "rgba(34,197,94,0.06)"
                    : isAccepted
                    ? "rgba(251,146,60,0.06)"
                    : isQuoted
                    ? "rgba(167,139,250,0.06)"
                    : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isCompleted ? "rgba(20,184,166,0.3)" : isConfirmed ? "rgba(34,197,94,0.3)" : isAccepted ? "rgba(251,146,60,0.3)" : isQuoted ? "rgba(167,139,250,0.3)" : "rgba(192,132,252,0.12)"}`,
                }}>

                {/* ── Status Stepper ── */}
                <StatusStepper status={req.status} />

                {/* ── Rejected / Cancelled Banner ── */}
                {isRejected && (
                  <div className="mb-4 px-4 py-3 rounded-xl text-sm font-bold text-center"
                    style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
                    ❌ You declined this quote. Feel free to submit a new request!
                  </div>
                )}
                {isCancelled && (
                  <div className="mb-4 px-4 py-3 rounded-xl text-sm font-bold text-center"
                    style={{ background: "rgba(107,114,128,0.12)", border: "1px solid rgba(107,114,128,0.3)", color: "#9ca3af" }}>
                    🚫 This request was cancelled.
                  </div>
                )}

                {/* ── Accepted: Book Now Button ── */}
                {isAccepted && (
                  <div className="mb-4 p-4 rounded-xl"
                    style={{ background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.3)" }}>
                    <p className="text-sm font-semibold mb-1" style={{ color: "#fb923c" }}>
                      🎉 Quote Accepted! Complete your booking to confirm the event.
                    </p>
                    <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
                      Pay full or 25% advance via Razorpay to lock in your slot.
                    </p>
                    <button
                      onClick={() => navigate("/booking", {
                        state: {
                          package: {
                            name:    `Custom Event — ${req.eventCategory}`,
                            service: req.eventCategory,
                            event:   req.eventCategory,
                            price:   req.quotedPrice,
                            isCustomRequest: true,
                          },
                          customRequest: req,
                        },
                      })}
                      className="w-full py-3 rounded-xl text-sm font-bold transition hover:scale-105"
                      style={{ background: "linear-gradient(135deg,#fb923c,#f97316)", color: "#fff", boxShadow: "0 4px 15px rgba(251,146,60,0.3)" }}>
                      🚀 Book Now — ₹{req.quotedPrice?.toLocaleString()}
                    </button>
                  </div>
                )}

                {/* ── Confirmed Banner (advance received, event locked in) ── */}
                {isConfirmed && (
                  <div className="mb-4 px-4 py-3 rounded-xl text-sm font-bold text-center"
                    style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.4)", color: "#4ade80" }}>
                    ✅ Advance received! Your event is confirmed. We'll be in touch for final details.
                  </div>
                )}

                {/* ── Completed Banner ── */}
                {isCompleted && (
                  <div className="mb-4 px-4 py-3 rounded-xl text-sm font-bold text-center"
                    style={{ background: "rgba(20,184,166,0.15)", border: "1px solid rgba(20,184,166,0.4)", color: "#2dd4bf" }}>
                    🎊 Event completed! Thank you for trusting us. We hope it was amazing!
                  </div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{req.eventCategory}</h3>
                    <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                      📅 {req.date}{req.time ? ` at ${req.time}` : ""} &nbsp;|&nbsp; 👥 {req.guestCount || "—"} guests
                    </p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
                    {statusIcons2[req.status] || "⏳"} {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  {[
                    { icon: "📍", label: "Venue", value: req.venue || "—" },
                    { icon: "📞", label: "Phone", value: req.phone || "—" },
                    { icon: "👥", label: "Guests", value: req.guestCount ? `${req.guestCount} people` : "—" },
                    { icon: "🗓️", label: "Submitted", value: new Date(req.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) },
                  ].map((item, i) => (
                    <div key={i} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>{item.icon} {item.label}</p>
                      <p className="text-white font-medium truncate">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Quoted Price */}
                {req.quotedPrice > 0 && (
                  <div className="mb-4 px-4 py-3 rounded-xl flex items-center justify-between"
                    style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)" }}>
                    <span className="text-sm font-semibold" style={{ color: "#a78bfa" }}>💎 Quoted Price</span>
                    <span className="text-lg font-bold" style={{ color: "#a78bfa" }}>₹{req.quotedPrice.toLocaleString()}</span>
                  </div>
                )}

                {/* ── Quote Accept / Decline (only when status = quoted) ── */}
                {isQuoted && (
                  <div className="mb-4 p-4 rounded-xl"
                    style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)" }}>
                    <p className="text-sm font-semibold mb-3" style={{ color: "#c084fc" }}>
                      🎯 Admin has sent you a quote! Would you like to proceed?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleRespond(req._id, "accepted")}
                        disabled={isResponding}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105 disabled:opacity-60"
                        style={{ background: "linear-gradient(135deg,#4ade80,#22c55e)", color: "#fff" }}>
                        {isResponding ? "..." : "✅ Accept Quote"}
                      </button>
                      <button
                        onClick={() => handleRespond(req._id, "declined")}
                        disabled={isResponding}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105 disabled:opacity-60"
                        style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
                        {isResponding ? "..." : "❌ Decline"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Services */}
                {req.services?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {req.services.map((sv) => (
                      <span key={sv} className="px-2 py-0.5 rounded text-xs"
                        style={{ background: "rgba(192,132,252,0.08)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.2)" }}>
                        {sv}
                      </span>
                    ))}
                  </div>
                )}

                {req.notes && (
                  <p className="text-xs mb-4 p-3 rounded-xl italic"
                    style={{ background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.4)" }}>
                    💬 {req.notes}
                  </p>
                )}

                {req.referenceImages?.length > 0 && (
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {req.referenceImages.map((img, i) => (
                      <img key={i} src={img} alt="ref"
                        className="w-16 h-16 rounded-xl object-cover"
                        style={{ border: "1px solid rgba(192,132,252,0.2)" }} />
                    ))}
                  </div>
                )}

                {req.adminNote && (
                  <div className="mb-4 px-3 py-2 rounded-xl text-xs"
                    style={{ background: "rgba(192,132,252,0.08)", border: "1px solid rgba(192,132,252,0.2)", color: "#c084fc" }}>
                    📝 Admin Note: {req.adminNote}
                  </div>
                )}

                <div className="flex gap-2 mt-1">
                  <button onClick={() => navigate(`/dashboard/requests/${req._id}`, { state: { request: req } })}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105 flex items-center justify-center gap-1.5"
                    style={{ background: "linear-gradient(135deg, rgba(192,132,252,0.15), rgba(244,114,182,0.15))", color: "#c084fc", border: "1px solid rgba(192,132,252,0.25)" }}>
                    👁️ View Details
                  </button>
                  {["pending", "reviewing"].includes(req.status) && (
                    <button onClick={() => handleCancel(req._id)}
                      className="px-4 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105"
                      style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                      ❌ Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { tab } = useParams();
  const activeTab = tab || "bookings";
  const location = useLocation();

  // Scroll to top whenever tab changes via navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab, location.pathname]);

  const { user, logout, login, updateUser } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [serviceDetailsLoading, setServiceDetailsLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [cancelMsg, setCancelMsg] = useState("");
  const [imgUploading, setImgUploading] = useState(false);

  // Review states
  const [reviewBooking, setReviewBooking] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMsg, setReviewMsg] = useState("");
  const [reviewedBookingIds, setReviewedBookingIds] = useState([]);

  // Profile edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ name: "", phone: "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });

  // Password change states
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passData, setPassData] = useState({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState({ type: "", text: "" });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  useEffect(() => { if (!user) navigate("/login"); }, [user, navigate]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const [bookingsRes, reviewsRes] = await Promise.all([
          api.get("/users/bookings/my"),
          api.get("/users/reviews/my"),
        ]);
        setBookings(bookingsRes.data);
        setReviewedBookingIds(reviewsRes.data.reviewedBookingIds || []);
      } catch (err) {
        console.error("Bookings fetch error:", err?.response?.status, err?.response?.data || err?.message);
        setError("Failed to load bookings. Please try again.");
      }
      finally { setLoading(false); }
    };
    if (user) {
      fetchBookings();
      setProfileData({ name: user.name || "", phone: user.phone || "" });
      api.get("/users/wallet")
        .then(res => setWalletBalance(res.data.walletBalance || 0))
        .catch(() => {});
    }
  }, [user]);

  const handleCancel = async (id) => {
    const booking = bookings.find(b => b._id === id);
    const isAdvance = booking?.paymentType === "advance";
    const advanceAmt = booking?.advanceAmount || 0;
    const fullAmt = booking?.totalAmount || booking?.package?.price || 0;
    const confirmMsg = isAdvance
      ? `Cancel this booking? ₹${advanceAmt.toLocaleString()} advance will be refunded to your wallet.`
      : `Cancel this booking? ₹${fullAmt.toLocaleString()} will be refunded to your wallet.`;
    if (!window.confirm(confirmMsg)) return;
    try {
      const res = await api.delete(`/users/bookings/${id}`);
      setBookings(prev =>
        prev.map(b => b._id === id ? { ...b, status: "cancelled" } : b)
      );
      if (selectedBooking?._id === id) setSelectedBooking(prev => ({ ...prev, status: "cancelled" }));
      if (res.data.refunded && res.data.refundAmount > 0) {
        setWalletBalance(prev => prev + res.data.refundAmount);
        setCancelMsg(`✅ Booking cancelled! ₹${res.data.refundAmount.toLocaleString()} refunded to your wallet.`);
        setTimeout(() => setCancelMsg(""), 5000);
      } else {
        setCancelMsg("✅ Booking cancelled successfully.");
        setTimeout(() => setCancelMsg(""), 4000);
      }
    } catch { alert("Failed to cancel booking. Please try again."); }
  };

  const handleLogout = () => { logout(); navigate("/"); };

  const handleSubmitReview = async () => {
    if (!reviewRating) return;
    try {
      setReviewLoading(true);
      await api.post("/users/reviews", {
        serviceName: reviewBooking.isMultiBooking
          ? (reviewBooking.packages?.[0]?.service || "")
          : (reviewBooking.package?.service || ""),
        bookingId: reviewBooking._id,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewMsg("✅ Review submitted! Thank you.");
      setReviewedBookingIds(prev => [...prev, reviewBooking._id]);
      setTimeout(() => {
        setReviewBooking(null);
        setReviewRating(0);
        setReviewComment("");
        setReviewMsg("");
      }, 2000);
    } catch (err) {
      setReviewMsg(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setReviewLoading(false);
    }
  };

  // Profile save
  const handleProfileSave = async () => {
    setProfileMsg({ type: "", text: "" });
    if (!profileData.name.trim()) { setProfileMsg({ type: "error", text: "Name cannot be empty." }); return; }
    const phone = profileData.phone.replace(/\D/g, "");
    if (phone.length !== 10) { setProfileMsg({ type: "error", text: "Please enter a valid 10-digit phone number." }); return; }
    try {
      setProfileLoading(true);
      const res = await api.put("/users/profile", { name: profileData.name.trim(), phone });
      // Update auth context with new data
      login({ ...user, name: res.data.name, phone: res.data.phone });
      setProfileMsg({ type: "success", text: "Profile updated successfully! ✅" });
      setIsEditingProfile(false);
    } catch (err) {
      setProfileMsg({ type: "error", text: err.response?.data?.message || "Failed to update profile." });
    } finally { setProfileLoading(false); }
  };

  const handlePasswordChange = async () => {
    setPassMsg({ type: "", text: "" });
    if (!passData.currentPassword || !passData.newPassword || !passData.confirmNewPassword) {
      setPassMsg({ type: "error", text: "Please fill in all fields." }); return;
    }
    if (passData.newPassword.length < 6) { setPassMsg({ type: "error", text: "New password must be at least 6 characters." }); return; }
    if (passData.newPassword !== passData.confirmNewPassword) { setPassMsg({ type: "error", text: "New passwords do not match." }); return; }
    if (passData.currentPassword === passData.newPassword) { setPassMsg({ type: "error", text: "New password must be different from current password." }); return; }
    try {
      setPassLoading(true);
      await api.put("/users/change-password", { currentPassword: passData.currentPassword, newPassword: passData.newPassword });
      setPassMsg({ type: "success", text: "Password changed successfully! ✅" });
      setPassData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      setIsChangingPassword(false);
    } catch (err) {
      setPassMsg({ type: "error", text: err.response?.data?.message || "Failed to change password." });
    } finally { setPassLoading(false); }
  };

  if (!user) return null;

  const packageBookingsAll = bookings.filter(b => !b.isCustomEvent);
  const confirmed  = packageBookingsAll.filter(b => b.status === "confirmed").length;
  const pending    = packageBookingsAll.filter(b => b.status === "pending").length;
  const cancelled  = packageBookingsAll.filter(b => b.status === "cancelled").length;

  return (
    <div className="min-h-screen" style={{ background: "#0f0a1e" }}>

      {/* Header */}
      <div className="py-10 px-6"
        style={{ background: "linear-gradient(135deg, #1a0533 0%, #0f0a1e 100%)", borderBottom: "1px solid rgba(192,132,252,0.15)" }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="font-extrabold text-2xl w-14 h-14 rounded-full flex items-center justify-center text-white"
              style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Welcome, {user.name}! 👋</h1>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="px-4 py-2 rounded-full text-sm font-bold transition hover:scale-105"
            style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
            Logout 🚪
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-6 mt-6">
        <div className="flex gap-4 mb-8" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          {[
            { key: "bookings", label: "📦 Package Booking" },
            { key: "requests", label: "🎨 My Custom Booking" },
            { key: "wallet",   label: "👛 Wallet" },
            { key: "profile",  label: "👤 My Profile" },
          ].map(tab => (
            <button key={tab.key} onClick={() => navigate(`/dashboard/${tab.key}`)}
              className="pb-3 font-semibold text-sm transition border-b-2 whitespace-nowrap"
              style={{
                borderColor: activeTab === tab.key ? "#c084fc" : "transparent",
                color: activeTab === tab.key ? "#c084fc" : "rgba(255,255,255,0.4)",
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── BOOKINGS TAB ───────────────────────────────────── */}
        {activeTab === "bookings" && (
          <div>
            {cancelMsg && (
              <div className="mb-4 px-4 py-3 rounded-xl text-sm font-semibold text-center"
                style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80" }}>
                {cancelMsg}
              </div>
            )}


            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin mb-4"></div>
                <p style={{ color: "rgba(255,255,255,0.4)" }}>Loading your bookings...</p>
              </div>
            )}
            {error && !loading && (
              <div className="text-center py-10 px-4 rounded-2xl" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <p className="text-red-400">{error}</p>
              </div>
            )}
            {!loading && !error && packageBookingsAll.length === 0 && (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">📭</p>
                <p className="text-white text-lg font-bold mb-2">No bookings yet!</p>
                <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>Start by exploring our services</p>
                <button onClick={() => navigate("/services")}
                  className="px-6 py-3 rounded-full font-bold text-white transition hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
                  Browse Services
                </button>
              </div>
            )}
            {!loading && !error && packageBookingsAll.length > 0 && (
              <>
                {/* ── Review Modal ── */}
                {reviewBooking && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
                    onClick={() => setReviewBooking(null)}>
                    <div className="w-full max-w-md rounded-3xl p-6"
                      style={{ background: "linear-gradient(160deg, #1e1b3a, #16132b)", border: "1px solid rgba(192,132,252,0.25)" }}
                      onClick={e => e.stopPropagation()}>
                      <h2 className="text-xl font-extrabold text-white mb-1">⭐ Write a Review</h2>
                      <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>
                        {reviewBooking.package?.service}
                      </p>
                      <div className="flex gap-2 mb-5">
                        {[1,2,3,4,5].map(star => (
                          <button key={star} onClick={() => setReviewRating(star)}>
                            <span className="text-3xl" style={{ color: star <= reviewRating ? "#facc15" : "rgba(255,255,255,0.15)" }}>★</span>
                          </button>
                        ))}
                      </div>
                      <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)}
                        placeholder="Share your experience..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl text-white outline-none text-sm resize-none mb-4"
                        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(192,132,252,0.3)" }} />
                      {reviewMsg && (
                        <p className="text-sm text-center mb-3"
                          style={{ color: reviewMsg.includes("✅") ? "#4ade80" : "#f87171" }}>
                          {reviewMsg}
                        </p>
                      )}
                      <div className="flex gap-3">
                        <button onClick={() => { setReviewBooking(null); setReviewRating(0); setReviewComment(""); setReviewMsg(""); }}
                          className="flex-1 py-3 rounded-xl font-bold text-sm"
                          style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>
                          Cancel
                        </button>
                        <button onClick={handleSubmitReview} disabled={reviewLoading || !reviewRating}
                          className="flex-1 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-60"
                          style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
                          {reviewLoading ? "Submitting..." : "Submit ✓"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Booking Event Detail Modal ── */}
                {selectedBooking && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
                    onClick={() => setSelectedBooking(null)}>
                    <div className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
                      style={{ background: "linear-gradient(160deg, #1e1b3a, #16132b)", border: "1px solid rgba(192,132,252,0.25)", maxHeight: "90vh", overflowY: "auto" }}
                      onClick={(e) => e.stopPropagation()}>

                      {/* Modal Header */}
                      <div className="px-6 py-5 flex items-start justify-between"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(192,132,252,0.08)" }}>
                        <div>
                          <p className="text-xs font-semibold mb-1" style={{ color: "#c084fc" }}>🎯 Event Details</p>
                          <h2 className="text-xl font-extrabold text-white">
                            {selectedBooking.isMultiBooking
                              ? `Multi-Service Booking`
                              : selectedBooking.package?.service || "Booking"}
                          </h2>
                          {!selectedBooking.isMultiBooking && (
                            <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                              {selectedBooking.package?.event}
                              {selectedBooking.package?.duration ? ` — ${selectedBooking.package.duration}` : ""}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusStyles[selectedBooking.status]}`}>
                            {statusIcons[selectedBooking.status]} {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                          </span>
                          <button onClick={() => setSelectedBooking(null)}
                            className="text-xs px-2 py-1 rounded-lg transition"
                            style={{ color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)" }}>
                            ✕ Close
                          </button>
                        </div>
                      </div>

                      <div className="px-6 py-5 flex flex-col gap-4">

                        {/* Multi-booking packages list */}
                        {selectedBooking.isMultiBooking && (
                          <div className="rounded-2xl p-4" style={{ background: "rgba(192,132,252,0.07)", border: "1px solid rgba(192,132,252,0.15)" }}>
                            <p className="text-xs font-bold mb-3" style={{ color: "#c084fc" }}>🛒 Services Booked</p>
                            <div className="flex flex-col gap-2">
                              {(selectedBooking.packages || []).map((pkg, i) => (
                                <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl"
                                  style={{ background: "rgba(255,255,255,0.04)" }}>
                                  <div>
                                    <p className="text-sm font-semibold text-white">{pkg.service}</p>
                                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{pkg.event}{pkg.duration ? ` — ${pkg.duration}` : ""}</p>
                                  </div>
                                  <p className="text-sm font-bold" style={{ color: "#d4af37" }}>₹{pkg.price?.toLocaleString()}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Event Info Grid */}
                        <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                          <p className="text-xs font-bold mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>📋 Event Info</p>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { icon: "📅", label: "Event Date", value: selectedBooking.date },
                              { icon: "📍", label: "Venue", value: selectedBooking.venue },
                              { icon: "📞", label: "Phone", value: selectedBooking.phone },
                              { icon: "✉️", label: "Email", value: selectedBooking.email },
                              { icon: "👤", label: "Booked By", value: selectedBooking.name },
                              { icon: "🗓️", label: "Booked On", value: new Date(selectedBooking.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) },
                            ].map((item, i) => (
                              <div key={i} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                                <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>{item.icon} {item.label}</p>
                                <p className="text-sm text-white font-semibold truncate">{item.value || "—"}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Payment Info */}
                        <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                          <p className="text-xs font-bold mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>💳 Payment Info</p>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { icon: "💰", label: "Total Amount", value: selectedBooking.isMultiBooking
                                  ? (selectedBooking.totalAmount ? `₹${selectedBooking.totalAmount.toLocaleString()}` : "—")
                                  : (selectedBooking.package?.price ? `₹${selectedBooking.package.price.toLocaleString()}` : "—"),
                                highlight: true },
                              { icon: "🧾", label: "Payment Mode", value: paymentTypeLabel(selectedBooking) },
                              { icon: "⬆️", label: "Advance Paid", value: selectedBooking.advanceAmount > 0 ? `₹${selectedBooking.advanceAmount.toLocaleString()}` : "—" },
                              { icon: "⏳", label: "Remaining Due", value: selectedBooking.remainingAmount > 0 ? `₹${selectedBooking.remainingAmount.toLocaleString()}` : "—" },
                              { icon: "👛", label: "Wallet Used", value: selectedBooking.walletUsed > 0 ? `₹${selectedBooking.walletUsed.toLocaleString()}` : "—" },
                              { icon: "🔑", label: "Booking ID", value: selectedBooking._id?.slice(-8).toUpperCase() },
                            ].map((item, i) => (
                              <div key={i} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
                                <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>{item.icon} {item.label}</p>
                                <p className="text-sm font-bold truncate"
                                  style={{ color: item.highlight ? "#d4af37" : "white" }}>{item.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Message */}
                        {selectedBooking.message && (
                          <div className="px-4 py-3 rounded-2xl italic text-sm"
                            style={{ background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.06)" }}>
                            💬 "{selectedBooking.message}"
                          </div>
                        )}

                        {/* Service Details Section */}
                        {!selectedBooking.isMultiBooking && (
                          <div className="rounded-2xl overflow-hidden"
                            style={{ border: "1px solid rgba(192,132,252,0.2)", background: "rgba(192,132,252,0.04)" }}>
                            <div className="px-4 py-3 flex items-center justify-between"
                              style={{ borderBottom: "1px solid rgba(192,132,252,0.12)", background: "rgba(192,132,252,0.08)" }}>
                              <p className="text-xs font-bold" style={{ color: "#c084fc" }}>✨ Service Details</p>
                              {serviceDetailsLoading && (
                                <div className="w-4 h-4 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
                              )}
                            </div>

                            {serviceDetailsLoading ? (
                              <div className="px-4 py-6 text-center text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                                Loading service info...
                              </div>
                            ) : serviceDetails ? (
                              <div className="px-4 py-4 flex flex-col gap-4">
                                {/* Service banner image */}
                                {serviceDetails.img && (
                                  <img src={serviceDetails.img} alt={serviceDetails.title}
                                    className="w-full rounded-xl object-cover"
                                    style={{ maxHeight: "180px" }} />
                                )}

                                {/* Title + desc */}
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    {serviceDetails.icon && <span className="text-lg">{serviceDetails.icon}</span>}
                                    <h3 className="text-base font-extrabold text-white">{serviceDetails.title}</h3>
                                    {serviceDetails.tag && (
                                      <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                                        style={{ background: "rgba(212,175,55,0.15)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.3)" }}>
                                        {serviceDetails.tag}
                                      </span>
                                    )}
                                  </div>
                                  {serviceDetails.subtitle && (
                                    <p className="text-xs mb-1" style={{ color: "#c084fc" }}>{serviceDetails.subtitle}</p>
                                  )}
                                  {serviceDetails.desc && (
                                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{serviceDetails.desc}</p>
                                  )}
                                </div>

                                {/* Rating */}
                                {serviceDetails.rating && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-yellow-400 text-sm">{"★".repeat(Math.round(serviceDetails.rating))}{"☆".repeat(5 - Math.round(serviceDetails.rating))}</span>
                                    <span className="text-xs font-bold text-white">{serviceDetails.rating}</span>
                                    {serviceDetails.reviews > 0 && (
                                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>({serviceDetails.reviews} reviews)</span>
                                    )}
                                  </div>
                                )}

                                {/* Highlights */}
                                {serviceDetails.highlights?.length > 0 && (
                                  <div>
                                    <p className="text-xs font-bold mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>🌟 Highlights</p>
                                    <div className="flex flex-wrap gap-2">
                                      {serviceDetails.highlights.map((h, i) => (
                                        <span key={i} className="text-xs px-2.5 py-1 rounded-full"
                                          style={{ background: "rgba(192,132,252,0.1)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.2)" }}>
                                          ✓ {h}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Styles / packages with images */}
                                {serviceDetails.styles?.length > 0 && (
                                  <div>
                                    <p className="text-xs font-bold mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>🎨 Available Packages</p>
                                    <div className="flex flex-col gap-2">
                                      {serviceDetails.styles.map((style, si) => {
                                        const isBooked = style.name?.toLowerCase() === selectedBooking.package?.event?.toLowerCase()
                                          || style.name?.toLowerCase() === selectedBooking.package?.duration?.toLowerCase();
                                        return (
                                          <div key={si} className="rounded-xl overflow-hidden"
                                            style={{
                                              border: isBooked ? "1px solid rgba(192,132,252,0.5)" : "1px solid rgba(255,255,255,0.06)",
                                              background: isBooked ? "rgba(192,132,252,0.08)" : "rgba(255,255,255,0.03)"
                                            }}>
                                            {style.img && (
                                              <img src={style.img} alt={style.name}
                                                className="w-full object-cover"
                                                style={{ maxHeight: "120px" }} />
                                            )}
                                            <div className="px-3 py-2.5">
                                              <div className="flex items-center justify-between">
                                                <p className="text-sm font-bold text-white">{style.name}</p>
                                                <p className="text-sm font-extrabold" style={{ color: "#d4af37" }}>₹{style.price?.toLocaleString()}</p>
                                              </div>
                                              {style.desc && (
                                                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{style.desc}</p>
                                              )}
                                              {style.specs?.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                  {style.specs.map((sp, spi) => (
                                                    <span key={spi} className="text-xs px-2 py-0.5 rounded-md"
                                                      style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>
                                                      {sp.label}: {sp.value}
                                                    </span>
                                                  ))}
                                                </div>
                                              )}
                                              {isBooked && (
                                                <p className="text-xs mt-1.5 font-bold" style={{ color: "#c084fc" }}>✓ Your booked package</p>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="px-4 py-5 text-center">
                                <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                                  Service info not available
                                </p>
                                <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                                  ({selectedBooking.package?.service})
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Modal Actions */}
                        <div className="flex gap-3 pt-1">
                          {selectedBooking.status === "confirmed" && (
                            <button onClick={() => { handleCancel(selectedBooking._id); setSelectedBooking(null); }}
                              className="flex-1 py-3 rounded-xl font-bold text-sm transition hover:scale-105"
                              style={{ background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.25)" }}>
                              ❌ Cancel Booking
                            </button>
                          )}
                          {selectedBooking.status === "cancelled" && !selectedBooking.isMultiBooking && selectedBooking.package && (
                            <button onClick={() => { setSelectedBooking(null); navigate("/booking", {
                              state: {
                                package: selectedBooking.package,
                                prefill: { date: selectedBooking.date, venue: selectedBooking.venue, phone: selectedBooking.phone, message: selectedBooking.message },
                              }
                            }); }}
                              className="flex-1 py-3 rounded-xl font-bold text-sm transition hover:scale-105"
                              style={{ background: "rgba(192,132,252,0.12)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.3)" }}>
                              🔄 Rebook This Event
                            </button>
                          )}
                          <button onClick={() => setSelectedBooking(null)}
                            className="px-5 py-3 rounded-xl font-semibold text-sm transition"
                            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }}>
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Booking Cards ── */}
                {(() => {
                  const packageBookings = bookings.filter(b => !b.isCustomEvent);
                  const customBookings  = bookings.filter(b =>  b.isCustomEvent);

                  const BookingCard = ({ booking }) => {
                    const price = booking.isMultiBooking
                      ? (booking.totalAmount ? `₹${booking.totalAmount.toLocaleString()}` : "—")
                      : (booking.package?.price ? `₹${booking.package.price.toLocaleString()}` : "—");

                    const statusColor = {
                      confirmed: { bg: "rgba(34,197,94,0.1)",   text: "#4ade80",  border: "rgba(34,197,94,0.25)" },
                      pending:   { bg: "rgba(250,204,21,0.1)",  text: "#facc15",  border: "rgba(250,204,21,0.25)" },
                      completed: { bg: "rgba(99,102,241,0.1)",  text: "#818cf8",  border: "rgba(99,102,241,0.25)" },
                      cancelled: { bg: "rgba(239,68,68,0.1)",   text: "#f87171",  border: "rgba(239,68,68,0.25)" },
                    }[booking.status] || {};

                    return (
                      <div key={booking._id}
                        className="rounded-2xl overflow-hidden transition hover:scale-[1.01]"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(192,132,252,0.12)",
                          boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
                          borderLeft: `4px solid ${statusColor.text || "rgba(192,132,252,0.4)"}`,
                        }}>

                        {/* Card Top */}
                        <div className="px-5 pt-5 pb-4">
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="flex-1 min-w-0">
                              {booking.isCustomEvent ? (
                                <>
                                  <p className="text-xs font-semibold mb-1" style={{ color: "#f472b6" }}>🎨 Custom Event</p>
                                  <h3 className="text-base font-extrabold text-white truncate">
                                    {booking.package?.service || "Custom Booking"}
                                  </h3>
                                  {booking.package?.event && (
                                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                                      🎪 {booking.package.event}
                                    </p>
                                  )}
                                </>
                              ) : booking.isMultiBooking ? (
                                <>
                                  <p className="text-xs font-semibold mb-1" style={{ color: "#c084fc" }}>🛒 Multi-Service</p>
                                  <h3 className="text-base font-extrabold text-white truncate">
                                    {booking.packages?.length || 0} Services Booked
                                  </h3>
                                  <div className="flex flex-wrap gap-1 mt-1.5">
                                    {(booking.packages || []).slice(0, 3).map((pkg, pi) => (
                                      <span key={pi} className="text-xs px-2 py-0.5 rounded-full"
                                        style={{ background: "rgba(192,132,252,0.15)", color: "#c084fc" }}>
                                        {pkg.service}
                                      </span>
                                    ))}
                                  </div>
                                </>
                              ) : (
                                <>
                                  <p className="text-xs font-semibold mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                                    🎪 {booking.package?.event || "Event"}
                                  </p>
                                  <h3 className="text-base font-extrabold text-white truncate">
                                    {booking.package?.service || "Booking"}
                                  </h3>
                                  {booking.package?.duration && (
                                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                                      ⏱ {booking.package.duration}
                                    </p>
                                  )}
                                </>
                              )}
                            </div>
                            <span className="text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0"
                              style={{ background: statusColor.bg, color: statusColor.text, border: `1px solid ${statusColor.border}` }}>
                              {statusIcons[booking.status]} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>

                          {/* Info row */}
                          <div className="grid grid-cols-3 gap-2 mb-4">
                            {[
                              { icon: "📅", label: "Date",  value: booking.date },
                              { icon: "📍", label: "Venue", value: booking.venue },
                              { icon: "💰", label: "Price", value: price, gold: true },
                            ].map((item, i) => (
                              <div key={i} className="p-2.5 rounded-xl text-center"
                                style={{ background: "rgba(255,255,255,0.04)" }}>
                                <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>{item.icon}</p>
                                <p className="text-xs font-bold truncate"
                                  style={{ color: item.gold ? "#d4af37" : "white" }}>{item.value}</p>
                                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>{item.label}</p>
                              </div>
                            ))}
                          </div>

                          {/* Advance badge */}
                          {booking.paymentType === "advance" && booking.status !== "cancelled" && (
                            <div className="mb-3 px-3 py-2 rounded-xl text-xs flex justify-between"
                              style={{ background: "rgba(250,204,21,0.08)", border: "1px solid rgba(250,204,21,0.15)" }}>
                              <span style={{ color: "#facc15" }}>💳 25% Advance — ₹{booking.advanceAmount?.toLocaleString()}</span>
                              <span style={{ color: "rgba(255,255,255,0.35)" }}>₹{booking.remainingAmount?.toLocaleString()} due</span>
                            </div>
                          )}

                          {/* Timeline */}
                          {booking.status !== "cancelled" && (
                            <div className="mb-3 px-3 py-3 rounded-xl flex items-center justify-between gap-2"
                              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                              {/* Confirmed step */}
                              <div className="flex flex-col items-center gap-1">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                                  style={{ background: "rgba(34,197,94,0.2)", border: "2px solid #22c55e", color: "#22c55e" }}>
                                  ✓
                                </div>
                                <span className="text-xs font-semibold" style={{ color: "#22c55e" }}>Confirmed</span>
                              </div>

                              {/* Connector line */}
                              <div className="flex-1 h-0.5 rounded-full" style={{
                                background: booking.status === "completed"
                                  ? "linear-gradient(90deg, #22c55e, #a855f7)"
                                  : "rgba(255,255,255,0.1)"
                              }} />

                              {/* Completed step */}
                              <div className="flex flex-col items-center gap-1">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                                  style={booking.status === "completed"
                                    ? { background: "rgba(168,85,247,0.2)", border: "2px solid #a855f7", color: "#a855f7" }
                                    : { background: "rgba(255,255,255,0.05)", border: "2px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.3)" }}>
                                  🎉
                                </div>
                                <span className="text-xs font-semibold" style={{
                                  color: booking.status === "completed" ? "#a855f7" : "rgba(255,255,255,0.3)"
                                }}>Completed</span>
                              </div>
                            </div>
                          )}
                          {booking.paymentType === "advance" && booking.status === "cancelled" && (
                            <div className="mb-3 px-3 py-2 rounded-xl text-xs"
                              style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)", color: "#4ade80" }}>
                              👛 ₹{booking.advanceAmount?.toLocaleString()} refunded to wallet
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            {/* View Event Button */}
                            <button onClick={() => navigate(`/dashboard/bookings/${booking._id}`)}
                              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105 flex items-center justify-center gap-1.5"
                              style={{ background: "linear-gradient(135deg, rgba(192,132,252,0.15), rgba(244,114,182,0.15))", color: "#c084fc", border: "1px solid rgba(192,132,252,0.25)" }}>
                              🎯 View Event
                            </button>

                            {booking.status === "confirmed" && (
                              <button onClick={() => handleCancel(booking._id)}
                                className="px-4 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105"
                                style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                                ❌ Cancel
                              </button>
                            )}
                            {booking.status === "cancelled" && !booking.isMultiBooking && booking.package && (
                              <button onClick={() => navigate("/booking", {
                                state: {
                                  package: booking.package,
                                  prefill: { date: booking.date, venue: booking.venue, phone: booking.phone, message: booking.message },
                                }
                              })}
                                className="px-4 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105"
                                style={{ background: "rgba(192,132,252,0.1)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.2)" }}>
                                🔄 Rebook
                              </button>
                            )}
                            {booking.status === "completed" && !reviewedBookingIds.includes(booking._id) && (
                              <button onClick={() => setReviewBooking(booking)}
                                className="flex-1 py-2.5 rounded-xl text-sm font-bold transition hover:scale-105"
                                style={{ background: "rgba(250,204,21,0.1)", color: "#facc15", border: "1px solid rgba(250,204,21,0.3)" }}>
                                ⭐ Write Review
                              </button>
                            )}
                            {booking.status === "completed" && reviewedBookingIds.includes(booking._id) && (
                              <div className="flex-1 py-2.5 rounded-xl text-sm font-bold text-center"
                                style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>
                                ✅ Reviewed
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  };

                  return (
                    <div className="pb-10 flex flex-col gap-8">

                      {/* ── Package Bookings ── */}
                      {packageBookings.length > 0 && (
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="h-px flex-1" style={{ background: "rgba(192,132,252,0.15)" }} />
                            <span className="text-xs font-extrabold px-3 py-1.5 rounded-full"
                              style={{ background: "rgba(192,132,252,0.1)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.2)", letterSpacing: "0.08em" }}>
                              📦 PACKAGE BOOKINGS
                            </span>
                            <div className="h-px flex-1" style={{ background: "rgba(192,132,252,0.15)" }} />
                          </div>
                          <div className="flex flex-col gap-5">
                            {packageBookings.map(b => <BookingCard key={b._id} booking={b} />)}
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })()}
              </>
            )}
          </div>
        )}

        {/* ── WALLET TAB ────────────────────────────────────── */}
        {activeTab === "wallet" && (
          <div className="max-w-lg pb-10">
            {/* Balance Card */}
            <div className="rounded-3xl p-8 mb-5 text-center"
              style={{ background: "linear-gradient(135deg, #6d28d9, #a21caf)", boxShadow: "0 10px 40px rgba(109,40,217,0.4)" }}>
              <p className="text-white/70 text-sm mb-2">👛 Wallet Balance</p>
              <p className="text-5xl font-extrabold text-white mb-1">₹{walletBalance.toLocaleString()}</p>
              <p className="text-white/50 text-xs mt-2">Use this balance for your next BookMyEvent booking</p>
            </div>

            {/* How it works */}
            <div className="rounded-3xl p-6 mb-5"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(192,132,252,0.15)" }}>
              <h3 className="text-white font-bold mb-4">ℹ️ How Wallet Works</h3>
              <div className="flex flex-col gap-3">
                {[
                  { icon: "💳", title: "Book with 25% Advance", desc: "Choose advance payment while booking to pay only 25% now." },
                  { icon: "❌", title: "Cancel → Wallet Refund", desc: "If you cancel, your advance amount is instantly credited to wallet." },
                  { icon: "🛒", title: "Use at Checkout", desc: "Apply wallet balance on your next booking to reduce payment." },
                  { icon: "🔒", title: "BookMyEvent Only", desc: "Wallet balance can only be used on BookMyEvent — no withdrawals." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.04)" }}>
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="text-white font-semibold text-sm">{item.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {walletBalance === 0 && (
              <div className="text-center py-4">
                <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
                  No balance yet. Book with advance payment and cancel to get wallet credits!
                </p>
                <button onClick={() => navigate("/services")}
                  className="px-6 py-3 rounded-full font-bold text-white transition hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
                  Browse Services
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── REQUESTS TAB ──────────────────────────────────── */}
        {activeTab === "requests" && (
          <RequestsTab key="requests-tab" navigate={navigate} />
        )}

        {/* ── PROFILE TAB ───────────────────────────────────── */}
        {activeTab === "profile" && (
          <div className="max-w-lg pb-10 flex flex-col gap-5">

            {/* Profile Info Card */}
            <div className="rounded-3xl p-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(192,132,252,0.15)" }}>

              {/* Profile Image Upload */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  {user?.profileImg
                    ? <img src={user.profileImg} alt="profile"
                        className="w-24 h-24 rounded-full object-cover"
                        style={{ border: "3px solid #c084fc" }} />
                    : <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-4xl"
                        style={{ border: "3px solid #c084fc" }}>
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                  }
                  <label htmlFor="profileImgInput"
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition"
                    style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)", border: "2px solid #0f0a1e" }}
                    title="Change photo">
                    {imgUploading ? "⏳" : "📷"}
                  </label>
                  <input id="profileImgInput" type="file" accept="image/*" className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setImgUploading(true);
                      try {
                        const formData = new FormData();
                        formData.append("image", file);
                        const { data } = await api.post("/users/profile/image", formData, {
                          headers: { "Content-Type": "multipart/form-data" },
                        });
                        updateUser({ profileImg: data.profileImg });
                      } catch (err) {
                        alert("Image upload failed. Try again.");
                      } finally {
                        setImgUploading(false);
                        e.target.value = "";
                      }
                    }} />
                </div>
                <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {imgUploading ? "Uploading..." : "Click 📷 to change photo"}
                </p>
              </div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-extrabold text-white">👤 Personal Information</h2>
                {!isEditingProfile && (
                  <button onClick={() => { setIsEditingProfile(true); setProfileMsg({ type: "", text: "" }); }}
                    className="text-xs font-bold px-3 py-1.5 rounded-full transition hover:scale-105"
                    style={{ background: "rgba(192,132,252,0.1)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.3)" }}>
                    ✏️ Edit
                  </button>
                )}
              </div>

              {profileMsg.text && (
                <div className={`px-4 py-2.5 rounded-xl mb-4 text-sm text-center ${profileMsg.type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                  {profileMsg.text}
                </div>
              )}

              {!isEditingProfile ? (
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Full Name",    value: user.name,  icon: "👤" },
                    { label: "Email Address",value: user.email, icon: "📧" },
                    { label: "Phone Number", value: user.phone, icon: "📞" },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>{item.icon} {item.label}</p>
                      <p className="text-white font-semibold">{item.value || "—"}</p>
                    </div>
                  ))}
                  <div className="grid grid-cols-1 gap-3 mt-1">
                    <div className="p-4 rounded-2xl text-center"
                      style={{ background: "rgba(192,132,252,0.08)", border: "1px solid rgba(192,132,252,0.2)" }}>
                      <p className="text-2xl font-bold" style={{ color: "#c084fc" }}>{bookings.length}</p>
                      <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>Total Bookings</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(255,255,255,0.5)" }}>Full Name</label>
                    <input value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-xl text-white outline-none text-sm"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(192,132,252,0.3)" }} />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(255,255,255,0.5)" }}>📧 Email Address</label>
                    <input value={user.email} disabled
                      className="w-full px-4 py-3 rounded-xl text-sm cursor-not-allowed"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)" }} />
                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(255,255,255,0.5)" }}>📞 Phone Number</label>
                    <input value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                      placeholder="10-digit phone number"
                      className="w-full px-4 py-3 rounded-xl text-white outline-none text-sm"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(192,132,252,0.3)" }} />
                  </div>
                  <div className="flex gap-3 mt-1">
                    <button onClick={() => { setIsEditingProfile(false); setProfileMsg({ type: "", text: "" }); setProfileData({ name: user.name || "", phone: user.phone || "" }); }}
                      className="flex-1 py-3 rounded-xl font-bold text-sm transition"
                      style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      Cancel
                    </button>
                    <button onClick={handleProfileSave} disabled={profileLoading}
                      className="flex-1 py-3 rounded-xl font-bold text-white text-sm transition hover:opacity-90 disabled:opacity-60"
                      style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
                      {profileLoading ? "Saving..." : "Save Changes ✓"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Change Password Card */}
            <div className="rounded-3xl p-6"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(192,132,252,0.15)" }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-extrabold text-white">🔒 Password & Security</h2>
                {!isChangingPassword && (
                  <button onClick={() => { setIsChangingPassword(true); setPassMsg({ type: "", text: "" }); }}
                    className="text-xs font-bold px-3 py-1.5 rounded-full transition hover:scale-105"
                    style={{ background: "rgba(192,132,252,0.1)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.3)" }}>
                    🔑 Change
                  </button>
                )}
              </div>

              {passMsg.text && (
                <div className={`px-4 py-2.5 rounded-xl mb-4 text-sm text-center ${passMsg.type === "success" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                  {passMsg.text}
                </div>
              )}

              {!isChangingPassword ? (
                <div className="p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>🔑 Password</p>
                  <p className="text-white font-semibold tracking-widest">••••••••</p>
                  <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>Last updated: Not tracked</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Current Password", key: "currentPassword", show: showCurrentPass, setShow: setShowCurrentPass },
                    { label: "New Password",      key: "newPassword",     show: showNewPass,     setShow: setShowNewPass },
                    { label: "Confirm New Password", key: "confirmNewPassword", show: showConfirmPass, setShow: setShowConfirmPass },
                  ].map(({ label, key, show, setShow }) => (
                    <div key={key}>
                      <label className="text-xs font-medium mb-1 block" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</label>
                      <div className="relative">
                        <input type={show ? "text" : "password"} value={passData[key]}
                          onChange={(e) => setPassData({ ...passData, [key]: e.target.value })}
                          placeholder={label}
                          className="w-full px-4 py-3 pr-10 rounded-xl text-white outline-none text-sm"
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(192,132,252,0.3)" }} />
                        <button type="button" onClick={() => setShow(!show)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 transition"
                          style={{ color: "rgba(255,255,255,0.3)" }} tabIndex={-1}>
                          <EyeIcon show={show} />
                        </button>
                      </div>
                      {key === "confirmNewPassword" && passData.confirmNewPassword && (
                        <p className={`text-xs mt-1 ${passData.newPassword === passData.confirmNewPassword ? "text-green-400" : "text-red-400"}`}>
                          {passData.newPassword === passData.confirmNewPassword ? "✓ Passwords match" : "✗ Don't match"}
                        </p>
                      )}
                    </div>
                  ))}
                  <div className="flex gap-3 mt-1">
                    <button onClick={() => { setIsChangingPassword(false); setPassMsg({ type: "", text: "" }); setPassData({ currentPassword: "", newPassword: "", confirmNewPassword: "" }); }}
                      className="flex-1 py-3 rounded-xl font-bold text-sm transition"
                      style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}>
                      Cancel
                    </button>
                    <button onClick={handlePasswordChange} disabled={passLoading}
                      className="flex-1 py-3 rounded-xl font-bold text-white text-sm transition hover:opacity-90 disabled:opacity-60"
                      style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
                      {passLoading ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Logout */}
            <button onClick={handleLogout}
              className="w-full py-3 rounded-xl font-bold transition hover:scale-105"
              style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
              Logout 🚪
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CustomerDashboard;