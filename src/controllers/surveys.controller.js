const { v4: uuidv4 } = require("uuid");

const {
  getS3Client,
  getDeleteObjectCommand,
  getPutObjectCommand,
} = require("../config/s3Config");

const User = require("../models/User");
const Survey = require("../models/Survey");

const errors = require("../constants/error");

async function uploadImageToS3(file) {
  const s3Client = getS3Client();
  const imageId = uuidv4();
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

    if (!surveys || surveys.length === 0) {
      return res
        .status(404)
        .json({ error: "해당 유저가 만든 설문이 없습니다." });
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
  const survey = req.body;

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
      const uploadPromises = req.files.map(async (file, index) => {
        const imageObj = await uploadImageToS3(file);

        uploadedImagesIDs[index] = imageObj.imageId;
        uploadedImages[imageObj.imageId] = imageObj.imageUrl;
      });

      await Promise.all(uploadPromises);
    }

    let imageOptionIndex =
      (req.files[0] && req.files[0].fieldname) === "coverImage" ? 1 : 0;

    const newSurvey = new Survey({
      creator: survey.creator,
      title: survey.title,
      subtitle: survey.subtitle,
      startButtonText: survey.startButtonText,
      themeColor: survey.themeColor,
      buttonShape: survey.buttonShape,
      animation: survey.animation,
      endingTitle: survey.endingTitle,
      endingContent: survey.endingContent,
      coverImage: req.files
        ? (req.files[0] && req.files[0].fieldname) === "coverImage"
          ? {
              imageUrl: uploadedImages[uploadedImagesIDs[0]],
              imageId: uploadedImagesIDs[0],
            }
          : null
        : null,
      questions: survey.questions?.map((question) => {
        if (question.questionType === "imageChoice") {
          question.options = question.options?.map((option) => {
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
    const uploadedImageIDs = {};

    const existingImages = {};
    const existingImageIDs = {};

    existingSurveyData.questions?.forEach((question) => {
      if (question.questionType === "imageChoice") {
        question.options.forEach((option) => {
          if (option.image && option.image.imageId) {
            existingImages[option.image.imageId] = option.image.imageUrl;
            existingImageIDs[option.image.imageId] = option.image.imageId;
          }
        });
      }
    });

    if (req.files.length > 0) {
      const uploadPromises = req.files.map(async (file, index) => {
        const imageObj = await uploadImageToS3(file);
        uploadedImageIDs[index] = imageObj.imageId;
        uploadedImages[imageObj.imageId] = imageObj.imageUrl;
      });

      await Promise.all(uploadPromises);
    }

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

    if (req.files.length > 0 && req.files[0].fieldname === "coverImage") {
      existingSurveyData.coverImage = {
        imageUrl: uploadedImages[uploadedImageIDs[0]],
        imageId: uploadedImageIDs[0],
      };
    }

    let imageOptionIndex =
      (req.files[0] && req.files[0].fieldname) === "coverImage" ? "1" : "0";

    existingSurveyData.questions?.forEach((question, index) => {
      if (question.questionType === "imageChoice") {
        const questionIndex = index;

        question.options.forEach((option) => {
          const existingImageCounts = Object.values(existingImages).length;
          const newUploadImageCounts = req.files.length;

          if (newUploadImageCounts) {
            for (
              let sequence = existingImageCounts;
              sequence < existingImageCounts + newUploadImageCounts;
              sequence++
            ) {
              const uploadedImage =
                uploadedImages[uploadedImageIDs[imageOptionIndex]];

              const newOptions = {
                optionId: option.optionId,
                image: option.image,
                _id: option._id,
              };

              if (uploadedImage) {
                newOptions.image = {
                  imageUrl: uploadedImages[uploadedImageIDs[imageOptionIndex]],
                  imageId: uploadedImageIDs[imageOptionIndex],
                };

                imageOptionIndex++;
              }

              existingSurveyData.questions[questionIndex].options.push(
                newOptions,
              );
            }
          }
        });
      }
    });

    await existingSurveyData.save();

    const surveyUrl = `${process.env.CLIENT_URL}/form/${surveyid}`;
    res
      .status(200)
      .json({ success: true, message: "설문 수정 성공", url: surveyUrl });
  } catch (error) {
    error.message = errors.INTERNAL_SERVER_ERROR.message;
    error.status = errors.INTERNAL_SERVER_ERROR.status;
    next(error);
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

    await Survey.findByIdAndDelete(surveyid);

    res.status(200).json({ success: true });
  } catch (error) {
    error.message = errors.INTERNAL_SERVER_ERROR.message;
    error.status = errors.INTERNAL_SERVER_ERROR.status;
  }
};
