// import { useState, useContext, useEffect } from "react";
// import api from "../services/api";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { useCart } from "../context/CartContext";

// const ServiceDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const prefillDate = location.state?.prefillDate || null;
//   const { user } = useContext(AuthContext);
//   const { addToCart, removeFromCart, isInCart, cartToast } = useCart();

//   const [service, setService] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [expandedStyle, setExpandedStyle] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const [guestCount, setGuestCount] = useState(50);

//   useEffect(() => {
//     // MongoDB _id is 24 hex chars, numeric id is short number
//     const isMongoId = /^[a-f\d]{24}$/i.test(id);
//     const url = isMongoId
//       ? `/users/services/detail/${id}`
//       : `/users/services/${id}`;
//     api.get(url)
//       .then((res) => res.data)
//       .then((data) => {
//         setService(data);
//         setLoading(false);
//         if (data._id) {
//           api.get(`/users/reviews/${data._id}`)
//             .then(r => setReviews(r.data))
//             .catch(() => {});
//         }
//       })
//       .catch(() => setLoading(false));
//   }, [id]);

//   const handleBookNow = (style) => {
//     if (!user) {
//       navigate("/login");
//       return;
//     }
//     const isCatering = service.title === "Catering";
//     navigate("/booking", {
//       state: {
//         package: {
//           service: service.title,
//           event: style.name,
//           duration: style.desc,
//           price: isCatering ? style.price * guestCount : style.price,
//           pricePerPlate: isCatering ? style.price : null,
//           guestCount: isCatering ? guestCount : null,
//         },
//         prefill: prefillDate ? { date: prefillDate } : undefined,
//       }
//     });
//   };

//   const handleAddToCart = (style) => {
//     if (!user) { navigate("/login"); return; }
//     const isCatering = service.title === "Catering";
//     addToCart({
//       serviceId: String(service.id),
//       serviceTitle: service.title,
//       styleId: String(style.id),
//       styleName: style.name,
//       styleImg: style.img,
//       duration: style.desc,
//       price: isCatering ? style.price * guestCount : style.price,
//       quantity: 1,
//       guestCount: isCatering ? guestCount : 0,
//       pricePerPlate: isCatering ? style.price : 0,
//     });
//   };


//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0a1e" }}>
//         <div className="text-center">
//           <div className="text-5xl mb-4 animate-pulse">💍</div>
//           <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading service...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!service) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#0f0a1e" }}>
//         <p className="text-5xl mb-4">😕</p>
//         <p className="text-white text-xl mb-4">Service not found!</p>
//         <button onClick={() => navigate("/services")}
//           className="px-6 py-2 rounded-full text-white font-bold"
//           style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
//           Back to Services
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen" style={{ background: "#0f0a1e" }}>

//       {/* Cart Toast Notification */}
//       {cartToast && (
//         <div style={{
//           position: "fixed", top: "20px", right: "20px", zIndex: 9999,
//           padding: "12px 20px", borderRadius: "12px", fontWeight: "600",
//           background: cartToast.type === "success" ? "linear-gradient(135deg, #4ade80, #22c55e)" : "linear-gradient(135deg, #f87171, #ef4444)",
//           color: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
//           animation: "fadeIn 0.3s ease"
//         }}>
//           {cartToast.type === "success" ? "✅" : "❌"} {cartToast.msg}
//         </div>
//       )}

//       {/* Hero */}
//       <div className="relative py-14 px-6 text-center overflow-hidden"
//         style={{ background: "linear-gradient(135deg, #1a0533 0%, #0f0a1e 100%)" }}>
//         <div className="absolute inset-0 opacity-15"
//           style={{ backgroundImage: `url(${service.styles[0].img})`, backgroundSize: "cover", backgroundPosition: "center", filter: "blur(25px)" }} />
//         <div className="relative z-10">
//           <div className="flex items-center justify-center mb-3">
//             <div className="h-px w-12" style={{ background: "linear-gradient(to right, transparent, #d4af37)" }} />
//             <span className="mx-3 text-2xl">{service.icon}</span>
//             <div className="h-px w-12" style={{ background: "linear-gradient(to left, transparent, #d4af37)" }} />
//           </div>
//           <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#d4af37", letterSpacing: "0.3em" }}>{service.subtitle}</p>
//           <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Georgia', serif" }}>{service.title}</h1>
//           <p className="max-w-xl mx-auto text-sm mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>{service.desc}</p>
         
