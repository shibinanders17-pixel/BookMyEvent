const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name:    { type: String, required: true, trim: true },
    phone:   { type: String, required: true },
    email:   { type: String, required: true },
    date:    { type: String, required: true },
    venue:   { type: String, required: true },
    message: { type: String, default: "" },
    package: { service:  String, event: String, duration: String, price: Number},
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
   },
 { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);