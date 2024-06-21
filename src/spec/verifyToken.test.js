const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const {
  generateAccessToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require("../utils/jwtUtils");

const User = require("../models/User");
const errors = require("../constants/error");
const verifyToken = require("../middlewares/verifyToken");

jest.mock("jsonwebtoken");
jest.mock("../utils/jwtUtils");
jest.mock("../models/User");
jest.mock("http-errors");

describe("verifyToken 미들웨어 테스트", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      cookies: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("accessToken이 없을 때 401 에러 반환", async () => {
    await verifyToken(req, res, next);

    expect(next).toHaveBeenCalledWith(
      createError(401, errors.NOT_AUTHORIZED.message),
    );
  });

  it("데이터베이스 오류 발생 시 500 에러 반환", async () => {
    req.cookies.accessToken = "validAccessToken";
    const decodedToken = { userId: "testUserId" };
    jwt.decode.mockReturnValue(decodedToken);
    verifyAccessToken.mockReturnValue({
      isValidate: true,
      userId: decodedToken.userId,
    });
    User.findById.mockImplementation(() => {
      throw new Error("Database error");
    });

    await verifyToken(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: errors.NOT_AUTHORIZED.message,
        status: errors.INTERNAL_SERVER_ERROR.status,
      }),
    );
  });
});
