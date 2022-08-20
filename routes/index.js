// Rest of packages
const cors = require("cors"),
    helmet = require("helmet"),
    xss = require("xss-clean"),
    mongoSanitize = require("express-mongo-sanitize"),
    rateLimiter = require("express-rate-limit"),
    morgan = require("morgan"),
    chalk = require("chalk"),
    express = require("express"),
    cookieParser = require("cookie-parser"),
    fileUpload = require("express-fileupload");

// Routes
const authRouter = require("./auth.routes"),
    userRouter = require("./user.routes"),
    productRouter = require("./product.routes"),
    reviewRouter = require("./review.routes"),
    orderRouter = require("./order.routes");

// Middleware
const notFoundMiddleware = require("../middleware/not-found"),
    errorHandlerMiddleware = require("../middleware/error-handler");

module.exports = (app) => {
    app.set("trust proxy", 1);
    app.use(cors());
    app.use(helmet());
    app.use(xss());
    app.use(mongoSanitize());
    app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 60 }));

    app.use(
        morgan((tokens, req, res) => {
            return `${chalk.blue(tokens.method(req, res))} ${chalk.green(tokens.url(req, res))} ${chalk.red(
                tokens["response-time"](req, res)
            )}`;
        })
    );

    app.use(express.json());
    app.use(cookieParser(process.env.JWT_SECRET_KEY));
    app.use(express.static("public"));
    app.use(fileUpload());

    app.use("/api/v1/auth", authRouter);
    app.use("/api/v1/users", userRouter);
    app.use("/api/v1/products", productRouter);
    app.use("/api/v1/reviews", reviewRouter);
    app.use("/api/v1/orders", orderRouter);

    app.use(notFoundMiddleware);
    app.use(errorHandlerMiddleware);
};
