import { Sale, Product, Station } from "../models/index.js";
import catchAsync from "../utils/catch-async.js";

const getSales = catchAsync(async (req, res) => {
  const where = {};
  if (req.query.stationId) where.stationId = req.query.stationId;
  if (req.query.saleDate) where.saleDate = req.query.saleDate;

  const sales = await Sale.findAll({
    where,
    include: [
      { model: Product, as: "product" },
      { model: Station, as: "station" }
    ],
    order: [["saleDate", "DESC"], ["createdAt", "DESC"]]
  });

  res.status(200).json({ success: true, data: sales });
});

export {
  getSales
};
