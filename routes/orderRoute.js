const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const {
  createOrder,
  getSingleOrder,
  getAllOrder,
  updateOrder,
  deleteOrder,
  showAllMyOrders
} = require("../controllers/orderController");

router
  .route("/")
  .get([authenticateUser, authorizePermissions("admin")], getAllOrder) //protected routes
  .post(authenticateUser,createOrder); //Protected routes

router.route("/showAllMyOrders").get(authenticateUser, showAllMyOrders)
router
  .route("/:id")
  .get(authenticateUser, getSingleOrder) //Public routes
  .delete([authenticateUser], deleteOrder) //Protected routes
  .put([authenticateUser], updateOrder); //Protected routes

module.exports = router;
