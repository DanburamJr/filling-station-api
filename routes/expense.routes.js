import express from "express";
import { body, param, query } from "express-validator";

import {
  createExpense,
  listExpenses,
  updateExpense,
  deleteExpense
} from "../controllers/expense.controller.js";

import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { USER_ROLES } from "../utils/constants.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.ATTENDANT),
  [
    body("stationId").isUUID(),
    body("addedBy").optional().isUUID(),
    body("expenseDate").optional().isDate(),
    body("category").notEmpty(),
    body("description").optional().isString(),
    body("amount").isFloat({ min: 0 })
  ],
  validateRequest,
  createExpense
);

router.get(
  "/",
  [query("stationId").optional().isUUID(), query("expenseDate").optional().isDate()],
  validateRequest,
  listExpenses
);

router.patch(
  "/:id",
  authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  [param("id").isUUID(), body("amount").optional().isFloat({ min: 0 })],
  validateRequest,
  updateExpense
);

router.delete(
  "/:id",
  authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  [param("id").isUUID()],
  validateRequest,
  deleteExpense
);

export default router;