const mongoose = require("mongoose");

const singleOrderItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }
});

const orderSchema = new mongoose.Schema(
    {
        tax: {
            type: Number,
            required: [true, "Please provide tax"]
        },
        shippingFee: {
            type: Number,
            required: [true, "Please provide shipping fee"]
        },
        subtotal: {
            type: Number,
            required: [true, "Please provide sub total"]
        },
        total: {
            type: Number,
            required: [true, "Please provide total"]
        },
        orderItems: [singleOrderItemSchema],
        status: {
            type: String,
            enum: ["pending", "failed", "paid", "delivered", "canceled"],
            default: "pending"
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide user"]
        },
        clientSecret: {
            type: String,
            required: [true, "Please provide client secret"]
        },
        paymentIntentId: {
            type: String
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema, "Order");
