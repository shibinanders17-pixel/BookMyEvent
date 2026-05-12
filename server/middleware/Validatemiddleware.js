// ─── Register Validation ──────────────────────────────────
const validateRegister = (req, res, next) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password)
    return res.status(400).json({ message: "Please fill in all fields" });

  if (!/^\S+@\S+\.\S+$/.test(email))
    return res.status(400).json({ message: "Please enter a valid email" });

  if (!/^\d{10}$/.test(phone))
    return res.status(400).json({ message: "Phone number must be 10 digits" });

  if (password.length < 6)
    return res.status(400).json({ message: "Password must be at least 6 characters" });

  next();
};

// ─── Login Validation ─────────────────────────────────────
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Please enter email and password" });

  if (!/^\S+@\S+\.\S+$/.test(email))
    return res.status(400).json({ message: "Please enter a valid email" });

  next();
};

// ─── Booking Validation ───────────────────────────────────
const validateBooking = (req, res, next) => {
  const bookingData = req.body.bookingData || {};

  // Custom request bookings — name/venue/date already in the custom request record
  if (bookingData.customRequestId) return next();

  const { name, phone, email, date, venue } = bookingData;

  if (!name || !phone || !email || !date || !venue)
    return res.status(400).json({ message: "Please fill in all booking fields" });

  if (!/^\S+@\S+\.\S+$/.test(email))
    return res.status(400).json({ message: "Please enter a valid email" });

  if (!/^\d{10}$/.test(phone))
    return res.status(400).json({ message: "Phone number must be 10 digits" });

  const eventDate = new Date(date);
  if (isNaN(eventDate) || eventDate < new Date())
    return res.status(400).json({ message: "Please enter a valid future date" });

  next();
};

// ─── Service Validation ───────────────────────────────────
const validateService = (req, res, next) => {
  const { title } = req.body;

  if (!title || title.trim() === "")
    return res.status(400).json({ message: "Service title is required" });

  next();
};

module.exports = { validateRegister, validateLogin, validateBooking, validateService };