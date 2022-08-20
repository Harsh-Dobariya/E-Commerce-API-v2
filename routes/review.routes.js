const {
        createReview,
        getAllReviews,
        getSingleReview,
        updateReview,
        deleteReview
    } = require("../controllers/reviewController"),
    { authenticateUser } = require("../middleware/authentication"),
    router = require("express").Router();

router.route("/").post(authenticateUser, createReview).get(getAllReviews);

router.route("/:reviewId").get(getSingleReview).patch(authenticateUser, updateReview).delete(authenticateUser, deleteReview);

module.exports = router;
