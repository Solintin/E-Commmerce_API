const mongoose = require("mongoose");

const singleCartItemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  Image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const productSchema = mongoose.Schema(
  {
    tax: {
      type: Number,
      trim: true,
      required: [true, "Please provide tax rate"],
    },
    shippingFee: {
      type: Number,
      required: [true, "Please provide shippping fee"],
      default: 0,
    },
    subtotal: {
      type: Number,
      required: [true, "Please provide subtotal"],
      default: 0,
    },
    total: {
      required: [true, "Please provide total"],
      type: Number,
      default: 0,
    },
    cartItems: [singleCartItemSchema],
    status: {
      type: String,
      enum: ["pending", "paid", "delivered", "failed", "cancel"],
      default: "pending",
    },
    clientSecret: {
      type: String,
      trim: true,
    },
    paymentId: {
      type: String,
      trim: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Order || mongoose.model("Order", productSchema);
