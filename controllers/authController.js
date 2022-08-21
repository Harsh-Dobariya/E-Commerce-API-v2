const User = require("../models/user"),
    Token = require("../models/token"),
    { StatusCodes } = require("http-status-codes"),
    CustomError = require("../errors"),
    {
        attachCookieToResponse,
        createTokenUser,
        sendVerificationEmail,
        sendResetPasswordEmail,
        createHash
    } = require("../utils"),
    crypto = require("crypto");

module.exports = {
    register: async (req, res) => {
        const { name, email, password } = req.body;

        const isFirstUser = (await User.countDocuments({})) === 0;
        const role = isFirstUser ? "admin" : "user";

        const verificationToken = crypto.randomBytes(40).toString("hex");
        const user = await User.create({ name, email, password, role, verificationToken });

        await sendVerificationEmail({ name, email, token: verificationToken, origin: process.env.ORIGIN });

        if (process.env.NODE_ENV === "production")
            return res.status(StatusCodes.CREATED).send({
                msg: "Success! Please verify your email"
            });

        res.status(StatusCodes.CREATED).send({
            msg: "Success! Please verify your email",
            verificationToken: user.verificationToken
        });
    },

    login: async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) throw new CustomError.BadRequestError("Please provide email and password");

        const user = await User.login(email, password);
        const tokenUser = createTokenUser(user);

        let refreshToken = "";
        const existingToken = await Token.findOne({ user: user._id });

        if (existingToken) {
            if (!existingToken.isValid) throw new CustomError.UnauthorizedError("Access Denied");

            refreshToken = existingToken.refreshToken;
            attachCookieToResponse({ res, user: tokenUser, refreshToken });
            return res.status(StatusCodes.OK).send({ user: tokenUser });
        }

        refreshToken = crypto.randomBytes(40).toString("hex");
        const userAgent = req.headers["user-agent"];
        const ip = req.ip;
        await Token.create({ user: user._id, refreshToken, ip, userAgent });

        attachCookieToResponse({ res, user: tokenUser, refreshToken });
        res.status(StatusCodes.OK).send({ user: tokenUser });
    },

    logout: async (req, res) => {
        await Token.findOneAndRemove({ user: req.user.userId });

        res.cookie("accessToken", "", { httpOnly: true, expires: new Date(Date.now()) });
        res.cookie("refreshToken", "", { httpOnly: true, expires: new Date(Date.now()) });

        res.status(StatusCodes.OK).send({ msg: "User logged out!" });
    },

    verifyEmail: async (req, res) => {
        const { token, email } = req.method === "POST" ? req.body : req.query;

        const user = await User.findOne({ email });
        if (!user || user.verificationToken !== token) throw new CustomError.UnauthenticatedError("Verification failed");

        user.verificationToken = "";
        user.isVerified = true;
        user.verified = Date.now();

        await user.save();
        res.send({ msg: "Success! Email verified" });
    },

    forgotPassword: async (req, res) => {
        const { email } = req.body;
        if (!email) throw new CustomError.BadRequestError("Please provide email");

        const user = await User.findOne({ email });
        let passwordToken = "";
        if (user) {
            passwordToken = crypto.randomBytes(60).toString("hex");
            const passwordTokenExpiry = new Date(Date.now() + 1000 * 60 * 10);

            await sendResetPasswordEmail({
                name: user.name,
                email: user.email,
                token: passwordToken,
                origin: process.env.ORIGIN
            });

            user.passwordToken = createHash(passwordToken);
            user.passwordTokenExpiry = passwordTokenExpiry;

            await user.save();
        }

        if (process.env.NODE_ENV === "production")
            return res.send({ msg: "Please check your email for reset password link" });

        res.send({ msg: "Please check your email for reset password link", passwordToken, email });
    },

    resetPassword: async (req, res) => {
        const { token, email, password } = req.body;
        if (!token || !email || !password) throw new CustomError.BadRequestError("Please provide token, email and password");

        const user = await User.findOne({ email });
        if (!user || user?.passwordToken !== createHash(token))
            throw new CustomError.UnauthenticatedError("Reset password failed");

        if (user.passwordTokenExpiry < Date.now()) throw new CustomError.UnauthenticatedError("Reset password link expired");

        user.password = password;
        user.passwordToken = "";
        user.passwordTokenExpiry = "";

        await user.save();
        res.send({ msg: "Success! Password reset successfully" });
    }
};
