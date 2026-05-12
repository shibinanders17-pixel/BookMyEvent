const express = require("express");
const router  = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { validateRegister, validateLogin, validateBooking } = require("../middleware/Validatemiddleware");
const { cloudinary, upload: cloudinaryUpload } = require("../middleware/Cloudinary");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_images",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 300, height: 300, crop: "fill", gravity: "face" }],
  },
});
const profileUpload = multer({ storage: profileStorage });

const {
  registerUser, loginUser, getUserProfile,
  checkEmailForReset, resetPassword,
  updateProfile, changePassword,
  createOrder, verifyPayment,
  verifyMultiPayment,
  getMyBookings, cancelBooking,
  getWalletBalance,
  getCart, addToCart, removeFromCart, clearCart,
  getMyStyleBoard, saveStyleBoard, uploadStyleBoardImage, deleteStyleBoardImage,
  getAllServices, getServiceByMongoId, getServiceByNumericId,
  uploadProfileImage,
  submitCustomRequest, getMyCustomRequests, cancelCustomRequest, respondToQuote,
  getMyNotifications, markNotificationRead, markAllNotificationsRead,
} = require("../controllers/userController");

const customRequestStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "custom_requests",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, height: 900, crop: "limit" }],
  },
});
const customRequestUpload = multer({ storage: customRequestStorage });

// ─── Auth Routes ──────────────────────────────────────────
router.post("/register", validateRegister, registerUser);
router.post("/login",    validateLogin,    loginUser);
router.get( "/profile",  protect,          getUserProfile);

// ─── Forgot Password ──────────────────────────────────────
router.post("/forgot-password/check", checkEmailForReset);
router.post("/forgot-password/reset", resetPassword);

// ─── Profile Update ───────────────────────────────────────
router.put("/profile",         protect, updateProfile);
router.put("/change-password", protect, changePassword);

// ─── Payment Routes ───────────────────────────────────────
router.post("/payment/create-order",  protect, createOrder);
router.post("/payment/verify",        protect, validateBooking, verifyPayment);
router.post("/payment/verify-multi",  protect, verifyMultiPayment);

// ─── Booking Routes ───────────────────────────────────────
router.get(   "/bookings/my",  protect, getMyBookings);
router.delete("/bookings/:id", protect, cancelBooking);

// ─── Wallet Routes ────────────────────────────────────────
router.get("/wallet", protect, getWalletBalance);

// ─── Cart Routes ──────────────────────────────────────────
router.get(   "/cart",        protect, getCart);
router.post(  "/cart",        protect, addToCart);
router.delete("/cart/item",   protect, removeFromCart);
router.delete("/cart",        protect, clearCart);

// ─── Profile Image Route ──────────────────────────────────
router.post("/profile/image", protect, profileUpload.single("image"), uploadProfileImage);

// ─── Style Board Routes ───────────────────────────────────
router.get(   "/styleboard",        protect, getMyStyleBoard);
router.put(   "/styleboard",        protect, saveStyleBoard);
router.post(  "/styleboard/image",  protect, cloudinaryUpload.single("image"), uploadStyleBoardImage);
router.delete("/styleboard/image",  protect, deleteStyleBoardImage);

// ─── Service Routes ───────────────────────────────────────
router.get("/services",            getAllServices);
router.get("/services/detail/:id", getServiceByMongoId);
router.get("/services/:id",        getServiceByNumericId);

// ─── Custom Request Routes ────────────────────────────────
router.post("/custom-requests", protect, (req, res, next) => {
  // Accept referenceImages + any serviceImage_* fields dynamically
  customRequestUpload.any()(req, res, (err) => {
    if (err) {
      req.files = [];
    }
    next();
  });
}, submitCustomRequest);
router.get(   "/custom-requests/my",     protect, getMyCustomRequests);
router.delete("/custom-requests/:id",    protect, cancelCustomRequest);
router.put("/custom-requests/:id/respond", protect, respondToQuote);

// ─── Notification Routes ──────────────────────────────────
router.get("/notifications/my",           protect, getMyNotifications);
router.put("/notifications/read-all",     protect, markAllNotificationsRead);
router.put("/notifications/:id/read",     protect, markNotificationRead);

module.exports = router;