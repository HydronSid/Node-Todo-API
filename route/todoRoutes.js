const express = require("express");
const todoController = require("../controller/todoController.js");
const authController = require("../controller/authController.js");
const uploadMiddleware = require("../middlewares/uploadMiddleware.js");

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

router.post(
  "/upload",
  uploadMiddleware.single("file"),
  todoController.uploadTodoAttachment
);

module.exports = router;
