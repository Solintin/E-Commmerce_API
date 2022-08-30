const User = require("../model/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");
const {
  createJWT,
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
} = require("../Utils");

const crypto = require("crypto");

//Register User
const register = async (req, res) => {
  const { email, password, name } = req.body;
  const isEmailExists = await User.findOne({ email });
  if (isEmailExists) {
    throw new CustomError.BadRequestError("User already exist");
  }

  const isFirstUser = (await User.countDocuments({})) === 0;
  const role = isFirstUser ? "admin" : "user";

  const verificationToken = crypto.randomBytes(40).toString("hex");
  const user = await User.create({
    email,
    password,
    name,
    role,
    verificationToken,
  });

  //send verificationToken to email
  await sendVerificationEmail(email, name, verificationToken);

  res
    .status(StatusCodes.CREATED)
    .json({ Message: "Verification token sent to email." });

  // const tokenUser = createTokenUser(user);
  // // const token = createJWT({ payload: tokenUser });
  // attachCookiesToResponse({ res, user: tokenUser });

  // res
  //   .status(StatusCodes.CREATED)
  //   .json({ Message: "User created successfully.", user });
};

//Forgot password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new CustomError.BadRequestError("Email is required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.BadRequestError("Account not found");
  }
  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex");
    const PasswordTokenExpirationDate = new Date(Date.now + 1000 * 60 * 10);
    await User.findByIdAndUpdate(user._id, {
      passwordToken,
      PasswordTokenExpirationDate,
    });
  }

  res.status(200).json({ message: "Passsword reset token sent" });
};

//reset password
const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;
  if (!token || !email || !password) {
    throw new CustomError.BadRequestError("parameters incomplete");
  }
  const user = await User.findById(req.user.userId);

  if (user.PasswordTokenExpirationDate < Date.now()) {
    throw new CustomError.UnauthenticatedError("Token Exprired");
  }

  if (token === user.passwordToken) {
    user.password = password;
    user.PasswordTokenExpirationDate = null;
    user.passwordToken = null;
    await user.save();
    res
      .status(StatusCodes.OK)
      .json({ message: "User Password updated successfully " });
  } else {
    throw new CustomError.UnauthenticatedError("Token is incorrect");
  }
};
const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError("User not found");
  }
  if (user.isVerified) {
    return res.status(200).json({
      message: "Email already verified ",
      verificationToken,
      email,
    });
  }
  if (verificationToken !== user.verificationToken) {
    throw new CustomError.UnauthenticatedError(
      "Token is Invalid. Verification Failed"
    );
  }

  await User.findByIdAndUpdate(user._id, {
    isVerified: true,
    verified: Date.now(),
    verificationToken: " ",
  });

  res
    .status(200)
    .json({ message: "Email verified successfully", verificationToken, email });
};

//Login User

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid credentials");
  }

  const isPasswordMatch = await user.comparePassword(password);
  console.log(isPasswordMatch);

  if (!isPasswordMatch) {
    throw new CustomError.UnauthenticatedError("Invalid credentials");
  }

  //AUTH WORKFLOW

  const { isVerified } = user;

  if (!isVerified) {
    throw new CustomError.UnauthenticatedError("Email not verified yet.");
  }
  //AUTH WORKFLOW

  // const tokenUser = createTokenUser(user);
  // // const token = createJWT({ payload: tokenUser });
  // attachCookiesToResponse({ res, user: tokenUser });

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
  verifyEmail,
  forgotPassword,
  resetPassword,
};
