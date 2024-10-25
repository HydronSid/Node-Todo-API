const Todo = require("../model/todoModel.js");
const catchAsync = require("./../utils/catchAsync.js");
const User = require("../model/userModel.js");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const findUserByToken = async (req) => {
  token = req.headers.authorization.split(" ")[1];
  console.log(token);
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  return await User.findById(decoded.id);
};

exports.getAllTodoList = catchAsync(async (req, res, next) => {
  const fetchedTodo = await Todo.find();

  const usersResponse = fetchedTodo.map((todo) => {
    const userObj = todo.toObject();
    delete userObj.created_by;
    return userObj;
  });

  res.status(200).json({
    status: "success",
    results: usersResponse.length,
    data: usersResponse,
  });
});

exports.getAllTodosByUserId = catchAsync(async (req, res, next) => {
  var user = await findUserByToken(req);

  const fetchedTodo = await Todo.find({ created_by: user._id });

  res.status(200).json({
    status: "success",
    results: fetchedTodo.length,
    data: fetchedTodo,
  });
});

exports.getAllTodoById = catchAsync(async (req, res, next) => {
  const todo = await Todo.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: { todo },
  });
});

exports.createTodo = catchAsync(async (req, res, next) => {
  const { title, description } = req.body;

  var user = await findUserByToken(req);

  const newTodo = await Todo.create({
    title: title,
    description: description,
    created_by: user._id,
  });

  res.status(201).json({
    status: "success",
    data: {
      todo: newTodo,
    },
  });
});

exports.updateTodo = catchAsync(async (req, res, next) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!todo) {
    return next(new AppError("No Todo found with Id", "404"));
  }
  res.status(200).json({
    status: "success",
    data: { todo },
  });
});

exports.deleteTodo = catchAsync(async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);

  if (!todo) {
    return next(new AppError("No Todo found with Id", "404"));
  }
  res.status(204).json({
    status: "Deleted Successfully",
  });
});
