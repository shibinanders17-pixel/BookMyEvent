const mongoose = require("mongoose");

const customRequestSchema = new mongoose.Schema(
  {
    user:         { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name:         { type: String, required: true, trim: true },
    phone:        { type: String, required: true },
    email:        { type: String, required: true },

    // Event details
    eventCategory: { type: String, required: true,
      enum: [
        "Wedding", "Birthday", "Engagement", "Baby Shower",
        "Anniversary", "Corporate Event", "House Warming",
        "Graduation", "Farewell", "Get Together",
        "Naming Ceremony", "Other"
      ]},
    services:       { type: [String], default: [] },
    serviceDetails: { type: Object, default: {} },
    serviceImages:  { type: Object, default: {} },

    date:             { type: String, required: true },
    time:             { type: String, default: "" },
    venue:            { type: String, required: true },
    guestCount:       { type: Number, default: 0 },
    budgetRange:      { type: String, default: "" },
    notes:            { type: String, default: "" },
    preferredContact: { type: String, default: "WhatsApp" },
    duration:         { type: String, default: "" },

    // Reference images (Cloudinary URLs)
    referenceImages: { type: [String], default: [] },

    // Admin response
    status: {
      type: String,
      enum: ["pending", "reviewing", "quoted", "accepted", "confirmed", "completed", "rejected"],
      default: "pending"
    },
    linkedBooking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", default: null },
    adminNote:    { type: String, default: "" },
    quotedPrice:  { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomRequest", customRequestSchema);