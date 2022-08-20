const { StatusCodes } = require("http-status-codes"),
    Product = require("../models/product"),
    Review = require("../models/review"),
    CustomError = require("../errors"),
    { checkPermission } = require("../utils");

module.exports = {
    createReview: async (req, res) => {
        const { product: productId } = req.body;

        const isValidProduct = await Product.findById(productId);
        if (!isValidProduct) throw new CustomError.NotFoundError(`No product found with id: ${productId}`);

        const isAlredyReviewed = await Review.findOne({ user: req.user.userId, product: productId });
        if (isAlredyReviewed) throw new CustomError.BadRequestError("You have already reviewed this product");

        req.body.user = req.user.userId;

        const review = await Review.create(req.body);
        res.status(StatusCodes.CREATED).send({ review });
    },
    getAllReviews: async (req, res) => {
        const reviews = await Review.find({});
        res.send({ reviews, count: reviews.length });
    },
    getSingleReview: async (req, res) => {
        const review = await Review.findById(req.params.reviewId);
        if (!review) throw new CustomError.NotFoundError(`No review found with id: ${req.params.reviewId}`);

        res.send({ review });
    },
    updateReview: async (req, res) => {
        const { rating, title, comment } = req.body;

        const review = await Review.findById(req.params.reviewId);
        if (!review) throw new CustomError.NotFoundError(`No review found with id: ${req.params.reviewId}`);

        checkPermission(req.user, review.user);

        review.rating = rating;
        review.title = title;
        review.comment = comment;

        await review.save();
        res.send({ review });
    },
    deleteReview: async (req, res) => {
        const review = await Review.findById(req.params.reviewId);
        if (!review) throw new CustomError.NotFoundError(`No review found with id: ${req.params.reviewId}`);

        checkPermission(req.user, review.user);
        await review.remove();

        res.send({ mag: "Success! Review removed" });
    },
    getSingleProductReviews: async (req, res) => {
        const reviews = await Review.find({ product: req.params.productId });
        res.send({ reviews, count: reviews.length });
    }
};
