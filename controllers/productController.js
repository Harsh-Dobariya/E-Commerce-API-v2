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
        const products = await Product.find({});
        res.send({ products, count: products.length });
    },
    getSingleProduct: async (req, res) => {
        const product = await Product.findById(req.params.productId).populate("reviews");
        if (!product) throw new CustomError.NotFoundError(`No product found with id: ${req.params.productId}`);

        res.send({ product });
    },
    updateProduct: async (req, res) => {
        const product = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true, runValidators: true });
        if (!product) throw new CustomError.NotFoundError(`No product found with id: ${req.params.productId}`);

        res.send({ product });
    },
    deleteProduct: async (req, res) => {
        const product = await Product.findById(req.params.productId);
        if (!product) throw new CustomError.NotFoundError(`No product found with id: ${req.params.productId}`);

        await product.remove();
        res.send({ product });
    },
    uploadImage: async (req, res) => {
        if (!req.files) throw new CustomError.BadRequestError("No file uploaded");

        const productImage = req.files.image;
        if (!productImage.mimetype.startsWith("image")) throw new CustomError.BadRequestError("Please upload an image");

        const maxSize = 1024 * 1024;
        if (productImage.size > maxSize) throw new CustomError.BadRequestError("Please upload an image smaller than 1MB");

        const imagePath = `${process.cwd()}/public/uploads/${productImage.name}`;
        await productImage.mv(imagePath);

        res.send({ image: `/uploads/${productImage.name}` });
    }
};
