// // const jwt      = require("jsonwebtoken");
// // const bcrypt   = require("bcryptjs");
// // const crypto   = require("crypto");
// // const asyncHandler = require("../middleware/asyncHandler");
// // const razorpay = require("../config/razorpay");
// // const User       = require("../models/User");
// // const Booking    = require("../models/Booking");
// // const Service    = require("../models/Service");
// // const CustomRequest = require("../models/CustomRequest");
// // const Notification  = require("../models/Notification");
// // const Review = require("../models/Review");
// // const cloudinary = require("../middleware/Cloudinary");
// // const { sendBookingConfirmation } = require("../config/emailService");
// // const { errorMonitor } = require("nodemailer/lib/xoauth2");

// // const generateToken = (id) =>
// //   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// // const registerUser = asyncHandler(async (req, res) => {
// //   const { name, email, phone, password } = req.body;
// //   const userExists = await User.findOne({ email });
// //   if (userExists)
// //     return res.status(400).json({ message: "User already exists with this email" });
// //   const hashedPassword = await bcrypt.hash(password, 10);
// //   await User.create({ name, email, phone, password: hashedPassword });
// //   res.status(201).json({ status: "success", message: "Registration successfully" });
// // });

// // const loginUser = asyncHandler(async (req, res) => {
// //   const { email, password } = req.body;
// //   const user = await User.findOne({ email });
// //   if (!user)
// //     return res.status(401).json({ message: "Invalid email or password" });
// //   const isMatch = await bcrypt.compare(password, user.password);
// //   if (!isMatch)
// //     return res.status(401).json({ message: "Invalid email or password" });
// //   if (user.isBlocked)
// //     return res.status(403).json({ message: "Your account has been blocked. Please contact support." });
// //   res.status(200).json({
// //     _id: user._id,
// //     name: user.name,
// //     email: user.email,
// //     phone: user.phone,
// //     walletBalance: user.walletBalance,
// //     profileImg: user.profileImg || "",
// //     token: generateToken(user._id),
// //   });
// // });

// // const getUserProfile = asyncHandler(async (req, res) => {
// //   const user = await User.findById(req.user._id).select("-password");
// //   if (!user) return res.status(404).json({ message: "User not found" });
// //   res.status(200).json(user);
// // });

// // const createOrder = asyncHandler(async (req, res) => {
// //   const { amount } = req.body;
// //   if (!amount || amount <= 0)
// //     return res.status(400).json({ message: "Invalid amount" });
// //   const order = await razorpay.orders.create({
// //     amount: amount * 100,
// //     currency: "INR",
// //     receipt: `receipt_${Date.now()}`,
// //   });
// //   res.status(200).json({
// //     orderId: order.id,
// //     amount: order.amount,
// //     currency: order.currency,
// //     key: process.env.RAZORPAY_KEY_ID,
// //   });
// // });

// // const verifyPayment = asyncHandler(async (req, res) => {
// //   const {
// //     razorpay_order_id,
// //     razorpay_payment_id,
// //     razorpay_signature,
// //     bookingData,
// //     paymentType,
// //     walletAmountUsed,
// //   } = req.body;

// //   const isWalletOnly = razorpay_order_id === "WALLET_ONLY";
// //   if (!isWalletOnly) {
// //     const expectedSignature = crypto
// //       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
// //       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
// //       .digest("hex");
// //     if (expectedSignature !== razorpay_signature)
// //       return res.status(400).json({ message: "Payment verification failed" });
// //   }

// //   const totalPrice    = bookingData.package?.price || 0;
// //   const walletUsed    = Number(walletAmountUsed) || 0;
// //   const advanceAmount = paymentType === "advance" ? Math.round(totalPrice * 0.25) : totalPrice;
// //   const remaining     = paymentType === "advance" ? totalPrice - advanceAmount : 0;

// //   if (walletUsed > 0) {
// //     const user = await User.findById(req.user._id);
// //     if (user.walletBalance < walletUsed)
// //       return res.status(400).json({ message: "Insufficient wallet balance" });
// //     user.walletBalance -= walletUsed;
// //     await user.save();
// //   }


// //   // ── Double booking guard ──────────────────────────────────
// //   if (bookingData.date && bookingData.package?.service) {
// //     const conflict = await Booking.findOne({
// //       date:   bookingData.date,
// //       status: { $in: ["confirmed", "pending"] },
// //       $or: [
// //         { "package.service": bookingData.package.service },
// //         { "packages.service": bookingData.package.service },
// //       ],
// //     });
// //     if (conflict)
// //       return res.status(409).json({
// //         message: `⚠️ ${bookingData.package.service} is already booked on ${bookingData.date}. Please choose another date.`,
// //       });
// //   }
// //   // ─────────────────────────────────────────────────────────
// //   const booking = await Booking.create({
// //     user:            req.user._id,
// //     name:            bookingData.name,
// //     phone:           bookingData.phone,
// //     email:           bookingData.email,
// //     date:            bookingData.date,
// //     venue:           bookingData.venue,
// //     message:         bookingData.message || "",
// //     package:         bookingData.package || {},
// //     status:          "confirmed",
// //     paymentId:       razorpay_payment_id,
// //     orderId:         razorpay_order_id,
// //     paymentType:     paymentType || "full",
// //     advanceAmount,
// //     remainingAmount: remaining,
// //     walletUsed,
// //     isCustomEvent:   !!bookingData.customRequestId,
// //     customRequest:   bookingData.customRequestId || null,
// //   });

// //   sendBookingConfirmation(booking).catch(err => console.error("Email error:" , err))

// //   if (bookingData.customRequestId) {
// //     const customReq = await CustomRequest.findById(bookingData.customRequestId);
// //     if (customReq && customReq.status === "accepted") {
// //       customReq.status        = "confirmed";
// //       customReq.linkedBooking = booking._id;
// //       await customReq.save();

// //       await Notification.create({
// //         recipient:     req.user._id,
// //         recipientType: "user",
// //         type:          "custom_request_status",
// //         title:         "Event Confirmed ✅",
// //         message:       "Your custom event booking is confirmed! We look forward to making your event special.",
// //         customRequest: customReq._id,
// //       });

// //       await Notification.create({
// //         recipient:     null,
// //         recipientType: "admin",
// //         type:          "custom_request_status",
// //         title:         "Custom Event Booking Confirmed",
// //         message:       `${customReq.name} has completed payment for ${customReq.eventCategory} event.`,
// //         customRequest: customReq._id,
// //       });
// //     }
// //   }

// //   res.status(201).json({ message: "Booking confirmed!", booking });
// // });

// // const getMyBookings = asyncHandler(async (req, res) => {
// //   const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
// //   res.status(200).json(bookings);
// // });

// // const cancelBooking = asyncHandler(async (req, res) => {
// //   const booking = await Booking.findById(req.params.id);
// //   if (!booking) return res.status(404).json({ message: "Booking not found" });
// //   if (booking.user.toString() !== req.user._id.toString())
// //     return res.status(401).json({ message: "Not authorized to cancel this booking" });

// //   let refundAmount = 0;
// //   if (booking.paymentType === "advance" && booking.advanceAmount > 0) {
// //     refundAmount = booking.advanceAmount;
// //   } else if (booking.paymentType === "full") {
// //     refundAmount = booking.totalAmount || booking.package?.price || 0;
// //   }

// //   if (refundAmount > 0) {
// //     await User.findByIdAndUpdate(req.user._id, { $inc: { walletBalance: refundAmount } });
// //   }

// //   booking.status = "cancelled";
// //   await booking.save();

// //   res.status(200).json({
// //     message: "Booking cancelled successfully",
// //     refundAmount,
// //     refunded: refundAmount > 0,
// //   });
// // });

// // const getWalletBalance = asyncHandler(async (req, res) => {
// //   const user = await User.findById(req.user._id).select("walletBalance");
// //   if (!user) return res.status(404).json({ message: "User not found" });
// //   res.status(200).json({ walletBalance: user.walletBalance });
// // });

// // const getAllServices = asyncHandler(async (req, res) => {
// //   const services = await Service.find().sort({ id: 1 });
// //   res.status(200).json(services);
// // });

// // const getServiceByMongoId = asyncHandler(async (req, res) => {
// //   const service = await Service.findById(req.params.id);
// //   if (!service) return res.status(404).json({ message: "Service not found" });
// //   res.status(200).json(service);
// // });

// // const getServiceByNumericId = asyncHandler(async (req, res) => {
// //   const service = await Service.findOne({ id: Number(req.params.id) });
// //   if (!service) return res.status(404).json({ message: "Service not found" });
// //   res.status(200).json(service);
// // });

// // const checkEmailForReset = asyncHandler(async (req, res) => {
// //   const { email } = req.body;
// //   if (!email) return res.status(400).json({ message: "Email is required" });
// //   const user = await User.findOne({ email: email.toLowerCase() });
// //   if (!user) return res.status(404).json({ message: "No account found with this email address" });
// //   res.status(200).json({ message: "Email verified. You can now reset your password." });
// // });

// // const resetPassword = asyncHandler(async (req, res) => {
// //   const { email, newPassword } = req.body;
// //   if (!email || !newPassword)
// //     return res.status(400).json({ message: "Email and new password are required" });
// //   if (newPassword.length < 6)
// //     return res.status(400).json({ message: "Password must be at least 6 characters" });
// //   const user = await User.findOne({ email: email.toLowerCase() });
// //   if (!user) return res.status(404).json({ message: "No account found with this email address" });
// //   user.password = await bcrypt.hash(newPassword, 10);
// //   await user.save();
// //   res.status(200).json({ message: "Password reset successfully" });
// // });

// // const updateProfile = asyncHandler(async (req, res) => {
// //   const { name, phone } = req.body;
// //   if (!name || !phone) return res.status(400).json({ message: "Name and phone are required" });
// //   if (name.trim().length < 2)
// //     return res.status(400).json({ message: "Name must be at least 2 characters" });
// //   if (phone.length !== 10 || !/^\d{10}$/.test(phone))
// //     return res.status(400).json({ message: "Please enter a valid 10-digit phone number" });
// //   const user = await User.findByIdAndUpdate(
// //     req.user._id,
// //     { name: name.trim(), phone },
// //     { new: true, runValidators: true }
// //   ).select("-password");
// //   if (!user) return res.status(404).json({ message: "User not found" });
// //   res.status(200).json(user);
// // });

// // const changePassword = asyncHandler(async (req, res) => {
// //   const { currentPassword, newPassword } = req.body;
// //   if (!currentPassword || !newPassword)
// //     return res.status(400).json({ message: "All fields are required" });
// //   if (newPassword.length < 6)
// //     return res.status(400).json({ message: "New password must be at least 6 characters" });
// //   const user = await User.findById(req.user._id);
// //   if (!user) return res.status(404).json({ message: "User not found" });
// //   const isMatch = await bcrypt.compare(currentPassword, user.password);
// //   if (!isMatch)
// //     return res.status(400).json({ message: "Current password is incorrect" });
// //   if (await bcrypt.compare(newPassword, user.password))
// //     return res.status(400).json({ message: "New password must be different from current password" });
// //   user.password = await bcrypt.hash(newPassword, 10);
// //   await user.save();
// //   res.status(200).json({ message: "Password changed successfully" });
// // });

// // const verifyMultiPayment = asyncHandler(async (req, res) => {
// //   const {
// //     razorpay_order_id,
// //     razorpay_payment_id,
// //     razorpay_signature,
// //     bookingData,
// //     packages,
// //     totalAmount,
// //     paymentType,
// //     walletAmountUsed,
// //   } = req.body;

// //   const isWalletOnly = razorpay_order_id === "WALLET_ONLY";
// //   if (!isWalletOnly) {
// //     const expectedSig = crypto
// //       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
// //       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
// //       .digest("hex");
// //     if (expectedSig !== razorpay_signature)
// //       return res.status(400).json({ message: "Payment verification failed" });
// //   }

