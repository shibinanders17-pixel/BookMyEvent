// import { useState, useEffect, useContext, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import api from "../services/api";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
 
// // Fix leaflet default marker icon
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// const Booking = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);
//   const selectedPackage = location.state?.package;
//   const customRequest = location.state?.customRequest; // custom event request data

//   const [formData, setFormData] = useState({
//     name: "", phone: "", email: "", date: "", venue: "", message: "",
//   });
//   const [showMap, setShowMap]           = useState(false);
//   const [mapLoading, setMapLoading]     = useState(false);
//   const mapRef                          = useRef(null);
//   const mapInstanceRef                  = useRef(null);
//   const markerRef                       = useRef(null);
//   const [paymentType, setPaymentType]       = useState("full");   // "full" | "advance"
//   const [useWallet, setUseWallet]           = useState(false);
//   const [walletBalance, setWalletBalance]   = useState(0);
//   const [error, setError]                   = useState("");
//   const [bookedDates, setBookedDates]       = useState([]);
//   const [loading, setLoading]               = useState(false);

//   // Pre-fill from user context
//   useEffect(() => {
//     if (user) {
//       setFormData(prev => ({
//         ...prev,
//         name:  user.name  || "",
//         email: user.email || "",
//         phone: user.phone || "",
//       }));
//     }
//   }, [user]);

//   // Pre-fill from rebook state (cancelled booking)
//   useEffect(() => {
//     const prefill = location.state?.prefill;
//     if (prefill) {
//       setFormData(prev => ({
//         ...prev,
//         date:    prefill.date    || prev.date,
//         venue:   prefill.venue   || prev.venue,
//         phone:   prefill.phone   || prev.phone,
//         message: prefill.message || prev.message,
//       }));
//     }
//   }, []);

//   // Fetch booked dates for this service
//   useEffect(() => {
//     if (selectedPackage?.service) {
//       api.get(`/users/availability/service-booked-dates?serviceName=${encodeURIComponent(selectedPackage.service)}`)
//         .then(res => {
//           const dates = res.data.bookedDates.map(d => {
//             const [year, month, day] = d.split("-").map(Number);
//             return new Date(year, month - 1, day);
//           });
//           setBookedDates(dates);
//         })
//         .catch(() => {});
//     }
//   }, [selectedPackage]);

//   // Fetch wallet balance
//   useEffect(() => {
//     if (user) {
//       api.get("/users/wallet")
//         .then(res => setWalletBalance(res.data.walletBalance || 0))
//         .catch(() => {});
//     }
//   }, [user]);

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   // ── Map helpers ──────────────────────────────────────────
//   const reverseGeocode = async (lat, lng) => {
//     try {
//       const res = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
//       );
//       const data = await res.json();
//       return data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
//     } catch {
//       return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
//     }
//   };

//   const initMap = (lat, lng) => {
//     if (mapInstanceRef.current) {
//       mapInstanceRef.current.remove();
//       mapInstanceRef.current = null;
//     }
//     const map = L.map(mapRef.current).setView([lat, lng], 15);
//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//       attribution: "© OpenStreetMap",
//     }).addTo(map);
//     const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
//     marker.on("dragend", async (e) => {
//       const { lat: newLat, lng: newLng } = e.target.getLatLng();
//       const address = await reverseGeocode(newLat, newLng);
//       setFormData(prev => ({ ...prev, venue: address }));
//     });
//     mapInstanceRef.current = map;
//     markerRef.current = marker;
//   };

//   const handleUseLocation = () => {
//     if (!navigator.geolocation) return alert("Geolocation not supported");
//     setMapLoading(true);
//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         const { latitude: lat, longitude: lng } = pos.coords;
//         const address = await reverseGeocode(lat, lng);
//         setFormData(prev => ({ ...prev, venue: address }));
//         setShowMap(true);
//         setMapLoading(false);
//         setTimeout(() => initMap(lat, lng), 100);
//       },
//       () => { setMapLoading(false); alert("Could not get location. Please allow location access."); }
//     );
//   };

//   useEffect(() => {
//     return () => { if (mapInstanceRef.current) mapInstanceRef.current.remove(); };
//   }, []);
//   // ─────────────────────────────────────────────────────────

//   const totalPrice   = selectedPackage?.price || 0;
//   const advanceAmt   = Math.round(totalPrice * 0.25);
//   const remainingAmt = totalPrice - advanceAmt;

//   // Amount to pay via Razorpay
//   const chargeableBase  = paymentType === "advance" ? advanceAmt : totalPrice;
//   const walletDeduction = useWallet ? Math.min(walletBalance, chargeableBase) : 0;
//   const razorpayAmount  = chargeableBase - walletDeduction;

