import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const filters = ["All", "Most Popular", "Top Rated", "Trending", "Premium", "Best Value", "New", "Unique"];
const stats = [
  { value: "12+", label: "Services" },
  { value: "500+", label: "Weddings" },
  { value: "4.9★", label: "Rating" },
  { value: "24/7", label: "Support" },
];

export default function Services() {
  const location = useLocation();
  const highlightService = location.state?.highlightService || null;
  const fromDate = location.state?.fromDate || null;

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [glowId, setGlowId] = useState(null);
  const cardRefs = useRef({});

  useEffect(() => {
    fetch("http://localhost:5000/api/users/services")
      .then((res) => res.json())
      .then((data) => { setServices(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Auto-scroll + glow when coming from Availability page
  useEffect(() => {
    if (!highlightService || loading) return;
    const timer = setTimeout(() => {
      const ref = cardRefs.current[highlightService];
      if (ref) {
        ref.scrollIntoView({ behavior: "smooth", block: "center" });
        setGlowId(highlightService);
        // Remove glow after 3 seconds
        setTimeout(() => setGlowId(null), 3000);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [highlightService, loading]);

  const filtered = services.filter((s) => {
    const matchFilter = filter === "All" || s.tag === filter;
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0a1e" }}>
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">💍</div>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0f0a1e", fontFamily: "'Georgia', serif" }}>

      {/* Hero Header */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a0533 0%, #0f0a1e 50%, #1a0533 100%)" }}>
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #c084fc, transparent)", transform: "translate(-50%, -50%)" }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #f472b6, transparent)", transform: "translate(50%, 50%)" }}></div>

        <div className="flex items-center justify-center pt-16 mb-6">
          <div className="h-px w-24" style={{ background: "linear-gradient(to right, transparent, #d4af37)" }}></div>
          <div className="mx-4 text-2xl">💍</div>
          <div className="h-px w-24" style={{ background: "linear-gradient(to left, transparent, #d4af37)" }}></div>
        </div>

        <div className="text-center px-6 pb-16">
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#d4af37", letterSpacing: "0.3em" }}>
            BookMyEvent · Coimbatore
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ color: "#fff", lineHeight: 1.1 }}>
            Wedding Services
            <br />
            <span style={{ color: "#c084fc" }}>Crafted With Love</span>
          </h1>
          <p className="text-lg max-w-xl mx-auto mt-4" style={{ color: "rgba(255,255,255,0.6)" }}>
            12 premium services for your perfect Tamil wedding — curated, trusted, and delivered with excellence.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mt-8 relative">
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-6 py-3 rounded-full text-white outline-none"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(212,175,55,0.3)",
                backdropFilter: "blur(10px)",
              }}
            />
            <span className="absolute right-5 top-3 text-xl">🔍</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mt-10">
            {stats.map((s, i) => (
              <div key={i} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(212,175,55,0.2)" }}>
                <p className="text-2xl font-bold" style={{ color: "#d4af37" }}>{s.value}</p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Request Banner */}
      <div className="px-6 py-10">
        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(192,132,252,0.12), rgba(244,114,182,0.10))", border: "1px solid rgba(192,132,252,0.25)" }}>
          <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
            <div className="text-7xl select-none">🎊</div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#d4af37", letterSpacing: "0.3em" }}>Can't find what you need?</p>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Georgia', serif" }}>
                Have a Unique Vision? <br />
                <span style={{ color: "#c084fc" }}>We'll Make It Happen ✨</span>
              </h2>
              <p className="text-sm mb-5" style={{ color: "rgba(255,255,255,0.5)" }}>
                Destination wedding, themed party, corporate gala — tell us your dream and our team will craft a custom package just for you!
              </p>
              <div className="flex gap-4 flex-wrap justify-center md:justify-start">
                <Link to="/custom-request"
                  className="font-bold px-8 py-3 rounded-full transition hover:scale-105 inline-block"
                  style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)", color: "#fff", boxShadow: "0 4px 20px rgba(192,132,252,0.35)" }}>
                  ✨ Submit Custom Request
                </Link>
                <a href="https://wa.me/918838333261" target="_blank" rel="noopener noreferrer"
                  className="font-bold px-8 py-3 rounded-full transition hover:scale-105 inline-block"
                  style={{ background: "rgba(255,255,255,0.06)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }}>
                  💬 Chat on WhatsApp
                </a>
              </div>
            </div>
            <div className="hidden md:flex flex-col gap-3 text-sm">
              {["🎯 Fully Customised", "💎 Premium Quality", "📋 Dedicated Manager", "⚡ Quick Response"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{ background: "rgba(192,132,252,0.1)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(192,132,252,0.2)" }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-0 z-40 py-4 px-6 overflow-x-auto" style={{ background: "rgba(15,10,30,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex gap-2 max-w-6xl mx-auto">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
              style={{
                background: filter === f ? "linear-gradient(135deg, #c084fc, #f472b6)" : "rgba(255,255,255,0.05)",
                color: filter === f ? "#fff" : "rgba(255,255,255,0.5)",
                border: filter === f ? "none" : "1px solid rgba(255,255,255,0.1)",
                transform: filter === f ? "scale(1.05)" : "scale(1)",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* From Availability banner */}
      {highlightService && fromDate && (
        <div className="max-w-6xl mx-auto px-6 pt-6">
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl text-sm font-medium"
            style={{ background: "rgba(192,132,252,0.12)", border: "1px solid rgba(192,132,252,0.35)", color: "#c084fc" }}>
            <span>📅</span>
            <span>
              Booking for <strong>{new Date(fromDate + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</strong>
              {" · "}Scrolled to <strong>{highlightService}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <p className="mb-8 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
          Showing <span style={{ color: "#c084fc" }}>{filtered.length}</span> services
          {filter !== "All" && <span> in <span style={{ color: "#d4af37" }}>{filter}</span></span>}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service) => {
            const isGlowing = glowId === service.title;
            return (
            <div
              key={service.id}
              ref={(el) => { cardRefs.current[service.title] = el; }}
              onMouseEnter={() => setHoveredId(service.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="rounded-3xl overflow-hidden transition-all duration-500"
              style={{
                background: isGlowing ? "rgba(192,132,252,0.08)" : "rgba(255,255,255,0.03)",
                border: isGlowing
                  ? "2px solid rgba(192,132,252,0.9)"
                  : hoveredId === service.id ? "1px solid rgba(192,132,252,0.5)" : "1px solid rgba(255,255,255,0.07)",
                transform: isGlowing ? "translateY(-10px) scale(1.02)" : hoveredId === service.id ? "translateY(-8px)" : "translateY(0)",
                boxShadow: isGlowing
                  ? "0 0 40px rgba(192,132,252,0.4), 0 30px 60px rgba(192,132,252,0.2)"
                  : hoveredId === service.id ? "0 30px 60px rgba(192,132,252,0.15)" : "none",
                transition: "all 0.5s ease",
              }}
            >
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={service.img}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700"
                  style={{ transform: hoveredId === service.id ? "scale(1.1)" : "scale(1)" }}
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,10,30,0.9) 0%, transparent 60%)" }}></div>

                <div className={`absolute top-4 left-4 ${service.tagColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                  {service.tag}
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)" }}>
                  <span className="text-yellow-400 text-xs">★</span>
                  <span className="text-white text-xs font-bold">{service.rating}</span>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>({service.reviews})</span>
                </div>

                <div className="absolute bottom-4 left-4">
                  <span className="text-4xl">{service.icon}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "#c084fc", letterSpacing: "0.15em" }}>
                  {service.subtitle}
                </p>
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {service.desc}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {service.highlights.map((h, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full"
                      style={{ background: "rgba(192,132,252,0.1)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.2)" }}>
                      ✦ {h}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Price</p>
                    <p className="font-bold" style={{ color: "#d4af37" }}>{service.price}</p>
                  </div>
                  <Link
                    to={`/services/${service.id}`}
                    className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
                    style={{
                      background: hoveredId === service.id ? "linear-gradient(135deg, #c084fc, #f472b6)" : "rgba(192,132,252,0.15)",
                      color: "#fff",
                      border: "1px solid rgba(192,132,252,0.3)",
                    }}
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p style={{ color: "rgba(255,255,255,0.4)" }}>No services found. Try a different search!</p>
            <button
              onClick={() => { setSearch(""); setFilter("All"); }}
              className="mt-4 px-6 py-2 rounded-full text-sm font-semibold"
              style={{ background: "rgba(192,132,252,0.2)", color: "#c084fc", border: "1px solid rgba(192,132,252,0.3)" }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Why Choose Us */}
      <div className="py-16 px-6" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#d4af37", letterSpacing: "0.3em" }}>Why Us</p>
            <h2 className="text-3xl font-bold text-white">The BookMyEvent Promise</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🏆", title: "Top Quality", desc: "Handpicked vendors only" },
              { icon: "💰", title: "Best Price", desc: "Price match guarantee" },
              { icon: "🤝", title: "Trusted", desc: "500+ happy families" },
              { icon: "📞", title: "24/7 Support", desc: "Always here for you" },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.15)" }}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="font-bold text-white text-sm mb-1">{item.title}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#d4af37", letterSpacing: "0.3em" }}>Ready?</p>
          <h2 className="text-4xl font-bold text-white mb-4">Let's Plan Your<br /><span style={{ color: "#c084fc" }}>Dream Wedding</span></h2>
          <p className="mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>Talk to our wedding experts today — free consultation!</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
              className="px-8 py-3 rounded-full font-bold text-white transition-all hover:scale-105"
              style={{ background: "#25D366" }}>
              💬 WhatsApp Us
            </a>
            <Link to="/register"
              className="px-8 py-3 rounded-full font-bold transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)", color: "#fff" }}>
              Get Started →
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}