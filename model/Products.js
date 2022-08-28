const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide name"],
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
      required: [true, "Please provide category"],
      enum: ["office", "kitchen", "bedroom"],
    },
    company: {
      type: String,
      required: [true, "Please provide company name"],
      enum: ["ikea", "liddy", "marcos"],
    },
    colors: {
      type: [String],
      required: [true, "Please provide color"],
      default: ["#222"],
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
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
productSchema.pre("remove", async function (next) {
  await this.model("Review").deleteMany({ product: this._id });
});

module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);
