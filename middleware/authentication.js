const CustomError = require("../errors");
const { isTokenValid } = require("../utils/jwt");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new CustomError.UnauthenticatedError("Authentication invalid");
  } else {
    try {
      const payload = isTokenValid({ token });
      console.log(payload);
      req.user = payload;

      next();
    } catch (error) {
      throw new CustomError.UnauthenticatedError("Authentication invalid");
    }
  }
};

module.exports = { authenticateUser };
