const { createJWT, isTokenValid, attachCookieToResponse } = require("./jwt");
const createTokenUser = require("./createTokenUser");
const checkPermission = require("./checkPermissions");
const sendVerificationEmail = require("./sendVerificationEmail");
const sendResetPasswordEmail = require("./sendResetPasswordEmail");
const createHash = require("./createHash");

module.exports = {
    createTokenUser,
    createJWT,
    isTokenValid,
    attachCookieToResponse,
    checkPermission,
    sendVerificationEmail,
    sendResetPasswordEmail,
    createHash
};
