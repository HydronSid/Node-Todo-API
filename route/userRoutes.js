const express = require("express");
const userController = require("../controller/userController.js");
const authController = require("./../controller/authController.js");
const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/signin", authController.login);

router.route("/").get(userController.getAllUsers);

router.route("/:id").get(userController.getUser);

module.exports = router;
