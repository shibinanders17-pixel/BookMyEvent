// // const mongoose = require("mongoose");

// // const packageItemSchema = new mongoose.Schema({
// //   service:  { type: String },
// //   event:    { type: String },
// //   duration: { type: String },
// //   price:    { type: Number },
// // }, { _id: false });

// // const bookingSchema = new mongoose.Schema(
// //   {
// //     user:            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// //     name:            { type: String, required: true, trim: true },
// //     phone:           { type: String, required: true },
// //     email:           { type: String, required: true },
// //     date:            { type: String, required: true },
// //     venue:           { type: String, required: true },
// //     message:         { type: String, default: "" },
// //     paymentId:       { type: String },
// //     orderId:         { type: String },

// //     // ── Single package (legacy / backward compat) ──
// //     package:         { service: String, event: String, duration: String, price: Number },

// //     // ── Multi-package cart booking ──
// //     packages:        { type: [packageItemSchema], default: [] },
// //     isMultiBooking:  { type: Boolean, default: false },
// //     totalAmount:     { type: Number, default: 0 },

// //     status:          { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },

// //     // ── Advance Payment fields ──
// //     paymentType:     { type: String, enum: ["full", "advance"], default: "full" },
// //     advanceAmount:   { type: Number, default: 0 },
// //     remainingAmount: { type: Number, default: 0 },
// //     walletUsed:      { type: Number, default: 0 },

// //     // ── Style Board reference ──
// //     styleBoardId:    { type: mongoose.Schema.Types.ObjectId, ref: "StyleBoard" },

// //     // ── Custom Event fields ──
// //     isCustomEvent:   { type: Boolean, default: false },
// //     customRequest:   { type: mongoose.Schema.Types.ObjectId, ref: "CustomRequest", default: null },
// //     services:        { type: [String], default: [] },
// //     guestCount:      { type: Number, default: 0 },
// //     notes:           { type: String, default: "" },
// //   },
// //   { timestamps: true }
// // );

// // module.exports = mongoose.model("Booking", bookingSchema);





// // // const mongoose = require("mongoose");

// // // const bookingSchema = new mongoose.Schema(
// // //   {
// // //     user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// // //     name:    { type: String, required: true, trim: true },
// // //     phone:   { type: String, required: true },
// // //     email:   { type: String, required: true },
// // //     date:    { type: String, required: true },
// // //     venue:   { type: String, required: true },
// // //     message: { type: String, default: "" },
// // //     paymentId: { type: String },
// // //     orderId:   { type: String },
// // //     package: { service:  String, event: String, duration: String, price: Number},
// // //     status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
// // //    },
// // //  { timestamps: true }
// // // );

// // // module.exports = mongoose.model("Booking", bookingSchema);




// // // const mongoose = require("mongoose");

// // // const bookingSchema = new mongoose.Schema(
// // //   {
// // //     user:            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// // //     name:            { type: String, required: true, trim: true },
// // //     phone:           { type: String, required: true },
// // //     email:           { type: String, required: true },
// // //     date:            { type: String, required: true },
// // //     venue:           { type: String, required: true },
// // //     message:         { type: String, default: "" },
// // //     paymentId:       { type: String },
// // //     orderId:         { type: String },
// // //     package:         { service: String, event: String, duration: String, price: Number },
// // //     status:          { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
// // //     // ── Advance Payment fields ──
// // //     paymentType:     { type: String, enum: ["full", "advance"], default: "full" },
// // //     advanceAmount:   { type: Number, default: 0 },   // 25% paid
// // //     remainingAmount: { type: Number, default: 0 },   // 75% due on event day
// // //     walletUsed:      { type: Number, default: 0 },   // wallet amount applied in this booking
// // //   },
// // //   { timestamps: true }
// // // );

// // // module.exports = mongoose.model("Booking", bookingSchema);




// // const mongoose = require("mongoose");

// // const packageItemSchema = new mongoose.Schema({
// //   service:  { type: String },
// //   event:    { type: String },
// //   duration: { type: String },
// //   price:    { type: Number },
// // }, { _id: false });

