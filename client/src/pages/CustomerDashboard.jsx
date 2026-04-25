import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Dummy booking data — Later API call பண்ணுவோம்
const dummyBookings = [
  {
    id: 1,
    service: "Photography",
    event: "💍 Wedding",
    duration: "Full Day (8hrs)",
    price: 15000,
    date: "2025-05-12",
    venue: "Royal Gardens, Coimbatore",
    status: "Confirmed",
  },
  {
    id: 2,
    service: "DJ & Music",
    event: "🎂 Birthday",
    duration: "4hrs",
    price: 8000,
    date: "2025-05-20",
    venue: "Home, Coimbatore",
    status: "Pending",
  },
  {
    id: 3,
    service: "Catering",
    event: "🏢 Corporate",
    duration: "Lunch Package",
    price: 8000,
    date: "2025-05-25",
    venue: "Tech Park, Coimbatore",
    status: "Cancelled",
  },
];

// Dummy user data
const dummyUser = {
  name: "Arun Kumar",
  email: "arun@gmail.com",
  phone: "9876543210",
};

const statusStyles = {
  Confirmed: "bg-green-100 text-green-600",
  Pending: "bg-yellow-100 text-yellow-600",
  Cancelled: "bg-red-100 text-red-600",
};

const statusIcons = {
  Confirmed: "✅",
  Pending: "⏳",
  Cancelled: "❌",
};

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("bookings");

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-10 px-6">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <div className="bg-white text-purple-600 font-extrabold text-2xl w-14 h-14 rounded-full flex items-center justify-center">
            {dummyUser.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">Welcome, {dummyUser.name}! 👋</h1>
            <p className="text-white/80 text-sm">{dummyUser.email}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-6 mt-6">
        <div className="flex gap-4 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`pb-3 font-semibold text-sm transition border-b-2 ${
              activeTab === "bookings"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-purple-600"
            }`}
          >
            📋 My Bookings
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 font-semibold text-sm transition border-b-2 ${
              activeTab === "profile"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-purple-600"
            }`}
          >
            👤 My Profile
          </button>
        </div>

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Total Bookings", value: dummyBookings.length, color: "bg-purple-50 text-purple-600" },
                { label: "Confirmed", value: dummyBookings.filter(b => b.status === "Confirmed").length, color: "bg-green-50 text-green-600" },
                { label: "Pending", value: dummyBookings.filter(b => b.status === "Pending").length, color: "bg-yellow-50 text-yellow-600" },
              ].map((stat, i) => (
                <div key={i} className={`${stat.color} rounded-2xl p-4 text-center`}>
                  <p className="text-3xl font-extrabold">{stat.value}</p>
                  <p className="text-sm font-medium mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Bookings List */}
            {dummyBookings.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">📭</p>
                <p className="text-gray-500 text-lg">No bookings yet!</p>
                <button
                  onClick={() => navigate("/services")}
                  className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition"
                >
                  Book Now
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {dummyBookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-2xl shadow-md p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{booking.service}</h3>
                        <p className="text-gray-500 text-sm">{booking.event} — {booking.duration}</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusStyles[booking.status]}`}>
                        {statusIcons[booking.status]} {booking.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <p>📅 {booking.date}</p>
                      <p>📍 {booking.venue}</p>
                      <p>💰 ₹{booking.price.toLocaleString()}</p>
                    </div>
                    {booking.status === "Pending" && (
                      <button className="mt-4 text-red-500 text-sm font-semibold hover:underline">
                        Cancel Booking
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl shadow-md p-8 max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-6">My Profile</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-500">Full Name</label>
                <p className="font-semibold text-gray-800">{dummyUser.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Email</label>
                <p className="font-semibold text-gray-800">{dummyUser.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Phone</label>
                <p className="font-semibold text-gray-800">{dummyUser.phone}</p>
              </div>
              <button className="mt-4 bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition">
                Edit Profile
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-red-50 text-red-500 py-3 rounded-xl font-bold hover:bg-red-100 transition"
              >
                Logout 🚪
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CustomerDashboard;