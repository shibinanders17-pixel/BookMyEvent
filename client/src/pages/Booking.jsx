// import { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import api from "../services/api";

// const Booking = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const selectedPackage = location.state?.package;

//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     date: "",
//     venue: "",
//     message: "",
//   });
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async () => {
//     if (!formData.name || !formData.phone || !formData.email || !formData.date || !formData.venue) {
//       setError("Please fill in all required fields!");
//       return;
//     }
//     if (formData.phone.length !== 10) {
//       setError("Please enter a valid 10 digit phone number!");
//       return;
//     }
//     try {
//       await api.post("/users/bookings", {
//         ...formData,
//         package: selectedPackage,
//       });
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.response?.data?.message || "Booking failed. Please try again.");
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

//         {/* Selected Package Card */}
//         {selectedPackage ? (
//           <div className="bg-purple-600 text-white rounded-2xl p-6 mb-8 shadow-lg">
//             <h2 className="text-lg font-bold mb-3">Selected Package 🎯</h2>
//             <div className="grid grid-cols-2 gap-2 text-sm">
//               <div>
//                 <p className="text-white/70">Service</p>
//                 <p className="font-semibold">{selectedPackage.service}</p>
//               </div>
//               <div>
//                 <p className="text-white/70">Event Type</p>
//                 <p className="font-semibold">{selectedPackage.event}</p>
//               </div>
//               <div>
//                 <p className="text-white/70">Duration</p>
//                 <p className="font-semibold">{selectedPackage.duration}</p>
//               </div>
//               <div>
//                 <p className="text-white/70">Price</p>
//                 <p className="font-semibold text-yellow-300">₹{selectedPackage.price?.toLocaleString()}</p>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-yellow-50 text-yellow-600 rounded-2xl p-4 mb-8 text-center">
//             No package selected!
//             <span className="text-purple-600 cursor-pointer ml-1 font-semibold"
//               onClick={() => navigate("/services")}>
//               Choose a service
//             </span>
//           </div>
//         )}

//         {/* Booking Form */}
//         <div className="bg-white rounded-2xl shadow-md p-8">

//           {/* Error */}
//           {error && (
//             <div className="bg-red-50 text-red-500 px-4 py-3 rounded-xl mb-5 text-sm text-center">
//               {error}
//             </div>
//           )}

//           <div className="flex flex-col gap-4">

//             {/* Name */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-1 block">
//                 Full Name *
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Enter your full name"
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition"
//               />
//             </div>

//             {/* Phone */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-1 block">
//                 Phone Number *
//               </label>
//               <input
//                 type="tel"
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 placeholder="Enter your 10 digit phone number"
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition"
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-1 block">
//                 Email Address *
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Enter your email"
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition"
//               />
//             </div>

//             {/* Date */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-1 block">
//                 Event Date *
//               </label>
//               <input
//                 type="date"
//                 name="date"
//                 value={formData.date}
//                 onChange={handleChange}
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition"
//               />
//             </div>

//             {/* Venue */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-1 block">
//                 Event Venue *
//               </label>
//               <input
//                 type="text"
//                 name="venue"
//                 value={formData.venue}
//                 onChange={handleChange}
//                 placeholder="Enter event venue / location"
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition"
//               />
//             </div>

//             {/* Message */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-1 block">
//                 Additional Message (Optional)
//               </label>
//               <textarea
//                 name="message"
//                 value={formData.message}
//                 onChange={handleChange}
//                 placeholder="Any special requirements or notes..."
//                 rows={4}
//                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition resize-none"
//               />
//             </div>

//             {/* Submit */}
//             <button
//               onClick={handleSubmit}
//               className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition mt-2 text-lg"
//             >
//               Confirm Booking
//             </button>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Booking;



import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedPackage = location.state?.package;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    venue: "",
    message: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    // ── Validation ──
    if (!formData.name || !formData.phone || !formData.email || !formData.date || !formData.venue) {
      setError("Please fill in all required fields!");
      return;
    }
    if (formData.phone.length !== 10) {
      setError("Please enter a valid 10 digit phone number!");
      return;
    }
    if (!selectedPackage?.price) {
      setError("No package selected. Please go back and choose a service.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Step 1: Create Razorpay order from backend
      const { data } = await api.post("/users/payment/create-order", {
        amount: selectedPackage.price,
      });

      // Step 2: Open Razorpay Checkout
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "BookMyEvent",
        description: `${selectedPackage.service} - ${selectedPackage.event}`,
        order_id: data.orderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#7c3aed", // purple-600
        },
        handler: async (response) => {
          // Step 3: Verify payment & save booking
          try {
            await api.post("/users/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingData: {
                ...formData,
                package: selectedPackage,
              },
            });
            navigate("/dashboard");
          } catch (err) {
            setError(err.response?.data?.message || "Payment verification failed. Contact support.");
          } finally {
            setLoading(false);
          }
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

        {/* Selected Package Card */}
        {selectedPackage ? (
          <div className="bg-purple-600 text-white rounded-2xl p-6 mb-8 shadow-lg">
            <h2 className="text-lg font-bold mb-3">Selected Package 🎯</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-white/70">Service</p>
                <p className="font-semibold">{selectedPackage.service}</p>
              </div>
              <div>
                <p className="text-white/70">Event Type</p>
                <p className="font-semibold">{selectedPackage.event}</p>
              </div>
              <div>
                <p className="text-white/70">Duration</p>
                <p className="font-semibold">{selectedPackage.duration}</p>
              </div>
              <div>
                <p className="text-white/70">Price</p>
                <p className="font-semibold text-yellow-300">₹{selectedPackage.price?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 text-yellow-600 rounded-2xl p-4 mb-8 text-center">
            No package selected!
            <span
              className="text-purple-600 cursor-pointer ml-1 font-semibold"
              onClick={() => navigate("/services")}
            >
              Choose a service
            </span>
          </div>
        )}

        {/* Booking Form */}
        <div className="bg-white rounded-2xl shadow-md p-8">

          {error && (
            <div className="bg-red-50 text-red-500 px-4 py-3 rounded-xl mb-5 text-sm text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">

            {/* Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your 10 digit phone number"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition"
              />
            </div>

            {/* Date */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Event Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition"
              />
            </div>

            {/* Venue */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Event Venue *</label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="Enter event venue / location"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition"
              />
            </div>

            {/* Message */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Additional Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Any special requirements or notes..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-purple-500 transition resize-none"
              />
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition mt-2 text-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : `Pay ₹${selectedPackage?.price?.toLocaleString() ?? ""} & Confirm`}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;