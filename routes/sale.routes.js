import express from "express";
import { query } from "express-validator";

import { getSales } from "../controllers/sale.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { USER_ROLES } from "../utils/constants.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  [query("stationId").optional().isUUID(), query("saleDate").optional().isDate()],
  validateRequest,
  getSales
);

export default router;