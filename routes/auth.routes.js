const { register, login, logout } = require("../controllers/authController"),
    router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
