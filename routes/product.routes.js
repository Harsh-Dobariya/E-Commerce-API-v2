const {
        getAllProducts,
        createProduct,
        getSingleProduct,
        updateProduct,
        deleteProduct,
        uploadImage
    } = require("../controllers/productController"),
    { authenticateUser, authorizeRoles } = require("../middleware/authentication"),
    router = require("express").Router();

router
    .route("/")
    .post([authenticateUser, authorizeRoles("admin")], createProduct)
    .get(getAllProducts);

router.route("/uploadImage").post([authenticateUser, authorizeRoles("admin")], uploadImage);

router
    .route("/:productId")
    .get(getSingleProduct)
    .patch([authenticateUser, authorizeRoles("admin")], updateProduct)
    .delete([authenticateUser, authorizeRoles("admin")], deleteProduct);

module.exports = router;
