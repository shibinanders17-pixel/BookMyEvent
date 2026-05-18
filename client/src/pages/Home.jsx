
// import { Link } from "react-router-dom";
// import { useState, useEffect } from "react";
// import api from "../services/api";

// const faqs = [
//   { q: "How do I book a service?", a: "Simply browse our services, select a package, and click 'Book Now'. Fill in your details and we'll confirm your booking shortly!" },
//   { q: "Can I book multiple services together?", a: "Yes! You can book multiple services for your event. Contact us directly for combo packages and special discounts." },
//   { q: "How far in advance should I book?", a: "We recommend booking at least 2-3 months in advance for weddings, and 2-4 weeks for other events to ensure availability." },
//   { q: "What is your cancellation policy?", a: "Cancellations made 30 days before the event get a full refund. Within 30 days, 50% refund applies." },
//   { q: "Do you provide services outside Coimbatore?", a: "Yes! We cover Coimbatore and nearby cities including Tirupur, Erode, Salem, and Ooty." },
// ];

// const tagColors = {
//   "Most Popular": "bg-rose-500",
//   "Top Rated": "bg-violet-500",
//   "Trending": "bg-pink-500",
//   "Best Value": "bg-amber-500",
//   "Premium": "bg-blue-500",
//   "New": "bg-emerald-500",
//   "Unique": "bg-orange-500",
// };

// const Home = () => {
//   const [openFaq, setOpenFaq] = useState(null);
//   const [hoveredId, setHoveredId] = useState(null);
//   const [allServices, setAllServices] = useState([]);

//   useEffect(() => {
//     api.get("/users/services")
//       .then(res => setAllServices(res.data))
//       .catch(err => console.error("Failed to fetch services", err));
//   }, []);

//   return (
//     <div style={{ background: "#0f0a1e" }}>

//       {/* Hero Section */}
//       <section
//         className="relative text-white py-20 px-6 text-center"
//         style={{
//           backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1600')`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(15,10,30,0.7), rgba(15,10,30,0.95))" }}></div>
//         <div className="relative z-10 max-w-3xl mx-auto">

//           {/* Gold line */}
//           <div className="flex items-center justify-center mb-6">
//             <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, #d4af37)" }}></div>
//             <span className="mx-3 text-xl">💍</span>
//             <div className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, #d4af37)" }}></div>
//           </div>

//           <span className="text-xs uppercase tracking-widest px-4 py-1 rounded-full mb-4 inline-block"
//             style={{ background: "rgba(212,175,55,0.15)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.3)", letterSpacing: "0.3em" }}>
//             #1 Wedding Planning Platform in Tamil Nadu
//           </span>

//           <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight" style={{ fontFamily: "'Georgia', serif" }}>
//             Your Dream Wedding <br />
//             <span style={{ color: "#c084fc" }}>Starts Here </span>
//           </h1>
//           <p className="text-xl mb-8" style={{ color: "rgba(255,255,255,0.7)" }}>
//             Photography, DJ, Mehendi, Catering, Decoration & more — all in one place!
//           </p>
//           <div className="flex gap-4 justify-center flex-wrap">
//             <Link to="/services"
//               className="font-bold px-8 py-3 rounded-full transition hover:scale-105"
//               style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)", color: "#fff" }}>
//               Explore Services
//             </Link>
//             <a href="https://wa.me/918838333261" target="_blank" rel="noopener noreferrer"
//               className="font-bold px-8 py-3 rounded-full transition hover:scale-105"
//               style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>
//               💬 Contact Us
//             </a>
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="py-10 px-6" style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
//         <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
//           {[
//             { value: "500+", label: "Events Completed" },
//             { value: "350+", label: "Happy Couples" },
//             { value: "12", label: "Services" },
//             { value: "8+", label: "Years Experience" },
//           ].map((stat, i) => (
//             <div key={i}>
//               <p className="text-4xl font-extrabold text-white">{stat.value}</p>
//               <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.8)" }}>{stat.label}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* All 12 Services Section */}
//       <section className="py-16 px-6" style={{ background: "#0f0a1e" }}>
//         <div className="max-w-6xl mx-auto">

