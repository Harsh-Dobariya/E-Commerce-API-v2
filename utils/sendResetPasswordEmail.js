const sendEmail = require("./sendEmail");

module.exports = async ({ name, email, token, origin }) => {
    const resetURL = `<a href="${origin}/auth/reset-password?token=${token}&email=${email}">Reset Password</a>`;

    const message = `<p>Please reset password by clicking on the following link: ${resetURL}</p>`;

    return sendEmail({
        to: email,
        subject: "Reset Password",
        html: `<h4> Hello, ${name}</h4>
        ${message}`
    });
};
