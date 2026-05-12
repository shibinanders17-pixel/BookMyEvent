import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart, removeFromCart, isInCart, cartToast } = useCart();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedStyle, setExpandedStyle] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/services/${id}`)
      .then((res) => res.json())
      .then((data) => { setService(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const handleBookNow = (style) => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/booking", {
      state: {
        package: {
          service: service.title,
          event: style.name,
          duration: style.desc,
          price: style.price,
        }
      }
    });
  };

  const handleAddToCart = (style) => {
    if (!user) { navigate("/login"); return; }
    addToCart({
      serviceId: String(service.id),
      serviceTitle: service.title,
      styleId: String(style.id),
      styleName: style.name,
      styleImg: style.img,
      duration: style.desc,
      price: style.price,
      quantity: 1,
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(212,175,55,0.25)" }}>
            <span className="text-yellow-400 text-sm">★</span>
            <span className="text-white text-sm font-bold">{service.rating}</span>
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>({service.reviews} reviews)</span>
          </div>
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