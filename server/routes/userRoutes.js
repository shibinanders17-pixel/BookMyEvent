const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/User");
const Booking = require("../models/Booking");
const Service = require("../models/service");

// ─── Razorpay Instance ────────────────────────────────────
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─── JWT Helper ───────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ─── Auth Middleware ──────────────────────────────────────
const protect = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ─── Auth Routes ──────────────────────────────────────────

router.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    if (!name || !email || !phone || !password)
      return res.status(400).json({ message: "Please fill in all fields" });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists with this email" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, phone, password: hashedPassword });

    res.status(201).json({ status: "success", message: "Registration successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error during registration" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ message: "Please enter email and password" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
});

router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ─── Payment Routes ───────────────────────────────────────

// Step 1: Create Razorpay Order
router.post("/payment/create-order", protect, async (req, res) => {
  const { amount } = req.body; // amount in rupees
  try {
    if (!amount || amount <= 0)
      return res.status(400).json({ message: "Invalid amount" });

    const order = await razorpay.orders.create({
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ message: "Failed to create payment order" });
  }
});

// Step 2: Verify Payment & Save Booking
router.post("/payment/verify", protect, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingData, // { name, phone, email, date, venue, message, package }
  } = req.body;

  try {
    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Signature valid — save booking
    const booking = await Booking.create({
      user: req.user._id,
      name: bookingData.name,
      phone: bookingData.phone,
      email: bookingData.email,
      date: bookingData.date,
      venue: bookingData.venue,
      message: bookingData.message || "",
      package: bookingData.package || {},
      status: "confirmed", // payment done so directly confirmed
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

    res.status(201).json({ message: "Booking confirmed!", booking });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ message: "Server error during payment verification" });
  }
});

// ─── Booking Routes ───────────────────────────────────────

router.get("/bookings/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching bookings" });
  }
});

router.delete("/bookings/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized to cancel this booking" });

    await booking.deleteOne();
    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error while cancelling booking" });
  }
});

// ─── Service Routes ───────────────────────────────────────

router.get("/services", async (req, res) => {
  try {
    const services = await Service.find().sort({ id: 1 });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching services" });
  }
});

router.get("/services/:id", async (req, res) => {
  try {
    const service = await Service.findOne({ id: parseInt(req.params.id) });
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching service" });
  }
});

module.exports = router;