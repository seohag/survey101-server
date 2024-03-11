const mongoose = require("mongoose");

async function mongooseLoader() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "survey101",
    });
    console.log("데이터베이스 연결 성공");
  } catch (error) {
    console.error(error);
  }
}

module.exports = mongooseLoader;
