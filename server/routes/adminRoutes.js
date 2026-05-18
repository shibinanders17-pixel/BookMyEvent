const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middleware/authMiddleware");
const { validateLogin, validateService } = require("../middleware/ValidateMiddleware");
const { upload } = require("../middleware/Cloudinary");

const {
  loginAdmin, getStats,
  getAllBookings, getBookingById, updateBookingStatus, deleteBooking,
  getAllUsers, deleteUser, toggleBlockUser,
  changePassword, uploadImage,
  createService, updateService, deleteService,
  getAnalytics,
  getAllCustomRequests, getCustomRequestById, updateCustomRequestStatus, deleteCustomRequest,
  markCustomRequestCompleted,
  getAdminNotifications, markAdminNotificationRead, markAllAdminNotificationsRead,
} = require("../controllers/adminController");


// ─── Auth ─────────────────────────────────────────────────
router.post("/login", validateLogin, loginAdmin);

// ─── Stats & Analytics ────────────────────────────────────
router.get("/stats",     protectAdmin, getStats);
router.get("/analytics", protectAdmin, getAnalytics);

// ─── Bookings ─────────────────────────────────────────────
router.get("/bookings",        protectAdmin, getAllBookings);
router.get("/bookings/:id",    protectAdmin, getBookingById);
router.put("/bookings/:id",    protectAdmin, updateBookingStatus);
router.delete("/bookings/:id", protectAdmin, deleteBooking);

// ─── Users ────────────────────────────────────────────────
router.get("/users",           protectAdmin, getAllUsers);
router.delete("/users/:id",    protectAdmin, deleteUser);
router.put("/users/:id/block", protectAdmin, toggleBlockUser);

// ─── Password ─────────────────────────────────────────────
router.put("/change-password", protectAdmin, changePassword);

// ─── Upload ───────────────────────────────────────────────
router.post("/upload", protectAdmin, upload.single("image"), uploadImage);

// ─── Services ─────────────────────────────────────────────
router.post("/services",       protectAdmin, validateService, createService);
router.put("/services/:id",    protectAdmin, validateService, updateService);
router.delete("/services/:id", protectAdmin, deleteService);

// ─── Custom Requests ──────────────────────────────────────
router.get(   "/custom-requests",                    protectAdmin, getAllCustomRequests);
router.get(   "/custom-requests/:id",               protectAdmin, getCustomRequestById);
router.put(   "/custom-requests/:id",               protectAdmin, updateCustomRequestStatus);
router.delete("/custom-requests/:id",               protectAdmin, deleteCustomRequest);
router.post(  "/custom-requests/:id/mark-completed", protectAdmin, markCustomRequestCompleted);

// ─── Admin Notifications ──────────────────────────────────
router.get("/notifications",            protectAdmin, getAdminNotifications);
router.put("/notifications/read-all",   protectAdmin, markAllAdminNotificationsRead);
router.put("/notifications/:id/read",   protectAdmin, markAdminNotificationRead);

module.exports = router;