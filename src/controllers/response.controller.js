const mongoose = require("mongoose");
const Survey = require("../models/Survey");
const errors = require("../constants/error");

exports.getPublicSurvey = async (req, res, next) => {
  const { surveyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(surveyId)) {
    return res.status(405).json({ error: "유효하지 않은 설문 ID입니다." });
  }

  try {
    const targetSurvey = await Survey.findById(surveyId).exec();

    if (!targetSurvey) {
      return res.status(404).json({ error: "존재하지 않는 설문입니다." });
    }

    const survey = {
      _id: targetSurvey._id,
      creator: targetSurvey.creator,
      title: targetSurvey.title,
      subtitle: targetSurvey.subtitle,
      coverImage: targetSurvey.coverImage,
      startButtonText: targetSurvey.startButtonText,
      themeColor: targetSurvey.themeColor,
      buttonShape: targetSurvey.buttonShape,
      animation: targetSurvey.animation,
      endingTitle: targetSurvey.endingTitle,
      endingContent: targetSurvey.endingContent,
      questions: targetSurvey.questions,
      createdAt: targetSurvey.createdAt,
    };

    res.status(201).json(survey);
  } catch (error) {
    console.error(error);
    error.message = errors.INTERNAL_SERVER_ERROR.message;
    error.status = errors.INTERNAL_SERVER_ERROR.status;
  }
};

exports.submitResponse = async (req, res, next) => {
  const { surveyId } = req.params;
  const { surveyAnswers } = req.body;

  try {
    const survey = await Survey.findById(surveyId);

    if (!survey) {
      const error = new Error(errors.INTERNAL_SERVER_ERROR);
      error.status = errors.INTERNAL_SERVER_ERROR;

      next(error);
    }

    for (const questionId in surveyAnswers) {
      const answer = surveyAnswers[questionId];
      const question = survey.questions.find(
        (question) => question.questionId === questionId,
      );

      if (question) {
        question.answers.push({
          answerValue: answer,
          createdAt: new Date(),
        });
      }
    }

    await survey.save();

    res.status(201).json({ success: true, message: "응답이 저장되었습니다." });
  } catch (error) {
    error.message = errors.INTERNAL_SERVER_ERROR.message;
    error.status = errors.INTERNAL_SERVER_ERROR.status;
  }
};

exports.getSurveyResponses = async (req, res, next) => {
  const { surveyId } = req.params;

  try {
    const targetSurvey = await Survey.findById(surveyId);

    if (!targetSurvey) {
      return res.status(404).json({ error: "존재하지 않는 설문입니다." });
    }

    const responses = [];

    targetSurvey.questions.forEach((question) => {
      question.answers.forEach((answer) => {
        const createdAtUTC = new Date(answer.createdAt);
        const createdAtKST = new Date(
          createdAtUTC.getTime() + 9 * 60 * 60 * 1000,
        );

        responses.push({
          questionText: question.questionText,
          answerValue: answer.answerValue,
          createdAt: createdAtKST.toISOString(),
        });
      });
    });

    res.status(200).json({
      success: true,
      message: "설문 응답 데이터를 성공적으로 가져왔습니다.",
      responses: responses,
    });
  } catch (error) {
    next(error);
  }
};