// // const bookingSchema = new mongoose.Schema(
// //   {
// //     user:            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// //     name:            { type: String, required: true, trim: true },
// //     phone:           { type: String, required: true },
// //     email:           { type: String, required: true },
// //     date:            { type: String, required: true },
// //     venue:           { type: String, required: true },
// //     message:         { type: String, default: "" },
// //     paymentId:       { type: String },
// //     orderId:         { type: String },

// //     // ── Single package (legacy / backward compat) ──
// //     package:         { service: String, event: String, duration: String, price: Number },

// //     // ── Multi-package cart booking ──
// //     packages:        { type: [packageItemSchema], default: [] },
// //     isMultiBooking:  { type: Boolean, default: false },
// //     totalAmount:     { type: Number, default: 0 },

// //     status:          { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },

// //     // ── Advance Payment fields ──
// //     paymentType:     { type: String, enum: ["full", "advance"], default: "full" },
// //     advanceAmount:   { type: Number, default: 0 },
// //     remainingAmount: { type: Number, default: 0 },
// //     walletUsed:      { type: Number, default: 0 },

// //     // ── Style Board reference ──
// //     styleBoardId:    { type: mongoose.Schema.Types.ObjectId, ref: "StyleBoard" },
// //   },
// //   { timestamps: true }
// // );

// // module.exports = mongoose.model("Booking", bookingSchema);





// // const mongoose = require("mongoose");

// // const bookingSchema = new mongoose.Schema(
// //   {
// //     user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// //     name:    { type: String, required: true, trim: true },
// //     phone:   { type: String, required: true },
// //     email:   { type: String, required: true },
// //     date:    { type: String, required: true },
// //     venue:   { type: String, required: true },
// //     message: { type: String, default: "" },
// //     paymentId: { type: String },
// //     orderId:   { type: String },
// //     package: { service:  String, event: String, duration: String, price: Number},
// //     status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
// //    },
// //  { timestamps: true }
// // );

// // module.exports = mongoose.model("Booking", bookingSchema);




// // const mongoose = require("mongoose");

// // const bookingSchema = new mongoose.Schema(
// //   {
// //     user:            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// //     name:            { type: String, required: true, trim: true },
// //     phone:           { type: String, required: true },
// //     email:           { type: String, required: true },
// //     date:            { type: String, required: true },
// //     venue:           { type: String, required: true },
// //     message:         { type: String, default: "" },
// //     paymentId:       { type: String },
// //     orderId:         { type: String },
// //     package:         { service: String, event: String, duration: String, price: Number },
// //     status:          { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
// //     // ── Advance Payment fields ──
// //     paymentType:     { type: String, enum: ["full", "advance"], default: "full" },
// //     advanceAmount:   { type: Number, default: 0 },   // 25% paid
// //     remainingAmount: { type: Number, default: 0 },   // 75% due on event day
// //     walletUsed:      { type: Number, default: 0 },   // wallet amount applied in this booking
// //   },
// //   { timestamps: true }
// // );

// // module.exports = mongoose.model("Booking", bookingSchema);




// const mongoose = require("mongoose");

// const packageItemSchema = new mongoose.Schema({
//   service:  { type: String },
//   event:    { type: String },
//   duration: { type: String },
//   price:    { type: Number },
// }, { _id: false });

// const bookingSchema = new mongoose.Schema(
//   {
//     user:            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     name:            { type: String, required: true, trim: true },
//     phone:           { type: String, required: true },
//     email:           { type: String, required: true },
//     date:            { type: String, required: true },
//     venue:           { type: String, required: true },
//     message:         { type: String, default: "" },
//     paymentId:       { type: String },
//     orderId:         { type: String },

//     // ── Single package (legacy / backward compat) ──
//     package:         { service: String, event: String, duration: String, price: Number },

//     // ── Multi-package cart booking ──
//     packages:        { type: [packageItemSchema], default: [] },
//     isMultiBooking:  { type: Boolean, default: false },
//     totalAmount:     { type: Number, default: 0 },

//     status:          { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },

