import { Shift } from "../models/index.js";
import { openShift, closeShift, getShifts } from "../services/shift.service.js";
import ApiError from "../utils/api-error.js";
import catchAsync from "../utils/catch-async.js";

const createShift = catchAsync(async (req, res) => {
  const shift = await openShift({
    ...req.body,
    attendantId: req.body.attendantId || req.user.id
  });
  res.status(201).json({ success: true, data: shift });
});

const closeShiftById = catchAsync(async (req, res) => {
  const shift = await closeShift(req.params.id, req.body.closingStock, req.body.unitPrice);
  res.status(200).json({
    success: true,
    message: "Shift closed and sale generated",
    data: shift
  });
});

const listShifts = catchAsync(async (req, res) => {
  const shifts = await getShifts(req.query);
  res.status(200).json({ success: true, data: shifts });
});

const getShiftById = catchAsync(async (req, res) => {
  const shift = await Shift.findByPk(req.params.id);
  if (!shift) throw new ApiError(404, "Shift not found");
  res.status(200).json({ success: true, data: shift });
});

export {
  createShift,
  closeShiftById,
  listShifts,
  getShiftById
};
