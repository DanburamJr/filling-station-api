import { ValidationError } from "sequelize";
import ApiError from "../utils/api-error.js";

function notFoundHandler(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let details = err.details || null;

  if (err instanceof ValidationError) {
    statusCode = 400;
    message = "Validation failed";
    details = err.errors.map((e) => ({ field: e.path, message: e.message }));
  }

  res.status(statusCode).json({
    success: false,
    message,
    details,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
  });
}

export {
  notFoundHandler,
  errorHandler
};
