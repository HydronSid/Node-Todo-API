const express = require("express");
const todoController = require("../controller/todoController.js");

const router = express.Router();

router
  .route("/")
  .get(todoController.getAllTodoList)
  .post(todoController.createTodo);

router
  .route("/:id")
  .get(todoController.getAllTodoById)
  .patch(todoController.updateTodo)
  .delete(todoController.deleteTodo);

module.exports = router;
