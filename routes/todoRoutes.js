import express from "express";
import { todoController } from "../controllers/todoController.js";

const todoRouter = express.Router();

todoRouter
  .route("/")
  .get(todoController.getAllTodos)
  .post(todoController.createTodo);

todoRouter
  .route("/:id")
  .get(todoController.getTodo)
  .patch(todoController.updateTodo)
  .delete(todoController.deleteTodo);

export { todoRouter };