// //   const total      = Number(totalAmount) || 0;
// //   const walletUsed = Number(walletAmountUsed) || 0;
// //   const advanceAmt = paymentType === "advance" ? Math.round(total * 0.25) : total;
// //   const remaining  = paymentType === "advance" ? total - advanceAmt : 0;

// //   if (walletUsed > 0) {
// //     const user = await User.findById(req.user._id);
// //     if (user.walletBalance < walletUsed)
// //       return res.status(400).json({ message: "Insufficient wallet balance" });
// //     user.walletBalance -= walletUsed;
// //     await user.save();
// //   }

// //   // ── Multi-service double booking guard ───────────────────
// //   if (bookingData.date && packages?.length > 0) {
// //     const serviceNames = packages.map(p => p.service);
// //     const conflict = await Booking.findOne({
// //       date:   bookingData.date,
// //       status: { $in: ["confirmed", "pending"] },
// //       $or: [
// //         { "package.service":  { $in: serviceNames } },
// //         { "packages.service": { $in: serviceNames } },
// //       ],
// //     });
// //     if (conflict) {
// //       return res.status(409).json({
// //         message: `⚠️ One or more services are already booked on ${bookingData.date}. Please choose another date.`,
// //       });
// //     }
// //   }
// //   // ─────────────────────────────────────────────────────────

// //   const booking = await Booking.create({
// //     user:            req.user._id,
// //     name:            bookingData.name,
// //     phone:           bookingData.phone,
// //     email:           bookingData.email,
// //     date:            bookingData.date,
// //     venue:           bookingData.venue,
// //     message:         bookingData.message || "",
// //     packages:        packages || [],
// //     isMultiBooking:  true,
// //     totalAmount:     total,
// //     status:          "confirmed",
// //     paymentId:       razorpay_payment_id || "",
// //     orderId:         razorpay_order_id   || "",
// //     paymentType:     paymentType || "full",
// //     advanceAmount:   advanceAmt,
// //     remainingAmount: remaining,
// //     walletUsed,
// //   });
// //   sendBookingConfirmation(booking).catch(err => console.error("Email error:", err));
// //   res.status(201).json({ message: "Multi-booking confirmed!", booking });
// // });



// // const uploadProfileImage = asyncHandler(async (req, res) => {
// //   if (!req.file) return res.status(400).json({ message: "No image provided" });
// //   const imageUrl = req.file.path;
// //   const user = await User.findByIdAndUpdate(
// //     req.user._id,
// //     { profileImg: imageUrl },
// //     { new: true }
// //   ).select("-password");
// //   res.status(200).json({ message: "Profile image updated!", profileImg: imageUrl, user });
// // });

// // const getCart = asyncHandler(async (req, res) => {
// //   const user = await User.findById(req.user._id).select("cart");
// //   res.status(200).json(user.cart || []);
// // });

// // const addToCart = asyncHandler(async (req, res) => {
// //   const { serviceId, serviceTitle, styleId, styleName, styleImg, duration, price, quantity } = req.body;
// //   const user = await User.findById(req.user._id);
// //   const existingIndex = user.cart.findIndex(
// //     item => String(item.serviceId) === String(serviceId) && String(item.styleId) === String(styleId)
// //   );
// //   if (existingIndex >= 0) {
// //     return res.status(200).json({ message: "Already in cart!", cart: user.cart });
// //   }
// //   user.cart.push({ serviceId: String(serviceId), serviceTitle, styleId: String(styleId), styleName, styleImg, duration, price, quantity: quantity || 1 });
// //   await user.save();
// //   res.status(200).json({ message: "Added to cart!", cart: user.cart });
// // });

// // const removeFromCart = asyncHandler(async (req, res) => {
// //   const { serviceId, styleId } = req.body;
// //   const user = await User.findById(req.user._id);
// //   user.cart = user.cart.filter(
// //     item => !(String(item.serviceId) === String(serviceId) && String(item.styleId) === String(styleId))
// //   );
// //   await user.save();
// //   res.status(200).json({ message: "Removed from cart!", cart: user.cart });
// // });

// // const clearCart = asyncHandler(async (req, res) => {
// //   await User.findByIdAndUpdate(req.user._id, { cart: [] });
// //   res.status(200).json({ message: "Cart cleared!" });
// // });

// // const getMyNotifications = asyncHandler(async (req, res) => {
// //   const notifications = await Notification.find({
// //     recipient: req.user._id,
// //     recipientType: "user",
// //   }).sort({ createdAt: -1 }).limit(50);
// //   res.status(200).json(notifications);
// // });

// // const markNotificationRead = asyncHandler(async (req, res) => {
// //   await Notification.findOneAndUpdate(
// //     { _id: req.params.id, recipient: req.user._id },
// //     { isRead: true }
// //   );
// //   res.status(200).json({ message: "Marked as read" });
// // });

// // const markAllNotificationsRead = asyncHandler(async (req, res) => {
// //   await Notification.updateMany(
// //     { recipient: req.user._id, recipientType: "user", isRead: false },
// //     { isRead: true }
// //   );
// //   res.status(200).json({ message: "All marked as read" });
// // });

// // const submitCustomRequest = asyncHandler(async (req, res) => {
// //   const { name, phone, email, eventCategory, services, serviceDetails, date, time, venue, guestCount, budgetRange, notes, preferredContact, duration } = req.body;

// //   if (!name || !phone || !email || !eventCategory || !date || !venue) {
// //     return res.status(400).json({ message: "Please fill all required fields" });
// //   }

// //   const allFiles = req.files || [];
// //   const referenceImages = allFiles
// //     .filter(f => f.fieldname === "referenceImages")
// //     .map(f => f.path || f.secure_url || f.url);

// //   const serviceImages = {};
// //   allFiles
// //     .filter(f => f.fieldname.startsWith("serviceImage_"))
// //     .forEach(f => {
// //       const service = f.fieldname.replace("serviceImage_", "").replace(/_/g, " ");
// //       if (!serviceImages[service]) serviceImages[service] = [];
// //       serviceImages[service].push(f.path || f.secure_url || f.url);
// //     });

// //   const request = await CustomRequest.create({
// //     user: req.user._id,
// //     name, phone, email,
// //     eventCategory,
// //     services: services ? (Array.isArray(services) ? services : JSON.parse(services)) : [],
// //     serviceDetails: serviceDetails ? (typeof serviceDetails === "string" ? JSON.parse(serviceDetails) : serviceDetails) : {},
// //     serviceImages,
// //     date, time, venue,
// //     guestCount: guestCount || 0,
// //     budgetRange: budgetRange || "",
// //     notes: notes || "",
// //     preferredContact: preferredContact || "WhatsApp",
// //     duration: duration || "",
// //     referenceImages,
// //   });

// //   await Notification.create({
// //     recipient: null,
// //     recipientType: "admin",
// //     type: "custom_request_new",
// //     title: "New Custom Request",
// //     message: `${request.name} submitted a new custom request for ${request.eventCategory} on ${request.date}.`,
// //     customRequest: request._id,
// //   });

// //   res.status(201).json({ message: "Custom request submitted successfully!", request });
// // });

// // const getMyCustomRequests = asyncHandler(async (req, res) => {
// //   const requests = await CustomRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
// //   res.status(200).json(requests);
// // });

// // const cancelCustomRequest = asyncHandler(async (req, res) => {
// //   const request = await CustomRequest.findOne({ _id: req.params.id, user: req.user._id });
// //   if (!request) return res.status(404).json({ message: "Request not found" });
// //   if (!["pending", "reviewing"].includes(request.status)) {
// //     return res.status(400).json({ message: "Cannot cancel this request at this stage" });
// //   }
// //   await CustomRequest.deleteOne({ _id: req.params.id });
// //   res.status(200).json({ message: "Request cancelled" });
// // });

// // const respondToQuote = asyncHandler(async (req, res) => {
// //   const { response } = req.body;
// //   if (!["accepted", "declined"].includes(response)) {
// //     return res.status(400).json({ message: "Invalid response" });
// //   }
// //   const request = await CustomRequest.findOne({ _id: req.params.id, user: req.user._id });
// //   if (!request) return res.status(404).json({ message: "Request not found" });
// //   if (request.status !== "quoted") {
// //     return res.status(400).json({ message: "Can only respond when status is 'quoted'" });
// //   }
// //   request.status = response === "accepted" ? "accepted" : "rejected";
// //   await request.save();
// //   await Notification.create({
// //     recipient: null,
// //     recipientType: "admin",
// //     type: "custom_request_status",
// //     title: `Quote ${response === "accepted" ? "Accepted" : "Declined"}`,
// //     message: `${request.name} has ${response} the quote for ${request.eventCategory} event.`,
// //     customRequest: request._id,
// //   });
// //   res.status(200).json({ message: `Quote ${response} successfully`, request });
// // });

// // const submitReview = asyncHandler(async (req, res) => {
// //   const { serviceName, bookingId, rating, comment } = req.body;

// //   const service = await Service.findOne({ title : serviceName});
// //   if (!service)
// //     return res.status(404).json({ message: "Service not found!" });

// //   const existing = await Review.findOne({ booking: bookingId });
// //   if (existing)
// //     return res.status(400).json({ message: "You have already reviewed this booking!" });

// //   const booking = await Booking.findOne({ _id: bookingId, user: req.user._id });
// //   if (!booking)
// //     return res.status(404).json({ message: "Booking not found!" });

// //   const review = await Review.create({
// //     user:    req.user._id,
// //     service: service._id,  // ← _id use பண்றோம்
// //     booking: bookingId,
// //     rating,
// //     comment: comment || "",
// //   });

// //   // Average rating update
// //   const allReviews = await Review.find({ service: service._id });
// //   const avgRating  = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
// //   await Service.findByIdAndUpdate(service._id, {
// //     rating:  Math.round(avgRating * 10) / 10,
// //     reviews: allReviews.length,
// //   });

// //   res.status(201).json({ message: "Review submitted!", review });
// // });

// // const getServiceReviews = asyncHandler(async (req, res) => {
// //   const reviews = await Review.find({ service: req.params.serviceId })
// //     .populate("user", "name profileImg")
// //     .sort({ createdAt: -1 });
// //   res.status(200).json(reviews);
// // });

// // const getMyReviews = asyncHandler(async (req, res) => {
// //   const reviews = await Review.find({ user: req.user._id });
// //   const bookingIds = reviews.map(r => r.booking.toString());
// //   res.status(200).json({ reviewedBookingIds: bookingIds });
// // });

// // const getTopReviews = asyncHandler(async (req, res) => {
// //   const reviews = await Review.find({ rating: 5 })
// //     .populate("user", "name profileImg")
// //     .populate("service", "title")
// //     .sort({ createdAt: -1 })
// //     .limit(3);

// //   const formatted = reviews.map(r => ({
// //     ...r.toObject(),
// //     serviceName: r.service?.title || "",
// //   }));

// //   res.status(200).json(formatted);
// // });


// // module.exports = {
// //   registerUser, loginUser, getUserProfile,
// //   checkEmailForReset, resetPassword,
// //   updateProfile, changePassword,
// //   createOrder, verifyPayment,
// //   verifyMultiPayment,
// //   getMyBookings, cancelBooking,
// //   getWalletBalance,
// //   getCart, addToCart, removeFromCart, clearCart,
// //   getAllServices, getServiceByMongoId, getServiceByNumericId,
// //   uploadProfileImage,
// //   submitCustomRequest, getMyCustomRequests, cancelCustomRequest, respondToQuote,
// //   getMyNotifications, markNotificationRead, markAllNotificationsRead, submitReview, getServiceReviews, getTopReviews, getMyReviews
// // };


