const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  serviceId:    { type: String, required: true },
  serviceTitle: { type: String },
  styleId:      { type: String, required: true },
  styleName:    { type: String },
  styleImg:     { type: String },
  duration:     { type: String },
  price:        { type: Number, required: true },
  quantity:     { type: Number, default: 1 },
  guestCount:   { type: Number, default: 0 },
  pricePerPlate:{ type: Number, default: 0 },
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    name:          { type: String, required: [true, "Name is required"], trim: true },
    email:         { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true },
    phone:         { type: String, required: [true, "Phone number is required"], trim: true },
    password:      { type: String, required: [true, "Password is required"], minlength: 6 },
    isBlocked:     { type: Boolean, default: false },
    walletBalance: { type: Number, default: 0 },
    cart:          { type: [cartItemSchema], default: [] },
    profileImg:    { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);