//   const handlePayment = async () => {
//     if (!customRequest) {
//       if (!formData.name || !formData.phone || !formData.email || !formData.date || !formData.venue) {
//         setError("Please fill in all required fields!"); return;
//       }
//       if (formData.phone.length !== 10) {
//         setError("Please enter a valid 10 digit phone number!"); return;
//       }
//       // Block if selected date is already booked for this service
//       const selectedDateObj = new Date(formData.date + "T00:00:00");
//       const isDateBooked = bookedDates.some(
//         (d) => d.toDateString() === selectedDateObj.toDateString()
//       );
//       if (isDateBooked) {
//         setError(`⚠️ This date is already booked for ${selectedPackage?.service || "this service"}. Please choose another date.`);
//         return;
//       }
//     }
//     if (!selectedPackage?.price) {
//       setError("No package selected. Please go back and choose a service."); return;
//     }
//     setError("");
//     setLoading(true);

//     try {
//       // If wallet covers 100%, no Razorpay needed
//       if (razorpayAmount <= 0) {
//         await api.post("/users/payment/verify", {
//           razorpay_order_id:   "WALLET_ONLY",
//           razorpay_payment_id: "WALLET_ONLY",
//           razorpay_signature:  "WALLET_ONLY",
//           bookingData: customRequest
//             ? { name: customRequest.name || user?.name || "", phone: customRequest.phone, email: user?.email || "", date: customRequest.date, venue: customRequest.venue, message: "", package: selectedPackage, customRequestId: customRequest._id }
//             : { ...formData, package: selectedPackage },
//           paymentType,
//           walletAmountUsed: walletDeduction,
//         });
//         navigate("/dashboard", { state: { walletUsed: walletDeduction } });
//         return;
//       }

//       const { data } = await api.post("/users/payment/create-order", {
//         amount: razorpayAmount,
//       });

//       const options = {
//         key:         data.key,
//         amount:      data.amount,
//         currency:    data.currency,
//         name:        "BookMyEvent",
//         description: `${selectedPackage.service} - ${selectedPackage.event}`,
//         order_id:    data.orderId,
//         prefill: {
//           name:    customRequest ? customRequest.name    : formData.name,
//           email:   customRequest ? (user?.email || "")   : formData.email,
//           contact: customRequest ? customRequest.phone   : formData.phone,
//         },
//         theme: { color: "#7c3aed" },
//         handler: async (response) => {
//           try {
//             await api.post("/users/payment/verify", {
//               razorpay_order_id:   response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature:  response.razorpay_signature,
//               bookingData: customRequest
//                 ? { name: customRequest.name, phone: customRequest.phone, email: user?.email || "", date: customRequest.date, venue: customRequest.venue, message: customRequest.description || "", package: selectedPackage, customRequestId: customRequest._id }
//                 : { ...formData, package: selectedPackage },
//               paymentType,
//               walletAmountUsed: walletDeduction,
//             });
//             navigate("/dashboard");
//           } catch (err) {
//             setError(err.response?.data?.message || "Payment verification failed. Contact support.");
//           } finally { setLoading(false); }
//         },
//         modal: {
//           ondismiss: () => {
//             setLoading(false);
//             setError("Payment cancelled. Try again to confirm your booking.");
//           },
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       setLoading(false);
//       setError(err.response?.data?.message || "Failed to initiate payment. Try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4">
//       <div className="max-w-2xl mx-auto">

//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-extrabold text-gray-800">Book Your Event 🎉</h1>
//           <p className="text-gray-500 mt-2">Fill in the details to confirm your booking</p>
//         </div>

//         {/* Selected Package / Custom Request Card */}
//         {selectedPackage ? (
//           customRequest ? (
//             // ── Custom Request Summary Card ──
//             <div className="bg-purple-600 text-white rounded-2xl p-6 mb-6 shadow-lg">
//               <h2 className="text-lg font-bold mb-1">✨ Custom Event Booking</h2>
//               <p className="text-white/70 text-sm mb-4">Your request has been confirmed by admin</p>
//               <div className="grid grid-cols-2 gap-3 text-sm">
//                 <div><p className="text-white/70">Event</p><p className="font-semibold">{customRequest.eventCategory}</p></div>
//                 <div><p className="text-white/70">Date</p><p className="font-semibold">{customRequest.date}</p></div>
//                 <div><p className="text-white/70">Venue</p><p className="font-semibold">{customRequest.venue || "—"}</p></div>
//                 <div><p className="text-white/70">Guests</p><p className="font-semibold">{customRequest.guestCount || "—"}</p></div>
//                 <div><p className="text-white/70">Phone</p><p className="font-semibold">{customRequest.phone}</p></div>
//                 <div><p className="text-white/70">Quoted Price</p><p className="font-semibold text-yellow-300">₹{totalPrice.toLocaleString()}</p></div>
//               </div>
//             </div>
//           ) : (
//             // ── Normal Package Card ──
//             <div className="bg-purple-600 text-white rounded-2xl p-6 mb-6 shadow-lg">
//               <h2 className="text-lg font-bold mb-3">Selected Package 🎯</h2>
//               <div className="grid grid-cols-2 gap-2 text-sm">
//                 <div><p className="text-white/70">Service</p><p className="font-semibold">{selectedPackage.service}</p></div>
//                 <div><p className="text-white/70">Event Type</p><p className="font-semibold">{selectedPackage.event}</p></div>
//                 <div><p className="text-white/70">Duration</p><p className="font-semibold">{selectedPackage.duration}</p></div>
//                 <div><p className="text-white/70">Total Price</p><p className="font-semibold text-yellow-300">₹{totalPrice.toLocaleString()}</p></div>
//               </div>
//             </div>
//           )
//         ) : (
//           <div className="bg-yellow-50 text-yellow-600 rounded-2xl p-4 mb-6 text-center">
//             No package selected!
//             <span className="text-purple-600 cursor-pointer ml-1 font-semibold" onClick={() => navigate("/services")}>
//               Choose a service
//             </span>
//           </div>
//         )}

