const { v4: uuidv4 } = require("uuid");

const {
  getS3Client,
  getGetObjectCommand,
  getDeleteObjectCommand,
  getPutObjectCommand,
} = require("../config/s3Config");

const User = require("../models/User");
const Survey = require("../models/Survey");

const errors = require("../constants/error");

async function uploadImageToS3(file) {
  const s3Client = getS3Client();
  const uniqueFilename = uuidv4();
  const bucketName = process.env.AWS_BUCKET_NAME;
  const putObjectCommand = getPutObjectCommand(
    bucketName,
    uniqueFilename,
    file.buffer,
  );

  try {
    await s3Client.send(putObjectCommand);
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFilename}`;

    return imageUrl;
  } catch (error) {
    console.error("Error uploading image to S3:", error);
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

    if (!user) {
      const error = new Error(errors.NOT_AUTHORIZED);
      error.status = errors.NOT_AUTHORIZED;

      next(error);
    }

    const targetSurvey = await Survey.findById(surveyid).populate("creator");

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

    const uploadPromises = req.files.map(async (file, index) => {
      const url = await uploadImageToS3(file);
      console.log(url);

      uploadedImages[index] = url;
    });

    await Promise.all(uploadPromises);

    let imageIndex = 0;

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
      coverImage:
        survey.coverImage !== null ? uploadedImages[imageIndex] : null,
      questions: survey.questions?.map((question) => {
        if (question.questionType === "imageChoice") {
          question.options = question.options.map((option) => {
            option.image = uploadedImages[imageIndex];

            imageIndex++;
            return option;
          });
        }

        return question;
      }),
    });

    const surveyId = newSurvey._id;
    const surveyUrl = `http://localhost:5173/form/${surveyId}`;

    await newSurvey.save();

    res
      .status(201)
      .json({ success: true, message: "설문 생성 성공", url: surveyUrl });
  } catch (error) {
    error.message = errors.INTERNAL_SERVER_ERROR.message;
    error.status = errors.INTERNAL_SERVER_ERROR.status;
  }
};
