const express = require("express");

const multer = require("multer");

const surveysController = require("../controllers/surveys.controller");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const verifyToken = require("../middlewares/verifyToken");

router.get("/:userid/surveys", verifyToken, surveysController.getAllSurveys);
router.post(
  "/:userid/surveys",
  verifyToken,
  upload.any(),
  surveysController.createSurvey,
);

module.exports = router;
