const nodemailer = require("nodemailer"),
    nodemailerConfig = require("./nodemailerConfig");

module.exports = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport(nodemailerConfig);

    return transporter.sendMail({
        from: `"Harsh-Dobariya" <harsh@gmail.com>`,
        to,
        subject,
        html
    });
};
