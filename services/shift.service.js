import { Op } from "sequelize";
import { Shift, Sale, Stock, Product, sequelize } from "../models/index.js";
import ApiError from "../utils/api-error.js";

async function openShift(data) {
  const existing = await Shift.findOne({
    where: {
      stationId: data.stationId,
      productId: data.productId,
      shiftDate: data.shiftDate,
      status: "open"
    }
  });

  if (existing) {
    throw new ApiError(409, "An open shift already exists for this station/product/date");
  }

  return Shift.create(data);
}

async function closeShift(shiftId, closingStock, unitPrice) {
  return sequelize.transaction(async (transaction) => {
    const shift = await Shift.findByPk(shiftId, { transaction });
    if (!shift) {
      throw new ApiError(404, "Shift not found");
    }
    if (shift.status === "closed") {
      throw new ApiError(400, "Shift is already closed");
    }

    const opening = Number(shift.openingStock);
    const closing = Number(closingStock);
    if (closing > opening) {
      throw new ApiError(400, "Closing stock cannot be greater than opening stock");
    }

    const fuelSold = opening - closing;
    shift.closingStock = closing;
    shift.fuelSold = fuelSold;
    shift.status = "closed";
    await shift.save({ transaction });

    const product = await Product.findByPk(shift.productId, { transaction });
    const appliedUnitPrice = unitPrice ?? product?.unitPrice;
    if (!appliedUnitPrice) {
      throw new ApiError(400, "Unit price is required for sale generation");
    }

    await Sale.create(
      {
        stationId: shift.stationId,
        productId: shift.productId,
        shiftId: shift.id,
        litersSold: fuelSold,
        unitPrice: Number(appliedUnitPrice),
        totalAmount: fuelSold * Number(appliedUnitPrice),
        saleDate: shift.shiftDate
      },
      { transaction }
    );

    await Stock.upsert(
      {
        stationId: shift.stationId,
        productId: shift.productId,
        stockDate: shift.shiftDate,
        quantity: closing
      },
      { transaction }
    );

    return shift;
  });
}

async function getShifts(filters) {
  const where = {};
  if (filters.stationId) where.stationId = filters.stationId;
  if (filters.productId) where.productId = filters.productId;
  if (filters.status) where.status = filters.status;
  if (filters.fromDate && filters.toDate) {
    where.shiftDate = { [Op.between]: [filters.fromDate, filters.toDate] };
  }

  return Shift.findAll({
    where,
    order: [["shiftDate", "DESC"], ["createdAt", "DESC"]]
  });
}

export {
  openShift,
  closeShift,
  getShifts
};
