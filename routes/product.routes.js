import express from "express";
import { body, param, query } from "express-validator";

import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller.js";

import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { USER_ROLES, FUEL_TYPES } from "../utils/constants.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  [
    body("name").isIn(Object.values(FUEL_TYPES)),
    body("unitPrice").isFloat({ min: 0 }),
    body("stationId").isUUID()
  ],
  validateRequest,
  createProduct
);

router.get("/", [query("stationId").optional().isUUID()], validateRequest, getProducts);

router.patch(
  "/:id",
  authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  [param("id").isUUID(), body("unitPrice").optional().isFloat({ min: 0 })],
  validateRequest,
  updateProduct
);

router.delete(
  "/:id",
  authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  [param("id").isUUID()],
  validateRequest,
  deleteProduct
);

export default router;