const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/index");

const checkPermission = (user, resourceId) => {
  if (user.role === "admin") return;
  if (user.id.toString() == resourceId) return;
  throw new CustomError.UnauthorizedError(
    "Not authorized to access this resource"
  );
};

module.exports = checkPermission;
