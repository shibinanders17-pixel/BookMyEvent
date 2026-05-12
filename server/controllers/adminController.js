const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("../middleware/asyncHandler");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Booking = require("../models/Booking");
const Service = require("../models/Service");

// ─── Admin Login ──────────────────────────────────────────
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin)
    return res.status(401).json({ message: "Invalid email or password" });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch)
    return res.status(401).json({ message: "Invalid email or password" });

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.status(200).json({ _id: admin._id, email: admin.email, token });
});

// ─── Dashboard Stats ──────────────────────────────────────
const getStats = asyncHandler(async (req, res) => {
  const totalBookings     = await Booking.countDocuments();
  const confirmedBookings = await Booking.countDocuments({ status: "confirmed" });
  const totalUsers        = await User.countDocuments();
  const totalRevenue      = await Booking.aggregate([
    { $group: { _id: null, total: { $sum: "$package.price" } } }
  ]);

  res.status(200).json({
    totalBookings,
    confirmedBookings,
    totalUsers,
    totalRevenue: totalRevenue[0]?.total || 0,
  });
});

// ─── Booking Controllers ──────────────────────────────────
const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate("user", "name email phone")
    .sort({ createdAt: -1 });
  res.status(200).json(bookings);
});

const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("user", "name email phone");
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  res.status(200).json(booking);
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  booking.status = req.body.status;
  await booking.save();
  res.status(200).json({ message: "Booking status updated!", booking });
});

const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: "Booking not found" });
  await booking.deleteOne();
  res.status(200).json({ message: "Booking deleted successfully" });
});

// ─── User Controllers ─────────────────────────────────────
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.status(200).json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  await user.deleteOne();
  res.status(200).json({ message: "User deleted successfully" });
});

const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.isBlocked = req.body.isBlocked;
  await user.save();
  res.status(200).json({ message: `User ${req.body.isBlocked ? "blocked" : "unblocked"} successfully` });
});

// ─── Admin Password ───────────────────────────────────────
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = await Admin.findById(req.admin._id);
  const isMatch = await bcrypt.compare(currentPassword, admin.password);
  if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });
  admin.password = await bcrypt.hash(newPassword, 10);
  await admin.save();
  res.status(200).json({ message: "Password changed successfully" });
});

// ─── Upload ───────────────────────────────────────────────
const uploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.status(200).json({ url: req.file.path });
};

// ─── Service Controllers ──────────────────────────────────
const createService = asyncHandler(async (req, res) => {
  const lastService = await Service.findOne().sort({ id: -1 });
  const newId = (lastService?.id || 0) + 1;
  const service = await Service.create({ ...req.body, id: newId });
  res.status(201).json(service);
});

const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!service) return res.status(404).json({ message: "Service not found" });
  res.status(200).json(service);
});

const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) return res.status(404).json({ message: "Service not found" });
  res.status(200).json({ message: "Service deleted successfully" });
});

// ─── Analytics ────────────────────────────────────────────
const getAnalytics = asyncHandler(async (req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const monthlyData = await Booking.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    { $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        revenue:   { $sum: "$package.price" },
        bookings:  { $sum: 1 },
        confirmed: { $sum: { $cond: [{ $eq: ["$status", "confirmed"] }, 1, 0] } },
        cancelled: { $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] } },
    }},
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const topServices = await Booking.aggregate([
    { $group: { _id: "$package.service", count: { $sum: 1 }, revenue: { $sum: "$package.price" } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  const statusBreakdown = await Booking.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const now = new Date();
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo  = new Date(now - 60 * 24 * 60 * 60 * 1000);

  const [recentRevenue, prevRevenue] = await Promise.all([
    Booking.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$package.price" }, count: { $sum: 1 } } },
    ]),
    Booking.aggregate([
      { $match: { createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo }, status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$package.price" }, count: { $sum: 1 } } },
    ]),
  ]);

  res.status(200).json({
    monthlyData, topServices, statusBreakdown,
    recentRevenue: recentRevenue[0] || { total: 0, count: 0 },
    prevRevenue:   prevRevenue[0]   || { total: 0, count: 0 },
  });
});

// ─── Admin Custom Requests ────────────────────────────────
const CustomRequest = require("../models/CustomRequest");
const Notification = require("../models/Notification");

const statusMessages = {
  reviewing:  "Your custom request is now being reviewed by our team.",
  quoted:     "Your custom request has been quoted. Please check the details and accept or decline.",
  accepted:   "🎉 You've accepted the quote! Our team will confirm once advance payment is received.",
  confirmed:  "✅ Advance payment received! Your custom event is confirmed.",
  completed:  "🎊 Your event is completed! Thank you for choosing us.",
  rejected:   "Your custom request has been declined. Please contact us for more details.",
};

const getAllCustomRequests = asyncHandler(async (req, res) => {
  const requests = await CustomRequest.find()
    .populate("user", "name email phone")
    .sort({ createdAt: -1 });
  res.status(200).json(requests);
});

const getCustomRequestById = asyncHandler(async (req, res) => {
  const request = await CustomRequest.findById(req.params.id)
    .populate("user", "name email phone");
  if (!request) return res.status(404).json({ message: "Request not found" });
  res.status(200).json(request);
});

const updateCustomRequestStatus = asyncHandler(async (req, res) => {
  const { status, adminNote, quotedPrice } = req.body;
  const request = await CustomRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });

  if (status) request.status = status;
  if (adminNote !== undefined) request.adminNote = adminNote;
  if (quotedPrice !== undefined) request.quotedPrice = quotedPrice;
  await request.save();

  // Notify user about status change
  if (status && statusMessages[status]) {
    await Notification.create({
      recipient: request.user,
      recipientType: "user",
      type: "custom_request_status",
      title: `Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: statusMessages[status],
      customRequest: request._id,
    });
  }

  res.status(200).json({ message: "Updated successfully", request });
});

const deleteCustomRequest = asyncHandler(async (req, res) => {
  const request = await CustomRequest.findByIdAndDelete(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  res.status(200).json({ message: "Deleted" });
});

// ─── Admin: Mark Custom Request as Completed ─────────────
const markCustomRequestCompleted = asyncHandler(async (req, res) => {
  const request = await CustomRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  if (request.status !== "confirmed") {
    return res.status(400).json({ message: "Only confirmed requests can be marked as completed" });
  }
  request.status = "completed";
  await request.save();

  await Notification.create({
    recipient:     request.user,
    recipientType: "user",
    type:          "custom_request_status",
    title:         "Event Completed 🎊",
    message:       statusMessages.completed,
    customRequest: request._id,
  });

  res.status(200).json({ message: "Marked as completed", request });
});

// ─── Admin Notification Functions ────────────────────────────────────────────
const getAdminNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipientType: "admin" })
    .sort({ createdAt: -1 }).limit(50);
  res.status(200).json(notifications);
});

const markAdminNotificationRead = asyncHandler(async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.status(200).json({ message: "Marked as read" });
});

const markAllAdminNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipientType: "admin", isRead: false }, { isRead: true });
  res.status(200).json({ message: "All marked as read" });
});
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  loginAdmin, getStats,
  getAllBookings, getBookingById, updateBookingStatus, deleteBooking,
  getAllUsers, deleteUser, toggleBlockUser,
  changePassword, uploadImage,
  createService, updateService, deleteService,
  getAnalytics,
  getAllCustomRequests, getCustomRequestById, updateCustomRequestStatus, deleteCustomRequest,
  markCustomRequestCompleted,
  getAdminNotifications, markAdminNotificationRead, markAllAdminNotificationsRead,
};