//         {/* ── Payment Type Toggle ── */}
//         {selectedPackage && (
//           <div className="bg-white rounded-2xl shadow-md p-6 mb-5">
//             <h3 className="font-bold text-gray-800 mb-4">💳 Payment Option</h3>
//             <div className="grid grid-cols-2 gap-3">
//               {/* Full Payment */}
//               <button
//                 onClick={() => setPaymentType("full")}
//                 className={`p-4 rounded-xl border-2 text-left transition ${
//                   paymentType === "full"
//                     ? "border-purple-500 bg-purple-50"
//                     : "border-gray-200 hover:border-gray-300"
//                 }`}
//               >
//                 <p className="font-bold text-gray-800 text-sm">Pay Full Amount</p>
//                 <p className="text-purple-600 font-extrabold text-lg mt-1">₹{totalPrice.toLocaleString()}</p>
//                 <p className="text-xs text-gray-400 mt-1">Nothing due on event day</p>
//               </button>

//               {/* Advance Payment */}
//               <button
//                 onClick={() => setPaymentType("advance")}
//                 className={`p-4 rounded-xl border-2 text-left transition ${
//                   paymentType === "advance"
//                     ? "border-purple-500 bg-purple-50"
//                     : "border-gray-200 hover:border-gray-300"
//                 }`}
//               >
//                 <p className="font-bold text-gray-800 text-sm">Pay 25% Advance</p>
//                 <p className="text-purple-600 font-extrabold text-lg mt-1">₹{advanceAmt.toLocaleString()}</p>
//                 <p className="text-xs text-gray-400 mt-1">₹{remainingAmt.toLocaleString()} due on event day</p>
//               </button>
//             </div>

//             {paymentType === "advance" && (
//               <div className="mt-3 p-3 bg-yellow-50 rounded-xl text-xs text-yellow-700">
//                 ⚠️ If you cancel, only the advance (₹{advanceAmt.toLocaleString()}) will be refunded to your wallet.
//                 The remaining balance is not charged now.
//               </div>
//             )}
//           </div>
//         )}

//         {/* ── Wallet Section ── */}
//         {selectedPackage && walletBalance > 0 && (
//           <div className="bg-white rounded-2xl shadow-md p-6 mb-5">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="font-bold text-gray-800">👛 BookMyEvent Wallet</h3>
//                 <p className="text-sm text-gray-500 mt-0.5">
//                   Available: <span className="text-green-600 font-bold">₹{walletBalance.toLocaleString()}</span>
//                 </p>
//               </div>
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <span className="text-sm text-gray-600 font-medium">Use Wallet</span>
//                 <div
//                   onClick={() => setUseWallet(prev => !prev)}
//                   className={`w-12 h-6 rounded-full transition-colors relative ${useWallet ? "bg-purple-500" : "bg-gray-300"}`}
//                 >
//                   <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${useWallet ? "translate-x-7" : "translate-x-1"}`} />
//                 </div>
//               </label>
//             </div>
//             {useWallet && (
//               <div className="mt-3 p-3 bg-purple-50 rounded-xl text-sm">
//                 <div className="flex justify-between text-gray-600">
//                   <span>{paymentType === "advance" ? "Advance" : "Total"} Amount</span>
//                   <span>₹{chargeableBase.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between text-green-600 mt-1">
//                   <span>Wallet Deduction</span>
//                   <span>- ₹{walletDeduction.toLocaleString()}</span>
//                 </div>
//                 <div className="border-t border-purple-200 mt-2 pt-2 flex justify-between font-bold text-purple-700">
//                   <span>Pay via Razorpay</span>
//                   <span>₹{Math.max(0, razorpayAmount).toLocaleString()}</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ── Booking Form (hidden for custom requests) ── */}
//         {!customRequest && <div className="bg-white rounded-2xl shadow-md p-8">
//           {error && (
//             <div className="bg-red-50 text-red-500 px-4 py-3 rounded-xl mb-5 text-sm text-center">
//               {error}
//             </div>
//           )}

//           <div className="flex flex-col gap-4">
//             {[
//               { label: "Full Name *",               name: "name",    type: "text",   placeholder: "Enter your full name" },
//               { label: "Phone Number *",             name: "phone",   type: "tel",    placeholder: "Enter your 10 digit phone number" },
//               { label: "Email Address *",            name: "email",   type: "email",  placeholder: "Enter your email" },
//             ].map(field => (
//               <div key={field.name}>
//                 <label className="text-sm font-medium text-gray-700 mb-1 block">{field.label}</label>
//                 <input
//                   type={field.type}
//                   name={field.name}
//                   value={formData[field.name]}
//                   onChange={handleChange}
//                   placeholder={field.placeholder}
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition"
//                 />
//               </div>
//             ))}

