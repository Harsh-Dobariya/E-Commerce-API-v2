const jwt = require("jsonwebtoken");

const createJWT = (payload) => jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_LIFETIME });

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET_KEY);

const attachCookieToResponse = (res, user) => {
    const token = createJWT(user);

    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        secure: process.env.NODE_ENV === "production",
        signed: true
    });
};

module.exports = { createJWT, isTokenValid, attachCookieToResponse };
