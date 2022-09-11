const { StatusCodes } = require("http-status-codes");
const { logger } = require("../utils");

const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "Something went wrong try again later"
    };

    if (err.name === "ValidationError") {
        customError.msg = Object.values(err.errors)
            .map((item) => item.message)
            .join(", ");
        customError.statusCode = 400;
    }
    if (err.code && err.code === 11000) {
        customError.msg = `${Object.keys(err.keyValue)} already exist, please provide another ${Object.keys(err.keyValue)}`;
        customError.statusCode = 400;
    }
    if (err.name === "CastError") {
        customError.msg = `No item found with id : ${err.value}`;
        customError.statusCode = 404;
    }

    logger.error(`${customError.statusCode} - ${customError.msg} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    return res.status(customError.statusCode).json({
        success: false,
        status: customError.statusCode,
        msg: customError.msg,
        stack: process.env.NODE_ENV === "development" ? err.stack : {}
    });
};

module.exports = errorHandlerMiddleware;
