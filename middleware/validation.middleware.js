import { validationResult } from "express-validator";
import ApiError from "../utils/api-error.js";

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ApiError(
        400,
        "Input validation failed",
        errors.array().map((error) => ({
          field: error.path,
          message: error.msg
        }))
      )
    );
  }

  return next();
}

export {
  validateRequest
};
