const User = require("../models/user"),
    { StatusCodes } = require("http-status-codes"),
    CustomError = require("../errors"),
    { attachCookieToResponse, createTokenUser } = require("../utils");

module.exports = {
    register: async (req, res) => {
        const { name, email, password } = req.body;

        const isFirstUser = (await User.countDocuments({})) === 0;
        const role = isFirstUser ? "admin" : "user";

        const user = await User.create({ name, email, password, role });
        const tokenUser = createTokenUser(user);

        attachCookieToResponse(res, tokenUser);
        res.status(StatusCodes.CREATED).send({ user: tokenUser });
    },

    login: async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) throw new CustomError.BadRequestError("Please provide email and password");

        const user = await User.login(email, password);
        const tokenUser = createTokenUser(user);

        attachCookieToResponse(res, tokenUser);
        res.status(StatusCodes.OK).send({ user: tokenUser });
    },

    logout: (req, res) => {
        res.cookie("token", "", { httpOnly: true, expires: new Date(Date.now()) });
        res.status(StatusCodes.OK).send({ msg: "User logged out!" });
    }
};
