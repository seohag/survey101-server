const indexRouter = require("../routes/index");
const authRouter = require("../routes/auth");
const userRouter = require("../routes/user");

async function routerLoader(app) {
  app.use("/", indexRouter);
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
}

module.exports = routerLoader;
