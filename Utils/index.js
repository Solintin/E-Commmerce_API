const { createJWT, attachCookiesToResponse } = require("../Utils/jwt");
const createTokenUser = require("../Utils/createTokenUser");
const sendVerificationEmail = require("../Utils/sendVerificationEmail");
const sendResetPassword = require("../Utils/sendResetPassword");
const checkPermission = require("../Utils/checkPermission");

module.exports = {
  createJWT,
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
  sendResetPassword,
  checkPermission,
};
  