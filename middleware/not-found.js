const { logger } = require("../utils");
const notFound = (req, res) => {
    logger.error(`404 - Route does not exist - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(404).send("Route does not exist");
};

module.exports = notFound;
