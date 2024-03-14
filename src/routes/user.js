const express = require("express");

const surveysController = require("../controllers/surveys.controller");

const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");

router.get("/:userid/surveys", verifyToken, surveysController.getAllSurveys);

module.exports = router;
