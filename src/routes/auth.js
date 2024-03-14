const express = require("express");

const authController = require("../controllers/auth.controller");

const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");

router.get("/check", verifyToken, authController.check);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

module.exports = router;
