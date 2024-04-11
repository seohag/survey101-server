const jwt = require("jsonwebtoken");

const createError = require("http-errors");
const errors = require("../constants/error");
const {
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require("../utils/jwtUtils");

const User = require("../models/User");
const { TWO_HOUR_IN_MILLISECONDS } = require("../constants/jwtContants");

async function verifyToken(req, res, next) {
  try {
    const { accessToken } = req.cookies;

    if (accessToken) {
      const accessResult = verifyAccessToken(accessToken);
      const decodedToken = jwt.decode(accessToken);

      const user = await User.findById(decodedToken.userId).lean();

      const refreshResult = await verifyRefreshToken(
        user.refreshToken,
        decodedToken.userId,
      );

      if (!accessResult.type && accessResult.message === "jwt expired") {
        if (!refreshResult) {
          return next(createError(401, errors.NOT_AUTHORIZED.message));
        }

        const newAccessToken = generateAccessToken(decodedToken.userId);

        res.status(201).cookie("accessToken", newAccessToken, {
          maxAge: TWO_HOUR_IN_MILLISECONDS,
          httpOnly: true,
        });

        req.user = decodedToken.userId;

        return next();
      }
      req.user = decodedToken.userId;

      return next();
    }

    return next(createError(401, errors.NOT_AUTHORIZED.message));
  } catch (error) {
    error.message = errors.NOT_AUTHORIZED.message;
    error.status = errors.INTERNAL_SERVER_ERROR.status;

    return next(error);
  }
}

module.exports = verifyToken;
