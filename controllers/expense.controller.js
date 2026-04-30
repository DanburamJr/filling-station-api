import { Expense } from "../models/index.js";
import ApiError from "../utils/api-error.js";
import catchAsync from "../utils/catch-async.js";

const createExpense = catchAsync(async (req, res) => {
  const expense = await Expense.create({
    ...req.body,
    addedBy: req.body.addedBy || req.user.id
  });
  res.status(201).json({ success: true, data: expense });
});

const listExpenses = catchAsync(async (req, res) => {
  const where = {};
  if (req.query.stationId) where.stationId = req.query.stationId;
  if (req.query.expenseDate) where.expenseDate = req.query.expenseDate;

  const expenses = await Expense.findAll({
    where,
    order: [["expenseDate", "DESC"], ["createdAt", "DESC"]]
  });
  res.status(200).json({ success: true, data: expenses });
});

const updateExpense = catchAsync(async (req, res) => {
  const expense = await Expense.findByPk(req.params.id);
  if (!expense) throw new ApiError(404, "Expense not found");
  await expense.update(req.body);
  res.status(200).json({ success: true, data: expense });
});

const deleteExpense = catchAsync(async (req, res) => {
  const expense = await Expense.findByPk(req.params.id);
  if (!expense) throw new ApiError(404, "Expense not found");
  await expense.destroy();
  res.status(200).json({ success: true, message: "Expense deleted successfully" });
});

export {
  createExpense,
  listExpenses,
  updateExpense,
  deleteExpense
};
