require("dotenv").config();
require("express-async-errors");

// logger
const { logger } = require("./utils");

// express
const express = require("express");
const app = express();

require("./routes")(app);

// database
const connectDB = require("./db/connect");

const port = process.env.PORT || 5000;
const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URI);
        app.listen(port, () => logger.info(`Server is running on...http://localhost:${port}`));
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
};

start();
