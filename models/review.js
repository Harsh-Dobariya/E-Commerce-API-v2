const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: [true, "Please provide a rating"]
        },
        title: {
            type: String,
            trim: true,
            required: [true, "Please provide a review title"],
            maxlength: [100, "Review title can not be more than 100 characters"]
        },
        comment: {
            type: String,
            required: [true, "Please provide a review comment"]
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "Please provide a userId"]
        },
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            required: [true, "Please provide a productId"]
        }
    },
    { timeStamps: true }
);

reviewSchema.index({ user: 1, product: 1 }, { unique: true });

reviewSchema.statics.calcAverageRating = async function (productId) {
    const result = await this.aggregate([
        {
            $match: { product: productId }
        },
        {
            $group: {
                _id: "$product",
                averageRating: { $avg: "$rating" },
                noOfReviews: { $sum: 1 }
            }
        }
    ]);

    await this.model("Product").findByIdAndUpdate(productId, {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        noOfReviews: Math.ceil(result[0]?.noOfReviews || 0)
    });
};

reviewSchema.post("save", async function () {
    await this.constructor.calcAverageRating(this.product);
});

reviewSchema.post("remove", async function () {
    await this.constructor.calcAverageRating(this.product);
});

module.exports = mongoose.model("Review", reviewSchema, "Review");
