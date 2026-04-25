import { Link } from "react-router-dom";
import { useState } from "react";

const services = [
  {
    id: 1,
    icon: "📸",
    title: "Photography",
    subtitle: "Capture Every Moment",
    desc: "Award-winning photographers who tell your love story through breathtaking imagery. Every smile, every tear, every laugh — preserved forever.",
    price: "Starting from ₹5,000",
    tag: "Most Popular",
    tagColor: "bg-rose-500",
    highlights: ["HD & 4K Coverage", "Same Day Edits", "Online Gallery", "Drone Shots"],
    rating: 4.9,
    reviews: 238,
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
  },
  {
    id: 2,
    icon: "🎵",
    title: "DJ & Music",
    subtitle: "Set The Mood",
    desc: "Professional DJs with premium sound systems that transform your event into an electrifying experience. Live bands & orchestras available.",
    price: "Starting from ₹8,000",
    tag: "Top Rated",
    tagColor: "bg-violet-500",
    highlights: ["Live Band Option", "Custom Playlists", "LED Setup", "MC Services"],
    rating: 4.8,
    reviews: 184,
    img: "https://images.unsplash.com/photo-1478146059778-26028b07395a?w=800",
  },
  {
    id: 3,
    icon: "🌸",
    title: "Decoration",
    subtitle: "Design Your Dream",
    desc: "Transforming venues into magical wonderlands. From intimate floral setups to grand mandap decorations — we bring your vision to life.",
    price: "Starting from ₹10,000",
    tag: "Trending",
    tagColor: "bg-pink-500",
    highlights: ["Floral Design", "Mandap Setup", "LED Lighting", "Theme Decor"],
    rating: 4.9,
    reviews: 312,
    img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800",
  },
  {
    id: 4,
    icon: "🍽️",
    title: "Catering",
    subtitle: "Flavours That Wow",
    desc: "Multi-cuisine catering with experienced chefs. From traditional Tamil Sadhya to continental buffets — crafted to delight every palate.",
    price: "Starting from ₹300/plate",
    tag: "Best Value",
    tagColor: "bg-amber-500",
    highlights: ["Multi-Cuisine", "Live Counters", "Hygienic Kitchen", "Custom Menu"],
    rating: 4.7,
    reviews: 421,
    img: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800",
  },
  {
    id: 5,
    icon: "🏨",
    title: "Venue Booking",
    subtitle: "Find Your Perfect Space",
    desc: "Curated venues across Coimbatore — from intimate garden settings to grand banquet halls. Best price guaranteed, zero hassle.",
    price: "Starting from ₹20,000",
    tag: "Premium",
    tagColor: "bg-blue-500",
    highlights: ["100+ Venues", "Price Match", "Site Visit", "AC Halls"],
    rating: 4.8,
    reviews: 156,
    img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800",
  },
  {
    id: 6,
    icon: "💄",
    title: "Makeup Artist",
    subtitle: "Look Absolutely Stunning",
    desc: "Celebrity makeup artists specializing in bridal looks. Airbrush, HD, traditional — we make you look stunning from the first ritual to the last dance.",
    price: "Starting from ₹3,000",
    tag: "New",
    tagColor: "bg-emerald-500",
    highlights: ["Bridal Specialist", "Airbrush Makeup", "HD Finish", "Trial Session"],
    rating: 4.9,
    reviews: 98,
    img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800",
  },
  {
    id: 7,
    icon: "🌿",
    title: "Mehendi Artist",
    subtitle: "Art On Your Hands",
    desc: "Experienced mehendi artists creating intricate bridal designs. Arabic, Rajasthani, Indo-Arabic styles — beautiful art for your special day.",
    price: "Starting from ₹2,000",
    tag: "Trending",
    tagColor: "bg-green-600",
    highlights: ["Bridal Mehendi", "Arabic Style", "Quick Dry", "Home Visit"],
    rating: 4.8,
    reviews: 143,
    img: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800",
  },
  {
    id: 8,
    icon: "👑",
    title: "Wedding Planner",
    subtitle: "Your Personal Coordinator",
    desc: "End-to-end wedding planning by expert coordinators. From vendor management to day-of coordination — we handle everything so you enjoy every moment.",
    price: "Starting from ₹25,000",
    tag: "Premium",
    tagColor: "bg-yellow-600",
    highlights: ["Full Planning", "Vendor Management", "Budget Tracking", "Day Coordination"],
    rating: 4.9,
    reviews: 87,
    img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
  },
  {
    id: 9,
    icon: "💌",
    title: "Invitation Cards",
    subtitle: "First Impressions Matter",
    desc: "Stunning physical & digital wedding invitations. Traditional Tamil designs, modern minimalist styles, and animated e-invites that wow your guests.",
    price: "Starting from ₹1,500",
    tag: "New",
    tagColor: "bg-fuchsia-500",
    highlights: ["Physical Cards", "E-Invites", "WhatsApp Ready", "Custom Design"],
    rating: 4.7,
    reviews: 201,
    img: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800",
  },
  {
    id: 10,
    icon: "🐴",
    title: "Baraat Decoration",
    subtitle: "Grand Entry Awaits",
    desc: "Make a royal entry! Decorated horses, vintage cars, and flower-decorated vehicles for the most unforgettable baraat procession.",
    price: "Starting from ₹8,000",
    tag: "Unique",
    tagColor: "bg-orange-500",
    highlights: ["Decorated Horse", "Vintage Cars", "Flower Decor", "Band Party"],
    rating: 4.6,
    reviews: 62,
    img: "https://images.unsplash.com/photo-1596416836902-af5b00f01be3?w=800",
  },
  {
    id: 11,
    icon: "🎬",
    title: "Videography",
    subtitle: "Relive Every Moment",
    desc: "Cinematic wedding films that capture the emotion, drama, and beauty of your day. 4K drone footage, highlight reels & full ceremony recordings.",
    price: "Starting from ₹10,000",
    tag: "Most Popular",
    tagColor: "bg-red-500",
    highlights: ["4K Cinematic", "Drone Footage", "Highlight Reel", "Same Week Delivery"],
    rating: 4.8,
    reviews: 176,
    img: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800",
  },
  {
    id: 12,
    icon: "🎂",
    title: "Wedding Cake",
    subtitle: "Sweet Celebrations",
    desc: "Custom designed wedding cakes by master bakers. Multi-tier designs, floral fondant, themed cakes — every slice is a work of art.",
    price: "Starting from ₹3,500",
    tag: "New",
    tagColor: "bg-pink-400",
    highlights: ["Custom Design", "Multi-Tier", "Eggless Option", "Fondant Art"],
    rating: 4.8,
    reviews: 119,
    img: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=800",
  },
];

const stats = [
  { value: "500+", label: "Events Done" },
  { value: "300+", label: "Happy Couples" },
  { value: "12", label: "Services" },
  { value: "4.9★", label: "Avg Rating" },
];

const filters = ["All", "Most Popular", "Top Rated", "Trending", "Premium", "Best Value", "New", "Unique"];

export default function Services() {
  const [hoveredId, setHoveredId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = services.filter((s) => {
    const matchFilter = filter === "All" || s.tag === filter;
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

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

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <p className="mb-8 text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
          Showing <span style={{ color: "#c084fc" }}>{filtered.length}</span> services
          {filter !== "All" && <span> in <span style={{ color: "#d4af37" }}>{filter}</span></span>}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service) => (
            <div
              key={service.id}
              onMouseEnter={() => setHoveredId(service.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="rounded-3xl overflow-hidden transition-all duration-500"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: hoveredId === service.id ? "1px solid rgba(192,132,252,0.5)" : "1px solid rgba(255,255,255,0.07)",
                transform: hoveredId === service.id ? "translateY(-8px)" : "translateY(0)",
                boxShadow: hoveredId === service.id ? "0 30px 60px rgba(192,132,252,0.15)" : "none",
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
          ))}
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