// // // ─── Get Availability for all services on a given date ───────────────────────
// // const getDateAvailability = asyncHandler(async (req, res) => {
// //   const { date } = req.query;
// //   if (!date) return res.status(400).json({ message: "Date required" });
// //   const services = await Service.find().select("id title icon styles");
// //   const bookings = await Booking.find({
// //     date,
// //     status: { $in: ["pending", "confirmed"] },
// //   }).select("package packages");
// //   const bookedServices = new Set();
// //   bookings.forEach((b) => {
// //     if (b.package && b.package.service) bookedServices.add(b.package.service);
// //     if (b.packages && b.packages.length) {
// //       b.packages.forEach((p) => bookedServices.add(p.service));
// //     }
// //   });
// //   const availability = services.map((s) => ({
// //     _id: s._id,
// //     numericId: s.id,
// //     title: s.title,
// //     icon: s.icon,
// //     available: !bookedServices.has(s.title),
// //     styles: s.styles || [],
// //   }));
// //   res.status(200).json({ availability });
// // });

// // // ─── Get all dates that have at least one booking ────────────────────────────
// // const getAllBookedDates = asyncHandler(async (req, res) => {
// //   const bookings = await Booking.find({
// //     status: { $in: ["pending", "confirmed"] },
// //   }).select("date");
// //   const seen = new Set();
// //   bookings.forEach((b) => {
// //     if (!b.date) return;
// //     const d = typeof b.date === "string"
// //       ? b.date.split("T")[0]
// //       : new Date(b.date).toISOString().split("T")[0];
// //     seen.add(d);
// //   });
// //   res.status(200).json({ bookedDates: [...seen] });
// // });

// // // Booked dates for a specific service (by service name)
// // const getServiceBookedDates = asyncHandler(async (req, res) => {
// //   const { serviceName } = req.query;
// //   if (!serviceName)
// //     return res.status(400).json({ message: "serviceName is required" });

// //   const bookings = await Booking.find({
// //     status: { $in: ["pending", "confirmed"] },
// //     $or: [
// //       { "package.service": serviceName },
// //       { "packages.service": serviceName },
// //     ],
// //   }).select("date");

// //   const seen = new Set();
// //   bookings.forEach((b) => {
// //     if (!b.date) return;
// //     const d = typeof b.date === "string"
// //       ? b.date.split("T")[0]
// //       : new Date(b.date).toISOString().split("T")[0];
// //     seen.add(d);
// //   });
// //   res.status(200).json({ bookedDates: [...seen] });
// // });

// // module.exports.getDateAvailability   = getDateAvailability;
// // module.exports.getAllBookedDates      = getAllBookedDates;
// // module.exports.getServiceBookedDates = getServiceBookedDates;






// const jwt      = require("jsonwebtoken");
// const bcrypt   = require("bcryptjs");
// const crypto   = require("crypto");
// const asyncHandler = require("../middleware/asyncHandler");
// const razorpay = require("../config/razorpay");
// const User       = require("../models/User");
// const Booking    = require("../models/Booking");
// const Service    = require("../models/Service");
// const CustomRequest = require("../models/CustomRequest");
// const Notification  = require("../models/Notification");
// const Review = require("../models/Review");
// const cloudinary = require("../middleware/Cloudinary");
// const { sendBookingConfirmation } = require("../config/emailService");
// const { errorMonitor } = require("nodemailer/lib/xoauth2");

// const generateToken = (id) =>
//   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, phone, password } = req.body;
//   const userExists = await User.findOne({ email });
//   if (userExists)
//     return res.status(400).json({ message: "User already exists with this email" });
//   const hashedPassword = await bcrypt.hash(password, 10);
//   await User.create({ name, email, phone, password: hashedPassword });
//   res.status(201).json({ status: "success", message: "Registration successfully" });
// });

// const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user)
//     return res.status(401).json({ message: "Invalid email or password" });
//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch)
//     return res.status(401).json({ message: "Invalid email or password" });
//   if (user.isBlocked)
//     return res.status(403).json({ message: "Your account has been blocked. Please contact support." });
//   res.status(200).json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     phone: user.phone,
//     walletBalance: user.walletBalance,
//     profileImg: user.profileImg || "",
//     token: generateToken(user._id),
//   });
// });

// const getUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id).select("-password");
//   if (!user) return res.status(404).json({ message: "User not found" });
//   res.status(200).json(user);
// });

// const createOrder = asyncHandler(async (req, res) => {
//   const { amount } = req.body;
//   if (!amount || amount <= 0)
//     return res.status(400).json({ message: "Invalid amount" });
//   const order = await razorpay.orders.create({
//     amount: amount * 100,
//     currency: "INR",
//     receipt: `receipt_${Date.now()}`,
//   });
//   res.status(200).json({
//     orderId: order.id,
//     amount: order.amount,
//     currency: order.currency,
//     key: process.env.RAZORPAY_KEY_ID,
//   });
// });

// const verifyPayment = asyncHandler(async (req, res) => {
//   const {
//     razorpay_order_id,
//     razorpay_payment_id,
//     razorpay_signature,
//     bookingData,
//     paymentType,
//     walletAmountUsed,
//   } = req.body;

//   const isWalletOnly = razorpay_order_id === "WALLET_ONLY";
//   if (!isWalletOnly) {
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest("hex");
//     if (expectedSignature !== razorpay_signature)
//       return res.status(400).json({ message: "Payment verification failed" });
//   }

//   const totalPrice    = bookingData.package?.price || 0;
//   const walletUsed    = Number(walletAmountUsed) || 0;
//   const advanceAmount = paymentType === "advance" ? Math.round(totalPrice * 0.25) : totalPrice;
//   const remaining     = paymentType === "advance" ? totalPrice - advanceAmount : 0;

//   if (walletUsed > 0) {
//     const user = await User.findById(req.user._id);
//     if (user.walletBalance < walletUsed)
//       return res.status(400).json({ message: "Insufficient wallet balance" });
//     user.walletBalance -= walletUsed;
//     await user.save();
//   }


//   // ── Double booking guard ──────────────────────────────────
//   if (bookingData.date && bookingData.package?.service) {
//     const conflict = await Booking.findOne({
//       date:   bookingData.date,
//       status: { $in: ["confirmed", "pending"] },
//       $or: [
//         { "package.service": bookingData.package.service },
//         { "packages.service": bookingData.package.service },
//       ],
//     });
//     if (conflict)
//       return res.status(409).json({
//         message: `⚠️ ${bookingData.package.service} is already booked on ${bookingData.date}. Please choose another date.`,
//       });
//   }
//   // ─────────────────────────────────────────────────────────
//   const booking = await Booking.create({
//     user:            req.user._id,
//     name:            bookingData.name,
//     phone:           bookingData.phone,
//     email:           bookingData.email,
//     date:            bookingData.date,
//     venue:           bookingData.venue,
//     message:         bookingData.message || "",
//     package:         bookingData.package || {},
//     status:          "confirmed",
//     paymentId:       razorpay_payment_id,
//     orderId:         razorpay_order_id,
//     paymentType:     paymentType || "full",
//     advanceAmount,
//     remainingAmount: remaining,
//     walletUsed,
//     isCustomEvent:   !!bookingData.customRequestId,
//     customRequest:   bookingData.customRequestId || null,
//   });

//   sendBookingConfirmation(booking).catch(err => console.error("Email error:" , err))

//   if (bookingData.customRequestId) {
//     const customReq = await CustomRequest.findById(bookingData.customRequestId);
//     if (customReq && customReq.status === "accepted") {
//       customReq.status        = "confirmed";
//       customReq.linkedBooking = booking._id;
//       await customReq.save();

//       await Notification.create({
//         recipient:     req.user._id,
//         recipientType: "user",
//         type:          "custom_request_status",
//         title:         "Event Confirmed ✅",
//         message:       "Your custom event booking is confirmed! We look forward to making your event special.",
//         customRequest: customReq._id,
//       });

//       await Notification.create({
//         recipient:     null,
//         recipientType: "admin",
//         type:          "custom_request_status",
//         title:         "Custom Event Booking Confirmed",
//         message:       `${customReq.name} has completed payment for ${customReq.eventCategory} event.`,
//         customRequest: customReq._id,
//       });
//     }
//   }

//   res.status(201).json({ message: "Booking confirmed!", booking });
// });

// const getMyBookings = asyncHandler(async (req, res) => {
//   const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
//   res.status(200).json(bookings);
// });

// const cancelBooking = asyncHandler(async (req, res) => {
//   const booking = await Booking.findById(req.params.id);
//   if (!booking) return res.status(404).json({ message: "Booking not found" });
//   if (booking.user.toString() !== req.user._id.toString())
//     return res.status(401).json({ message: "Not authorized to cancel this booking" });

//   let refundAmount = 0;
//   if (booking.paymentType === "advance" && booking.advanceAmount > 0) {
//     refundAmount = booking.advanceAmount;
//   } else if (booking.paymentType === "full") {
//     refundAmount = booking.totalAmount || booking.package?.price || 0;
//   }

//   if (refundAmount > 0) {
//     await User.findByIdAndUpdate(req.user._id, { $inc: { walletBalance: refundAmount } });
//   }

//   booking.status = "cancelled";
//   await booking.save();

//   res.status(200).json({
//     message: "Booking cancelled successfully",
//     refundAmount,
//     refunded: refundAmount > 0,
//   });
// });

// const getWalletBalance = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id).select("walletBalance");
//   if (!user) return res.status(404).json({ message: "User not found" });
//   res.status(200).json({ walletBalance: user.walletBalance });
// });

// const getAllServices = asyncHandler(async (req, res) => {
//   const services = await Service.find().sort({ id: 1 });
//   res.status(200).json(services);
// });

// const getServiceByMongoId = asyncHandler(async (req, res) => {
//   const service = await Service.findById(req.params.id);
//   if (!service) return res.status(404).json({ message: "Service not found" });
//   res.status(200).json(service);
// });

// const getServiceByNumericId = asyncHandler(async (req, res) => {
//   const service = await Service.findOne({ id: Number(req.params.id) });
//   if (!service) return res.status(404).json({ message: "Service not found" });
//   res.status(200).json(service);
// });

// const checkEmailForReset = asyncHandler(async (req, res) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ message: "Email is required" });
//   const user = await User.findOne({ email: email.toLowerCase() });
//   if (!user) return res.status(404).json({ message: "No account found with this email address" });
//   res.status(200).json({ message: "Email verified. You can now reset your password." });
// });

// const resetPassword = asyncHandler(async (req, res) => {
//   const { email, newPassword } = req.body;
//   if (!email || !newPassword)
//     return res.status(400).json({ message: "Email and new password are required" });
//   if (newPassword.length < 6)
//     return res.status(400).json({ message: "Password must be at least 6 characters" });
//   const user = await User.findOne({ email: email.toLowerCase() });
//   if (!user) return res.status(404).json({ message: "No account found with this email address" });
//   user.password = await bcrypt.hash(newPassword, 10);
//   await user.save();
//   res.status(200).json({ message: "Password reset successfully" });
// });

// const updateProfile = asyncHandler(async (req, res) => {
//   const { name, phone } = req.body;
//   if (!name || !phone) return res.status(400).json({ message: "Name and phone are required" });
//   if (name.trim().length < 2)
//     return res.status(400).json({ message: "Name must be at least 2 characters" });
//   if (phone.length !== 10 || !/^\d{10}$/.test(phone))
//     return res.status(400).json({ message: "Please enter a valid 10-digit phone number" });
//   const user = await User.findByIdAndUpdate(
//     req.user._id,
//     { name: name.trim(), phone },
//     { new: true, runValidators: true }
//   ).select("-password");
//   if (!user) return res.status(404).json({ message: "User not found" });
//   res.status(200).json(user);
// });

