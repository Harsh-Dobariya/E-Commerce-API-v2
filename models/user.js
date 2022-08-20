const mongoose = require("mongoose"),
    validator = require("validator"),
    bcrypt = require("bcryptjs"),
    { UnauthenticatedError } = require("../errors");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        unique: true,
        validate: [(v) => validator.isEmail(v), "Please provide valid email"]
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        minlength: 6
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function (password) {
    const isMatch = await bcrypt.compare(password, this.password);
    if (!isMatch) throw new UnauthenticatedError("Invalid password provided");
};

userSchema.statics.login = async function (email, password) {
    const user = await this.model("User").findOne({ email });
    if (!user) throw new UnauthenticatedError("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthenticatedError("Invalid email or password");

    return user;
};

module.exports = mongoose.model("User", userSchema, "User");
