import { CustomError } from "../utils/customError.js";

const sendErrorInDevelopment = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorInProduction = (err, res) => {
  // OPERATIONAL ERROR
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    // PROGRAMMING OR UNKNOWN ERROR
  } else {
    // LOG ERROR TO THE CONSOLE
    console.log("👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹");
    console.log("Error: ", err);
    console.log("👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹👹");
    // SEND GENERIC ERROR TO THE CLIENT
    res.status(500).json({
      status: "error",
      message: "internal server error",
    });
  }
};

const globalErrorHandlerMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.message = err.message || "internal server error";

  if (process.env.NODE_ENV === "development") {
    sendErrorInDevelopment(err, res);
  } else if (process.env.NODE_ENV === "production") {
    // HANDLE DATABASE ID CAST ERROR
    // FOR EXAMPLE /api/v1/todos/abc (HERE "abc" WILL NOT BE TYPE CASTED TO VALID DATABASE ID)
    if (err.name === "CastError") {
      return sendErrorInProduction(
        new CustomError(400, err.status, `Invalid ${err.path}: ${err.value}.`),
        res
      );
    }

    // HANDLE DATABASE VALIDATION ERROR
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors)
        .map((el) => el.message)
        .join(". ");

      return sendErrorInProduction(
        new CustomError(400, err.status, `Invalid input data. ${errors}`),
        res
      );
    }

    // HANDLE DUPLICATE DATABASE VALUE
    if (err.code === 11000) {
      const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
      return sendErrorInProduction(
        new CustomError(
          400,
          err.status,
          `Duplicate field value: ${value}. Please use another value!`
        ),
        res
      );
    }
    // HANDLE OTHER ERRORS
    sendErrorInProduction(err, res);
  }
};

export { globalErrorHandlerMiddleware };