//             {/* ── Availability Calendar ── */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-1 block">Event Date *</label>
//               <DatePicker
//                 selected={formData.date ? new Date(formData.date) : null}
//                 onChange={(date) => {
//                   const formatted = date.toISOString().split("T")[0];
//                   setFormData({ ...formData, date: formatted });
//                 }}
//                 excludeDates={bookedDates}
//                 minDate={new Date()}
//                 dateFormat="dd/MM/yyyy"
//                 placeholderText="Select available date"
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition"
//                 dayClassName={(date) => {
//                   const isBooked = bookedDates.some(
//                     (d) => d.toDateString() === date.toDateString()
//                   );
//                   return isBooked ? "bg-red-200 text-red-600 rounded-full" : undefined;
//                 }}
//                 renderDayContents={(day, date) => {
//                   const isBooked = bookedDates.some(
//                     (d) => d.toDateString() === date.toDateString()
//                   );
//                   return (
//                     <div className="relative group">
//                       <span>{day}</span>
//                       {isBooked && (
//                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50
//                           bg-gray-800 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap
//                           opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-lg">
//                           Partially booked
//                           <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
//                         </div>
//                       )}
//                     </div>
//                   );
//                 }}
//                 wrapperClassName="w-full"
//               />

//               {/* Feature 1 — Legend: only when date selected AND that date is booked */}
//               {formData.date && bookedDates.some(d => d.toDateString() === new Date(formData.date + "T00:00:00").toDateString()) && (
//                 <p className="text-xs text-red-500 mt-1">🔴 This date is already booked for this service. Please choose another date.</p>
//               )}

//               {/* Feature 2 — Smart Banner when booked date is selected */}
//               {formData.date && bookedDates.some(d => d.toDateString() === new Date(formData.date).toDateString()) && (
//                 <div className="mt-2 flex items-center justify-between px-4 py-3 rounded-xl border border-orange-200 bg-orange-50">
//                   <div className="flex items-center gap-2 text-sm text-orange-700">
//                     <span>⚠️</span>
//                     <span>This date has other bookings.</span>
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => navigate("/availability")}
//                     className="text-xs font-semibold text-purple-600 hover:underline whitespace-nowrap ml-2"
//                   >
//                     Check availability →
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* ── Venue with Map Picker ── */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-1 block">Event Venue *</label>
//               <div className="flex gap-2">
//                 <input
//                   type="text"
//                   name="venue"
//                   value={formData.venue} 
//                   onChange={handleChange}
//                   placeholder="Enter event venue / location"
//                   className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition"
//                 />
//                 <button type="button" onClick={handleUseLocation} disabled={mapLoading}
//                   className="px-4 py-3 rounded-xl text-sm font-semibold transition hover:scale-105 flex items-center gap-1.5 whitespace-nowrap"
//                   style={{ background: "linear-gradient(135deg,#c084fc,#f472b6)", color: "white", opacity: mapLoading ? 0.7 : 1 }}>
//                   {mapLoading ? "..." : "📍 My Location"}
//                 </button>
//               </div>
//               {showMap && (
//                 <div className="mt-3 rounded-2xl overflow-hidden border-2 border-purple-200">
//                   <p className="text-xs text-purple-600 font-semibold px-3 py-2 bg-purple-50">
//                     📌 Drag the pin to set exact location
//                   </p>
//                   <div ref={mapRef} style={{ height: "220px", width: "100%" }} />
//                 </div>
//               )}
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-1 block">Additional Message (Optional)</label>
//               <textarea
//                 name="message"
//                 value={formData.message}
//                 onChange={handleChange}
//                 placeholder="Any special requirements or notes..."
//                 rows={3}
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition resize-none"
//               />
//             </div>

//             {/* Payment Summary */}
//             {selectedPackage && (
//               <div className="bg-gray-50 rounded-xl p-4 text-sm">
//                 <div className="flex justify-between text-gray-600 mb-1">
//                   <span>Payment Mode</span>
//                   <span className="font-semibold capitalize">{paymentType === "advance" ? "25% Advance" : "Full Payment"}</span>
//                 </div>
//                 {useWallet && walletDeduction > 0 && (
//                   <div className="flex justify-between text-green-600 mb-1">
//                     <span>Wallet</span>
//                     <span>- ₹{walletDeduction.toLocaleString()}</span>
//                   </div>
//                 )}
//                 <div className="flex justify-between font-bold text-gray-800 border-t pt-2 mt-1">
//                   <span>You Pay Now</span>
//                   <span className="text-purple-600 text-base">₹{Math.max(0, razorpayAmount).toLocaleString()}</span>
//                 </div>
//                 {paymentType === "advance" && (
//                   <p className="text-xs text-gray-400 mt-1 text-right">+ ₹{remainingAmt.toLocaleString()} due on event day</p>
//                 )}
//               </div>
//             )}

