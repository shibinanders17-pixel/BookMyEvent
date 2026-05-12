const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("../server/config/db");
const Admin = require("./models/Admin");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// ─── Start Server ─────────────────────────────────────────
const startServer = async () => {
  await connectDB();

  // Auto create admin if not exists
  const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existing) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await Admin.create({ email: process.env.ADMIN_EMAIL, password: hashedPassword });
    console.log("Admin created successfully!");
  }

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();