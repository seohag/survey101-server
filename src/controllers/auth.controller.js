const User = require("../models/User");
const errors = require("../constants/error");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwtUtils");

const { TWO_HOUR_IN_MILLISECONDS } = require("../constants/jwtContants");

exports.check = async function (req, res, next) {
  if (!req.user) {
    const error = new Error(errors.NOT_AUTHORIZED.message);
    error.status = errors.NOT_AUTHORIZED.status;

    next(error);
  }

  const user = await User.findById(req.user).lean();
  res.status(200).json({ result: true, user });
};

exports.login = async function (req, res, next) {
  const { email, displayName } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        displayName,
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;

    await user.save();

    res
      .status(201)
      .cookie("accessToken", accessToken, {
        maxAge: TWO_HOUR_IN_MILLISECONDS,
        httpOnly: true,
      })
      .cookie("refreshToken", refreshToken, {
        maxAge: TWO_HOUR_IN_MILLISECONDS,
        httpOnly: true,
      })
      .json({ result: true, message: "로그인 성공", user });
  } catch (error) {
    error.message = errors.NOT_AUTHORIZED.message;
    error.status = errors.INTERNAL_SERVER_ERROR.status;

    next(error);
  }
};

exports.logout = async function (req, res, next) {
  try {
    res.clearCookie("accessToken", { httpOnly: true });
    res.clearCookie("refreshToken", { httpOnly: true });
    res.json({ result: true, message: "로그아웃 성공" });
  } catch (error) {
    error.message = errors.INTERNAL_SERVER_ERROR.message;
    error.status = errors.INTERNAL_SERVER_ERROR.status;

    next(error);
  }
};
