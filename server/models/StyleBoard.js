const mongoose = require("mongoose");

const styleBoardSchema = new mongoose.Schema(
  {
    user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title:       { type: String, default: "My Style Board" },
    images:      [{ url: String, publicId: String }],
    colorTheme:  { type: String, default: "" },         // e.g. "Gold & White"
    style:       { type: String, default: "" },         // e.g. "Royal / Minimalist / Boho"
    budget:      { type: String, default: "" },         // e.g. "1L-2L"
    notes:       { type: String, default: "" },         // extra notes
  },
  { timestamps: true }
);

module.exports = mongoose.model("StyleBoard", styleBoardSchema);