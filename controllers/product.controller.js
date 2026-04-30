import { Product } from "../models/index.js";
import ApiError from "../utils/api-error.js";
import catchAsync from "../utils/catch-async.js";

const createProduct = catchAsync(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

const getProducts = catchAsync(async (req, res) => {
  const where = {};
  if (req.query.stationId) where.stationId = req.query.stationId;

  const products = await Product.findAll({
    where,
    order: [["name", "ASC"]]
  });
  res.status(200).json({ success: true, data: products });
});

const updateProduct = catchAsync(async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");
  await product.update(req.body);
  res.status(200).json({ success: true, data: product });
});

const deleteProduct = catchAsync(async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");
  await product.destroy();
  res.status(200).json({ success: true, message: "Product deleted successfully" });
});

export {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
};
