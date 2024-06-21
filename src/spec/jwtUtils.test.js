const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require("../utils/jwtUtils");
const CONFIG = require("../config/index");
const errors = require("../constants/error");

jest.mock("jsonwebtoken");
jest.mock("../models/User");

describe("JWT Utils 테스트", () => {
  const mockUser = { _id: "testUserId", refreshToken: "mockRefreshToken" };
  const accessToken = "mockAccessToken";
  const refreshToken = "mockRefreshToken";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateAccessToken", () => {
    it("access token을 생성해야 합니다", () => {
      jwt.sign.mockReturnValue(accessToken);

      const token = generateAccessToken(mockUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUser._id },
        CONFIG.SECRET_KEY,
        { expiresIn: "2h" },
      );
      expect(token).toBe(accessToken);
    });
  });

  describe("generateRefreshToken", () => {
    it("refresh token을 생성해야 합니다", () => {
      jwt.sign.mockReturnValue(refreshToken);

      const token = generateRefreshToken(mockUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUser._id },
        CONFIG.SECRET_KEY,
        { expiresIn: "2w" },
      );
      expect(token).toBe(refreshToken);
    });
  });

  describe("verifyAccessToken", () => {
    it("유효한 access token을 검증해야 합니다", () => {
      jwt.verify.mockReturnValue({ userId: mockUser._id });

      const result = verifyAccessToken(accessToken);

      expect(jwt.verify).toHaveBeenCalledWith(accessToken, CONFIG.SECRET_KEY);
      expect(result).toEqual({ isValidate: true, userId: mockUser._id });
    });

    it("유효하지 않은 access token을 검증해야 합니다", () => {
      const errorMessage = "Invalid token";
      jwt.verify.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      const result = verifyAccessToken("invalidToken");

      expect(jwt.verify).toHaveBeenCalledWith(
        "invalidToken",
        CONFIG.SECRET_KEY,
      );
      expect(result).toEqual({ isValidate: false, message: errorMessage });
    });
  });

  describe("verifyRefreshToken", () => {
    it("유효한 refresh token을 검증해야 합니다", async () => {
      User.findById.mockResolvedValue(mockUser);
      jwt.verify.mockReturnValue({ userId: mockUser._id });

      const next = jest.fn();
      const result = await verifyRefreshToken(refreshToken, mockUser._id, next);

      expect(User.findById).toHaveBeenCalledWith(mockUser._id);
      expect(jwt.verify).toHaveBeenCalledWith(refreshToken, CONFIG.SECRET_KEY);
      expect(result).toBe(true);
    });

    it("유효하지 않은 refresh token을 검증해야 합니다", async () => {
      User.findById.mockResolvedValue(mockUser);
      jwt.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const next = jest.fn();
      const result = await verifyRefreshToken(refreshToken, mockUser._id, next);

      expect(User.findById).toHaveBeenCalledWith(mockUser._id);
      expect(jwt.verify).toHaveBeenCalledWith(refreshToken, CONFIG.SECRET_KEY);
      expect(result).toBe(false);
    });

    it("refresh token이 일치하지 않는 경우 검증 실패해야 합니다", async () => {
      User.findById.mockResolvedValue(mockUser);

      const next = jest.fn();
      const result = await verifyRefreshToken(
        "differentToken",
        mockUser._id,
        next,
      );

      expect(User.findById).toHaveBeenCalledWith(mockUser._id);
      expect(result).toBe(false);
    });

    it("User.findById에서 에러가 발생한 경우 INTERNAL_SERVER_ERROR를 반환해야 합니다", async () => {
      User.findById.mockImplementation(() => {
        throw new Error("Database error");
      });

      const next = jest.fn();
      const result = await verifyRefreshToken(refreshToken, mockUser._id, next);

      expect(User.findById).toHaveBeenCalledWith(mockUser._id);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: errors.INTERNAL_SERVER_ERROR.message,
          status: errors.INTERNAL_SERVER_ERROR.status,
        }),
      );
      expect(result).toBe(null);
    });
  });
});
