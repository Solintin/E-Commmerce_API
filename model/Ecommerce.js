const mongoose = require("mongoose");
const Product = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
});

module.exports = mongoose.model("Product", Product);
