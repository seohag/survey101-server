const express = require("express");
const router = express.Router();
const responseController = require("../controllers/response.controller");

router.get("/surveys/:surveyId", responseController.getPublicSurvey);

router.get(
  "/surveys/:surveyId/surveyResponses",
  responseController.getSurveyResponses,
);
router.post("/surveys/:surveyId/answers", responseController.submitResponse);

module.exports = router;
