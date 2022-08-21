const Token = require("../models/token");
const CustomError = require("../errors");
const { isTokenValid, attachCookieToResponse } = require("../utils");

const authenticateUser = async (req, res, next) => {
    const { refreshToken, accessToken } = req.signedCookies;

    try {
        if (accessToken) {
            const { user } = isTokenValid(accessToken);
            req.user = user;
            return next();
        }

        const payload = isTokenValid(refreshToken);
        const existingToken = await Token.findOne({ user: payload.user.userId, refreshToken: payload.refreshToken });
        if (!existingToken || !existingToken?.isValid) throw new CustomError.UnauthorizedError("Authentication invalid");

        attachCookieToResponse({ res, user: payload.user, refreshToken: existingToken.refreshToken });
        req.user = payload.user;
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