//             <button
//               onClick={handlePayment}
//               disabled={loading}
//               className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition mt-2 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
//             >
//               {loading
//                 ? "Processing..."
//                 : razorpayAmount <= 0
//                   ? `✅ Confirm with Wallet`
//                   : `Pay ₹${Math.max(0, razorpayAmount).toLocaleString()} & Confirm`}
//             </button>
//           </div>
//         </div>}

//         {/* ── Custom Request: Direct Pay Button ── */}
//         {customRequest && selectedPackage && (
//           <div className="bg-white rounded-2xl shadow-md p-6">
//             {error && (
//               <div className="bg-red-50 text-red-500 px-4 py-3 rounded-xl mb-5 text-sm text-center">{error}</div>
//             )}
//             {/* Payment Summary */}
//             <div className="bg-gray-50 rounded-xl p-4 text-sm mb-4">
//               <div className="flex justify-between text-gray-600 mb-1">
//                 <span>Payment Mode</span>
//                 <span className="font-semibold capitalize">{paymentType === "advance" ? "25% Advance" : "Full Payment"}</span>
//               </div>
//               {useWallet && walletDeduction > 0 && (
//                 <div className="flex justify-between text-green-600 mb-1">
//                   <span>Wallet</span>
//                   <span>- ₹{walletDeduction.toLocaleString()}</span>
//                 </div>
//               )}
//               <div className="flex justify-between font-bold text-gray-800 border-t pt-2 mt-1">
//                 <span>You Pay Now</span>
//                 <span className="text-purple-600 text-base">₹{Math.max(0, razorpayAmount).toLocaleString()}</span>
//               </div>
//               {paymentType === "advance" && (
//                 <p className="text-xs text-gray-400 mt-1 text-right">+ ₹{remainingAmt.toLocaleString()} due on event day</p>
//               )}
//             </div>
//             <button
//               onClick={handlePayment}
//               disabled={loading}
//               className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition text-lg disabled:opacity-60 disabled:cursor-not-allowed"
//             >
//               {loading
//                 ? "Processing..."
//                 : razorpayAmount <= 0
//                   ? `✅ Confirm with Wallet`
//                   : `🚀 Pay ₹${Math.max(0, razorpayAmount).toLocaleString()} & Confirm Booking`}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Booking;