//           {/* Section Header */}
//           <div className="text-center mb-12">
//             <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#d4af37", letterSpacing: "0.3em" }}>What We Offer</p>
//             <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Georgia', serif" }}>Our Services</h2>
//             <p style={{ color: "rgba(255,255,255,0.5)" }}>12 premium wedding services — everything under one roof</p>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {allServices.map((service) => (
//               <div
//                 key={service.id}
//                 onMouseEnter={() => setHoveredId(service.id)}
//                 onMouseLeave={() => setHoveredId(null)}
//                 className="rounded-3xl overflow-hidden transition-all duration-500"
//                 style={{
//                   background: "rgba(255,255,255,0.03)",
//                   border: hoveredId === service.id ? "1px solid rgba(192,132,252,0.5)" : "1px solid rgba(255,255,255,0.07)",
//                   transform: hoveredId === service.id ? "translateY(-6px)" : "translateY(0)",
//                   boxShadow: hoveredId === service.id ? "0 20px 40px rgba(192,132,252,0.15)" : "none",
//                 }}
//               >
//                 {/* Image */}
//                 <div className="relative h-44 overflow-hidden">
//                   <img
//                     src={service.styles?.[0]?.img}
//                     alt={service.title}
//                     className="w-full h-full object-cover transition-transform duration-700"
//                     style={{ transform: hoveredId === service.id ? "scale(1.08)" : "scale(1)" }}
//                   />
//                   <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,10,30,0.85) 0%, transparent 60%)" }}></div>

//                   {/* Tag */}
//                   <div className={`absolute top-3 left-3 ${tagColors[service.tag]} text-white text-xs font-bold px-3 py-1 rounded-full`}>
//                     {service.tag}
//                   </div>

//                   {/* Icon */}
//                   <div className="absolute bottom-3 left-4 text-3xl">{service.icon}</div>
//                 </div>

