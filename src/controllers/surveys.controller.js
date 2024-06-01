const { v4: uuidv4 } = require("uuid");
const {
  getS3Client,
  getDeleteObjectCommand,
  getPutObjectCommand,
} = require("../config/s3Config");
const User = require("../models/User");
const Survey = require("../models/Survey");
const errors = require("../constants/error");

async function uploadImageToS3(file, optionId) {
  const s3Client = getS3Client();
  const imageId = optionId || uuidv4();
  const bucketName = process.env.AWS_BUCKET_NAME;
  const putObjectCommand = getPutObjectCommand(
    bucketName,
    imageId,
    file.buffer,
  );

  try {
    await s3Client.send(putObjectCommand);
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageId}`;

    return { imageId, imageUrl };
  } catch (error) {
    console.error("S3에 업로드 하는데 실패:", error);
  }
}

async function deleteImageFromS3(imageId) {
  const deleteObjectCommand = getDeleteObjectCommand(
    process.env.AWS_BUCKET_NAME,
    imageId,
  );

  const s3Client = getS3Client();

  try {
    await s3Client.send(deleteObjectCommand);

    console.log(`s3에 있는 ${imageId}가 지워졌습니다.`);
  } catch (error) {
    console.error("S3에서 삭제하는데 실패했습니다:", error);
  }
}

exports.getAllSurveys = async (req, res, next) => {
  const { userid } = req.params;

  try {
    const user = await User.findById(userid);
    const surveys = await Survey.find({ creator: userid }).populate("creator");

    if (!user) {
      const error = new Error(errors.NOT_AUTHORIZED);
      error.status = errors.NOT_AUTHORIZED;

      next(error);
    }

    res.status(201).json(surveys);
  } catch (error) {
    error.message = errors.INTERNAL_SERVER_ERROR.message;
    error.status = errors.INTERNAL_SERVER_ERROR.status;
  }
};

exports.getSurvey = async (req, res, next) => {
  const { userid, surveyid } = req.params;

  try {
    const user = await User.findById(userid);
    const targetSurvey = await Survey.findById(surveyid);

    if (!user) {
      const error = new Error(errors.NOT_AUTHORIZED);
      error.status = errors.NOT_AUTHORIZED;

      next(error);
    }

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
    error.message = errors.INTERNAL_SERVER_ERROR.message;
    error.status = errors.INTERNAL_SERVER_ERROR.status;
  }
};

exports.createSurvey = async (req, res, next) => {
  const { userid } = req.params;
  const surveyData = req.body;

  try {
    const user = await User.findById(userid);

    if (!user) {
      const error = new Error(errors.NOT_AUTHORIZED);
      error.status = errors.NOT_AUTHORIZED;

      next(error);
    }

    const uploadedImages = {};
    const uploadedImagesIDs = {};

    if (req.files.length > 0) {
      const imageOptionIds = surveyData.questions
        .filter((question) => question.questionType === "imageChoice")
        .flatMap((question) =>
          question.options.map((option) => option.optionId),
        );

      const uploadPromises = req.files.map(async (file, index) => {
        const imageObj = await uploadImageToS3(file, imageOptionIds[index]);

        uploadedImages[imageObj.imageId] = imageObj.imageUrl;
        uploadedImagesIDs[index] = imageObj.imageId;
      });

      await Promise.all(uploadPromises);
    }

    let imageOptionIndex =
      (req.files[0] && req.files[0].fieldname) === "coverImage" ? 1 : 0;

    const newSurvey = new Survey({
      creator: surveyData.creator,
      title: surveyData.title,
      subtitle: surveyData.subtitle,
      startButtonText: surveyData.startButtonText,
      themeColor: surveyData.themeColor,
      buttonShape: surveyData.buttonShape,
      animation: surveyData.animation,
      endingTitle: surveyData.endingTitle,
      endingContent: surveyData.endingContent,
      coverImage: req.files
        ? (req.files[0] && req.files[0].fieldname) === "coverImage"
          ? {
              imageUrl: uploadedImages[uploadedImagesIDs[0]],
              imageId: uploadedImagesIDs[0],
            }
          : null
        : null,
      questions: surveyData.questions?.map((question) => {
        if (question.questionType === "imageChoice") {
          question.options = question.options?.map((option) => {
            option.optionId = uploadedImagesIDs[imageOptionIndex];
            option.image = {
              imageUrl: uploadedImages[uploadedImagesIDs[imageOptionIndex]],
              imageId: uploadedImagesIDs[imageOptionIndex],
            };

            imageOptionIndex++;

            return option;
          });
        }

        return question;
      }),
    });

    await newSurvey.save();

    const surveyId = newSurvey._id;
    const surveyUrl = `${process.env.CLIENT_URL}/form/${surveyId}`;
    res
      .status(201)
      .json({ success: true, message: "설문 생성 성공", url: surveyUrl });
  } catch (error) {
    error.message = errors.INTERNAL_SERVER_ERROR.message;
    error.status = errors.INTERNAL_SERVER_ERROR.status;
  }
};

exports.editSurvey = async (req, res, next) => {
  const { userid, surveyid } = req.params;
  const updatedSurveyData = req.body;

  try {
    const user = await User.findById(userid);
    const existingSurveyData = await Survey.findById(surveyid);

    if (!user) {
      const error = new Error(errors.NOT_AUTHORIZED);
      error.status = errors.NOT_AUTHORIZED;

      next(error);
    }

    if (!updatedSurveyData || !existingSurveyData) {
      const error = new Error(errors.INTERNAL_SERVER_ERROR);
      error.status = errors.INTERNAL_SERVER_ERROR;

      next(error);
    }

    const uploadedImages = {};
    const uploadedImagesIDs = {};

    if (req.files.length > 0) {
      const imageOptionIds = updatedSurveyData.questions
        .filter((question) => question.questionType === "imageChoice")
        .flatMap((question) =>
          question.options
            .filter((option) => !option.image)
            .map((option) => option.optionId),
        );

      if (req.files[0].fieldname === "coverImage") {
        if (
          existingSurveyData.coverImage &&
          existingSurveyData.coverImage.imageId
        ) {
          await deleteImageFromS3(existingSurveyData.coverImage.imageId);
        }

        const newCoverImage = req.files.shift();
        const coverImageObj = await uploadImageToS3(newCoverImage);

        existingSurveyData.coverImage = {
          imageUrl: coverImageObj.imageUrl,
          imageId: coverImageObj.imageId,
        };
      }

      const uploadPromises = req.files.map(async (file, index) => {
        const imageObj = await uploadImageToS3(file, imageOptionIds[index]);

        uploadedImages[imageObj.imageId] = imageObj.imageUrl;
        uploadedImagesIDs[index] = imageObj.imageId;
      });

      await Promise.all(uploadPromises);
    }

    const newUpdatedSurveyData = updatedSurveyData;

    newUpdatedSurveyData.questions = updatedSurveyData.questions.map(
      (question) => {
        if (question.questionType === "imageChoice") {
          const newQuestion = question;

          newQuestion.options = question.options.map((option) => {
            if (!option.image && uploadedImages[option.optionId]) {
              const newOption = option;

              newOption.image = {
                imageUrl: uploadedImages[option.optionId],
                optionId: option.optionId,
              };

              return newOption;
            }

            return option;
          });

          return newQuestion;
        }

        return question;
      },
    );

    newUpdatedSurveyData.questions = newUpdatedSurveyData.questions.map(
      (updatedQuestion) => {
        const existingQuestion = existingSurveyData.questions.find(
          (question) => question.questionId === updatedQuestion.questionId,
        );

        if (existingQuestion && existingQuestion.answers) {
          updatedQuestion.answers = existingQuestion.answers;
        }

        return updatedQuestion;
      },
    );

    existingSurveyData.questions.forEach((existingQuestion) => {
      if (existingQuestion.questionType === "imageChoice") {
        existingQuestion.options.forEach(async (existingOption) => {
          const updatedOption = newUpdatedSurveyData.questions
            .find(
              (question) => question.questionId === existingQuestion.questionId,
            )
            ?.options.find(
              (option) => option.optionId === existingOption.optionId,
            );

          if (
            !updatedOption ||
            existingOption.optionId !== updatedOption.optionId
          ) {
            await deleteImageFromS3(existingOption.optionId);
          }
        });
      }
    });

    existingSurveyData.title =
      updatedSurveyData.title || existingSurveyData.title;
    existingSurveyData.subtitle =
      updatedSurveyData.subtitle || existingSurveyData.subtitle;
    existingSurveyData.startButtonText =
      updatedSurveyData.startButtonText || existingSurveyData.startButtonText;
    existingSurveyData.themeColor =
      updatedSurveyData.themeColor || existingSurveyData.themeColor;
    existingSurveyData.buttonShape =
      updatedSurveyData.buttonShape || existingSurveyData.buttonShape;
    existingSurveyData.animation =
      updatedSurveyData.animation || existingSurveyData.animation;
    existingSurveyData.endingTitle =
      updatedSurveyData.endingTitle || existingSurveyData.endingTitle;
    existingSurveyData.endingContent =
      updatedSurveyData.endingContent || existingSurveyData.endingContent;
    existingSurveyData.questions =
      newUpdatedSurveyData.questions || existingSurveyData.questions;

    const surveyUrl = `${process.env.CLIENT_URL}/form/${surveyid}`;

    await existingSurveyData.save();

    res
      .status(200)
      .json({ success: true, message: "설문 수정 성공", url: surveyUrl });
  } catch (error) {
    error.message = errors.INTERNAL_SERVER_ERROR.message;
    error.status = errors.INTERNAL_SERVER_ERROR.status;
  }
};

exports.deleteSurvey = async (req, res, next) => {
  const { userid, surveyid } = req.params;

  try {
    const user = await User.findById(userid);
    const targetSurvey = await Survey.findById(surveyid).populate("creator");

    if (!user) {
      const error = new Error(errors.NOT_AUTHORIZED);
      error.status = errors.NOT_AUTHORIZED;

      next(error);
    }

    if (!targetSurvey) {
      return res.status(404).json({ error: "존재하지 않는 설문입니다." });
    }

    if (targetSurvey.coverImage && targetSurvey.coverImage.imageId) {
      await deleteImageFromS3(targetSurvey.coverImage.imageId);
    }

    await Promise.all(
      targetSurvey.questions.map(async (question) => {
        return Promise.all(
          question.options.map(async (option) => {
            if (option.image && option.image.imageId) {
              await deleteImageFromS3(option.image.imageId);
            }
          }),
        );
      }),
    );

    await Survey.findByIdAndDelete(surveyid);

    res.status(200).json({ success: true });
  } catch (error) {
    error.message = errors.INTERNAL_SERVER_ERROR.message;
    error.status = errors.INTERNAL_SERVER_ERROR.status;
  }
};
