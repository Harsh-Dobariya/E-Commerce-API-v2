const { register, login, logout, verifyEmail, forgotPassword, resetPassword } = require("../controllers/authController"),
    { authenticateUser } = require("../middleware/authentication"),
    router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", authenticateUser, logout);

router.post("/verify-email", verifyEmail);
router.get("/verify-email", verifyEmail);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
