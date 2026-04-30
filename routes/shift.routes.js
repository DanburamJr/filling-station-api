import express from "express";
import { body, param, query } from "express-validator";

import {
  createShift,
  closeShiftById,
  listShifts,
  getShiftById
} from "../controllers/shift.controller.js";

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
    body("productId").isUUID(),
    body("attendantId").optional().isUUID(),
    body("shiftDate").optional().isDate(),
    body("openingStock").isFloat({ min: 0 })
  ],
  validateRequest,
  createShift
);

router.patch(
  "/:id/close",
  authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.ATTENDANT),
  [
    param("id").isUUID(),
    body("closingStock").isFloat({ min: 0 }),
    body("unitPrice").optional().isFloat({ min: 0 })
  ],
  validateRequest,
  closeShiftById
);

router.get(
  "/",
  [
    query("stationId").optional().isUUID(),
    query("productId").optional().isUUID(),
    query("status").optional().isIn(["open", "closed"]),
    query("fromDate").optional().isDate(),
    query("toDate").optional().isDate()
  ],
  validateRequest,
  listShifts
);

router.get("/:id", [param("id").isUUID()], validateRequest, getShiftById);

export default router;