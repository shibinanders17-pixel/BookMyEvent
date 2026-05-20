
// import { useState, useEffect, useContext, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { useCart } from "../context/CartContext";
// import api from "../services/api";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
//   iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
//   shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
// });

// const CartCheckout = () => {
//   const navigate = useNavigate();
//   const { user } = useContext(AuthContext);
//   const { cartItems, removeFromCart, clearCart, totalPrice } = useCart();

//   const [formData, setFormData] = useState({
//     name: "", phone: "", email: "", date: "", venue: "", message: "",
//   });
//   const [showMap, setShowMap]       = useState(false);
//   const [mapLoading, setMapLoading] = useState(false);
//   const mapRef                      = useRef(null);
//   const mapInstanceRef              = useRef(null);
//   const [paymentType, setPaymentType] = useState("full");
//   const [useWallet, setUseWallet]     = useState(false);
//   const [walletBalance, setWalletBalance] = useState(0);
//   const [error, setError]   = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (user) {
//       setFormData(prev => ({
//         ...prev,
//         name: user.name || "", email: user.email || "", phone: user.phone || "",
//       }));
//       api.get("/users/wallet")
//         .then(r => setWalletBalance(r.data.walletBalance || 0)).catch(() => {});
//     }
//   }, [user]);

//   const advanceAmt   = Math.round(totalPrice * 0.25);
//   const chargeBase   = paymentType === "advance" ? advanceAmt : totalPrice;
//   const walletDeduct = useWallet ? Math.min(walletBalance, chargeBase) : 0;
//   const razorpayAmt  = chargeBase - walletDeduct;
//   const remaining    = paymentType === "advance" ? totalPrice - advanceAmt : 0;

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   // ── Map helpers ──────────────────────────────────────────
//   const reverseGeocode = async (lat, lng) => {
//     try {
//       const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
//       const data = await res.json();
//       return data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
//     } catch { return `${lat.toFixed(5)}, ${lng.toFixed(5)}`; }
//   };

//   const initMap = (lat, lng) => {
//     if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
//     const map = L.map(mapRef.current).setView([lat, lng], 15);
//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap" }).addTo(map);
//     const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
//     marker.on("dragend", async (e) => {
//       const { lat: newLat, lng: newLng } = e.target.getLatLng();
//       const address = await reverseGeocode(newLat, newLng);
//       setFormData(prev => ({ ...prev, venue: address }));
//     });
//     mapInstanceRef.current = map;
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

//   useEffect(() => { return () => { if (mapInstanceRef.current) mapInstanceRef.current.remove(); }; }, []);
//   // ─────────────────────────────────────────────────────────

//   const handlePayment = async () => {
//     if (!formData.name || !formData.phone || !formData.email || !formData.date || !formData.venue) {
//       setError("Please fill all required fields!"); return;
//     }
//     if (formData.phone.length !== 10) {
//       setError("Enter a valid 10-digit phone number!"); return;
//     }
//     if (cartItems.length === 0) {
//       setError("No saved events yet! Browse services and save them."); return;
//     }

//     // ── Check each service availability for selected date ──
//     try {
//       const availRes = await api.get(`/users/availability/date?date=${formData.date}`);
//       const availability = availRes.data.availability || [];
//       const bookedServices = availability
//         .filter(s => !s.available)
//         .map(s => s.title);
//       const conflicting = cartItems
//         .map(item => item.serviceTitle)
//         .filter(title => bookedServices.includes(title));
//       if (conflicting.length > 0) {
//         setError(`⚠️ ${conflicting.join(", ")} ${conflicting.length > 1 ? "are" : "is"} already booked on this date. Please choose another date or remove conflicting services.`);
//         return;
//       }
//     } catch {
//       // If check fails, let backend handle it
//     }
//     // ──────────────────────────────────────────────────────

//     setError(""); setLoading(true);

//     const packages = cartItems.map(item => ({
//       service:  item.serviceTitle,
//       event:    item.styleName,
//       duration: item.duration,
//       price:    item.price,
//       styleImg: item.styleImg,
//     }));

//     const payload = {
//       bookingData: formData,
//       packages,
//       totalAmount: totalPrice,
//       paymentType,
//       walletAmountUsed: walletDeduct,
//     };

//     try {
//       if (razorpayAmt <= 0) {
//         await api.post("/users/payment/verify-multi", {
//           razorpay_order_id:   "WALLET_ONLY",
//           razorpay_payment_id: "WALLET_ONLY",
//           razorpay_signature:  "WALLET_ONLY",
//           ...payload,
//         });
//         clearCart();
//         navigate("/dashboard");
//         return;
//       }

