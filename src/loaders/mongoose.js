const mongoose = require("mongoose");
const CONFIG = require("../config/index");

async function mongooseLoader() {
  try {
    await mongoose.connect(CONFIG.MONGO_URL, {
      dbName: "survey101",
    });
    console.log("데이터베이스 연결 성공");
  } catch (error) {
    console.error(error);
  }
}

module.exports = mongooseLoader;