// const changePassword = asyncHandler(async (req, res) => {
//   const { currentPassword, newPassword } = req.body;
//   if (!currentPassword || !newPassword)
//     return res.status(400).json({ message: "All fields are required" });
//   if (newPassword.length < 6)
//     return res.status(400).json({ message: "New password must be at least 6 characters" });
//   const user = await User.findById(req.user._id);
//   if (!user) return res.status(404).json({ message: "User not found" });
//   const isMatch = await bcrypt.compare(currentPassword, user.password);
//   if (!isMatch)
//     return res.status(400).json({ message: "Current password is incorrect" });
//   if (await bcrypt.compare(newPassword, user.password))
//     return res.status(400).json({ message: "New password must be different from current password" });
//   user.password = await bcrypt.hash(newPassword, 10);
//   await user.save();
//   res.status(200).json({ message: "Password changed successfully" });
// });

// const verifyMultiPayment = asyncHandler(async (req, res) => {
//   const {
//     razorpay_order_id,
//     razorpay_payment_id,
//     razorpay_signature,
//     bookingData,
//     packages,
//     totalAmount,
//     paymentType,
//     walletAmountUsed,
//   } = req.body;

//   const isWalletOnly = razorpay_order_id === "WALLET_ONLY";
//   if (!isWalletOnly) {
//     const expectedSig = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest("hex");
//     if (expectedSig !== razorpay_signature)
//       return res.status(400).json({ message: "Payment verification failed" });
//   }

//   const total      = Number(totalAmount) || 0;
//   const walletUsed = Number(walletAmountUsed) || 0;
//   const advanceAmt = paymentType === "advance" ? Math.round(total * 0.25) : total;
//   const remaining  = paymentType === "advance" ? total - advanceAmt : 0;

//   if (walletUsed > 0) {
//     const user = await User.findById(req.user._id);
//     if (user.walletBalance < walletUsed)
//       return res.status(400).json({ message: "Insufficient wallet balance" });
//     user.walletBalance -= walletUsed;
//     await user.save();
//   }

//   // ── Multi-service double booking guard ───────────────────
//   if (bookingData.date && packages?.length > 0) {
//     const serviceNames = packages.map(p => p.service);
//     const conflict = await Booking.findOne({
//       date:   bookingData.date,
//       status: { $in: ["confirmed", "pending"] },
//       $or: [
//         { "package.service":  { $in: serviceNames } },
//         { "packages.service": { $in: serviceNames } },
//       ],
//     });
//     if (conflict) {
//       return res.status(409).json({
//         message: `⚠️ One or more services are already booked on ${bookingData.date}. Please choose another date.`,
//       });
//     }
//   }
//   // ─────────────────────────────────────────────────────────

//   const booking = await Booking.create({
//     user:            req.user._id,
//     name:            bookingData.name,
//     phone:           bookingData.phone,
//     email:           bookingData.email,
//     date:            bookingData.date,
//     venue:           bookingData.venue,
//     message:         bookingData.message || "",
//     packages:        packages || [],
//     isMultiBooking:  true,
//     totalAmount:     total,
//     status:          "confirmed",
//     paymentId:       razorpay_payment_id || "",
//     orderId:         razorpay_order_id   || "",
//     paymentType:     paymentType || "full",
//     advanceAmount:   advanceAmt,
//     remainingAmount: remaining,
//     walletUsed,
//   });
//   sendBookingConfirmation(booking).catch(err => console.error("Email error:", err));
//   res.status(201).json({ message: "Multi-booking confirmed!", booking });
// });



// const uploadProfileImage = asyncHandler(async (req, res) => {
//   if (!req.file) return res.status(400).json({ message: "No image provided" });
//   const imageUrl = req.file.path;
//   const user = await User.findByIdAndUpdate(
//     req.user._id,
//     { profileImg: imageUrl },
//     { new: true }
//   ).select("-password");
//   res.status(200).json({ message: "Profile image updated!", profileImg: imageUrl, user });
// });

// const getCart = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id).select("cart");
//   res.status(200).json(user.cart || []);
// });

// const addToCart = asyncHandler(async (req, res) => {
//   const { serviceId, serviceTitle, styleId, styleName, styleImg, duration, price, quantity, guestCount, pricePerPlate } = req.body;
//   const user = await User.findById(req.user._id);
//   const existingIndex = user.cart.findIndex(
//     item => String(item.serviceId) === String(serviceId) && String(item.styleId) === String(styleId)
//   );
//   if (existingIndex >= 0) {
//     return res.status(200).json({ message: "Already in cart!", cart: user.cart });
//   }
//   user.cart.push({ serviceId: String(serviceId), serviceTitle, styleId: String(styleId), styleName, styleImg, duration, price, quantity: quantity || 1, guestCount: guestCount || 0, pricePerPlate: pricePerPlate || 0 });
//   await user.save();
//   res.status(200).json({ message: "Added to cart!", cart: user.cart });
// });

// const removeFromCart = asyncHandler(async (req, res) => {
//   const { serviceId, styleId } = req.body;
//   const user = await User.findById(req.user._id);
//   user.cart = user.cart.filter(
//     item => !(String(item.serviceId) === String(serviceId) && String(item.styleId) === String(styleId))
//   );
//   await user.save();
//   res.status(200).json({ message: "Removed from cart!", cart: user.cart });
// });

// const clearCart = asyncHandler(async (req, res) => {
//   await User.findByIdAndUpdate(req.user._id, { cart: [] });
//   res.status(200).json({ message: "Cart cleared!" });
// });

// const getMyNotifications = asyncHandler(async (req, res) => {
//   const notifications = await Notification.find({
//     recipient: req.user._id,
//     recipientType: "user",
//   }).sort({ createdAt: -1 }).limit(50);
//   res.status(200).json(notifications);
// });

// const markNotificationRead = asyncHandler(async (req, res) => {
//   await Notification.findOneAndUpdate(
//     { _id: req.params.id, recipient: req.user._id },
//     { isRead: true }
//   );
//   res.status(200).json({ message: "Marked as read" });
// });

// const markAllNotificationsRead = asyncHandler(async (req, res) => {
//   await Notification.updateMany(
//     { recipient: req.user._id, recipientType: "user", isRead: false },
//     { isRead: true }
//   );
//   res.status(200).json({ message: "All marked as read" });
// });

// const submitCustomRequest = asyncHandler(async (req, res) => {
//   const { name, phone, email, eventCategory, services, serviceDetails, date, time, venue, guestCount, budgetRange, notes, preferredContact, duration } = req.body;

//   if (!name || !phone || !email || !eventCategory || !date || !venue) {
//     return res.status(400).json({ message: "Please fill all required fields" });
//   }

//   const allFiles = req.files || [];
//   const referenceImages = allFiles
//     .filter(f => f.fieldname === "referenceImages")
//     .map(f => f.path || f.secure_url || f.url);

//   const serviceImages = {};
//   allFiles
//     .filter(f => f.fieldname.startsWith("serviceImage_"))
//     .forEach(f => {
//       const service = f.fieldname.replace("serviceImage_", "").replace(/_/g, " ");
//       if (!serviceImages[service]) serviceImages[service] = [];
//       serviceImages[service].push(f.path || f.secure_url || f.url);
//     });

//   const request = await CustomRequest.create({
//     user: req.user._id,
//     name, phone, email,
//     eventCategory,
//     services: services ? (Array.isArray(services) ? services : JSON.parse(services)) : [],
//     serviceDetails: serviceDetails ? (typeof serviceDetails === "string" ? JSON.parse(serviceDetails) : serviceDetails) : {},
//     serviceImages,
//     date, time, venue,
//     guestCount: guestCount || 0,
//     budgetRange: budgetRange || "",
//     notes: notes || "",
//     preferredContact: preferredContact || "WhatsApp",
//     duration: duration || "",
//     referenceImages,
//   });

//   await Notification.create({
//     recipient: null,
//     recipientType: "admin",
//     type: "custom_request_new",
//     title: "New Custom Request",
//     message: `${request.name} submitted a new custom request for ${request.eventCategory} on ${request.date}.`,
//     customRequest: request._id,
//   });

//   res.status(201).json({ message: "Custom request submitted successfully!", request });
// });

// const getMyCustomRequests = asyncHandler(async (req, res) => {
//   const requests = await CustomRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
//   res.status(200).json(requests);
// });

// const cancelCustomRequest = asyncHandler(async (req, res) => {
//   const request = await CustomRequest.findOne({ _id: req.params.id, user: req.user._id });
//   if (!request) return res.status(404).json({ message: "Request not found" });
//   if (!["pending", "reviewing"].includes(request.status)) {
//     return res.status(400).json({ message: "Cannot cancel this request at this stage" });
//   }
//   await CustomRequest.deleteOne({ _id: req.params.id });
//   res.status(200).json({ message: "Request cancelled" });
// });

// const respondToQuote = asyncHandler(async (req, res) => {
//   const { response } = req.body;
//   if (!["accepted", "declined"].includes(response)) {
//     return res.status(400).json({ message: "Invalid response" });
//   }
//   const request = await CustomRequest.findOne({ _id: req.params.id, user: req.user._id });
//   if (!request) return res.status(404).json({ message: "Request not found" });
//   if (request.status !== "quoted") {
//     return res.status(400).json({ message: "Can only respond when status is 'quoted'" });
//   }
//   request.status = response === "accepted" ? "accepted" : "rejected";
//   await request.save();
//   await Notification.create({
//     recipient: null,
//     recipientType: "admin",
//     type: "custom_request_status",
//     title: `Quote ${response === "accepted" ? "Accepted" : "Declined"}`,
//     message: `${request.name} has ${response} the quote for ${request.eventCategory} event.`,
//     customRequest: request._id,
//   });
//   res.status(200).json({ message: `Quote ${response} successfully`, request });
// });

// const submitReview = asyncHandler(async (req, res) => {
//   const { serviceName, bookingId, rating, comment } = req.body;

//   const service = await Service.findOne({ title : serviceName});
//   if (!service)
//     return res.status(404).json({ message: "Service not found!" });

//   const existing = await Review.findOne({ booking: bookingId });
//   if (existing)
//     return res.status(400).json({ message: "You have already reviewed this booking!" });

//   const booking = await Booking.findOne({ _id: bookingId, user: req.user._id });
//   if (!booking)
//     return res.status(404).json({ message: "Booking not found!" });

//   const review = await Review.create({
//     user:    req.user._id,
//     service: service._id,  // ← _id use பண்றோம்
//     booking: bookingId,
//     rating,
//     comment: comment || "",
//   });

//   // Average rating update
//   const allReviews = await Review.find({ service: service._id });
//   const avgRating  = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
//   await Service.findByIdAndUpdate(service._id, {
//     rating:  Math.round(avgRating * 10) / 10,
//     reviews: allReviews.length,
//   });

//   res.status(201).json({ message: "Review submitted!", review });
// });

// const getServiceReviews = asyncHandler(async (req, res) => {
//   const reviews = await Review.find({ service: req.params.serviceId })
//     .populate("user", "name profileImg")
//     .sort({ createdAt: -1 });
//   res.status(200).json(reviews);
// });

// const getMyReviews = asyncHandler(async (req, res) => {
//   const reviews = await Review.find({ user: req.user._id });
//   const bookingIds = reviews.map(r => r.booking.toString());
//   res.status(200).json({ reviewedBookingIds: bookingIds });
// });

// const getTopReviews = asyncHandler(async (req, res) => {
//   const reviews = await Review.find({ rating: 5 })
//     .populate("user", "name profileImg")
//     .populate("service", "title")
//     .sort({ createdAt: -1 })
//     .limit(3);

//   const formatted = reviews.map(r => ({
//     ...r.toObject(),
//     serviceName: r.service?.title || "",
//   }));

//   res.status(200).json(formatted);
// });


