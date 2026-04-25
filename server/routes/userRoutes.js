const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const User = require("../models/User");
const Booking = require("../models/Booking");

// ─── Generate Token ────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ─── Auth Middleware ───────────────────────────────────────
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }
  if (!token) return res.status(401).json({ message: "Not authorized, no token" });
};

// ─────────────────────────────────────────────
// @route   POST /api/users/register
// @desc    New user register pannuvaom
// @access  Public
// ─────────────────────────────────────────────
// ─── Register ──────────────────────────────────────────────
router.post("/register", async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    if (!name || !email || !phone || !password)
      return res.status(400).json({ message: "Please fill in all fields" });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists with this email" });

    const hashedPassword = await bcrypt.hash(password, 10); // ← hash here
    const user = await User.create({ name, email, phone, password: hashedPassword });

    res.status(201).json({ status : "success", message : "Registration successfully"});
  } catch (error) {
    res.status(500).json({ message: "Server error during registration" });
  }
});

// ─── Login ─────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ message: "Please enter email and password" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password); // ← compare here
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
// ─────────────────────────────────────────────
// @route   GET /api/users/profile
// @desc    Get logged in user profile
// @access  Private
// ─────────────────────────────────────────────
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ─────────────────────────────────────────────
// @route   POST /api/users/bookings
// @desc    New booking create pannuvaom
// @access  Private
// ─────────────────────────────────────────────
router.post("/bookings", protect, async (req, res) => {
  const { name, phone, email, date, venue, message, package: pkg } = req.body;
  try {
    if (!name || !phone || !email || !date || !venue) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }
    const booking = await Booking.create({
      user: req.user._id,
      name,
      phone,
      email,
      date,
      venue,
      message,
      package: pkg || {},
    });
    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while creating booking" });
  }
});

// ─────────────────────────────────────────────
// @route   GET /api/users/bookings/my
// @desc    Get logged-in user's bookings
// @access  Private
// ─────────────────────────────────────────────
router.get("/bookings/my", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching bookings" });
  }
});

// ─────────────────────────────────────────────
// @route   DELETE /api/users/bookings/:id
// @desc    Cancel a booking
// @access  Private
// ─────────────────────────────────────────────
router.delete("/bookings/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to cancel this booking" });
    }
    await booking.deleteOne();
    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error while cancelling booking" });
  }
});

module.exports = router;