const Todo = require("../model/todo_model.js");
const catchAsync = require("./../utils/catchAsync.js");

exports.getAllTodoList = catchAsync(async (req, res, next) => {
  const fetchedTodo = await Todo.find();

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
  const newTodo = await Todo.create(req.body);
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
  res.status(200).json({
    status: "success",
    data: { todo },
  });
});

exports.deleteTodo = catchAsync(async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "Deleted Successfully",
  });
});
