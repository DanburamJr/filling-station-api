import express from "express";
import { body } from "express-validator";

import { register, login, me } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { USER_ROLES } from "../utils/constants.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("fullName").trim().notEmpty().withMessage("fullName is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 chars"),
    body("role").optional().isIn(Object.values(USER_ROLES)),
    body("stationId").optional().isUUID()
  ],
  validateRequest,
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  validateRequest,
  login
);

router.get("/me", authenticate, me);

export default router;