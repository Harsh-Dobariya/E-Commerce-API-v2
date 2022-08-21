const sendEmail = require("./sendEmail");

module.exports = async ({ name, email, token, origin }) => {
    const verifyEmail = `<a href="${origin}/auth/verify-email?token=${token}&email=${email}">Verify Email</a>`;

    const message = `<p>Please confirm your email by clicking on the following link: ${verifyEmail}</p>`;

    return sendEmail({
        to: email,
        subject: "Email Verification",
        html: `<h4> Hello, ${name}</h4>
        ${message}`
    });
};
