import { User } from "../models/index.js";
import { registerUser, loginUser } from "../services/auth.service.js";
import catchAsync from "../utils/catch-async.js";

const register = catchAsync(async (req, res) => {
  const result = await registerUser(req.body);
  res.status(201).json({ success: true, data: result });
});

const login = catchAsync(async (req, res) => {
  const result = await loginUser(req.body.email, req.body.password);
  res.status(200).json({ success: true, data: result });
});

const me = catchAsync(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ["password"] }
  });
  res.status(200).json({ success: true, data: user });
});

export {
  register,
  login,
  me
};
