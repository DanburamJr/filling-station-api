import express from "express";
import { body, param } from "express-validator";

import {
  createStation,
  getStations,
  getStationById,
  updateStation,
  deleteStation
} from "../controllers/station.controller.js";

import { authenticate, authorize } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { USER_ROLES } from "../utils/constants.js";

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  authorize(USER_ROLES.ADMIN),
  [
    body("name").notEmpty(),
    body("location").notEmpty(),
    body("managerId").optional().isUUID()
  ],
  validateRequest,
  createStation
);

router.get("/", getStations);

router.get("/:id", [param("id").isUUID()], validateRequest, getStationById);

router.patch(
  "/:id",
  authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER),
  [param("id").isUUID(), body("managerId").optional().isUUID()],
  validateRequest,
  updateStation
);

router.delete(
  "/:id",
  authorize(USER_ROLES.ADMIN),
  [param("id").isUUID()],
  validateRequest,
  deleteStation
);

export default router;