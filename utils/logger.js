const { createLogger, format, transports } = require("winston"),
    moment = require("moment-timezone");

const logColors = {
    error: "red",
    info: "green",
    data: "grey",
    debug: "white",
    help: "blue",
    warn: "yellow",
    input: "gray"
};

const logFormat = format.combine(
    format.colorize({
        colors: logColors,
        message: true
    }),
    format.timestamp(),
    format.prettyPrint(),
    format.printf(({ level, message, label, timestamp }) => {
        timestamp = moment().format("YYYY.MM.DD HH:mm:ss");
        return `[${timestamp}] ${level.toUpperCase().trim()} ${message}`;
    })
);

const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.simple(),
        format.printf(({ level, message, label, timestamp }) => {
            timestamp = moment().tz("Asia/Kolkata").format("DD.MM.YYYY HH:mm:ss");
            return `[${timestamp}] ${level.toUpperCase().trim()} "${message}"`;
        })
    ),
    transports: [
        // new transports.File({ filename: "server_logs.log" }),
        new transports.Console({
            format: logFormat
        })
    ],
    // exceptionHandlers: [new transports.File({ filename: "exceptions.log" })],
    exitOnError: false
});

module.exports = logger;