import { useState, useEffect, useContext, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
 
// Fix leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const selectedPackage = location.state?.package;
  const customRequest = location.state?.customRequest; // custom event request data

  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", date: "", venue: "", message: "",
  });
  const [showMap, setShowMap]           = useState(false);
  const [mapLoading, setMapLoading]     = useState(false);
  const mapRef                          = useRef(null);
  const mapInstanceRef                  = useRef(null);
  const markerRef                       = useRef(null);
  const [paymentType, setPaymentType]       = useState("full");   // "full" | "advance"
  const [useWallet, setUseWallet]           = useState(false);
  const [walletBalance, setWalletBalance]   = useState(0);
  const [error, setError]                   = useState("");
  const [bookedDates, setBookedDates]       = useState([]);
  const [loading, setLoading]               = useState(false);

  // Pre-fill from user context
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name:  user.name  || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  // Pre-fill from rebook state (cancelled booking)
  useEffect(() => {
    const prefill = location.state?.prefill;
    if (prefill) {
      setFormData(prev => ({
        ...prev,
        date:    prefill.date    || prev.date,
        venue:   prefill.venue   || prev.venue,
        phone:   prefill.phone   || prev.phone,
        message: prefill.message || prev.message,
      }));
    }
  }, []);

  // Fetch booked dates for this service
  useEffect(() => {
    if (selectedPackage?.service) {
      api.get(`/users/availability/service-booked-dates?serviceName=${encodeURIComponent(selectedPackage.service)}`)
        .then(res => {
          const dates = res.data.bookedDates.map(d => {
            const [year, month, day] = d.split("-").map(Number);
            return new Date(year, month - 1, day);
          });
          setBookedDates(dates);
        })
        .catch(() => {});
    }
  }, [selectedPackage]);

  // Fetch wallet balance
  useEffect(() => {
    if (user) {
      api.get("/users/wallet")
        .then(res => setWalletBalance(res.data.walletBalance || 0))
        .catch(() => {});
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ── Map helpers ──────────────────────────────────────────
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      return data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    } catch {
      return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
  };

  const initMap = (lat, lng) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    const map = L.map(mapRef.current).setView([lat, lng], 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);
    const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    marker.on("dragend", async (e) => {
      const { lat: newLat, lng: newLng } = e.target.getLatLng();
      const address = await reverseGeocode(newLat, newLng);
      setFormData(prev => ({ ...prev, venue: address }));
    });
    mapInstanceRef.current = map;
    markerRef.current = marker;
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    setMapLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const address = await reverseGeocode(lat, lng);
        setFormData(prev => ({ ...prev, venue: address }));
        setShowMap(true);
        setMapLoading(false);
        setTimeout(() => initMap(lat, lng), 100);
      },
      () => { setMapLoading(false); alert("Could not get location. Please allow location access."); }
    );
  };

  useEffect(() => {
    return () => { if (mapInstanceRef.current) mapInstanceRef.current.remove(); };
  }, []);
  // ─────────────────────────────────────────────────────────

  const totalPrice   = selectedPackage?.price || 0;
  const advanceAmt   = Math.round(totalPrice * 0.25);
  const remainingAmt = totalPrice - advanceAmt;

  // Amount to pay via Razorpay
  const chargeableBase  = paymentType === "advance" ? advanceAmt : totalPrice;
  const walletDeduction = useWallet ? Math.min(walletBalance, chargeableBase) : 0;
  const razorpayAmount  = chargeableBase - walletDeduction;

  const handlePayment = async () => {
    if (!customRequest) {
      if (!formData.name || !formData.phone || !formData.email || !formData.date || !formData.venue) {
        setError("Please fill in all required fields!"); return;
      }
      if (formData.phone.length !== 10) {
        setError("Please enter a valid 10 digit phone number!"); return;
      }
      // Block if selected date is already booked for this service
      const selectedDateObj = new Date(formData.date + "T00:00:00");
      const isDateBooked = bookedDates.some(
        (d) => d.toDateString() === selectedDateObj.toDateString()
      );
      if (isDateBooked) {
        setError(`⚠️ This date is already booked for ${selectedPackage?.service || "this service"}. Please choose another date.`);
        return;
      }
    }
    if (!selectedPackage?.price) {
      setError("No package selected. Please go back and choose a service."); return;
    }
    setError("");
    setLoading(true);

    try {
      // If wallet covers 100%, no Razorpay needed
      if (razorpayAmount <= 0) {
        await api.post("/users/payment/verify", {
          razorpay_order_id:   "WALLET_ONLY",
          razorpay_payment_id: "WALLET_ONLY",
          razorpay_signature:  "WALLET_ONLY",
          bookingData: customRequest
            ? { name: customRequest.name || user?.name || "", phone: customRequest.phone, email: user?.email || "", date: customRequest.date, venue: customRequest.venue, message: "", package: selectedPackage, customRequestId: customRequest._id }
            : { ...formData, package: selectedPackage },
          paymentType,
          walletAmountUsed: walletDeduction,
        });
        navigate("/dashboard", { state: { walletUsed: walletDeduction } });
        return;
      }

      const { data } = await api.post("/users/payment/create-order", {
        amount: razorpayAmount,
      });

      const options = {
        key:         data.key,
        amount:      data.amount,
        currency:    data.currency,
        name:        "BookMyEvent",
        description: `${selectedPackage.service} - ${selectedPackage.event}`,
        order_id:    data.orderId,
        prefill: {
          name:    customRequest ? customRequest.name    : formData.name,
          email:   customRequest ? (user?.email || "")   : formData.email,
          contact: customRequest ? customRequest.phone   : formData.phone,
        },
        theme: { color: "#7c3aed" },
        handler: async (response) => {
          try {
            await api.post("/users/payment/verify", {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              bookingData: customRequest
                ? { name: customRequest.name, phone: customRequest.phone, email: user?.email || "", date: customRequest.date, venue: customRequest.venue, message: customRequest.description || "", package: selectedPackage, customRequestId: customRequest._id }
                : { ...formData, package: selectedPackage },
              paymentType,
              walletAmountUsed: walletDeduction,
            });
            navigate("/dashboard");
          } catch (err) {
            setError(err.response?.data?.message || "Payment verification failed. Contact support.");
          } finally { setLoading(false); }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError("Payment cancelled. Try again to confirm your booking.");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Failed to initiate payment. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Book Your Event 🎉</h1>
          <p className="text-gray-500 mt-2">Fill in the details to confirm your booking</p>
        </div>

        {/* Selected Package / Custom Request Card */}
        {selectedPackage ? (
          customRequest ? (
            // ── Custom Request Summary Card ──
            <div className="bg-purple-600 text-white rounded-2xl p-6 mb-6 shadow-lg">
              <h2 className="text-lg font-bold mb-1">✨ Custom Event Booking</h2>
              <p className="text-white/70 text-sm mb-4">Your request has been confirmed by admin</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-white/70">Event</p><p className="font-semibold">{customRequest.eventCategory}</p></div>
                <div><p className="text-white/70">Date</p><p className="font-semibold">{customRequest.date}</p></div>
                <div><p className="text-white/70">Venue</p><p className="font-semibold">{customRequest.venue || "—"}</p></div>
                <div><p className="text-white/70">Guests</p><p className="font-semibold">{customRequest.guestCount || "—"}</p></div>
                <div><p className="text-white/70">Phone</p><p className="font-semibold">{customRequest.phone}</p></div>
                <div><p className="text-white/70">Quoted Price</p><p className="font-semibold text-yellow-300">₹{totalPrice.toLocaleString()}</p></div>
              </div>
            </div>
          ) : (
            // ── Normal Package Card ──
            <div className="bg-purple-600 text-white rounded-2xl p-6 mb-6 shadow-lg">
              <h2 className="text-lg font-bold mb-3">Selected Package 🎯</h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><p className="text-white/70">Service</p><p className="font-semibold">{selectedPackage.service}</p></div>
                <div><p className="text-white/70">Event Type</p><p className="font-semibold">{selectedPackage.event}</p></div>
                <div><p className="text-white/70">Duration</p><p className="font-semibold">{selectedPackage.duration}</p></div>
                {selectedPackage.pricePerPlate ? (
                  <>
                    <div><p className="text-white/70">Rate</p><p className="font-semibold">₹{selectedPackage.pricePerPlate}/plate</p></div>
                    <div><p className="text-white/70">Guests / Plates</p><p className="font-semibold">{selectedPackage.guestCount} plates</p></div>
                    <div><p className="text-white/70">Total Price</p><p className="font-semibold text-yellow-300">₹{totalPrice.toLocaleString()}</p></div>
                  </>
                ) : (
                  <div><p className="text-white/70">Total Price</p><p className="font-semibold text-yellow-300">₹{totalPrice.toLocaleString()}</p></div>
                )}
              </div>
            </div>
          )
        ) : (
          <div className="bg-yellow-50 text-yellow-600 rounded-2xl p-4 mb-6 text-center">
            No package selected!
            <span className="text-purple-600 cursor-pointer ml-1 font-semibold" onClick={() => navigate("/services")}>
              Choose a service
            </span>
          </div>
        )}

        {/* ── Payment Type Toggle ── */}
        {selectedPackage && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-5">
            <h3 className="font-bold text-gray-800 mb-4">💳 Payment Option</h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Full Payment */}
              <button
                onClick={() => setPaymentType("full")}
                className={`p-4 rounded-xl border-2 text-left transition ${
                  paymentType === "full"
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className="font-bold text-gray-800 text-sm">Pay Full Amount</p>
                <p className="text-purple-600 font-extrabold text-lg mt-1">₹{totalPrice.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">Nothing due on event day</p>
              </button>

              {/* Advance Payment */}
              <button
                onClick={() => setPaymentType("advance")}
                className={`p-4 rounded-xl border-2 text-left transition ${
                  paymentType === "advance"
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className="font-bold text-gray-800 text-sm">Pay 25% Advance</p>
                <p className="text-purple-600 font-extrabold text-lg mt-1">₹{advanceAmt.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">₹{remainingAmt.toLocaleString()} due on event day</p>
              </button>
            </div>

            {paymentType === "advance" && (
              <div className="mt-3 p-3 bg-yellow-50 rounded-xl text-xs text-yellow-700">
                ⚠️ If you cancel, only the advance (₹{advanceAmt.toLocaleString()}) will be refunded to your wallet.
                The remaining balance is not charged now.
              </div>
            )}
          </div>
        )}

        {/* ── Wallet Section ── */}
        {selectedPackage && walletBalance > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-800">👛 BookMyEvent Wallet</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Available: <span className="text-green-600 font-bold">₹{walletBalance.toLocaleString()}</span>
                </p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm text-gray-600 font-medium">Use Wallet</span>
                <div
                  onClick={() => setUseWallet(prev => !prev)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${useWallet ? "bg-purple-500" : "bg-gray-300"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${useWallet ? "translate-x-7" : "translate-x-1"}`} />
                </div>
              </label>
            </div>
            {useWallet && (
              <div className="mt-3 p-3 bg-purple-50 rounded-xl text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>{paymentType === "advance" ? "Advance" : "Total"} Amount</span>
                  <span>₹{chargeableBase.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600 mt-1">
                  <span>Wallet Deduction</span>
                  <span>- ₹{walletDeduction.toLocaleString()}</span>
                </div>
                <div className="border-t border-purple-200 mt-2 pt-2 flex justify-between font-bold text-purple-700">
                  <span>Pay via Razorpay</span>
                  <span>₹{Math.max(0, razorpayAmount).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Booking Form (hidden for custom requests) ── */}
        {!customRequest && <div className="bg-white rounded-2xl shadow-md p-8">
          {error && (
            <div className="bg-red-50 text-red-500 px-4 py-3 rounded-xl mb-5 text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            {[
              { label: "Full Name *",               name: "name",    type: "text",   placeholder: "Enter your full name" },
              { label: "Phone Number *",             name: "phone",   type: "tel",    placeholder: "Enter your 10 digit phone number" },
              { label: "Email Address *",            name: "email",   type: "email",  placeholder: "Enter your email" },
            ].map(field => (
              <div key={field.name}>
                <label className="text-sm font-medium text-gray-700 mb-1 block">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition"
                />
              </div>
            ))}

            {/* ── Availability Calendar ── */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Event Date *</label>
              <DatePicker
                selected={formData.date ? new Date(formData.date) : null}
                onChange={(date) => {
                  const formatted = date.toISOString().split("T")[0];
                  setFormData({ ...formData, date: formatted });
                }}
                excludeDates={bookedDates}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select available date"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition"
                dayClassName={(date) => {
                  const isBooked = bookedDates.some(
                    (d) => d.toDateString() === date.toDateString()
                  );
                  return isBooked ? "bg-red-200 text-red-600 rounded-full" : undefined;
                }}
                renderDayContents={(day, date) => {
                  const isBooked = bookedDates.some(
                    (d) => d.toDateString() === date.toDateString()
                  );
                  return (
                    <div className="relative group">
                      <span>{day}</span>
                      {isBooked && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50
                          bg-gray-800 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap
                          opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-lg">
                          Partially booked
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                        </div>
                      )}
                    </div>
                  );
                }}
                wrapperClassName="w-full"
              />

              {/* Feature 1 — Legend: only when date selected AND that date is booked */}
              {formData.date && bookedDates.some(d => d.toDateString() === new Date(formData.date + "T00:00:00").toDateString()) && (
                <p className="text-xs text-red-500 mt-1">🔴 This date is already booked for this service. Please choose another date.</p>
              )}

              {/* Feature 2 — Smart Banner when booked date is selected */}
              {formData.date && bookedDates.some(d => d.toDateString() === new Date(formData.date).toDateString()) && (
                <div className="mt-2 flex items-center justify-between px-4 py-3 rounded-xl border border-orange-200 bg-orange-50">
                  <div className="flex items-center gap-2 text-sm text-orange-700">
                    <span>⚠️</span>
                    <span>This date has other bookings.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/availability")}
                    className="text-xs font-semibold text-purple-600 hover:underline whitespace-nowrap ml-2"
                  >
                    Check availability →
                  </button>
                </div>
              )}
            </div>

            {/* ── Venue with Map Picker ── */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Event Venue *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="venue"
                  value={formData.venue} 
                  onChange={handleChange}
                  placeholder="Enter event venue / location"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition"
                />
                <button type="button" onClick={handleUseLocation} disabled={mapLoading}
                  className="px-4 py-3 rounded-xl text-sm font-semibold transition hover:scale-105 flex items-center gap-1.5 whitespace-nowrap"
                  style={{ background: "linear-gradient(135deg,#c084fc,#f472b6)", color: "white", opacity: mapLoading ? 0.7 : 1 }}>
                  {mapLoading ? "..." : "📍 My Location"}
                </button>
              </div>
              {showMap && (
                <div className="mt-3 rounded-2xl overflow-hidden border-2 border-purple-200">
                  <p className="text-xs text-purple-600 font-semibold px-3 py-2 bg-purple-50">
                    📌 Drag the pin to set exact location
                  </p>
                  <div ref={mapRef} style={{ height: "220px", width: "100%" }} />
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Additional Message (Optional)</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Any special requirements or notes..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition resize-none"
              />
            </div>

            {/* Payment Summary */}
            {selectedPackage && (
              <div className="bg-gray-50 rounded-xl p-4 text-sm">
                <div className="flex justify-between text-gray-600 mb-1">
                  <span>Payment Mode</span>
                  <span className="font-semibold capitalize">{paymentType === "advance" ? "25% Advance" : "Full Payment"}</span>
                </div>
                {useWallet && walletDeduction > 0 && (
                  <div className="flex justify-between text-green-600 mb-1">
                    <span>Wallet</span>
                    <span>- ₹{walletDeduction.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-800 border-t pt-2 mt-1">
                  <span>You Pay Now</span>
                  <span className="text-purple-600 text-base">₹{Math.max(0, razorpayAmount).toLocaleString()}</span>
                </div>
                {paymentType === "advance" && (
                  <p className="text-xs text-gray-400 mt-1 text-right">+ ₹{remainingAmt.toLocaleString()} due on event day</p>
                )}
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition mt-2 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Processing..."
                : razorpayAmount <= 0
                  ? `✅ Confirm with Wallet`
                  : `Pay ₹${Math.max(0, razorpayAmount).toLocaleString()} & Confirm`}
            </button>
          </div>
        </div>}

        {/* ── Custom Request: Direct Pay Button ── */}
        {customRequest && selectedPackage && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            {error && (
              <div className="bg-red-50 text-red-500 px-4 py-3 rounded-xl mb-5 text-sm text-center">{error}</div>
            )}
            {/* Payment Summary */}
            <div className="bg-gray-50 rounded-xl p-4 text-sm mb-4">
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Payment Mode</span>
                <span className="font-semibold capitalize">{paymentType === "advance" ? "25% Advance" : "Full Payment"}</span>
              </div>
              {useWallet && walletDeduction > 0 && (
                <div className="flex justify-between text-green-600 mb-1">
                  <span>Wallet</span>
                  <span>- ₹{walletDeduction.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-800 border-t pt-2 mt-1">
                <span>You Pay Now</span>
                <span className="text-purple-600 text-base">₹{Math.max(0, razorpayAmount).toLocaleString()}</span>
              </div>
              {paymentType === "advance" && (
                <p className="text-xs text-gray-400 mt-1 text-right">+ ₹{remainingAmt.toLocaleString()} due on event day</p>
              )}
            </div>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition text-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Processing..."
                : razorpayAmount <= 0
                  ? `✅ Confirm with Wallet`
                  : `🚀 Pay ₹${Math.max(0, razorpayAmount).toLocaleString()} & Confirm Booking`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;