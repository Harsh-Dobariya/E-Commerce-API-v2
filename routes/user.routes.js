const {
        getAllUsers,
        showCurrentUser,
        updateUser,
        updateUserPassword,
        getSingleUser
    } = require("../controllers/userController"),
    { authenticateUser, authorizeRoles } = require("../middleware/authentication"),
    router = require("express").Router();

router.get("/", authenticateUser, authorizeRoles("admin"), getAllUsers);

router.get("/showMe", authenticateUser, showCurrentUser);
router.patch("/updateUser", authenticateUser, updateUser);
router.patch("/updateUserPassword", authenticateUser, updateUserPassword);

router.get("/:userId", authenticateUser, getSingleUser);

module.exports = router;
