import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";

import { todoRouter } from "./routes/todoRoutes.js";
import { CustomError } from "./utils/customError.js";
import { globalErrorHandlerMiddleware } from "./middlewares/globalErrorHandlerMiddleware.js";

const app = express();

// BODY PARSER - READING DATA FROM REQUEST BODY
app.use(express.json());

// DEVELOPMENT LOGGING
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ROUTES MIDDLEWARE
app.use("/api/v1/todos", todoRouter);

// NOT FOUND MIDDLEWARE
app.all("*", (req, res, next) => {
  next(new CustomError(404, "fail", `Route ${req.originalUrl} Not Found`));
});

// GLOBAL ERROR HANDLER MIDDLEWARE
app.use(globalErrorHandlerMiddleware);

export { app };
