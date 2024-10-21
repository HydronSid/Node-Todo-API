const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const todoRouter = require("./route/todoRoutes.js");
const userRouter = require("./route/userRoutes.js");
const AppError = require("./utils/appError.js");
const globalErrorHandler = require("./controller/errorController.js");

const app = express();

// ! Set Security HTTP Header
app.use(helmet());

//! Development login
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ! Limits,s requestes from same API
const limiter = rateLimit({
  max: 100,
  windowS: 60 * 60 * 1000,
  message: "To many requests from this IP.",
});

app.use("/api", limiter);

app.use(express.json());

app.use("/api/v1/todo/", todoRouter);
app.use("/api/v1/users/", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