//       const { data } = await api.post("/users/payment/create-order", { amount: razorpayAmt });

//       const options = {
//         key: data.key,
//         amount: data.amount,
//         currency: data.currency,
//         name: "BookMyEvent",
//         description: `${cartItems.length} service${cartItems.length > 1 ? "s" : ""} booking`,
//         order_id: data.orderId,
//         prefill: { name: formData.name, email: formData.email, contact: formData.phone },
//         theme: { color: "#7c3aed" },
//         handler: async (response) => {
//           try {
//             await api.post("/users/payment/verify-multi", {
//               razorpay_order_id:   response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature:  response.razorpay_signature,
//               ...payload,
//             });
//             clearCart();
//             navigate("/dashboard");
//           } catch (err) {
//             setError(err.response?.data?.message || "Verification failed. Contact support.");
//           } finally { setLoading(false); }
//         },
//         modal: { ondismiss: () => { setLoading(false); setError("Payment cancelled."); } },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       setLoading(false);
//       setError(err.response?.data?.message || "Payment failed. Try again.");
//     }
//   };

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
//         <div className="text-6xl mb-4">🛒</div>
//         <h2 className="text-2xl font-bold text-gray-700 mb-2">No saved events yet!</h2>
//         <p className="text-gray-500 mb-6">Browse services and save the ones you love</p>
//         <button onClick={() => navigate("/services")}
//           className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700">
//           Browse Services
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-10 px-4">
//       <div className="max-w-3xl mx-auto">

//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-extrabold text-gray-800">📅 Saved Events</h1>
//           <p className="text-gray-500 mt-2">Review your services and confirm booking</p>
//         </div>

//         {/* Cart Items */}
//         <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
//           <h2 className="font-bold text-gray-800 mb-4 text-lg">
//             Saved Events ({cartItems.length})
//           </h2>
//           <div className="space-y-3">
//             {cartItems.map((item, idx) => (
//               <div key={idx}
//                 className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50">
//                 <div className="flex items-center gap-3">
//                   {item.styleImg && (
//                     <img src={item.styleImg} alt={item.styleName}
//                       className="w-12 h-12 rounded-lg object-cover" />
//                   )}
//                   <div>
//                     <p className="font-semibold text-gray-800 text-sm">{item.serviceTitle}</p>
//                     <p className="text-gray-500 text-xs">{item.styleName}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <p className="font-bold text-purple-600">₹{item.price.toLocaleString()}</p>
//                   <button onClick={() => removeFromCart(item.serviceId, item.styleId)}
//                     className="text-red-400 hover:text-red-600 text-lg transition">✕</button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Total */}
//           <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
//             <p className="font-bold text-gray-700">Total</p>
//             <p className="text-xl font-extrabold text-purple-600">₹{totalPrice.toLocaleString()}</p>
//           </div>
//         </div>

//         {/* Payment Type */}
//         <div className="bg-white rounded-2xl shadow-md p-6 mb-5">
//           <h3 className="font-bold text-gray-800 mb-4">💳 Payment Option</h3>
//           <div className="grid grid-cols-2 gap-3">
//             <button onClick={() => setPaymentType("full")}
//               className={`p-4 rounded-xl border-2 text-left transition ${
//                 paymentType === "full" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-gray-300"
//               }`}>
//               <p className="font-bold text-gray-800 text-sm">Pay Full Amount</p>
//               <p className="text-purple-600 font-bold mt-1">₹{totalPrice.toLocaleString()}</p>
//             </button>
//             <button onClick={() => setPaymentType("advance")}
//               className={`p-4 rounded-xl border-2 text-left transition ${
//                 paymentType === "advance" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-gray-300"
//               }`}>
//               <p className="font-bold text-gray-800 text-sm">Pay Advance (25%)</p>
//               <p className="text-purple-600 font-bold mt-1">₹{advanceAmt.toLocaleString()}</p>
//               <p className="text-xs text-gray-500">Remaining ₹{remaining.toLocaleString()} on event day</p>
//             </button>
//           </div>
//         </div>

