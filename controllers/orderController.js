const { StatusCodes } = require("http-status-codes"),
    Product = require("../models/product"),
    Order = require("../models/order"),
    CustomError = require("../errors"),
    { checkPermission } = require("../utils");

const fakeStripeAPI = async ({ amount, currency }) => {
    const client_secret = "fake_client_secret";
    return { client_secret, amount };
};

module.exports = {
    createOrder: async (req, res) => {
        const { items: carItems, tax, shippingFee } = req.body;

        if (!carItems || !carItems.length) throw new CustomError.BadRequestError("Please provide car items");
        if (!tax || !shippingFee) throw new CustomError.BadRequestError("Please provide tax and shipping fee");

        const orderItems = [];
        let subtotal = 0;
        for (const item of carItems) {
            const dbProduct = await Product.findById(item.product);
            if (!dbProduct) throw new CustomError.NotFoundError(`No product found with id: ${item.product}`);

            const { _id: product, name, price, image } = dbProduct;

            orderItems.push({ product, name, price, image, amount: item.amount });
            subtotal += item.amount * price;
        }

        const total = subtotal + tax + shippingFee;
        const paymentIntent = await fakeStripeAPI({ amount: total, currency: "usd" });

        const order = await Order.create({
            tax,
            shippingFee,
            subtotal,
            total,
            orderItems,
            user: req.user.userId,
            clientSecret: paymentIntent.client_secret
        });

        res.status(StatusCodes.CREATED).send({ order, clientSecret: order.client_secret });
    },
    getAllOrders: async (req, res) => {
        const orders = await Order.find({});
        res.send({ orders, count: orders.length });
    },
    getSingleOrder: async (req, res) => {
        const order = await Order.findById(req.params.orderId);
        if (!order) throw new CustomError.NotFoundError(`No order found with id: ${req.params.orderId}`);

        checkPermission(req.user, order.user);
        res.send({ order });
    },
    getCurrentUserOrders: async (req, res) => {
        const orders = await Order.find({ user: req.user.userId });
        res.send({ orders, count: orders.length });
    },
    updateOrder: async (req, res) => {
        const { paymentIntentId } = req.body;

        const order = await Order.findById(req.params.orderId);
        if (!order) throw new CustomError.NotFoundError(`No order found with id: ${req.params.orderId}`);

        checkPermission(req.user, order.user);

        order.status = "paid";
        order.paymentIntentId = paymentIntentId;

        await order.save();
        res.send({ order });
    },
    deleteOrder: async (req, res) => {
        res.send("deleteOrder");
    }
};
