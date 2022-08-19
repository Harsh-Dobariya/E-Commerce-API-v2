const CustomError = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
    let token;
    // check header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
    }
    // check cookies
    else if (req.signedCookies.token) {
        token = req.signedCookies.token;
    }

    if (!token) {
        throw new CustomError.UnauthenticatedError("Authentication invalid");
    }
    try {
        const { name, userId, role } = isTokenValid(token);

        // Attach the user and his permissions to the req object
        req.user = { name, userId, role };

        next();
    } catch (error) {
        throw new CustomError.UnauthenticatedError("Authentication invalid");
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError.UnauthorizedError("Unauthorized to access this route");
        }
        next();
    };
};

module.exports = { authenticateUser, authorizeRoles };
