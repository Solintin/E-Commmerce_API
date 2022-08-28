const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");
const {
  createReview,
  getSingleReview,
  getAllReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

router
  .route("/")
  .get(getAllReview) //Public routes
  .post([authenticateUser], createReview); //Protected routes

router
  .route("/:id")
  .get(getSingleReview) //Public routes
  .delete([authenticateUser], deleteReview) //Protected routes
  .put([authenticateUser], updateReview); //Protected routes

module.exports = router;
