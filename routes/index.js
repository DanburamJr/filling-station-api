import express from "express";

import authRoutes from "./auth.routes.js";
import stationRoutes from "./station.routes.js";
import productRoutes from "./product.routes.js";
import shiftRoutes from "./shift.routes.js";
import saleRoutes from "./sale.routes.js";
import expenseRoutes from "./expense.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/stations", stationRoutes);
router.use("/products", productRoutes);
router.use("/shifts", shiftRoutes);
router.use("/sales", saleRoutes);
router.use("/expenses", expenseRoutes);

export default router;