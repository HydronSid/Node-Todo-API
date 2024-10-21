const catchAsync = require("./../utils/catchAsync.js");
const User = require("../model/userModel.js");
const AppError = require("../utils/appError.js");

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // ! 1) Check if email and passsword exist.
  if (!email || !password) {
    return next(new AppError("Please provide email and password.", 400));
  }

  // ! 2) Check if users exist and passsword is incorrect.
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect Email or password", 401));
  }

  user.password = undefined;
  res.status(200).json({
    status: "Success",
    user: user,
  });
});