//                 {/* Content */}
//                 <div className="p-5">
//                   <h3 className="text-lg font-bold text-white mb-1">{service.title}</h3>
//                   <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>{service.desc}</p>
//                   <Link
//                     to={`/services/${service.id}`}
//                     className="text-sm font-semibold transition-all"
//                     style={{ color: hoveredId === service.id ? "#f472b6" : "#c084fc" }}
//                   >
//                     View Packages →
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="text-center mt-10">
//             <Link to="/services"
//               className="px-8 py-3 rounded-full font-bold transition hover:scale-105 inline-block"
//               style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)", color: "#fff" }}>
//               View All Services
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* How It Works */}
//       <section className="py-16 px-6" style={{ background: "rgba(255,255,255,0.02)" }}>
//         <div className="max-w-4xl mx-auto">
//           <div className="text-center mb-12">
//             <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#d4af37", letterSpacing: "0.3em" }}>Simple Process</p>
//             <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Georgia', serif" }}>How It Works</h2>
//             <p style={{ color: "rgba(255,255,255,0.5)" }}>Book your dream wedding in 3 simple steps</p>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
//             {[
//               { step: "01", icon: "🔍", title: "Browse Services", desc: "Explore our 12 premium wedding services and packages" },
//               { step: "02", icon: "📅", title: "Select & Book", desc: "Choose your package, fill in event details and confirm booking" },
//               { step: "03", icon: "🎉", title: "Enjoy Your Wedding", desc: "Sit back and relax while we make your wedding unforgettable!" },
//             ].map((item, i) => (
//               <div key={i} className="relative p-8 rounded-3xl"
//                 style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(192,132,252,0.15)" }}>
//                 <div className="text-6xl font-extrabold absolute top-4 left-1/2 -translate-x-1/2 opacity-10" style={{ color: "#c084fc" }}>
//                   {item.step}
//                 </div>
//                 <div className="relative z-10">
//                   <div className="text-5xl mb-4">{item.icon}</div>
//                   <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
//                   <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{item.desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Why Choose Us */}
//       <section className="py-16 px-6" style={{ background: "#0f0a1e" }}>
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-12">
//             <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#d4af37", letterSpacing: "0.3em" }}>Why Us</p>
//             <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Georgia', serif" }}>Why Choose Us?</h2>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
//             {[
//               { icon: "⭐", title: "Top Quality", desc: "We deliver nothing but the best for your special day." },
//               { icon: "💰", title: "Best Price", desc: "Premium services at the most affordable rates." },
//               { icon: "🤝", title: "Trusted Team", desc: "500+ happy couples and counting." },
//               { icon: "📞", title: "24/7 Support", desc: "Always available to assist you anytime." },
//             ].map((item, index) => (
//               <div key={index} className="p-6 rounded-2xl transition hover:scale-105"
//                 style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.15)" }}>
//                 <div className="text-4xl mb-3">{item.icon}</div>
//                 <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
//                 <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{item.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Gallery Section */}
//       <section className="py-16 px-6" style={{ background: "rgba(255,255,255,0.02)" }}>
//         <div className="max-w-5xl mx-auto">
//           <div className="text-center mb-12">
//             <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#d4af37", letterSpacing: "0.3em" }}>Portfolio</p>
//             <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Georgia', serif" }}>Our Work</h2>
//             <p style={{ color: "rgba(255,255,255,0.5)" }}>A glimpse of the magical weddings we've created</p>
//           </div>
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//             {allServices.filter(s => s.img).map((s, i) => (
//               <div key={i} className="relative rounded-2xl overflow-hidden group h-48">
//                 <img src={s.img} alt={s.title}
//                   className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
//                 <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
//                   style={{ background: "rgba(192,132,252,0.6)" }}>
//                   <p className="text-white font-bold text-lg">{s.icon} {s.title}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="text-center mt-8">
//             <Link to="/services"
//               className="px-8 py-3 rounded-full font-bold transition hover:scale-105 inline-block"
//               style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)", color: "#fff" }}>
//               View All Services
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section className="py-16 px-6" style={{ background: "#0f0a1e" }}>
//         <div className="max-w-5xl mx-auto">
//           <div className="text-center mb-12">
//             <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#d4af37", letterSpacing: "0.3em" }}>Reviews</p>
//             <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Georgia', serif" }}>What Our Clients Say</h2>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//             {[
//               { name: "Priya S.", role: "Bride", review: "Amazing service! Our wedding was absolutely perfect thanks to BookMyEvent. Every detail was handled beautifully!", rating: 5 },
//               { name: "Rahul M.", role: "Corporate Client", review: "Best catering and decoration combo. Our event was a huge success. Highly recommended!", rating: 5 },
//               { name: "Sneha K.", role: "Birthday Girl", review: "The photographer was outstanding. Beautiful memories captured forever. Will definitely book again!", rating: 5 },
//             ].map((item, index) => (
//               <div key={index} className="p-6 rounded-2xl transition hover:scale-105"
//                 style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(192,132,252,0.15)" }}>
//                 <div className="flex gap-1 mb-3">
//                   {[...Array(item.rating)].map((_, i) => (
//                     <span key={i} className="text-yellow-400">⭐</span>
//                   ))}
//                 </div>
//                 <p className="mb-4 text-sm italic" style={{ color: "rgba(255,255,255,0.6)" }}>"{item.review}"</p>
//                 <div className="flex items-center gap-3">
//                   <div className="font-bold w-10 h-10 rounded-full flex items-center justify-center text-white"
//                     style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
//                     {item.name.charAt(0)}
//                   </div>
//                   <div>
//                     <p className="font-semibold text-white">{item.name}</p>
//                     <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{item.role}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* FAQ Section */}
//       <section className="py-16 px-6" style={{ background: "rgba(255,255,255,0.02)" }}>
//         <div className="max-w-3xl mx-auto">
//           <div className="text-center mb-12">
//             <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#d4af37", letterSpacing: "0.3em" }}>FAQ</p>
//             <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Georgia', serif" }}>Frequently Asked Questions</h2>
//             <p style={{ color: "rgba(255,255,255,0.5)" }}>Got questions? We have answers!</p>
//           </div>
//           <div className="flex flex-col gap-3">
            