// module.exports = {
//   registerUser, loginUser, getUserProfile,
//   checkEmailForReset, resetPassword,
//   updateProfile, changePassword,
//   createOrder, verifyPayment,
//   verifyMultiPayment,
//   getMyBookings, cancelBooking,
//   getWalletBalance,
//   getCart, addToCart, removeFromCart, clearCart,
//   getAllServices, getServiceByMongoId, getServiceByNumericId,
//   uploadProfileImage,
//   submitCustomRequest, getMyCustomRequests, cancelCustomRequest, respondToQuote,
//   getMyNotifications, markNotificationRead, markAllNotificationsRead, submitReview, getServiceReviews, getTopReviews, getMyReviews
// };


// // ─── Get Availability for all services on a given date ───────────────────────
// const getDateAvailability = asyncHandler(async (req, res) => {
//   const { date } = req.query;
//   if (!date) return res.status(400).json({ message: "Date required" });
//   const services = await Service.find().select("id title icon styles");
//   const bookings = await Booking.find({
//     date,
//     status: { $in: ["pending", "confirmed"] },
//   }).select("package packages");
//   const bookedServices = new Set();
//   bookings.forEach((b) => {
//     if (b.package && b.package.service) bookedServices.add(b.package.service);
//     if (b.packages && b.packages.length) {
//       b.packages.forEach((p) => bookedServices.add(p.service));
//     }
//   });
//   const availability = services.map((s) => ({
//     _id: s._id,
//     numericId: s.id,
//     title: s.title,
//     icon: s.icon,
//     available: !bookedServices.has(s.title),
//     styles: s.styles || [],
//   }));
//   res.status(200).json({ availability });
// });

// // ─── Get all dates that have at least one booking ────────────────────────────
// const getAllBookedDates = asyncHandler(async (req, res) => {
//   const bookings = await Booking.find({
//     status: { $in: ["pending", "confirmed"] },
//   }).select("date");
//   const seen = new Set();
//   bookings.forEach((b) => {
//     if (!b.date) return;
//     const d = typeof b.date === "string"
//       ? b.date.split("T")[0]
//       : new Date(b.date).toISOString().split("T")[0];
//     seen.add(d);
//   });
//   res.status(200).json({ bookedDates: [...seen] });
// });

// // Booked dates for a specific service (by service name)
// const getServiceBookedDates = asyncHandler(async (req, res) => {
//   const { serviceName } = req.query;
//   if (!serviceName)
//     return res.status(400).json({ message: "serviceName is required" });

//   const bookings = await Booking.find({
//     status: { $in: ["pending", "confirmed"] },
//     $or: [
//       { "package.service": serviceName },
//       { "packages.service": serviceName },
//     ],
//   }).select("date");

//   const seen = new Set();
//   bookings.forEach((b) => {
//     if (!b.date) return;
//     const d = typeof b.date === "string"
//       ? b.date.split("T")[0]
//       : new Date(b.date).toISOString().split("T")[0];
//     seen.add(d);
//   });
//   res.status(200).json({ bookedDates: [...seen] });
// });

// module.exports.getDateAvailability   = getDateAvailability;
// module.exports.getAllBookedDates      = getAllBookedDates;
// module.exports.getServiceBookedDates = getServiceBookedDates;





// const jwt      = require("jsonwebtoken");
// const bcrypt   = require("bcryptjs");
// const crypto   = require("crypto");
// const asyncHandler = require("../middleware/asyncHandler");
// const razorpay = require("../config/razorpay");
// const User       = require("../models/User");
// const Booking    = require("../models/Booking");
// const Service    = require("../models/Service");
// const CustomRequest = require("../models/CustomRequest");
// const Notification  = require("../models/Notification");
// const Review = require("../models/Review");
// const cloudinary = require("../middleware/Cloudinary");
// const { sendBookingConfirmation } = require("../config/emailService");
// const { errorMonitor } = require("nodemailer/lib/xoauth2");

// const generateToken = (id) =>
//   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, phone, password } = req.body;
//   const userExists = await User.findOne({ email });
//   if (userExists)
//     return res.status(400).json({ message: "User already exists with this email" });
//   const hashedPassword = await bcrypt.hash(password, 10);
//   await User.create({ name, email, phone, password: hashedPassword });
//   res.status(201).json({ status: "success", message: "Registration successfully" });
// });

// const loginUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user)
//     return res.status(401).json({ message: "Invalid email or password" });
//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch)
//     return res.status(401).json({ message: "Invalid email or password" });
//   if (user.isBlocked)
//     return res.status(403).json({ message: "Your account has been blocked. Please contact support." });
//   res.status(200).json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     phone: user.phone,
//     walletBalance: user.walletBalance,
//     profileImg: user.profileImg || "",
//     token: generateToken(user._id),
//   });
// });

// const getUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id).select("-password");
//   if (!user) return res.status(404).json({ message: "User not found" });
//   res.status(200).json(user);
// });

// const createOrder = asyncHandler(async (req, res) => {
//   const { amount } = req.body;
//   if (!amount || amount <= 0)
//     return res.status(400).json({ message: "Invalid amount" });
//   const order = await razorpay.orders.create({
//     amount: amount * 100,
//     currency: "INR",
//     receipt: `receipt_${Date.now()}`,
//   });
//   res.status(200).json({
//     orderId: order.id,
//     amount: order.amount,
//     currency: order.currency,
//     key: process.env.RAZORPAY_KEY_ID,
//   });
// });

// const verifyPayment = asyncHandler(async (req, res) => {
//   const {
//     razorpay_order_id,
//     razorpay_payment_id,
//     razorpay_signature,
//     bookingData,
//     paymentType,
//     walletAmountUsed,
//   } = req.body;

//   const isWalletOnly = razorpay_order_id === "WALLET_ONLY";
//   if (!isWalletOnly) {
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest("hex");
//     if (expectedSignature !== razorpay_signature)
//       return res.status(400).json({ message: "Payment verification failed" });
//   }

//   const totalPrice    = bookingData.package?.price || 0;
//   const walletUsed    = Number(walletAmountUsed) || 0;
//   const advanceAmount = paymentType === "advance" ? Math.round(totalPrice * 0.25) : totalPrice;
//   const remaining     = paymentType === "advance" ? totalPrice - advanceAmount : 0;

//   if (walletUsed > 0) {
//     const user = await User.findById(req.user._id);
//     if (user.walletBalance < walletUsed)
//       return res.status(400).json({ message: "Insufficient wallet balance" });
//     user.walletBalance -= walletUsed;
//     await user.save();
//   }


//   // ── Double booking guard ──────────────────────────────────
//   if (bookingData.date && bookingData.package?.service) {
//     const conflict = await Booking.findOne({
//       date:   bookingData.date,
//       status: { $in: ["confirmed", "pending"] },
//       $or: [
//         { "package.service": bookingData.package.service },
//         { "packages.service": bookingData.package.service },
//       ],
//     });
//     if (conflict)
//       return res.status(409).json({
//         message: `⚠️ ${bookingData.package.service} is already booked on ${bookingData.date}. Please choose another date.`,
//       });
//   }
//   // ─────────────────────────────────────────────────────────
//   const booking = await Booking.create({
//     user:            req.user._id,
//     name:            bookingData.name,
//     phone:           bookingData.phone,
//     email:           bookingData.email,
//     date:            bookingData.date,
//     venue:           bookingData.venue,
//     message:         bookingData.message || "",
//     package:         bookingData.package || {},
//     status:          "confirmed",
//     paymentId:       razorpay_payment_id,
//     orderId:         razorpay_order_id,
//     paymentType:     paymentType || "full",
//     advanceAmount,
//     remainingAmount: remaining,
//     walletUsed,
//     isCustomEvent:   !!bookingData.customRequestId,
//     customRequest:   bookingData.customRequestId || null,
//   });

//   sendBookingConfirmation(booking).catch(err => console.error("Email error:" , err))

//   if (bookingData.customRequestId) {
//     const customReq = await CustomRequest.findById(bookingData.customRequestId);
//     if (customReq && customReq.status === "accepted") {
//       customReq.status        = "confirmed";
//       customReq.linkedBooking = booking._id;
//       await customReq.save();

//       await Notification.create({
//         recipient:     req.user._id,
//         recipientType: "user",
//         type:          "custom_request_status",
//         title:         "Event Confirmed ✅",
//         message:       "Your custom event booking is confirmed! We look forward to making your event special.",
//         customRequest: customReq._id,
//       });

//       await Notification.create({
//         recipient:     null,
//         recipientType: "admin",
//         type:          "custom_request_status",
//         title:         "Custom Event Booking Confirmed",
//         message:       `${customReq.name} has completed payment for ${customReq.eventCategory} event.`,
//         customRequest: customReq._id,
//       });
//     }
//   }

//   res.status(201).json({ message: "Booking confirmed!", booking });
// });

// const getMyBookings = asyncHandler(async (req, res) => {
//   const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
//   res.status(200).json(bookings);
// });

// const cancelBooking = asyncHandler(async (req, res) => {
//   const booking = await Booking.findById(req.params.id);
//   if (!booking) return res.status(404).json({ message: "Booking not found" });
//   if (booking.user.toString() !== req.user._id.toString())
//     return res.status(401).json({ message: "Not authorized to cancel this booking" });

//   let refundAmount = 0;
//   if (booking.paymentType === "advance" && booking.advanceAmount > 0) {
//     refundAmount = booking.advanceAmount;
//   } else if (booking.paymentType === "full") {
//     refundAmount = booking.totalAmount || booking.package?.price || 0;
//   }

//   if (refundAmount > 0) {
//     await User.findByIdAndUpdate(req.user._id, { $inc: { walletBalance: refundAmount } });
//   }

//   booking.status = "cancelled";
//   await booking.save();

//   res.status(200).json({
//     message: "Booking cancelled successfully",
//     refundAmount,
//     refunded: refundAmount > 0,
//   });
// });

// const getWalletBalance = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id).select("walletBalance");
//   if (!user) return res.status(404).json({ message: "User not found" });
//   res.status(200).json({ walletBalance: user.walletBalance });
// });

// const getAllServices = asyncHandler(async (req, res) => {
//   const services = await Service.find().sort({ id: 1 });
//   res.status(200).json(services);
// });

// const getServiceByMongoId = asyncHandler(async (req, res) => {
//   const service = await Service.findById(req.params.id);
//   if (!service) return res.status(404).json({ message: "Service not found" });
//   res.status(200).json(service);
// });

// const getServiceByNumericId = asyncHandler(async (req, res) => {
//   const service = await Service.findOne({ id: Number(req.params.id) });
//   if (!service) return res.status(404).json({ message: "Service not found" });
//   res.status(200).json(service);
// });

// const checkEmailForReset = asyncHandler(async (req, res) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ message: "Email is required" });
//   const user = await User.findOne({ email: email.toLowerCase() });
//   if (!user) return res.status(404).json({ message: "No account found with this email address" });
//   res.status(200).json({ message: "Email verified. You can now reset your password." });
// });

// const resetPassword = asyncHandler(async (req, res) => {
//   const { email, newPassword } = req.body;
//   if (!email || !newPassword)
//     return res.status(400).json({ message: "Email and new password are required" });
//   if (newPassword.length < 6)
//     return res.status(400).json({ message: "Password must be at least 6 characters" });
//   const user = await User.findOne({ email: email.toLowerCase() });
//   if (!user) return res.status(404).json({ message: "No account found with this email address" });
//   user.password = await bcrypt.hash(newPassword, 10);
//   await user.save();
//   res.status(200).json({ message: "Password reset successfully" });
// });