//     // ── Advance Payment fields ──
//     paymentType:     { type: String, enum: ["full", "advance"], default: "full" },
//     advanceAmount:   { type: Number, default: 0 },
//     remainingAmount: { type: Number, default: 0 },
//     walletUsed:      { type: Number, default: 0 },

//     // ── Style Board reference ──
//     styleBoardId:    { type: mongoose.Schema.Types.ObjectId, ref: "StyleBoard" },

//     // ── Custom Event fields ──
//     isCustomEvent:   { type: Boolean, default: false },
//     customRequest:   { type: mongoose.Schema.Types.ObjectId, ref: "CustomRequest", default: null },
//     services:        { type: [String], default: [] },
//     guestCount:      { type: Number, default: 0 },
//     notes:           { type: String, default: "" },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Booking", bookingSchema);






// const mongoose = require("mongoose");

// const packageItemSchema = new mongoose.Schema({
//   service:  { type: String },
//   event:    { type: String },
//   duration: { type: String },
//   price:    { type: Number },
// }, { _id: false });

// const bookingSchema = new mongoose.Schema(
//   {
//     user:            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     name:            { type: String, required: true, trim: true },
//     phone:           { type: String, required: true },
//     email:           { type: String, required: true },
//     date:            { type: String, required: true },
//     venue:           { type: String, required: true },
//     message:         { type: String, default: "" },
//     paymentId:       { type: String },
//     orderId:         { type: String },

//     // ── Single package (legacy / backward compat) ──
//     package:         { service: String, event: String, duration: String, price: Number },

//     // ── Multi-package cart booking ──
//     packages:        { type: [packageItemSchema], default: [] },
//     isMultiBooking:  { type: Boolean, default: false },
//     totalAmount:     { type: Number, default: 0 },

//     status:          { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },

//     // ── Advance Payment fields ──
//     paymentType:     { type: String, enum: ["full", "advance"], default: "full" },
//     advanceAmount:   { type: Number, default: 0 },
//     remainingAmount: { type: Number, default: 0 },
//     walletUsed:      { type: Number, default: 0 },

//     // ── Style Board reference ──
//     styleBoardId:    { type: mongoose.Schema.Types.ObjectId, ref: "StyleBoard" },

//     // ── Custom Event fields ──
//     isCustomEvent:   { type: Boolean, default: false },
//     customRequest:   { type: mongoose.Schema.Types.ObjectId, ref: "CustomRequest", default: null },
//     services:        { type: [String], default: [] },
//     guestCount:      { type: Number, default: 0 },
//     notes:           { type: String, default: "" },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Booking", bookingSchema);





// // const mongoose = require("mongoose");

// // const bookingSchema = new mongoose.Schema(
// //   {
// //     user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// //     name:    { type: String, required: true, trim: true },
// //     phone:   { type: String, required: true },
// //     email:   { type: String, required: true },
// //     date:    { type: String, required: true },
// //     venue:   { type: String, required: true },
// //     message: { type: String, default: "" },
// //     paymentId: { type: String },
// //     orderId:   { type: String },
// //     package: { service:  String, event: String, duration: String, price: Number},
// //     status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
// //    },
// //  { timestamps: true }
// // );

// // module.exports = mongoose.model("Booking", bookingSchema);




// // const mongoose = require("mongoose");

// // const bookingSchema = new mongoose.Schema(
// //   {
// //     user:            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// //     name:            { type: String, required: true, trim: true },
// //     phone:           { type: String, required: true },
// //     email:           { type: String, required: true },
// //     date:            { type: String, required: true },
// //     venue:           { type: String, required: true },
// //     message:         { type: String, default: "" },
// //     paymentId:       { type: String },
// //     orderId:         { type: String },
// //     package:         { service: String, event: String, duration: String, price: Number },
// //     status:          { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
// //     // ── Advance Payment fields ──
// //     paymentType:     { type: String, enum: ["full", "advance"], default: "full" },
// //     advanceAmount:   { type: Number, default: 0 },   // 25% paid
// //     remainingAmount: { type: Number, default: 0 },   // 75% due on event day
// //     walletUsed:      { type: Number, default: 0 },   // wallet amount applied in this booking
// //   },
// //   { timestamps: true }
// // );

