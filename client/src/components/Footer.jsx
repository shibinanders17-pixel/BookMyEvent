import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-purple-600 text-white font-extrabold text-xl px-3 py-1 rounded-lg">
                BME
              </div>
              <span className="text-xl font-bold text-white">
                Book<span className="text-purple-400">My</span>Event
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your one-stop solution for all event management needs. Making your special moments unforgettable!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-gray-400 hover:text-purple-400 text-sm transition">Home</Link>
              <Link to="/services" className="text-gray-400 hover:text-purple-400 text-sm transition">Services</Link>
              <Link to="/register" className="text-gray-400 hover:text-purple-400 text-sm transition">Register</Link>
              <Link to="/login" className="text-gray-400 hover:text-purple-400 text-sm transition">Login</Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Our Services</h3>
            <div className="flex flex-col gap-2">
              {["Photography", "DJ & Music", "Decoration", "Catering", "Venue Booking", "Makeup Artist"].map((s, i) => (
                <Link key={i} to="/services" className="text-gray-400 hover:text-purple-400 text-sm transition">
                  {s}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Contact Us</h3>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <p>📍 Coimbatore, Tamil Nadu</p>
              <p>📞 +91 98765 43210</p>
              <p>📧 info@bookmyevent.com</p>
              <p>🕐 Mon - Sat: 9AM - 6PM</p>
            </div>

            {/* Social Media */}
            <div className="flex gap-3 mt-4">
              {[
                { icon: "📘", label: "Facebook" },
                { icon: "📸", label: "Instagram" },
                { icon: "🐦", label: "Twitter" },
                { icon: "▶️", label: "YouTube" },
              ].map((social, i) => (
                <button
                  key={i}
                  className="bg-gray-800 hover:bg-purple-600 w-9 h-9 rounded-full flex items-center justify-center transition text-sm"
                  title={social.label}
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <p>© 2025 BookMyEvent. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="#" className="hover:text-purple-400 transition">Privacy Policy</Link>
            <Link to="#" className="hover:text-purple-400 transition">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;