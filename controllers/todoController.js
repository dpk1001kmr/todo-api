import { asyncErroHandlerMiddleware } from "../middlewares/asyncErrorHandlerMiddleware.js";
import { Todo } from "../models/todoModel.js";
import { APIQuery } from "../utils/apiQuery.js";
import { CustomError } from "../utils/customError.js";

const getAllTodos = asyncErroHandlerMiddleware(async (req, res, next) => {
  let todos = new APIQuery(Todo.find(), req.query)
    .filter()
    .sort()
    .pagination()
    .select();

  todos = await todos.queryObject;

  res.status(200).json({
    status: "success",
    results: todos.length,
    data: {
      todos,
    },
  });
});

const getTodo = asyncErroHandlerMiddleware(async (req, res, next) => {
  const todo = await Todo.findById(req.params.id);
  if (!todo) {
    return next(
      new CustomError(404, "fail", "document not found with that id")
    );
  }
  res.status(200).json({
    status: "success",
    data: {
      todo,
    },
  });
});

const createTodo = asyncErroHandlerMiddleware(async (req, res, next) => {
  const todo = await Todo.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      todo,
    },
  });
});

const updateTodo = asyncErroHandlerMiddleware(async (req, res, next) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!todo) {
    return next(
      new CustomError(404, "fail", "document not found with that id")
    );
  }
  res.status(200).json({
    status: "success",
    data: {
      todo,
    },
  });
});

const deleteTodo = asyncErroHandlerMiddleware(async (req, res, next) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);
  if (!todo) {
    return next(
      new CustomError(404, "fail", "document not found with that id")
    );
  }
  res.status(204).json({
    status: "success",
    data: {
      todo,
    },
  });
});

const todoController = {
  getAllTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
};

export { todoController };
