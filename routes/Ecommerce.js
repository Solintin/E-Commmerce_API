const express = require("express");

const router = express.Router();
const { createProduct } = require("../controllers/Ecommerce");
router.route("/api/v1/product").post(createProduct);

module.exports = router;
