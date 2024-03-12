require("dotenv").config();

const CONFIG = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  CLIENT_URL: process.env.CLIENT_URL,
  SECRET_KEY: process.env.SECRET_KEY,
};

module.exports = CONFIG;
