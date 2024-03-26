const indexRouter = require("../routes/index");
const authRouter = require("../routes/auth");
const userRouter = require("../routes/user");
const responseRouter = require("../routes/response");

async function routerLoader(app) {
  app.use("/", indexRouter);
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/", responseRouter);
}

module.exports = routerLoader;
