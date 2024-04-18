const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth");

const {
    register,
    login,
    logout,
    getMe,
} = require("../controller/auth");


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/me").get(protect, getMe);


module.exports = router;
