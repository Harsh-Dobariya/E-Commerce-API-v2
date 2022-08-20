const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, "Please provide product name"],
            maxlength: [100, "Product name can not be more than 100 characters"]
        },
        price: {
            type: Number,
            default: 0
        },
        description: {
            type: String,
            required: [true, "Please provide product description"],
            maxlength: [1000, "Product description can not be more than 1000 characters"]
        },
        image: {
            type: String,
            default: "/uploads/example.jpeg"
        },
        category: {
            type: String,
            required: [true, "Please provide product category"],
            enum: {
                values: ["office", "kitchen", "bedroom"],
                message: "{VALUE} is not a valid category"
            }
        },
        company: {
            type: String,
            required: [true, "Please provide product company"],
            enum: {
                values: ["ikea", "liddy", "marcos"],
                message: "{VALUE} is not a valid company"
            }
        },
        colors: {
            type: [String],
            default: ["#222"]
        },
        featured: {
            type: Boolean,
            default: false
        },
        freeShipping: {
            type: Boolean,
            default: false
        },
        inventory: {
            type: Number,
            default: 15
        },
        averageRating: {
            type: Number,
            default: 0
        },
        noOfReviews: {
            type: Number,
            default: 0
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "Please provide userId"]
        }
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "product",
    justOne: false
});

productSchema.pre("remove", async function (next) {
    await this.model("Review").deleteMany({ product: this._id });
    next();
});

module.exports = mongoose.model("Product", productSchema, "Product");
