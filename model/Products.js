const mongoose = require("mongoose");

const productSchema =
  ({
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide name"],
      maxlenght: [true, "Name cannot be more than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide price"],
      default: 0,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    category: {
      type: String,
      required: [true, "Please provide cat name"],
      enum: ["office", "kitchen", "bedroom"],
    },
    company: {
      type: String,
      required: [true, "Please provide company name"],
      enum: ["ikea", "liddy", "marcos"],
    },
    colors: {
      type: [String],
      required: [true, "Please provide color name"],
    },
    featured: {
      type: String,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      default: 15,
      required: [true],
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true],
    },
  },
  { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