//             {faqs.map((faq, i) => (
//               <div key={i} className="rounded-2xl overflow-hidden"
//                 style={{ border: "1px solid rgba(192,132,252,0.2)", background: "rgba(255,255,255,0.02)" }}>
                  
//                 <button
//                   onClick={() => setOpenFaq(openFaq === i ? null : i)}
//                   className="w-full flex justify-between items-center px-6 py-4 text-left font-semibold transition"
//                   style={{ color: openFaq === i ? "#c084fc" : "#fff" }}
//                 >
//                   {faq.q}
//                   <span className="text-xl ml-4" style={{ color: "#c084fc" }}>{openFaq === i ? "−" : "+"}</span>
//                 </button>
//                 {openFaq === i && (
//                   <div className="px-6 py-4 text-sm" style={{ color: "rgba(255,255,255,0.5)", borderTop: "1px solid rgba(192,132,252,0.1)" }}>
//                     {faq.a}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Custom Request Section */}
//       <section className="py-16 px-6" style={{ background: "#0f0a1e" }}>
//         <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden"
//           style={{ background: "linear-gradient(135deg, rgba(192,132,252,0.12), rgba(244,114,182,0.12))", border: "1px solid rgba(192,132,252,0.25)" }}>
//           <div className="p-10 md:p-14 flex flex-col md:flex-row items-center gap-8">
//             <div className="text-center md:text-left flex-1">
//               <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#d4af37", letterSpacing: "0.3em" }}>Something Special?</p>
//               <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Georgia', serif" }}>
//                 Don't See What You Need? <br />
//                 <span style={{ color: "#c084fc" }}>Send a Custom Request ✨</span>
//               </h2>
//               <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
//                 Have a unique event idea — destination wedding, themed party, corporate gala? Tell us your vision and we'll make it happen!
//               </p>
//               <div className="flex gap-4 flex-wrap justify-center md:justify-start">
//                 <Link to="/custom-request"
//                   className="font-bold px-8 py-3 rounded-full transition hover:scale-105 inline-block"
//                   style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)", color: "#fff" }}>
//                   ✨ Submit Custom Request
//                 </Link>
//                 <a href="https://wa.me/918838333261" target="_blank" rel="noopener noreferrer"
//                   className="font-bold px-8 py-3 rounded-full transition hover:scale-105 inline-block"
//                   style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>
//                   💬 Chat on WhatsApp
//                 </a>
//               </div>
//             </div>
//             <div className="text-8xl select-none">🎊</div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="relative text-white py-24 px-6 text-center"
//         style={{
//           backgroundImage: `url('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600')`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         <div className="absolute inset-0" style={{ background: "rgba(15,10,30,0.88)" }}></div>
//         <div className="relative z-10 max-w-2xl mx-auto">
//           <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#d4af37", letterSpacing: "0.3em" }}>Ready?</p>
//           <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Georgia', serif" }}>
//             Ready to Book Your <br /><span style={{ color: "#c084fc" }}>Dream Wedding? 🎊</span>
//           </h2>
//           <p className="mb-8" style={{ color: "rgba(255,255,255,0.6)" }}>Let us make your special day truly unforgettable!</p>
//           <div className="flex gap-4 justify-center flex-wrap">
//             <Link to="/register"
//               className="font-bold px-8 py-3 rounded-full transition hover:scale-105"
//               style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)", color: "#fff" }}>
//               Get Started Now
//             </Link>
//             <Link to="/services"
//               className="font-bold px-8 py-3 rounded-full transition hover:scale-105"
//               style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>
//               View Services
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* WhatsApp Floating Button */}
//       <a
//         href="https://wa.me/918838333261"
//         target="_blank"
//         rel="noopener noreferrer"
//         className="fixed bottom-6 right-6 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition z-50 text-2xl hover:scale-110"
//         style={{ background: "#25D366" }}
//         title="Chat on WhatsApp"
//       >
//         💬
//       </a>