//     {service.reviews > 0 && (
//         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full"
//            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(212,175,55,0.25)" }}>
//           <span className="text-yellow-400 text-sm">★</span>
//           <span className="text-white text-sm font-bold">{service.rating}</span>
//           <span className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>({service.reviews} reviews)</span>
//        </div>
// )}
//       </div>
//       </div>

//       {/* Packages */}
//       <div className="max-w-3xl mx-auto px-6 py-10">
//         <div className="text-center mb-8">
//           <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Georgia', serif" }}>Choose Your Package</h2>
//           <p style={{ color: "rgba(255,255,255,0.45)" }}>Pick the style that matches your vision ✨</p>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
//           {service.styles.map((style) => {
//             const isExpanded = expandedStyle === style.id;
//             const saved = isInCart(String(service.id), String(style.id));

//             return (
//               <div key={style.id}
//                 className="rounded-3xl overflow-hidden transition-all duration-300"
//                 style={{
//                   border: isExpanded ? "2px solid #c084fc" : saved ? "2px solid rgba(192,132,252,0.5)" : "1px solid rgba(255,255,255,0.07)",
//                   boxShadow: isExpanded ? "0 0 30px rgba(192,132,252,0.25)" : "none",
//                   background: "rgba(255,255,255,0.03)",
//                 }}>

//                 <div className="relative h-44 overflow-hidden cursor-pointer"
//                   onClick={() => setExpandedStyle(isExpanded ? null : style.id)}>
//                   <img src={style.img} alt={style.name}
//                     className="w-full h-full object-cover transition-transform duration-500"
//                     style={{ transform: isExpanded ? "scale(1.05)" : "scale(1)" }} />
//                   <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,10,30,0.9) 0%, transparent 50%)" }} />

//                   {saved && (
//                     <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold"
//                       style={{ background: "rgba(192,132,252,0.9)", color: "#fff" }}>
//                       📅 Saved
//                     </div>
//                   )}

//                   <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform duration-300"
//                     style={{ background: "rgba(255,255,255,0.15)", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>
//                     ▾
//                   </div>

//                   <div className="absolute bottom-3 left-4">
//                     <p className="text-white font-bold text-lg">{style.name}</p>
//                     <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{style.desc}</p>
//                   </div>
//                   <div className="absolute bottom-3 right-4">
//                     <p className="font-bold text-lg" style={{ color: "#d4af37" }}>₹{style.price.toLocaleString()}</p>
//                   </div>
//                 </div>

//                 {isExpanded && (
//                   <div className="p-4">
//                     <div className="grid grid-cols-2 gap-2 mb-4">
//                       {style.specs.map((spec, si) => (
//                         <div key={si} className="p-2 rounded-xl"
//                           style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
//                           <p className="text-xs mb-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{spec.label}</p>
//                           <p className="text-xs font-semibold text-white">{spec.value}</p>
//                         </div>
//                       ))}
//                     </div>

//                     {service.title === "Catering services" && (
//                       <div className="mb-3 p-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
//                         <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>🍽️ Number of Plates (Guests)</p>
//                         <select
//                           value={guestCount}
//                           onChange={(e) => setGuestCount(Number(e.target.value))}
//                           className="w-full text-center font-bold text-white rounded-xl px-3 py-2 outline-none appearance-none cursor-pointer"
//                           style={{
//                             background: "rgba(255,255,255,0.08)",
//                             border: "1px solid rgba(192,132,252,0.4)",
//                             color: "#fff",
//                           }}
//                         >
//                           {[50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000].map((n) => (
//                             <option key={n} value={n} style={{ background: "#1a0533", color: "#fff" }}>
//                               {n} Plates
//                             </option>
//                           ))}
//                         </select>
//                         <p className="text-xs mt-2 text-center font-semibold" style={{ color: "#d4af37" }}>
//                           ₹{style.price}/plate × {guestCount} = ₹{(style.price * guestCount).toLocaleString()}
//                         </p>
//                       </div>
//                     )}

