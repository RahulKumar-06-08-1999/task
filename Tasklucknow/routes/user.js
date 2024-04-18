const express = require("express");
const router = express.Router();

const User = require("../models/user");

const { protect, authorize } = require("../middleware/auth");
const advanceResults = require("../middleware/advanceResults");


const {   
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require("../controller/user");

router.use(protect);

router.route("/").get(advanceResults(User), getUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;