// const updateProfile = asyncHandler(async (req, res) => {
//   const { name, phone } = req.body;
//   if (!name || !phone) return res.status(400).json({ message: "Name and phone are required" });
//   if (name.trim().length < 2)
//     return res.status(400).json({ message: "Name must be at least 2 characters" });
//   if (phone.length !== 10 || !/^\d{10}$/.test(phone))
//     return res.status(400).json({ message: "Please enter a valid 10-digit phone number" });
//   const user = await User.findByIdAndUpdate(
//     req.user._id,
//     { name: name.trim(), phone },
//     { new: true, runValidators: true }
//   ).select("-password");
//   if (!user) return res.status(404).json({ message: "User not found" });
//   res.status(200).json(user);
// });

// const changePassword = asyncHandler(async (req, res) => {
//   const { currentPassword, newPassword } = req.body;
//   if (!currentPassword || !newPassword)
//     return res.status(400).json({ message: "All fields are required" });
//   if (newPassword.length < 6)
//     return res.status(400).json({ message: "New password must be at least 6 characters" });
//   const user = await User.findById(req.user._id);
//   if (!user) return res.status(404).json({ message: "User not found" });
//   const isMatch = await bcrypt.compare(currentPassword, user.password);
//   if (!isMatch)
//     return res.status(400).json({ message: "Current password is incorrect" });
//   if (await bcrypt.compare(newPassword, user.password))
//     return res.status(400).json({ message: "New password must be different from current password" });
//   user.password = await bcrypt.hash(newPassword, 10);
//   await user.save();
//   res.status(200).json({ message: "Password changed successfully" });
// });

// const verifyMultiPayment = asyncHandler(async (req, res) => {
//   const {
//     razorpay_order_id,
//     razorpay_payment_id,
//     razorpay_signature,
//     bookingData,
//     packages,
//     totalAmount,
//     paymentType,
//     walletAmountUsed,
//   } = req.body;

//   const isWalletOnly = razorpay_order_id === "WALLET_ONLY";
//   if (!isWalletOnly) {
//     const expectedSig = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest("hex");
//     if (expectedSig !== razorpay_signature)
//       return res.status(400).json({ message: "Payment verification failed" });
//   }

//   const total      = Number(totalAmount) || 0;
//   const walletUsed = Number(walletAmountUsed) || 0;
//   const advanceAmt = paymentType === "advance" ? Math.round(total * 0.25) : total;
//   const remaining  = paymentType === "advance" ? total - advanceAmt : 0;

//   if (walletUsed > 0) {
//     const user = await User.findById(req.user._id);
//     if (user.walletBalance < walletUsed)
//       return res.status(400).json({ message: "Insufficient wallet balance" });
//     user.walletBalance -= walletUsed;
//     await user.save();
//   }

//   // ── Multi-service double booking guard ───────────────────
//   if (bookingData.date && packages?.length > 0) {
//     const serviceNames = packages.map(p => p.service);
//     const conflict = await Booking.findOne({
//       date:   bookingData.date,
//       status: { $in: ["confirmed", "pending"] },
//       $or: [
//         { "package.service":  { $in: serviceNames } },
//         { "packages.service": { $in: serviceNames } },
//       ],
//     });
//     if (conflict) {
//       return res.status(409).json({
//         message: `⚠️ One or more services are already booked on ${bookingData.date}. Please choose another date.`,
//       });
//     }
//   }
//   // ─────────────────────────────────────────────────────────

//   const booking = await Booking.create({
//     user:            req.user._id,
//     name:            bookingData.name,
//     phone:           bookingData.phone,
//     email:           bookingData.email,
//     date:            bookingData.date,
//     venue:           bookingData.venue,
//     message:         bookingData.message || "",
//     packages:        packages || [],
//     isMultiBooking:  true,
//     totalAmount:     total,
//     status:          "confirmed",
//     paymentId:       razorpay_payment_id || "",
//     orderId:         razorpay_order_id   || "",
//     paymentType:     paymentType || "full",
//     advanceAmount:   advanceAmt,
//     remainingAmount: remaining,
//     walletUsed,
//   });
//   sendBookingConfirmation(booking).catch(err => console.error("Email error:", err));
//   res.status(201).json({ message: "Multi-booking confirmed!", booking });
// });



// const uploadProfileImage = asyncHandler(async (req, res) => {
//   if (!req.file) return res.status(400).json({ message: "No image provided" });
//   const imageUrl = req.file.path;
//   const user = await User.findByIdAndUpdate(
//     req.user._id,
//     { profileImg: imageUrl },
//     { new: true }
//   ).select("-password");
//   res.status(200).json({ message: "Profile image updated!", profileImg: imageUrl, user });
// });

// const getCart = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id).select("cart");
//   res.status(200).json(user.cart || []);
// });

// const addToCart = asyncHandler(async (req, res) => {
//   const { serviceId, serviceTitle, styleId, styleName, styleImg, duration, price, quantity } = req.body;
//   const user = await User.findById(req.user._id);
//   const existingIndex = user.cart.findIndex(
//     item => String(item.serviceId) === String(serviceId) && String(item.styleId) === String(styleId)
//   );
//   if (existingIndex >= 0) {
//     return res.status(200).json({ message: "Already in cart!", cart: user.cart });
//   }
//   user.cart.push({ serviceId: String(serviceId), serviceTitle, styleId: String(styleId), styleName, styleImg, duration, price, quantity: quantity || 1 });
//   await user.save();
//   res.status(200).json({ message: "Added to cart!", cart: user.cart });
// });

// const removeFromCart = asyncHandler(async (req, res) => {
//   const { serviceId, styleId } = req.body;
//   const user = await User.findById(req.user._id);
//   user.cart = user.cart.filter(
//     item => !(String(item.serviceId) === String(serviceId) && String(item.styleId) === String(styleId))
//   );
//   await user.save();
//   res.status(200).json({ message: "Removed from cart!", cart: user.cart });
// });

// const clearCart = asyncHandler(async (req, res) => {
//   await User.findByIdAndUpdate(req.user._id, { cart: [] });
//   res.status(200).json({ message: "Cart cleared!" });
// });

// const getMyNotifications = asyncHandler(async (req, res) => {
//   const notifications = await Notification.find({
//     recipient: req.user._id,
//     recipientType: "user",
//   }).sort({ createdAt: -1 }).limit(50);
//   res.status(200).json(notifications);
// });

// const markNotificationRead = asyncHandler(async (req, res) => {
//   await Notification.findOneAndUpdate(
//     { _id: req.params.id, recipient: req.user._id },
//     { isRead: true }
//   );
//   res.status(200).json({ message: "Marked as read" });
// });

// const markAllNotificationsRead = asyncHandler(async (req, res) => {
//   await Notification.updateMany(
//     { recipient: req.user._id, recipientType: "user", isRead: false },
//     { isRead: true }
//   );
//   res.status(200).json({ message: "All marked as read" });
// });

// const submitCustomRequest = asyncHandler(async (req, res) => {
//   const { name, phone, email, eventCategory, services, serviceDetails, date, time, venue, guestCount, budgetRange, notes, preferredContact, duration } = req.body;

//   if (!name || !phone || !email || !eventCategory || !date || !venue) {
//     return res.status(400).json({ message: "Please fill all required fields" });
//   }

//   const allFiles = req.files || [];
//   const referenceImages = allFiles
//     .filter(f => f.fieldname === "referenceImages")
//     .map(f => f.path || f.secure_url || f.url);

//   const serviceImages = {};
//   allFiles
//     .filter(f => f.fieldname.startsWith("serviceImage_"))
//     .forEach(f => {
//       const service = f.fieldname.replace("serviceImage_", "").replace(/_/g, " ");
//       if (!serviceImages[service]) serviceImages[service] = [];
//       serviceImages[service].push(f.path || f.secure_url || f.url);
//     });

//   const request = await CustomRequest.create({
//     user: req.user._id,
//     name, phone, email,
//     eventCategory,
//     services: services ? (Array.isArray(services) ? services : JSON.parse(services)) : [],
//     serviceDetails: serviceDetails ? (typeof serviceDetails === "string" ? JSON.parse(serviceDetails) : serviceDetails) : {},
//     serviceImages,
//     date, time, venue,
//     guestCount: guestCount || 0,
//     budgetRange: budgetRange || "",
//     notes: notes || "",
//     preferredContact: preferredContact || "WhatsApp",
//     duration: duration || "",
//     referenceImages,
//   });

//   await Notification.create({
//     recipient: null,
//     recipientType: "admin",
//     type: "custom_request_new",
//     title: "New Custom Request",
//     message: `${request.name} submitted a new custom request for ${request.eventCategory} on ${request.date}.`,
//     customRequest: request._id,
//   });

//   res.status(201).json({ message: "Custom request submitted successfully!", request });
// });

// const getMyCustomRequests = asyncHandler(async (req, res) => {
//   const requests = await CustomRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
//   res.status(200).json(requests);
// });

// const cancelCustomRequest = asyncHandler(async (req, res) => {
//   const request = await CustomRequest.findOne({ _id: req.params.id, user: req.user._id });
//   if (!request) return res.status(404).json({ message: "Request not found" });
//   if (!["pending", "reviewing"].includes(request.status)) {
//     return res.status(400).json({ message: "Cannot cancel this request at this stage" });
//   }
//   await CustomRequest.deleteOne({ _id: req.params.id });
//   res.status(200).json({ message: "Request cancelled" });
// });

// const respondToQuote = asyncHandler(async (req, res) => {
//   const { response } = req.body;
//   if (!["accepted", "declined"].includes(response)) {
//     return res.status(400).json({ message: "Invalid response" });
//   }
//   const request = await CustomRequest.findOne({ _id: req.params.id, user: req.user._id });
//   if (!request) return res.status(404).json({ message: "Request not found" });
//   if (request.status !== "quoted") {
//     return res.status(400).json({ message: "Can only respond when status is 'quoted'" });
//   }
//   request.status = response === "accepted" ? "accepted" : "rejected";
//   await request.save();
//   await Notification.create({
//     recipient: null,
//     recipientType: "admin",
//     type: "custom_request_status",
//     title: `Quote ${response === "accepted" ? "Accepted" : "Declined"}`,
//     message: `${request.name} has ${response} the quote for ${request.eventCategory} event.`,
//     customRequest: request._id,
//   });
//   res.status(200).json({ message: `Quote ${response} successfully`, request });
// });

// const submitReview = asyncHandler(async (req, res) => {
//   const { serviceName, bookingId, rating, comment } = req.body;

//   const service = await Service.findOne({ title : serviceName});
//   if (!service)
//     return res.status(404).json({ message: "Service not found!" });

//   const existing = await Review.findOne({ booking: bookingId });
//   if (existing)
//     return res.status(400).json({ message: "You have already reviewed this booking!" });

//   const booking = await Booking.findOne({ _id: bookingId, user: req.user._id });
//   if (!booking)
//     return res.status(404).json({ message: "Booking not found!" });

//   const review = await Review.create({
//     user:    req.user._id,
//     service: service._id,  // ← _id use பண்றோம்
//     booking: bookingId,
//     rating,
//     comment: comment || "",
//   });

//   // Average rating update
//   const allReviews = await Review.find({ service: service._id });
//   const avgRating  = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
//   await Service.findByIdAndUpdate(service._id, {
//     rating:  Math.round(avgRating * 10) / 10,
//     reviews: allReviews.length,
//   });

//   res.status(201).json({ message: "Review submitted!", review });
// });

// const getServiceReviews = asyncHandler(async (req, res) => {
//   const reviews = await Review.find({ service: req.params.serviceId })
//     .populate("user", "name profileImg")
//     .sort({ createdAt: -1 });
//   res.status(200).json(reviews);
// });

// const getMyReviews = asyncHandler(async (req, res) => {
//   const reviews = await Review.find({ user: req.user._id });
//   const bookingIds = reviews.map(r => r.booking.toString());
//   res.status(200).json({ reviewedBookingIds: bookingIds });
// });

