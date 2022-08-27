const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");

const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require("../controllers/userController");

router.route("/").get(getAllUsers);
router.route("/showMe").get(showCurrentUser);
router.route("/updateUser").put(updateUser);
router.route("/updateUserPassword").put(updateUserPassword);
router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