// // module.exports = mongoose.model("Booking", bookingSchema);




// const mongoose = require("mongoose");

// const packageItemSchema = new mongoose.Schema({
//   service:  { type: String },
//   event:    { type: String },
//   duration: { type: String },
//   price:    { type: Number },
// }, { _id: false });

// const bookingSchema = new mongoose.Schema(
//   {
//     user:            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     name:            { type: String, required: true, trim: true },
//     phone:           { type: String, required: true },
//     email:           { type: String, required: true },
//     date:            { type: String, required: true },
//     venue:           { type: String, required: true },
//     message:         { type: String, default: "" },
//     paymentId:       { type: String },
//     orderId:         { type: String },

//     // ── Single package (legacy / backward compat) ──
//     package:         { service: String, event: String, duration: String, price: Number },

//     // ── Multi-package cart booking ──
//     packages:        { type: [packageItemSchema], default: [] },
//     isMultiBooking:  { type: Boolean, default: false },
//     totalAmount:     { type: Number, default: 0 },

//     status:          { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },

//     // ── Advance Payment fields ──
//     paymentType:     { type: String, enum: ["full", "advance"], default: "full" },
//     advanceAmount:   { type: Number, default: 0 },
//     remainingAmount: { type: Number, default: 0 },
//     walletUsed:      { type: Number, default: 0 },

//     // ── Style Board reference ──
//     styleBoardId:    { type: mongoose.Schema.Types.ObjectId, ref: "StyleBoard" },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Booking", bookingSchema);





// const mongoose = require("mongoose");

// const bookingSchema = new mongoose.Schema(
//   {
//     user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     name:    { type: String, required: true, trim: true },
//     phone:   { type: String, required: true },
//     email:   { type: String, required: true },
//     date:    { type: String, required: true },
//     venue:   { type: String, required: true },
//     message: { type: String, default: "" },
//     paymentId: { type: String },
//     orderId:   { type: String },
//     package: { service:  String, event: String, duration: String, price: Number},
//     status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
//    },
//  { timestamps: true }
// );

// module.exports = mongoose.model("Booking", bookingSchema);




// const mongoose = require("mongoose");

// const bookingSchema = new mongoose.Schema(
//   {
//     user:            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     name:            { type: String, required: true, trim: true },
//     phone:           { type: String, required: true },
//     email:           { type: String, required: true },
//     date:            { type: String, required: true },
//     venue:           { type: String, required: true },
//     message:         { type: String, default: "" },
//     paymentId:       { type: String },
//     orderId:         { type: String },
//     package:         { service: String, event: String, duration: String, price: Number },
//     status:          { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
//     // ── Advance Payment fields ──
//     paymentType:     { type: String, enum: ["full", "advance"], default: "full" },
//     advanceAmount:   { type: Number, default: 0 },   // 25% paid
//     remainingAmount: { type: Number, default: 0 },   // 75% due on event day
//     walletUsed:      { type: Number, default: 0 },   // wallet amount applied in this booking
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Booking", bookingSchema);




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

    // ── Single package (legacy / backward compat) ──
    package:         { service: String, event: String, duration: String, price: Number },

    // ── Multi-package cart booking ──
    packages:        { type: [packageItemSchema], default: [] },
    isMultiBooking:  { type: Boolean, default: false },
    totalAmount:     { type: Number, default: 0 },

    status:          { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },

    // ── Advance Payment fields ──
    paymentType:     { type: String, enum: ["full", "advance"], default: "full" },
    advanceAmount:   { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },
    walletUsed:      { type: Number, default: 0 },

    // ── Style Board reference ──
    styleBoardId:    { type: mongoose.Schema.Types.ObjectId, ref: "StyleBoard" },

    // ── Custom Event fields ──
    isCustomEvent:   { type: Boolean, default: false },
    customRequest:   { type: mongoose.Schema.Types.ObjectId, ref: "CustomRequest", default: null },
    services:        { type: [String], default: [] },
    guestCount:      { type: Number, default: 0 },
    notes:           { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);