//     </div>
//   );
// };

// export default Home;







import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";

const faqs = [
  { q: "How do I book a service?", a: "Simply browse our services, select a package, and click 'Book Now'. Fill in your details and we'll confirm your booking shortly!" },
  { q: "Can I book multiple services together?", a: "Yes! You can book multiple services for your event. Contact us directly for combo packages and special discounts." },
  { q: "How far in advance should I book?", a: "We recommend booking at least 2-3 months in advance for weddings, and 2-4 weeks for other events to ensure availability." },
  { q: "What is your cancellation policy?", a: "Cancellations made 30 days before the event get a full refund. Within 30 days, 50% refund applies." },
  { q: "Do you provide services outside Coimbatore?", a: "Yes! We cover Coimbatore and nearby cities including Tirupur, Erode, Salem, and Ooty." },
];

const tagColors = {
  "Most Popular": "bg-rose-500",
  "Top Rated": "bg-violet-500",
  "Trending": "bg-pink-500",
  "Best Value": "bg-amber-500",
  "Premium": "bg-blue-500",
  "New": "bg-emerald-500",
  "Unique": "bg-orange-500",
};

const Home = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [topReviews, setTopReviews] = useState([]);

  useEffect(() => {
    api.get("/users/services")
      .then(res => setAllServices(res.data))
      .catch(err => console.error("Failed to fetch services", err));

    api.get("/users/reviews/top")
      .then(res => setTopReviews(res.data))
      .catch(err => console.error("Failed to fetch reviews", err));
  }, []);

  return (
    <div style={{ background: "#0f0a1e" }}>

      {/* Hero Section */}
      <section
        className="relative text-white py-20 px-6 text-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1600')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(15,10,30,0.7), rgba(15,10,30,0.95))" }}></div>
        <div className="relative z-10 max-w-3xl mx-auto">

          {/* Gold line */}
          <div className="flex items-center justify-center mb-6">
            <div className="h-px w-16" style={{ background: "linear-gradient(to right, transparent, #d4af37)" }}></div>
            <span className="mx-3 text-xl">💍</span>
            <div className="h-px w-16" style={{ background: "linear-gradient(to left, transparent, #d4af37)" }}></div>
          </div>

          <span className="text-xs uppercase tracking-widest px-4 py-1 rounded-full mb-4 inline-block"
            style={{ background: "rgba(212,175,55,0.15)", color: "#d4af37", border: "1px solid rgba(212,175,55,0.3)", letterSpacing: "0.3em" }}>
            #1 Wedding Planning Platform in Tamil Nadu
          </span>

          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight" style={{ fontFamily: "'Georgia', serif" }}>
            Your Dream Wedding <br />
            <span style={{ color: "#c084fc" }}>Starts Here </span>
          </h1>
          <p className="text-xl mb-8" style={{ color: "rgba(255,255,255,0.7)" }}>
            Photography, DJ, Mehendi, Catering, Decoration & more — all in one place!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/services"
              className="font-bold px-8 py-3 rounded-full transition hover:scale-105"
              style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)", color: "#fff" }}>
              Explore Services
            </Link>
            <a href="https://wa.me/918838333261" target="_blank" rel="noopener noreferrer"
              className="font-bold px-8 py-3 rounded-full transition hover:scale-105"
              style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>
              💬 Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 px-6" style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: "500+", label: "Events Completed" },
            { value: "350+", label: "Happy Couples" },
            { value: "12", label: "Services" },
            { value: "8+", label: "Years Experience" },
          ].map((stat, i) => (
            <div key={i}>
              <p className="text-4xl font-extrabold text-white">{stat.value}</p>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.8)" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* All 12 Services Section */}
      <section className="py-16 px-6" style={{ background: "#0f0a1e" }}>
        <div className="max-w-6xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#d4af37", letterSpacing: "0.3em" }}>What We Offer</p>
            <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Georgia', serif" }}>Our Services</h2>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>12 premium wedding services — everything under one roof</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allServices.map((service) => (
              <div
                key={service.id}
                onMouseEnter={() => setHoveredId(service.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="rounded-3xl overflow-hidden transition-all duration-500"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: hoveredId === service.id ? "1px solid rgba(192,132,252,0.5)" : "1px solid rgba(255,255,255,0.07)",
                  transform: hoveredId === service.id ? "translateY(-6px)" : "translateY(0)",
                  boxShadow: hoveredId === service.id ? "0 20px 40px rgba(192,132,252,0.15)" : "none",
                }}
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={service.styles?.[0]?.img}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700"
                    style={{ transform: hoveredId === service.id ? "scale(1.08)" : "scale(1)" }}
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(15,10,30,0.85) 0%, transparent 60%)" }}></div>

                  {/* Tag */}
                  <div className={`absolute top-3 left-3 ${tagColors[service.tag]} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    {service.tag}
                  </div>

                  {/* Icon */}
                  <div className="absolute bottom-3 left-4 text-3xl">{service.icon}</div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-white mb-1">{service.title}</h3>
                  <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.5)" }}>{service.desc}</p>
                  <Link
                    to={`/services/${service.id}`}
                    className="text-sm font-semibold transition-all"
                    style={{ color: hoveredId === service.id ? "#f472b6" : "#c084fc" }}
                  >
                    View Packages →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/services"
              className="px-8 py-3 rounded-full font-bold transition hover:scale-105 inline-block"
              style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)", color: "#fff" }}>
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#d4af37", letterSpacing: "0.3em" }}>Simple Process</p>
            <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Georgia', serif" }}>How It Works</h2>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>Book your dream wedding in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { step: "01", icon: "🔍", title: "Browse Services", desc: "Explore our 12 premium wedding services and packages" },
              { step: "02", icon: "📅", title: "Select & Book", desc: "Choose your package, fill in event details and confirm booking" },
              { step: "03", icon: "🎉", title: "Enjoy Your Wedding", desc: "Sit back and relax while we make your wedding unforgettable!" },
            ].map((item, i) => (
              <div key={i} className="relative p-8 rounded-3xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(192,132,252,0.15)" }}>
                <div className="text-6xl font-extrabold absolute top-4 left-1/2 -translate-x-1/2 opacity-10" style={{ color: "#c084fc" }}>
                  {item.step}
                </div>
                <div className="relative z-10">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-6" style={{ background: "#0f0a1e" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#d4af37", letterSpacing: "0.3em" }}>Why Us</p>
            <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Georgia', serif" }}>Why Choose Us?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { icon: "⭐", title: "Top Quality", desc: "We deliver nothing but the best for your special day." },
              { icon: "💰", title: "Best Price", desc: "Premium services at the most affordable rates." },
              { icon: "🤝", title: "Trusted Team", desc: "500+ happy couples and counting." },
              { icon: "📞", title: "24/7 Support", desc: "Always available to assist you anytime." },
            ].map((item, index) => (
              <div key={index} className="p-6 rounded-2xl transition hover:scale-105"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.15)" }}>
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 px-6" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#d4af37", letterSpacing: "0.3em" }}>Portfolio</p>
            <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Georgia', serif" }}>Our Work</h2>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>A glimpse of the magical weddings we've created</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {allServices.filter(s => s.img).map((s, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden group h-48">
                <img src={s.img} alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                  style={{ background: "rgba(192,132,252,0.6)" }}>
                  <p className="text-white font-bold text-lg">{s.icon} {s.title}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/services"
              className="px-8 py-3 rounded-full font-bold transition hover:scale-105 inline-block"
              style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)", color: "#fff" }}>
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6" style={{ background: "#0f0a1e" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#d4af37", letterSpacing: "0.3em" }}>Reviews</p>
            <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Georgia', serif" }}>What Our Clients Say</h2>
          </div>
          {topReviews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {topReviews.map((item, index) => (
                <div key={index} className="p-6 rounded-2xl transition hover:scale-105"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(192,132,252,0.15)" }}>
                  <div className="flex gap-1 mb-3">
                    {[...Array(item.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                  <p className="mb-4 text-sm italic" style={{ color: "rgba(255,255,255,0.6)" }}>"{item.comment}"</p>
                  <div className="flex items-center gap-3">
                    <div className="font-bold w-10 h-10 rounded-full flex items-center justify-center text-white"
                      style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)" }}>
                      {item.user?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{item.user?.name || "User"}</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{item.serviceName || ""}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#d4af37", letterSpacing: "0.3em" }}>FAQ</p>
            <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Georgia', serif" }}>Frequently Asked Questions</h2>
            <p style={{ color: "rgba(255,255,255,0.5)" }}>Got questions? We have answers!</p>
          </div>
          <div className="flex flex-col gap-3">
            
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl overflow-hidden"
                style={{ border: "1px solid rgba(192,132,252,0.2)", background: "rgba(255,255,255,0.02)" }}>
                  
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center px-6 py-4 text-left font-semibold transition"
                  style={{ color: openFaq === i ? "#c084fc" : "#fff" }}
                >
                  {faq.q}
                  <span className="text-xl ml-4" style={{ color: "#c084fc" }}>{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 py-4 text-sm" style={{ color: "rgba(255,255,255,0.5)", borderTop: "1px solid rgba(192,132,252,0.1)" }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Request Section */}
      <section className="py-16 px-6" style={{ background: "#0f0a1e" }}>
        <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(192,132,252,0.12), rgba(244,114,182,0.12))", border: "1px solid rgba(192,132,252,0.25)" }}>
          <div className="p-10 md:p-14 flex flex-col md:flex-row items-center gap-8">
            <div className="text-center md:text-left flex-1">
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#d4af37", letterSpacing: "0.3em" }}>Something Special?</p>
              <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Georgia', serif" }}>
                Don't See What You Need? <br />
                <span style={{ color: "#c084fc" }}>Send a Custom Request ✨</span>
              </h2>
              <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
                Have a unique event idea — destination wedding, themed party, corporate gala? Tell us your vision and we'll make it happen!
              </p>
              <div className="flex gap-4 flex-wrap justify-center md:justify-start">
                <Link to="/custom-request"
                  className="font-bold px-8 py-3 rounded-full transition hover:scale-105 inline-block"
                  style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)", color: "#fff" }}>
                  ✨ Submit Custom Request
                </Link>
                <a href="https://wa.me/918838333261" target="_blank" rel="noopener noreferrer"
                  className="font-bold px-8 py-3 rounded-full transition hover:scale-105 inline-block"
                  style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>
                  💬 Chat on WhatsApp
                </a>
              </div>
            </div>
            <div className="text-8xl select-none">🎊</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative text-white py-24 px-6 text-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1600')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0" style={{ background: "rgba(15,10,30,0.88)" }}></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "#d4af37", letterSpacing: "0.3em" }}>Ready?</p>
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Georgia', serif" }}>
            Ready to Book Your <br /><span style={{ color: "#c084fc" }}>Dream Wedding? 🎊</span>
          </h2>
          <p className="mb-8" style={{ color: "rgba(255,255,255,0.6)" }}>Let us make your special day truly unforgettable!</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register"
              className="font-bold px-8 py-3 rounded-full transition hover:scale-105"
              style={{ background: "linear-gradient(135deg, #c084fc, #f472b6)", color: "#fff" }}>
              Get Started Now
            </Link>
            <Link to="/services"
              className="font-bold px-8 py-3 rounded-full transition hover:scale-105"
              style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>
              View Services
            </Link>
          </div>
        </div>
      </section>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/918838333261"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition z-50 text-2xl hover:scale-110"
        style={{ background: "#25D366" }}
        title="Chat on WhatsApp"
      >
        💬
      </a>

    </div>
  );
};

export default Home;