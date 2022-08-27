const User = require("../model/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const { createJWT, attachCookiesToResponse } = require("../Utils/jwt");
const createTokenUser = require("../Utils/createTokenUser");

//Register User
const register = async (req, res) => {
  const { email, password, name } = req.body;
  const isEmailExists = await User.findOne({ email });
  if (isEmailExists) {
    throw new CustomError.BadRequestError("User already exist");
  }

  const isFirstUser = (await User.countDocuments({})) === 0;
  const role = isFirstUser ? "admin" : "user";

  const user = await User.create({ email, password, name, role });
  const tokenUser = createTokenUser(user);
  // const token = createJWT({ payload: tokenUser });
  attachCookiesToResponse({ res, user: tokenUser });

  res
    .status(StatusCodes.CREATED)
    .json({ Message: "User created successfully.", user });
};

//Login User

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.BadRequestError("Invalid credentials");
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    throw new CustomError.BadRequestError("Invalid credentials");
  }

  const tokenUser = createTokenUser(user);
  // const token = createJWT({ payload: tokenUser });
  attachCookiesToResponse({ res, user: tokenUser });

  res
    .status(StatusCodes.OK)
    .json({ Message: "User Logged in successfully.", user });
};

//Logout User

const logout = async (req, res) => {
  res.cookie("token", "logout", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({ msg: "User Logged Out" });
};

module.exports = {
  register,
  login,
  logout,
};
