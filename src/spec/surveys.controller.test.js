const request = require("supertest");
const app = require("../../app");

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

const User = require("../models/User");
const Survey = require("../models/Survey");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  jest.clearAllMocks();
  await mongoose.connection.db.dropDatabase();
});

describe("GET /:userid/surveys", () => {
  it("사용자의 모든 설문지를 반환해야 합니다", async () => {
    const user = await User.create({
      username: "Test User",
      email: "test@gmail.com",
      refreshToken: "123777",
    });
    const survey1 = await Survey.create({
      title: "Survey 1",
      creator: user._id,
    });
    const survey2 = await Survey.create({
      title: "Survey 2",
      creator: user._id,
    });

    const response = await request(app).get(`/user/${user._id}/surveys`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]._id).toBe(survey1._id.toString());
    expect(response.body[1]._id).toBe(survey2._id.toString());
  });

  it("사용자가 존재하지 않으면 Unahtuorzied가 반환되야 합니다.", async () => {
    const invalidUserId = new mongoose.Types.ObjectId();

    const response = await request(app).get(`/user/${invalidUserId}/surveys`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });
});
