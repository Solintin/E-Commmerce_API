const User = require("../model/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const createTokenUser = require("../Utils/createTokenUser");
const { attachCookiesToResponse } = require("../Utils/jwt");
const checkPermission = require("../Utils/checkPermission");

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
  checkPermission(user, req.params.id);
  res
    .status(StatusCodes.OK)
    .json({ message: "User retrieved successfully ", User: user });
};
const showCurrentUser = async (req, res) => {
  res
    .status(StatusCodes.OK)
    .json({ message: "User retrieved successfully ", User: req.user });
};
const updateUser = async (req, res) => {
  const { email, name } = req.body;
  if (!name || !email) {
    throw new CustomError.BadRequestError("parameters missing");
  }

  const user = await User.findByIdAndUpdate(
    req.user.userId,
    { email, name },
    { new: true, runValidators: true }
  );
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });

  res
    .status(StatusCodes.OK)
    .json({ Message: "User updated successfully.", user });
};
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("parameters incomplete");
  }
  const user = await User.findById(req.user.userId);
  const isMatch = await user.comparePassword(oldPassword);
  if (isMatch) {
    user.password = newPassword;
    await user.save();
    res
      .status(StatusCodes.OK)
      .json({ message: "User Password updated successfully " });
  } else {
    throw new CustomError.UnauthenticatedError("Old password is incorrect");
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
