const express = require("express");
const todoController = require("../controller/todoController.js");
const authController = require("../controller/authController.js");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, todoController.getAllTodoList)
  .post(authController.protect, todoController.createTodo);

router
  .route("/:id")
  .get(todoController.getAllTodoById)
  .patch(todoController.updateTodo)
  .delete(todoController.deleteTodo);

router.post("/getTodoList", todoController.getAllTodosByUserId);

module.exports = router;
