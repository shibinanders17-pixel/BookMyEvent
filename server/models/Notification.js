const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    // Who receives this notification
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    recipientType: { type: String, enum: ["user", "admin"], default: "user" },

    // What triggered it
    type: {
      type: String,
      enum: ["custom_request_new", "custom_request_status"],
      required: true,
    },

    title: { type: String, required: true },
    message: { type: String, required: true },

    // Link to the related custom request
    customRequest: { type: mongoose.Schema.Types.ObjectId, ref: "CustomRequest", default: null },

    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);