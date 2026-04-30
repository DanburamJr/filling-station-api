import { Station, User } from "../models/index.js";
import ApiError from "../utils/api-error.js";
import catchAsync from "../utils/catch-async.js";

const createStation = catchAsync(async (req, res) => {
  const station = await Station.create(req.body);
  res.status(201).json({ success: true, data: station });
});

const getStations = catchAsync(async (req, res) => {
  const stations = await Station.findAll({
    include: [{ model: User, as: "manager", attributes: { exclude: ["password"] } }]
  });
  res.status(200).json({ success: true, data: stations });
});

const getStationById = catchAsync(async (req, res) => {
  const station = await Station.findByPk(req.params.id, {
    include: [{ model: User, as: "manager", attributes: { exclude: ["password"] } }]
  });
  if (!station) throw new ApiError(404, "Station not found");
  res.status(200).json({ success: true, data: station });
});

const updateStation = catchAsync(async (req, res) => {
  const station = await Station.findByPk(req.params.id);
  if (!station) throw new ApiError(404, "Station not found");
  await station.update(req.body);
  res.status(200).json({ success: true, data: station });
});

const deleteStation = catchAsync(async (req, res) => {
  const station = await Station.findByPk(req.params.id);
  if (!station) throw new ApiError(404, "Station not found");
  await station.destroy();
  res.status(200).json({ success: true, message: "Station deleted successfully" });
});

export {
  createStation,
  getStations,
  getStationById,
  updateStation,
  deleteStation
};
