const jwt = require("jsonwebtoken");

const createJWT = (payload) => jwt.sign(payload, process.env.JWT_SECRET_KEY);

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET_KEY);

const attachCookieToResponse = ({ res, user, refreshToken }) => {
    const accessTokenJWT = createJWT({ user });
    const refreshTokenJWT = createJWT({ user, refreshToken });

    res.cookie("accessToken", accessTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        signed: true,
        expires: new Date(Date.now() + eval(process.env.ACCESS_TOKEN_LIFETIME))
    });

    res.cookie("refreshToken", refreshTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        signed: true,
        expires: new Date(Date.now() + eval(process.env.REFRESH_TOKEN_LIFETIME))
    });
};

module.exports = { createJWT, isTokenValid, attachCookieToResponse };