//         {/* Wallet */}
//         {walletBalance > 0 && (
//           <div className="bg-white rounded-2xl shadow-md p-5 mb-5">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="font-bold text-gray-800">👛 Use Wallet Balance</p>
//                 <p className="text-sm text-green-600">Available: ₹{walletBalance.toLocaleString()}</p>
//               </div>
//               <button onClick={() => setUseWallet(!useWallet)}
//                 className={`w-12 h-6 rounded-full transition-all ${useWallet ? "bg-purple-500" : "bg-gray-300"} relative`}>
//                 <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${useWallet ? "left-6" : "left-0.5"}`} />
//               </button>
//             </div>
//             {useWallet && walletDeduct > 0 && (
//               <p className="text-sm text-purple-600 mt-2 font-semibold">
//                 ✅ ₹{walletDeduct.toLocaleString()} will be deducted from wallet
//               </p>
//             )}
//           </div>
//         )}

//         {/* Booking Form */}
//         <div className="bg-white rounded-2xl shadow-md p-6 mb-5">
//           <h3 className="font-bold text-gray-800 mb-4">📋 Event Details</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {[
//               { name: "name",  label: "Full Name *",    type: "text",  placeholder: "Your Name" },
//               { name: "phone", label: "Phone *",        type: "tel",   placeholder: "10-digit number" },
//               { name: "email", label: "Email *",        type: "email", placeholder: "you@email.com" },
//               { name: "date",  label: "Event Date *",   type: "date",  placeholder: "" },
//             ].map(f => (
//               <div key={f.name}>
//                 <label className="block text-sm font-semibold text-gray-700 mb-1">{f.label}</label>
//                 <input name={f.name} type={f.type} placeholder={f.placeholder}
//                   value={formData[f.name]} onChange={handleChange}
//                   className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition text-sm" />
//               </div>
//             ))}
//             <div className="sm:col-span-2">
//               <label className="block text-sm font-semibold text-gray-700 mb-1">Venue *</label>
//               <div className="flex gap-2">
//                 <input name="venue" type="text" placeholder="Event venue / address"
//                   value={formData.venue} onChange={handleChange}
//                   className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition text-sm" />
//                 <button type="button" onClick={handleUseLocation} disabled={mapLoading}
//                   className="px-4 py-3 rounded-xl text-sm font-semibold transition hover:scale-105 whitespace-nowrap"
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
//             <div className="sm:col-span-2">
//               <label className="block text-sm font-semibold text-gray-700 mb-1">Additional Message</label>
//               <textarea name="message" placeholder="Any special requirements..."
//                 value={formData.message} onChange={handleChange} rows={3}
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition resize-none text-sm" />
//             </div>
//           </div>
//         </div>

//         {/* Pay Summary */}
//         {razorpayAmt > 0 && (
//           <div className="bg-purple-600 text-white rounded-2xl p-5 mb-5">
//             <div className="flex justify-between items-center">
//               <span className="font-semibold">Amount to Pay Now</span>
//               <span className="text-2xl font-extrabold text-yellow-300">
//                 ₹{razorpayAmt.toLocaleString()}
//               </span>
//             </div>
//             {walletDeduct > 0 && (
//               <p className="text-sm text-white/70 mt-1">
//                 (₹{walletDeduct.toLocaleString()} from wallet deducted)
//               </p>
//             )}
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm font-semibold mb-4">
//             {error}
//           </div>
//         )}

//         <button onClick={handlePayment} disabled={loading}
//           className="w-full py-4 rounded-2xl font-extrabold text-white text-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
//           style={{ background: "linear-gradient(135deg, #7c3aed, #c084fc)" }}>
//           {loading ? "Processing..." : `Pay ₹${razorpayAmt > 0 ? razorpayAmt.toLocaleString() : "0"} & Confirm Booking`}
//         </button>

//         <button onClick={() => navigate("/services")}
//           className="w-full mt-3 py-3 text-gray-500 hover:text-purple-600 text-sm font-semibold transition">
//           ← Add more services
//         </button>

//       </div>
//     </div>
//   );
// };

// export default CartCheckout;







