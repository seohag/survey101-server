const User = require("../models/User");
const Survey = require("../models/Survey");

const errors = require("../constants/error");

exports.getAllSurveys = async (req, res, next) => {
  const userId = req.params.userid;

  try {
    const user = await User.findById(userId);
    const surveys = await Survey.find({ creator: userId }).populate("creator");

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
