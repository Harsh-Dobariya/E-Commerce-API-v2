require("dotenv").config();
require("express-async-errors");

// express
const express = require("express");
const app = express();

// rest of the packages
const morgan = require("morgan");
const chalk = require("chalk");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// database
const connectDB = require("./db/connect");

// routers
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const productRouter = require("./routes/product.routes");
const reviewRouter = require("./routes/review.routes");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

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

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URI);
        app.listen(port, () => console.log(`Server is running on...http://localhost:${port}`));
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

start();