import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../services/api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const CartCheckout = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { cartItems, removeFromCart, clearCart, totalPrice } = useCart();

  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", date: "", venue: "", message: "",
  });
  const [showMap, setShowMap]       = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const mapRef                      = useRef(null);
  const mapInstanceRef              = useRef(null);
  const [paymentType, setPaymentType] = useState("full");
  const [useWallet, setUseWallet]     = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "", email: user.email || "", phone: user.phone || "",
      }));
      api.get("/users/wallet")
        .then(r => setWalletBalance(r.data.walletBalance || 0)).catch(() => {});
    }
  }, [user]);

  const advanceAmt   = Math.round(totalPrice * 0.25);
  const chargeBase   = paymentType === "advance" ? advanceAmt : totalPrice;
  const walletDeduct = useWallet ? Math.min(walletBalance, chargeBase) : 0;
  const razorpayAmt  = chargeBase - walletDeduct;
  const remaining    = paymentType === "advance" ? totalPrice - advanceAmt : 0;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
      setFormData(prev => ({ ...prev, venue: address }));
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
        setFormData(prev => ({ ...prev, venue: address }));
        setShowMap(true);
        setMapLoading(false);
        setTimeout(() => initMap(lat, lng), 100);
      },
      () => { setMapLoading(false); alert("Could not get location. Please allow location access."); }
    );
  };

  useEffect(() => { return () => { if (mapInstanceRef.current) mapInstanceRef.current.remove(); }; }, []);
  // ─────────────────────────────────────────────────────────

  const handlePayment = async () => {
    if (!formData.name || !formData.phone || !formData.email || !formData.date || !formData.venue) {
      setError("Please fill all required fields!"); return;
    }
    if (formData.phone.length !== 10) {
      setError("Enter a valid 10-digit phone number!"); return;
    }
    if (cartItems.length === 0) {
      setError("No saved events yet! Browse services and save them."); return;
    }

    // ── Check each service availability for selected date ──
    try {
      const availRes = await api.get(`/users/availability/date?date=${formData.date}`);
      const availability = availRes.data.availability || [];
      const bookedServices = availability
        .filter(s => !s.available)
        .map(s => s.title);
      const conflicting = cartItems
        .map(item => item.serviceTitle)
        .filter(title => bookedServices.includes(title));
      if (conflicting.length > 0) {
        setError(`⚠️ ${conflicting.join(", ")} ${conflicting.length > 1 ? "are" : "is"} already booked on this date. Please choose another date or remove conflicting services.`);
        return;
      }
    } catch {
      // If check fails, let backend handle it
    }
    // ──────────────────────────────────────────────────────

    setError(""); setLoading(true);

    const packages = cartItems.map(item => ({
      service:       item.serviceTitle,
      event:         item.styleName,
      duration:      item.duration,
      price:         item.price,
      styleImg:      item.styleImg,
      guestCount:    item.guestCount || 0,
      pricePerPlate: item.pricePerPlate || 0,
    }));

    const payload = {
      bookingData: formData,
      packages,
      totalAmount: totalPrice,
      paymentType,
      walletAmountUsed: walletDeduct,
    };

    try {
      if (razorpayAmt <= 0) {
        await api.post("/users/payment/verify-multi", {
          razorpay_order_id:   "WALLET_ONLY",
          razorpay_payment_id: "WALLET_ONLY",
          razorpay_signature:  "WALLET_ONLY",
          ...payload,
        });
        clearCart();
        navigate("/dashboard");
        return;
      }

      const { data } = await api.post("/users/payment/create-order", { amount: razorpayAmt });

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "BookMyEvent",
        description: `${cartItems.length} service${cartItems.length > 1 ? "s" : ""} booking`,
        order_id: data.orderId,
        prefill: { name: formData.name, email: formData.email, contact: formData.phone },
        theme: { color: "#7c3aed" },
        handler: async (response) => {
          try {
            await api.post("/users/payment/verify-multi", {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              ...payload,
            });
            clearCart();
            navigate("/dashboard");
          } catch (err) {
            setError(err.response?.data?.message || "Verification failed. Contact support.");
          } finally { setLoading(false); }
        },
        modal: { ondismiss: () => { setLoading(false); setError("Payment cancelled."); } },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Payment failed. Try again.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No saved events yet!</h2>
        <p className="text-gray-500 mb-6">Browse services and save the ones you love</p>
        <button onClick={() => navigate("/services")}
          className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700">
          Browse Services
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">📅 Saved Events</h1>
          <p className="text-gray-500 mt-2">Review your services and confirm booking</p>
        </div>

        {/* Cart Items */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="font-bold text-gray-800 mb-4 text-lg">
            Saved Events ({cartItems.length})
          </h2>
          <div className="space-y-3">
            {cartItems.map((item, idx) => (
              <div key={idx}
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3">
                  {item.styleImg && (
                    <img src={item.styleImg} alt={item.styleName}
                      className="w-12 h-12 rounded-lg object-cover" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{item.serviceTitle}</p>
                    <p className="text-gray-500 text-xs">{item.styleName}</p>
                    {item.pricePerPlate > 0 && (
                      <p className="text-xs text-amber-600 font-medium mt-0.5">
                        ₹{item.pricePerPlate}/plate × {item.guestCount} guests
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-purple-600">₹{item.price.toLocaleString()}</p>
                  <button onClick={() => removeFromCart(item.serviceId, item.styleId)}
                    className="text-red-400 hover:text-red-600 text-lg transition">✕</button>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
            <p className="font-bold text-gray-700">Total</p>
            <p className="text-xl font-extrabold text-purple-600">₹{totalPrice.toLocaleString()}</p>
          </div>
        </div>

        {/* Payment Type */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-5">
          <h3 className="font-bold text-gray-800 mb-4">💳 Payment Option</h3>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setPaymentType("full")}
              className={`p-4 rounded-xl border-2 text-left transition ${
                paymentType === "full" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-gray-300"
              }`}>
              <p className="font-bold text-gray-800 text-sm">Pay Full Amount</p>
              <p className="text-purple-600 font-bold mt-1">₹{totalPrice.toLocaleString()}</p>
            </button>
            <button onClick={() => setPaymentType("advance")}
              className={`p-4 rounded-xl border-2 text-left transition ${
                paymentType === "advance" ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-gray-300"
              }`}>
              <p className="font-bold text-gray-800 text-sm">Pay Advance (25%)</p>
              <p className="text-purple-600 font-bold mt-1">₹{advanceAmt.toLocaleString()}</p>
              <p className="text-xs text-gray-500">Remaining ₹{remaining.toLocaleString()} on event day</p>
            </button>
          </div>
        </div>

        {/* Wallet */}
        {walletBalance > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-5 mb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-800">👛 Use Wallet Balance</p>
                <p className="text-sm text-green-600">Available: ₹{walletBalance.toLocaleString()}</p>
              </div>
              <button onClick={() => setUseWallet(!useWallet)}
                className={`w-12 h-6 rounded-full transition-all ${useWallet ? "bg-purple-500" : "bg-gray-300"} relative`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${useWallet ? "left-6" : "left-0.5"}`} />
              </button>
            </div>
            {useWallet && walletDeduct > 0 && (
              <p className="text-sm text-purple-600 mt-2 font-semibold">
                ✅ ₹{walletDeduct.toLocaleString()} will be deducted from wallet
              </p>
            )}
          </div>
        )}

        {/* Booking Form */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-5">
          <h3 className="font-bold text-gray-800 mb-4">📋 Event Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "name",  label: "Full Name *",    type: "text",  placeholder: "Your Name" },
              { name: "phone", label: "Phone *",        type: "tel",   placeholder: "10-digit number" },
              { name: "email", label: "Email *",        type: "email", placeholder: "you@email.com" },
              { name: "date",  label: "Event Date *",   type: "date",  placeholder: "" },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{f.label}</label>
                <input name={f.name} type={f.type} placeholder={f.placeholder}
                  value={formData[f.name]} onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition text-sm" />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Venue *</label>
              <div className="flex gap-2">
                <input name="venue" type="text" placeholder="Event venue / address"
                  value={formData.venue} onChange={handleChange}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition text-sm" />
                <button type="button" onClick={handleUseLocation} disabled={mapLoading}
                  className="px-4 py-3 rounded-xl text-sm font-semibold transition hover:scale-105 whitespace-nowrap"
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
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Additional Message</label>
              <textarea name="message" placeholder="Any special requirements..."
                value={formData.message} onChange={handleChange} rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition resize-none text-sm" />
            </div>
          </div>
        </div>

        {/* Pay Summary */}
        {razorpayAmt > 0 && (
          <div className="bg-purple-600 text-white rounded-2xl p-5 mb-5">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Amount to Pay Now</span>
              <span className="text-2xl font-extrabold text-yellow-300">
                ₹{razorpayAmt.toLocaleString()}
              </span>
            </div>
            {walletDeduct > 0 && (
              <p className="text-sm text-white/70 mt-1">
                (₹{walletDeduct.toLocaleString()} from wallet deducted)
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm font-semibold mb-4">
            {error}
          </div>
        )}

        <button onClick={handlePayment} disabled={loading}
          className="w-full py-4 rounded-2xl font-extrabold text-white text-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(135deg, #7c3aed, #c084fc)" }}>
          {loading ? "Processing..." : `Pay ₹${razorpayAmt > 0 ? razorpayAmt.toLocaleString() : "0"} & Confirm Booking`}
        </button>

        <button onClick={() => navigate("/services")}
          className="w-full mt-3 py-3 text-gray-500 hover:text-purple-600 text-sm font-semibold transition">
          ← Add more services
        </button>

      </div>
    </div>
  );
};

export default CartCheckout;