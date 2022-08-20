const {
        createOrder,
        getAllOrders,
        getSingleOrder,
        getCurrentUserOrders,
        updateOrder,
        deleteOrder
    } = require("../controllers/orderController"),
    { authenticateUser, authorizeRoles } = require("../middleware/authentication"),
    router = require("express").Router();

router
    .route("/")
    .post(authenticateUser, createOrder)
    .get([authenticateUser, authorizeRoles("admin")], getAllOrders);

router.route("/showAllMyOrders").get(authenticateUser, getCurrentUserOrders);

router
    .route("/:orderId")
    .get(authenticateUser, getSingleOrder)
    .patch(authenticateUser, updateOrder)
    .delete(authenticateUser, deleteOrder);

module.exports = router;
