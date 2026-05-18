const mongoose = require("mongoose");

const packageItemSchema = new mongoose.Schema({
  service:  { type: String },
  event:    { type: String },
  duration: { type: String },
  price:    { type: Number },
}, { _id: false });

const bookingSchema = new mongoose.Schema(
  {
    user:            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name:            { type: String, required: true, trim: true },
    phone:           { type: String, required: true },
    email:           { type: String, required: true },
    date:            { type: String, required: true },
    venue:           { type: String, required: true },
    message:         { type: String, default: "" },
    paymentId:       { type: String },
    orderId:         { type: String },
    package:         { service: String, event: String, duration: String, price: Number },
    packages:        { type: [packageItemSchema], default: [] },
    isMultiBooking:  { type: Boolean, default: false },
    totalAmount:     { type: Number, default: 0 },
    status:          { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
    paymentType:     { type: String, enum: ["full", "advance"], default: "full" },
    advanceAmount:   { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },
    walletUsed:      { type: Number, default: 0 },
    isCustomEvent:   { type: Boolean, default: false },
    customRequest:   { type: mongoose.Schema.Types.ObjectId, ref: "CustomRequest", default: null },
    services:        { type: [String], default: [] },
    guestCount:      { type: Number, default: 0 },
    notes:           { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);