const User = require("../model/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res
    .status(StatusCodes.OK)
    .json({ message: "Users retrieved successfully ", Users: users });
};
const getSingleUser = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    throw new CustomError.BadRequestError("User not found");
  }
  res
    .status(StatusCodes.OK)
    .json({ message: "User retrieved successfully ", User: user });
};
const showCurrentUser = async (req, res) => {
  res.send("get 3 users route");
};
const updateUser = async (req, res) => {
  res.send("get 4 users route");
};
const updateUserPassword = async (req, res) => {
  res.send("get 5 users route");
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
