const CustomError = require("../errors");

const checkPermission = (reqUser, resUser) => {
    if (reqUser.role === "admin" || reqUser.userId === resUser._id.toString()) return;

    throw new CustomError.UnauthorizedError("Not authorized to access this route");
};

module.exports = checkPermission;
