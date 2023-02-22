const mongoose = require("mongoose");

//  SCHEMA
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Atour must have a name"],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, "A tour must have a duration"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have a group size"],
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have a difficulty"],
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
  ratingsAverage: { type: Number, default: 4.5 },
  ratingsQuantity: { type: Number, default: 0 },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true, //remove all white space at begin & end
    required: [true, "A tour must have a summary"],
  },
  description: {
    type: String,
    trim: true,
    required: [true, "A tour must have a description"],
  },
  imageCover: {
    type: String,
    required: [true, "A tour must have a cover image"],
  },

  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});

//  MODEL
const Tour = mongoose.model("Tour", tourSchema); // Tour == collection name

module.exports = Tour;
