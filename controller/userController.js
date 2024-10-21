const catchAsync = require("./../utils/catchAsync.js");
const User = require("../model/userModel.js");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const fetchedUsers = await User.find();

  res.status(200).json({
    status: "success",
    results: fetchedUsers.length,
    data: fetchedUsers,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: { user },
  });
});
