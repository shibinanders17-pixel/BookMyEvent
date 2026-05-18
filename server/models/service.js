// const mongoose = require("mongoose");

// const specSchema = new mongoose.Schema({
//   label: { type: String, required: true },
//   value: { type: String, required: true },
// });

// const styleSchema = new mongoose.Schema({
//   id:    { type: Number, required: true },
//   name:  { type: String, required: true },
//   desc:  { type: String },
//   price: { type: Number, required: true },
//   img:   { type: String },
//   specs: [specSchema],
// });

// const serviceSchema = new mongoose.Schema({
//   id:         { type: Number, required: true, unique: true },
//   icon:       { type: String },
//   title:      { type: String, required: true },
//   subtitle:   { type: String },
//   desc:       { type: String },
//   price:      { type : String},
//   tag:        { type: String },
//   highlights: [{ type: String }],
//   rating:     { type: Number, default: 4.5 },
//   reviews:    { type: Number, default: 0 },
//   img:        { type : String },
//   styles:     [styleSchema]
// });

// module.exports = mongoose.models.Service || mongoose.model("Service", serviceSchema);





const mongoose = require("mongoose");

const specSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
});

const styleSchema = new mongoose.Schema({
  id:    { type: Number, required: true },
  name:  { type: String, required: true },
  desc:  { type: String },
  price: { type: Number, required: true },
  img:   { type: String },
  specs: [specSchema],
});

const serviceSchema = new mongoose.Schema({
  id:         { type: Number, required: true, unique: true },
  icon:       { type: String },
  title:      { type: String, required: true },
  subtitle:   { type: String },
  desc:       { type: String },
  price:      { type : String},
  tag:        { type: String },
  highlights: [{ type: String }],
  rating:     { type: Number, default: 0 },
  reviews:    { type: Number, default: 0 },
  img:        { type : String },
  styles:     [styleSchema]
});

module.exports = mongoose.models.Service || mongoose.model("Service", serviceSchema);