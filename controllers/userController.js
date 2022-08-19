const User = require("../models/user"),
    CustomError = require("../errors"),
    { createTokenUser, attachCookieToResponse, checkPermission } = require("../utils");

module.exports = {
    getAllUsers: async (req, res) => {
        const users = await User.find({ role: "user" }).select("-password");
        res.send({ users, count: users.length });
    },

    getSingleUser: async (req, res) => {
        const user = await User.findById(req.params.userId).select("-password");
        if (!user) throw new CustomError.NotFoundError(`No user with id: ${req.params.userId}`);

        checkPermission(req.user, user);
        res.send({ user });
    },

    showCurrentUser: (req, res) => {
        res.send({ user: req.user });
    },

    updateUser: async (req, res) => {
        const { name, email } = req.body;

        const user = await User.findByIdAndUpdate(req.user.userId, { name, email }, { new: true, runValidators: true });
        const tokenUser = createTokenUser(user);

        attachCookieToResponse(res, tokenUser);
        res.send({ user: tokenUser });
    },

    updateUserPassword: async (req, res) => {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) throw new CustomError.BadRequestError("Please provide both password");

        const user = await User.findById(req.user.userId);
        await user.comparePassword(oldPassword);

        user.password = newPassword;
        await user.save();

        res.send({ msg: "password successfully updated" });
    }
};
