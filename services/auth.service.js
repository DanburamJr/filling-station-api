import { User } from "../models/index.js";
import ApiError from "../utils/api-error.js";
import { signToken } from "../utils/jwt.js";

async function registerUser(payload) {
  const existingUser = await User.findOne({ where: { email: payload.email } });
  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const user = await User.create(payload);
  const token = signToken({ userId: user.id, role: user.role });

  return {
    token,
    user
  };
}

async function loginUser(email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken({ userId: user.id, role: user.role });
  return { token, user };
}

export {
  registerUser,
  loginUser
};
