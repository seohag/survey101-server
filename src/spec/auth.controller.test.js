const request = require("supertest");
const express = require("express");
const User = require("../models/User");
const errors = require("../constants/error");
const authController = require("../controllers/auth.controller");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwtUtils");

jest.mock("../models/User");
jest.mock("../utils/jwtUtils");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/check", authController.check);
app.post("/login", authController.login);
app.post("/logout", authController.logout);

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("check", () => {
    it("유저가 인증된 경우 200 상태 코드와 유저 정보를 반환해야 합니다", async () => {
      const mockUser = { _id: "testUserId", email: "test@test.com" };
      User.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockUser),
      });

      const req = { user: mockUser._id };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await authController.check(req, res, next);

      expect(User.findById).toHaveBeenCalledWith(mockUser._id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ result: true, user: mockUser });
    });
  });

  describe("login", () => {
    it("유효한 이메일과 displayName으로 로그인 성공", async () => {
      const mockUser = {
        _id: "testUserId",
        email: "test@test.com",
        displayName: "Test User",
        save: jest.fn(),
      };
      const mockAccessToken = "mockAccessToken";
      const mockRefreshToken = "mockRefreshToken";

      User.findOne.mockResolvedValue(mockUser);
      generateAccessToken.mockReturnValue(mockAccessToken);
      generateRefreshToken.mockReturnValue(mockRefreshToken);

      const response = await request(app)
        .post("/login")
        .send({ email: "test@test.com", displayName: "Test User" });

      expect(User.findOne).toHaveBeenCalledWith({ email: "test@test.com" });
      expect(mockUser.save).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        result: true,
        message: "로그인 성공",
        user: expect.objectContaining({
          email: "test@test.com",
          displayName: "Test User",
        }),
      });
      expect(response.headers["set-cookie"]).toEqual(
        expect.arrayContaining([
          expect.stringContaining(`accessToken=${mockAccessToken}`),
          expect.stringContaining(`refreshToken=${mockRefreshToken}`),
        ]),
      );
    });
  });

  describe("logout", () => {
    test("로그아웃 요청 시 쿠키를 제거하고 성공 메시지를 반환해야 합니다", async () => {
      const response = await request(app).post("/logout").send();

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ result: true, message: "로그아웃 성공" });
      expect(response.headers["set-cookie"]).toEqual(
        expect.arrayContaining([
          expect.stringContaining("accessToken=;"),
          expect.stringContaining("refreshToken=;"),
        ]),
      );
    });

    test("로그아웃 중 오류가 발생한 경우 500 상태 코드와 오류 메시지를 반환해야 합니다", async () => {
      const mockRes = {
        clearCookie: jest.fn(() => {
          throw new Error("Clear cookie error");
        }),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const req = {};
      const next = jest.fn();

      await authController.logout(req, mockRes, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: errors.INTERNAL_SERVER_ERROR.message,
          status: errors.INTERNAL_SERVER_ERROR.status,
        }),
      );
    });
  });
});