// const getTopReviews = asyncHandler(async (req, res) => {
//   const reviews = await Review.find({ rating: 5 })
//     .populate("user", "name profileImg")
//     .populate("service", "title")
//     .sort({ createdAt: -1 })
//     .limit(3);

//   const formatted = reviews.map(r => ({
//     ...r.toObject(),
//     serviceName: r.service?.title || "",
//   }));

//   res.status(200).json(formatted);
// });


// module.exports = {
//   registerUser, loginUser, getUserProfile,
//   checkEmailForReset, resetPassword,
//   updateProfile, changePassword,
//   createOrder, verifyPayment,
//   verifyMultiPayment,
//   getMyBookings, cancelBooking,
//   getWalletBalance,
//   getCart, addToCart, removeFromCart, clearCart,
//   getAllServices, getServiceByMongoId, getServiceByNumericId,
//   uploadProfileImage,
//   submitCustomRequest, getMyCustomRequests, cancelCustomRequest, respondToQuote,
//   getMyNotifications, markNotificationRead, markAllNotificationsRead, submitReview, getServiceReviews, getTopReviews, getMyReviews
// };


// // ─── Get Availability for all services on a given date ───────────────────────
// const getDateAvailability = asyncHandler(async (req, res) => {
//   const { date } = req.query;
//   if (!date) return res.status(400).json({ message: "Date required" });
//   const services = await Service.find().select("id title icon styles");
//   const bookings = await Booking.find({
//     date,
//     status: { $in: ["pending", "confirmed"] },
//   }).select("package packages");
//   const bookedServices = new Set();
//   bookings.forEach((b) => {
//     if (b.package && b.package.service) bookedServices.add(b.package.service);
//     if (b.packages && b.packages.length) {
//       b.packages.forEach((p) => bookedServices.add(p.service));
//     }
//   });
//   const availability = services.map((s) => ({
//     _id: s._id,
//     numericId: s.id,
//     title: s.title,
//     icon: s.icon,
//     available: !bookedServices.has(s.title),
//     styles: s.styles || [],
//   }));
//   res.status(200).json({ availability });
// });

// // ─── Get all dates that have at least one booking ────────────────────────────
// const getAllBookedDates = asyncHandler(async (req, res) => {
//   const bookings = await Booking.find({
//     status: { $in: ["pending", "confirmed"] },
//   }).select("date");
//   const seen = new Set();
//   bookings.forEach((b) => {
//     if (!b.date) return;
//     const d = typeof b.date === "string"
//       ? b.date.split("T")[0]
//       : new Date(b.date).toISOString().split("T")[0];
//     seen.add(d);
//   });
//   res.status(200).json({ bookedDates: [...seen] });
// });

// // Booked dates for a specific service (by service name)
// const getServiceBookedDates = asyncHandler(async (req, res) => {
//   const { serviceName } = req.query;
//   if (!serviceName)
//     return res.status(400).json({ message: "serviceName is required" });

//   const bookings = await Booking.find({
//     status: { $in: ["pending", "confirmed"] },
//     $or: [
//       { "package.service": serviceName },
//       { "packages.service": serviceName },
//     ],
//   }).select("date");

//   const seen = new Set();
//   bookings.forEach((b) => {
//     if (!b.date) return;
//     const d = typeof b.date === "string"
//       ? b.date.split("T")[0]
//       : new Date(b.date).toISOString().split("T")[0];
//     seen.add(d);
//   });
//   res.status(200).json({ bookedDates: [...seen] });
// });

// module.exports.getDateAvailability   = getDateAvailability;
// module.exports.getAllBookedDates      = getAllBookedDates;
// module.exports.getServiceBookedDates = getServiceBookedDates;






const jwt      = require("jsonwebtoken");
const bcrypt   = require("bcryptjs");
const crypto   = require("crypto");
const asyncHandler = require("../middleware/asyncHandler");
const razorpay = require("../config/razorpay");
const User       = require("../models/User");
const Booking    = require("../models/Booking");
const Service    = require("../models/Service");
const CustomRequest = require("../models/CustomRequest");
const Notification  = require("../models/Notification");
const Review = require("../models/Review");
const cloudinary = require("../middleware/Cloudinary");
const {
  sendBookingConfirmation,
  sendBookingCancellation,
  sendOTPEmail,
} = require("../config/emailService");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "User already exists with this email" });
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ name, email, phone, password: hashedPassword });
  res.status(201).json({ status: "success", message: "Registration successfully" });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.status(401).json({ message: "Invalid email or password" });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(401).json({ message: "Invalid email or password" });
  if (user.isBlocked)
    return res.status(403).json({ message: "Your account has been blocked. Please contact support." });
  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    walletBalance: user.walletBalance,
    profileImg: user.profileImg || "",
    token: generateToken(user._id),
  });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json(user);
});

const createOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0)
    return res.status(400).json({ message: "Invalid amount" });
  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });
  res.status(200).json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    key: process.env.RAZORPAY_KEY_ID,
  });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingData,
    paymentType,
    walletAmountUsed,
  } = req.body;

  const isWalletOnly = razorpay_order_id === "WALLET_ONLY";
  if (!isWalletOnly) {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    if (expectedSignature !== razorpay_signature)
      return res.status(400).json({ message: "Payment verification failed" });
  }

  const totalPrice    = bookingData.package?.price || 0;
  const walletUsed    = Number(walletAmountUsed) || 0;
  const advanceAmount = paymentType === "advance" ? Math.round(totalPrice * 0.25) : totalPrice;
  const remaining     = paymentType === "advance" ? totalPrice - advanceAmount : 0;

  if (walletUsed > 0) {
    const user = await User.findById(req.user._id);
    if (user.walletBalance < walletUsed)
      return res.status(400).json({ message: "Insufficient wallet balance" });
    user.walletBalance -= walletUsed;
    await user.save();
  }


  // ── Double booking guard ──────────────────────────────────
  if (bookingData.date && bookingData.package?.service) {
    const conflict = await Booking.findOne({
      date:   bookingData.date,
      status: { $in: ["confirmed", "pending"] },
      $or: [
        { "package.service": bookingData.package.service },
        { "packages.service": bookingData.package.service },
      ],
    });
    if (conflict)
      return res.status(409).json({
        message: `⚠️ ${bookingData.package.service} is already booked on ${bookingData.date}. Please choose another date.`,
      });
  }
  // ─────────────────────────────────────────────────────────
  const booking = await Booking.create({
    user:            req.user._id,
    name:            bookingData.name,
    phone:           bookingData.phone,
    email:           bookingData.email,
    date:            bookingData.date,
    venue:           bookingData.venue,
    message:         bookingData.message || "",
    package:         bookingData.package || {},
    status:          "confirmed",
    paymentId:       razorpay_payment_id,
    orderId:         razorpay_order_id,
    paymentType:     paymentType || "full",
    advanceAmount,
    remainingAmount: remaining,
    walletUsed,
    isCustomEvent:   !!bookingData.customRequestId,
    customRequest:   bookingData.customRequestId || null,
  });

  sendBookingConfirmation(booking).catch(err => console.error("Email error:" , err))

  if (bookingData.customRequestId) {
    const customReq = await CustomRequest.findById(bookingData.customRequestId);
    if (customReq && customReq.status === "accepted") {
      customReq.status        = "confirmed";
      customReq.linkedBooking = booking._id;
      await customReq.save();

      await Notification.create({
        recipient:     req.user._id,
        recipientType: "user",
        type:          "custom_request_status",
        title:         "Event Confirmed ✅",
        message:       "Your custom event booking is confirmed! We look forward to making your event special.",
        customRequest: customReq._id,
      });

      await Notification.create({
        recipient:     null,
        recipientType: "admin",
        type:          "custom_request_status",
        title:         "Custom Event Booking Confirmed",
        message:       `${customReq.name} has completed payment for ${customReq.eventCategory} event.`,
        customRequest: customReq._id,
      });
    }
  }

  res.status(201).json({ message: "Booking confirmed!", booking });
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(bookings);
});

const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  if (booking.user.toString() !== req.user._id.toString())
    return res.status(401).json({ message: "Not authorized to cancel this booking" });

  let refundAmount = 0;
  if (booking.paymentType === "advance" && booking.advanceAmount > 0) {
    refundAmount = booking.advanceAmount;
  } else if (booking.paymentType === "full") {
    refundAmount = booking.totalAmount || booking.package?.price || 0;
  }

  if (refundAmount > 0) {
    await User.findByIdAndUpdate(req.user._id, { $inc: { walletBalance: refundAmount } });
  }

  booking.status = "cancelled";
  await booking.save();

  // Send cancellation email
  sendBookingCancellation({
    name:         booking.name,
    email:        booking.email,
    date:         booking.date,
    venue:        booking.venue,
    refundAmount,
  }).catch(err => console.error("Cancellation email error:", err));

  res.status(200).json({
    message: "Booking cancelled successfully",
    refundAmount,
    refunded: refundAmount > 0,
  });
});

const getWalletBalance = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("walletBalance");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json({ walletBalance: user.walletBalance });
});

const getAllServices = asyncHandler(async (req, res) => {
  const services = await Service.find().sort({ id: 1 });
  res.status(200).json(services);
});

const getServiceByMongoId = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ message: "Service not found" });
  res.status(200).json(service);
});

const getServiceByNumericId = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ id: Number(req.params.id) });
  if (!service) return res.status(404).json({ message: "Service not found" });
  res.status(200).json(service);
});

// Step 1 — verify email & send OTP
const checkEmailForReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(404).json({ message: "No account found with this email address" });

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetOTP       = otp;
  user.resetOTPExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await user.save();

  sendOTPEmail({ name: user.name, email: user.email, otp })
    .catch(err => console.error("OTP email error:", err));

  res.status(200).json({ message: "OTP sent to your email address." });
});

// Step 2 — verify OTP
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(404).json({ message: "No account found with this email address" });
  if (!user.resetOTP || user.resetOTP !== otp)
    return res.status(400).json({ message: "Invalid OTP" });
  if (user.resetOTPExpiry < new Date())
    return res.status(400).json({ message: "OTP has expired. Please request a new one." });
  res.status(200).json({ message: "OTP verified. You can now reset your password." });
});

// Step 3 — reset password
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword)
    return res.status(400).json({ message: "Email, OTP and new password are required" });
  if (newPassword.length < 6)
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(404).json({ message: "No account found with this email address" });
  if (!user.resetOTP || user.resetOTP !== otp)
    return res.status(400).json({ message: "Invalid OTP" });
  if (user.resetOTPExpiry < new Date())
    return res.status(400).json({ message: "OTP has expired. Please request a new one." });

  user.password       = await bcrypt.hash(newPassword, 10);
  user.resetOTP       = null;
  user.resetOTPExpiry = null;
  await user.save();
  res.status(200).json({ message: "Password reset successfully" });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) return res.status(400).json({ message: "Name and phone are required" });
  if (name.trim().length < 2)
    return res.status(400).json({ message: "Name must be at least 2 characters" });
  if (phone.length !== 10 || !/^\d{10}$/.test(phone))
    return res.status(400).json({ message: "Please enter a valid 10-digit phone number" });
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name: name.trim(), phone },
    { new: true, runValidators: true }
  ).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json(user);
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return res.status(400).json({ message: "All fields are required" });
  if (newPassword.length < 6)
    return res.status(400).json({ message: "New password must be at least 6 characters" });
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch)
    return res.status(400).json({ message: "Current password is incorrect" });
  if (await bcrypt.compare(newPassword, user.password))
    return res.status(400).json({ message: "New password must be different from current password" });
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.status(200).json({ message: "Password changed successfully" });
});

const verifyMultiPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingData,
    packages,
    totalAmount,
    paymentType,
    walletAmountUsed,
  } = req.body;

  const isWalletOnly = razorpay_order_id === "WALLET_ONLY";
  if (!isWalletOnly) {
    const expectedSig = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
    if (expectedSig !== razorpay_signature)
      return res.status(400).json({ message: "Payment verification failed" });
  }

  const total      = Number(totalAmount) || 0;
  const walletUsed = Number(walletAmountUsed) || 0;
  const advanceAmt = paymentType === "advance" ? Math.round(total * 0.25) : total;
  const remaining  = paymentType === "advance" ? total - advanceAmt : 0;

  if (walletUsed > 0) {
    const user = await User.findById(req.user._id);
    if (user.walletBalance < walletUsed)
      return res.status(400).json({ message: "Insufficient wallet balance" });
    user.walletBalance -= walletUsed;
    await user.save();
  }

  // ── Multi-service double booking guard ───────────────────
  if (bookingData.date && packages?.length > 0) {
    const serviceNames = packages.map(p => p.service);
    const conflict = await Booking.findOne({
      date:   bookingData.date,
      status: { $in: ["confirmed", "pending"] },
      $or: [
        { "package.service":  { $in: serviceNames } },
        { "packages.service": { $in: serviceNames } },
      ],
    });
    if (conflict) {
      return res.status(409).json({
        message: `⚠️ One or more services are already booked on ${bookingData.date}. Please choose another date.`,
      });
    }
  }
  // ─────────────────────────────────────────────────────────

  const booking = await Booking.create({
    user:            req.user._id,
    name:            bookingData.name,
    phone:           bookingData.phone,
    email:           bookingData.email,
    date:            bookingData.date,
    venue:           bookingData.venue,
    message:         bookingData.message || "",
    packages:        packages || [],
    isMultiBooking:  true,
    totalAmount:     total,
    status:          "confirmed",
    paymentId:       razorpay_payment_id || "",
    orderId:         razorpay_order_id   || "",
    paymentType:     paymentType || "full",
    advanceAmount:   advanceAmt,
    remainingAmount: remaining,
    walletUsed,
  });
  sendBookingConfirmation(booking).catch(err => console.error("Email error:", err));
  res.status(201).json({ message: "Multi-booking confirmed!", booking });
});



const uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No image provided" });
  const imageUrl = req.file.path;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profileImg: imageUrl },
    { new: true }
  ).select("-password");
  res.status(200).json({ message: "Profile image updated!", profileImg: imageUrl, user });
});

const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("cart");
  res.status(200).json(user.cart || []);
});

const addToCart = asyncHandler(async (req, res) => {
  const { serviceId, serviceTitle, styleId, styleName, styleImg, duration, price, quantity, guestCount, pricePerPlate } = req.body;
  const user = await User.findById(req.user._id);
  const existingIndex = user.cart.findIndex(
    item => String(item.serviceId) === String(serviceId) && String(item.styleId) === String(styleId)
  );
  if (existingIndex >= 0) {
    return res.status(200).json({ message: "Already in cart!", cart: user.cart });
  }
  user.cart.push({ serviceId: String(serviceId), serviceTitle, styleId: String(styleId), styleName, styleImg, duration, price, quantity: quantity || 1, guestCount: guestCount || 0, pricePerPlate: pricePerPlate || 0 });
  await user.save();
  res.status(200).json({ message: "Added to cart!", cart: user.cart });
});

const removeFromCart = asyncHandler(async (req, res) => {
  const { serviceId, styleId } = req.body;
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter(
    item => !(String(item.serviceId) === String(serviceId) && String(item.styleId) === String(styleId))
  );
  await user.save();
  res.status(200).json({ message: "Removed from cart!", cart: user.cart });
});

const clearCart = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { cart: [] });
  res.status(200).json({ message: "Cart cleared!" });
});

const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    recipient: req.user._id,
    recipientType: "user",
  }).sort({ createdAt: -1 }).limit(50);
  res.status(200).json(notifications);
});

const markNotificationRead = asyncHandler(async (req, res) => {
  await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { isRead: true }
  );
  res.status(200).json({ message: "Marked as read" });
});

const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, recipientType: "user", isRead: false },
    { isRead: true }
  );
  res.status(200).json({ message: "All marked as read" });
});

const submitCustomRequest = asyncHandler(async (req, res) => {
  const { name, phone, email, eventCategory, services, serviceDetails, date, time, venue, guestCount, budgetRange, notes, preferredContact, duration } = req.body;

  if (!name || !phone || !email || !eventCategory || !date || !venue) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }

  const allFiles = req.files || [];
  const referenceImages = allFiles
    .filter(f => f.fieldname === "referenceImages")
    .map(f => f.path || f.secure_url || f.url);

  const serviceImages = {};
  allFiles
    .filter(f => f.fieldname.startsWith("serviceImage_"))
    .forEach(f => {
      const service = f.fieldname.replace("serviceImage_", "").replace(/_/g, " ");
      if (!serviceImages[service]) serviceImages[service] = [];
      serviceImages[service].push(f.path || f.secure_url || f.url);
    });

  const request = await CustomRequest.create({
    user: req.user._id,
    name, phone, email,
    eventCategory,
    services: services ? (Array.isArray(services) ? services : JSON.parse(services)) : [],
    serviceDetails: serviceDetails ? (typeof serviceDetails === "string" ? JSON.parse(serviceDetails) : serviceDetails) : {},
    serviceImages,
    date, time, venue,
    guestCount: guestCount || 0,
    budgetRange: budgetRange || "",
    notes: notes || "",
    preferredContact: preferredContact || "WhatsApp",
    duration: duration || "",
    referenceImages,
  });

  await Notification.create({
    recipient: null,
    recipientType: "admin",
    type: "custom_request_new",
    title: "New Custom Request",
    message: `${request.name} submitted a new custom request for ${request.eventCategory} on ${request.date}.`,
    customRequest: request._id,
  });

  res.status(201).json({ message: "Custom request submitted successfully!", request });
});

const getMyCustomRequests = asyncHandler(async (req, res) => {
  const requests = await CustomRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(requests);
});

const cancelCustomRequest = asyncHandler(async (req, res) => {
  const request = await CustomRequest.findOne({ _id: req.params.id, user: req.user._id });
  if (!request) return res.status(404).json({ message: "Request not found" });
  if (!["pending", "reviewing"].includes(request.status)) {
    return res.status(400).json({ message: "Cannot cancel this request at this stage" });
  }
  await CustomRequest.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: "Request cancelled" });
});

const respondToQuote = asyncHandler(async (req, res) => {
  const { response } = req.body;
  if (!["accepted", "declined"].includes(response)) {
    return res.status(400).json({ message: "Invalid response" });
  }
  const request = await CustomRequest.findOne({ _id: req.params.id, user: req.user._id });
  if (!request) return res.status(404).json({ message: "Request not found" });
  if (request.status !== "quoted") {
    return res.status(400).json({ message: "Can only respond when status is 'quoted'" });
  }
  request.status = response === "accepted" ? "accepted" : "rejected";
  await request.save();
  await Notification.create({
    recipient: null,
    recipientType: "admin",
    type: "custom_request_status",
    title: `Quote ${response === "accepted" ? "Accepted" : "Declined"}`,
    message: `${request.name} has ${response} the quote for ${request.eventCategory} event.`,
    customRequest: request._id,
  });
  res.status(200).json({ message: `Quote ${response} successfully`, request });
});

const submitReview = asyncHandler(async (req, res) => {
  const { serviceName, bookingId, rating, comment } = req.body;

  const service = await Service.findOne({ title : serviceName});
  if (!service)
    return res.status(404).json({ message: "Service not found!" });

  const existing = await Review.findOne({ booking: bookingId });
  if (existing)
    return res.status(400).json({ message: "You have already reviewed this booking!" });

  const booking = await Booking.findOne({ _id: bookingId, user: req.user._id });
  if (!booking)
    return res.status(404).json({ message: "Booking not found!" });

  const review = await Review.create({
    user:    req.user._id,
    service: service._id,  // ← _id use பண்றோம்
    booking: bookingId,
    rating,
    comment: comment || "",
  });

  // Average rating update
  const allReviews = await Review.find({ service: service._id });
  const avgRating  = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
  await Service.findByIdAndUpdate(service._id, {
    rating:  Math.round(avgRating * 10) / 10,
    reviews: allReviews.length,
  });

  res.status(201).json({ message: "Review submitted!", review });
});

const getServiceReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ service: req.params.serviceId })
    .populate("user", "name profileImg")
    .sort({ createdAt: -1 });
  res.status(200).json(reviews);
});

const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.user._id });
  const bookingIds = reviews.map(r => r.booking.toString());
  res.status(200).json({ reviewedBookingIds: bookingIds });
});

const getTopReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ rating: 5 })
    .populate("user", "name profileImg")
    .populate("service", "title")
    .sort({ createdAt: -1 })
    .limit(3);

  const formatted = reviews.map(r => ({
    ...r.toObject(),
    serviceName: r.service?.title || "",
  }));

  res.status(200).json(formatted);
});


module.exports = {
  registerUser, loginUser, getUserProfile,
  checkEmailForReset, verifyOTP, resetPassword,
  updateProfile, changePassword,
  createOrder, verifyPayment,
  verifyMultiPayment,
  getMyBookings, cancelBooking,
  getWalletBalance,
  getCart, addToCart, removeFromCart, clearCart,
  getAllServices, getServiceByMongoId, getServiceByNumericId,
  uploadProfileImage,
  submitCustomRequest, getMyCustomRequests, cancelCustomRequest, respondToQuote,
  getMyNotifications, markNotificationRead, markAllNotificationsRead, submitReview, getServiceReviews, getTopReviews, getMyReviews
};


// ─── Get Availability for all services on a given date ───────────────────────
const getDateAvailability = asyncHandler(async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: "Date required" });
  const services = await Service.find().select("id title icon styles");
  const bookings = await Booking.find({
    date,
    status: { $in: ["pending", "confirmed"] },
  }).select("package packages");
  const bookedServices = new Set();
  bookings.forEach((b) => {
    if (b.package && b.package.service) bookedServices.add(b.package.service);
    if (b.packages && b.packages.length) {
      b.packages.forEach((p) => bookedServices.add(p.service));
    }
  });
  const availability = services.map((s) => ({
    _id: s._id,
    numericId: s.id,
    title: s.title,
    icon: s.icon,
    available: !bookedServices.has(s.title),
    styles: s.styles || [],
  }));
  res.status(200).json({ availability });
});

// ─── Get all dates that have at least one booking ────────────────────────────
const getAllBookedDates = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({
    status: { $in: ["pending", "confirmed"] },
  }).select("date");
  const seen = new Set();
  bookings.forEach((b) => {
    if (!b.date) return;
    const d = typeof b.date === "string"
      ? b.date.split("T")[0]
      : new Date(b.date).toISOString().split("T")[0];
    seen.add(d);
  });
  res.status(200).json({ bookedDates: [...seen] });
});

// Booked dates for a specific service (by service name)
const getServiceBookedDates = asyncHandler(async (req, res) => {
  const { serviceName } = req.query;
  if (!serviceName)
    return res.status(400).json({ message: "serviceName is required" });

  const bookings = await Booking.find({
    status: { $in: ["pending", "confirmed"] },
    $or: [
      { "package.service": serviceName },
      { "packages.service": serviceName },
    ],
  }).select("date");

  const seen = new Set();
  bookings.forEach((b) => {
    if (!b.date) return;
    const d = typeof b.date === "string"
      ? b.date.split("T")[0]
      : new Date(b.date).toISOString().split("T")[0];
    seen.add(d);
  });
  res.status(200).json({ bookedDates: [...seen] });
});

module.exports.getDateAvailability   = getDateAvailability;
module.exports.getAllBookedDates      = getAllBookedDates;
module.exports.getServiceBookedDates = getServiceBookedDates;