//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => {
//                           if (saved) {
//                             removeFromCart(String(service.id), String(style.id));
//                           } else {
//                             handleAddToCart(style);
//                           }
//                         }}
//                         className="flex-1 py-3 rounded-2xl font-bold transition hover:opacity-90"
//                         style={{
//                           background: saved ? "rgba(192,132,252,0.25)" : "rgba(255,255,255,0.08)",
//                           border: saved ? "1.5px solid #c084fc" : "1.5px solid rgba(192,132,252,0.4)",
//                           color: saved ? "#c084fc" : "rgba(255,255,255,0.8)",
//                           cursor: "pointer",
//                         }}>
//                         {saved ? "✅ Saved" : "📅 Save Event"}
//                       </button>

//                       <button
//                         onClick={() => handleBookNow(style)}
//                         className="flex-1 py-3 rounded-2xl font-bold text-white transition hover:opacity-90"
//                         style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
//                         Book Now →
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>

//         {/* Highlights */}
//         <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(192,132,252,0.1)" }}>
//           <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#d4af37", letterSpacing: "0.2em" }}>All packages include</p>
//           <div className="flex flex-wrap gap-2">
//             {service.highlights.map((h, i) => (
//               <span key={i} className="text-xs px-3 py-1 rounded-full"
//                 style={{ background: "rgba(192,132,252,0.08)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.2)" }}>
//                 ✦ {h}
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Customer Reviews */}
//       {reviews.length > 0 && (
//         <div className="px-6 pb-16" style={{ background: "#0f0a1e" }}>
//           <div className="max-w-4xl mx-auto">
//             <div className="text-center mb-10">
//               <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#d4af37", letterSpacing: "0.3em" }}>Customer Feedback</p>
//               <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Georgia', serif" }}>What Our Clients Say</h2>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//               {reviews.map((r, i) => (
//                 <div key={i} className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(192,132,252,0.15)" }}>
//                   <div className="flex gap-1 mb-3">
//                     {[...Array(r.rating)].map((_, j) => (
//                       <span key={j} className="text-yellow-400">★</span>
//                     ))}
//                     {[...Array(5 - r.rating)].map((_, j) => (
//                       <span key={j} style={{ color: "rgba(255,255,255,0.2)" }}>★</span>
//                     ))}
//                   </div>
//                   {r.comment && (
//                     <p className="mb-4 text-sm italic" style={{ color: "rgba(255,255,255,0.6)" }}>"{r.comment}"</p>
//                   )}
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
//                       style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
//                       {r.user?.name?.charAt(0) || "U"}
//                     </div>
//                     <div>
//                       <p className="font-semibold text-white">{r.user?.name || "User"}</p>
//                       <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Verified Customer</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* WhatsApp Button */}
//       <a href="https://wa.me/918838333261" target="_blank" rel="noopener noreferrer"
//         className="fixed bottom-6 right-6 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-50 text-2xl hover:scale-110 transition"
//         style={{ background: "#25D366" }} title="Chat on WhatsApp">
//         💬
//       </a>
//     </div>
//   );
// };

// export default ServiceDetail;





