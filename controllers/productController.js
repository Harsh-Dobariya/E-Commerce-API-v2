const { StatusCodes } = require("http-status-codes");
const Product = require("../models/product"),
    CustomError = require("../errors");

module.exports = {
    createProduct: async (req, res) => {
        req.body.user = req.user.userId;
        const product = await Product.create(req.body);
        res.status(StatusCodes.CREATED).send({ product });
    },
    getAllProducts: async (req, res) => {
        res.send("get All product");
    },
    getSingleProduct: async (req, res) => {
        res.send("get single product");
    },
    updateProduct: async (req, res) => {
        res.send("update product");
    },
    deleteProduct: async (req, res) => {
        res.send("delete product");
    },
    uploadImage: async (req, res) => {
        res.send("upload image");
    }
};
