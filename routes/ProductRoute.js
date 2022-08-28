const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const {
  createProduct,
  getSingleProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} = require("../controllers/productController");
const { getSingleProductReviews } = require("../controllers/reviewController");

router
  .route("/")
  .get(getAllProduct) //Public routes
  .post([authenticateUser, authorizePermissions("admin")], createProduct); //Protected routes

router
  .route("/uploadImage")
  .post([authenticateUser, authorizePermissions("admin")], uploadProductImage);

router
  .route("/:id")
  .get(getSingleProduct) //Public routes
  .delete([authenticateUser, authorizePermissions("admin")], deleteProduct) //Protected routes
  .put([authenticateUser, authorizePermissions("admin")], updateProduct); //Protected routes
router.route("/:id/reviews").get(getSingleProductReviews); //Public routes

module.exports = router;