import { useState, useContext, useEffect } from "react";
import api from "../services/api";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const prefillDate = location.state?.prefillDate || null;
  const { user } = useContext(AuthContext);
  const { addToCart, removeFromCart, isInCart, cartToast } = useCart();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedStyle, setExpandedStyle] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [guestCount, setGuestCount] = useState(50);

  useEffect(() => {
    // MongoDB _id is 24 hex chars, numeric id is short number
    const isMongoId = /^[a-f\d]{24}$/i.test(id);
    const url = isMongoId
      ? `/users/services/detail/${id}`
      : `/users/services/${id}`;
    api.get(url)
      .then((res) => res.data)
      .then((data) => {
        setService(data);
        setLoading(false);
        if (data._id) {
          api.get(`/users/reviews/${data._id}`)
            .then(r => setReviews(r.data))
            .catch(() => {});
        }
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleBookNow = (style) => {
    if (!user) {
      navigate("/login");
      return;
    }
    const isCatering = style.specs?.some(s => s.label?.toLowerCase().includes("plate") || s.value?.toLowerCase().includes("plate")) || service.title?.toLowerCase().includes("catering");
    navigate("/booking", {
      state: {
        package: {
          service: service.title,
          event: style.name,
          duration: style.desc,
          price: isCatering ? style.price * guestCount : style.price,
          pricePerPlate: isCatering ? style.price : null,
          guestCount: isCatering ? guestCount : null,
        },
        prefill: prefillDate ? { date: prefillDate } : undefined,
      }
    });
  };

  const handleAddToCart = (style) => {
    if (!user) { navigate("/login"); return; }
    const isCatering = style.specs?.some(s => s.label?.toLowerCase().includes("plate") || s.value?.toLowerCase().includes("plate")) || service.title?.toLowerCase().includes("catering");
    addToCart({
      serviceId: String(service.id),
      serviceTitle: service.title,
      styleId: String(style.id),
      styleName: style.name,
      styleImg: style.img,
      duration: style.desc,
      price: isCatering ? style.price * guestCount : style.price,
      quantity: 1,
      guestCount: isCatering ? guestCount : 0,
      pricePerPlate: isCatering ? style.price : 0,
    });
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0a1e" }}>
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">💍</div>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading service...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: "#0f0a1e" }}>
        <p className="text-5xl mb-4">😕</p>
        <p className="text-white text-xl mb-4">Service not found!</p>
        <button onClick={() => navigate("/services")}
          className="px-6 py-2 rounded-full text-white font-bold"
          style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
          Back to Services
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0f0a1e" }}>

      {/* Cart Toast Notification */}
      {cartToast && (
        <div style={{
          position: "fixed", top: "20px", right: "20px", zIndex: 9999,
          padding: "12px 20px", borderRadius: "12px", fontWeight: "600",
          background: cartToast.type === "success" ? "linear-gradient(135deg, #4ade80, #22c55e)" : "linear-gradient(135deg, #f87171, #ef4444)",
          color: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          animation: "fadeIn 0.3s ease"
        }}>
          {cartToast.type === "success" ? "✅" : "❌"} {cartToast.msg}
        </div>
      )}

      {/* Hero */}
      <div className="relative py-14 px-6 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a0533 0%, #0f0a1e 100%)" }}>
        <div className="absolute inset-0 opacity-15"
          style={{ backgroundImage: `url(${service.styles[0].img})`, backgroundSize: "cover", backgroundPosition: "center", filter: "blur(25px)" }} />
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-3">
            <div className="h-px w-12" style={{ background: "linear-gradient(to right, transparent, #d4af37)" }} />
            <span className="mx-3 text-2xl">{service.icon}</span>
            <div className="h-px w-12" style={{ background: "linear-gradient(to left, transparent, #d4af37)" }} />
          </div>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#d4af37", letterSpacing: "0.3em" }}>{service.subtitle}</p>
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Georgia', serif" }}>{service.title}</h1>
          <p className="max-w-xl mx-auto text-sm mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>{service.desc}</p>
         
    {service.reviews > 0 && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full"
           style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(212,175,55,0.25)" }}>
          <span className="text-yellow-400 text-sm">★</span>
          <span className="text-white text-sm font-bold">{service.rating}</span>
          <span className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>({service.reviews} reviews)</span>
       </div>
)}
      </div>
      </div>

      {/* Packages */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Georgia', serif" }}>Choose Your Package</h2>
          <p style={{ color: "rgba(255,255,255,0.45)" }}>Pick the style that matches your vision ✨</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {service.styles.map((style) => {
            const isExpanded = expandedStyle === style.id;
            const saved = isInCart(String(service.id), String(style.id));

            return (
              <div key={style.id}
                className="rounded-3xl overflow-hidden transition-all duration-300"
                style={{
                  border: isExpanded ? "2px solid #c084fc" : saved ? "2px solid rgba(192,132,252,0.5)" : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: isExpanded ? "0 0 30px rgba(192,132,252,0.25)" : "none",
                  background: "rgba(255,255,255,0.03)",
                }}>

                <div className="relative h-44 overflow-hidden cursor-pointer"
                  onClick={() => setExpandedStyle(isExpanded ? null : style.id)}>
                  <img src={style.img} alt={style.name}
                    className="w-full h-full object-cover transition-transform duration-500"
                    style={{ transform: isExpanded ? "scale(1.05)" : "scale(1)" }} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,10,30,0.9) 0%, transparent 50%)" }} />

                  {saved && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold"
                      style={{ background: "rgba(192,132,252,0.9)", color: "#fff" }}>
                      📅 Saved
                    </div>
                  )}

                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform duration-300"
                    style={{ background: "rgba(255,255,255,0.15)", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>
                    ▾
                  </div>

                  <div className="absolute bottom-3 left-4">
                    <p className="text-white font-bold text-lg">{style.name}</p>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{style.desc}</p>
                  </div>
                  <div className="absolute bottom-3 right-4">
                    <p className="font-bold text-lg" style={{ color: "#d4af37" }}>₹{style.price.toLocaleString()}</p>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {style.specs.map((spec, si) => (
                        <div key={si} className="p-2 rounded-xl"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                          <p className="text-xs mb-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{spec.label}</p>
                          <p className="text-xs font-semibold text-white">{spec.value}</p>
                        </div>
                      ))}
                    </div>

                    {service.title?.toLowerCase().includes("catering") && (
                      <div className="mb-3 p-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.5)" }}>🍽️ Number of Plates (Guests)</p>
                        <select
                          value={guestCount}
                          onChange={(e) => setGuestCount(Number(e.target.value))}
                          className="w-full text-center font-bold text-white rounded-xl px-3 py-2 outline-none appearance-none cursor-pointer"
                          style={{
                            background: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(192,132,252,0.4)",
                            color: "#fff",
                          }}
                        >
                          {[50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000].map((n) => (
                            <option key={n} value={n} style={{ background: "#1a0533", color: "#fff" }}>
                              {n} Plates
                            </option>
                          ))}
                        </select>
                        <p className="text-xs mt-2 text-center font-semibold" style={{ color: "#d4af37" }}>
                          ₹{style.price}/plate × {guestCount} = ₹{(style.price * guestCount).toLocaleString()}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (saved) {
                            removeFromCart(String(service.id), String(style.id));
                          } else {
                            handleAddToCart(style);
                          }
                        }}
                        className="flex-1 py-3 rounded-2xl font-bold transition hover:opacity-90"
                        style={{
                          background: saved ? "rgba(192,132,252,0.25)" : "rgba(255,255,255,0.08)",
                          border: saved ? "1.5px solid #c084fc" : "1.5px solid rgba(192,132,252,0.4)",
                          color: saved ? "#c084fc" : "rgba(255,255,255,0.8)",
                          cursor: "pointer",
                        }}>
                        {saved ? "✅ Saved" : "📅 Save Event"}
                      </button>

                      <button
                        onClick={() => handleBookNow(style)}
                        className="flex-1 py-3 rounded-2xl font-bold text-white transition hover:opacity-90"
                        style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
                        Book Now →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Highlights */}
        <div className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(192,132,252,0.1)" }}>
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#d4af37", letterSpacing: "0.2em" }}>All packages include</p>
          <div className="flex flex-wrap gap-2">
            {service.highlights.map((h, i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-full"
                style={{ background: "rgba(192,132,252,0.08)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.2)" }}>
                ✦ {h}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      {reviews.length > 0 && (
        <div className="px-6 pb-16" style={{ background: "#0f0a1e" }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#d4af37", letterSpacing: "0.3em" }}>Customer Feedback</p>
              <h2 className="text-3xl font-bold text-white" style={{ fontFamily: "'Georgia', serif" }}>What Our Clients Say</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {reviews.map((r, i) => (
                <div key={i} className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(192,132,252,0.15)" }}>
                  <div className="flex gap-1 mb-3">
                    {[...Array(r.rating)].map((_, j) => (
                      <span key={j} className="text-yellow-400">★</span>
                    ))}
                    {[...Array(5 - r.rating)].map((_, j) => (
                      <span key={j} style={{ color: "rgba(255,255,255,0.2)" }}>★</span>
                    ))}
                  </div>
                  {r.comment && (
                    <p className="mb-4 text-sm italic" style={{ color: "rgba(255,255,255,0.6)" }}>"{r.comment}"</p>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
                      {r.user?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{r.user?.name || "User"}</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Verified Customer</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Button */}
      <a href="https://wa.me/918838333261" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-50 text-2xl hover:scale-110 transition"
        style={{ background: "#25D366" }} title="Chat on WhatsApp">
        💬
      </a>
    </div>
  );
};

export default ServiceDetail;